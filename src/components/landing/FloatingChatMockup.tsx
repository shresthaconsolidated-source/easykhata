'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Send, ArrowUpRight, ArrowDownRight, CheckCircle2, User, MoreVertical, PieChart, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

export const FloatingChatMockup = () => {
  return (
    <div className="relative w-full max-w-[320px] mx-auto perspective-1000">
      {/* Background Neon Glows - Optimized for Mobile Factor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[700px] bg-cyan-500/[0.15] blur-[120px] rounded-full -z-10 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-purple-600/[0.1] blur-[100px] rounded-full -z-10 pointer-events-none" />

      {/* Phone Frame - Premium Glass */}
      <motion.div
        initial={{ y: 40, opacity: 0, rotateY: 10 }}
        whileInView={{ y: 0, opacity: 1, rotateY: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full aspect-[9/19.5] bg-[#0c0c0e] rounded-[3rem] border-[8px] border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.8),_0_0_80px_rgba(6,182,212,0.1)] overflow-hidden ring-4 ring-white/5 flex flex-col"
      >
        {/* Notch Area */}
        <div className="absolute top-0 inset-x-0 h-8 flex justify-center items-end pb-1.5 z-20">
           <div className="w-24 h-5 bg-white/5 rounded-full backdrop-blur-md border border-white/5 flex items-center justify-end px-3">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
           </div>
        </div>

        {/* Status Bar */}
        <div className="h-14 flex items-end justify-between px-8 pb-2">
           <span className="text-[10px] font-black tracking-tight text-white/40 italic">9:41</span>
           <div className="flex gap-1.5">
              <div className="w-3.5 h-2 border border-white/20 rounded-sm" />
              <div className="w-3.5 h-2 bg-white/20 rounded-sm" />
           </div>
        </div>

        {/* Mobile App Screen */}
        <div className="flex-1 flex flex-col bg-gradient-to-b from-white/[0.03] to-transparent overflow-hidden">
           {/* App Header */}
           <div className="px-6 py-4 flex items-center justify-between border-b border-white/5">
              <div className="flex items-center gap-3">
                 <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                    <Sparkles className="w-4 h-4 text-white" />
                 </div>
                 <div>
                    <h4 className="text-[11px] font-black text-white uppercase tracking-wider">easyKhata AI</h4>
                    <span className="text-[8px] text-cyan-400 font-bold uppercase tracking-widest animate-pulse">Listening...</span>
                 </div>
              </div>
              <MoreVertical className="w-4 h-4 text-white/20" />
           </div>

           {/* Metrics Card In-App */}
           <div className="px-6 py-6">
              <div className="p-5 rounded-3xl bg-white/[0.04] border border-white/10 shadow-xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 blur-2xl -translate-y-1/2 translate-x-1/2" />
                 <p className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] mb-2">Today's Revenue</p>
                 <div className="flex items-end justify-between">
                    <h3 className="text-2xl font-black tracking-tight text-white italic">₹24,850</h3>
                    <div className="flex items-center gap-1 text-[8px] font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                       <ArrowUpRight className="w-3 h-3" /> +12%
                    </div>
                 </div>
              </div>
           </div>

           {/* Chat Feed */}
           <div className="flex-1 px-6 space-y-5 overflow-hidden">
              <div className="flex flex-col items-end">
                 <motion.div 
                   initial={{ x: 10, opacity: 0 }}
                   whileInView={{ x: 0, opacity: 1 }}
                   transition={{ delay: 0.5 }}
                   className="px-4 py-2.5 bg-cyan-500 text-black font-black text-[10px] rounded-2xl rounded-tr-sm shadow-[0_10px_20px_rgba(6,182,212,0.3)]"
                 >
                    "Log 1200 for food"
                 </motion.div>
              </div>

              <div className="flex items-start gap-3">
                 <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
                    <User className="w-3 h-3 text-white/20" />
                 </div>
                 <motion.div 
                   initial={{ x: -10, opacity: 0 }}
                   whileInView={{ x: 0, opacity: 1 }}
                   transition={{ delay: 0.8 }}
                   className="p-4 bg-white/[0.03] border border-white/5 rounded-2xl rounded-tl-sm w-full"
                 >
                    <div className="flex items-center justify-between mb-3">
                       <span className="text-[8px] font-black text-cyan-400 uppercase tracking-widest italic">Success</span>
                       <CheckCircle2 className="w-3.5 h-3.5 text-cyan-500 drop-shadow-[0_0_5px_rgba(6,182,212,0.8)]" />
                    </div>
                    <div className="flex items-center gap-3">
                       <div className="text-xl">🍲</div>
                       <div>
                          <p className="text-[12px] font-black text-white">₹1,200.00</p>
                          <p className="text-[8px] text-white/30 font-bold uppercase tracking-widest">Personal Expense</p>
                       </div>
                    </div>
                 </motion.div>
              </div>
           </div>

           {/* Mock Input Bar */}
           <div className="p-6">
              <div className="h-12 w-full bg-white/[0.04] border border-white/10 rounded-2xl flex items-center px-4 gap-3">
                 <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center">
                    <div className="w-2.5 h-2.5 bg-cyan-500/20 rounded-full animate-pulse" />
                 </div>
                 <div className="flex-1 text-[9px] font-bold text-white/20 italic">Say something...</div>
                 <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-black">
                    <Send className="w-3.5 h-3.5 ml-0.5" />
                 </div>
              </div>
           </div>
        </div>

        {/* Bottom Home Indicator */}
        <div className="h-8 flex justify-center items-center">
           <div className="w-24 h-1 bg-white/10 rounded-full" />
        </div>
      </motion.div>

      {/* Accompanying Floating Card - Left Side */}
      <motion.div 
        initial={{ x: -20, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute -left-12 top-20 p-4 bg-white/[0.03] border border-white/10 rounded-2xl shadow-2xl backdrop-blur-3xl hidden lg:block border-l-cyan-500/50"
      >
         <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400">
               <Zap className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-black text-white/60 uppercase tracking-widest italic leading-none">Real-time <br /> Processing</span>
         </div>
      </motion.div>

      {/* Accompanying Floating Card - Right Side */}
      <motion.div 
        initial={{ x: 20, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute -right-16 bottom-32 p-5 bg-white/[0.03] border border-white/10 rounded-[2rem] shadow-2xl backdrop-blur-3xl hidden lg:block border-r-purple-500/50"
      >
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
               <PieChart className="w-6 h-6 text-purple-400" />
            </div>
            <div>
               <p className="text-[9px] font-black text-white/40 uppercase tracking-widest leading-tight">Monthly Target</p>
               <p className="text-sm font-black text-white italic">₹85,000 Safe</p>
            </div>
         </div>
      </motion.div>

      {/* Decorative Data Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-visible">
         {[1, 2, 3, 4].map((i) => (
           <motion.div
             key={i}
             animate={{ 
               y: [0, -20, 0],
               opacity: [0.2, 0.5, 0.2]
             }}
             transition={{ 
               duration: 3 + i, 
               repeat: Infinity,
               delay: i * 0.5
             }}
             className={cn(
               "absolute w-1.5 h-1.5 rounded-full",
               i % 2 === 0 ? "bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,1)]" : "bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,1)]"
             )}
             style={{
               top: `${20 * i}%`,
               left: i % 2 === 0 ? '-10%' : '110%'
             }}
           />
         ))}
      </div>
    </div>
  );
};
