'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useCompany } from '@/contexts/CompanyContext';
import { Package, Plus, Link as LinkIcon, Edit, PackageSearch, Tags, ArrowRight } from 'lucide-react';
import { formatCurrency, cn } from '@/lib/utils';
import Link from 'next/link';

export default function InventoryPage() {
  const { user } = useAuth();
  const { company } = useCompany();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [price, setPrice] = useState('');
  const [cost, setCost] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');

  useEffect(() => {
    if (company) fetchInventory();
  }, [company]);

  const fetchInventory = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('inventory_items')
      .select('*')
      .eq('company_id', company?.id)
      .order('name');
    
    if (data) setItems(data);
    setLoading(false);
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company || !name) return;

    const { data, error } = await supabase
      .from('inventory_items')
      .insert({
        company_id: company.id,
        name,
        sku: sku || null,
        price: price ? parseFloat(price) : null,
        cost: cost ? parseFloat(cost) : null,
        stock_quantity: stockQuantity ? parseFloat(stockQuantity) : 0
      })
      .select()
      .single();

    if (error) {
      alert('Error adding item: ' + error.message);
    } else if (data) {
      setItems(prev => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)));
      setShowAddModal(false);
      resetForm();
    }
  };

  const resetForm = () => {
    setName('');
    setSku('');
    setPrice('');
    setCost('');
    setStockQuantity('');
  };

  const totalValue = items.reduce((sum, item) => sum + ((item.cost || 0) * (item.stock_quantity || 0)), 0);

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-black text-white tracking-tight flex items-center gap-3">
             <Package className="w-8 h-8 text-blue-500" />
             Inventory
          </h1>
          <p className="text-white/40 mt-1">Manage your products and stock levels.</p>
        </div>

        <button 
          onClick={() => setShowAddModal(true)}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-black uppercase tracking-wider transition-all shadow-lg shadow-blue-500/20 active:scale-95 flex items-center gap-2 justify-center w-full md:w-auto shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Item
        </button>
      </div>

      <div className="bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20 p-6 rounded-3xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-40 group-hover:scale-110 transition-all">
           <Tags className="w-16 h-16 text-blue-500" />
        </div>
        <p className="text-[10px] font-black uppercase text-blue-400/80 tracking-widest mb-1">Total Inventory Value (at cost)</p>
        <p className="text-4xl font-black text-white">{formatCurrency(totalValue, company?.currency)}</p>
      </div>

      <div className="bg-[#0c0c0d] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        {loading ? (
          <div className="p-12 text-center text-white/40 animate-pulse font-bold tracking-widest text-sm uppercase">Loading...</div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center text-white/40 flex flex-col items-center gap-4">
             <PackageSearch className="w-12 h-12 text-white/20" />
             <p className="font-bold tracking-widest text-sm uppercase">No inventory items found.</p>
             <p className="text-xs max-w-sm">Items you hashtag (like #hoodie) in chat will appear here automatically.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/[0.02] border-b border-white/10">
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-white/40">Item / SKU</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-white/40">Stock</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-white/40">Cost Price</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-white/40">Sell Price</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-white/40 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {items.map(item => (
                  <tr key={item.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="p-4">
                      <p className="font-black text-white">#{item.name}</p>
                      {item.sku && <p className="text-xs text-white/40 font-mono mt-0.5">{item.sku}</p>}
                    </td>
                    <td className="p-4">
                      <span className={cn(
                        "font-black text-lg px-3 py-1 rounded-xl bg-white/5 border border-white/10 shadow-inner inline-flex items-center gap-2",
                        item.stock_quantity <= 0 ? "text-red-400" : (item.stock_quantity <= 5 ? "text-amber-400" : "text-green-400")
                      )}>
                        {item.stock_quantity}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-white/60">
                      {item.cost ? formatCurrency(item.cost, company?.currency) : '-'}
                    </td>
                    <td className="p-4 font-bold text-white/60">
                      {item.price ? formatCurrency(item.price, company?.currency) : '-'}
                    </td>
                    <td className="p-4 text-right">
                      <Link href={`/chat`} className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-colors group-hover:bg-blue-500/20 group-hover:text-blue-400">
                        <LinkIcon className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setShowAddModal(false)} />
          <div className="bg-[#0c0c0d] border border-white/10 w-full max-w-md rounded-3xl shadow-2xl relative z-10 overflow-hidden">
            <div className="p-6 border-b border-white/5">
              <h2 className="text-xl font-black text-white uppercase tracking-wider">Add Item</h2>
            </div>
            <form onSubmit={handleAddItem} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-white/40">Product Name *</label>
                <div className="relative flex items-center">
                  <span className="absolute left-4 font-black text-white/40">#</span>
                  <input required value={name} onChange={e => setName(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-4 py-3 text-white focus:border-blue-500 outline-none" placeholder="black-hoodie" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-white/40">SKU (Optional)</label>
                <input value={sku} onChange={e => setSku(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none" placeholder="BK-HD-L" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-white/40">Cost Price</label>
                  <input type="number" step="any" value={cost} onChange={e => setCost(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none" placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-white/40">Sell Price</label>
                  <input type="number" step="any" value={price} onChange={e => setPrice(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none" placeholder="0.00" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-white/40">Initial Stock</label>
                <input type="number" step="any" value={stockQuantity} onChange={e => setStockQuantity(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none" placeholder="0" />
              </div>
              <div className="pt-4">
                <button type="submit" className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-black uppercase tracking-widest shadow-lg transition-all active:scale-95 flex justify-center items-center gap-2">
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
