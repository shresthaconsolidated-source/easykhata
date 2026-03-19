'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheck, 
  Zap, 
  Chrome, 
  ArrowRight, 
  MessageSquare, 
  BarChart3, 
  FileText,
  Sparkles,
  Calculator,
  Lock,
  Play
} from 'lucide-react';
import { cn } from '@/lib/utils';

import { motion } from 'framer-motion';
import { DemoModal } from '@/components/chat/DemoModal';

export default function LandingPage() {
  const { user, signInWithGoogle, loading } = useAuth();
  const router = useRouter();
  const [isDemoOpen, setIsDemoOpen] = React.useState(false);

  React.useEffect(() => {
    if (user && !loading) {
      router.push('/chat');
    }
  }, [user, loading, router]);

  const features = [
    {
      title: "Chat Bookkeeping",
      desc: "Record expenses and income just like you're texting a friend. 'Taxi 200 today'.",
      icon: MessageSquare,
      color: "text-blue-400",
      glow: "bg-blue-500/20"
    },
    {
      title: "Clean Dashboard",
      desc: "Get instant insights into your profit and loss without any accounting jargon.",
      icon: BarChart3,
      color: "text-purple-400",
      glow: "bg-purple-500/20"
    },
    {
      title: "Professional Invoices",
      desc: "Create and send professional-looking invoices to your clients in seconds.",
      icon: FileText,
      color: "text-emerald-400",
      glow: "bg-emerald-500/20"
    }
  ];

  return (
    <div className="min-h-screen bg-[#070708] text-white selection:bg-blue-500/30 overflow-x-hidden">
      {/* Background Ultimate Mesh */}
      <div className="fixed inset-0 -z-10 overflow-hidden bg-[#050505]">
        <motion.div 
          animate={{ 
            scale: [1, 1.4, 1],
            x: ['-20%', '20%', '-20%'],
            y: ['-20%', '10%', '-20%'],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,_rgba(37,99,235,0.15)_0%,_transparent_50%)] blur-[100px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            x: ['20%', '-20%', '20%'],
            y: ['20%', '-10%', '20%'],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_80%,_rgba(99,102,241,0.1)_0%,_transparent_50%)] blur-[100px]" 
        />
        <motion.div 
          animate={{ 
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(168,85,247,0.05)_0%,_transparent_70%)] blur-[150px]" 
        />
        {/* Grain Texture */}
        <div className="absolute inset-0 bg-[#050505] opacity-[0.03] pointer-events-none brightness-150 contrast-125 mix-blend-overlay" style={{ backgroundImage: `url("https://grainy-gradients.vercel.app/noise.svg")` }} />
      </div>

      {/* Nav - Obsidian Style */}
      <div className="fixed top-6 inset-x-0 z-[100] px-6 flex justify-center">
         <motion.nav 
           initial={{ y: -20, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           className="bg-white/[0.03] backdrop-blur-3xl border border-white/5 px-8 py-4 rounded-[2rem] flex items-center gap-12 shadow-[0_20px_50px_rgba(0,0,0,0.5)] ring-1 ring-white/5"
         >
            <div className="flex items-center gap-4 group cursor-pointer">
               <div className="relative w-10 h-10">
                  <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
                  <div className="relative w-full h-full rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center overflow-hidden border border-white/20">
                     <div className="w-4 h-4 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.8)]" />
                     <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </div>
               </div>
               <div className="flex flex-col">
                  <span className="text-xl font-black tracking-[-0.05em] leading-none mb-0.5">easyKhata</span>
                  <span className="text-[7px] font-black uppercase tracking-[0.4em] text-blue-500/80">Intelligent Ledger</span>
               </div>
            </div>

            <div className="hidden md:flex items-center gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
               <a href="#features" className="hover:text-white transition-colors">Platform</a>
               <a href="#demo" className="hover:text-white transition-colors">Success Stories</a>
               <span className="px-3 py-1 bg-white/5 rounded-lg border border-white/5 text-blue-400">Public Beta</span>
            </div>

            <button 
              onClick={signInWithGoogle}
              className="text-[10px] font-black uppercase tracking-[0.2em] bg-white text-black px-6 py-3 rounded-xl hover:bg-white/90 transition-all active:scale-95 shadow-xl"
            >
              Sign In
            </button>
         </motion.nav>
      </div>

      {/* Hero Section */}
      <div className="relative pt-48 pb-32 lg:pt-64 lg:pb-48">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/[0.03] border border-white/5 text-[9px] font-black uppercase tracking-[0.3em] mb-12 text-blue-400/80 backdrop-blur-xl shadow-2xl"
          >
            <Sparkles className="w-4 h-4" />
            Accounting for modern traders
          </motion.div>
          
          <div className="relative mb-16">
            <motion.h1 
              initial={{ opacity: 0, scale: 0.98, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              className="text-8xl lg:text-[12rem] font-black tracking-[-0.08em] leading-[0.75] lg:leading-[0.7] perspective-1000"
            >
              <span className="block text-white">Accounting</span>
              <span className="block bg-gradient-to-b from-white/40 to-white/5 bg-clip-text text-transparent">Simplified.</span>
            </motion.h1>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-full bg-blue-500/5 blur-[120px] -z-10" />
          </div>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-2xl lg:text-4xl text-white/30 max-w-4xl mx-auto mb-24 leading-tight font-medium tracking-tight px-4"
          >
            Record, track, and analyze your digital empire <br className="hidden md:block" />
            through a <span className="text-white/80 italic font-black">conversational engine.</span>
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-10 mb-40"
          >
            <div className="relative group">
               <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
               <button 
                 onClick={signInWithGoogle}
                 className="relative w-full sm:w-auto bg-white text-black font-black px-12 py-6 rounded-2xl flex items-center justify-center gap-4 hover:shadow-2xl transition-all active:scale-[0.98] overflow-hidden"
               >
                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-shimmer" />
                 <Chrome className="w-5 h-5" />
                 <span className="text-[11px] uppercase tracking-[0.25em]">Initialize Platform</span>
                 <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
               </button>
            </div>

            <button 
              onClick={() => setIsDemoOpen(true)}
              className="w-full sm:w-auto bg-white/[0.03] backdrop-blur-xl border border-white/5 text-white/60 font-black px-12 py-6 rounded-2xl flex items-center justify-center gap-4 hover:bg-white/[0.08] hover:text-white transition-all active:scale-[0.98] group"
            >
              <div className="p-2 rounded-lg bg-white/5 group-hover:bg-blue-500/20 group-hover:text-blue-400 transition-colors">
                <Play className="w-4 h-4" />
              </div>
              <span className="text-[11px] uppercase tracking-[0.25em]">Watch System Demo</span>
            </button>
          </motion.div>

          {/* Social Proof / Minimalist Logos */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ delay: 1, duration: 2 }}
            className="flex flex-wrap justify-center items-center gap-16 lg:gap-32 grayscale"
          >
             <div className="flex items-center gap-3 font-black tracking-tighter text-2xl uppercase italic opacity-40 hover:opacity-100 transition-opacity">
                Matrix
             </div>
             <div className="flex items-center gap-2 font-thin text-3xl tracking-[0.2em] uppercase opacity-40 hover:opacity-100 transition-opacity">
                Vortex
             </div>
             <div className="flex items-center gap-1 font-black text-2xl tracking-tighter opacity-40 hover:opacity-100 transition-opacity">
                <div className="w-6 h-6 rounded-full border-4 border-white" /> ION
             </div>
             <div className="flex items-center gap-3 font-black tracking-widest text-xl uppercase opacity-40 hover:opacity-100 transition-opacity">
                Zenith
             </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="pt-24 mt-24 border-t border-white/5"
          >
             <div className="grid grid-cols-2 md:grid-cols-4 gap-12 opacity-30">
                {[
                  { icon: Lock, label: "Secure Cloud" },
                  { icon: Calculator, label: "Auto Tax" },
                  { icon: Zap, label: "Instant P&L" },
                  { icon: Sparkles, label: "AI NLP Chat" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-center gap-3 flex-col group">
                     <item.icon className="w-8 h-8 mb-2 group-hover:text-blue-400 transition-colors" />
                     <span className="text-[9px] font-black tracking-[0.3em] uppercase italic group-hover:text-white transition-colors">{item.label}</span>
                  </div>
                ))}
             </div>
          </motion.div>
        </div>
      </div>

      <DemoModal isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)} />

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-6 py-32 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-600/5 blur-[150px] -z-10" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {features.map((f, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative"
            >
               <div className={cn("absolute inset-0 blur-[100px] opacity-0 group-hover:opacity-20 transition-opacity duration-1000 -z-10", f.glow)} />
               <div className="bg-white/[0.02] p-12 rounded-[3.5rem] border border-white/5 hover:border-white/10 transition-all duration-700 h-full flex flex-col relative overflow-hidden backdrop-blur-3xl group-hover:-translate-y-2">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 blur-[80px] -mr-24 -mt-24 group-hover:bg-blue-500/10 transition-colors duration-700" />
                  <div className={cn("p-6 rounded-[2rem] bg-white/5 w-fit mb-10 group-hover:scale-110 group-hover:rotate-12 transition-all duration-700 ring-1 ring-white/10", f.color)}>
                    <f.icon className="w-10 h-10" />
                  </div>
                  <h3 className="text-3xl font-black mb-6 tracking-tight text-white/90">{f.title}</h3>
                  <p className="text-white/30 text-xl leading-relaxed font-medium mb-12">
                    {f.desc}
                  </p>
                  <div className="mt-auto flex items-center gap-3 text-white/10 group-hover:text-blue-400 transition-colors text-xs font-black uppercase tracking-[0.3em]">
                    Learn More <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  </div>
               </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="py-20 border-t border-white/5 relative z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
           <div className="space-y-6">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center p-0.5">
                    <div className="w-full h-full bg-black rounded-[9px] flex items-center justify-center">
                       <div className="w-3 h-3 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                    </div>
                 </div>
                 <span className="text-xl font-black tracking-tighter">easyKhata</span>
              </div>
              <p className="text-white/30 text-sm font-medium leading-relaxed">
                 Professional bookkeeping for the modern era. Track, bill, and profit faster than ever before.
              </p>
           </div>
           <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-6 text-blue-400">Product</h4>
              <ul className="space-y-4 text-sm font-bold text-white/40">
                 <li><a href="#" className="hover:text-white transition-colors">Chat NLP</a></li>
                 <li><a href="#" className="hover:text-white transition-colors">Invoicing</a></li>
                 <li><a href="#" className="hover:text-white transition-colors">Dashboard</a></li>
              </ul>
           </div>
           <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-6 text-purple-400">Company</h4>
              <ul className="space-y-4 text-sm font-bold text-white/40">
                 <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                 <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                 <li><a href="#" className="hover:text-white transition-colors">Github</a></li>
              </ul>
           </div>
           <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-6 text-emerald-400">Support</h4>
              <ul className="space-y-4 text-sm font-bold text-white/40">
                 <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                 <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
                 <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
           </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-[10px] text-white/10 font-black uppercase tracking-widest italic">
            © 2026 Shrestha Consolidated Source
          </div>
          <div className="flex gap-10">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse delay-75" />
              <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse delay-150" />
          </div>
        </div>
      </footer>
    </div>
  );
}
