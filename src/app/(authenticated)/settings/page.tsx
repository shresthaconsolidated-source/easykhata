'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { 
  Building2, 
  Users, 
  Tag, 
  ArrowLeft, 
  UserPlus, 
  Shield, 
  CircleDollarSign,
  Plus,
  Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const { user, signOut } = useAuth();
  const [company, setCompany] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchSettings();
    }
  }, [user]);

  const fetchSettings = async () => {
    const { data: membership } = await supabase
      .from('company_members')
      .select('company_id, companies(*)')
      .eq('user_id', user?.id)
      .single();

    if (!membership) return;
    setCompany(membership.companies);

    const companyId = membership.company_id;

    // Fetch members
    const { data: membersData } = await supabase
      .from('company_members')
      .select('*, profiles(email, full_name)')
      .eq('company_id', companyId);
    
    // Fetch categories
    const { data: categoriesData } = await supabase
      .from('categories')
      .select('*')
      .eq('company_id', companyId);

    // Fetch clients
    const { data: clientsData } = await supabase
      .from('clients')
      .select('*')
      .eq('company_id', companyId)
      .order('name');

    if (membersData) setMembers(membersData);
    if (categoriesData) setCategories(categoriesData);
    if (clientsData) setClients(clientsData);
    setLoading(false);
  };

  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/';
  };

  if (loading) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-white/40 mt-1">Manage your company Profile and team access.</p>
      </div>

      {/* Company Info */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <Building2 className="w-5 h-5 text-blue-400" />
          <h2 className="font-bold text-lg">Company Profile</h2>
        </div>
        <div className="bg-[#1c1c1e] p-8 rounded-[2.5rem] border border-white/5 shadow-xl grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="space-y-1">
             <label className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Company Name</label>
             <p className="font-bold text-lg">{company?.name}</p>
           </div>
           <div className="space-y-1">
             <label className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Currency</label>
             <p className="font-bold text-lg flex items-center gap-2">
               <CircleDollarSign className="w-4 h-4 text-white/20" />
               {company?.currency}
             </p>
           </div>
           <div className="space-y-1">
             <label className="text-[10px] text-white/30 uppercase tracking-widest font-bold">PAN / Tax ID</label>
             <p className="font-bold text-lg">{company?.pan || 'Not set'}</p>
           </div>
           <div className="space-y-1">
             <label className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Address</label>
             <p className="font-bold text-lg line-clamp-1">{company?.address}</p>
           </div>
        </div>
      </section>

      {/* Team Management */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-purple-400" />
            <h2 className="font-bold text-lg">Team Members</h2>
          </div>
          <button className="text-sm font-bold text-blue-400 hover:text-blue-300 flex items-center gap-2">
            <UserPlus className="w-4 h-4" /> Invite
          </button>
        </div>
        <div className="bg-[#1c1c1e] rounded-[2.5rem] border border-white/5 shadow-xl overflow-hidden">
           {members.map((m) => (
             <div key={m.id} className="flex items-center justify-between p-6 border-b border-white/5 last:border-0 hover:bg-white/[0.01] transition-colors">
               <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center font-bold text-white/20">
                    {m.profiles?.full_name?.charAt(0) || m.profiles?.email?.charAt(0)}
                 </div>
                 <div>
                   <p className="font-bold">{m.profiles?.full_name || 'Member'}</p>
                   <p className="text-sm text-white/40">{m.profiles?.email}</p>
                 </div>
               </div>
               <div className={cn(
                 "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                 m.role === 'owner' ? "bg-purple-500/10 text-purple-400 border-purple-500/20" : "bg-white/5 text-white/40 border-white/10"
               )}>
                 {m.role}
               </div>
             </div>
           ))}
        </div>
      </section>

      {/* Client Manager */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <UserPlus className="w-5 h-5 text-blue-400" />
            <h2 className="font-bold text-lg">Saved Clients</h2>
          </div>
          <button className="text-sm font-bold text-blue-400 hover:text-blue-300 flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Client
          </button>
        </div>
        <div className="bg-[#1c1c1e] rounded-[2.5rem] border border-white/5 shadow-xl overflow-hidden">
           {clients.length === 0 ? (
             <div className="p-12 text-center text-white/20 font-medium">No clients saved yet.</div>
           ) : clients.map((c) => (
             <div key={c.id} className="flex items-center justify-between p-6 border-b border-white/5 last:border-0 hover:bg-white/[0.01] transition-colors">
               <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center font-bold text-blue-400">
                    {c.name.charAt(0)}
                 </div>
                 <div>
                   <p className="font-bold">{c.name}</p>
                   {c.pan && <p className="text-xs text-white/40 uppercase tracking-widest mt-0.5">PAN: {c.pan}</p>}
                 </div>
               </div>
               <div className="flex items-center gap-4">
                 <div className="text-right hidden sm:block">
                   <p className="text-xs text-white/40 line-clamp-1 max-w-[200px]">{c.address}</p>
                 </div>
                 <button className="p-2 text-white/10 hover:text-red-400 transition-colors">
                   <Trash2 className="w-4 h-4" />
                 </button>
               </div>
             </div>
           ))}
        </div>
      </section>

      {/* Category Manager */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Tag className="w-5 h-5 text-emerald-400" />
            <h2 className="font-bold text-lg">Categories</h2>
          </div>
          <button className="text-sm font-bold text-blue-400 hover:text-blue-300 flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add New
          </button>
        </div>
        <div className="bg-[#1c1c1e] p-8 rounded-[2.5rem] border border-white/5 shadow-xl grid grid-cols-2 md:grid-cols-4 gap-4">
           {categories.map((cat) => (
             <div key={cat.id} className="p-4 bg-white/[0.03] rounded-2xl border border-white/5 flex items-center justify-between group">
               <div className="min-w-0">
                  <p className="font-bold text-sm truncate">{cat.name}</p>
                  <p className={cn(
                    "text-[8px] font-black uppercase tracking-tighter",
                    cat.type === 'income' ? "text-green-500" : "text-red-500"
                  )}>{cat.type}</p>
               </div>
               <button className="p-1.5 opacity-0 group-hover:opacity-100 text-white/10 hover:text-red-400 transition-all">
                 <Trash2 className="w-3.5 h-3.5" />
               </button>
             </div>
           ))}
        </div>
      </section>

      {/* Account Section */}
      <section className="pt-8 border-t border-white/5 flex items-center justify-between">
         <div className="flex items-center gap-4 text-white/40">
           <div className="w-12 h-12 rounded-full border-2 border-white/10 overflow-hidden">
             <img src={user?.user_metadata?.avatar_url || ''} alt="" className="w-full h-full object-cover" />
           </div>
           <div>
             <p className="font-bold text-white">{user?.user_metadata?.full_name}</p>
             <p className="text-xs uppercase tracking-widest">Signed in with Google</p>
           </div>
         </div>
         <button 
           onClick={handleSignOut}
           className="px-8 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-2xl transition-all shadow-xl shadow-red-500/10 active:scale-95"
         >
           Logout
         </button>
      </section>
    </div>
  );
}
