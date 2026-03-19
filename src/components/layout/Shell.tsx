'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
        "fixed inset-y-0 left-0 z-50 w-72 bg-[#0c0c0d] border-r border-white/5 transition-transform lg:static lg:translate-x-0 shadow-2xl",
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

          {/* Navigation */}
          <nav className="flex-1 px-5 space-y-2 mt-2 py-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3.5 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative",
                    isActive 
                      ? "bg-blue-600 shadow-[0_8px_32px_rgba(37,99,235,0.25)] text-white font-bold scale-[1.02]" 
                      : "text-white/40 hover:bg-white/5 hover:text-white"
                  )}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r-full" />
                  )}
                  <item.icon className={cn(
                    "w-5 h-5 transition-transform duration-300",
                    isActive ? "text-white rotate-6 scale-110" : "text-white/20 group-hover:text-white"
                  )} />
                  <span className="text-sm tracking-tight">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Bottom Actions */}
          <div className="p-6 space-y-4">
            <Link 
              href="/chat"
              className="flex items-center gap-2 w-full px-4 py-4 bg-white text-black font-black rounded-3xl transition-all shadow-xl hover:bg-white/90 active:scale-95 text-center justify-center group"
            >
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              <span>Record Action</span>
            </Link>
            
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
      <div className="flex-1 flex flex-col min-w-0 bg-[#070708]">
        <header className="h-16 border-b border-white/5 bg-[#0c0c0d]/80 backdrop-blur-xl flex items-center justify-between px-6 lg:hidden relative z-30">
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

        <main className="flex-1 overflow-y-auto relative custom-scrollbar">
          <div className="max-w-6xl mx-auto h-full px-4 sm:px-6 md:px-12 py-10">
            {children}
          </div>
        </main>
      </div>

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
