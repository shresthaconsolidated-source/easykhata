'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Plus, Trash2, Edit2, MapPin, Hash, User } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';

interface ClientManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyId: string;
  onUpdate: () => void;
}

export const ClientManagerModal = ({ isOpen, onClose, companyId, onUpdate }: ClientManagerModalProps) => {
  const [clients, setClients] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingClient, setEditingClient] = useState<any>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ name: '', address: '', pan: '' });

  useEffect(() => {
    if (isOpen && companyId) {
      fetchClients();
    }
  }, [isOpen, companyId]);

  const fetchClients = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('clients')
      .select('*')
      .eq('company_id', companyId)
      .order('name');
    if (data) setClients(data);
    setLoading(false);
  };

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.pan?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this client?')) return;
    const { error } = await supabase.from('clients').delete().eq('id', id);
    if (!error) {
      fetchClients();
      onUpdate();
    } else {
      alert(`Error deleting client: ${error.message}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    if (editingClient) {
      const { error } = await supabase
        .from('clients')
        .update(formData)
        .eq('id', editingClient.id);
      if (!error) {
        setEditingClient(null);
        fetchClients();
        onUpdate();
      }
    } else {
      const { error } = await supabase
        .from('clients')
        .insert({ ...formData, company_id: companyId });
      if (!error) {
        setIsAdding(false);
        fetchClients();
        onUpdate();
      }
    }
    setLoading(false);
  };

  const startEdit = (client: any) => {
    setEditingClient(client);
    setFormData({ name: client.name, address: client.address || '', pan: client.pan || '' });
  };

  const resetForm = () => {
    setEditingClient(null);
    setIsAdding(false);
    setFormData({ name: '', address: '', pan: '' });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-xl"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-[#0c0c0d] border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl flex flex-col max-h-[80vh]"
          >
            {/* Header */}
            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
               <div>
                 <h2 className="text-2xl font-black tracking-tight text-white">Client Manager</h2>
                 <p className="text-white/40 text-sm font-medium">Add, edit, or remove your saved clients.</p>
               </div>
               <button onClick={onClose} className="p-2 text-white/20 hover:text-white transition-colors">
                 <X className="w-6 h-6" />
               </button>
            </div>

            <div className="p-8 overflow-y-auto space-y-6">
               {(isAdding || editingClient) ? (
                 <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="space-y-4">
                       <div className="space-y-1">
                          <label className="text-[10px] text-white/30 uppercase tracking-widest font-black ml-1">Client Name</label>
                          <input 
                            required 
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all font-medium"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                          />
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                             <label className="text-[10px] text-white/30 uppercase tracking-widest font-black ml-1">PAN / Tax ID</label>
                             <input 
                               className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all font-medium"
                               value={formData.pan}
                               onChange={(e) => setFormData({...formData, pan: e.target.value})}
                             />
                          </div>
                          <div className="space-y-1">
                             <label className="text-[10px] text-white/30 uppercase tracking-widest font-black ml-1">Address</label>
                             <input 
                               className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all font-medium"
                               value={formData.address}
                               onChange={(e) => setFormData({...formData, address: e.target.value})}
                             />
                          </div>
                       </div>
                    </div>
                    <div className="flex gap-4">
                       <button 
                         type="submit" 
                         disabled={loading}
                         className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-blue-500/10"
                       >
                         {editingClient ? 'Update Client' : 'Save New Client'}
                       </button>
                       <button 
                         type="button" 
                         onClick={resetForm}
                         className="px-8 font-bold text-white/40 hover:text-white transition-colors"
                       >
                         Cancel
                       </button>
                    </div>
                 </form>
               ) : (
                 <>
                   <div className="relative">
                      <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                      <input 
                        placeholder="Search by name or PAN..." 
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-5 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all font-medium"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                      <button 
                        onClick={() => setIsAdding(true)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-xl transition-all shadow-lg"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                   </div>

                   <div className="space-y-2">
                      {filteredClients.map(c => (
                        <div key={c.id} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.04] transition-all group">
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center font-bold text-blue-400 group-hover:scale-110 transition-transform">
                                 {c.name.charAt(0)}
                              </div>
                              <div>
                                 <p className="font-bold text-white leading-none mb-1">{c.name}</p>
                                 <div className="flex items-center gap-3 text-[10px] text-white/20 uppercase tracking-widest font-bold">
                                    {c.pan && <span className="flex items-center gap-1"><Hash className="w-3 h-3" /> {c.pan}</span>}
                                    {c.address && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {c.address}</span>}
                                 </div>
                              </div>
                           </div>
                           <div className="flex items-center gap-1">
                              <button 
                                onClick={() => startEdit(c)}
                                className="p-2 text-white/10 hover:text-blue-400 transition-colors"
                              >
                                 <Edit2 className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleDelete(c.id)}
                                className="p-2 text-white/10 hover:text-red-400 transition-colors"
                              >
                                 <Trash2 className="w-4 h-4" />
                              </button>
                           </div>
                        </div>
                      ))}
                      {filteredClients.length === 0 && !loading && (
                        <div className="py-20 text-center space-y-4">
                           <User className="w-12 h-12 text-white/5 mx-auto" />
                           <p className="text-white/20 font-medium">No clients found.</p>
                        </div>
                      )}
                   </div>
                 </>
               )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
