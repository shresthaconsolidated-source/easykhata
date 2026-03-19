'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
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

export default function NewInvoicePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [company, setCompany] = useState<any>(null);
  const [clients, setClients] = useState<any[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [saveClient, setSaveClient] = useState(false);
  const [invoice, setInvoice] = useState({
    invoice_number: '',
    client_name: '',
    client_address: '',
    client_pan: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    due_date: format(new Date(), 'yyyy-MM-dd'),
    discount: 0
  });

  const [items, setItems] = useState([
    { id: 1, description: '', quantity: 1, rate: 0, amount: 0 }
  ]);

  useEffect(() => {
    if (user) {
      fetchCompany();
    }
  }, [user]);

  const fetchCompany = async () => {
    const { data } = await supabase
      .from('company_members')
      .select('company_id, companies(*)')
      .eq('user_id', user?.id)
      .single();
    
    if (data) {
      setCompany(data.companies);
      fetchClients(data.company_id);
      
      // Sequential Invoice Numbering - Requested by User
      const { count } = await supabase
        .from('invoices')
        .select('*', { count: 'exact', head: true })
        .eq('company_id', data.company_id);
      
      setInvoice(prev => ({ ...prev, invoice_number: `INV-${(count || 0) + 1}` }));
    }
  };

  const fetchClients = async (companyId: string) => {
    const { data } = await supabase
      .from('clients')
      .select('*')
      .eq('company_id', companyId)
      .order('name');
    if (data) setClients(data);
  };

  const handleClientChange = (clientId: string) => {
    setSelectedClientId(clientId);
    if (clientId === 'new') {
      setInvoice({ ...invoice, client_name: '', client_address: '', client_pan: '' });
      setSaveClient(true);
    } else {
      const client = clients.find(c => c.id === clientId);
      if (client) {
        setInvoice({ 
          ...invoice, 
          client_name: client.name, 
          client_address: client.address || '', 
          client_pan: client.pan || '' 
        });
        setSaveClient(false);
      }
    }
  };

  const updateItem = (id: number, field: string, value: any) => {
    setItems(items.map(item => {
      if (item.id === id) {
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

  const removeItem = (id: number) => {
    if (items.length > 1) {
      setItems(items.filter(i => i.id !== id));
    }
  };

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const total = subtotal - Number(invoice.discount);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company || !user) return;
    setLoading(true);

    try {
      let clientId = selectedClientId === 'new' ? null : selectedClientId;

      // 1. Save Client if requested
      if (saveClient && selectedClientId === 'new') {
        const { data: newClient, error: clientError } = await supabase
          .from('clients')
          .insert({
            company_id: company.id,
            name: invoice.client_name,
            address: invoice.client_address,
            pan: invoice.client_pan
          })
          .select()
          .single();
        
        if (clientError) {
          console.error('Client creation error:', clientError);
          throw new Error(clientError.message);
        }
        clientId = newClient.id;
      }

      // 2. Create Invoice
      const { data: invData, error: invError } = await supabase
        .from('invoices')
        .insert({
          company_id: company.id,
          client_id: clientId,
          invoice_number: invoice.invoice_number,
          client_name: invoice.client_name,
          client_address: invoice.client_address,
          client_pan: invoice.client_pan,
          date: invoice.date,
          due_date: invoice.due_date,
          subtotal: subtotal,
          discount: invoice.discount,
          total: total,
          status: 'draft'
        })
        .select()
        .single();

      if (invError) {
        console.error('Invoice creation error:', invError);
        throw new Error(invError.message);
      }

      // 3. Create Items
      if (invData) {
        const { error: itemsError } = await supabase
          .from('invoice_items')
          .insert(items.map(i => ({
            invoice_id: invData.id,
            description: i.description,
            quantity: i.quantity,
            rate: i.rate,
            amount: i.amount
          })));

        if (itemsError) {
          console.error('Invoice items error:', itemsError);
          throw new Error(itemsError.message);
        }
      }

      router.push('/invoices');
    } catch (error: any) {
      console.error('Final Submission Error:', error);
      alert(error.message || 'Failed to save invoice');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => router.back()}
          className="p-2 -ml-2 text-white/40 hover:text-white transition-colors flex items-center gap-2 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back</span>
        </button>
        <h1 className="text-xl font-bold">New Invoice</h1>
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
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-bold text-white/30 uppercase tracking-widest ml-1">Select Client</label>
              <select
                className="w-full bg-[#1c1c1e] text-white border border-white/10 rounded-2xl py-4 px-5 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all font-medium appearance-none cursor-pointer"
                value={selectedClientId}
                onChange={(e) => handleClientChange(e.target.value)}
              >
                <option value="" className="bg-[#1c1c1e] text-white">Manual Entry</option>
                <option value="new" className="bg-[#1c1c1e] text-white">+ Add Client</option>
                {clients.map(c => (
                  <option key={c.id} value={c.id} className="bg-[#1c1c1e] text-white">{c.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-white/30 uppercase tracking-widest ml-1">Client Name</label>
              <input 
                required
                type="text"
                placeholder="Client name"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all font-medium"
                value={invoice.client_name}
                onChange={(e) => setInvoice({...invoice, client_name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/30 uppercase tracking-widest ml-1">PAN (Optional)</label>
              <div className="relative">
                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input 
                  type="text"
                  placeholder="PAN number"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-11 pr-5 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all font-medium"
                  value={invoice.client_pan}
                  onChange={(e) => setInvoice({...invoice, client_pan: e.target.value})}
                />
              </div>
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-bold text-white/30 uppercase tracking-widest ml-1">Address</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input 
                  type="text"
                  placeholder="Billing address"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-11 pr-5 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all font-medium"
                  value={invoice.client_address}
                  onChange={(e) => setInvoice({...invoice, client_address: e.target.value})}
                />
              </div>
            </div>

            {selectedClientId === 'new' && (
              <div className="md:col-span-2 flex items-center gap-2 px-2">
                <input 
                  type="checkbox" 
                  id="save-client"
                  className="w-4 h-4 rounded bg-white/5 border-white/10 text-blue-500 focus:ring-blue-500/50"
                  checked={saveClient}
                  onChange={(e) => setSaveClient(e.target.checked)}
                />
                <label htmlFor="save-client" className="text-sm font-medium text-white/60">
                  Save this client
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Invoice Date Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-[#1c1c1e] p-6 rounded-[2rem] border border-white/5 shadow-xl space-y-2">
             <label className="text-xs font-bold text-white/30 uppercase tracking-widest ml-1 block">Invoice #</label>
             <input 
               required
               type="text"
               className="w-full bg-transparent border-none p-0 text-white font-bold focus:ring-0"
               value={invoice.invoice_number}
               onChange={(e) => setInvoice({...invoice, invoice_number: e.target.value})}
             />
           </div>
           <div className="bg-[#1c1c1e] p-6 rounded-[2rem] border border-white/5 shadow-xl space-y-2">
             <label className="text-xs font-bold text-white/30 uppercase tracking-widest ml-1 block">Date</label>
             <div className="relative">
               <input 
                 required
                 type="date"
                 className="w-full bg-transparent border-none p-0 text-white font-bold focus:ring-0 appearance-none cursor-pointer"
                 value={invoice.date}
                 onChange={(e) => setInvoice({...invoice, date: e.target.value})}
               />
             </div>
           </div>
           <div className="bg-[#1c1c1e] p-6 rounded-[2rem] border border-white/5 shadow-xl space-y-2">
             <label className="text-xs font-bold text-white/30 uppercase tracking-widest ml-1 block">Due Date</label>
             <div className="relative">
               <input 
                 required
                 type="date"
                 className="w-full bg-transparent border-none p-0 text-white font-bold focus:ring-0 appearance-none cursor-pointer"
                 value={invoice.due_date}
                 onChange={(e) => setInvoice({...invoice, due_date: e.target.value})}
               />
             </div>
           </div>
        </div>

        {/* Items Section */}
        <div className="bg-[#1c1c1e] p-8 rounded-[2.5rem] border border-white/5 shadow-xl overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-lg">Items</h3>
            <button 
              type="button" 
              onClick={addItem}
              className="text-blue-400 font-bold text-sm flex items-center gap-1 hover:text-blue-300 transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Item
            </button>
          </div>

          <div className="space-y-4">
            <div className="hidden md:grid grid-cols-12 gap-4 px-2 mb-2">
              <div className="col-span-6 text-[10px] font-bold text-white/20 uppercase tracking-widest">Description</div>
              <div className="col-span-2 text-[10px] font-bold text-white/20 uppercase tracking-widest">Qty</div>
              <div className="col-span-2 text-[10px] font-bold text-white/20 uppercase tracking-widest">Rate</div>
              <div className="col-span-2 text-[10px] font-bold text-white/20 uppercase tracking-widest text-right">Amount</div>
            </div>

            {items.map((item) => (
              <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 md:p-2 bg-white/[0.02] md:bg-transparent rounded-2xl border border-white/5 md:border-none relative group">
                <div className="col-span-6">
                  <input 
                    required
                    placeholder="Item description"
                    className="w-full bg-white/5 md:bg-white/[0.03] border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-blue-500/30 transition-all"
                    value={item.description}
                    onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                  />
                </div>
                <div className="col-span-2">
                  <input 
                    required
                    type="number"
                    className="w-full bg-white/5 md:bg-white/[0.03] border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-blue-500/30 transition-all text-center"
                    value={item.quantity}
                    onChange={(e) => updateItem(item.id, 'quantity', e.target.value)}
                  />
                </div>
                <div className="col-span-2">
                  <input 
                    required
                    type="number"
                    className="w-full bg-white/5 md:bg-white/[0.03] border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-blue-500/30 transition-all text-center"
                    value={item.rate}
                    onChange={(e) => updateItem(item.id, 'rate', e.target.value)}
                  />
                </div>
                <div className="col-span-2 flex items-center justify-end gap-3">
                  <span className="font-bold text-sm">{company?.currency} {item.amount.toLocaleString()}</span>
                  <button 
                    type="button" 
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-white/10 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-col items-end space-y-4 pr-4">
             <div className="flex items-center gap-12 text-white/40 font-medium">
               <span>Subtotal</span>
               <span className="text-white font-bold">{company?.currency} {subtotal.toLocaleString()}</span>
             </div>
             <div className="flex items-center gap-8">
               <span className="text-white/40 font-medium">Discount</span>
               <div className="relative w-32">
                 <input 
                   type="number"
                   className="w-full bg-white/5 border border-white/10 rounded-xl py-1 px-3 text-sm text-right font-bold focus:ring-0 transition-all"
                   value={invoice.discount}
                   onChange={(e) => setInvoice({...invoice, discount: Number(e.target.value)})}
                 />
               </div>
             </div>
             <div className="pt-4 border-t border-white/10 flex items-center gap-12 text-xl">
               <span className="font-bold">Total</span>
               <span className="font-black text-blue-500 uppercase tracking-tighter">
                 {company?.currency} {total.toLocaleString()}
               </span>
             </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button 
            type="submit"
            disabled={loading}
            className="flex-1 bg-white text-black font-black py-5 rounded-[2rem] flex items-center justify-center gap-3 shadow-2xl hover:bg-white/90 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {loading ? 'Generating...' : (
              <>
                <FileText className="w-6 h-6" /> Generate Invoice
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
