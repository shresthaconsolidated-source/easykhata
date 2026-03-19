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
    <div className="min-h-screen bg-[#030303] text-white selection:bg-cyan-500/30 overflow-x-hidden font-sans antialiased relative">
      
      {/* GLOBAL BACKGROUND TEXTURE: Dot Grid & Noise */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
      </div>

      {/* Navbar - Glassy Neon */}
      <nav className="fixed top-0 inset-x-0 z-[100] bg-black/60 backdrop-blur-xl border-b border-cyan-500/10 transition-all duration-300">
         <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer group">
               <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.5)] group-hover:scale-110 transition-transform">
                  <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse" />
               </div>
               <span className="text-xl font-black tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent group-hover:text-cyan-400 transition-colors">easyKhata</span>
            </div>

            <div className="hidden md:flex items-center gap-10 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
               <a href="#features" className="hover:text-cyan-400 transition-colors">Product</a>
               <a href="#" className="hover:text-purple-400 transition-colors">Pricing</a>
               <button onClick={signInWithGoogle} className="hover:text-white transition-colors">Login</button>
            </div>

            <button 
              onClick={signInWithGoogle}
              className="relative group px-5 py-2.5 rounded-full overflow-hidden shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-shadow"
            >
               <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 group-hover:scale-110 transition-transform duration-500" />
               <span className="relative z-10 text-white font-black text-[10px] uppercase tracking-widest">Start Free</span>
            </button>
         </div>
      </nav>

      {/* Hero Section - Tighter Layout */}
      <div className="relative pt-32 pb-16 lg:pt-40 lg:pb-24 overflow-hidden border-b border-white/5">
        <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-cyan-500/[0.05] blur-[180px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-purple-600/[0.05] blur-[150px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center relative z-10">
          <div className="lg:col-span-7 text-left space-y-6">
            <motion.div 
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[8px] font-black uppercase tracking-[0.4em] text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.2)]"
            >
               <Sparkles className="w-3.5 h-3.5" /> Intelligence at scale
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-6xl lg:text-[5.5rem] font-black tracking-tighter leading-[0.95] text-white"
            >
              Finance, Without <br /> the <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent drop-shadow-[0_10px_30px_rgba(6,182,212,0.4)]">Friction.</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg lg:text-xl text-white/50 max-w-xl leading-relaxed italic"
            >
              The first AI-powered ledger for <span className="text-white border-b border-cyan-500/30">Home Businesses & Solopreneurs.</span> <br />
              Log. Track. Profit. No spreadsheets, ever.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center gap-4 pt-4"
            >
              <button 
                onClick={signInWithGoogle}
                className="w-full sm:w-auto flex items-center justify-center gap-3 bg-white text-black font-black px-8 py-4 rounded-xl hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all active:scale-95 group relative overflow-hidden"
              >
                <svg className="w-5 h-5 relative z-10" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.20-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span className="relative z-10 text-base">Continue with Google</span>
              </button>
              
              <button 
                onClick={() => setIsDemoOpen(true)}
                className="w-full sm:w-auto px-8 py-4 rounded-xl border border-white/10 bg-white/[0.04] text-white font-black hover:bg-white/[0.08] hover:border-cyan-500/50 transition-all flex items-center justify-center gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center">
                   <Play className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />
                </div>
                View Demo
              </button>
            </motion.div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="absolute -inset-10 bg-gradient-to-tr from-cyan-500/20 via-purple-500/20 to-transparent blur-[100px] opacity-40 pointer-events-none" />
            <div className="relative z-10 lg:scale-[1.05] lg:translate-x-6">
               <FloatingChatMockup />
            </div>
          </div>
        </div>
      </div>

      {/* Connectivity Detail - Tightened Spacing */}
      <div className="max-w-7xl mx-auto px-6 py-12 relative">
         {/* Connector Glow */}
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-white/10 to-transparent" />
         
         <div className="flex flex-col lg:flex-row items-center justify-between gap-10 p-10 lg:p-12 rounded-[3.5rem] bg-white/[0.02] border border-white/5 backdrop-blur-3xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-purple-500/5 group-hover:opacity-100 opacity-0 transition-opacity duration-1000" />
            <div className="space-y-1 text-center lg:text-left relative z-10">
               <p className="text-[9px] font-black uppercase tracking-[0.5em] text-cyan-400">Security Layers</p>
               <h3 className="text-2xl lg:text-3xl font-black text-white tracking-tighter italic">Bank-Grade Infrastructure.</h3>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-16 opacity-40 relative z-10">
               <div className="flex flex-col items-center gap-2.5">
                  <Zap className="w-8 h-8 text-cyan-400 drop-shadow-[0_0_15px_rgba(6,182,212,0.6)]" />
                  <span className="text-[8px] font-black text-white/40 tracking-[0.2em] uppercase">Sync</span>
               </div>
               <div className="flex flex-col items-center gap-2.5">
                  <Shield className="w-8 h-8 text-purple-400 drop-shadow-[0_0_15px_rgba(168,85,247,0.6)]" />
                  <span className="text-[8px] font-black text-white/40 tracking-[0.2em] uppercase">Vault</span>
               </div>
               <div className="flex flex-col items-center gap-2.5">
                  <CreditCard className="w-8 h-8 text-blue-400 drop-shadow-[0_0_15px_rgba(59,130,246,0.6)]" />
                  <span className="text-[8px] font-black text-white/40 tracking-[0.2em] uppercase">PCI-DSS</span>
               </div>
            </div>
         </div>
      </div>

      {/* Features Grid - Dense Layout */}
      <div id="features" className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12 relative">
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-cyan-500/[0.02] blur-[120px] rounded-full -z-10 pointer-events-none" />
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[8px] font-black uppercase tracking-[0.4em] text-white/30 mb-6">
              The Architecture
           </div>
           <h2 className="text-4xl lg:text-5xl font-black tracking-tighter mb-4 leading-[0.95] text-white italic">Full scale <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">visibility.</span></h2>
           <p className="text-lg text-white/30 max-w-xl mx-auto font-medium leading-relaxed italic">The tool designed for the speed of modern home business.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {features.map((f, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative h-full"
            >
               <div className={cn("absolute -inset-0.5 bg-gradient-to-br from-white/10 to-transparent rounded-[2rem] blur opacity-0 group-hover:opacity-100 transition-opacity duration-700", f.glow)} />
               <div className="relative bg-[#08080a]/95 p-8 lg:p-10 rounded-[2rem] border border-white/5 hover:border-cyan-500/20 transition-all duration-700 h-full backdrop-blur-3xl overflow-hidden flex flex-col items-start text-left">
                  <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10 w-fit mb-6 group-hover:scale-110 group-hover:bg-cyan-500 group-hover:text-black group-hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all duration-500">
                    <f.icon className="w-6 h-6" />
                  </div>
                  
                  <h3 className="text-2xl font-black mb-3 tracking-tighter text-white group-hover:text-cyan-400 transition-colors uppercase italic">{f.title}</h3>
                  <p className="text-white/30 text-sm leading-relaxed font-medium italic">
                    {f.desc}
                  </p>
               </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Minimalist Compact Footer */}
      <footer className="py-8 border-t border-white/5 bg-[#030303] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 h-full">
           <div className="flex flex-col md:flex-row items-center justify-between gap-8 h-full">
              {/* Branding */}
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                    <div className="w-2 h-2 bg-white rounded-full" />
                 </div>
                 <span className="text-xl font-black tracking-tighter">easyKhata</span>
                 <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] ml-2 italic">Home Business Accounting</span>
              </div>

              {/* Functional Links */}
              <div className="flex items-center gap-10">
                 <a href="#features" className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 hover:text-cyan-400 transition-colors">Product</a>
                 <button 
                    onClick={signInWithGoogle}
                    className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 hover:text-cyan-400 transition-colors"
                 >
                    Start Free
                 </button>
                 <div className="w-px h-4 bg-white/10" />
                 <div className="flex items-center gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-emerald-500">Node Active</span>
                 </div>
              </div>

              {/* Meta */}
              <div className="flex items-center gap-6">
                 <p className="text-[8px] text-white/10 font-black uppercase tracking-[0.4em]">© 2026 Shrestha Consolidated</p>
              </div>
           </div>
        </div>
      </footer>

      <DemoModal isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)} />
    </div>
  );
}
