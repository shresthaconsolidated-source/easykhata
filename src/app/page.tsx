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
    <div className="min-h-screen bg-[#050505] text-white selection:bg-blue-500/30 overflow-x-hidden font-sans">
      {/* Background - Minimal & Deep */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full opacity-50" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-indigo-600/5 blur-[150px] rounded-full opacity-30" />
      </div>

      {/* Navbar - Simplified & Glass */}
      <nav className="fixed top-0 inset-x-0 z-[100] border-b border-white/5 bg-[#050505]/60 backdrop-blur-md">
         <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-2 cursor-pointer group">
               <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
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
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-bold uppercase tracking-widest text-blue-400 mb-8"
            >
              <Sparkles className="w-3 h-3" />
              Intelligence inside
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl lg:text-[6rem] font-bold tracking-[-0.04em] leading-[0.9] mb-10"
            >
              Your Business <br />
              Finances, in <br />
              <span className="bg-gradient-to-r from-white via-white to-white/40 bg-clip-text text-transparent">One Chat.</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl lg:text-2xl text-white/40 max-w-xl mb-12 leading-relaxed font-medium tracking-tight"
            >
              Type like a message. Get your <br className="hidden md:block" />
              books done instantly.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center gap-6"
            >
              <button 
                onClick={signInWithGoogle}
                className="w-full sm:w-auto bg-white text-black font-bold px-10 py-5 rounded-2xl hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all active:scale-95"
              >
                Start Free
              </button>
              <button 
                onClick={() => setIsDemoOpen(true)}
                className="w-full sm:w-auto px-10 py-5 rounded-2xl border border-white/5 bg-white/[0.02] text-white/60 font-bold hover:bg-white/[0.05] hover:text-white transition-all active:scale-95"
              >
                View Demo
              </button>
            </motion.div>
          </div>

          {/* Central Visual */}
          <FloatingChatMockup />
        </div>
      </div>

      {/* Trust Section */}
      <div className="py-20 border-y border-white/5">
         <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-10">
               Built for small businesses & traders
            </p>
            <div className="flex flex-wrap justify-center items-center gap-12 lg:gap-24 opacity-20 grayscale">
               <div className="text-xl font-bold tracking-tighter uppercase italic">Matrix</div>
               <div className="text-2xl font-light tracking-[0.3em] uppercase">Vortex</div>
               <div className="text-xl font-black tracking-widest uppercase">Zenith</div>
               <div className="text-2xl font-semibold italic tracking-tight uppercase">Ion</div>
            </div>
         </div>
      </div>

      {/* Features Grid - Improved Cards */}
      <div id="features" className="max-w-7xl mx-auto px-6 py-40">
        <div className="text-center mb-24">
           <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mb-6">Designed for speed.</h2>
           <p className="text-lg text-white/30 max-w-2xl mx-auto">No clutter, no complexity. Just the features you need to manage your money efficiently.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative"
            >
               <div className="bg-white/[0.02] p-10 rounded-[2.5rem] border border-white/5 hover:border-white/10 hover:-translate-y-2 transition-all duration-500 h-full flex flex-col backdrop-blur-3xl overflow-hidden shadow-2xl">
                  <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10", f.glow)} />
                  <div className={cn("p-5 rounded-2xl bg-white/5 w-fit mb-8 ring-1 ring-white/10 group-hover:scale-110 transition-transform duration-500", f.color)}>
                    <f.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 tracking-tight">{f.title}</h3>
                  <p className="text-white/30 text-base leading-relaxed font-medium mb-10">
                    {f.desc}
                  </p>
                  <div className="mt-auto flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/10 group-hover:text-blue-400 transition-colors">
                    Learn More <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
