'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Send, Shield } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyId: string;
}

export const InviteModal = ({ isOpen, onClose, companyId }: InviteModalProps) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // In a real app, this would send an email and create a pending member
    // For now, we simulate success
    await new Promise(r => setTimeout(r, 1000));
    setSent(true);
    setLoading(false);
    setTimeout(() => {
      onClose();
      setSent(false);
      setEmail('');
    }, 2000);
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
            className="relative w-full max-w-md bg-[#0c0c0d] border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl p-8 lg:p-12 text-center"
          >
            <button onClick={onClose} className="absolute top-8 right-8 text-white/20 hover:text-white transition-colors">
              <X className="w-6 h-6" />
            </button>

            {sent ? (
              <div className="py-10 space-y-4 animate-in fade-in zoom-in duration-500">
                 <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto text-green-400">
                    <Send className="w-10 h-10" />
                 </div>
                 <h2 className="text-2xl font-black text-white">Invite Sent!</h2>
                 <p className="text-white/40 font-medium">We've sent an invitation to {email}.</p>
              </div>
            ) : (
              <>
                 <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mx-auto text-blue-400 mb-8 ring-1 ring-blue-500/20">
                    <Shield className="w-8 h-8" />
                 </div>
                 <h2 className="text-3xl font-black tracking-tight text-white mb-2 italic">Invite Team</h2>
                 <p className="text-white/40 text-sm font-medium mb-10">Add reliable members to your company.</p>

                 <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-1 text-left">
                       <label className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-black ml-1">Email Address</label>
                       <div className="relative">
                          <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                          <input 
                            required 
                            type="email"
                            placeholder="colleague@company.com"
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-5 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all font-medium"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                       </div>
                    </div>
                    <button 
                      type="submit" 
                      disabled={loading}
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-blue-500/10 disabled:opacity-50"
                    >
                      {loading ? 'Sending...' : 'Send Invitation'}
                    </button>
                 </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
