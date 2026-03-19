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
    return (
      <div className="bg-[#1c1c1e] p-6 rounded-3xl border border-white/5 shadow-xl relative overflow-hidden group">
        <div className={cn("absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 opacity-10 blur-3xl rounded-full", color)} />
        <div className="flex items-start justify-between relative z-10">
          <div>
            <p className="text-white/30 text-[10px] font-bold uppercase tracking-wider mb-2">{title}</p>
            <h3 className="text-xl font-bold tracking-tight">{company?.currency} {amount.toLocaleString()}</h3>
          </div>
          <div className={cn("p-2.5 rounded-xl ring-1 ring-white/10", color.replace('bg-', 'bg-').replace('text-', 'text-').concat('/10'))}>
            <Icon className={cn("w-5 h-5", color.replace('bg-', 'text-'))} />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-1.5 text-[10px] font-bold tracking-wider">
           {trend >= 0 ? (
             <span className="text-green-400 flex items-center gap-0.5"><ArrowUpRight className="w-3.5 h-3.5" /> +{trend}%</span>
           ) : (
             <span className="text-red-400 flex items-center gap-0.5"><ArrowDownRight className="w-3.5 h-3.5" /> {trend}%</span>
           )}
           <span className="text-white/10 uppercase tracking-widest text-[9px]">vs last month</span>
        </div>
      </div>
    );
  };

  if (loading) return null;

  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f97316', '#10b981', '#6366f1'];

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Income Generated" 
          amount={stats.monthIncome} 
          previousAmount={stats.prevMonthIncome}
          icon={TrendingUp} 
          color="bg-green-500 text-green-500" 
        />
        <StatCard 
          title="Expenses Logged" 
          amount={stats.monthExpense} 
          previousAmount={stats.prevMonthExpense}
          icon={TrendingDown} 
          color="bg-red-500 text-red-500" 
        />
        <StatCard 
          title="Net Monthly Profit" 
          amount={stats.netProfit} 
          previousAmount={stats.prevMonthProfit}
          icon={Wallet} 
          color="bg-blue-500 text-blue-500" 
        />
        <StatCard 
          title="Total Cashflow" 
          amount={stats.monthIncome + stats.monthExpense} 
          previousAmount={stats.prevMonthIncome + stats.prevMonthExpense}
          icon={PieChartIcon} 
          color="bg-purple-500 text-purple-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Trend Chart */}
        <div className="lg:col-span-2 bg-[#1c1c1e] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
          <div className="flex items-center justify-between mb-8">
             <h3 className="font-bold text-lg">Income vs Expense</h3>
             <div className="flex gap-4 text-xs font-medium">
               <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Income</div>
               <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-white/10" /> Expense</div>
             </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#ffffff30', fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#ffffff30', fontSize: 12 }}
                />
                <Tooltip 
                  cursor={{ fill: '#ffffff05' }}
                  contentStyle={{ backgroundColor: '#1c1c1e', border: '1px solid #ffffff10', borderRadius: '16px' }}
                />
                <Bar dataKey="income" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={24} />
                <Bar dataKey="expense" fill="#ffffff10" radius={[6, 6, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Categories Pie */}
        <div className="bg-[#1c1c1e] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl flex flex-col">
          <h3 className="font-bold text-lg mb-8">Expenses by Category</h3>
          <div className="flex-1 h-[250px] min-h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1c1c1e', border: '1px solid #ffffff10', borderRadius: '16px' }}
                  />
                </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 mt-4">
            {categoryData.slice(0, 4).map((cat, i) => (
              <div key={cat.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-white/60">{cat.name}</span>
                </div>
                <span className="font-bold">{company?.currency} {cat.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
