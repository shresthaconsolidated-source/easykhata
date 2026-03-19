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
    const amountMatch = text.match(/\d+(\.\d+)?/);
    const amount = amountMatch ? parseFloat(amountMatch[0]) : 0;
    
    let type: 'income' | 'expense' = 'expense';
    if (text.toLowerCase().includes('received') || text.toLowerCase().includes('income') || text.toLowerCase().includes('sold')) {
      type = 'income';
    }

    let date = format(new Date(), 'yyyy-MM-dd');
    if (text.toLowerCase().includes('yesterday')) {
      date = format(subDays(new Date(), 1), 'yyyy-MM-dd');
    }

    // Heuristic category matching
    let category = categories.find(c => 
      text.toLowerCase().includes(c.name.toLowerCase())
    );

    if (!category) {
      if (text.toLowerCase().includes('taxi') || text.toLowerCase().includes('bus') || text.toLowerCase().includes('travel')) {
        category = categories.find(c => c.name === 'Travel');
      } else if (text.toLowerCase().includes('food') || text.toLowerCase().includes('dinner')) {
        category = categories.find(c => c.name === 'Meals');
      }
    }

    return {
      amount,
      type,
      date,
      categoryId: category?.id,
      categoryName: category?.name || 'Other',
      note: text.replace(/\d+/g, '').replace(/spent|received|income|expense|yesterday|today/gi, '').trim()
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
      content: `I parsed a ${parsedData.type}. Does this look correct?`,
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
        description: data.note,
        amount: data.amount,
        type: data.type,
        date: data.date
      });

    if (error) {
      alert('Error saving transaction');
      return;
    }

    setMessages(prev => prev.map(m => 
      m.id === msgId ? { ...m, type: 'success', content: '✅ Transaction saved successfully!' } : m
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
              <div className="mt-4 p-5 bg-white/5 rounded-3xl border border-white/10 w-full max-w-[90%] space-y-4 shadow-xl">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-blue-400" />
                      <span className="text-xs font-bold text-white/40 uppercase tracking-widest">Confirmation</span>
                    </div>
                    <span className={cn(
                      "text-[10px] font-black uppercase px-2 py-0.5 rounded-full border",
                      msg.data.type === 'income' ? "border-green-500/50 text-green-400" : "border-red-500/50 text-red-400"
                    )}>
                      {msg.data.type}
                    </span>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-white/30 truncate">
                         <Calculator className="w-3 h-3" />
                         <span className="text-[10px] font-bold uppercase">Amount</span>
                      </div>
                      <p className="font-bold text-lg">{formatCurrency(msg.data.amount, company?.currency)}</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-white/30 truncate">
                         <TagIcon className="w-3 h-3" />
                         <span className="text-[10px] font-bold uppercase">Category</span>
                      </div>
                      <p className="font-bold text-sm truncate">{msg.data.categoryName}</p>
                    </div>
                 </div>

                 <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-white/30">
                       <CalendarIcon className="w-3 h-3" />
                       <span className="text-[10px] font-bold uppercase">Date</span>
                    </div>
                    <p className="font-medium text-xs text-white/60">{msg.data.date}</p>
                 </div>

                 <div className="flex gap-3 pt-2">
                    <button 
                      onClick={() => confirmTransaction(msg.data, msg.id)}
                      className="flex-1 bg-white text-black font-bold h-11 rounded-2xl flex items-center justify-center gap-2 hover:bg-white/90 active:scale-95 transition-all"
                    >
                      <Check className="w-4 h-4" /> Confirm
                    </button>
                    <button className="flex-1 bg-white/5 text-white font-bold h-11 rounded-2xl flex items-center justify-center gap-2 hover:bg-white/10 active:scale-95 transition-all">
                      <X className="w-4 h-4" /> Cancel
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
