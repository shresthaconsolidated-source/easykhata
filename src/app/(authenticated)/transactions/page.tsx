'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCompany } from '@/contexts/CompanyContext';
import { supabase } from '@/lib/supabase';
import { formatCurrency, cn } from '@/lib/utils';
import { 
  Search, 
  Filter, 
  TrendingUp, 
  TrendingDown, 
  MoreVertical, 
  Trash2, 
  Pencil,
  X,
  Calendar as CalendarIcon,
  Tag
} from 'lucide-react';
import { format } from 'date-fns';

export default function TransactionsPage() {
  const { user } = useAuth();
  const { company } = useCompany();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [editingTransaction, setEditingTransaction] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user && company) {
      fetchTransactions();
      fetchCategories();
    }
  }, [user, company]);

  const fetchCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .eq('company_id', company.id)
      .order('name');

    if (data) setCategories(data);
  };

  const fetchTransactions = async () => {
    const { data, error } = await supabase
      .from('transactions')
      .select('*, categories(name)')
      .eq('company_id', company.id)
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
    } else {
      alert(`Error deleting transaction: ${error.message}`);
    }
  };

  const startEditing = (transaction: any) => {
    setEditingTransaction({
      ...transaction,
      date: format(new Date(transaction.date), 'yyyy-MM-dd')
    });
    setShowEditModal(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    const { error } = await supabase
      .from('transactions')
      .update({
        date: editingTransaction.date,
        amount: Number(editingTransaction.amount),
        category_id: editingTransaction.category_id,
        note: editingTransaction.note,
        type: editingTransaction.type
      })
      .eq('id', editingTransaction.id);

    if (!error) {
      await fetchTransactions();
      setShowEditModal(false);
      setEditingTransaction(null);
    }
    setSaving(false);
  };

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.note?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (Array.isArray(t.categories) ? t.categories[0]?.name : (t.categories as any)?.name)?.toLowerCase().includes(searchTerm.toLowerCase());
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
                       <span className="text-sm text-white/80">{(Array.isArray(t.categories) ? t.categories[0]?.name : (t.categories as any)?.name) || 'Misc'}</span>
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
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => startEditing(t)}
                        className="p-2 text-white/20 hover:text-blue-400 hover:bg-blue-400/10 rounded-xl transition-all"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => deleteTransaction(t.id)}
                        className="p-2 text-white/20 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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
      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[#1c1c1e] border border-white/10 rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <h2 className="text-xl font-bold text-white">Edit Transaction</h2>
              <button 
                onClick={() => setShowEditModal(false)}
                className="p-2 text-white/40 hover:text-white rounded-xl hover:bg-white/5 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleUpdate} className="p-8 space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">Type</label>
                <div className="flex bg-black p-1 rounded-2xl border border-white/5">
                  {(['income', 'expense'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setEditingTransaction({ ...editingTransaction, type })}
                      className={cn(
                        "flex-1 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all",
                        editingTransaction.type === type 
                          ? (type === 'income' ? "bg-green-500 text-white" : "bg-red-500 text-white")
                          : "text-white/40 hover:text-white"
                      )}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">Date</label>
                  <input 
                    type="date" 
                    required
                    value={editingTransaction.date}
                    onChange={(e) => setEditingTransaction({ ...editingTransaction, date: e.target.value })}
                    className="w-full bg-black border border-white/10 rounded-2xl p-3 text-sm text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">Amount</label>
                  <input 
                    type="number" 
                    step="0.01"
                    required
                    value={editingTransaction.amount}
                    onChange={(e) => setEditingTransaction({ ...editingTransaction, amount: e.target.value })}
                    className="w-full bg-black border border-white/10 rounded-2xl p-3 text-sm text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">Category</label>
                <select 
                  required
                  value={editingTransaction.category_id}
                  onChange={(e) => setEditingTransaction({ ...editingTransaction, category_id: e.target.value })}
                  className="w-full bg-black border border-white/10 rounded-2xl p-3 text-sm text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all appearance-none"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">Note</label>
                <textarea 
                  value={editingTransaction.note || ''}
                  onChange={(e) => setEditingTransaction({ ...editingTransaction, note: e.target.value })}
                  className="w-full bg-black border border-white/10 rounded-2xl p-3 text-sm text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all min-h-[80px] resize-none"
                  placeholder="Add a note..."
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-6 py-3 border border-white/10 rounded-2xl text-sm font-bold text-white hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={saving}
                  className="flex-[2] px-6 py-3 bg-white text-black rounded-2xl text-sm font-bold hover:bg-white/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  ) : null}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
