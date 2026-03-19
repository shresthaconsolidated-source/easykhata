'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { format, subDays, parseISO } from 'date-fns';
import { 
  Send, 
  Bot, 
  Check, 
  X, 
  Sparkles, 
  Calculator, 
  Tag as TagIcon,
  Calendar as CalendarIcon,
  TrendingUp,
  TrendingDown
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
    // Look for numbers with currency/price indicators first
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

    // If no explicit price indicator, look for all numbers
    if (foundAmount === 0) {
      const allNumbers = text.match(/\d+(?:\.\d+)?/g);
      if (allNumbers) {
        // If there's only one number, it's likely the amount
        if (allNumbers.length === 1) {
          foundAmount = parseFloat(allNumbers[0]);
        } else {
          // If multiple numbers, use heuristics
          // Heuristic: The largest number is usually the amount (prevents quantity mixups like "2 burgers for 500")
          const numbers = allNumbers.map(n => parseFloat(n));
          foundAmount = Math.max(...numbers);
          
          // Exception: Check if a number is very small and followed by an item name (basic quantity check)
          // But Max usually works well for simple "X items for Y money"
        }
      }
    }

    // 2. Type Detection
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

    // 3. Smart Date Detection
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

    // 4. Category Matching
    let category = categories.find(c => 
      lowerText.includes(c.name.toLowerCase())
    );

    if (!category) {
      const keywordMap: Record<string, string> = {
        'taxi': 'Travel', 'bus': 'Travel', 'fuel': 'Travel', 'petrol': 'Travel', 'ride': 'Travel', 'uber': 'Travel', 'pathao': 'Travel',
        'food': 'Meals', 'dinner': 'Meals', 'lunch': 'Meals', 'breakfast': 'Meals', 'khaja': 'Meals', 'restaurant': 'Meals', 'momo': 'Meals', 'burger': 'Meals', 'chicken': 'Meals',
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

    const potentialCategoryName = (!category && text.split(' ').length > 0) ? text.split(' ')[0] : null;

    return {
      amount: foundAmount,
      type,
      date,
      categoryId: category?.id || null,
      categoryName: category?.name || 'Other',
      potentialCategoryName: potentialCategoryName,
      note: text.replace(/\d+/g, '').replace(/spent|received|income|expense|yesterday|today|day before|at|for|last|month|week/gi, '').trim()
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

    const parsedData = parseMessage(input);

    const botMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'bot',
      content: parsedData.amount > 0 
        ? `I parsed a ${parsedData.type}. Does this look correct?`
        : `I found a ${parsedData.type}, but I didn't see an amount. How much did you sell/spend it at?`,
      timestamp: new Date(),
      type: 'transaction_confirm',
      data: parsedData
    };

    setTimeout(() => {
      setMessages(prev => [...prev, botMsg]);
    }, 500);
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
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-2xl mx-auto rounded-[3rem] bg-[#1c1c1e] border border-white/5 shadow-2xl overflow-hidden relative">
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
        {messages.map((msg) => (
          <div key={msg.id} className={cn(
            "flex flex-col scale-in",
            msg.role === 'user' ? "items-end" : "items-start"
          )}>
            <div className={cn(
              "max-w-[85%] p-4 rounded-3xl text-sm font-medium leading-relaxed shadow-lg",
              msg.role === 'user' 
                ? "bg-blue-600 text-white rounded-tr-none" 
                : "bg-white/5 text-white/90 rounded-tl-none border border-white/5"
            )}>
              {msg.content}
            </div>
                       {msg.type === 'transaction_confirm' && (
              <div className="mt-4 p-6 bg-gradient-to-br from-white/[0.08] to-transparent rounded-[2.5rem] border border-white/10 w-full max-w-[95%] space-y-6 shadow-2xl backdrop-blur-md relative overflow-hidden group">
                 {/* Decorative Glow */}
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
                        <div className="space-y-3">
                           <p className="text-red-400 font-black text-xs uppercase italic animate-pulse">Amount not entered</p>
                           <div className="relative max-w-[140px]">
                             <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-white/20">{company?.currency}</span>
                             <input 
                               type="number"
                               placeholder="0.00"
                               autoFocus
                               className="w-full bg-white/5 border border-red-500/20 rounded-xl py-2 pl-10 pr-3 text-sm font-black text-white outline-none focus:ring-1 focus:ring-red-500/30 transition-all font-mono"
                               onChange={(e) => {
                                 const val = parseFloat(e.target.value) || 0;
                                 setMessages(prev => prev.map(m => 
                                   m.id === msg.id ? { ...m, data: { ...m.data, amount: val } } : m
                                 ));
                               }}
                             />
                           </div>
                        </div>
                      )}
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
                           <p className="font-bold text-[9px] text-yellow-400/60 italic leading-tight">Couldn't auto-detect category. Choose one or create new.</p>
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

                 <div className="flex gap-4 pt-2 relative z-10">
                    <button 
                      onClick={() => confirmTransaction(msg.data, msg.id)}
                      disabled={!msg.data.amount || msg.data.amount <= 0}
                      className="flex-1 bg-white text-black font-black h-14 rounded-3xl flex items-center justify-center gap-3 hover:bg-white/90 disabled:opacity-30 disabled:grayscale transition-all shadow-2xl shadow-white/10 group/btn"
                    >
                      <Check className="w-5 h-5 group-hover/btn:scale-125 transition-transform" /> 
                      <span className="uppercase tracking-widest text-xs">Confirm</span>
                    </button>
                    <button 
                      onClick={() => {
                        console.log('Discarding message:', msg.id);
                        setMessages(prev => prev.filter(m => m.id !== msg.id));
                      }}
                      className="flex-1 bg-white/5 text-white/40 font-black h-14 rounded-3xl flex items-center justify-center gap-3 hover:bg-white/10 hover:text-white transition-all active:scale-[0.97]"
                    >
                      <X className="w-5 h-5" />
                      <span className="uppercase tracking-widest text-xs">Cancel</span>
                    </button>
                 </div>
              </div>
            )}
            
            <span className="text-[10px] text-white/20 mt-1 px-2 font-bold uppercase tracking-widest">
              {format(msg.timestamp, 'HH:mm')}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-[#1c1c1e] border-t border-white/5">
        <div className="flex items-center gap-2 bg-white/5 p-2 rounded-[2rem] border border-white/10 ring-1 ring-white/5 shadow-inner">
          <input 
            type="text" 
            placeholder="What happened today?"
            className="flex-1 bg-transparent border-none outline-none py-3 px-4 text-sm font-medium placeholder:text-white/20"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend}
            className="bg-blue-600 w-11 h-11 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 active:scale-90 transition-all shrink-0"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
