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
  FileText 
} from 'lucide-react';

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
      color: "text-blue-400"
    },
    {
      title: "Clean Dashboard",
      desc: "Get instant insights into your profit and loss without any accounting jargon.",
      icon: BarChart3,
      color: "text-purple-400"
    },
    {
      title: "Professional Invoices",
      desc: "Create and send professional-looking invoices to your clients in seconds.",
      icon: FileText,
      color: "text-emerald-400"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-blue-500/30">
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-20 pb-16 lg:pt-32 lg:pb-24">
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full -z-10" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
            <Zap className="w-4 h-4 text-blue-400" />
            Accounting for modern traders
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
            Accounting is as simple <br className="hidden lg:block" /> as a <span className="text-blue-500">Telegram chat.</span>
          </h1>
          
          <p className="text-lg lg:text-xl text-white/40 max-w-2xl mx-auto mb-12">
            The fastest way for small businesses and traders to track finances, 
            manage invoices, and see profits. Multi-user ready.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={signInWithGoogle}
              className="w-full sm:w-auto bg-white text-black font-bold px-8 py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-white/90 transition-all shadow-xl active:scale-95 group"
            >
              <Chrome className="w-5 h-5" />
              Sign in with Google
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-white font-bold px-8 py-4 rounded-2xl flex items-center justify-center gap-3 transition-all">
              Watch Demo
              <ShieldCheck className="w-5 h-5 opacity-40" />
            </button>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div key={i} className="bg-[#1c1c1e] p-8 rounded-[2.5rem] border border-white/5 hover:border-white/10 transition-all group shadow-2xl">
              <div className={`p-4 rounded-2xl bg-white/5 w-fit mb-6 group-hover:scale-110 transition-transform ${f.color}`}>
                <f.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">{f.title}</h3>
              <p className="text-white/40 leading-relaxed font-medium">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Social Proof/Trust */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-white/5 text-center">
        <p className="text-xs font-bold text-white/20 uppercase tracking-[0.2em] mb-8">Trusted by 5,000+ businesses</p>
        <div className="flex flex-wrap justify-center items-center gap-12 opacity-30 grayscale contrast-125">
           <span className="text-2xl font-black italic tracking-tighter">FINANCE.IO</span>
           <span className="text-2xl font-black tracking-widest">METRIC_</span>
           <span className="text-2xl font-serif">TRADER_X</span>
           <span className="text-2xl font-black underline decoration-4 underline-offset-4">PAY_LY</span>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-sm text-white/20 font-medium">
            © 2026 easyKhata. All rights reserved.
          </div>
          <div className="flex gap-8 text-sm font-bold text-white/40">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
