'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCompany } from '@/contexts/CompanyContext';
import { supabase } from '@/lib/supabase';
import { formatCurrency, cn } from '@/lib/utils';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight,
  PieChart as PieChartIcon,
  Calendar as CalendarIcon,
  Zap,
  AlertCircle,
  BarChart3
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { startOfMonth, endOfMonth, format, subMonths } from 'date-fns';

export default function DashboardPage() {
  const { user } = useAuth();
  const { company } = useCompany();
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [stats, setStats] = useState({
    todayIncome: 0,
    todayExpense: 0,
    monthIncome: 0,
    monthExpense: 0,
    netProfit: 0,
    totalBalance: 0,
    prevMonthIncome: 0,
    prevMonthExpense: 0,
    prevMonthProfit: 0
  });
  const [chartData, setChartData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && company) {
      fetchDashboardData();
    }
  }, [user, company, selectedDate]);

  const fetchDashboardData = async () => {
    setLoading(true);
    const companyId = company.id;
    const today = format(new Date(), 'yyyy-MM-dd');
    const monthStart = format(startOfMonth(selectedDate), 'yyyy-MM-dd');
    const monthEnd = format(endOfMonth(selectedDate), 'yyyy-MM-dd');
    const prevMonthStart = format(startOfMonth(subMonths(selectedDate, 1)), 'yyyy-MM-dd');
    const prevMonthEnd = format(endOfMonth(subMonths(selectedDate, 1)), 'yyyy-MM-dd');
    const sixMonthsAgo = format(startOfMonth(subMonths(selectedDate, 5)), 'yyyy-MM-dd');

    // Parallelize all primary data fetches for speed
    const [
      { data: todayTransactions },
      { data: monthTransactions },
      { data: prevMonthTransactions },
      { data: allTimeStats },
      { data: sixMonthData }
    ] = await Promise.all([
      supabase.from('transactions').select('amount, type').eq('company_id', companyId).eq('date', today),
      supabase.from('transactions').select('amount, type, category_id, categories(name)').eq('company_id', companyId).gte('date', monthStart).lte('date', monthEnd),
      supabase.from('transactions').select('amount, type').eq('company_id', companyId).gte('date', prevMonthStart).lte('date', prevMonthEnd),
      supabase.from('transactions').select('amount, type, payment_status').eq('company_id', companyId),
      supabase.from('transactions').select('amount, type, date').eq('company_id', companyId).gte('date', sixMonthsAgo).lte('date', monthEnd)
    ]);

    // 1. Process Current & Today's Stats
    let tInc = 0, tExp = 0, mInc = 0, mExp = 0;
    todayTransactions?.forEach(t => {
       if (t.type === 'income') tInc += Number(t.amount);
       else tExp += Number(t.amount);
    });

    const categoryMap = new Map();
    monthTransactions?.forEach(t => {
      const amt = Number(t.amount);
      if (t.type === 'income') mInc += amt;
      else {
        mExp += amt;
        const catName = (Array.isArray(t.categories) ? t.categories[0]?.name : (t.categories as any)?.name) || 'Misc';
        categoryMap.set(catName, (categoryMap.get(catName) || 0) + amt);
      }
    });

    // 2. Process All-Time Balance (Cash Only)
    let totalCashIn = 0, totalCashOut = 0;
    allTimeStats?.forEach(t => {
      // Only count if it's strictly 'paid' (or old rows without the column)
      if (t.payment_status === 'paid' || !t.payment_status) {
        if (t.type === 'income') totalCashIn += Number(t.amount);
        else totalCashOut += Number(t.amount);
      }
    });

    // 3. Process Previous Month Stats
    let pmInc = 0, pmExp = 0;
    prevMonthTransactions?.forEach(t => {
      if (t.type === 'income') pmInc += Number(t.amount);
      else pmExp += Number(t.amount);
    });

    setStats({
      todayIncome: tInc,
      todayExpense: tExp,
      monthIncome: mInc,
      monthExpense: mExp,
      netProfit: mInc - mExp,
      totalBalance: totalCashIn - totalCashOut,
      prevMonthIncome: pmInc,
      prevMonthExpense: pmExp,
      prevMonthProfit: pmInc - pmExp
    });

    // 4. Category Chart Data
    const catData = Array.from(categoryMap.entries()).map(([name, value]) => ({ name, value }));
    setCategoryData(catData);

    // 5. Process Trend Data locally from the single batched query
    const trendMonths = Array.from({ length: 6 }).map((_, i) => subMonths(selectedDate, 5 - i));
    const trendData = trendMonths.map(m => {
      const mStart = startOfMonth(m);
      const mEnd = endOfMonth(m);
      
      let inc = 0, exp = 0;
      sixMonthData?.forEach(t => {
        const tDate = new Date(t.date);
        if (tDate >= mStart && tDate <= mEnd) {
          if (t.type === 'income') inc += Number(t.amount);
          else exp += Number(t.amount);
        }
      });
      
      return {
        name: format(m, 'MMM'),
        income: inc,
        expense: exp
      };
    });

    setChartData(trendData);
    setLoading(false);
  };

  const calculateTrend = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  const StatCard = ({ title, amount, previousAmount, icon: Icon, color }: any) => {
    const trend = calculateTrend(amount, previousAmount);
    const accentClass = color.includes('green') ? 'text-emerald-500' : color.includes('red') ? 'text-rose-500' : 'text-blue-500';
    const bgGradient = color.includes('green') ? 'from-emerald-500/5' : color.includes('red') ? 'from-rose-500/5' : 'from-blue-500/5';

    const amountStr = amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const isVeryLarge = amountStr.length > 12;
    const isLarge = amountStr.length > 9;
    const fontSizeClass = isVeryLarge ? 'text-2xl' : isLarge ? 'text-3xl' : 'text-4xl';

    return (
      <div className="bg-[#0b0b0b] p-6 lg:p-8 rounded-[2rem] border border-white/[0.03] shadow-2xl relative overflow-hidden group hover:border-white/10 transition-all duration-500">
        <div className={cn("absolute -top-24 -right-24 w-48 h-48 opacity-[0.03] blur-3xl rounded-full bg-gradient-to-br to-transparent", bgGradient)} />
        <div className="flex flex-col relative z-10 h-full justify-between">
          <div>
            <p className="text-white/20 text-[9px] lg:text-[10px] font-black uppercase tracking-[0.2em] mb-4">{title}</p>
            {isVeryLarge ? (
              <div className="flex flex-col gap-0.5">
                <span className="text-white/20 text-[10px] font-black uppercase tracking-widest leading-none mb-1">{company?.currency}</span>
                <h3 className={cn(fontSizeClass, "font-bold tracking-tighter text-white/90 leading-none")}>
                  {amountStr}
                </h3>
              </div>
            ) : (
              <h3 className={cn(fontSizeClass, "font-bold tracking-tighter text-white/90")}>
                <span className="text-white/20 font-medium mr-1 text-[0.6em]">{company?.currency}</span>
                {amountStr}
              </h3>
            )}
          </div>
          <div className="mt-8 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[9px] lg:text-[10px] font-bold tracking-tight">
               {trend >= 0 ? (
                 <span className="text-emerald-500 flex items-center gap-0.5 bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20">
                   <ArrowUpRight className="w-3 h-3" /> +{trend}%
                 </span>
               ) : (
                 <span className="text-rose-500 flex items-center gap-0.5 bg-rose-500/10 px-2 py-1 rounded-lg border border-rose-500/20">
                   <ArrowDownRight className="w-3 h-3" /> {trend}%
                 </span>
               )}
               <span className="text-white/10 uppercase tracking-widest text-[8px] ml-1">vs last month</span>
            </div>
            <div className={cn("p-2 lg:p-2.5 rounded-xl border border-white/5 bg-white/[0.02]", accentClass)}>
               <Icon className="w-4 h-4 opacity-40" />
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="flex flex-col items-center gap-4 text-center px-6">
        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
        <p className="text-white/20 text-[10px] font-black uppercase tracking-widest">Loading Analytics...</p>
      </div>
    </div>
  );

  const COLORS = ['#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899'];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black tracking-tight uppercase">Financial Overview</h1>
          <p className="text-white/30 text-sm font-medium mt-1">Real-time performance metrics.</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="relative group w-full sm:w-auto">
              <input 
                type="month" 
                value={format(selectedDate, 'yyyy-MM')}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                className="w-full sm:w-auto bg-[#1c1c1e] px-5 py-3 rounded-2xl border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-white/60 outline-none hover:border-white/20 transition-all cursor-pointer appearance-none"
              />
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none opacity-20">
                <CalendarIcon className="w-4 h-4" />
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Current Cash Balance" 
          amount={stats.totalBalance} 
          previousAmount={stats.totalBalance} 
          icon={Wallet} 
          color="bg-blue-500 text-blue-500" 
        />
        <StatCard 
          title="Monthly Profit" 
          amount={stats.netProfit} 
          previousAmount={stats.prevMonthProfit}
          icon={TrendingUp} 
          color="bg-emerald-500 text-emerald-500" 
        />
        <StatCard 
          title="Money In (Month)" 
          amount={stats.monthIncome} 
          previousAmount={stats.prevMonthIncome}
          icon={ArrowUpRight} 
          color="bg-emerald-500 text-emerald-500" 
        />
        <StatCard 
          title="Money Out (Month)" 
          amount={stats.monthExpense} 
          previousAmount={stats.prevMonthExpense}
          icon={ArrowDownRight} 
          color="bg-rose-500 text-rose-500" 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="md:col-span-1 bg-[#0b0b0b] p-8 rounded-[2rem] border border-white/[0.03] shadow-2xl space-y-6">
            <h3 className="font-bold text-sm tracking-tight text-white/60 flex items-center gap-2">
               <Zap className="w-4 h-4 text-yellow-400" />
               Key Insights
            </h3>
            <div className="space-y-4">
               {stats.netProfit < 0 && (
                 <div className="flex gap-3 text-xs">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <p className="text-white/40 leading-relaxed font-medium">Warning: expenses are higher than income this month.</p>
                 </div>
               )}
               {calculateTrend(stats.monthExpense, stats.prevMonthExpense) > 10 && (
                 <div className="flex gap-3 text-xs">
                    <TrendingUp className="w-4 h-4 text-red-400 shrink-0" />
                    <p className="text-white/40 leading-relaxed font-medium">Spending increased by {calculateTrend(stats.monthExpense, stats.prevMonthExpense)}% vs last month.</p>
                 </div>
               )}
               {stats.netProfit > 0 && stats.monthIncome > stats.prevMonthIncome && (
                 <div className="flex gap-3 text-xs">
                    <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0" />
                    <p className="text-white/40 leading-relaxed font-medium">Profit is increasing steadily this month.</p>
                 </div>
               )}
               <button 
                 onClick={() => router.push('/insights')}
                 className="text-[10px] font-black uppercase tracking-widest text-blue-500 hover:text-blue-400 transition-colors pt-2"
               >
                 View All Insights →
               </button>
            </div>
         </div>

         <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#0b0b0b] p-8 rounded-[2rem] border border-white/[0.03] shadow-2xl flex flex-col justify-between">
               <div className="flex justify-between items-start">
                  <h3 className="font-bold text-sm text-white/60">Spending Trend</h3>
                  <BarChart3 className="w-4 h-4 text-white/10" />
               </div>
               <div className="h-24 w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData.slice(-4)}>
                      <Bar dataKey="expense" fill="#3b82f6" fillOpacity={0.2} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
               </div>
               <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mt-4">Last 4 Months</p>
            </div>
            
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-[2rem] text-white shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-[40px] -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700" />
               <h4 className="font-bold mb-1 relative z-10 text-lg tracking-tight">Financial Health</h4>
               <p className="text-white/60 text-xs font-medium mb-6 relative z-10 leading-relaxed">
                 Your business is currently {stats.netProfit > 0 ? 'profitable' : 'balancing cash'}.
               </p>
               <button 
                 onClick={() => router.push('/insights')}
                 className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all relative z-10"
               >
                 Detailed Analysis
               </button>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 bg-[#0b0b0b] p-10 rounded-[3rem] border border-white/[0.03] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
          <div className="flex items-center justify-between mb-10">
             <div>
               <h3 className="font-bold text-lg tracking-tight">Income vs Expense</h3>
               <p className="text-[10px] text-white/20 uppercase tracking-[0.2em] mt-1 font-bold">6 Month Trend Analysis</p>
             </div>
             <div className="flex gap-6 text-[10px] font-black uppercase tracking-widest">
               <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> <span className="text-white/40">Income</span></div>
               <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-white/10" /> <span className="text-white/40">Expense</span></div>
             </div>
          </div>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff" strokeOpacity={0.02} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#ffffff', fontSize: 10, fontWeight: 700, opacity: 0.2 }}
                  dy={15}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#ffffff', fontSize: 10, fontWeight: 700, opacity: 0.2 }}
                />
                <Tooltip 
                  cursor={{ fill: 'white', opacity: 0.02 }}
                  contentStyle={{ backgroundColor: '#0b0b0b', border: '1px solid #ffffff05', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}
                />
                <Bar dataKey="income" fill="#3b82f6" fillOpacity={0.8} radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="expense" fill="#ffffff" fillOpacity={0.05} radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#0b0b0b] p-10 rounded-[3rem] border border-white/[0.03] shadow-2xl flex flex-col relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
          <h3 className="font-bold text-lg tracking-tight mb-10">Categories</h3>
          <div className="flex-1 h-[250px] min-h-[250px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={85}
                    paddingAngle={10}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} fillOpacity={0.7} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0b0b0b', border: '1px solid #ffffff05', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}
                  />
                </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
               <span className="text-[10px] font-black text-white/10 uppercase tracking-[0.2em]">Total</span>
               <span className="text-xl font-bold text-white/40 tracking-tighter mt-1">{company?.currency}{stats.monthExpense.toLocaleString()}</span>
            </div>
          </div>
          <div className="space-y-4 mt-8">
            {categoryData.slice(0, 4).map((cat, i) => (
              <div key={cat.name} className="flex items-center justify-between text-[11px] font-bold">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length], opacity: 0.5 }} />
                  <span className="text-white/30 uppercase tracking-widest">{cat.name}</span>
                </div>
                <span className="text-white/60">{company?.currency} {cat.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
