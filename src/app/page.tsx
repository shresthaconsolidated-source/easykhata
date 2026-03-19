'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { 
  ArrowRight, 
  Play, 
  MessageCircle, 
  PieChart, 
  FileText, 
  CheckCircle2, 
  Sparkles,
  Zap,
  Shield,
  CreditCard
} from 'lucide-react';
import { motion } from 'framer-motion';
import { DemoModal } from '@/components/chat/DemoModal';
import { FloatingChatMockup } from '@/components/landing/FloatingChatMockup';
import { cn } from '@/lib/utils';

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
      title: "Chat AI",
      desc: "Log expenses like a message. Our NLP understands everything.",
      icon: MessageCircle,
      glow: "shadow-[0_0_30px_rgba(6,182,212,0.3)]",
      color: "text-cyan-400"
    },
    {
      title: "Smart Dashboard",
      desc: "See profit instantly with real-time neon metrics and blurs.",
      icon: PieChart,
      glow: "shadow-[0_0_30px_rgba(168,85,247,0.3)]",
      color: "text-purple-400"
    },
    {
      title: "Instant Invoices",
      desc: "Send professional invoices in seconds. Get paid 2x faster.",
      icon: FileText,
      glow: "shadow-[0_0_30px_rgba(59,130,246,0.3)]",
      color: "text-blue-400"
    }
  ];

  return (
    <div className="min-h-screen bg-[#030303] text-white selection:bg-cyan-500/30 overflow-x-hidden font-sans antialiased">
      
      {/* Navbar - Glassy Neon */}
      <nav className="fixed top-0 inset-x-0 z-[100] bg-black/60 backdrop-blur-xl border-b border-cyan-500/10 transition-all duration-300">
         <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer group">
               <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.6)] group-hover:scale-110 transition-transform">
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
               </div>
               <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent group-hover:text-cyan-400 transition-colors">easyKhata</span>
            </div>

            <div className="hidden md:flex items-center gap-10 text-sm font-bold text-white/40">
               <a href="#features" className="hover:text-cyan-400 transition-colors">Product</a>
               <a href="#" className="hover:text-purple-400 transition-colors">Pricing</a>
               <button 
                 onClick={signInWithGoogle}
                 className="hover:text-white transition-colors"
               >
                 Login
               </button>
            </div>

            <button 
              onClick={signInWithGoogle}
              className="relative group px-6 py-3 rounded-full overflow-hidden shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] transition-shadow"
            >
               <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 group-hover:scale-110 transition-transform duration-500" />
               <span className="relative z-10 text-white font-black text-sm uppercase tracking-widest">Start Free</span>
            </button>
         </div>
      </nav>

      {/* Hero Section - Side-by-Side Neon Detail */}
      <div className="relative pt-40 pb-32 lg:pt-56 lg:pb-56 overflow-hidden">
        {/* Intense Background Neon Glows */}
        <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-cyan-500/[0.08] blur-[180px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-purple-600/[0.08] blur-[150px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />
        
        {/* Animated Background Detail - Sparse Neon Lines */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
           <div className="absolute top-1/4 left-1/2 w-px h-64 bg-gradient-to-b from-transparent via-cyan-500 to-transparent -translate-x-1/2 animate-pulse" />
           <div className="absolute top-1/2 left-1/4 w-px h-96 bg-gradient-to-b from-transparent via-purple-500 to-transparent animate-pulse delay-500" />
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-6 text-left space-y-10 relative z-10">
            <motion.div 
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.3)]"
            >
               <Sparkles className="w-4 h-4 animate-spin-slow" /> The Future of Finance
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl md:text-7xl lg:text-[8.5rem] font-black tracking-tighter leading-[0.8] text-white"
            >
              Finance, Without <br /> the <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent drop-shadow-[0_10px_40px_rgba(6,182,212,0.5)]">Friction.</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl lg:text-2xl text-white/50 max-w-xl leading-relaxed font-medium tracking-tight"
            >
              The first AI-powered ledger for <span className="text-white">Entrepreneurs & SMEs.</span> <br />
              <span className="text-cyan-400 font-bold">Log. Track. Profit.</span> No spreadsheets, ever.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center gap-6 pt-4"
            >
              {/* Google Sign-in CTA */}
              <button 
                onClick={signInWithGoogle}
                className="w-full sm:w-auto flex items-center justify-center gap-4 bg-white text-black font-black px-10 py-5 rounded-2xl hover:scale-105 hover:shadow-[0_0_50px_rgba(255,255,255,0.4)] transition-all active:scale-95 group relative overflow-hidden ring-1 ring-white/20"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-100 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
                <svg className="w-6 h-6 relative z-10" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.20-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span className="relative z-10 text-lg">Continue with Google</span>
              </button>
              
              <button 
                onClick={() => setIsDemoOpen(true)}
                className="w-full sm:w-auto px-10 py-5 rounded-2xl border border-white/10 bg-white/[0.04] text-white font-black hover:bg-white/[0.08] hover:border-cyan-500/50 transition-all flex items-center justify-center gap-3 backdrop-blur-3xl shadow-[0_0_20px_rgba(255,255,255,0.05)]"
              >
                <Play className="w-5 h-5 text-cyan-400 fill-cyan-400" /> View Demo
              </button>
            </motion.div>
          </div>

          {/* Right Column: Neon Mockup */}
          <div className="lg:col-span-6 relative lg:translate-x-12">
            <div className="absolute -inset-10 bg-gradient-to-tr from-cyan-500/30 via-purple-500/30 to-transparent blur-[120px] opacity-60 pointer-events-none" />
            <FloatingChatMockup />
          </div>
        </div>
      </div>

      {/* Detail Section: Trusted & Highlights */}
      <div className="max-w-7xl mx-auto px-6 py-24 mb-20">
         <div className="flex flex-col lg:flex-row items-center justify-between gap-16 px-12 py-12 rounded-[3rem] bg-white/[0.02] border border-white/5 backdrop-blur-3xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/[0.03] to-purple-500/[0.03] pointer-events-none" />
            <div className="space-y-1 text-center lg:text-left relative z-10">
               <p className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]">Connectivity</p>
               <h3 className="text-3xl font-black text-white tracking-tight italic">Bank-Grade Infrastructure.</h3>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-12 lg:gap-24 opacity-60 relative z-10">
               <div className="group flex flex-col items-center gap-3">
                  <Zap className="w-10 h-10 text-cyan-400 transition-transform group-hover:scale-110 drop-shadow-[0_0_15px_rgba(6,182,212,0.6)]" />
                  <span className="text-[9px] font-black text-white/40 tracking-[0.2em]">Instant Sync</span>
               </div>
               <div className="group flex flex-col items-center gap-3">
                  <Shield className="w-10 h-10 text-purple-400 transition-transform group-hover:scale-110 drop-shadow-[0_0_15px_rgba(168,85,247,0.6)]" />
                  <span className="text-[9px] font-black text-white/40 tracking-[0.2em]">Encrypted</span>
               </div>
               <div className="group flex flex-col items-center gap-3">
                  <CreditCard className="w-10 h-10 text-blue-400 transition-transform group-hover:scale-110 drop-shadow-[0_0_15px_rgba(59,130,246,0.6)]" />
                  <span className="text-[9px] font-black text-white/40 tracking-[0.2em]">Ready to Scale</span>
               </div>
            </div>
         </div>
      </div>

      {/* Features Grid - Vibrant & Detailed */}
      <div id="features" className="max-w-7xl mx-auto px-6 py-40">
        <div className="text-center mb-28">
           <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[9px] font-black uppercase tracking-[0.3em] text-cyan-400 mb-10 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
              Core Stack
           </div>
           <h2 className="text-6xl lg:text-[5.5rem] font-black tracking-tight mb-8 leading-none">Intelligence in every <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">ledger.</span></h2>
           <p className="text-2xl text-white/40 max-w-2xl mx-auto font-medium leading-relaxed tracking-tight">Everything you need to scale your business. Built for speed, designed for clarity.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-12">
          {features.map((f, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative h-full"
            >
               <div className={cn("absolute -inset-1 bg-gradient-to-br from-white/20 to-transparent rounded-[3rem] blur opacity-0 group-hover:opacity-100 transition-opacity duration-700", f.glow)} />
               <div className="relative bg-[#0c0c0e]/90 p-12 lg:p-14 rounded-[3rem] border border-white/5 hover:border-cyan-500/30 transition-all duration-700 h-full backdrop-blur-3xl overflow-hidden shadow-2xl flex flex-col items-start text-left">
                  <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/10 w-fit mb-12 ring-2 ring-white/5 group-hover:scale-110 group-hover:bg-cyan-500 group-hover:text-black group-hover:shadow-[0_0_40px_rgba(6,182,212,0.6)] transition-all duration-500">
                    <f.icon className="w-9 h-9" />
                  </div>
                  
                  <h3 className="text-4xl font-black mb-5 tracking-tighter text-white group-hover:text-cyan-400 transition-colors uppercase italic">{f.title}</h3>
                  <p className="text-white/40 text-[1.15rem] leading-relaxed font-medium mb-16 tracking-tight">
                    {f.desc}
                  </p>

                  <div className="mt-auto flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-white/20 group-hover:text-cyan-400 transition-colors pt-10 border-t border-white/5 w-full">
                    Explore Architecture <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  </div>
               </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Premium Footer */}
      <footer className="py-32 border-t border-white/5 bg-[#030303] relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20">
           <div className="col-span-1 lg:col-span-2 space-y-10">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-xl bg-cyan-500 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.6)]">
                    <div className="w-2.5 h-2.5 bg-white rounded-full" />
                 </div>
                 <span className="text-3xl font-black tracking-tighter">easyKhata</span>
              </div>
              <p className="text-white/30 text-xl max-w-sm font-medium leading-relaxed italic opacity-50">
                 "Remaking the world's most intelligent financial interface for the next generation of business."
              </p>
           </div>
           
           <div className="space-y-8">
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.6)]">Platform</h4>
              <ul className="space-y-5 text-[1.05rem] font-bold text-white/30">
                 <li><a href="#" className="hover:text-cyan-400 transition-colors">Chat NLP V3</a></li>
                 <li><a href="#" className="hover:text-cyan-400 transition-colors">Global Invoices</a></li>
                 <li><a href="#" className="hover:text-cyan-400 transition-colors">Risk Oracle</a></li>
              </ul>
           </div>

           <div className="space-y-8">
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.6)]">Company</h4>
              <button 
                 onClick={signInWithGoogle}
                 className="flex items-center gap-3 text-[1.05rem] font-bold text-white/30 hover:text-white transition-colors"
              >
                 Join Network <ArrowRight className="w-5 h-5" />
              </button>
              <div className="pt-6 flex gap-6 opacity-20">
                 <div className="w-5 h-5 rounded-full bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.8)]" />
                 <div className="w-5 h-5 rounded-full bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.8)]" />
                 <div className="w-5 h-5 rounded-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)]" />
              </div>
           </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 pt-24 mt-32 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-10">
           <p className="text-xs text-white/20 font-black uppercase tracking-[0.4em]">
              © 2026 Shrestha Consolidated
           </p>
           <div className="flex gap-12 items-center">
              <div className="flex items-center gap-3">
                 <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                 <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500">Node Active</span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">v2.1.0-Neon</span>
           </div>
        </div>
      </footer>

      <DemoModal isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)} />
    </div>
  );
}
