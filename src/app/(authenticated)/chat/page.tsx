'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { format, subDays } from 'date-fns';
import { 
  Send, 
  Check, 
  X, 
  Sparkles, 
  Calculator, 
  Tag as TagIcon,
  Calendar as CalendarIcon,
  Package
} from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'bot';
  content: string;
  timestamp: Date;
  data?: any;
  type?: 'chat' | 'transaction_confirm' | 'success';
}

export default function ChatPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'bot',
      content: 'Hello! I am your easyKhata assistant. Tell me about your income or expenses, and I will track them for you. \n\nExample: "spent 500 on dinner yesterday"',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [company, setCompany] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [pendingTransaction, setPendingTransaction] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      fetchCompany();
    }
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchCompany = async () => {
    const { data: membership } = await supabase
      .from('company_members')
      .select('company_id, companies(*)')
      .eq('user_id', user?.id)
      .single();
    
    if (membership) {
      setCompany(membership.companies);
      fetchCategories(membership.company_id);
    }
  };

  const fetchCategories = async (companyId: string) => {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .eq('company_id', companyId);
    if (data) setCategories(data);
  };

  const parseMessage = (text: string) => {
    const lowerText = text.toLowerCase();
    
    // 1. Better Amount Detection
    const pricePatterns = [
      /(?:at|for|rs|npr|usd|inr|@)\s*(\d+(?:\.\d+)?)/i,
      /(\d+(?:\.\d+)?)\s*(?:rs|npr|usd|inr)/i,
      /(?:^|\s)\$(\d+(?:\.\d+)?)/i
    ];

    let foundAmount = 0;
    for (const pattern of pricePatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        foundAmount = parseFloat(match[1]);
        break;
      }
    }

    // 2. Quantity Detection
    let foundQuantity = 1;
    const allNumbersMatch = Array.from(text.matchAll(/\d+(?:\.\d+)?/g));
    
    if (allNumbersMatch.length > 1) {
      for (const match of allNumbersMatch) {
         const val = parseFloat(match[0]);
         if (val !== foundAmount) {
            foundQuantity = val;
            break;
         }
      }
    } else if (allNumbersMatch.length === 1 && foundAmount === 0) {
      foundAmount = parseFloat(allNumbersMatch[0][0]);
    }

    if (foundAmount === 0 && allNumbersMatch.length > 1) {
       const numbers = allNumbersMatch.map(m => parseFloat(m[0]));
       foundAmount = Math.max(...numbers);
       foundQuantity = Math.min(...numbers);
    }

    // 3. Type Detection
    let type: 'income' | 'expense' = 'expense';
    if (
      lowerText.includes('received') || 
      lowerText.includes('income') || 
      lowerText.includes('sold') || 
      lowerText.includes('profit') ||
      lowerText.includes('earned') ||
      lowerText.includes('plus') ||
      lowerText.includes('salary') ||
      lowerText.includes('sales')
    ) {
      type = 'income';
    }

    // 4. Smart Date Detection
    let date = format(new Date(), 'yyyy-MM-dd');
    const now = new Date();
    
    if (lowerText.includes('yesterday')) {
      date = format(subDays(now, 1), 'yyyy-MM-dd');
    } else if (lowerText.includes('day before yesterday')) {
      date = format(subDays(now, 2), 'yyyy-MM-dd');
    } else if (lowerText.includes('last month')) {
      date = format(subDays(now, 30), 'yyyy-MM-dd');
    } else if (lowerText.includes('last week')) {
      date = format(subDays(now, 7), 'yyyy-MM-dd');
    }

    // 5. Category Matching
    let category = categories.find(c => 
      lowerText.includes(c.name.toLowerCase())
    );

    if (!category) {
      const keywordMap: Record<string, string> = {
        'taxi': 'Travel', 'bus': 'Travel', 'fuel': 'Travel', 'petrol': 'Travel', 'ride': 'Travel', 'uber': 'Travel', 'pathao': 'Travel',
        'food': 'Meals', 'dinner': 'Meals', 'lunch': 'Meals', 'breakfast': 'Meals', 'khaja': 'Meals', 'restaurant': 'Meals', 'momo': 'Meals', 'burger': 'Meals', 'chicken': 'Meals', 'candle': 'Supplies',
        'rent': 'Housing', 'electricity': 'Utilities', 'water': 'Utilities', 'internet': 'Utilities', 'wifi': 'Utilities',
        'salary': 'Salary', 'sold': 'Sales', 'sale': 'Sales', 'bonus': 'Bonus'
      };

      for (const [kw, catName] of Object.entries(keywordMap)) {
        if (lowerText.includes(kw)) {
          category = categories.find(c => c.name === catName);
          if (category) break;
        }
      }
    }

    // 6. Unit Price Logic
    if (lowerText.includes('each') || lowerText.includes('/')) {
       foundAmount = foundAmount * foundQuantity;
    }

    const potentialCategoryName = (!category && text.split(' ').length > 0) ? text.split(' ')[0] : null;

    return {
      amount: foundAmount,
      quantity: foundQuantity,
      type,
      date,
      categoryId: category?.id || null,
      categoryName: category?.name || 'Other',
      potentialCategoryName: potentialCategoryName,
      note: text.replace(/\d+/g, '').replace(/spent|received|income|expense|yesterday|today|day before|at|for|last|month|week|each/gi, '').trim()
    };
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');

    if (pendingTransaction) {
      const amountMatch = input.match(/\d+(\.\d+)?/);
      if (amountMatch) {
         const newAmount = parseFloat(amountMatch[0]);
         const updatedData = { ...pendingTransaction, amount: newAmount };
         
         const botMsg: Message = {
           id: (Date.now() + 1).toString(),
           role: 'bot',
           content: `Got it! I've updated the amount. Does this look correct now?`,
           timestamp: new Date(),
           type: 'transaction_confirm',
           data: updatedData
         };
         
         setPendingTransaction(null);
         setTimeout(() => setMessages(prev => [...prev, botMsg]), 500);
         return;
      }
    }

    const parsedData = parseMessage(input);

    if (parsedData.amount > 0) {
      const article = parsedData.type === 'income' ? 'an' : 'a';
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: `I parsed ${article} ${parsedData.type}. Does this look correct?`,
        timestamp: new Date(),
        type: 'transaction_confirm',
        data: parsedData
      };

      setTimeout(() => {
        setMessages(prev => [...prev, botMsg]);
      }, 500);
    } else {
      setPendingTransaction(parsedData);
      const question = parsedData.type === 'income' 
        ? "How much did you sell it at?" 
        : "How much did you spend?";
        
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: `I found a ${parsedData.type}, but I didn't see an amount. ${question}`,
        timestamp: new Date()
      };
      setTimeout(() => setMessages(prev => [...prev, botMsg]), 500);
    }
  };

  const confirmTransaction = async (data: any, msgId: string) => {
    if (!company) return;

    const { error } = await supabase
      .from('transactions')
      .insert({
        company_id: company.id,
        user_id: user?.id,
        category_id: data.categoryId,
        note: data.note,
        amount: data.amount,
        quantity: data.quantity || 1,
        type: data.type,
        date: data.date
      });

    if (error) {
      console.error('Transaction Error:', error);
      alert(`Error saving transaction: ${error.message}`);
      return;
    }

    setMessages(prev => prev.map(m => 
      m.id === msgId ? { ...m, type: 'success', content: `✅ ${data.type.charAt(0).toUpperCase() + data.type.slice(1)} saved successfully!` } : m
    ));
  };

  const createCategory = async (name: string, type: 'income' | 'expense', msgId: string) => {
    if (!company) return;

    const { data: newCat, error } = await supabase
      .from('categories')
      .insert({
        company_id: company.id,
        name: name,
        type: type,
        color: type === 'income' ? '#10b981' : '#f43f5e'
      })
      .select()
      .single();

    if (error) {
      console.error('Category Creation Error:', error);
      alert(`Error creating category: ${error.message}`);
      return;
    }

    setCategories(prev => [...prev, newCat]);
    setMessages(prev => prev.map(m => 
      m.id === msgId ? { ...m, data: { ...m.data, categoryId: newCat.id, categoryName: newCat.name } } : m
    ));
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-2xl mx-auto rounded-[2.5rem] bg-white/[0.02] border border-white/5 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] overflow-hidden relative backdrop-blur-md">
      <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
        {messages.length <= 1 ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-3 opacity-0 animate-in fade-in duration-1000 fill-mode-forwards">
            <h2 className="text-2xl font-medium tracking-tight text-white/90">Start tracking your business</h2>
            <p className="text-sm text-white/30 max-w-[240px]">Type your first transaction below to see the magic happen.</p>
            <div className="pt-4 px-4 py-2 bg-white/5 rounded-full border border-white/5 text-[10px] font-medium text-white/20 uppercase tracking-widest">
              Example: "Taxi 2000 yesterday"
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={cn(
              "flex flex-col scale-in",
              msg.role === 'user' ? "items-end" : "items-start"
            )}>
              <div className={cn(
                "max-w-[85%] px-5 py-3.5 rounded-2xl text-[15px] leading-relaxed shadow-sm transition-all",
                msg.role === 'user' 
                  ? "bg-blue-600 text-white rounded-tr-none" 
                  : "bg-gradient-to-b from-white/[0.06] to-white/[0.02] text-white/70 rounded-tl-none border border-white/[0.05]"
              )}>
                {msg.content}
              </div>
              
              {msg.type === 'transaction_confirm' && (
                <div className="mt-4 p-6 bg-white/[0.02] rounded-[2rem] border border-white/10 w-full max-w-[95%] space-y-6 shadow-2xl backdrop-blur-xl relative overflow-hidden group">
                  <div className={cn(
                    "absolute top-0 right-0 w-32 h-32 blur-[80px] -mr-16 -mt-16 opacity-20",
                    msg.data.type === 'income' ? "bg-green-500" : "bg-red-500"
                  )} />

                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center ring-1 ring-white/20 shadow-inner group-hover:rotate-12 group-hover:scale-110 transition-all duration-700">
                        <Sparkles className="w-6 h-6 text-blue-400" />
                      </div>
                      <div>
                        <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] block leading-none mb-2">Smart Discovery</span>
                        <h4 className="font-black text-white tracking-[0.1em] uppercase text-sm italic">New Entry Found</h4>
                      </div>
                    </div>
                    <div className={cn(
                      "text-[10px] font-black uppercase px-4 py-1.5 rounded-xl border-2 shadow-2xl backdrop-blur-3xl",
                      msg.data.type === 'income' ? "border-green-500/40 bg-green-500/10 text-green-400" : "border-red-500/40 bg-red-500/10 text-red-400"
                    )}>
                      {msg.data.type}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-10 relative z-10 pt-4">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-white/30 text-[9px] font-black uppercase tracking-[0.2em]">
                           <Calculator className="w-3.5 h-3.5" />
                           <span>Amount</span>
                        </div>
                        {msg.data.amount > 0 ? (
                          <p className="font-black text-3xl tracking-tighter text-white leading-none">
                            {formatCurrency(msg.data.amount, company?.currency)}
                          </p>
                        ) : (
                          <p className="text-red-400 font-black text-xs uppercase italic animate-pulse">Amount not entered</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-white/30 text-[9px] font-black uppercase tracking-[0.2em]">
                           <Package className="w-3.5 h-3.5" />
                           <span>Quantity</span>
                        </div>
                        <p className="font-black text-sm text-white/80 uppercase tracking-tight">{msg.data.quantity || 1}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-white/30 text-[9px] font-black uppercase tracking-[0.2em]">
                         <TagIcon className="w-3.5 h-3.5" />
                         <span>Category</span>
                      </div>
                      {(!msg.data.categoryId || msg.data.categoryName === 'Other') ? (
                        <div className="flex flex-col gap-3">
                           <div className="flex flex-wrap gap-2">
                              {msg.data.potentialCategoryName && (
                                <button 
                                  onClick={() => createCategory(msg.data.potentialCategoryName, msg.data.type, msg.id)}
                                  className="bg-blue-500/10 border border-blue-500/30 rounded-xl py-1.5 px-3 text-[10px] font-black text-blue-400 hover:bg-blue-500/20 transition-all flex items-center gap-2"
                                >
                                  <Sparkles className="w-3 h-3" />
                                  Add "{msg.data.potentialCategoryName}"
                                </button>
                              )}
                              <select 
                                className="bg-white/5 border border-white/10 rounded-xl py-1.5 px-3 text-[10px] font-bold text-white/60 outline-none hover:bg-white/10 transition-all cursor-pointer flex-1 min-w-[120px] [&>option]:bg-[#1c1c1e] [&>option]:text-white"
                                onChange={(e) => {
                                  const cat = categories.find(c => c.id === e.target.value);
                                  if (cat) {
                                     setMessages(prev => prev.map(m => 
                                       m.id === msg.id ? { ...m, data: { ...m.data, categoryId: cat.id, categoryName: cat.name } } : m
                                     ));
                                  }
                                }}
                                value={msg.data.categoryId || ''}
                              >
                                 <option value="">Select Category...</option>
                                 {categories.filter(c => c.type === msg.data.type || !c.type).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                              </select>
                           </div>
                           <p className="font-bold text-[9px] text-yellow-400/60 italic leading-tight">Couldn't auto-detect category.</p>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                           <p className="font-black text-sm text-white/80 uppercase tracking-tight">{msg.data.categoryName}</p>
                           <button 
                             onClick={() => setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, data: { ...m.data, categoryId: null, categoryName: 'Other' } } : m))}
                             className="text-[8px] font-black text-white/20 hover:text-white/40 uppercase tracking-tighter"
                           >
                             (Change)
                           </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/5 relative z-10">
                    <div className="flex items-center gap-2 text-white/20">
                      <CalendarIcon className="w-3 h-3" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Date</span>
                    </div>
                    <p className="font-black text-[10px] text-white/40 uppercase tracking-widest italic">{msg.data.date}</p>
                  </div>

                  <div className="flex gap-4 pt-4 relative z-10">
                    <button 
                      onClick={() => confirmTransaction(msg.data, msg.id)}
                      disabled={!msg.data.amount || msg.data.amount <= 0}
                      className="flex-1 bg-white text-black font-bold h-11 rounded-xl flex items-center justify-center gap-2 hover:bg-white/90 disabled:opacity-30 disabled:grayscale transition-all shadow-lg active:scale-95 group/btn"
                    >
                      <Check className="w-4 h-4" /> 
                      <span className="uppercase tracking-widest text-[10px]">Confirm</span>
                    </button>
                    <button 
                      onClick={() => setMessages(prev => prev.filter(m => m.id !== msg.id))}
                      className="flex-1 bg-white/5 text-white/40 font-bold h-11 rounded-xl flex items-center justify-center gap-2 hover:bg-white/10 hover:text-white transition-all active:scale-95"
                    >
                      <X className="w-4 h-4" />
                      <span className="uppercase tracking-widest text-[10px]">Cancel</span>
                    </button>
                  </div>
                </div>
              )}
              
              <span className="text-[10px] text-white/10 mt-2 px-2 font-medium uppercase tracking-widest">
                {format(msg.timestamp, 'HH:mm')}
              </span>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Floating Input Bar */}
      <div className="p-8 pt-0 relative z-20">
        <div className="relative group max-w-xl mx-auto">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition duration-500"></div>
          <div className="relative flex items-center bg-[#0A0A0A] border border-white/10 rounded-2xl p-1.5 shadow-2xl transition-all duration-300 group-focus-within:border-white/20 group-focus-within:bg-[#0c0c0d]">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type an expense or income..."
              className="flex-1 bg-transparent px-4 py-2.5 text-[15px] font-medium text-white placeholder-white/20 outline-none"
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim()}
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300",
                input.trim() 
                  ? "bg-white text-black shadow-lg shadow-white/10 scale-100" 
                  : "bg-white/5 text-white/20 scale-90"
              )}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
        <p className="text-center text-[9px] font-bold text-white/10 uppercase tracking-[0.3em] mt-6">
          Powered by Smart Discovery AI
        </p>
      </div>
    </div>
  );
}
