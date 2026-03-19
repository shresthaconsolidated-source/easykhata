'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Building2, MapPin, Hash, Coins, ArrowRight } from 'lucide-react';

const DEFAULT_CATEGORIES = [
  { name: 'Sales', type: 'income' },
  { name: 'Interest', type: 'income' },
  { name: 'Other Income', type: 'income' },
  { name: 'Rent', type: 'expense' },
  { name: 'Salaries', type: 'expense' },
  { name: 'Supplies', type: 'expense' },
  { name: 'Marketing', type: 'expense' },
  { name: 'Utilities', type: 'expense' },
  { name: 'Travel', type: 'expense' },
  { name: 'Meals', type: 'expense' },
];

export default function OnboardingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    pan: '',
    currency: 'NPR',
  });

  React.useEffect(() => {
    if (user) {
      checkExistingCompany();
    }
  }, [user]);

  const checkExistingCompany = async () => {
    const { data } = await supabase
      .from('company_members')
      .select('company_id')
      .eq('user_id', user?.id)
      .maybeSingle();
    
    if (data) {
      router.push('/chat');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    try {
      // 1. Create Company
      const { data: company, error: companyError } = await supabase
        .from('companies')
        .insert({
          name: formData.name,
          address: formData.address,
          pan: formData.pan,
          currency: formData.currency,
          created_by: user.id,
        })
        .select()
        .single();

      if (companyError) throw companyError;

      // 2. Add Member as Owner
      const { error: memberError } = await supabase
        .from('company_members')
        .insert({
          company_id: company.id,
          user_id: user.id,
          role: 'owner',
        });

      if (memberError) throw memberError;

      // 3. Seed Categories
      const categoriesToInsert = DEFAULT_CATEGORIES.map(cat => ({
        ...cat,
        company_id: company.id,
      }));

      const { error: catError } = await supabase
        .from('categories')
        .insert(categoriesToInsert);

      if (catError) throw catError;

      // 4. Redirect to Chat
      router.push('/chat');
    } catch (err: any) {
      console.error('Onboarding Error:', err);
      alert(`Something went wrong: ${err.message || 'Unknown error'}. Please check the console for details.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black">
      <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="text-center space-y-4">
          <div className="inline-flex p-4 rounded-3xl bg-blue-500/10 text-blue-500 ring-1 ring-blue-500/20 shadow-[0_0_50px_-12px_rgba(59,130,246,0.3)]">
            <Building2 className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter">Setup easyKhata</h1>
          <p className="text-white/40 font-medium">Let's get your business started in seconds.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#1c1c1e] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-white/30 uppercase tracking-widest ml-1">Company Name</label>
            <div className="relative">
              <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <input 
                required
                type="text" 
                placeholder="My Awesome Shop"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-11 pr-4 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all font-medium"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-white/30 uppercase tracking-widest ml-1">Business Address</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <input 
                required
                type="text" 
                placeholder="City, Nepal"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-11 pr-4 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all font-medium"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/30 uppercase tracking-widest ml-1">PAN Number</label>
              <div className="relative">
                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input 
                  type="text" 
                  placeholder="Optional"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-11 pr-4 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all font-medium"
                  value={formData.pan}
                  onChange={(e) => setFormData({...formData, pan: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/30 uppercase tracking-widest ml-1">Currency</label>
              <div className="relative">
                <Coins className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <select 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-11 pr-4 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all font-medium appearance-none"
                  value={formData.currency}
                  onChange={(e) => setFormData({...formData, currency: e.target.value})}
                >
                   <option value="NPR">NPR</option>
                   <option value="USD">USD</option>
                   <option value="INR">INR</option>
                </select>
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:opacity-50 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-blue-600/20 active:scale-95 flex items-center justify-center gap-2 group"
          >
            {loading ? 'Creating business...' : 'Start easyKhata'}
            {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>
      </div>
    </div>
  );
}
