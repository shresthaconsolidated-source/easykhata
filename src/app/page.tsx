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
  Lock
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LandingPage() {
  const { user, signInWithGoogle, loading } = useAuth();
  const router = useRouter();

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
      {/* Background Gradients */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black" />
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 blur-[150px] rounded-full -z-10 animate-pulse" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-600/5 blur-[150px] rounded-full -z-10 animate-pulse delay-1000" />

      {/* Nav */}
      <nav className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-2xl shadow-blue-500/20">
               <div className="w-4 h-4 bg-white rounded-full shadow-inner" />
            </div>
            <span className="text-2xl font-black tracking-tighter">easyKhata</span>
         </div>
         <button 
           onClick={signInWithGoogle}
           className="hidden md:flex items-center gap-2 text-sm font-bold text-white/60 hover:text-white py-2 px-5 hover:bg-white/5 rounded-xl transition-all"
         >
           Log In
         </button>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-12 pb-24 lg:pt-24 lg:pb-32">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-blue-500/5 border border-blue-500/20 text-[10px] font-black uppercase tracking-[0.2em] mb-10 text-blue-400 shadow-[0_0_40px_rgba(59,130,246,0.1)]">
            <Sparkles className="w-4 h-4" />
            Accounting for modern traders
          </div>
          
          <h1 className="text-6xl lg:text-8xl font-black tracking-tighter mb-8 leading-[0.9] lg:leading-[0.85]">
            Accounting is <br className="hidden md:block" />
            <span className="bg-gradient-to-br from-white via-white to-white/30 bg-clip-text text-transparent">as simple as a</span> <br className="hidden lg:block" />
            <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">Telegram chat.</span>
          </h1>
          
          <p className="text-lg lg:text-2xl text-white/40 max-w-2xl mx-auto mb-16 leading-relaxed font-medium">
            The fastest way for small businesses and traders to track finances, 
            manage invoices, and see profits in real-time.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-24">
            <button 
              onClick={signInWithGoogle}
              className="w-full sm:w-auto bg-white text-black font-black px-10 py-5 rounded-[2rem] flex items-center justify-center gap-3 hover:bg-white/90 transition-all shadow-[0_20px_60px_rgba(255,255,255,0.2)] active:scale-95 group relative overflow-hidden"
            >
              <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              <Chrome className="w-6 h-6" />
              Sign in with Google
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="w-full sm:w-auto bg-[#1c1c1e] hover:bg-[#252528] text-white font-black px-10 py-5 rounded-[2rem] border border-white/5 flex items-center justify-center gap-3 transition-all">
              Watch Demo
              <ShieldCheck className="w-6 h-6 text-white/20" />
            </button>
          </div>

          {/* Social Proof */}
          <div className="pt-20 border-t border-white/5">
             <div className="grid grid-cols-2 md:grid-cols-4 gap-8 opacity-20 hover:opacity-40 transition-opacity duration-700">
                <div className="flex items-center justify-center gap-2 flex-col">
                   <Lock className="w-8 h-8 mb-2" />
                   <span className="text-[10px] font-black tracking-widest uppercase italic">Secure Cloud</span>
                </div>
                <div className="flex items-center justify-center gap-2 flex-col">
                   <Calculator className="w-8 h-8 mb-2" />
                   <span className="text-[10px] font-black tracking-widest uppercase italic">Auto Tax</span>
                </div>
                <div className="flex items-center justify-center gap-2 flex-col">
                   <Zap className="w-8 h-8 mb-2" />
                   <span className="text-[10px] font-black tracking-widest uppercase italic">Instant P&L</span>
                </div>
                <div className="flex items-center justify-center gap-2 flex-col">
                   <Sparkles className="w-8 h-8 mb-2" />
                   <span className="text-[10px] font-black tracking-widest uppercase italic">AI NLP Chat</span>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-6 py-32 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-600/5 blur-[150px] -z-10" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {features.map((f, i) => (
            <div key={i} className="group relative">
               <div className={cn("absolute inset-0 blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10", f.glow)} />
               <div className="bg-[#0c0c0d] p-10 rounded-[3rem] border border-white/5 hover:border-white/10 transition-all duration-500 shadow-2xl h-full flex flex-col relative overflow-hidden backdrop-blur-xl">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl -mr-16 -mt-16 group-hover:bg-blue-500/10 transition-colors" />
                  <div className={cn("p-5 rounded-3xl bg-white/5 w-fit mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500", f.color)}>
                    <f.icon className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-black mb-4 tracking-tight">{f.title}</h3>
                  <p className="text-white/40 text-lg leading-relaxed font-medium">
                    {f.desc}
                  </p>
                  <div className="mt-auto pt-8 flex items-center gap-2 text-white/20 group-hover:text-white/40 transition-colors text-xs font-black uppercase tracking-widest">
                    Learn More <ArrowRight className="w-4 h-4" />
                  </div>
               </div>
            </div>
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
