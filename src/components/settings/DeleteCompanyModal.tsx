'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Trash2, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DeleteCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  companyName: string;
}

export const DeleteCompanyModal = ({ isOpen, onClose, onConfirm, companyName }: DeleteCompanyModalProps) => {
  const [confirmText, setConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    if (confirmText !== 'DELETE') return;
    setIsDeleting(true);
    await onConfirm();
    setIsDeleting(false);
    onClose();
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
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-[#1c1c1e] rounded-[3rem] border border-red-500/20 shadow-[0_0_50px_rgba(239,68,68,0.1)] overflow-hidden"
          >
            {/* Header */}
            <div className="p-8 pb-0 flex justify-between items-start">
              <div className="w-16 h-16 rounded-[1.5rem] bg-red-500/10 flex items-center justify-center ring-1 ring-red-500/20">
                <AlertTriangle className="w-8 h-8 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/5 rounded-full transition-colors text-white/20 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <h2 className="text-3xl font-black tracking-tight text-white italic uppercase">Wipe Business Data?</h2>
                <p className="text-white/40 leading-relaxed font-medium">
                  This will permanently delete <span className="text-white font-bold">{companyName}</span> and all associated transactions, invoices, and clients.
                </p>
              </div>

              <div className="bg-red-500/5 border border-red-500/10 p-6 rounded-2xl space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-red-400/60">Warning</p>
                <p className="text-sm text-red-400 font-medium">This action is destructive and cannot be undone.</p>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-white/30 uppercase tracking-widest ml-1">
                  Type <span className="text-white font-black text-red-400">DELETE</span> to confirm
                </label>
                <input 
                  type="text"
                  placeholder="DELETE"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white font-black tracking-widest focus:ring-2 focus:ring-red-500/50 outline-none transition-all placeholder:text-white/5"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
                  autoFocus
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  onClick={onClose}
                  className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white font-black rounded-2xl border border-white/10 transition-all active:scale-95"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleConfirm}
                  disabled={confirmText !== 'DELETE' || isDeleting}
                  className="flex-[1.5] py-4 bg-red-500 hover:bg-red-600 disabled:bg-red-900 disabled:opacity-50 text-white font-black rounded-2xl transition-all shadow-xl shadow-red-500/20 active:scale-95 flex items-center justify-center gap-2 group"
                >
                  {isDeleting ? 'Wiping Data...' : 'Confirm Reset'}
                  {!isDeleting && <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />}
                </button>
              </div>
            </div>

            {/* Bottom Accent */}
            <div className="h-2 w-full bg-gradient-to-r from-red-500/50 via-red-500 to-red-500/50" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
