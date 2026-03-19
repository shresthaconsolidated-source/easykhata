'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';

export const FloatingChatMockup = () => {
  return (
    <div className="relative w-full max-w-[500px] mx-auto perspective-1000 mt-20 lg:mt-0">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-600/10 blur-[120px] rounded-full -z-10" />

      {/* Main Container */}
      <motion.div
        initial={{ y: 40, opacity: 0, rotateX: 10 }}
        animate={{ y: 0, opacity: 1, rotateX: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="bg-[#0c0c0d] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden backdrop-blur-3xl ring-1 ring-white/5"
      >
        {/* Chat Header */}
        <div className="px-8 py-6 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center border border-blue-500/20">
                <Sparkles className="w-5 h-5 text-blue-400" />
             </div>
             <div>
                <p className="text-sm font-black text-white/90 tracking-tight">AI Bookkeeper</p>
                <div className="flex items-center gap-1.5">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                   <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Always Active</p>
                </div>
             </div>
          </div>
          <div className="flex gap-1.5">
             <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
             <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
             <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
          </div>
        </div>

        {/* Chat Feed */}
        <div className="p-8 space-y-8">
           {/* User Message */}
           <motion.div 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.5 }}
             className="flex flex-col items-end gap-2"
           >
              <div className="bg-blue-600 px-5 py-3.5 rounded-[1.2rem] rounded-tr-none text-sm font-bold shadow-lg shadow-blue-900/20 max-w-[80%]">
                 Taxi 2000 yesterday
              </div>
              <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Sent 14:02</p>
           </motion.div>

           {/* AI Response */}
           <motion.div 
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 1 }}
             className="flex flex-col items-start gap-4 w-full"
           >
              <div className="bg-white/[0.03] border border-white/10 p-5 rounded-[1.5rem] rounded-tl-none w-full shadow-2xl">
                 <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-3 h-3 text-blue-400" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/40 italic">Instant Detection</span>
                 </div>
                 
                 <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                       <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                          <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em] mb-1">Amount</p>
                          <p className="text-xl font-black tracking-tighter text-white/90">₹2,000.00</p>
                       </div>
                       <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                          <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em] mb-1 text-right">Date</p>
                          <p className="text-xs font-black tracking-tight text-white/70 text-right">Mar 18, 2026</p>
                       </div>
                    </div>

                    <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-between group cursor-pointer hover:bg-blue-500/20 transition-all duration-300">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                             <div className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                          </div>
                          <div>
                             <p className="text-[8px] font-black text-blue-400/50 uppercase tracking-[0.2em]">Category</p>
                             <p className="text-xs font-black text-white/90">Transportation</p>
                          </div>
                       </div>
                       <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
                          <ArrowRight className="w-4 h-4" />
                       </div>
                    </div>
                 </div>
              </div>
              <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Processed in 0.4s</p>
           </motion.div>
        </div>

        {/* Input Bar Placeholder */}
        <div className="px-8 py-6 bg-gradient-to-t from-black/40 to-transparent border-t border-white/5">
           <div className="h-12 w-full bg-white/[0.03] border border-white/10 rounded-full flex items-center px-6 gap-3">
              <div className="w-4 h-4 rounded-full bg-white/10" />
              <div className="h-2 w-32 bg-white/10 rounded-full" />
              <div className="ml-auto w-8 h-8 rounded-full bg-white/5" />
           </div>
        </div>
      </motion.div>

      {/* Floating Elements Around */}
      <motion.div 
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-12 -right-12 p-6 bg-[#0c0c0d]/80 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl shadow-blue-500/5 hidden lg:block"
      >
         <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
               <div className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>
            <div>
               <p className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] mb-0.5 text-left">P&L Status</p>
               <p className="text-xs font-black text-emerald-400">+$12,400.00</p>
            </div>
         </div>
      </motion.div>
    </div>
  );
};
