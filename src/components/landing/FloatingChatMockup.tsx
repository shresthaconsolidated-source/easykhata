'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, BarChart3, PieChart, Send, ArrowUpRight, ArrowDownRight, LayoutDashboard, Settings, Activity, CheckCircle2 } from 'lucide-react';

export const FloatingChatMockup = () => {
  return (
    <div className="relative w-full mx-auto perspective-1000 mt-20 lg:mt-0">
      {/* Massive Background Neon Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] sm:w-[800px] sm:h-[600px] lg:w-[1200px] lg:h-[800px] bg-cyan-500/10 blur-[150px] lg:blur-[250px] rounded-[100%] -z-10 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-purple-600/10 blur-[120px] rounded-full -z-10 pointer-events-none opacity-50" />

      {/* Main App Container - High Contrast Glass */}
      <motion.div
        initial={{ y: 60, opacity: 0, scale: 0.95 }}
        whileInView={{ y: 0, opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="w-full h-[550px] sm:h-[650px] lg:h-[750px] bg-[#0c0c0e]/90 border border-white/10 rounded-[3rem] shadow-[0_50px_120px_rgba(0,0,0,1),_0_0_80px_rgba(6,182,212,0.1)] overflow-hidden backdrop-blur-3xl ring-1 ring-white/10 relative flex flex-col md:flex-row"
      >
        {/* Neon Edge Highlight */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
        <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-purple-500/30 to-transparent" />

        {/* Sidebar - Neon Detailed */}
        <div className="hidden md:flex flex-col w-64 border-r border-white/5 bg-white/[0.02] p-8">
           <div className="flex items-center gap-3 mb-16">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                 <div className="w-2.5 h-2.5 bg-white rounded-full" />
              </div>
              <span className="text-xl font-black tracking-tighter text-white">easyKhata</span>
           </div>

           <div className="space-y-4">
              <div className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-cyan-500 text-black shadow-[0_0_25px_rgba(6,182,212,0.4)] border border-cyan-400/50 group cursor-default">
                 <LayoutDashboard className="w-5 h-5" />
                 <span className="font-black text-sm uppercase tracking-widest">Dash</span>
              </div>
              <div className="flex items-center gap-3 px-5 py-4 rounded-2xl text-white/40 hover:text-cyan-400 hover:bg-white/5 transition-all cursor-pointer group">
                 <BarChart3 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                 <span className="font-bold text-sm tracking-tight">Ledger</span>
              </div>
              <div className="flex items-center gap-3 px-5 py-4 rounded-2xl text-white/40 hover:text-purple-400 hover:bg-white/5 transition-all cursor-pointer group">
                 <Activity className="w-5 h-5 group-hover:scale-110 transition-transform" />
                 <span className="font-bold text-sm tracking-tight">Trends</span>
              </div>
           </div>
           
           <div className="mt-auto flex items-center gap-3 px-5 py-4 rounded-2xl text-white/20 hover:text-white transition-all cursor-pointer">
               <Settings className="w-5 h-5" />
               <span className="font-bold text-sm">Config</span>
            </div>
        </div>

        {/* Main Workspace */}
        <div className="flex-1 flex flex-col relative overflow-hidden bg-gradient-to-br from-white/[0.01] to-transparent">
           {/* Top Header */}
           <div className="h-24 border-b border-white/5 px-10 flex items-center justify-between">
              <div>
                 <h2 className="text-2xl font-black text-white tracking-tighter">Liquid Capital</h2>
                 <p className="text-[10px] text-cyan-400 font-black uppercase tracking-[0.3em] mt-1 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" /> Live Analysis
                 </p>
              </div>
              
              <div className="flex items-center gap-6">
                 <div className="h-10 w-32 bg-white/5 border border-white/10 rounded-full px-4 flex items-center justify-between">
                    <div className="w-2 h-2 rounded-full bg-cyan-500" />
                    <span className="text-[10px] font-black tracking-widest text-white/40">MARCH '26</span>
                 </div>
                 <div className="w-12 h-12 rounded-full bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center p-0.5 shadow-xl">
                    <div className="w-full h-full rounded-full bg-white/5 flex items-center justify-center text-white/20">A</div>
                 </div>
              </div>
           </div>

           {/* Metrics Grid - More Detail */}
           <div className="p-10 grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 shadow-inner backdrop-blur-md group relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-3xl -translate-y-1/2 translate-x-1/2" />
                 <div className="flex items-center justify-between mb-6">
                    <p className="text-xs font-black text-white/30 uppercase tracking-[0.2em]">Net Revenue</p>
                    <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                       <ArrowUpRight className="w-4 h-4" />
                    </div>
                 </div>
                 <h3 className="text-4xl font-black tracking-tighter text-white mb-2 italic">₹842.4k</h3>
                 <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden mt-4">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: '75%' }}
                      transition={{ duration: 2, delay: 1 }}
                      className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                    />
                 </div>
              </div>
              
              <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 shadow-inner backdrop-blur-md group relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-3xl -translate-y-1/2 translate-x-1/2" />
                 <div className="flex items-center justify-between mb-6">
                    <p className="text-xs font-black text-white/30 uppercase tracking-[0.2em]">Outflow</p>
                    <div className="p-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20">
                       <ArrowDownRight className="w-4 h-4" />
                    </div>
                 </div>
                 <h3 className="text-4xl font-black tracking-tighter text-white mb-2 italic">₹124.8k</h3>
                 <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden mt-4">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: '30%' }}
                      transition={{ duration: 2, delay: 1.2 }}
                      className="h-full bg-gradient-to-r from-purple-400 to-pink-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                    />
                 </div>
              </div>
           </div>

           {/* AI Transaction Overlay - Neon Glass */}
           <motion.div 
             initial={{ y: 50, opacity: 0 }}
             whileInView={{ y: 0, opacity: 1 }}
             viewport={{ once: true }}
             transition={{ delay: 0.8 }}
             className="absolute bottom-10 left-10 right-10 lg:left-auto lg:right-10 lg:w-[450px] bg-[#0c0c0e]/95 backdrop-blur-3xl border border-cyan-500/20 rounded-[2.5rem] shadow-[0_40px_80px_rgba(0,0,0,0.8),_0_0_40px_rgba(6,182,212,0.1)] ring-1 ring-white/10 flex flex-col overflow-hidden"
           >
              {/* Chat Interface Inside Dashboard */}
              <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                       <Sparkles className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                       <h4 className="text-sm font-black text-white tracking-widest uppercase">Assistant</h4>
                       <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest animate-pulse">Syncing...</span>
                    </div>
                 </div>
              </div>

              {/* Chat Stream */}
              <div className="p-8 space-y-6">
                 <div className="flex flex-col items-end">
                    <div className="px-5 py-3 bg-cyan-500 text-black font-black text-sm rounded-2xl rounded-tr-sm shadow-[0_10px_20px_rgba(6,182,212,0.3)]">
                       "Log 5000 for server rent"
                    </div>
                 </div>

                 <div className="flex items-start gap-4">
                    <div className="p-5 bg-white/[0.03] border border-white/10 rounded-3xl rounded-tl-sm w-full relative group">
                       <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                       <p className="text-xs font-black text-cyan-400 uppercase tracking-widest mb-4 italic italic">Infrastructure Logged</p>
                       <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                             <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center text-2xl shadow-inner border border-white/5">
                                🏢
                             </div>
                             <div>
                                <p className="text-lg font-black text-white italic tracking-tighter">₹5,000.00</p>
                                <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Fixed Expenses</p>
                             </div>
                          </div>
                          <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                             <CheckCircle2 className="w-5 h-5 text-black" />
                          </div>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Input Area */}
              <div className="p-8 pt-0">
                 <div className="relative">
                    <div className="absolute inset-0 bg-cyan-500/20 blur-xl opacity-20 pointer-events-none" />
                    <div className="relative h-14 w-full bg-white/[0.02] border border-white/10 rounded-2xl flex items-center px-6 gap-4 hover:border-cyan-500/40 transition-colors">
                       <input 
                         type="text" 
                         placeholder="Describe a transaction..." 
                         className="flex-1 bg-transparent text-sm font-medium text-white/50 outline-none"
                         readOnly
                       />
                       <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-black shadow-lg">
                          <Send className="w-4 h-4 ml-0.5" />
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
