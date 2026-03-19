'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { ArrowRight, Play } from 'lucide-react';
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
      title: "Chat",
      desc: "Log expenses like a message.",
    },
    {
      title: "Dashboard",
      desc: "See profit instantly.",
    },
    {
      title: "Invoices",
      desc: "Send professional invoices in seconds.",
    }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-blue-500/30 overflow-x-hidden">
      
      {/* Navbar - Ultra minimalist glass */}
      <nav className="fixed top-0 inset-x-0 z-[100] bg-[#050505]/50 backdrop-blur-md border-b border-white/5 transition-all duration-300">
         <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2 cursor-pointer group">
               <div className="w-6 h-6 rounded-md bg-white flex items-center justify-center">
                  <div className="w-2 h-2 bg-black rounded-full" />
               </div>
               <span className="text-lg font-bold tracking-tight">easyKhata</span>
            </div>

            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/50">
               <a href="#features" className="hover:text-white transition-colors">Product</a>
               <a href="#" className="hover:text-white transition-colors">Pricing</a>
               <button 
                 onClick={signInWithGoogle}
                 className="hover:text-white transition-colors"
               >
                 Login
               </button>
            </div>

            <button 
              onClick={signInWithGoogle}
              className="bg-white text-black text-sm font-semibold px-5 py-2 rounded-full hover:bg-white/90 hover:shadow-[0_0_15px_rgba(255,255,255,0.4)] transition-all active:scale-95"
            >
              Start Free
            </button>
         </div>
      </nav>

      {/* Hero Section - Giant Typography & Clean Layout */}
      <div className="relative pt-48 pb-32">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl lg:text-[7.5rem] font-bold tracking-tight leading-[0.9] text-white mb-8 max-w-5xl mx-auto"
          >
            Finance, Without <br className="hidden md:block" /> the <span className="text-blue-500">Friction.</span>
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12"
          >
            <button 
              onClick={signInWithGoogle}
              className="group relative bg-white text-black font-semibold text-lg px-8 py-4 rounded-full hover:scale-105 transition-all active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              <span className="relative z-10 flex items-center gap-2">
                Start Free <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            <button 
              onClick={() => setIsDemoOpen(true)}
              className="px-8 py-4 rounded-full border border-white/20 text-white font-semibold text-lg hover:bg-white/[0.03] hover:border-white/40 transition-all active:scale-95 flex items-center gap-2 hover:shadow-[0_4px_20px_rgba(255,255,255,0.05)] w-full sm:w-auto justify-center group"
            >
              <Play className="w-4 h-4 text-white/50 group-hover:text-white transition-colors" /> View Demo
            </button>
          </motion.div>
        </div>
      </div>

      {/* Main Product Visual - Completely Dominant */}
      <div className="relative w-full max-w-6xl mx-auto px-6 mb-40">
        <FloatingChatMockup />
      </div>

      {/* Extreme Minimal Features Section */}
      <div id="features" className="max-w-7xl mx-auto px-6 py-32 border-t border-white/[0.05]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group bg-white/[0.02] border border-white/5 p-10 lg:p-12 rounded-[2rem] hover:-translate-y-2 transition-all duration-500 hover:border-white/10 hover:shadow-[3px_10px_40px_rgba(0,0,0,0.5),_0_0_20px_rgba(255,255,255,0.03)] cursor-default relative overflow-hidden"
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <h3 className="text-2xl font-semibold mb-3 tracking-tight text-white">{f.title}</h3>
              <p className="text-white/40 text-lg font-medium tracking-tight">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Ultra Clean Footer */}
      <footer className="py-12 border-t border-white/5 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
           <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-white flex items-center justify-center">
                 <div className="w-2 h-2 bg-black rounded-full" />
              </div>
              <span className="text-lg font-bold tracking-tight">easyKhata</span>
           </div>
           
           <div className="flex items-center gap-8 text-sm font-medium text-white/40">
              <a href="#features" className="hover:text-white transition-colors">Features</a>
              <a href="#" className="hover:text-white transition-colors">Pricing</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
           </div>

           <p className="text-xs text-white/20 font-medium">
              © {new Date().getFullYear()} Shrestha Consolidated Source
           </p>
        </div>
      </footer>

      <DemoModal isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)} />
    </div>
  );
}
