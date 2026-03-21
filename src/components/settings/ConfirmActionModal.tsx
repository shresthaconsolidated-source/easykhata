'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  title: string;
  description: string;
  actionText: string;
  isDestructive?: boolean;
}

export const ConfirmActionModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  description, 
  actionText,
  isDestructive = true
}: ConfirmActionModalProps) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirm = async () => {
    setIsProcessing(true);
    await onConfirm();
    setIsProcessing(false);
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
            className="relative w-full max-w-md bg-[#1c1c1e] rounded-[3rem] border border-white/10 shadow-2xl overflow-hidden"
          >
            <div className="p-8 pb-0 flex justify-between items-start">
              <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center ring-1 ${isDestructive ? 'bg-red-500/10 ring-red-500/20' : 'bg-orange-500/10 ring-orange-500/20'}`}>
                <AlertTriangle className={`w-8 h-8 ${isDestructive ? 'text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'text-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.5)]'}`} />
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
                <h2 className="text-3xl font-black tracking-tight text-white italic uppercase">{title}</h2>
                <p className="text-white/40 leading-relaxed font-medium">
                  {description}
                </p>
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
                  disabled={isProcessing}
                  className={`flex-[1.5] py-4 disabled:opacity-50 text-white font-black rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-2 group ${isDestructive ? 'bg-red-500 hover:bg-red-600 shadow-xl shadow-red-500/20' : 'bg-orange-500 hover:bg-orange-600 shadow-xl shadow-orange-500/20'}`}
                >
                  {isProcessing ? 'Processing...' : actionText}
                </button>
              </div>
            </div>
            
            <div className={`h-2 w-full bg-gradient-to-r ${isDestructive ? 'from-red-500/50 via-red-500 to-red-500/50' : 'from-orange-500/50 via-orange-500 to-orange-500/50'}`} />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
