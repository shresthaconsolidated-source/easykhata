'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, BarChart3, PieChart, ArrowUpRight, ArrowDownRight, LayoutDashboard, Settings, Activity } from 'lucide-react';

export const FloatingChatMockup = () => {
  return (
    <div className="w-full h-full relative flex items-center justify-center pointer-events-none group">
      
      {/* Intense Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] lg:w-[800px] lg:h-[800px] bg-gradient-to-tr from-emerald-600/20 to-cyan-600/10 blur-[150px] rounded-full -z-10 group-hover:from-emerald-500/30 group-hover:to-cyan-500/20 transition-all duration-1000" />

      {/* Main 3D Container */}
      <motion.div
        initial={{ y: 50, opacity: 0, rotateY: 20, rotateX: 10 }}
        animate={{ y: 0, opacity: 1, rotateY: -15, rotateX: 5 }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-[900px] h-[600px] bg-[#050505] rounded-3xl shadow-[0_50px_100px_rgba(0,0,0,0.8),_inset_0_1px_3px_rgba(255,255,255,0.1)] overflow-hidden ring-1 ring-white/10 relative flex text-white"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Subtle Screen Glare */}
        <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/5 to-transparent z-10 pointer-events-none" />

        {/* Sidebar */}
        <div className="w-64 border-r border-white/5 bg-[#0a0a0c] p-6 flex flex-col relative z-20">
           <div className="flex items-center gap-3 mb-10">
              <div className="w-6 h-6 rounded-md bg-emerald-500 flex items-center justify-center">
                 <div className="w-3 h-3 rounded-sm border-[1.5px] border-black" />
              </div>
              <span className="text-lg font-bold tracking-tight">Wealth Management</span>
           </div>

           <div className="space-y-1 mb-10">
              <p className="text-[10px] font-black text-white/30 uppercase tracking-widest pl-3 mb-3">Menu</p>
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/5 text-emerald-400">
                 <LayoutDashboard className="w-4 h-4" />
                 <span className="font-semibold text-xs">Overview</span>
              </div>
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/40">
                 <PieChart className="w-4 h-4" />
                 <span className="font-semibold text-xs">Portfolio</span>
              </div>
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/40">
                 <Activity className="w-4 h-4" />
                 <span className="font-semibold text-xs">FIRE Status</span>
              </div>
           </div>
        </div>

        {/* Main Dashboard Area */}
        <div className="flex-1 p-8 grid grid-cols-3 gap-6 relative z-20 bg-[#070708]">
           
           {/* Top Nav inside dashboard */}
           <div className="col-span-3 flex items-center justify-end gap-6 mb-2">
              <span className="text-xs font-semibold text-white/50 hover:text-white transition-colors cursor-pointer">Overview</span>
              <span className="text-xs font-semibold text-white/50 hover:text-white transition-colors cursor-pointer">Portfolio</span>
              <span className="text-xs font-semibold text-white/50 hover:text-white transition-colors cursor-pointer">FIRE</span>
              <span className="text-xs font-semibold text-white/50 hover:text-white transition-colors cursor-pointer">Accounts</span>
              <div className="w-6 h-6 rounded-full bg-white/10 ml-4" />
           </div>

           {/* Left Col: Allocation */}
           <div className="col-span-1 border border-white/5 bg-white/[0.02] rounded-2xl p-5 flex flex-col">
              <p className="text-[10px] font-black uppercase text-white/50 tracking-widest mb-6">Portfolio Allocation</p>
              <div className="relative w-32 h-32 mx-auto mb-8 mt-4">
                 <div className="absolute inset-0 rounded-full border-[10px] border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]" style={{ clipPath: 'polygon(50% 50%, 50% 0, 100% 0, 100% 100%, 0 100%, 0 50%)' }} />
                 <div className="absolute inset-0 rounded-full border-[10px] border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.3)]" style={{ clipPath: 'polygon(50% 50%, 0 50%, 0 0, 50% 0)' }} />
                 <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-lg font-black text-white">45%</span>
                    <span className="text-[8px] text-white/40 uppercase">ETF</span>
                 </div>
              </div>
              <div className="space-y-3 mt-auto">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full bg-emerald-500" />
                       <span className="text-xs font-medium text-white/70">ETF</span>
                    </div>
                    <span className="text-xs font-bold text-white">45%</span>
                 </div>
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full bg-cyan-500" />
                       <span className="text-xs font-medium text-white/70">Crypto</span>
                    </div>
                    <span className="text-xs font-bold text-white">20%</span>
                 </div>
              </div>
           </div>

           {/* Center Col: Net Worth & Chart */}
           <div className="col-span-2 grid grid-rows-2 gap-6">
              
              {/* Net Worth Chart */}
              <div className="border border-white/5 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-2xl p-5 relative overflow-hidden group-hover:border-emerald-500/30 transition-colors">
                 <div className="absolute top-0 right-0 p-4">
                    <span className="px-2 py-1 bg-white/5 rounded text-[9px] font-bold text-white/40">last 12 months</span>
                 </div>
                 <p className="text-[10px] font-black uppercase text-emerald-400 tracking-widest mb-1">Net Worth</p>
                 <div className="flex items-end gap-3 mb-6">
                    <h3 className="text-3xl font-black text-white tracking-tighter">$3,850,214.70</h3>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold mb-1">+8.2%</span>
                 </div>
                 
                 {/* Mock Chart Line */}
                 <div className="absolute bottom-6 left-5 right-5 h-20 flex items-end">
                    <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                       <path d="M0 100 Q 10 90 20 85 T 40 70 T 60 50 T 80 40 T 100 20" fill="none" stroke="rgba(16, 185, 129, 0.8)" strokeWidth="3" vectorEffect="non-scaling-stroke" />
                       <path d="M0 100 Q 10 90 20 85 T 40 70 T 60 50 T 80 40 T 100 20 L 100 100 L 0 100 Z" fill="url(#gradient)" stroke="none" />
                       <defs>
                          <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="0%" stopColor="rgba(16, 185, 129, 0.2)" />
                             <stop offset="100%" stopColor="transparent" />
                          </linearGradient>
                       </defs>
                    </svg>
                    <div className="absolute top-4 right-[20%] w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_10px_#34d399]" />
                 </div>
              </div>

              {/* Bottom Cards Row inside Center Col */}
              <div className="grid grid-cols-2 gap-6">
                 
                 {/* FIRE Path Projection */}
                 <div className="border border-white/5 bg-white/[0.02] rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-4">
                       <p className="text-[10px] font-black uppercase text-white/50 tracking-widest">FIRE Path Projection 🔥</p>
                       <span className="text-[9px] text-white/40">Age 65</span>
                    </div>
                    <div className="mb-4">
                       <p className="text-xs text-white/60 font-medium">Age: <span className="text-white font-bold">48</span>. Wealth: <span className="text-emerald-400 font-bold">$4.1M</span></p>
                       <p className="text-xs text-white/60 font-medium mt-1">Status: <span className="text-emerald-400 font-bold">ON TRACK (112%)</span></p>
                    </div>
                    {/* Tiny mini chart */}
                    <div className="w-full h-8 flex items-end gap-1 mt-auto">
                       <div className="flex-1 h-3 bg-white/5 rounded-t-sm" />
                       <div className="flex-1 h-4 bg-white/5 rounded-t-sm" />
                       <div className="flex-1 h-6 bg-emerald-500/40 rounded-t-sm shadow-[0_-5px_10px_rgba(16,185,129,0.2)]" />
                       <div className="flex-1 h-8 bg-emerald-500/80 rounded-t-sm shadow-[0_-5px_10px_rgba(16,185,129,0.3)]" />
                    </div>
                 </div>

                 {/* Recent Transactions */}
                 <div className="border border-emerald-500/20 bg-emerald-500/[0.02] rounded-2xl p-5 relative overflow-hidden ring-1 ring-emerald-500/10 shadow-[inset_0_0_20px_rgba(16,185,129,0.05)]">
                    <p className="text-[10px] font-black uppercase text-white/50 tracking-widest mb-4">Recent Transactions</p>
                    <div className="space-y-4">
                       <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                             <div className="w-6 h-6 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                                <ArrowUpRight className="w-3 h-3" />
                             </div>
                             <div>
                                <p className="text-xs font-bold text-white">ETF Purchase</p>
                                <p className="text-[9px] text-white/40">IVV</p>
                             </div>
                          </div>
                          <div className="text-right">
                             <p className="text-xs font-bold text-emerald-400">+$12,500.00</p>
                             <p className="text-[9px] text-white/40">May 15</p>
                          </div>
                       </div>
                       <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                             <div className="w-6 h-6 rounded bg-red-500/20 text-red-400 flex items-center justify-center">
                                <ArrowDownRight className="w-3 h-3" />
                             </div>
                             <div>
                                <p className="text-xs font-bold text-white">Expense</p>
                                <p className="text-[9px] text-white/40">Mortgage</p>
                             </div>
                          </div>
                          <div className="text-right">
                             <p className="text-xs font-bold text-red-400">-$4,150.00</p>
                             <p className="text-[9px] text-white/40">May 14</p>
                          </div>
                       </div>
                    </div>
                 </div>

              </div>

           </div>

        </div>

        {/* Small Chat Overlay floating on top */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="absolute bottom-6 right-6 w-72 bg-[#121214]/90 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-2xl p-4 z-50 ring-1 ring-white/5"
          style={{ transform: 'translateZ(50px)' }}
        >
           <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">AI Analyst</span>
           </div>
           <p className="text-xs text-white/80 font-medium leading-relaxed">
              Your IVV ETF purchase increased your portfolio's tech exposure to 42%. Would you like to run a rebalancing simulation?
           </p>
        </motion.div>
      </motion.div>
    </div>
  );
};
