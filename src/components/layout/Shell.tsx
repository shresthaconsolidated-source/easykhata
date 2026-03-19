'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  MessageSquare, 
  LayoutDashboard, 
  BarChart3, 
  FileText, 
  ArrowLeftRight, 
  Settings, 
  Menu, 
  X,
  Plus,
  LogOut
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { name: 'Chat', href: '/chat', icon: MessageSquare },
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'P&L', href: '/pl', icon: BarChart3 },
  { name: 'Invoices', href: '/invoices', icon: FileText },
  { name: 'Transactions', href: '/transactions', icon: ArrowLeftRight },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Shell({ children }: { children: React.ReactNode }) {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [company, setCompany] = useState<any>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (user) {
      fetchCompany();
    }
  }, [user]);

  const fetchCompany = async () => {
    const { data } = await supabase
      .from('company_members')
      .select('companies(*)')
      .eq('user_id', user?.id)
      .single();
    
    if (data) setCompany(data.companies);
  };

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden font-sans">
      {/* Mobile Drawer Backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 bg-[#0A0A0A] shadow-[inset_-1px_0_0_rgba(255,255,255,0.05)] transition-transform lg:static lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-8">
            <div className="flex items-center gap-3 mb-1">
               <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
               </div>
               <h1 className="text-2xl font-black bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent tracking-tighter">
                 easyKhata
               </h1>
            </div>
            <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.2em] ml-11 leading-none">Accounting Simplified</p>
            
            {/* Branding - Requested by User */}
            <div className="mt-8 pt-6 border-t border-white/5 group">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-xs font-bold ring-1 ring-white/10 group-hover:bg-blue-600 group-hover:ring-blue-500 transition-all duration-300">
                    {company?.name?.[0] || 'C'}
                 </div>
                 <div className="min-w-0">
                    <p className="text-sm font-bold text-white/90 truncate group-hover:text-white transition-colors">
                       {company?.name || 'My Company'}
                    </p>
                    <p className="text-[10px] text-white/30 truncate group-hover:text-blue-400 transition-colors">
                       {user?.email}
                    </p>
                 </div>
              </div>
            </div>
          </div>

          <nav className="flex-1 px-6 space-y-1.5 overflow-y-auto mt-4 custom-scrollbar">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "group flex items-center gap-3 px-4 py-3 text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all duration-300",
                    isActive
                      ? "bg-white/5 text-white border border-white/10 shadow-lg"
                      : "text-white/30 hover:text-white/70 hover:bg-white/[0.02] border border-transparent"
                  )}
                >
                  <item.icon className={cn(
                    "w-4 h-4 transition-colors duration-300",
                    isActive ? "text-blue-500" : "text-white/20 group-hover:text-white/40"
                  )} />
                  {item.name}
                </Link>
              );
            })}

            <Link
              href="/insights"
              onClick={() => setSidebarOpen(false)}
              className={cn(
                "group flex items-center gap-3 px-4 py-3 text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all duration-300",
                pathname === '/insights'
                  ? "bg-white/5 text-white border border-white/10 shadow-lg"
                  : "text-white/30 hover:text-white/70 hover:bg-white/[0.02] border border-transparent"
              )}
            >
              <div className={cn(
                "w-4 h-4 flex items-center justify-center transition-colors duration-300",
                pathname === '/insights' ? "text-emerald-500" : "text-white/20 group-hover:text-white/40"
              )}>
                 <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
              </div>
              Insights
            </Link>
          </nav>

          {/* Bottom Actions */}
          <div className="p-6 space-y-4">
              <button 
                onClick={() => router.push('/chat')}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-gradient-to-br from-white/10 to-white/[0.02] border border-white/10 hover:border-white/20 transition-all group overflow-hidden relative shadow-lg active:scale-95"
              >
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <Plus className="w-5 h-5 text-white/40 group-hover:text-white transition-colors" />
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40 group-hover:text-white transition-colors">Add Transaction</span>
              </button>
            
            <button 
              onClick={signOut}
              className="flex items-center gap-2 w-full px-4 py-3 text-white/20 hover:text-red-400 hover:bg-red-500/5 rounded-2xl transition-all text-xs font-bold uppercase tracking-widest justify-center"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#050505]">
        <header className="h-16 border-b border-white/5 bg-[#0A0A0A]/80 backdrop-blur-xl flex items-center justify-between px-6 lg:hidden relative z-30">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-2 text-white/40 hover:text-white transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
             <div className="w-6 h-6 rounded-lg bg-blue-600" />
             <span className="font-black text-lg tracking-tighter">easyKhata</span>
          </div>
          <div className="w-6" />
        </header>

        <main className="flex-1 overflow-y-auto relative custom-scrollbar pb-24 lg:pb-10">
          <div className="max-w-6xl mx-auto h-full px-4 sm:px-6 md:px-12 py-10">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-6 left-6 right-6 z-50 lg:hidden">
        <div className="bg-[#121214]/80 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-2 flex items-center justify-around shadow-[0_32px_64px_-16px_rgba(0,0,0,1)] ring-1 ring-white/5">
           {navItems.slice(0, 4).map((item) => {
             const isActive = pathname === item.href;
             return (
               <Link 
                 key={item.name} 
                 href={item.href}
                 className={cn(
                   "flex flex-col items-center gap-1 p-3 rounded-2xl transition-all duration-300 relative",
                   isActive ? "text-blue-500 scale-110" : "text-white/30 hover:text-white/60"
                 )}
               >
                 <item.icon className={cn("w-5 h-5", isActive && "drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]")} />
                 <span className="text-[8px] font-black uppercase tracking-widest">{item.name}</span>
                 {isActive && (
                   <div className="absolute -bottom-1 w-1 h-1 bg-blue-500 rounded-full shadow-[0_0_10px_#3b82f6]" />
                 )}
               </Link>
             );
           })}
           
           {/* Add Transaction Button - Center Focus */}
           <button 
             onClick={() => router.push('/chat')}
             className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-[0_12px_24px_-8px_rgba(37,99,235,0.6)] active:scale-90 transition-all group"
           >
              <Plus className="w-6 h-6 text-white group-hover:rotate-90 transition-transform duration-500" />
           </button>
        </div>
      </nav>

      <style jsx global>{`
        .scale-in { animation: scaleIn 0.3s ease-out; }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #ffffff0a; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #ffffff15; }
      `}</style>
    </div>
  );
}
