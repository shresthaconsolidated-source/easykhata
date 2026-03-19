'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Zap } from 'lucide-react';
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

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-blue-500/30 overflow-x-hidden font-sans flex flex-col">
      
      {/* Navbar */}
      <nav className="w-full z-[100] px-6 py-6 md:py-8 flex items-center justify-between max-w-[1400px] mx-auto absolute top-0 inset-x-0">
         <div className="flex items-center gap-3 cursor-pointer group">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
               <div className="w-4 h-4 rounded-sm border-2 border-black" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">easyKhata</span>
         </div>

         <div className="hidden lg:flex items-center gap-12 text-sm font-semibold text-white/50">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#security" className="hover:text-white transition-colors">Security</a>
         </div>

         <div className="flex items-center gap-4">
            {/* Nav Sign in Button - Premium Google Pill */}
            <button 
              onClick={signInWithGoogle}
              className="hidden sm:flex items-center gap-3 pl-2 pr-1 py-1 rounded-full bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] hover:border-white/20 transition-all cursor-pointer group"
            >
               <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-black uppercase">
                  S
               </div>
               <div className="flex flex-col items-start pr-4">
                  <span className="text-xs font-bold text-white leading-none mb-0.5 group-hover:text-white">Sign in</span>
                  <span className="text-[9px] text-white/40 leading-none">start managing now</span>
               </div>
               <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-md">
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                     <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                     <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                     <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                     <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
               </div>
            </button>
         </div>
      </nav>

      {/* Main Layout Grid */}
      <main className="flex-1 flex flex-col justify-center relative max-w-[1400px] mx-auto w-full px-6 pt-32 pb-20 lg:pt-0 lg:pb-0 min-h-screen">
         
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center h-full">
            
            {/* Left Content Column */}
            <div className="flex flex-col items-start z-10 lg:pr-10 xl:pr-20">
               
               {/* Badge */}
               <motion.div 
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="inline-flex items-center gap-2 pl-3 pr-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-8"
               >
                 <Zap className="w-3.5 h-3.5 text-emerald-400" />
                 <span className="text-[10px] font-bold tracking-[0.15em] text-emerald-400 uppercase">Version 2.0 is Live</span>
               </motion.div>

               {/* Giant Typography */}
               <motion.h1 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.1 }}
                 className="text-6xl sm:text-7xl md:text-8xl lg:text-[6.5rem] xl:text-[8rem] font-black tracking-[-0.03em] leading-[0.85] text-white flex flex-col"
               >
                  <span>STOP DOING</span>
                  <span>ACCOUNTS.</span>
                  <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mt-1">START</span>
                  <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">RUNNING.</span>
               </motion.h1>

               <motion.p 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.2 }}
                 className="mt-8 text-lg sm:text-xl text-white/50 max-w-lg font-medium leading-relaxed"
               >
                 A high-precision financial manager designed for business owners who value speed, intelligence, and a beautiful interface.
               </motion.p>

               {/* CTA Area */}
               <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.3 }}
                 className="mt-12 flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto"
               >
                  {/* Big Custom Google Button */}
                  <button 
                     onClick={signInWithGoogle}
                     className="w-full sm:w-auto flex items-center justify-between gap-6 pl-3 pr-1.5 py-1.5 rounded-[2rem] bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] hover:border-white/20 transition-all cursor-pointer group shadow-[0_0_30px_rgba(0,0,0,0.5)]"
                  >
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm font-black uppercase ring-1 ring-emerald-500/30">
                           S
                        </div>
                        <div className="flex flex-col items-start pr-6">
                           <span className="text-sm font-bold text-white leading-tight">Continue as Guest</span>
                           <span className="text-[10px] text-white/40 leading-tight">or sign in with Google</span>
                        </div>
                     </div>
                     <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                           <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                           <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                           <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                           <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                     </div>
                  </button>

                  <div className="flex items-center gap-3 px-6 py-4 rounded-[2rem] border border-white/5 bg-transparent text-white/50 text-xs font-bold tracking-widest uppercase">
                     <ShieldCheck className="w-4 h-4 text-emerald-500" />
                     Enterprise Grade Privacy
                  </div>
               </motion.div>

               {/* Stats Area (Footer style of this section) */}
               <motion.div 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 transition={{ delay: 0.5 }}
                 className="mt-16 pt-10 border-t border-white/5 grid grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-xl"
               >
                  <div>
                     <p className="text-3xl font-black text-white mb-1 tracking-tight">$0.00</p>
                     <p className="text-[9px] font-bold text-white/40 uppercase tracking-[0.2em]">Setup Costs</p>
                  </div>
                  <div>
                     <p className="text-3xl font-black text-white mb-1 tracking-tight">100%</p>
                     <p className="text-[9px] font-bold text-white/40 uppercase tracking-[0.2em]">Data Privacy</p>
                  </div>
                  <div className="hidden md:block">
                     <p className="text-3xl font-black text-white mb-1 tracking-tight">Secured</p>
                     <p className="text-[9px] font-bold text-white/40 uppercase tracking-[0.2em]">By Google</p>
                  </div>
               </motion.div>
            </div>

            {/* Right Visual Column */}
            <div className="relative w-full h-[500px] lg:h-[800px] hidden sm:flex items-center justify-center -mr-12 lg:-mr-24 perspective-[2000px]">
               <FloatingChatMockup />
            </div>
         </div>
      </main>

      <DemoModal isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)} />
    </div>
  );
}
