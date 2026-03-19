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
      {/* Background Mesh Gradients */}
      <div className="fixed inset-0 -z-10 overflow-hidden bg-[#0a0a0b]">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            x: [0, 100, 0],
            y: [0, 50, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] bg-blue-600/20 blur-[120px] rounded-full" 
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
            x: [0, -100, 0],
            y: [0, -50, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-indigo-600/10 blur-[120px] rounded-full" 
        />
        <motion.div 
          animate={{ 
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.5, 1]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[40%] h-[40%] bg-purple-600/5 blur-[150px] rounded-full" 
        />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none brightness-50 contrast-150" />
      </div>

      {/* Nav */}
      <nav className="max-w-7xl mx-auto px-6 py-10 flex items-center justify-between relative z-50">
         <motion.div 
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           className="flex items-center gap-4"
         >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-2xl shadow-blue-500/40 relative group">
               <div className="absolute inset-0 rounded-2xl bg-white/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
               <div className="w-5 h-5 bg-white rounded-full shadow-inner relative z-10" />
            </div>
            <div className="flex flex-col">
               <span className="text-2xl font-black tracking-tighter leading-none">easyKhata</span>
               <span className="text-[8px] font-black uppercase tracking-[0.3em] text-blue-500/60 mt-1">Free Forever</span>
            </div>
         </motion.div>
         <motion.button 
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           onClick={signInWithGoogle}
           className="hidden md:flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white/40 hover:text-white py-3 px-8 border border-white/5 hover:border-white/20 bg-white/5 rounded-2xl transition-all backdrop-blur-xl"
         >
           Log In
         </motion.button>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-12 pb-24 lg:pt-24 lg:pb-32">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-blue-500/5 border border-blue-500/20 text-[10px] font-black uppercase tracking-[0.2em] mb-10 text-blue-400 shadow-[0_0_40px_rgba(59,130,246,0.1)]">
            <Sparkles className="w-4 h-4" />
            Accounting for modern traders
          </div>
          
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-7xl lg:text-[10rem] font-black tracking-[-0.05em] mb-12 leading-[0.8] lg:leading-[0.75] perspective-1000"
          >
            <span className="block bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">Accounting</span>
            <span className="block bg-gradient-to-b from-white/80 to-white/40 bg-clip-text text-transparent opacity-50">Simplified.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl lg:text-3xl text-white/40 max-w-3xl mx-auto mb-20 leading-tight font-medium tracking-tight"
          >
            Record, track, and analyze your finances through a <br className="hidden md:block" />
            <span className="text-blue-500/80">familiar chat interface.</span> No jargon, just results.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-32"
          >
            <button 
              onClick={signInWithGoogle}
              className="w-full sm:w-auto bg-white text-black font-black px-14 py-7 rounded-2xl flex items-center justify-center gap-4 hover:bg-white/90 transition-all shadow-[0_30px_60px_rgba(255,255,255,0.15)] active:scale-95 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-shimmer" />
              <Chrome className="w-6 h-6" />
              <span className="text-sm uppercase tracking-[0.2em]">Start for Free</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </button>
            <button 
              onClick={() => setIsDemoOpen(true)}
              className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-white font-black px-14 py-7 rounded-2xl border border-white/10 flex items-center justify-center gap-4 transition-all backdrop-blur-3xl active:scale-95 group"
            >
               <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                 <Play className="w-3 h-3 fill-current ml-0.5" />
               </div>
               <span className="text-sm uppercase tracking-[0.2em]">Quick Demo</span>
            </button>
          </motion.div>

          <DemoModal isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)} />

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
                 <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center">
                    <div className="w-3 h-3 bg-black rounded-full" />
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
