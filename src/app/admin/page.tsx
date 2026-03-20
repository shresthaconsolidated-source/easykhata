'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { formatDistanceToNow, format } from 'date-fns';
import { Users, Zap, Activity, BarChart2, Clock, RefreshCw, Shield } from 'lucide-react';

const ADMIN_EMAIL = 'shresthaconsolidated@gmail.com';

interface CompanyStat {
  companyId: string;
  companyName: string;
  ownerEmail: string;
  currency: string;
  firstActive: string;
  lastActive: string;
  entriesToday: number;
  totalEntries: number;
}

interface AdminStats {
  totalUsers: number;
  totalTxToday: number;
  totalTxAll: number;
  companies: CompanyStat[];
}

function StatCard({ icon: Icon, label, value, color }: { icon: any, label: string, value: string | number, color: string }) {
  return (
    <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 flex flex-col gap-4">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-2">{label}</p>
        <p className="text-4xl font-black tracking-tighter text-white">{value}</p>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [lastRefresh, setLastRefresh] = useState(new Date());

  useEffect(() => {
    if (!loading) {
      if (!user) { router.push('/'); return; }
      if (user.email !== ADMIN_EMAIL) { router.push('/chat'); return; }
      loadStats();
    }
  }, [user, loading]);

  const loadStats = async () => {
    setFetching(true);
    setError('');
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { setError('No session'); return; }

      const res = await fetch('/api/admin/stats', {
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      });

      if (!res.ok) {
        const err = await res.json();
        setError(err.error || 'Failed to load stats');
        return;
      }

      const data = await res.json();
      setStats(data);
      setLastRefresh(new Date());
    } catch (e: any) {
      setError(e.message);
    } finally {
      setFetching(false);
    }
  };

  if (loading || (!user)) {
    return <div className="min-h-screen bg-[#030303] flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>;
  }

  if (user.email !== ADMIN_EMAIL) return null;

  return (
    <div className="min-h-screen bg-[#030303] text-white font-sans antialiased">
      {/* Fixed glow background */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-blue-600/5 blur-[200px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 py-16 relative">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-16">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <Shield className="w-5 h-5 text-red-400" />
              </div>
              <span className="text-[9px] font-black uppercase tracking-[0.5em] text-red-400">Admin Access</span>
            </div>
            <h1 className="text-5xl font-black tracking-tighter leading-none">Command Centre</h1>
            <p className="text-white/30 font-medium">easyKhata platform overview — visible only to you</p>
          </div>
          <button
            onClick={loadStats}
            disabled={fetching}
            className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] transition-all font-bold text-sm disabled:opacity-40"
          >
            <RefreshCw className={`w-4 h-4 ${fetching ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {error && (
          <div className="mb-8 px-6 py-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-bold">
            ⚠️ {error}
          </div>
        )}

        {/* Global KPI Cards */}
        {stats && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-12">
              <StatCard icon={Users} label="Total Businesses" value={stats.totalUsers} color="bg-blue-500/10 text-blue-400" />
              <StatCard icon={Zap} label="Entries Today" value={stats.totalTxToday} color="bg-emerald-500/10 text-emerald-400" />
              <StatCard icon={BarChart2} label="Total Entries (All Time)" value={stats.totalTxAll.toLocaleString()} color="bg-purple-500/10 text-purple-400" />
            </div>

            {/* Per-Company Table */}
            <div className="rounded-[2rem] bg-white/[0.02] border border-white/5 overflow-hidden">
              <div className="p-8 border-b border-white/5 flex items-center justify-between">
                <h2 className="text-xl font-black tracking-tight">All Businesses</h2>
                <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-white/20">
                  <Clock className="w-3.5 h-3.5" />
                  Updated {formatDistanceToNow(lastRefresh, { addSuffix: true })}
                </div>
              </div>

              {/* Desktop table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20 border-b border-white/5">
                      <th className="text-left px-8 py-4">Business</th>
                      <th className="text-left px-8 py-4">Owner</th>
                      <th className="text-center px-8 py-4">Today</th>
                      <th className="text-center px-8 py-4">Total Entries</th>
                      <th className="text-left px-8 py-4">First Active</th>
                      <th className="text-left px-8 py-4">Last Active</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.03]">
                    {stats.companies.map((c) => (
                      <tr key={c.companyId} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-8 py-5">
                          <p className="font-black text-white tracking-tight">{c.companyName}</p>
                          <p className="text-[10px] text-white/20 font-medium mt-0.5">{c.currency}</p>
                        </td>
                        <td className="px-8 py-5 text-sm text-white/50 font-medium">{c.ownerEmail}</td>
                        <td className="px-8 py-5 text-center">
                          <span className={`text-lg font-black ${c.entriesToday > 0 ? 'text-emerald-400' : 'text-white/20'}`}>
                            {c.entriesToday}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-center">
                          <span className="text-xl font-black text-white">{c.totalEntries}</span>
                        </td>
                        <td className="px-8 py-5 text-sm text-white/30 font-medium">
                          {c.firstActive ? format(new Date(c.firstActive), 'MMM dd, yyyy') : '—'}
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                              c.entriesToday > 0 ? 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.8)] animate-pulse' : 'bg-white/10'
                            }`} />
                            <span className="text-sm text-white/30 font-medium">
                              {c.lastActive ? formatDistanceToNow(new Date(c.lastActive), { addSuffix: true }) : 'No activity'}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden divide-y divide-white/[0.03]">
                {stats.companies.map((c) => (
                  <div key={c.companyId} className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-black text-white">{c.companyName}</p>
                        <p className="text-xs text-white/30 mt-0.5">{c.ownerEmail}</p>
                      </div>
                      <div className={`flex items-center gap-1.5 ${c.entriesToday > 0 ? 'text-emerald-400' : 'text-white/20'}`}>
                        <Activity className="w-4 h-4" />
                        <span className="font-black">{c.entriesToday} today</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white/[0.02] rounded-xl p-3 text-center">
                        <p className="text-[8px] font-black uppercase tracking-widest text-white/20 mb-1">Total</p>
                        <p className="text-2xl font-black">{c.totalEntries}</p>
                      </div>
                      <div className="bg-white/[0.02] rounded-xl p-3 text-center">
                        <p className="text-[8px] font-black uppercase tracking-widest text-white/20 mb-1">Last Seen</p>
                        <p className="text-xs font-bold text-white/50 mt-2">{c.lastActive ? formatDistanceToNow(new Date(c.lastActive), { addSuffix: true }) : '—'}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {stats.companies.length === 0 && (
                <div className="px-8 py-20 text-center text-white/20 font-bold">
                  No businesses found yet.
                </div>
              )}
            </div>
          </>
        )}

        {fetching && !stats && (
          <div className="flex items-center justify-center py-32">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        <p className="text-center text-[8px] font-black uppercase tracking-[0.5em] text-white/10 mt-12">
          easyKhata Admin Console · {ADMIN_EMAIL}
        </p>
      </div>
    </div>
  );
}
