'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Sparkles, MessageSquare, ShieldCheck, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DemoModal = ({ isOpen, onClose }: DemoModalProps) => {
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
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-5xl bg-[#0c0c0d] border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl shadow-blue-500/10"
          >
            {/* Header */}
            <div className="absolute top-8 right-8 z-10">
              <button 
                onClick={onClose}
                className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all text-white/50 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Visual Side */}
              <div className="p-12 lg:p-16 bg-gradient-to-br from-blue-600/10 via-transparent to-transparent">
                 <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-black uppercase tracking-[0.2em] mb-10 text-blue-400">
                    <Play className="w-3 h-3 fill-current" />
                    Interactive Demo
                 </div>
                 
                 <h2 className="text-4xl lg:text-6xl font-black tracking-tighter text-white mb-8 italic">
                   See how it <br />
                   <span className="text-blue-500">really works.</span>
                 </h2>

                 <div className="space-y-6">
                    {[
                      { icon: MessageSquare, title: "Chat Experience", desc: "Just text 'Taxi 200' and let our AI handle the rest." },
                      { icon: BarChart3, title: "Automated P&L", desc: "Real-time updates as you record every small detail." },
                      { icon: ShieldCheck, title: "Secure & Fast", desc: "Your data is encrypted and synced across all devices." }
                    ].map((item, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + i * 0.1 }}
                        className="flex gap-4"
                      >
                         <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center shrink-0">
                            <item.icon className="w-5 h-5 text-white/40" />
                         </div>
                         <div>
                            <h4 className="font-bold text-white text-sm">{item.title}</h4>
                            <p className="text-white/30 text-xs leading-relaxed">{item.desc}</p>
                         </div>
                      </motion.div>
                    ))}
                 </div>
              </div>

              {/* Preview Side */}
              <div className="relative p-12 lg:p-16 flex items-center justify-center bg-[#070708]">
                 <div className="absolute inset-0 bg-blue-600/5 blur-[100px] rounded-full" />
                 
                 <div className="relative w-full aspect-[4/5] bg-[#1c1c1e] rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden">
                    {/* Mock Chat UI */}
                    <div className="p-6 space-y-4">
                       <div className="flex justify-end">
                          <div className="bg-blue-600 p-3 rounded-2xl rounded-tr-none text-[10px] font-bold text-white shadow-lg">
                             "Sold 2 flower candles for 500 yesterday"
                          </div>
                       </div>
                       
                       <div className="flex justify-start">
                          <div className="w-full bg-white/5 border border-white/5 p-4 rounded-[2rem] rounded-tl-none animate-pulse">
                             <div className="flex items-center gap-2 mb-3">
                                <Sparkles className="w-3 h-3 text-blue-400" />
                                <div className="h-2 w-24 bg-white/10 rounded-full" />
                             </div>
                             <div className="h-20 w-full bg-white/5 rounded-2xl mb-4" />
                             <div className="flex gap-2">
                                <div className="h-8 flex-1 bg-white/10 rounded-xl" />
                                <div className="h-8 flex-1 bg-white/5 rounded-xl underline" />
                             </div>
                          </div>
                       </div>

                       <div className="flex justify-start mt-8">
                          <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center">
                                 <div className="w-2 h-2 rounded-full bg-blue-500" />
                              </div>
                              <div className="h-2 w-32 bg-white/5 rounded-full" />
                          </div>
                       </div>
                    </div>

                    <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-[#1c1c1e] to-transparent">
                       <div className="bg-white/5 h-12 rounded-full border border-white/10 px-4 flex items-center gap-2">
                          <div className="h-2 w-24 bg-white/10 rounded-full" />
                          <div className="ml-auto w-8 h-8 rounded-full bg-blue-600" />
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
