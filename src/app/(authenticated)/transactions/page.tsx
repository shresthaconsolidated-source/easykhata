'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { formatCurrency, cn } from '@/lib/utils';
import { 
  Search, 
  Filter, 
  TrendingUp, 
  TrendingDown, 
  MoreVertical, 
  Trash2, 
  Calendar as CalendarIcon,
  Tag
} from 'lucide-react';
import { format } from 'date-fns';

export default function TransactionsPage() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [company, setCompany] = useState<any>(null);

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user]);

  const fetchTransactions = async () => {
    const { data: membership } = await supabase
      .from('company_members')
      .select('company_id, companies(*)')
      .eq('user_id', user?.id)
      .single();

    if (!membership) return;
    setCompany(membership.companies);

    const { data, error } = await supabase
      .from('transactions')
      .select('*, categories(name)')
      .eq('company_id', membership.company_id)
      .order('date', { ascending: false })
      .order('created_at', { ascending: false });

    if (data) setTransactions(data);
    setLoading(false);
  };

  const deleteTransaction = async (id: string) => {
    if (!confirm('Are you sure you want to delete this transaction?')) return;
    
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);

    if (!error) {
      setTransactions(transactions.filter(t => t.id !== id));
    }
  };

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.note?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         t.categories?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || t.type === filterType;
    return matchesSearch && matchesFilter;
  });

  if (loading) return null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Transactions</h1>
          <p className="text-white/40 mt-1">Review and manage your financial entries.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
            <input 
              type="text" 
              placeholder="Search notes or categories..."
              className="bg-[#1c1c1e] border border-white/10 rounded-2xl py-2.5 pl-11 pr-4 text-sm w-full md:w-64 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex bg-[#1c1c1e] p-1 rounded-2xl border border-white/5">
            {['all', 'income', 'expense'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={cn(
                  "px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all",
                  filterType === type ? "bg-white text-black" : "text-white/40 hover:text-white"
                )}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[#1c1c1e] rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="px-6 py-5 text-xs font-bold text-white/40 uppercase tracking-widest">Date</th>
                <th className="px-6 py-5 text-xs font-bold text-white/40 uppercase tracking-widest">Category</th>
                <th className="px-6 py-5 text-xs font-bold text-white/40 uppercase tracking-widest">Note</th>
                <th className="px-6 py-5 text-xs font-bold text-white/40 uppercase tracking-widest text-right">Amount</th>
                <th className="px-6 py-5 text-xs font-bold text-white/40 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredTransactions.map((t) => (
                <tr key={t.id} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                       <div className="p-2 rounded-xl bg-white/5 text-white/40 group-hover:bg-blue-500/10 group-hover:text-blue-400 transition-colors">
                         <CalendarIcon className="w-4 h-4" />
                       </div>
                       <span className="text-sm font-medium">{format(new Date(t.date), 'MMM d, yyyy')}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                       <Tag className="w-3.5 h-3.5 text-white/20" />
                       <span className="text-sm text-white/80">{t.categories?.name || 'Misc'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-sm font-medium line-clamp-1">{t.note}</span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className={cn(
                      "text-sm font-bold flex items-center justify-end gap-1.5",
                      t.type === 'income' ? "text-green-400" : "text-red-400"
                    )}>
                      {t.type === 'income' ? '+' : '-'}
                      {formatCurrency(Number(t.amount), company?.currency)}
                      {t.type === 'income' ? (
                        <TrendingUp className="w-3.5 h-3.5" />
                      ) : (
                        <TrendingDown className="w-3.5 h-3.5" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button 
                      onClick={() => deleteTransaction(t.id)}
                      className="p-2 text-white/20 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                       <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center">
                         <Filter className="w-8 h-8 text-white/10" />
                       </div>
                       <div>
                         <p className="text-white font-bold">No transactions found</p>
                         <p className="text-white/40 text-sm mt-1">Try adjusting your filters or search term.</p>
                       </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
