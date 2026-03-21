'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthContext';

interface CompanyContextType {
  company: any;
  loading: boolean;
  refreshCompany: () => Promise<void>;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export function CompanyProvider({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchCompany = async () => {
    if (!user) return;
    
    setLoading(true);
    // Fetch all memberships sorted by latest joined
    const { data: memberships, error } = await supabase
      .from('company_members')
      .select('*, companies(*)')
      .eq('user_id', user.id)
      .order('joined_at', { ascending: false });

    if (memberships && memberships.length > 0) {
      // Pick the most recently joined company by default
      const latest = memberships[0];
      setCompany({ ...latest.companies, user_role: latest.role });
    } else {
      setCompany(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (authLoading) return; // Wait for auth to resolve completely

    if (user) {
      fetchCompany();
    } else {
      setCompany(null);
      setLoading(false);
    }
  }, [user, authLoading]);

  return (
    <CompanyContext.Provider value={{ company, loading, refreshCompany: fetchCompany }}>
      {children}
    </CompanyContext.Provider>
  );
}

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (context === undefined) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }
  return context;
};
