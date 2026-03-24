import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useCompany } from '@/contexts/CompanyContext';
import { X, Save, ArrowDown, ArrowUp, DollarSign, Package, Users, Tag as TagIcon, CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  categories: any[];
  parties: any[];
  inventoryItems: any[];
}

export default function TransactionModal({ isOpen, onClose, onSuccess, categories, parties, inventoryItems }: TransactionModalProps) {
  const { user } = useAuth();
  const { company } = useCompany();
  const [loading, setLoading] = useState(false);
  
  const [type, setType] = useState<'income' | 'expense'>('income');
  const [paymentStatus, setPaymentStatus] = useState<'paid' | 'unpaid'>('paid');
  const [amount, setAmount] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [categoryId, setCategoryId] = useState('');
  const [partyId, setPartyId] = useState('');
  const [inventoryItemId, setInventoryItemId] = useState('');
  const [note, setNote] = useState('');

  // Reset formulation on open
  useEffect(() => {
    if (isOpen) {
      setType('income');
      setPaymentStatus('paid');
      setAmount('');
      setQuantity('1');
      setDate(format(new Date(), 'yyyy-MM-dd'));
      setCategoryId('');
      setPartyId('');
      setInventoryItemId('');
      setNote('');
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company || !user || !amount) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('transactions')
        .insert({
          company_id: company.id,
          user_id: user.id,
          type,
          amount: parseFloat(amount),
          quantity: parseFloat(quantity) || 1,
          date,
          category_id: categoryId || null,
          party_id: partyId || null,
          inventory_item_id: inventoryItemId || null,
          payment_status: paymentStatus,
          note
        });

      if (error) throw error;
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error saving transaction:', error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
      
      <div className="bg-[#0c0c0d] border border-white/10 w-full max-w-lg rounded-3xl shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <h2 className="text-xl font-black text-white uppercase tracking-wider">New Entry</h2>
          <button onClick={onClose} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
            <X className="w-5 h-5 text-white/60" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
          {/* Type Selection */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setType('income')}
              className={cn(
                "flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-bold uppercase tracking-wider transition-all",
                type === 'income' 
                  ? "bg-green-500/20 border-green-500/50 text-green-400" 
                  : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10"
              )}
            >
              <ArrowDown className="w-4 h-4" /> Income / Sale
            </button>
            <button
              type="button"
              onClick={() => setType('expense')}
              className={cn(
                "flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-bold uppercase tracking-wider transition-all",
                type === 'expense' 
                  ? "bg-red-500/20 border-red-500/50 text-red-400" 
                  : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10"
              )}
            >
              <ArrowUp className="w-4 h-4" /> Expense / Buy
            </button>
          </div>

          {/* Amount & Date */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-white/40 flex items-center gap-1.5"><DollarSign className="w-3 h-3"/> Amount</label>
              <input 
                type="number" 
                required 
                step="any"
                min="0"
                value={amount} 
                onChange={e => setAmount(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-colors"
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-white/40 flex items-center gap-1.5"><CalendarIcon className="w-3 h-3"/> Date</label>
              <input 
                type="date" 
                required 
                value={date} 
                onChange={e => setDate(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-colors"
              />
            </div>
          </div>

          {/* Payment Status (Cash/Credit) */}
          <div className="space-y-3 p-4 rounded-xl bg-white/5 border border-white/5">
            <label className="text-[10px] font-black uppercase text-white/40">Payment Status</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentStatus('paid')}
                className={cn(
                  "py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border",
                  paymentStatus === 'paid' 
                    ? "bg-blue-500/20 border-blue-500/50 text-blue-400" 
                    : "bg-transparent border-white/10 text-white/40 hover:bg-white/5"
                )}
              >
                Cash / Paid
              </button>
              <button
                type="button"
                onClick={() => setPaymentStatus('unpaid')}
                className={cn(
                  "py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border",
                  paymentStatus === 'unpaid' 
                    ? "bg-amber-500/20 border-amber-500/50 text-amber-400" 
                    : "bg-transparent border-white/10 text-white/40 hover:bg-white/5"
                )}
              >
                Credit / Unpaid
              </button>
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-white/40 flex items-center gap-1.5"><TagIcon className="w-3 h-3"/> Category</label>
            <select 
              value={categoryId} 
              onChange={e => setCategoryId(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-colors appearance-none [&>option]:bg-[#1c1c1e]"
            >
              <option value="">None (Optional)</option>
              {categories.filter(c => c.type === type || !c.type).map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Party (Contact) - Shows only if Credit or explicitly selected */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-white/40 flex items-center gap-1.5"><Users className="w-3 h-3"/> Party / Contact {paymentStatus === 'unpaid' && <span className="text-amber-500">*</span>}</label>
            <select 
              value={partyId} 
              onChange={e => setPartyId(e.target.value)}
               className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-colors appearance-none [&>option]:bg-[#1c1c1e]"
               required={paymentStatus === 'unpaid'}
            >
              <option value="">Select a contact...</option>
              {parties.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <p className="text-[10px] text-white/30 italic mt-1">Required if transaction is on credit.</p>
          </div>

          {/* Inventory Item */}
          <div className="grid grid-cols-3 gap-4 p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
            <div className="col-span-2 space-y-2">
              <label className="text-[10px] font-black uppercase text-blue-400/80 flex items-center gap-1.5"><Package className="w-3 h-3"/> Inventory Item</label>
              <select 
                value={inventoryItemId} 
                onChange={e => setInventoryItemId(e.target.value)}
                className="w-full bg-blue-500/10 border border-blue-500/20 rounded-xl px-4 py-2 text-white outline-none transition-colors appearance-none [&>option]:bg-[#1c1c1e]"
              >
                <option value="">Select item (Optional)</option>
                {inventoryItems.map(i => (
                  <option key={i.id} value={i.id}>{i.name} (Stock: {i.stock_quantity})</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-blue-400/80">Qty</label>
              <input 
                type="number" 
                step="any"
                min="0.01"
                value={quantity} 
                onChange={e => setQuantity(e.target.value)}
                className="w-full bg-blue-500/10 border border-blue-500/20 rounded-xl px-4 py-2 text-white outline-none transition-colors"
                disabled={!inventoryItemId}
              />
            </div>
          </div>

          {/* Note */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-white/40">Note (Optional)</label>
            <textarea 
              value={note} 
              onChange={e => setNote(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-colors resize-none h-20"
              placeholder="Add details..."
            />
          </div>

        </form>
        
        <div className="p-6 border-t border-white/5 bg-[#0a0a0b]">
          <button 
            onClick={handleSubmit}
            disabled={loading || !amount || (paymentStatus === 'unpaid' && !partyId)}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest py-4 rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-95 flex flex-col items-center justify-center disabled:opacity-50"
          >
            {loading ? 'Saving...' : (
               <div className="flex items-center gap-2">
                 <Save className="w-5 h-5"/> Save Entry
               </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
