'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Link as LinkIcon, Shield, Copy, Check } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyId: string;
}

export const InviteModal = ({ isOpen, onClose, companyId }: InviteModalProps) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [inviteLink, setInviteLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [errorText, setErrorText] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorText('');
    
    // First, check if the user already has an easyKhata account
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (existingUser) {
      // User exists! Add them directly to the team
      const { error: joinError } = await supabase
        .from('company_members')
        .insert({ company_id: companyId, user_id: existingUser.id, role: 'member' });
      
      if (joinError) {
        if (joinError.code === '23505') { 
          setErrorText("This user is already in your team.");
        } else {
          setErrorText("Failed to add user to team.");
        }
        setLoading(false);
        return;
      }
      
      setInviteLink('DIRECT_ADDED');
      setLoading(false);
      return;
    }

    // User is new, generate an invite link
    const { data, error } = await supabase
      .from('invitations')
      .insert({ email, company_id: companyId, role: 'member' })
      .select('token')
      .single();

    if (error) {
      console.error("Error creating invite:", error);
      setErrorText("Failed to generate invitation.");
      setLoading(false);
      return;
    }

    if (data && data.token) {
      const link = `${window.location.origin}/invite?token=${data.token}`;
      setInviteLink(link);
    }
    setLoading(false);
  };

  const handleCopy = async () => {
    if (!inviteLink) return;
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const resetAndClose = () => {
    onClose();
    setTimeout(() => {
      setInviteLink('');
      setEmail('');
      setErrorText('');
      setCopied(false);
    }, 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={resetAndClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-xl"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-[#0c0c0d] border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl p-8 lg:p-12 text-center"
          >
            <button onClick={resetAndClose} className="absolute top-8 right-8 text-white/20 hover:text-white transition-colors">
              <X className="w-6 h-6" />
            </button>

            {inviteLink === 'DIRECT_ADDED' ? (
              <div className="py-6 space-y-6 animate-in fade-in zoom-in duration-500">
                 <div className="w-20 h-20 rounded-[2rem] bg-emerald-500/10 flex items-center justify-center mx-auto text-emerald-400 ring-1 ring-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                    <Check className="w-8 h-8" />
                 </div>
                 <div>
                   <h2 className="text-2xl font-black text-white mb-2 italic uppercase">Member Added!</h2>
                   <p className="text-white/40 font-medium text-sm px-4">This user already has an easyKhata account, so they were instantly added to your team. No invite link needed!</p>
                 </div>
                 
                 <button 
                   onClick={resetAndClose}
                   className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-black py-4 rounded-2xl transition-all shadow-xl shadow-emerald-500/10 active:scale-95"
                 >
                   Got it
                 </button>
              </div>
            ) : inviteLink ? (
              <div className="py-6 space-y-6 animate-in fade-in zoom-in duration-500">
                 <div className="w-20 h-20 rounded-[2rem] bg-emerald-500/10 flex items-center justify-center mx-auto text-emerald-400 ring-1 ring-emerald-500/20">
                    <LinkIcon className="w-8 h-8" />
                 </div>
                 <div>
                   <h2 className="text-2xl font-black text-white mb-2">Invite Link Ready!</h2>
                   <p className="text-white/40 font-medium text-sm px-4">Copy and send this secure link to {email}. It will grant them access to your company.</p>
                 </div>
                 
                 <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity" />
                    <div className="relative flex items-center bg-white/[0.03] border border-white/10 p-3 rounded-2xl">
                       <input 
                         type="text" 
                         value={inviteLink} 
                         readOnly 
                         className="flex-1 bg-transparent text-white/80 text-sm font-medium outline-none px-2 truncate"
                       />
                       <button 
                         onClick={handleCopy}
                         className="ml-2 flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95"
                       >
                         {copied ? <><Check className="w-3.5 h-3.5 text-emerald-400" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
                       </button>
                    </div>
                 </div>
                 
                 <button 
                   onClick={resetAndClose}
                   className="w-full font-bold text-white/50 hover:text-white transition-colors text-sm pt-4"
                 >
                   Done
                 </button>
              </div>
            ) : (
              <>
                 <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mx-auto text-blue-400 mb-8 ring-1 ring-blue-500/20">
                    <Shield className="w-8 h-8" />
                 </div>
                 <h2 className="text-3xl font-black tracking-tight text-white mb-2 italic">Invite Team</h2>
                 <p className="text-white/40 text-sm font-medium mb-10">Generate a secure link to invite members.</p>

                 <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-1 text-left">
                       <label className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-black ml-1">Email Address</label>
                       <div className="relative">
                          <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                          <input 
                            required 
                            type="email"
                            placeholder="colleague@company.com"
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-5 focus:ring-2 focus:ring-blue-500/50 outline-none text-white transition-all font-medium"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                       </div>
                    </div>
                    
                    {errorText && (
                      <p className="text-xs font-bold text-red-400 text-left bg-red-500/10 p-3 rounded-xl border border-red-500/20">{errorText}</p>
                    )}

                    <button 
                      type="submit" 
                      disabled={loading || !email}
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-blue-500/10 disabled:opacity-50"
                    >
                      {loading ? 'Generating Link...' : 'Generate Invite Link'}
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
