'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { Shell } from '@/components/layout/Shell';
import { supabase } from '@/lib/supabase';
import { CompanyProvider, useCompany } from '@/contexts/CompanyContext';

function AuthenticatedContent({ children, pathname }: { children: React.ReactNode, pathname: string }) {
  const { user, loading: authLoading } = useAuth();
  const { company, loading: companyLoading } = useCompany();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!authLoading && !companyLoading && !company && pathname !== '/onboarding') {
      router.push('/onboarding');
    }
  }, [company, companyLoading, authLoading, pathname, router]);

  if (authLoading || companyLoading) {
    return (
      <div className="h-screen w-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user && !authLoading) return null;

  if (pathname === '/onboarding' || pathname.startsWith('/invoices/')) {
    return <>{children}</>;
  }

  // If we are on onboarding but already have a company, redirect out
  if (pathname === '/onboarding' && company) {
    router.push('/dashboard');
    return null;
  }

  return <Shell>{children}</Shell>;
}

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <CompanyProvider>
      <AuthenticatedContent pathname={pathname}>
        {children}
      </AuthenticatedContent>
    </CompanyProvider>
  );
}
