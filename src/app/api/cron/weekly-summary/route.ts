import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// This route is called by Vercel Cron every Friday at 8:00 AM Nepal time (2:15 AM UTC)
// Schedule: "15 2 * * 5" in vercel.json

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // Server-side only, not exposed to client
);

const RESEND_API_KEY = process.env.RESEND_API_KEY;

async function sendEmail(to: string, subject: string, html: string) {
  if (!RESEND_API_KEY) {
    console.warn('[Weekly Summary] RESEND_API_KEY not set. Skipping email.');
    return;
  }
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'easyKhata <noreply@easykhata.shrestha.com.np>',
      to,
      subject,
      html,
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    console.error('[Weekly Summary] Email error:', err);
  }
}

function buildEmailHtml(company: any, income: number, expense: number, topCategory: string, currency: string) {
  const profit = income - expense;
  const profitColor = profit >= 0 ? '#10b981' : '#f43f5e';
  const profitLabel = profit >= 0 ? '🟢 Profitable week!' : '🔴 Expenses exceeded income.';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    body { background: #030303; color: #ffffff; font-family: 'Inter', -apple-system, sans-serif; margin: 0; padding: 0; }
    .container { max-width: 560px; margin: 0 auto; padding: 48px 24px; }
    .logo { font-size: 22px; font-weight: 900; letter-spacing: -0.05em; margin-bottom: 48px; }
    .logo span { color: #3b82f6; }
    h1 { font-size: 32px; font-weight: 800; letter-spacing: -0.04em; margin: 0 0 8px; }
    .sub { color: rgba(255,255,255,0.4); font-size: 14px; margin-bottom: 40px; }
    .card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 20px; padding: 28px; margin-bottom: 16px; }
    .label { font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.15em; color: rgba(255,255,255,0.3); margin-bottom: 8px; }
    .value { font-size: 28px; font-weight: 900; letter-spacing: -0.03em; }
    .income { color: #10b981; }
    .expense { color: #f43f5e; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
    .profit-card { border-color: ${profitColor}33; background: ${profitColor}08; }
    .footer { margin-top: 48px; font-size: 11px; color: rgba(255,255,255,0.15); text-align: center; }
    .cta { display: inline-block; margin-top: 32px; background: #ffffff; color: #000000; font-weight: 900; font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase; padding: 16px 32px; border-radius: 12px; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">easy<span>Khata</span></div>
    <h1>Your Weekly Summary 📊</h1>
    <p class="sub">${company.name} · Week ending ${new Date().toLocaleDateString('en-NP', { weekday: 'long', month: 'long', day: 'numeric' })}</p>

    <div class="grid">
      <div class="card">
        <div class="label">Income</div>
        <div class="value income">${currency} ${income.toLocaleString()}</div>
      </div>
      <div class="card">
        <div class="label">Expenses</div>
        <div class="value expense">${currency} ${expense.toLocaleString()}</div>
      </div>
    </div>

    <div class="card profit-card">
      <div class="label">Net Profit / Loss</div>
      <div class="value" style="color:${profitColor}">${profit >= 0 ? '+' : ''}${currency} ${profit.toLocaleString()}</div>
      <p style="margin: 8px 0 0; color: rgba(255,255,255,0.4); font-size: 13px;">${profitLabel}</p>
    </div>

    ${topCategory ? `<div class="card"><div class="label">Top Spending Category</div><div style="font-size: 18px; font-weight: 800; margin-top: 4px;">${topCategory}</div></div>` : ''}

    <a class="cta" href="${process.env.NEXT_PUBLIC_APP_URL || 'https://easykhata.shrestha.com.np'}/dashboard">
      Open Dashboard →
    </a>

    <div class="footer">
      You're receiving this because your easyKhata account is active.<br/>
      © 2026 Shrestha Consolidated
    </div>
  </div>
</body>
</html>
  `.trim();
}

export async function GET(request: Request) {
  // Verify Vercel cron secret
  const authHeader = request.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const weekAgoIso = oneWeekAgo.toISOString().split('T')[0];

    // Get all companies with their owner profile (email)
    const { data: members, error: membersError } = await supabaseAdmin
      .from('company_members')
      .select('company_id, user_id, role')
      .eq('role', 'owner');

    if (membersError || !members?.length) {
      return NextResponse.json({ message: 'No owners found', membersError });
    }

    let emailsSent = 0;

    for (const member of members) {
      // Get user email from auth.users via admin
      const { data: userData } = await supabaseAdmin.auth.admin.getUserById(member.user_id);
      const email = userData?.user?.email;
      if (!email) continue;

      // Get company
      const { data: company } = await supabaseAdmin
        .from('companies')
        .select('*')
        .eq('id', member.company_id)
        .single();
      if (!company) continue;

      // Get this week's transactions
      const { data: transactions } = await supabaseAdmin
        .from('transactions')
        .select('amount, type, category_id')
        .eq('company_id', member.company_id)
        .gte('date', weekAgoIso);

      if (!transactions?.length) continue; // Don't email if no activity

      const income = transactions.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0);
      const expense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0);

      // Find top spending category
      const catCount: Record<string, number> = {};
      for (const t of transactions.filter(t => t.type === 'expense' && t.category_id)) {
        catCount[t.category_id] = (catCount[t.category_id] || 0) + Number(t.amount);
      }
      const topCatId = Object.entries(catCount).sort((a, b) => b[1] - a[1])[0]?.[0];
      let topCatName = '';
      if (topCatId) {
        const { data: cat } = await supabaseAdmin.from('categories').select('name').eq('id', topCatId).single();
        topCatName = cat?.name || '';
      }

      const html = buildEmailHtml(company, income, expense, topCatName, company.currency || 'NPR');
      await sendEmail(email, `📊 Your weekly summary — ${company.name}`, html);
      emailsSent++;
    }

    return NextResponse.json({ ok: true, emailsSent });
  } catch (err: any) {
    console.error('[Weekly Summary] Cron error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
