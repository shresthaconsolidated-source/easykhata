'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCompany } from '@/contexts/CompanyContext';
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
  ArrowRight,
  Database,
  Terminal,
  AlertTriangle,
  RefreshCcw,
  Play
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ClientManagerModal } from '@/components/settings/ClientManagerModal';
import { InviteModal } from '@/components/settings/InviteModal';
import { CategoryModal } from '@/components/settings/CategoryModal';
import { DeleteCompanyModal } from '@/components/settings/DeleteCompanyModal';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const { user, signOut } = useAuth();
  const { company, refreshCompany } = useCompany();
  const router = useRouter();
  const [members, setMembers] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // SQL Editor State
  const [sqlQuery, setSqlQuery] = useState('');
  const [sqlResult, setSqlResult] = useState<any>(null);
  const [sqlError, setSqlError] = useState<string | null>(null);
  const [sqlExecuting, setSqlExecuting] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    if (user && company) {
      fetchSettings();
    }
  }, [user, company]);

  const fetchSettings = async () => {
    const companyId = company.id;

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
    if (!error) {
      fetchSettings();
      refreshCompany();
    } else {
      alert(`Error deleting category: ${error.message}`);
    }
  };

  const handleResetData = async () => {
    if (!company) return;
    
    try {
      // Deleting the company triggers cascade delete for everything else
      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', company.id);

      if (error) throw error;
      
      // Redirect to home page
      router.push('/');
    } catch (err: any) {
      alert(`Error resetting data: ${err.message}`);
    }
  };

  const executeSql = async () => {
    if (!sqlQuery.trim()) return;
    setSqlExecuting(true);
    setSqlError(null);
    setSqlResult(null);
    
    try {
      // NOTE: Supabase client doesn't support raw SQL easily without RPC.
      // We will use a generic 'rpc' call if one exists, or just warn the user.
      // For this prototype, we'll simulate the execution or use specific table logic.
      
      const { data, error } = await supabase.rpc('execute_sql_query', { query_text: sqlQuery });
      
      if (error) {
        // Fallback for demo: show error that RPC is missing
        setSqlError("SQL RPC function not found in database. Please add the 'execute_sql_query' function first.");
      } else {
        setSqlResult(data);
      }
    } catch (err: any) {
      setSqlError(err.message);
    } finally {
      setSqlExecuting(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center p-20">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-white/40 mt-1">Manage your company profile and team access.</p>
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

      {/* SQL Editor (Advanced) */}
      <section className="space-y-6 pt-12 border-t border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Database className="w-5 h-5 text-amber-400" />
            <h2 className="font-bold text-lg">Advanced SQL Console</h2>
          </div>
          <button 
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white transition-colors"
          >
            {showAdvanced ? 'Hide' : 'Show'} Console
          </button>
        </div>
        
        {showAdvanced && (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-4">
            <div className="bg-black/50 p-6 rounded-[2rem] border border-white/5 shadow-inner">
               <div className="flex items-center gap-2 text-white/30 mb-3 px-1">
                 <Terminal className="w-3.5 h-3.5" />
                 <span className="text-[10px] uppercase font-black tracking-widest">Query Console</span>
               </div>
               <textarea 
                  value={sqlQuery}
                  onChange={(e) => setSqlQuery(e.target.value)}
                  placeholder="SELECT * FROM transactions WHERE company_id = ..."
                  className="w-full h-40 bg-black/40 text-emerald-500 font-mono text-sm p-4 rounded-xl border border-white/5 focus:border-emerald-500/30 focus:ring-1 focus:ring-emerald-500/20 outline-none transition-all resize-none"
               />
               <div className="flex justify-between items-center mt-4">
                 <p className="text-[9px] text-white/20 uppercase font-bold tracking-widest px-1">
                   CAUTION: Raw queries can bypass RLS if using service role.
                 </p>
                 <button 
                   onClick={executeSql}
                   disabled={sqlExecuting || !sqlQuery.trim()}
                   className="flex items-center gap-2 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-800 disabled:opacity-50 text-black font-black rounded-xl transition-all active:scale-95"
                 >
                   {sqlExecuting ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                   Execute
                 </button>
               </div>
            </div>

            {sqlError && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm font-medium flex gap-3 italic">
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                {sqlError}
              </div>
            )}

            {sqlResult && (
              <div className="bg-[#1c1c1e] rounded-2xl border border-white/5 overflow-x-auto shadow-2xl">
                 <pre className="p-6 text-xs text-blue-300 font-mono">
                   {JSON.stringify(sqlResult, null, 2)}
                 </pre>
              </div>
            )}
          </div>
        )}
      </section>

      {/* DANGER ZONE */}
      <section className="pt-12 border-t border-red-500/10">
        <div className="flex items-center gap-3 mb-6">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          <h2 className="font-bold text-lg text-red-500">Danger Zone</h2>
        </div>
        
        <div className="bg-red-500/[0.02] border border-red-500/10 p-10 rounded-[3rem] flex flex-col md:flex-row items-center justify-between gap-8">
           <div className="max-w-md">
              <h3 className="font-black text-xl text-white mb-2 italic uppercase tracking-tight">Reset Business Data</h3>
              <p className="text-white/40 text-sm leading-relaxed">
                Permanently delete all transactions, invoices, customers, and business settings. Your account stays active, but you'll start fresh.
              </p>
           </div>
           <button 
              onClick={() => setIsDeleteModalOpen(true)}
              className="px-10 py-4 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white font-black rounded-2xl border border-red-500/20 transition-all active:scale-95 whitespace-nowrap"
           >
              Reset All Data
           </button>
        </div>
      </section>

      {/* Account Section */}
      <section className="pt-12 border-t border-white/5 flex items-center justify-between">
         <div className="flex items-center gap-4 text-white/40 font-medium">
           <div className="w-14 h-14 rounded-full border-2 border-white/10 overflow-hidden ring-4 ring-white/5">
             <img src={user?.user_metadata?.avatar_url || ''} alt="" className="w-full h-full object-cover" />
           </div>
           <div>
             <p className="font-black text-lg text-white tracking-tight">{user?.user_metadata?.full_name}</p>
             <p className="text-[10px] uppercase tracking-[0.2em]">Live Node Connection</p>
           </div>
         </div>
         <button 
           onClick={handleSignOut}
           className="px-10 py-4 bg-white/5 hover:bg-white/10 text-white font-black rounded-2xl border border-white/10 transition-all active:scale-95"
         >
           Sign Out
         </button>
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
      <DeleteCompanyModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleResetData}
        companyName={company?.name || 'Your Company'}
      />
    </div>
  );
}
