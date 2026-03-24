'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useCompany } from '@/contexts/CompanyContext';
import { Users, CheckCircle, ArrowRight, ArrowDown, ArrowUp, XCircle } from 'lucide-react';
import { formatCurrency, cn } from '@/lib/utils';
import { format } from 'date-fns';

export default function ReceivablesPayablesPage() {
  const { user } = useAuth();
  const { company } = useCompany();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'receivables' | 'payables'>('all');

  useEffect(() => {
    if (company) fetchUnpaidTransactions();
  }, [company]);

  const fetchUnpaidTransactions = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('transactions')
      .select('*, party:parties(*)')
      .eq('company_id', company?.id)
      .eq('payment_status', 'unpaid')
      .not('party_id', 'is', null)
      .order('date', { ascending: false });
    
    if (data) setTransactions(data);
    setLoading(false);
  };

  const markAsPaid = async (id: string, type: string) => {
    if (!confirm(`Mark this ${type === 'income' ? 'receivable' : 'payable'} as settled?`)) return;
    
    const { error } = await supabase
      .from('transactions')
      .update({ payment_status: 'paid' })
      .eq('id', id);

    if (!error) {
      setTransactions(prev => prev.filter(t => t.id !== id));
    } else {
      alert('Error updating transaction: ' + error.message);
    }
  };

  const filteredData = transactions.filter(t => {
    if (filter === 'receivables') return t.type === 'income';
    if (filter === 'payables') return t.type === 'expense';
    return true;
  });

  const totalReceivables = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalPayables = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-black text-white tracking-tight flex items-center gap-3">
             <Users className="w-8 h-8 text-blue-500" />
             Settlements
          </h1>
          <p className="text-white/40 mt-1">Manage accounts receivable and payable.</p>
        </div>

        <div className="flex bg-white/5 border border-white/10 p-1 rounded-2xl w-fit">
          <button 
            onClick={() => setFilter('all')}
            className={cn("px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all", filter === 'all' ? "bg-white/10 text-white" : "text-white/40 hover:text-white")}
          >
            All
          </button>
          <button 
            onClick={() => setFilter('receivables')}
            className={cn("px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all", filter === 'receivables' ? "bg-green-500/20 text-green-400" : "text-white/40 hover:text-white")}
          >
            To Receive
          </button>
          <button 
            onClick={() => setFilter('payables')}
            className={cn("px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all", filter === 'payables' ? "bg-red-500/20 text-red-400" : "text-white/40 hover:text-white")}
          >
            To Pay
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-green-500/10 to-transparent border border-green-500/20 p-6 rounded-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-40 group-hover:scale-110 transition-all">
             <ArrowDown className="w-16 h-16 text-green-500" />
          </div>
          <p className="text-[10px] font-black uppercase text-green-400/80 tracking-widest mb-1">Total Receivables</p>
          <p className="text-4xl font-black text-white">{formatCurrency(totalReceivables, company?.currency)}</p>
        </div>
        <div className="bg-gradient-to-br from-red-500/10 to-transparent border border-red-500/20 p-6 rounded-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-40 group-hover:scale-110 transition-all">
             <ArrowUp className="w-16 h-16 text-red-500" />
          </div>
          <p className="text-[10px] font-black uppercase text-red-400/80 tracking-widest mb-1">Total Payables</p>
          <p className="text-4xl font-black text-white">{formatCurrency(totalPayables, company?.currency)}</p>
        </div>
      </div>

      <div className="bg-[#0c0c0d] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        {loading ? (
          <div className="p-12 text-center text-white/40 animate-pulse font-bold tracking-widest text-sm uppercase">Loading...</div>
        ) : filteredData.length === 0 ? (
          <div className="p-12 text-center text-white/40 flex flex-col items-center gap-4">
             <CheckCircle className="w-12 h-12 text-green-500/50" />
             <p className="font-bold tracking-widest text-sm uppercase">All settled up!</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {filteredData.map(t => (
              <div key={t.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-inner",
                    t.type === 'income' ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
                  )}>
                    {t.type === 'income' ? <ArrowDown className="w-5 h-5" /> : <ArrowUp className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="font-black text-white text-lg">@{t.party?.name || 'Unknown'}</h3>
                    <p className="text-white/40 text-xs font-semibold">{format(new Date(t.date), 'MMM dd, yyyy')} • {t.note}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto">
                   <div className="text-left md:text-right">
                     <p className="font-black text-2xl text-white">{formatCurrency(t.amount, company?.currency)}</p>
                     <p className={cn(
                       "text-[10px] font-black uppercase tracking-widest",
                       t.type === 'income' ? "text-green-400" : "text-red-400"
                     )}>
                       {t.type === 'income' ? "To Receive" : "To Pay"}
                     </p>
                   </div>
                   
                   <button 
                     onClick={() => markAsPaid(t.id, t.type)}
                     className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-lg active:scale-95 flex items-center gap-2 shrink-0"
                   >
                     Settle <ArrowRight className="w-4 h-4" />
                   </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
