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
  Trash2,
  Settings,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ClientManagerModal } from '@/components/settings/ClientManagerModal';
import { InviteModal } from '@/components/settings/InviteModal';
import { CategoryModal } from '@/components/settings/CategoryModal';

export default function SettingsPage() {
  const { user, signOut } = useAuth();
  const [company, setCompany] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

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

  const deleteCategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (!error) fetchSettings();
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
          <button 
            onClick={() => setIsInviteModalOpen(true)}
            className="text-xs font-black uppercase tracking-[0.2em] text-blue-400 hover:text-blue-300 flex items-center gap-2 bg-blue-400/5 px-4 py-2 rounded-xl border border-blue-400/10 transition-all hover:bg-blue-400/10"
          >
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
          <button 
            onClick={() => setIsClientModalOpen(true)}
            className="text-xs font-black uppercase tracking-[0.2em] text-blue-400 hover:text-blue-300 flex items-center gap-2 bg-blue-400/5 px-4 py-2 rounded-xl border border-blue-400/10 transition-all hover:bg-blue-400/10"
          >
            <Plus className="w-4 h-4" /> Manage Clients
          </button>
        </div>
        <div className="bg-[#1c1c1e] p-10 rounded-[3rem] border border-white/5 shadow-xl flex items-center justify-between group hover:bg-white/[0.01] transition-all cursor-pointer" onClick={() => setIsClientModalOpen(true)}>
           <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-[1.5rem] bg-blue-500/10 flex items-center justify-center ring-1 ring-blue-500/20 group-hover:scale-110 transition-all duration-500">
                 <Users className="w-8 h-8 text-blue-400" />
              </div>
              <div>
                 <p className="font-black text-2xl tracking-tight text-white/90">{clients.length} Saved Clients</p>
                 <p className="text-white/30 text-xs font-medium uppercase tracking-widest mt-1">Click to view, edit or delete</p>
              </div>
           </div>
           <ArrowRight className="w-6 h-6 text-white/10 group-hover:text-blue-400 group-hover:translate-x-2 transition-all" />
        </div>
      </section>

      {/* Category Manager */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Tag className="w-5 h-5 text-emerald-400" />
            <h2 className="font-bold text-lg">Categories</h2>
          </div>
          <button 
            onClick={() => setIsCategoryModalOpen(true)}
            className="text-xs font-black uppercase tracking-[0.2em] text-blue-400 hover:text-blue-300 flex items-center gap-2 bg-blue-400/5 px-4 py-2 rounded-xl border border-blue-400/10 transition-all hover:bg-blue-400/10"
          >
            <Plus className="w-4 h-4" /> Add New
          </button>
        </div>
        <div className="bg-[#1c1c1e] p-10 rounded-[3rem] border border-white/5 shadow-xl grid grid-cols-2 md:grid-cols-4 gap-6">
           {categories.map((cat) => (
             <div key={cat.id} className="p-6 bg-white/[0.02] rounded-[2rem] border border-white/5 flex items-center justify-between group hover:bg-white/[0.04] transition-all">
               <div className="min-w-0">
                  <p className="font-black text-lg tracking-tight truncate text-white/90">{cat.name}</p>
                  <p className={cn(
                    "text-[9px] font-black uppercase tracking-[0.1em] mt-1",
                    cat.type === 'income' ? "text-green-500/60" : "text-red-500/60"
                  )}>{cat.type}</p>
               </div>
               <button 
                 onClick={() => deleteCategory(cat.id)}
                 className="p-2 opacity-0 group-hover:opacity-100 text-white/10 hover:text-red-400 transition-all"
               >
                 <Trash2 className="w-4 h-4" />
               </button>
             </div>
           ))}
        </div>
      </section>

      {/* Modals */}
      <ClientManagerModal 
        isOpen={isClientModalOpen} 
        onClose={() => setIsClientModalOpen(false)}
        companyId={company?.id}
        onUpdate={fetchSettings}
      />
      <InviteModal 
        isOpen={isInviteModalOpen} 
        onClose={() => setIsInviteModalOpen(false)}
        companyId={company?.id}
      />
      <CategoryModal 
        isOpen={isCategoryModalOpen} 
        onClose={() => setIsCategoryModalOpen(false)}
        companyId={company?.id}
        onUpdate={fetchSettings}
      />

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
