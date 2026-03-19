'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Tag, Plus } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyId: string;
  onUpdate: () => void;
}

export const CategoryModal = ({ isOpen, onClose, companyId, onUpdate }: CategoryModalProps) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await supabase
      .from('categories')
      .insert({
        name,
        type,
        company_id: companyId
      });

    if (!error) {
      onUpdate();
      onClose();
      setName('');
    }
    setLoading(false);
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
            className="relative w-full max-w-md bg-[#0c0c0d] border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl p-8 lg:p-12"
          >
            <button onClick={onClose} className="absolute top-8 right-8 text-white/20 hover:text-white transition-colors">
              <X className="w-6 h-6" />
            </button>

            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto text-emerald-400 mb-8 ring-1 ring-emerald-500/20">
              <Tag className="w-8 h-8" />
            </div>
            
            <h2 className="text-3xl font-black tracking-tight text-white mb-2 text-center italic">New Category</h2>
            <p className="text-white/40 text-sm font-medium mb-10 text-center">Organize your finances better.</p>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-4">
                <div className="space-y-1">
                   <label className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-black ml-1">Type</label>
                   <div className="flex p-1.5 bg-white/5 rounded-2xl border border-white/5">
                      <button 
                        type="button"
                        onClick={() => setType('expense')}
                        className={cn(
                          "flex-1 py-3 text-[10px] font-black uppercase tracking-[0.1em] rounded-xl transition-all",
                          type === 'expense' ? "bg-red-500 text-white shadow-lg" : "text-white/20 hover:text-white/40"
                        )}
                      >
                        Expense
                      </button>
                      <button 
                        type="button"
                        onClick={() => setType('income')}
                        className={cn(
                          "flex-1 py-3 text-[10px] font-black uppercase tracking-[0.1em] rounded-xl transition-all",
                          type === 'income' ? "bg-green-500 text-white shadow-lg" : "text-white/20 hover:text-white/40"
                        )}
                      >
                        Income
                      </button>
                   </div>
                </div>

                <div className="space-y-1">
                   <label className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-black ml-1">Category Name</label>
                   <input 
                     required 
                     placeholder="e.g. Marketing, Travel, Sales..."
                     className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all font-medium"
                     value={name}
                     onChange={(e) => setName(e.target.value)}
                   />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-blue-500/10 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? 'Adding...' : <><Plus className="w-5 h-5" /> Add Category</>}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
