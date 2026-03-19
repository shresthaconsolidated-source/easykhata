'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, BarChart3, PieChart, Send, ArrowRight, ArrowUpRight, ArrowDownRight, LayoutDashboard, Settings } from 'lucide-react';

export const FloatingChatMockup = () => {
  return (
    <div className="relative w-full mx-auto perspective-1000 mt-20">
      {/* Massive Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] sm:w-[800px] sm:h-[600px] lg:w-[1200px] lg:h-[800px] bg-blue-600/15 blur-[120px] lg:blur-[200px] rounded-[100%] -z-10 pointer-events-none" />

      {/* Main App Container */}
      <motion.div
        initial={{ y: 60, opacity: 0, scale: 0.95 }}
        whileInView={{ y: 0, opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="w-full h-[500px] sm:h-[600px] lg:h-[700px] bg-[#0a0a0b]/80 border border-white/10 rounded-[2rem] shadow-[0_40px_100px_rgba(0,0,0,1)] overflow-hidden backdrop-blur-3xl ring-1 ring-white/5 relative flex flex-col md:flex-row"
      >
        {/* Top Glare Edge */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50" />

        {/* Sidebar (Hidden on small screens) */}
        <div className="hidden md:flex flex-col w-64 border-r border-white/5 bg-white/[0.01] p-6">
           <div className="flex items-center gap-2 mb-12">
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                 <div className="w-3 h-3 bg-black rounded-full" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">easyKhata</span>
           </div>

           <div className="space-y-2">
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.05] text-white border border-white/5">
                 <LayoutDashboard className="w-5 h-5 text-blue-400" />
                 <span className="font-semibold text-sm">Dashboard</span>
              </div>
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/40 hover:text-white transition-colors cursor-pointer">
                 <BarChart3 className="w-5 h-5" />
                 <span className="font-semibold text-sm">Transactions</span>
              </div>
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/40 hover:text-white transition-colors cursor-pointer">
                 <PieChart className="w-5 h-5" />
                 <span className="font-semibold text-sm">Reports</span>
              </div>
           </div>
           
           <div className="mt-auto flex items-center gap-3 px-4 py-3 rounded-xl text-white/40 hover:text-white transition-colors cursor-pointer">
               <Settings className="w-5 h-5" />
               <span className="font-semibold text-sm">Settings</span>
            </div>
        </div>

        {/* Main Dashboard Area */}
        <div className="flex-1 flex flex-col relative overflow-hidden">
           {/* Topbar */}
           <div className="h-20 border-b border-white/5 bg-white/[0.01] px-8 flex items-center justify-between">
              <div>
                 <h2 className="text-lg font-bold text-white tracking-tight">Overview</h2>
                 <p className="text-xs text-white/40 font-medium">March 2026</p>
              </div>
              
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10" />
              </div>
           </div>

           {/* Metrics Grid */}
           <div className="p-8 grid grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 shadow-inner backdrop-blur-sm group hover:bg-white/[0.04] transition-colors cursor-default">
                 <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-semibold text-white/50">Total Revenue</p>
                    <div className="px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-xs font-bold flex items-center gap-1">
                       <ArrowUpRight className="w-3 h-3" /> 12.5%
                    </div>
                 </div>
                 <h3 className="text-3xl font-bold tracking-tight text-white mb-1">₹145,200</h3>
                 <p className="text-xs text-white/30 truncate">+$18,200 this month</p>
              </div>
              
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 shadow-inner backdrop-blur-sm group hover:bg-white/[0.04] transition-colors cursor-default">
                 <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-semibold text-white/50">Total Expenses</p>
                    <div className="px-2 py-1 rounded-md bg-red-500/10 text-red-400 text-xs font-bold flex items-center gap-1">
                       <ArrowDownRight className="w-3 h-3" /> 4.2%
                    </div>
                 </div>
                 <h3 className="text-3xl font-bold tracking-tight text-white mb-1">₹41,800</h3>
                 <p className="text-xs text-white/30 truncate">+$2,400 this month</p>
              </div>

              <div className="hidden lg:block p-6 rounded-2xl bg-white/[0.02] border border-white/5 shadow-inner backdrop-blur-sm group hover:bg-white/[0.04] transition-colors cursor-default">
                 <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-semibold text-white/50">Net Profit</p>
                 </div>
                 <h3 className="text-3xl font-bold tracking-tight text-blue-400 mb-1">₹103,400</h3>
                 <p className="text-xs text-white/30 truncate">71% Margin</p>
              </div>
           </div>

           {/* Central Chat Overlay / Input Area (Floating at bottom right) */}
           <motion.div 
             initial={{ y: 50, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             transition={{ delay: 0.8, duration: 0.8 }}
             className="absolute bottom-6 right-6 lg:bottom-10 lg:right-10 w-[calc(100%-48px)] lg:w-[400px] bg-[#0c0c0d]/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8),_0_0_20px_rgba(59,130,246,0.1)] ring-1 ring-white/5 flex flex-col overflow-hidden"
           >
              {/* Chat Header */}
              <div className="px-5 py-4 border-b border-white/5 flex items-center gap-3 bg-white/[0.02]">
                 <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center border border-blue-500/20">
                    <Sparkles className="w-4 h-4 text-blue-400" />
                 </div>
                 <div>
                    <h4 className="text-sm font-bold text-white tracking-tight">AI Assistant</h4>
                    <p className="text-[10px] uppercase tracking-widest text-emerald-400 font-semibold">Online</p>
                 </div>
              </div>

              {/* Chat Content */}
              <div className="p-5 space-y-5">
                 <div className="flex flex-col items-end gap-1.5">
                    <div className="px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-2xl rounded-tr-sm shadow-md shadow-blue-900/20">
                       Taxi 2000 yesterday
                    </div>
                 </div>

                 <div className="flex flex-col items-start gap-3 w-full">
                    <div className="p-4 bg-white/[0.03] border border-white/5 rounded-2xl rounded-tl-sm w-[90%] lg:w-[85%]">
                       <div className="flex items-center gap-2 mb-3 cursor-default">
                          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                          <span className="text-xs font-semibold text-white/80">Expense Recorded</span>
                       </div>
                       
                       <div className="flex items-center gap-3 p-3 bg-black/40 rounded-xl border border-white/5">
                          <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-xl shrink-0">
                             🚕
                          </div>
                          <div className="min-w-0 pr-2">
                             <p className="text-sm font-bold text-white truncate">₹2,000.00</p>
                             <p className="text-xs text-white/40 truncate">Transportation • Yesterday</p>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Chat Input */}
              <div className="px-5 pb-5 pt-2">
                 <div className="flex items-center gap-2 p-1.5 pl-4 bg-white/[0.03] border border-white/10 rounded-full hover:bg-white/[0.05] hover:border-white/20 transition-colors">
                    <p className="text-sm text-white/20 font-medium flex-1 cursor-text select-none">Ask or log something...</p>
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:scale-105 transition-transform cursor-pointer shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                       <Send className="w-4 h-4 text-black ml-0.5" />
                    </div>
                 </div>
              </div>
           </motion.div>
        </div>
      </motion.div>
    </div>
  );
};
