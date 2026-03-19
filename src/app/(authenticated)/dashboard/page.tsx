'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { formatCurrency, cn } from '@/lib/utils';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight,
  PieChart as PieChartIcon,
  Calendar as CalendarIcon
} from 'lucide-react';
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
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [stats, setStats] = useState({
    todayIncome: 0,
    todayExpense: 0,
    monthIncome: 0,
    monthExpense: 0,
    netProfit: 0,
    prevMonthIncome: 0,
    prevMonthExpense: 0,
    prevMonthProfit: 0
  });
  const [chartData, setChartData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState<any>(null);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user, selectedDate]);

  const fetchDashboardData = async () => {
    const { data: membership } = await supabase
      .from('company_members')
      .select('company_id, companies(*)')
      .eq('user_id', user?.id)
      .single();

    if (!membership) return;
    setCompany(membership.companies);

    const companyId = membership.company_id;
    const today = format(new Date(), 'yyyy-MM-dd');
    const monthStart = format(startOfMonth(selectedDate), 'yyyy-MM-dd');
    const monthEnd = format(endOfMonth(selectedDate), 'yyyy-MM-dd');
    const prevMonthStart = format(startOfMonth(subMonths(selectedDate, 1)), 'yyyy-MM-dd');
    const prevMonthEnd = format(endOfMonth(subMonths(selectedDate, 1)), 'yyyy-MM-dd');

    // 1. Fetch Today's Stats
    const { data: todayTransactions } = await supabase
      .from('transactions')
      .select('amount, type')
      .eq('company_id', companyId)
      .eq('date', today);

    // 2. Fetch Monthly Stats (Current)
    const { data: monthTransactions } = await supabase
      .from('transactions')
      .select('amount, type, category_id, categories(name)')
      .eq('company_id', companyId)
      .gte('date', monthStart)
      .lte('date', monthEnd);

    // 3. Fetch Previous Monthly Stats (for comparison)
    const { data: prevMonthTransactions } = await supabase
      .from('transactions')
      .select('amount, type')
      .eq('company_id', companyId)
      .gte('date', prevMonthStart)
      .lte('date', prevMonthEnd);

    // 4. Process Current Stats
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

    // 5. Process Previous Stats
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
      prevMonthIncome: pmInc,
      prevMonthExpense: pmExp,
      prevMonthProfit: pmInc - pmExp
    });

    // 6. Category Chart Data
    const catData = Array.from(categoryMap.entries()).map(([name, value]) => ({ name, value }));
    setCategoryData(catData);

    // 7. Trend Chart (last 6 months relative to selected)
    const trendMonths = Array.from({ length: 6 }).map((_, i) => subMonths(selectedDate, 5 - i));
    const trendData = await Promise.all(trendMonths.map(async (m) => {
      const start = format(startOfMonth(m), 'yyyy-MM-dd');
      const end = format(endOfMonth(m), 'yyyy-MM-dd');
      
      const { data } = await supabase
        .from('transactions')
        .select('amount, type')
        .eq('company_id', companyId)
        .gte('date', start)
        .lte('date', end);
      
      let inc = 0, exp = 0;
      data?.forEach(t => {
        if (t.type === 'income') inc += Number(t.amount);
        else exp += Number(t.amount);
      });
      
      return {
        name: format(m, 'MMM'),
        income: inc,
        expense: exp
      };
    }));

    setChartData(trendData);
    setLoading(false);
  };

  const calculateTrend = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  const StatCard = ({ title, amount, previousAmount, icon: Icon, color }: any) => {
    const trend = calculateTrend(amount, previousAmount);
    // Map colors to subtle monochromatic accents
    const accentClass = color.includes('green') ? 'text-emerald-500' : color.includes('red') ? 'text-rose-500' : 'text-blue-500';
    const bgGradient = color.includes('green') ? 'from-emerald-500/5' : color.includes('red') ? 'from-rose-500/5' : 'from-blue-500/5';

    return (
      <div className="bg-[#0b0b0b] p-8 rounded-[2rem] border border-white/[0.03] shadow-2xl relative overflow-hidden group hover:border-white/10 transition-all duration-500">
        <div className={cn("absolute -top-24 -right-24 w-48 h-48 opacity-[0.03] blur-3xl rounded-full bg-gradient-to-br to-transparent", bgGradient)} />
        
        <div className="flex flex-col relative z-10 h-full justify-between">
          <div>
            <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.2em] mb-4">{title}</p>
            <h3 className="text-4xl font-bold tracking-tighter text-white/90">
              <span className="text-white/20 font-medium mr-1">{company?.currency}</span>
              {amount.toLocaleString()}
            </h3>
          </div>

          <div className="mt-8 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[10px] font-bold tracking-tight">
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
            <div className={cn("p-2.5 rounded-xl border border-white/5 bg-white/[0.02]", accentClass)}>
              <Icon className="w-4 h-4 opacity-40" />
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) return null;

  // Use a softer, more professional color palette
  const COLORS = ['#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899'];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight uppercase">Financial Overview</h1>
          <p className="text-white/30 font-medium mt-1">Real-time performance metrics for your business.</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="relative group">
              <input 
                type="month" 
                value={format(selectedDate, 'yyyy-MM')}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                className="bg-[#1c1c1e] px-5 py-3 rounded-2xl border border-white/10 text-xs font-black uppercase tracking-[0.2em] text-white/60 outline-none hover:border-white/20 transition-all cursor-pointer appearance-none"
              />
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none opacity-20">
                <CalendarIcon className="w-4 h-4" />
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <StatCard 
          title="Income Generated" 
          amount={stats.monthIncome} 
          previousAmount={stats.prevMonthIncome}
          icon={TrendingUp} 
          color="bg-emerald-500 text-emerald-500" 
        />
        <StatCard 
          title="Expenses Logged" 
          amount={stats.monthExpense} 
          previousAmount={stats.prevMonthExpense}
          icon={TrendingDown} 
          color="bg-rose-500 text-rose-500" 
        />
        <StatCard 
          title="Net Monthly Profit" 
          amount={stats.netProfit} 
          previousAmount={stats.prevMonthProfit}
          icon={Wallet} 
          color="bg-blue-500 text-blue-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Trend Chart */}
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

        {/* Categories Pie */}
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
