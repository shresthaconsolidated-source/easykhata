'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { Shell } from '@/components/layout/Shell';
import { supabase } from '@/lib/supabase';

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [hasCompany, setHasCompany] = useState<boolean | null>(null);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/');
      } else {
        checkCompany();
      }
    }
  }, [user, loading, router]);

  const checkCompany = async () => {
    const { data, error } = await supabase
      .from('company_members')
      .select('company_id')
      .eq('user_id', user?.id)
      .maybeSingle();

    if (error || !data) {
      setHasCompany(false);
      if (pathname !== '/onboarding') {
        router.push('/onboarding');
      }
    } else {
      setHasCompany(true);
    }
  };

  if (loading || hasCompany === null) {
    return (
      <div className="h-screen w-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (pathname === '/onboarding') {
    return <>{children}</>;
  }

  return <Shell>{children}</Shell>;
}
