import { createClient } from '@supabase/supabase-js';
import PublicInvoiceClient from './PublicInvoiceClient';
import { notFound } from 'next/navigation';

export const revalidate = 0;

export default async function PublicInvoicePage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  // VERY IMPORTANT: Use Service Role Key to bypass RLS for public invoice viewing authenticated only by the secure unguessable UUID.
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

  if (!supabaseUrl || !serviceRoleKey) {
    return <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center text-white">Server configuration error. Missing service role credentials for secure public access.</div>;
  }

  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });

  const { data: invoice, error } = await supabaseAdmin
    .from('invoices')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error || !invoice) {
    return notFound();
  }

  const { data: items } = await supabaseAdmin
    .from('invoice_items')
    .select('*')
    .eq('invoice_id', invoice.id);

  const { data: company } = await supabaseAdmin
    .from('companies')
    .select('*')
    .eq('id', invoice.company_id)
    .maybeSingle();

  if (!company) return notFound();

  return <PublicInvoiceClient invoice={invoice} items={items || []} company={company} />;
}
