'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, BarChart3, PieChart, Send, ArrowUpRight, ArrowDownRight, LayoutDashboard, Settings, Activity, CheckCircle2 } from 'lucide-react';

export const FloatingChatMockup = () => {
  return (
    <div className="relative w-full mx-auto perspective-1000 mt-20 lg:mt-0 lg:scale-110">
      {/* Massive Background Neon Glows - More Vibrant */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] sm:w-[800px] sm:h-[600px] lg:w-[1300px] lg:h-[900px] bg-cyan-500/[0.12] blur-[150px] lg:blur-[280px] rounded-[100%] -z-10 pointer-events-none shadow-[0_0_100px_rgba(6,182,212,0.2)]" />
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-600/[0.1] blur-[140px] rounded-full -z-10 pointer-events-none opacity-60" />

      {/* Main App Container - High Contrast Glass + Sharp Neon Pins */}
      <motion.div
        initial={{ y: 60, opacity: 0, scale: 0.95 }}
        whileInView={{ y: 0, opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full h-[580px] sm:h-[680px] lg:h-[800px] bg-[#0c0c0e]/95 border border-white/10 rounded-[3.5rem] shadow-[0_60px_150px_rgba(0,0,0,1),_0_0_100px_rgba(6,182,212,0.05)] overflow-hidden backdrop-blur-3xl ring-2 ring-white/5 flex flex-col md:flex-row"
      >
        {/* Neon Edge Highlight - Sharp Cyan */}
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_rgba(6,182,212,0.8)]" />
        <div className="absolute inset-y-0 left-0 w-[1px] bg-gradient-to-b from-transparent via-purple-500/50 to-transparent shadow-[0_0_10px_rgba(168,85,247,0.5)]" />

        {/* Sidebar - Neon Detailed & Spacious */}
        <div className="hidden md:flex flex-col w-72 border-r border-white/10 bg-white/[0.03] p-10">
           <div className="flex items-center gap-4 mb-20 group">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.8)] group-hover:rotate-12 transition-transform">
                 <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
              </div>
              <span className="text-2xl font-black tracking-tighter text-white uppercase italic">easyKhata</span>
           </div>

           <div className="space-y-6">
              <div className="flex items-center gap-4 px-6 py-5 rounded-2xl bg-cyan-500 text-black shadow-[0_0_35px_rgba(6,182,212,0.6)] border border-cyan-300/50 group cursor-default">
                 <LayoutDashboard className="w-6 h-6" />
                 <span className="font-black text-xs uppercase tracking-[0.2em]">Dashboard</span>
              </div>
              <div className="flex items-center gap-4 px-6 py-5 rounded-2xl text-white/30 hover:text-cyan-400 hover:bg-white/5 transition-all cursor-pointer group border border-transparent hover:border-cyan-500/20">
                 <BarChart3 className="w-6 h-6 group-hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                 <span className="font-bold text-sm tracking-tight">Ledger Hub</span>
              </div>
              <div className="flex items-center gap-4 px-6 py-5 rounded-2xl text-white/30 hover:text-purple-400 hover:bg-white/5 transition-all cursor-pointer group border border-transparent hover:border-purple-500/20">
                 <Activity className="w-6 h-6 group-hover:drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                 <span className="font-bold text-sm tracking-tight">Analytics</span>
              </div>
           </div>
           
           <div className="mt-auto flex items-center gap-4 px-6 py-5 rounded-2xl text-white/20 hover:text-white transition-all cursor-pointer border border-transparent hover:border-white/10 group">
               <Settings className="w-6 h-6 group-hover:rotate-45 transition-transform" />
               <span className="font-bold text-sm">Hardware</span>
            </div>
        </div>

        {/* Main Workspace */}
        <div className="flex-1 flex flex-col relative overflow-hidden bg-gradient-to-br from-white/[0.02] to-transparent">
           {/* Top Header */}
           <div className="h-28 border-b border-white/10 px-12 flex items-center justify-between">
              <div>
                 <h2 className="text-3xl font-black text-white tracking-tighter italic">Liquid Capital</h2>
                 <p className="text-[10px] text-cyan-400 font-black uppercase tracking-[0.4em] mt-2 flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_rgba(6,182,212,0.8)]" /> Market Analysis
                 </p>
              </div>
              
              <div className="flex items-center gap-8">
                 <div className="h-12 w-40 bg-white/5 border border-white/10 rounded-full px-6 flex items-center justify-between shadow-inner">
                    <div className="w-2.5 h-2.5 rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.6)]" />
                    <span className="text-[10px] font-black tracking-[0.2em] text-white/60">MARCH '26</span>
                 </div>
                 <div className="w-14 h-14 rounded-full bg-gradient-to-br from-white/20 to-white/5 border border-white/20 flex items-center justify-center p-1 shadow-2xl">
                    <div className="w-full h-full rounded-full bg-[#0c0c0e] flex items-center justify-center text-white/40 font-black">BC</div>
                 </div>
              </div>
           </div>

           {/* Metrics Grid - High Def Neon */}
           <div className="p-12 grid grid-cols-1 sm:grid-cols-2 gap-10">
              <div className="p-10 rounded-[2.5rem] bg-white/[0.03] border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.5)] backdrop-blur-3xl group relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-500/20 blur-[60px] -translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-transform duration-1000" />
                 <div className="flex items-center justify-between mb-8">
                    <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Total Revenue</p>
                    <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                       <ArrowUpRight className="w-5 h-5" />
                    </div>
                 </div>
                 <h3 className="text-5xl lg:text-6xl font-black tracking-tighter text-white mb-4 italic drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">₹842,400</h3>
                 <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden mt-6 ring-1 ring-white/10">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: '80%' }}
                      transition={{ duration: 2.5, delay: 0.5 }}
                      className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.8)]"
                    />
                 </div>
              </div>
              
              <div className="p-10 rounded-[2.5rem] bg-white/[0.03] border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.5)] backdrop-blur-3xl group relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/20 blur-[60px] -translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-transform duration-1000" />
                 <div className="flex items-center justify-between mb-8">
                    <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Operational Outflow</p>
                    <div className="p-2 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                       <ArrowDownRight className="w-5 h-5" />
                    </div>
                 </div>
                 <h3 className="text-5xl lg:text-6xl font-black tracking-tighter text-white mb-4 italic drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">₹124,800</h3>
                 <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden mt-6 ring-1 ring-white/10">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: '45%' }}
                      transition={{ duration: 2.5, delay: 0.7 }}
                      className="h-full bg-gradient-to-r from-purple-400 via-pink-500 to-purple-400 shadow-[0_0_25px_rgba(168,85,247,0.8)]"
                    />
                 </div>
              </div>
           </div>

           {/* AI Transaction Overlay - Dynamic Neon Detail */}
           <motion.div 
             initial={{ y: 50, opacity: 0 }}
             whileInView={{ y: 0, opacity: 1 }}
             viewport={{ once: true }}
             transition={{ delay: 1 }}
             className="absolute bottom-12 left-12 right-12 lg:left-auto lg:right-12 lg:w-[500px] bg-[#0c0c0e]/98 backdrop-blur-[60px] border border-cyan-500/30 rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,1),_0_0_60px_rgba(6,182,212,0.15)] ring-2 ring-white/10 flex flex-col overflow-hidden"
           >
              {/* Chat Header */}
              <div className="px-10 py-7 border-b border-white/10 flex items-center justify-between bg-white/[0.03]">
                 <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 flex items-center justify-center border border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.4)] relative">
                       <Sparkles className="w-6 h-6 text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]" />
                       <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-500 rounded-full border-2 border-black" />
                    </div>
                    <div>
                       <h4 className="text-base font-black text-white tracking-[0.2em] uppercase">SME Assistant</h4>
                       <span className="text-[10px] text-cyan-400 font-black uppercase tracking-[0.2em] animate-pulse">Syncing Ledger...</span>
                    </div>
                 </div>
              </div>

              {/* Chat Content */}
              <div className="p-10 space-y-8">
                 <div className="flex flex-col items-end">
                    <motion.div 
                       initial={{ x: 20, opacity: 0 }}
                       whileInView={{ x: 0, opacity: 1 }}
                       transition={{ delay: 1.5 }}
                       className="px-6 py-4 bg-cyan-500 text-black font-black text-base rounded-3xl rounded-tr-sm shadow-[0_15px_30px_rgba(6,182,212,0.4)] border border-cyan-300/50"
                    >
                       "Log 50,000 for office rent"
                    </motion.div>
                 </div>

                 <div className="flex items-start gap-5">
                    <motion.div 
                       initial={{ x: -20, opacity: 0 }}
                       whileInView={{ x: 0, opacity: 1 }}
                       transition={{ delay: 1.8 }}
                       className="p-8 bg-white/[0.03] border border-white/10 rounded-[2rem] rounded-tl-sm w-full relative group hover:border-cyan-500/40 transition-colors duration-500"
                    >
                       <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                       <div className="flex items-center justify-between relative z-10">
                          <div className="flex items-center gap-6">
                             <div className="w-16 h-16 rounded-2xl bg-black flex items-center justify-center text-3xl shadow-[inset_0_0_15px_rgba(255,255,255,0.05)] border border-white/5 group-hover:scale-110 transition-transform duration-500">
                                🏢
                             </div>
                             <div>
                                <p className="text-2xl font-black text-white italic tracking-tighter drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">₹50,000.00</p>
                                <p className="text-[11px] text-cyan-400/60 font-black uppercase tracking-[0.2em] mt-1">Infrastructure Logged</p>
                             </div>
                          </div>
                          <div className="w-12 h-12 rounded-full bg-cyan-500 flex items-center justify-center shadow-[0_0_25px_rgba(6,182,212,0.8)] group-hover:scale-125 transition-transform duration-500">
                             <CheckCircle2 className="w-6 h-6 text-black" />
                          </div>
                       </div>
                    </motion.div>
                 </div>
              </div>

              {/* Chat Input Placeholder */}
              <div className="p-10 pt-0">
                 <div className="relative group/input">
                    <div className="absolute inset-0 bg-cyan-500/30 blur-2xl opacity-0 group-hover/input:opacity-30 transition-opacity duration-700 pointer-events-none" />
                    <div className="relative h-16 w-full bg-white/[0.04] border border-white/10 rounded-2xl flex items-center px-8 gap-6 group-hover/input:border-cyan-500/50 transition-all duration-500">
                       <input 
                         type="text" 
                         placeholder="Describe any business transaction..." 
                         className="flex-1 bg-transparent text-sm font-bold text-white/30 outline-none"
                         readOnly
                       />
                       <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-black shadow-lg shadow-white/10 group-hover/input:bg-cyan-400 transition-colors">
                          <Send className="w-5 h-5 ml-1" />
                       </div>
                    </div>
                 </div>
              </div>
           </motion.div>
        </div>
      </motion.div>
    </div>
  );
};
