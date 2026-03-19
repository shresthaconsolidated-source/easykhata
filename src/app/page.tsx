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
      glow: "from-cyan-500/20 to-transparent"
    },
    {
      title: "Smart Dashboard",
      desc: "See profit instantly with real-time neon metrics and blurs.",
      icon: PieChart,
      glow: "from-purple-500/20 to-transparent"
    },
    {
      title: "Instant Invoices",
      desc: "Send professional invoices in seconds. Get paid 2x faster.",
      icon: FileText,
      glow: "from-blue-500/20 to-transparent"
    }
  ];

  return (
    <div className="min-h-screen bg-[#030303] text-white selection:bg-cyan-500/30 overflow-x-hidden font-sans antialiased">
      
      {/* Navbar - Glassy Neon */}
      <nav className="fixed top-0 inset-x-0 z-[100] bg-black/60 backdrop-blur-xl border-b border-white/5 transition-all duration-300">
         <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer group">
               <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.5)] group-hover:scale-105 transition-transform">
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
               </div>
               <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">easyKhata</span>
            </div>

            <div className="hidden md:flex items-center gap-10 text-sm font-bold text-white/40">
               <a href="#features" className="hover:text-white hover:text-cyan-400 transition-colors">Product</a>
               <a href="#" className="hover:text-white hover:text-purple-400 transition-colors">Pricing</a>
               <button 
                 onClick={signInWithGoogle}
                 className="hover:text-white transition-colors"
               >
                 Login
               </button>
            </div>

            <button 
              onClick={signInWithGoogle}
              className="relative group px-6 py-3 rounded-full overflow-hidden"
            >
               <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 group-hover:scale-110 transition-transform duration-500" />
               <span className="relative z-10 text-white font-black text-sm uppercase tracking-widest">Start Free</span>
            </button>
         </div>
      </nav>

      {/* Hero Section - Side-by-Side Neon Detail */}
      <div className="relative pt-40 pb-32 lg:pt-56 lg:pb-56">
        {/* Background Ambient Glows */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-cyan-500/10 blur-[180px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-600/10 blur-[150px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="text-left space-y-10">
            <motion.div 
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.2)]"
            >
               <Sparkles className="w-4 h-4" /> The Future of Finance
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.85] text-white"
            >
              Finance, Without <br /> the <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Friction.</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl lg:text-2xl text-white/50 max-w-xl leading-relaxed font-medium tracking-tight"
            >
              The first AI-powered ledger for traders. <br />
              <span className="text-white/80">Log. Track. Profit.</span> No spreadsheets required.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center gap-6"
            >
              {/* Google Sign-in CTA */}
              <button 
                onClick={signInWithGoogle}
                className="w-full sm:w-auto flex items-center justify-center gap-3 bg-white text-black font-black px-8 py-5 rounded-2xl hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all active:scale-95 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-100 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
                <svg className="w-5 h-5 relative z-10" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.20-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span className="relative z-10">Continue with Google</span>
              </button>
              
              <button 
                onClick={() => setIsDemoOpen(true)}
                className="w-full sm:w-auto px-8 py-5 rounded-2xl border border-white/10 bg-white/[0.02] text-white font-black hover:bg-white/[0.05] hover:border-cyan-500/40 transition-all flex items-center justify-center gap-3 backdrop-blur-md"
              >
                <Play className="w-4 h-4 text-cyan-400" /> View Demo
              </button>
            </motion.div>
          </div>

          {/* Right Column: Neon Mockup */}
          <div className="relative group">
            <div className="absolute -inset-10 bg-gradient-to-tr from-cyan-500/20 via-purple-500/20 to-transparent blur-[100px] opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />
            <FloatingChatMockup />
          </div>
        </div>
      </div>

      {/* Detail Section: Trusted & Highlights */}
      <div className="max-w-7xl mx-auto px-6 py-20 border-y border-white/[0.02] bg-white/[0.01]">
         <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="space-y-1 text-center md:text-left">
               <p className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-400">Connectivity</p>
               <h3 className="text-2xl font-black text-white">Bank-Grade Security.</h3>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-12 lg:gap-20 opacity-20 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
               <Zap className="w-8 h-8 text-cyan-400" />
               <Shield className="w-8 h-8 text-purple-400" />
               <CreditCard className="w-8 h-8 text-blue-400" />
               <Sparkles className="w-8 h-8 text-cyan-400" />
            </div>
         </div>
      </div>

      {/* Features Grid - Vibrant & Detailed */}
      <div id="features" className="max-w-7xl mx-auto px-6 py-40">
        <div className="text-center mb-24">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[9px] font-black uppercase tracking-[0.3em] text-cyan-400 mb-8">
              Core Stack
           </div>
           <h2 className="text-5xl lg:text-7xl font-black tracking-tight mb-8">Intelligence in every <span className="text-purple-500">ledger.</span></h2>
           <p className="text-xl text-white/40 max-w-3xl mx-auto font-medium leading-relaxed">Everything you need to scale your financial architecture. Built for speed, designed for clarity.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative h-full"
            >
               <div className="absolute -inset-1 bg-gradient-to-br from-white/10 to-transparent rounded-[2.5rem] blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
               <div className="relative bg-[#0c0c0e]/80 p-12 rounded-[2.5rem] border border-white/5 hover:border-cyan-500/30 transition-all duration-500 h-full backdrop-blur-3xl overflow-hidden shadow-2xl flex flex-col items-start text-left">
                  <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none", f.glow)} />
                  
                  <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 w-fit mb-10 ring-1 ring-white/10 shadow-inner group-hover:scale-110 group-hover:bg-cyan-500 group-hover:text-black transition-all duration-500">
                    <f.icon className="w-8 h-8" />
                  </div>
                  
                  <h3 className="text-3xl font-black mb-4 tracking-tight text-white group-hover:text-cyan-400 transition-colors">{f.title}</h3>
                  <p className="text-white/40 text-lg leading-relaxed font-medium mb-12">
                    {f.desc}
                  </p>

                  <div className="mt-auto flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-white/20 group-hover:text-cyan-400 transition-colors pt-8 border-t border-white/5 w-full">
                    Learn Infrastructure <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
               </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Premium Footer */}
      <footer className="py-24 border-t border-white/5 bg-[#030303]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
           <div className="col-span-1 lg:col-span-2 space-y-8">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full" />
                 </div>
                 <span className="text-2xl font-black tracking-tight">easyKhata</span>
              </div>
              <p className="text-white/30 text-lg max-w-sm font-medium leading-relaxed italic">
                 "Remaking the world's most intelligent financial interface."
              </p>
           </div>
           
           <div className="space-y-6">
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-cyan-400">Network</h4>
              <ul className="space-y-4 text-base font-bold text-white/40">
                 <li><a href="#" className="hover:text-white transition-colors">Chat NLP V2</a></li>
                 <li><a href="#" className="hover:text-white transition-colors">Global Invoices</a></li>
                 <li><a href="#" className="hover:text-white transition-colors">Risk Analysis</a></li>
              </ul>
           </div>

           <div className="space-y-6">
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-purple-400">Access</h4>
              <button 
                 onClick={signInWithGoogle}
                 className="flex items-center gap-2 text-base font-bold text-white/40 hover:text-white transition-colors"
              >
                 Identity <ArrowRight className="w-4 h-4" />
              </button>
              <div className="pt-4 flex gap-4 opacity-30">
                 <div className="w-4 h-4 rounded-full bg-cyan-500" />
                 <div className="w-4 h-4 rounded-full bg-purple-500" />
                 <div className="w-4 h-4 rounded-full bg-blue-500" />
              </div>
           </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 pt-24 mt-24 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-8">
           <p className="text-xs text-white/20 font-bold uppercase tracking-widest">
              © 2026 Shrestha Consolidated Source
           </p>
           <div className="flex gap-10 items-center">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Network Online</span>
           </div>
        </div>
      </footer>

      <DemoModal isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)} />
    </div>
  );
}
