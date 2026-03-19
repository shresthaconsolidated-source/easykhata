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
import { FloatingChatMockup } from '@/components/landing/FloatingChatMockup';

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
      desc: "Just type your expenses like a message.",
      icon: MessageSquare,
      color: "text-blue-400",
      glow: "from-blue-500/20 to-transparent"
    },
    {
      title: "Dashboard",
      desc: "Instant profit & expense insights.",
      icon: BarChart3,
      color: "text-indigo-400",
      glow: "from-indigo-500/20 to-transparent"
    },
    {
      title: "Invoices",
      desc: "Create clean, professional invoices in seconds.",
      icon: FileText,
      color: "text-sky-400",
      glow: "from-sky-500/20 to-transparent"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-blue-500/30 overflow-x-hidden font-sans">
      {/* Dynamic Background Pattern */}
      <div className="fixed inset-0 -z-10 overflow-hidden bg-black">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-blue-700/20 blur-[120px] rounded-full opacity-50 sm:opacity-70 pointer-events-none" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/10 blur-[150px] rounded-full pointer-events-none" />
      </div>

      {/* Navbar - Simplified & Glass */}
      <nav className="fixed top-0 inset-x-0 z-[100] border-b border-white/5 bg-black/50 backdrop-blur-2xl transition-all duration-300">
         <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-2 cursor-pointer group">
               <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.2)] group-hover:scale-105 transition-transform">
                  <div className="w-3 h-3 bg-black rounded-full" />
               </div>
               <span className="text-xl font-bold tracking-tight">easyKhata</span>
            </div>

            <div className="hidden md:flex items-center gap-10 text-sm font-medium text-white/40">
               <a href="#features" className="hover:text-white transition-colors">Product</a>
               <a href="#" className="hover:text-white transition-colors">Pricing</a>
               <button 
                 onClick={signInWithGoogle}
                 className="text-white/90 hover:text-white transition-colors"
               >
                 Login
               </button>
            </div>

            <button 
              onClick={signInWithGoogle}
              className="bg-white text-black text-xs font-bold px-5 py-2.5 rounded-full hover:bg-white/90 transition-all active:scale-95"
            >
              Start Free
            </button>
         </div>
      </nav>

      {/* Hero Section - Huge & Punchy */}
      <div className="relative pt-40 pb-20 lg:pt-60 lg:pb-40">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="text-left">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-8 shadow-[0_0_15px_rgba(59,130,246,0.2)]"
            >
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              Engineered for Speed
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl lg:text-[6.5rem] font-bold tracking-[-0.05em] leading-[0.88] mb-10 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60"
            >
              Your Business <br />
              Finances, in <br />
              <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-600 bg-clip-text text-transparent">One Chat.</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl lg:text-2xl text-white/40 max-w-xl mb-12 leading-relaxed font-medium tracking-tight"
            >
              Type like a message. Get your books done instantly. <br className="hidden md:block" />
              <span className="text-white/70">No clutter. No spreadsheets.</span>
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center gap-6"
            >
              <button 
                onClick={signInWithGoogle}
                className="group relative w-full sm:w-auto bg-white text-black font-bold px-10 py-5 rounded-2xl hover:scale-105 transition-all active:scale-95 overflow-hidden ring-1 ring-white/50"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out" />
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Start Free <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
              <button 
                onClick={() => setIsDemoOpen(true)}
                className="w-full sm:w-auto px-10 py-5 rounded-2xl border border-white/10 bg-white/[0.03] text-white font-bold hover:bg-white/[0.08] hover:border-white/20 transition-all active:scale-95 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.03)] hover:shadow-[0_0_30px_rgba(255,255,255,0.08)]"
              >
                <Play className="w-4 h-4 text-white/60 flex-shrink-0" /> View Demo
              </button>
            </motion.div>
          </div>

          {/* Central Visual */}
          <FloatingChatMockup />
        </div>
      </div>

      {/* Trust Section */}
      <div className="py-20 border-y border-white/[0.02] bg-white/[0.01]">
         <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 mb-10">
               Powering Next-Generation Commerce
            </p>
            <div className="flex flex-wrap justify-center items-center gap-12 lg:gap-24 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
               <div className="text-xl font-bold tracking-tighter uppercase italic hover:text-white transition-colors cursor-default">Matrix</div>
               <div className="text-2xl font-light tracking-[0.3em] uppercase hover:text-white transition-colors cursor-default">Vortex</div>
               <div className="text-xl font-black tracking-widest uppercase hover:text-white transition-colors cursor-default">Zenith</div>
               <div className="text-2xl font-semibold italic tracking-tight uppercase hover:text-white transition-colors cursor-default">Ion</div>
            </div>
         </div>
      </div>

      {/* Features Grid - Improved Cards */}
      <div id="features" className="max-w-7xl mx-auto px-6 py-40 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-600/5 blur-[120px] rounded-full opacity-30 pointer-events-none" />
        
        <div className="text-center mb-24 relative z-10">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-[0.3em] text-white/60 mb-6">
              Core Capabilities
           </div>
           <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mb-6 bg-gradient-to-br from-white to-white/40 bg-clip-text text-transparent">Engineered for Velocity.</h2>
           <p className="text-lg text-white/40 max-w-2xl mx-auto font-medium">No clutter, no complexity. Precision tools designed to elevate your financial operations.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          {features.map((f, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative"
            >
               <div className="bg-[#0c0c0d] p-10 rounded-[2.5rem] border border-white/10 hover:border-white/20 transition-all duration-500 h-full flex flex-col backdrop-blur-3xl overflow-hidden shadow-2xl hover:shadow-[0_0_40px_rgba(255,255,255,0.05)] group-hover:-translate-y-2 relative">
                  {/* Subtle top glare */}
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none", f.glow)} />
                  <div className={cn("p-5 rounded-2xl bg-white/[0.03] border border-white/5 w-fit mb-8 ring-1 ring-white/10 shadow-inner group-hover:scale-110 transition-transform duration-500", f.color)}>
                    <f.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 tracking-tight text-white/90">{f.title}</h3>
                  <p className="text-white/40 text-base leading-relaxed font-medium mb-10">
                    {f.desc}
                  </p>
                  <div className="mt-auto flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/20 group-hover:text-blue-400 transition-colors pt-6 border-t border-white/5 group-hover:border-white/10">
                    Explore Feature <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
               </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Simplified Footer */}
      <footer className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row justify-between items-start gap-20">
           <div className="space-y-6 max-w-sm">
              <div className="flex items-center gap-2">
                 <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
                    <div className="w-3 h-3 bg-black rounded-full" />
                 </div>
                 <span className="text-xl font-bold tracking-tight">easyKhata</span>
              </div>
              <p className="text-white/20 text-sm font-medium leading-relaxed">
                 The modern ledger for the intelligent business owner. Simple, transparent, and always free.
              </p>
           </div>
           
           <div className="grid grid-cols-2 sm:grid-cols-3 gap-20">
              <div className="space-y-4">
                 <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Product</h4>
                 <ul className="space-y-3 text-sm font-bold text-white/20">
                    <li><a href="#" className="hover:text-white transition-colors">Chat NLP</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Invoicing</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Dashboard</a></li>
                 </ul>
              </div>
              <div className="space-y-4">
                 <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Company</h4>
                 <ul className="space-y-3 text-sm font-bold text-white/20">
                    <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                 </ul>
              </div>
              <div className="space-y-4">
                 <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Support</h4>
                 <ul className="space-y-3 text-sm font-bold text-white/20">
                    <li><a href="#" className="hover:text-white transition-colors">Help</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                 </ul>
              </div>
           </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 pt-20 flex flex-col sm:flex-row justify-between items-center gap-6">
           <p className="text-[10px] text-white/10 font-black uppercase tracking-widest italic">
              © 2026 Shrestha Consolidated Source
           </p>
           <div className="flex gap-4 opacity-20">
              <div className="w-1 h-1 rounded-full bg-white" />
              <div className="w-1 h-1 rounded-full bg-white" />
              <div className="w-1 h-1 rounded-full bg-white" />
           </div>
        </div>
      </footer>

      <DemoModal isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)} />
    </div>
  );
}
