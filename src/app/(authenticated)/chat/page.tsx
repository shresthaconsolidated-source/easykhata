'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCompany } from '@/contexts/CompanyContext';
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
  Package,
  Zap,
  ArrowRight,
  MessageCircle
} from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'bot';
  content: string;
  timestamp: Date;
  data?: any;
  type?: 'chat' | 'transaction_confirm' | 'success';
  isConfirmation?: boolean;
}

export default function ChatPage() {
  const { user } = useAuth();
  const { company } = useCompany();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
  const [pendingTransaction, setPendingTransaction] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [quickActions, setQuickActions] = useState<any[]>([
    { label: "Purchased Raw Materials 25000", icon: Zap },
    { label: "Wholesale Sale 50 units @ 1200", icon: Package },
    { label: "Service Revenue 75000 received", icon: ArrowRight },
    { label: "Office Rent & Utilities 45000", icon: MessageCircle }
  ]);

  useEffect(() => {
    if (user && company) {
      fetchCategories(company.id);
      fetchQuickActions(company.id);
    }
  }, [user, company]);

  const fetchQuickActions = async (companyId: string) => {
    const { data } = await supabase
      .from('transactions')
      .select('note, amount, type')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false })
      .limit(50);
      
    const defaults = [
      { label: "Purchased Raw Materials 25000", icon: Zap },
      { label: "Wholesale Sale 50 units @ 1200", icon: Package },
      { label: "Service Revenue 75000 received", icon: ArrowRight },
      { label: "Office Rent & Utilities 45000", icon: MessageCircle }
    ];

    if (data && data.length > 0) {
      const freq: Record<string, { count: number, maxAmount: number, type: string, originalNote: string }> = {};
      data.forEach(t => {
        const words = t.note.toLowerCase().split(' ').filter((w: string) => w.length > 2);
        if (words.length === 0) return;
        
        const key = words.slice(0, 2).join(' ');
        if (!freq[key]) freq[key] = { count: 0, maxAmount: t.amount, type: t.type, originalNote: t.note };
        freq[key].count++;
        // Maintain the most typical amount for this common entry
        if (t.amount > freq[key].maxAmount) freq[key].maxAmount = t.amount;
      });
      
      const sorted = Object.values(freq).sort((a, b) => b.count - a.count).slice(0, 4);
      
      const actions = sorted.map(item => {
         let icon = Zap;
         if (item.type === 'income') icon = ArrowRight;
         else if (item.originalNote.toLowerCase().includes('materials') || item.originalNote.toLowerCase().includes('inventory')) icon = Package;
         else icon = MessageCircle;
         
         const label = `${item.originalNote} ${item.maxAmount}`;
         return { label, icon };
      });
      
      // Fallback to defaults if they haven't done 4 distinct transaction types
      while (actions.length < 4) {
         actions.push(defaults[actions.length]);
      }
      setQuickActions(actions);
    } else {
      setQuickActions(defaults);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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
      /(?:at|for|rs|npr|usd|inr|@)\s*([\d,]+(?:\.\d+)?)/i,
      /([\d,]+(?:\.\d+)?)\s*(?:rs|npr|usd|inr)/i,
      /(?:^|\s)\$([\d,]+(?:\.\d+)?)/i
    ];

    let foundAmount = 0;
    for (const pattern of pricePatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        foundAmount = parseFloat(match[1].replace(/,/g, ''));
        break;
      }
    }

    // 2. Quantity Detection
    let foundQuantity = 1;
    const allNumbersMatch = Array.from(text.matchAll(/[\d,]+(?:\.\d+)?/g));
    
    if (allNumbersMatch.length > 1) {
      for (const match of allNumbersMatch) {
         const val = parseFloat(match[0].replace(/,/g, ''));
         if (val !== foundAmount) {
            foundQuantity = val;
            break;
         }
      }
    } else if (allNumbersMatch.length === 1 && foundAmount === 0) {
      foundAmount = parseFloat(allNumbersMatch[0][0].replace(/,/g, ''));
    }

    if (foundAmount === 0 && allNumbersMatch.length > 1) {
       const numbers = allNumbersMatch.map(m => parseFloat(m[0].replace(/,/g, '')));
       foundAmount = Math.max(...numbers);
       foundQuantity = Math.min(...numbers);
    }

    // 3. Type Detection — English + Nepali Romanized
    let type: 'income' | 'expense' = 'expense';
    if (
      // English income words
      lowerText.includes('received') || lowerText.includes('income') ||
      lowerText.includes('sold') || lowerText.includes('sale') ||
      lowerText.includes('profit') || lowerText.includes('earned') ||
      lowerText.includes('plus') || lowerText.includes('salary') ||
      lowerText.includes('sales') || lowerText.includes('revenue') ||
      lowerText.includes('wholesale') || lowerText.includes('b2b') ||
      // Nepali Romanized income words
      lowerText.includes('bechyo') || lowerText.includes('bechi') ||  // sold
      lowerText.includes('paisa aayo') || lowerText.includes('aayo') ||  // money came
      lowerText.includes('milyo') || lowerText.includes('miliyo') ||  // received
      lowerText.includes('tiryo') || lowerText.includes('payment aayo')    // received payment
    ) {
      type = 'income';
    }

    // 4. Smart Date Detection — English + Nepali
    let date = format(new Date(), 'yyyy-MM-dd');
    const now = new Date();
    
    if (lowerText.includes('yesterday') || lowerText.includes('hijo')) {
      date = format(subDays(now, 1), 'yyyy-MM-dd');
    } else if (lowerText.includes('day before yesterday') || lowerText.includes('asti')) {
      date = format(subDays(now, 2), 'yyyy-MM-dd');
    } else if (lowerText.includes('last month') || lowerText.includes('asina mahina')) {
      date = format(subDays(now, 30), 'yyyy-MM-dd');
    } else if (lowerText.includes('last week') || lowerText.includes('asina hafta')) {
      date = format(subDays(now, 7), 'yyyy-MM-dd');
    }

    // 5. Category Matching
    let category = categories.find(c => 
      lowerText.includes(c.name.toLowerCase())
    );

    let matchedKeywordCategory: string | null = null;
    if (!category) {
      const keywordMap: Record<string, string> = {
        // --- English ---
        'taxi': 'Travel', 'bus': 'Travel', 'fuel': 'Travel', 'petrol': 'Travel',
        'ride': 'Travel', 'uber': 'Travel', 'pathao': 'Travel',
        'food': 'Meals', 'dinner': 'Meals', 'lunch': 'Meals', 'breakfast': 'Meals',
        'restaurant': 'Meals', 'momo': 'Meals', 'burger': 'Meals', 'chicken': 'Meals',
        'rent': 'Housing', 'electricity': 'Utilities', 'water': 'Utilities',
        'internet': 'Utilities', 'wifi': 'Utilities',
        'salary': 'Salary', 'sold': 'Sales', 'sale': 'Sales', 'sales': 'Sales',
        'bonus': 'Bonus', 'inventory': 'Supplies', 'stock': 'Supplies',
        'candle': 'Supplies', 'khaja': 'Meals',
        'cogs': 'Supplies', 'materials': 'Supplies', 'raw materials': 'Supplies',
        'wholesale': 'Sales', 'revenue': 'Sales', 'consulting': 'Sales',
        // --- Nepali Romanized ---
        // Travel
        'gadi': 'Travel', 'sawa': 'Travel', 'tempo': 'Travel', 'auto': 'Travel',
        'microbus': 'Travel', 'sajha': 'Travel', 'yatayat': 'Travel',
        // Food / Meals
        'khana': 'Meals', 'bhojan': 'Meals', 'nasto': 'Meals', 'tarkari': 'Meals',
        'sabji': 'Meals', 'daal': 'Meals', 'bhat': 'Meals', 'roti': 'Meals',
        'piro': 'Meals', 'mithai': 'Meals', 'chiya': 'Meals',  // tea
        // Groceries / Supplies
        'alu': 'Supplies', 'pyaj': 'Supplies', 'chini': 'Supplies',
        'tel': 'Supplies', 'maida': 'Supplies', 'chamal': 'Supplies',
        'sabun': 'Supplies', 'saman': 'Supplies',  // goods/items
        // Sales / Income
        'bechyo': 'Sales', 'bechi': 'Sales', 'bechna': 'Sales',
        'bikri': 'Sales',  // sale
        // Housing
        'bhada': 'Housing', 'kotha': 'Housing',  // rent, room
        // Utilities
        'bijuli': 'Utilities', 'paani': 'Utilities',
        // Salary
        'tankha': 'Salary', 'mahina': 'Salary',
      };

      for (const [kw, catName] of Object.entries(keywordMap)) {
        if (lowerText.includes(kw)) {
          matchedKeywordCategory = catName;
          category = categories.find(c => c.name.toLowerCase() === catName.toLowerCase());
          if (category) break;
        }
      }
    }

    // 6. Unit Price Logic — English + Nepali units
    const perUnitWords = ['each', '/', 'per', 'ko', 'ma', 'ek'];
    if (perUnitWords.some(w => lowerText.includes(w)) && foundQuantity > 1) {
       foundAmount = foundAmount * foundQuantity;
    }

    const potentialCategoryName = (!category && matchedKeywordCategory) 
      ? matchedKeywordCategory 
      : (!category && text.split(' ').length > 0) 
        ? text.split(' ')[0] 
        : null;

    return {
      amount: foundAmount,
      quantity: foundQuantity,
      type,
      date,
      categoryId: category?.id || null,
      categoryName: category?.name || 'Other',
      potentialCategoryName: potentialCategoryName,
      note: text.replace(/\d+/g, '').replace(/spent|received|income|expense|yesterday|today|day before|at|for|last|month|week|each|bechyo|bechi|garyo|kinyo|aayo|hijo|asti/gi, '').trim()
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
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: `We detected an ${parsedData.type}. Please confirm the details below.`,
        timestamp: new Date(),
        type: 'transaction_confirm',
        data: parsedData,
        isConfirmation: true,
      };

      setTimeout(() => {
        setMessages(prev => [...prev, botMsg]);
      }, 500);
    } else {
      setPendingTransaction(parsedData);
      if (!parsedData.amount) {
        let question = "We caught that, but we didn't find the amount. How much was it?";
        if (parsedData.type === 'expense') question = "We detected an expense. How much did you spend?";
        if (parsedData.type === 'income') question = "We detected an income. How much was it?";
        
        const botMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: 'bot',
          content: question,
          timestamp: new Date()
        };
        setTimeout(() => setMessages(prev => [...prev, botMsg]), 500);
      }
    }
  };

  const confirmTransaction = async (data: any, msgId: string) => {
    if (!company || !user) return;
    setLoading(true);

    try {
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
        m.id === msgId ? { 
          ...m, 
          type: 'success', 
          content: `✅ ${data.type.charAt(0).toUpperCase() + data.type.slice(1)} saved successfully!` 
        } : m
      ));
    } finally {
      setLoading(false);
    }
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
    <div className="relative group max-w-2xl mx-auto h-[calc(100vh-180px)] lg:h-[calc(100vh-140px)]">
      {/* Dynamic Background Glows */}
      <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-transparent blur-[100px] opacity-50 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="flex flex-col h-full rounded-[2rem] lg:rounded-[3rem] bg-[#0c0c0d]/80 border border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,1)] overflow-hidden relative backdrop-blur-3xl ring-1 ring-white/5">
      <div className="flex-1 overflow-y-auto p-4 lg:p-10 space-y-8 scrollbar-hide relative">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-12">
            {/* Animated Core Logo/Icon */}
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 blur-[60px] rounded-full animate-pulse" />
              <div className="relative w-24 h-24 rounded-[2.5rem] bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-2xl ring-1 ring-white/20 group hover:scale-110 transition-transform duration-700">
                <Sparkles className="w-10 h-10 text-white animate-bounce" />
              </div>
            </div>

            <div className="space-y-4 max-w-sm mx-auto">
              <h2 className="text-4xl font-black tracking-tighter text-white">
                How can <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">AI</span> help today?
              </h2>
              <p className="text-base text-white/30 font-medium leading-relaxed">
                Log transactions, track expenses, or analyze your profit in seconds.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg px-4">
              {quickActions.map((item, idx) => (
                <button 
                  key={idx}
                  onClick={() => setInput(item.label)}
                  className="p-5 rounded-3xl bg-white/[0.03] border border-white/5 text-left hover:bg-white/[0.06] hover:border-blue-500/30 transition-all group relative overflow-hidden active:scale-95"
                >
                  <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-100 transition-opacity">
                    <item.icon className="w-4 h-4 text-blue-400" />
                  </div>
                  <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-1">Quick Action</p>
                  <p className="text-sm font-bold text-white/80 group-hover:text-blue-400 transition-colors">"{item.label}"</p>
                </button>
              ))}
            </div>

            {/* Pulse Indicator */}
            <div className="flex items-center gap-3 px-6 py-2.5 rounded-full bg-blue-500/5 border border-blue-500/10 text-[9px] font-black uppercase tracking-[0.3em] text-blue-400/60 animate-in fade-in slide-in-from-top-4 duration-1000">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
               Smart Detection Active
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
                <div className="mt-4 p-4 lg:p-6 bg-white/[0.02] rounded-[1.5rem] lg:rounded-[2rem] border border-white/10 w-full max-w-[95%] space-y-6 shadow-2xl backdrop-blur-xl relative overflow-hidden group">
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-10 relative z-10 pt-4">
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
                           <div className="flex items-center gap-2">
                              <input 
                                type="text"
                                placeholder="New category name..."
                                className="bg-white/5 border border-white/10 rounded-xl py-1.5 px-3 text-[10px] font-bold text-white placeholder:text-white/20 outline-none hover:bg-white/10 transition-all flex-1"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    const val = (e.currentTarget as HTMLInputElement).value;
                                    if (val.trim()) createCategory(val.trim(), msg.data.type, msg.id);
                                  }
                                }}
                              />
                              <p className="font-bold text-[8px] text-white/20 uppercase tracking-tighter">Enter to add</p>
                           </div>
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

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CalendarIcon className="w-4 h-4 text-white/20" />
                        <span className="text-[13px] font-medium">{format(new Date(msg.data.date), 'MMM dd, yyyy')}</span>
                      </div>
                      <input 
                        type="date" 
                        value={msg.data.date}
                        onChange={(e) => setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, data: { ...m.data, date: e.target.value } } : m))}
                        className="bg-white/[0.02] border border-white/5 rounded-lg px-2 py-1 text-[11px] text-white/40 focus:border-white/20 outline-none transition-all cursor-pointer"
                      />
                    </div>

                  <div className="pt-4 flex gap-3">
                    <button 
                      onClick={() => setMessages(prev => prev.filter(m => m.id !== msg.id))}
                      className="flex-1 py-3.5 rounded-2xl bg-white/[0.02] border border-white/5 text-[11px] font-black uppercase tracking-wider text-white/20 hover:text-white transition-all active:scale-95"
                    >
                      Discard
                    </button>
                    <button 
                      onClick={() => confirmTransaction(msg.data, msg.id)}
                      disabled={loading || !msg.data.amount}
                      className="flex-1 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-black uppercase tracking-wider transition-all shadow-lg shadow-blue-500/20 active:scale-95 disabled:opacity-50"
                    >
                      Save Transaction
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
      <div className="p-4 lg:p-8 pt-0 relative z-20">
        <div className="relative group max-w-xl mx-auto">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition duration-500"></div>
          <div className="relative flex flex-col gap-3 lg:gap-4">
            <div className="flex-1 bg-white/[0.03] backdrop-blur-2xl rounded-2xl border border-white/10 group-focus-within:border-blue-500/50 group-focus-within:bg-white/[0.05] transition-all shadow-2xl overflow-hidden flex items-center pr-4">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type an expense or income..."
                className="flex-1 bg-transparent px-4 lg:px-6 py-4 lg:py-5 text-sm font-semibold outline-none placeholder:text-white/10 text-white"
              />
              <button 
                onClick={handleSend}
                className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center hover:bg-blue-500 hover:scale-105 transition-all active:scale-95 shadow-lg shadow-blue-500/40 group/btn"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-white blur-lg opacity-0 group-hover/btn:opacity-20" />
                  <Send className="w-5 h-5 text-white relative z-10" />
                </div>
              </button>
            </div>
            <div className="flex gap-4 px-4 lg:px-6 text-[8px] lg:text-[9px] font-bold uppercase tracking-[0.2em] text-white/10">
               <span>Examples:</span>
               <span className="text-white/20 italic">"Inventory 15000"</span>
               <span className="text-white/20 italic">"Wholesale 25000"</span>
            </div>
          </div>
        </div>
        <p className="text-center text-[9px] font-bold text-white/10 uppercase tracking-[0.3em] mt-6">
          Powered by Smart Discovery AI
        </p>
      </div>
    </div>
  </div>
  );
}
