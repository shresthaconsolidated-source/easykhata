'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCompany } from '@/contexts/CompanyContext';
import { supabase } from '@/lib/supabase';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Save, 
  FileText,
  User,
  MapPin,
  Hash,
  Calendar as CalendarIcon
} from 'lucide-react';
import { format } from 'date-fns';

export default function EditInvoicePage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { company } = useCompany();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [clients, setClients] = useState<any[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  
  const [invoice, setInvoice] = useState({
    invoice_number: '',
    client_name: '',
    client_address: '',
    client_pan: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    due_date: format(new Date(), 'yyyy-MM-dd'),
    discount: 0,
    status: 'draft'
  });

  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    if (user && company && id) {
      fetchData();
    }
  }, [user, company, id]);

  const fetchData = async () => {
    const companyId = company.id;

    // 2. Fetch Invoice
    const { data: invData, error: invError } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', id)
      .single();
    
    if (invError || !invData) {
      router.push('/invoices');
      return;
    }

    setInvoice({
      invoice_number: invData.invoice_number,
      client_name: invData.client_name,
      client_address: invData.client_address || '',
      client_pan: invData.client_pan || '',
      date: invData.date,
      due_date: invData.due_date || invData.date,
      discount: Number(invData.discount) || 0,
      status: invData.status
    });
    setSelectedClientId(invData.client_id || '');

    // 3. Fetch Items
    const { data: itemData } = await supabase
      .from('invoice_items')
      .select('*')
      .eq('invoice_id', id);
    
    if (itemData) {
      setItems(itemData.map(i => ({
        id: i.id,
        description: i.description,
        quantity: i.quantity,
        rate: i.rate,
        amount: i.amount
      })));
    }

    // 4. Fetch Clients
    const { data: clientData } = await supabase
      .from('clients')
      .select('*')
      .eq('company_id', companyId)
      .order('name');
    if (clientData) setClients(clientData);

    setLoading(false);
  };

  const updateItem = (itemId: any, field: string, value: any) => {
    setItems(items.map(item => {
      if (item.id === itemId) {
        const newItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'rate') {
          newItem.amount = Number(newItem.quantity) * Number(newItem.rate);
        }
        return newItem;
      }
      return item;
    }));
  };

  const addItem = () => {
    setItems([...items, { id: Date.now(), description: '', quantity: 1, rate: 0, amount: 0 }]);
  };

  const removeItem = (itemId: any) => {
    if (items.length > 1) {
      setItems(items.filter(i => i.id !== itemId));
    }
  };

  const subtotal = items.reduce((sum, item) => sum + Number(item.amount), 0);
  const total = subtotal - Number(invoice.discount);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company || !user) return;
    setSaving(true);

    try {
      // 1. Update Invoice
      const { error: invError } = await supabase
        .from('invoices')
        .update({
          client_id: selectedClientId || null,
          invoice_number: invoice.invoice_number,
          client_name: invoice.client_name,
          client_address: invoice.client_address,
          client_pan: invoice.client_pan,
          date: invoice.date,
          due_date: invoice.due_date,
          subtotal: subtotal,
          discount: invoice.discount,
          total: total,
          status: invoice.status
        })
        .eq('id', id);

      if (invError) throw invError;

      // 2. Replace Items (Delete existing and insert new is simplest for Sync)
      await supabase.from('invoice_items').delete().eq('invoice_id', id);
      
      const { error: itemsError } = await supabase
        .from('invoice_items')
        .insert(items.map(i => ({
          invoice_id: id,
          description: i.description,
          quantity: i.quantity,
          rate: i.rate,
          amount: i.amount
        })));

      if (itemsError) throw itemsError;

      router.push(`/invoices/${id}`);
    } catch (error) {
      console.error('Error updating invoice:', error);
      alert('Failed to update invoice');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => router.back()}
          className="p-2 -ml-2 text-white/40 hover:text-white transition-colors flex items-center gap-2 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Cancel</span>
        </button>
        <h1 className="text-xl font-bold italic uppercase tracking-tighter text-blue-500">Edit Invoice {invoice.invoice_number}</h1>
        <div className="w-10" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Bill To Section */}
        <div className="bg-[#1c1c1e] p-8 rounded-[2.5rem] border border-white/5 shadow-xl space-y-6">
           <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-2xl bg-blue-500/10 text-blue-400">
                <User className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg">Bill To</h3>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-white/30 uppercase tracking-widest ml-1">Client Name</label>
                <input 
                  required
                  type="text"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all font-medium"
                  value={invoice.client_name}
                  onChange={(e) => setInvoice({...invoice, client_name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-white/30 uppercase tracking-widest ml-1">Client PAN</label>
                <input 
                  type="text"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all font-medium"
                  value={invoice.client_pan}
                  onChange={(e) => setInvoice({...invoice, client_pan: e.target.value})}
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-bold text-white/30 uppercase tracking-widest ml-1">Client Address</label>
                <input 
                  type="text"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all font-medium"
                  value={invoice.client_address}
                  onChange={(e) => setInvoice({...invoice, client_address: e.target.value})}
                />
              </div>
           </div>
        </div>

        {/* Invoice Date Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-[#1c1c1e] p-6 rounded-[2rem] border border-white/5 shadow-xl space-y-2">
             <label className="text-xs font-bold text-white/30 uppercase tracking-widest ml-1 block">Invoice #</label>
             <input value={invoice.invoice_number} readOnly className="w-full bg-transparent border-none p-0 text-white font-bold focus:ring-0 opacity-50" />
           </div>
           <div className="bg-[#1c1c1e] p-6 rounded-[2rem] border border-white/5 shadow-xl space-y-2">
             <label className="text-xs font-bold text-white/30 uppercase tracking-widest ml-1 block">Date</label>
             <input type="date" className="w-full bg-transparent border-none p-0 text-white font-bold focus:ring-0" value={invoice.date} onChange={(e) => setInvoice({...invoice, date: e.target.value})} />
           </div>
           <div className="bg-[#1c1c1e] p-6 rounded-[2rem] border border-white/5 shadow-xl space-y-2 relative">
             <label className="text-xs font-bold text-white/30 uppercase tracking-widest ml-1 block">Status</label>
             <select 
               className="w-full bg-[#1c1c1e] border-none p-0 text-white font-bold focus:ring-0 cursor-pointer uppercase appearance-none" 
               value={invoice.status} 
               onChange={(e) => setInvoice({...invoice, status: e.target.value})}
             >
               <option value="draft" className="bg-[#1c1c1e] text-white">Draft</option>
               <option value="sent" className="bg-[#1c1c1e] text-white">Sent</option>
               <option value="paid" className="bg-[#1c1c1e] text-white">Paid</option>
               <option value="overdue" className="bg-[#1c1c1e] text-white">Overdue</option>
               <option value="cancelled" className="bg-[#1c1c1e] text-white">Cancelled</option>
             </select>
             <div className="absolute right-6 top-1/2 translate-y-2 pointer-events-none text-white/20">
                <Plus className="w-4 h-4 rotate-45" /> {/* Simple arrow-like indicator */}
             </div>
           </div>
        </div>

        {/* Items Section */}
        <div className="bg-[#1c1c1e] p-8 rounded-[2.5rem] border border-white/5 shadow-xl">
           <div className="flex items-center justify-between mb-8">
              <h3 className="font-bold text-lg">Items</h3>
              <button type="button" onClick={addItem} className="text-blue-400 font-bold text-sm flex items-center gap-1 hover:text-blue-300 transition-colors">
                <Plus className="w-4 h-4" /> Add Item
              </button>
           </div>
           <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                   <div className="col-span-6">
                      <input 
                        placeholder="Description"
                        className="w-full bg-white/5 border border-white/5 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-blue-500/30 transition-all"
                        value={item.description}
                        onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                      />
                   </div>
                   <div className="col-span-2">
                      <input 
                        type="number"
                        className="w-full bg-white/5 border border-white/5 rounded-xl py-3 px-4 text-sm text-center focus:ring-2 focus:ring-blue-500/30 transition-all"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, 'quantity', e.target.value)}
                      />
                   </div>
                   <div className="col-span-2">
                      <input 
                        type="number"
                        className="w-full bg-white/5 border border-white/5 rounded-xl py-3 px-4 text-sm text-center focus:ring-2 focus:ring-blue-500/30 transition-all"
                        value={item.rate}
                        onChange={(e) => updateItem(item.id, 'rate', e.target.value)}
                      />
                   </div>
                   <div className="col-span-2 flex items-center justify-end gap-2 text-sm font-bold">
                      <span className="text-white/40 font-medium mr-1">{company?.currency}</span>
                      {Number(item.amount).toLocaleString()}
                      <button type="button" onClick={() => removeItem(item.id)} className="ml-2 p-2 text-white/5 hover:text-red-400 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                   </div>
                </div>
              ))}
           </div>

           <div className="mt-12 pt-8 border-t border-white/5 flex flex-col items-end space-y-2">
              <p className="text-xl font-black text-blue-500">
                <span className="text-xs font-bold uppercase tracking-widest text-white/20 mr-4">Total Amount</span>
                {company?.currency} {total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
           </div>
        </div>

        <button 
          type="submit" 
          disabled={saving}
          className="w-full bg-white text-black font-black py-5 rounded-[2rem] flex items-center justify-center gap-2 shadow-2xl active:scale-[0.98] hover:bg-white/90 transition-all disabled:opacity-50"
        >
          {saving ? 'Saving...' : (
            <>
              <Save className="w-6 h-6" /> Save Changes
            </>
          )}
        </button>
      </form>
    </div>
  );
}
