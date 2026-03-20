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
  CreditCard,
  X,
  Check
} from 'lucide-react';
import { motion } from 'framer-motion';
import { DemoModal } from '@/components/chat/DemoModal';
import { FloatingChatMockup } from '@/components/landing/FloatingChatMockup';
import { cn } from '@/lib/utils';

export default function LandingPage() {
  const { user, signInWithGoogle, loading } = useAuth();
  const router = useRouter();
  const [isDemoOpen, setIsDemoOpen] = React.useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = React.useState(false);

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
      <nav className="fixed top-0 inset-x-0 z-[100] bg-black/60 backdrop-blur-xl border-b border-white/5 transition-all duration-300">
         <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer group">
               <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.5)] group-hover:scale-110 transition-transform">
                  <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse" />
               </div>
               <span className="text-xl font-black tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent group-hover:text-blue-400 transition-colors">easyKhata</span>
            </div>

            <div className="hidden md:flex items-center gap-10 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
               <a href="#features" className="hover:text-white transition-colors">Product</a>
               <button onClick={signInWithGoogle} className="hover:text-white transition-colors">Login</button>
            </div>

            <button 
              onClick={signInWithGoogle}
              className="relative group px-6 py-3 rounded-full overflow-hidden shadow-[0_0_30px_rgba(59,130,246,0.2)] hover:shadow-[0_0_50px_rgba(59,130,246,0.4)] transition-all"
            >
               <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 group-hover:scale-110 transition-transform duration-500" />
               <span className="relative z-10 text-white font-black text-[10px] uppercase tracking-widest">Get Started</span>
            </button>
         </div>
      </nav>

      {/* Hero Section - The "WOW" Part */}
      <div className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Massive Animated Gradient Nebula */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-blue-600/10 blur-[150px] rounded-[100%] animate-pulse pointer-events-none opacity-40" />
        <div className="absolute top-40 right-0 w-[800px] h-[800px] bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none animate-bounce duration-[10s]" />
        
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center relative z-10">
          <div className="lg:col-span-12 text-center space-y-10">
            <motion.div 
               initial={{ opacity: 0, y: -10 }}
               animate={{ opacity: 1, y: 0 }}
               className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-[0.5em] text-blue-400 shadow-[0_0_40px_rgba(59,130,246,0.1)] mb-4"
            >
               <Sparkles className="w-4 h-4" /> The future of ledger
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-7xl lg:text-[7.5rem] font-bold tracking-tighter leading-[0.9] md:leading-[0.85] text-white"
            >
              Finance, Without <br className="hidden md:block" /> 
              <span className="bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-400 bg-clip-text text-transparent italic px-2">
                 the Friction.
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg lg:text-2xl text-white/40 max-w-2xl mx-auto leading-relaxed font-medium px-4 md:px-0"
            >
              The AI-powered command center for your home business. <br className="hidden md:block" />
              Log everything via chat. Zero bookkeeping experience required.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8"
            >
              <button 
                onClick={signInWithGoogle}
                className="w-full sm:w-auto h-16 px-10 rounded-2xl bg-white text-black font-black text-lg hover:scale-105 hover:shadow-[0_0_60px_rgba(255,255,255,0.4)] transition-all active:scale-95 flex items-center gap-3 relative overflow-hidden group"
              >
                Continue with Google
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button 
                onClick={() => setIsDemoOpen(true)}
                className="w-full sm:w-auto h-16 px-10 rounded-2xl border border-white/10 bg-white/[0.02] text-white font-black hover:bg-white/[0.05] transition-all flex items-center justify-center gap-4 group"
              >
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                   <Play className="w-4 h-4 text-blue-400 fill-blue-400 ml-0.5" />
                </div>
                View Demo
              </button>
            </motion.div>
          </div>
        </div>

        {/* Floating Mockup with Perspective */}
        <motion.div 
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="max-w-6xl mx-auto px-4 md:px-6 mt-12 md:mt-20 relative perspective-1000 overflow-hidden md:overflow-visible"
        >
          <div className="relative group rounded-2xl md:rounded-3xl overflow-hidden border border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,1)] md:shadow-[0_64px_128px_-16px_rgba(0,0,0,1)] hover:border-blue-500/30 transition-all duration-700">
             <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
             <div className="bg-[#0c0c0d]/90 p-1 md:p-4 backdrop-blur-2xl">
                <FloatingChatMockup />
             </div>
          </div>
        </motion.div>
      </div>

      {/* Bento Grid Features - Premium Section */}
      <section id="features" className="py-20 md:py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
             {/* Large Card: Chat */}
             <motion.div 
               whileHover={{ y: -5 }}
               className="md:col-span-8 h-[320px] md:h-[400px] rounded-[2rem] md:rounded-[3rem] bg-white/[0.02] border border-white/5 p-8 md:p-12 group relative overflow-hidden flex flex-col justify-end"
             >
                <div className="absolute top-0 right-0 p-6 md:p-12 opacity-5 md:opacity-10 group-hover:opacity-20 transition-opacity">
                   <MessageCircle className="w-32 h-32 md:w-48 md:h-48 text-blue-500" />
                </div>
                <div className="relative z-10 space-y-3 md:space-y-4">
                   <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400 border border-blue-500/20">
                      <Zap className="w-5 h-5 md:w-6 md:h-6" />
                   </div>
                   <h3 className="text-2xl md:text-4xl font-bold tracking-tighter">Instant AI Entries.</h3>
                   <p className="text-white/40 text-sm md:text-lg max-w-sm leading-relaxed">
                      "Taxi 500", "Sold 10 items at 1000". Our AI understands business context instantly.
                   </p>
                </div>
             </motion.div>

             {/* Small Card: Security */}
             <motion.div 
               whileHover={{ y: -5 }}
               className="md:col-span-4 h-[320px] md:h-[400px] rounded-[2rem] md:rounded-[3rem] bg-gradient-to-br from-indigo-600/10 to-transparent border border-white/5 p-8 md:p-12 flex flex-col justify-end group transition-all"
             >
                <div className="space-y-3 md:space-y-4">
                   <Shield className="w-8 h-8 md:w-10 md:h-10 text-indigo-400 group-hover:scale-110 transition-transform" />
                   <h3 className="text-2xl md:text-3xl font-bold tracking-tighter leading-tight">Bank-Grade Vault.</h3>
                   <p className="text-white/40 text-xs md:text-sm leading-relaxed">Your data is encrypted, backed up, and only viewable by you.</p>
                </div>
             </motion.div>

             {/* Small Card: Invoices */}
             <motion.div 
               whileHover={{ y: -5 }}
               className="md:col-span-4 h-[320px] md:h-[400px] rounded-[2rem] md:rounded-[3rem] bg-white/[0.02] border border-white/5 p-8 md:p-12 flex flex-col justify-end group transition-all"
             >
                <div className="space-y-3 md:space-y-4">
                   <FileText className="w-8 h-8 md:w-10 md:h-10 text-emerald-400" />
                   <h3 className="text-2xl md:text-3xl font-bold tracking-tighter leading-tight">Instant Invoicing.</h3>
                   <p className="text-white/40 text-xs md:text-sm leading-relaxed">Generate PDF invoices from your transactions with one click.</p>
                </div>
             </motion.div>

             {/* Medium Card: Dashboard */}
             <motion.div 
               whileHover={{ y: -5 }}
               className="md:col-span-8 h-[320px] md:h-[400px] rounded-[2rem] md:rounded-[3rem] bg-[#0c0c0d] border border-white/10 p-8 md:p-12 group relative overflow-hidden flex flex-col justify-end shadow-2xl"
             >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-500/5 blur-[100px] rounded-full group-hover:bg-blue-500/10 transition-all duration-1000" />
                <div className="relative z-10 space-y-3 md:space-y-4">
                   <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white/5 flex items-center justify-center text-white border border-white/10">
                      <PieChart className="w-5 h-5 md:w-6 md:h-6" />
                   </div>
                   <h3 className="text-2xl md:text-4xl font-bold tracking-tighter">Precision Metrics.</h3>
                   <p className="text-white/40 text-sm md:text-lg max-w-md leading-relaxed">
                      Track Profit/Loss, Cash Flow, and Tax estimates automatically. No math needed.
                   </p>
                </div>
             </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 relative overflow-hidden">
         <div className="max-w-4xl mx-auto px-6 text-center space-y-8 md:space-y-12">
            <h2 className="text-4xl md:text-7xl font-bold tracking-tighter italic">Ready to stop <span className="text-white/20">guessing?</span></h2>
            <button 
              onClick={signInWithGoogle}
              className="w-full md:w-auto px-10 md:px-16 py-5 md:py-6 rounded-2xl bg-white text-black font-black text-lg md:text-xl hover:scale-105 hover:shadow-[0_0_80px_rgba(255,255,255,0.2)] transition-all active:scale-95"
            >
               Get Started for Free
            </button>
            <p className="text-white/20 text-[8px] md:text-[10px] font-black uppercase tracking-[0.5em]">No Credit Card Required • Setup in 30 Seconds</p>
         </div>
      </section>

      {/* Minimalist Compact Footer */}
      <footer className="py-12 border-t border-white/5 bg-black relative">
        <div className="max-w-7xl mx-auto px-6">
           <div className="flex flex-col md:flex-row items-center justify-between gap-12 text-center md:text-left">
              <div className="flex flex-col md:flex-row items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <div className="w-2.5 h-2.5 bg-white rounded-full" />
                 </div>
                 <div className="flex flex-col">
                    <span className="text-xl font-bold tracking-tighter leading-none">easyKhata</span>
                    <span className="text-[9px] font-black text-white/20 uppercase tracking-widest mt-1">Smart Accounting</span>
                 </div>
              </div>

              <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 font-bold text-[10px] uppercase tracking-widest text-white/40">
                 <a href="#features" className="hover:text-white transition-colors">Features</a>
                 <button onClick={() => setIsPrivacyOpen(true)} className="hover:text-white transition-colors">Privacy</button>
              </div>

              <div className="flex flex-col items-center md:items-end gap-1">
                 <p className="text-[9px] text-white/10 font-bold uppercase tracking-widest">© 2026 Shrestha Consolidated</p>
                 <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[8px] font-bold text-emerald-500/60 uppercase tracking-widest">Global Ops Active</span>
                 </div>
              </div>
           </div>
        </div>
      </footer>

      <DemoModal isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)} />
      
      {/* Privacy Modal */}
      {isPrivacyOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 lg:p-12">
           <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             onClick={() => setIsPrivacyOpen(false)}
             className="absolute inset-0 bg-black/80 backdrop-blur-md"
           />
           <motion.div 
             initial={{ opacity: 0, scale: 0.9, y: 20 }}
             animate={{ opacity: 1, scale: 1, y: 0 }}
             className="relative w-full max-w-xl bg-[#0c0c0d] border border-white/10 p-10 lg:p-16 rounded-[3rem] shadow-[0_64px_128px_-16px_rgba(0,0,0,1)] overflow-hidden"
           >
              <div className="absolute top-0 right-0 p-8">
                 <button onClick={() => setIsPrivacyOpen(false)} className="text-white/20 hover:text-white transition-colors">
                    <X className="w-6 h-6" />
                 </button>
              </div>
              
              <div className="relative z-10 space-y-8">
                 <div className="w-16 h-16 rounded-3xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                    <Shield className="w-8 h-8 text-blue-400" />
                 </div>
                 
                 <div className="space-y-4">
                    <h2 className="text-4xl lg:text-5xl font-bold tracking-tighter">Your Data. <br />Your Business.</h2>
                    <p className="text-xl text-white/40 font-medium italic">100% Private. 100% Encrypted.</p>
                 </div>

                 <div className="space-y-6 pt-4">
                    <div className="flex gap-4">
                       <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 mt-1">
                          <Check className="w-3 h-3 text-emerald-400" />
                       </div>
                       <div>
                          <p className="text-white font-bold tracking-tight">Zero Tracking</p>
                          <p className="text-sm text-white/30">We don't track your location, your behavior, or your identity.</p>
                       </div>
                    </div>
                    <div className="flex gap-4">
                       <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 mt-1">
                          <Check className="w-3 h-3 text-emerald-400" />
                       </div>
                       <div>
                          <p className="text-white font-bold tracking-tight">No Data Selling</p>
                          <p className="text-sm text-white/30">Your financial records are never shared with third parties. Period.</p>
                       </div>
                    </div>
                 </div>

                 <button 
                   onClick={() => setIsPrivacyOpen(false)}
                   className="w-full py-4 rounded-2xl bg-white text-black font-black text-sm uppercase tracking-widest hover:scale-[1.02] transition-all"
                 >
                    Acknowledge
                 </button>
              </div>
           </motion.div>
        </div>
      )}
    </div>
  );
}
