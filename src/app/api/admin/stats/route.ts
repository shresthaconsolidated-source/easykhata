import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const ADMIN_EMAIL = 'shresthaconsolidated@gmail.com';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function GET(req: NextRequest) {
  // 1. Verify the caller is the admin
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

  if (authError || !user || user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // 2. Get all companies + their owner user_id
  const { data: members } = await supabaseAdmin
    .from('company_members')
    .select('company_id, user_id, role')
    .eq('role', 'owner');

  if (!members?.length) {
    return NextResponse.json({ companies: [] });
  }

  const today = new Date().toISOString().split('T')[0];

  const results = await Promise.all(members.map(async (member) => {
    // Get company info
    const { data: company } = await supabaseAdmin
      .from('companies')
      .select('id, name, created_at, currency')
      .eq('id', member.company_id)
      .single();

    // Get owner email
    const { data: userData } = await supabaseAdmin.auth.admin.getUserById(member.user_id);
    const email = userData?.user?.email || 'Unknown';

    // Get transaction stats
    const { data: allTx } = await supabaseAdmin
      .from('transactions')
      .select('id, date, created_at')
      .eq('company_id', member.company_id)
      .order('created_at', { ascending: false });

    const totalEntries = allTx?.length || 0;
    const entriesToday = allTx?.filter(t => t.date === today).length || 0;
    const lastActive = allTx?.[0]?.created_at || company?.created_at;

    return {
      companyId: company?.id,
      companyName: company?.name || 'Unnamed',
      ownerEmail: email,
      currency: company?.currency || 'NPR',
      firstActive: company?.created_at,
      lastActive,
      entriesToday,
      totalEntries,
    };
  }));

  // Overall platform stats
  const totalUsers = results.length;
  const totalTxToday = results.reduce((s, r) => s + r.entriesToday, 0);
  const totalTxAll = results.reduce((s, r) => s + r.totalEntries, 0);

  return NextResponse.json({
    totalUsers,
    totalTxToday,
    totalTxAll,
    companies: results.sort((a, b) => b.totalEntries - a.totalEntries),
  });
}
