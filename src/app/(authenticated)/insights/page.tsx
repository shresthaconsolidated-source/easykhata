'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertCircle, 
  Zap, 
  ArrowUpRight, 
  ArrowDownRight,
  DollarSign,
  Activity,
  Calendar,
  Wallet,
  BarChart3,
  PieChart
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, subMonths, isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import { cn, formatCurrency } from '@/lib/utils';

interface Insight {
  id: string;
  type: 'success' | 'warning' | 'info' | 'danger';
  title: string;
  description: string;
  icon: any;
  trend?: string;
}

export default function InsightsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState<any>(null);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [stats, setStats] = useState({
    currentBalance: 0,
    monthlyIncome: 0,
    monthlyExpense: 0,
    monthlyProfit: 0,
    incomeTrend: 0,
    expenseTrend: 0,
    topCategories: [] as any[]
  });

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Company
      const { data: membership } = await supabase
        .from('company_members')
        .select('company_id, companies(*)')
        .eq('user_id', user?.id)
        .single();
      
      if (!membership) return;
      setCompany(membership.companies);
      const companyId = membership.company_id;

      // 2. Fetch Transactions (Current & Last Month)
      const now = new Date();
      const thisMonthStart = startOfMonth(now);
      const lastMonthStart = startOfMonth(subMonths(now, 1));
      const lastMonthEnd = endOfMonth(subMonths(now, 1));

      const { data: transactions } = await supabase
        .from('transactions')
        .select('*, categories(name)')
        .eq('company_id', companyId)
        .order('date', { ascending: false });

      if (!transactions) return;

      // 3. Process Data
      const thisMonth = transactions.filter(t => new Date(t.date) >= thisMonthStart);
      const lastMonth = transactions.filter(t => {
        const d = new Date(t.date);
        return d >= lastMonthStart && d <= lastMonthEnd;
      });

      const incomeThis = thisMonth.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0);
      const expenseThis = thisMonth.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0);
      
      const incomeLast = lastMonth.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0);
      const expenseLast = lastMonth.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0);

      const allIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0);
      const allExpense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0);

      // Category Breakdown
      const catMap: Record<string, number> = {};
      thisMonth.filter(t => t.type === 'expense').forEach(t => {
        const name = t.categories?.name || 'Other';
        catMap[name] = (catMap[name] || 0) + Number(t.amount);
      });
      const topCats = Object.entries(catMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, amount]) => ({ name, amount }));

      setStats({
        currentBalance: allIncome - allExpense,
        monthlyIncome: incomeThis,
        monthlyExpense: expenseThis,
        monthlyProfit: incomeThis - expenseThis,
        incomeTrend: incomeLast > 0 ? ((incomeThis - incomeLast) / incomeLast) * 100 : 0,
        expenseTrend: expenseLast > 0 ? ((expenseThis - expenseLast) / expenseLast) * 100 : 0,
        topCategories: topCats
      });

      // 4. Generate Rule-Based Insights
      const newInsights: Insight[] = [];

      // Spending Insight
      if (expenseLast > 0) {
        const diff = ((expenseThis - expenseLast) / expenseLast) * 100;
        if (diff > 10) {
          newInsights.push({
            id: '1',
            type: 'warning',
            title: 'Spending Surge',
            description: `Your expenses increased by ${Math.abs(diff).toFixed(0)}% compared to last month.`,
            icon: TrendingUp,
            trend: 'up'
          });
        }
      }

      // Top Category Insight
      if (topCats.length > 0) {
        const topPercent = (topCats[0].amount / expenseThis) * 100;
        newInsights.push({
          id: '2',
          type: 'info',
          title: 'Top Expense Category',
          description: `${topCats[0].name} accounts for ${topPercent.toFixed(0)}% of your monthly spending.`,
          icon: PieChart
        });
      }

      // Profit Insight
      const profit = incomeThis - expenseThis;
      const currency = (membership.companies as any).currency || 'NPR';
      if (profit > 0) {
        newInsights.push({
          id: '3',
          type: 'success',
          title: 'Healthy Profit',
          description: `Your net profit this month is ${formatCurrency(profit, currency)}. Pointing in the right direction!`,
          icon: Zap
        });
      } else if (profit < 0) {
        newInsights.push({
          id: '4',
          type: 'danger',
          title: 'Cash Warning',
          description: `Warning: expenses are higher than income this month by ${formatCurrency(Math.abs(profit), currency)}.`,
          icon: AlertCircle
        });
      }

      // Projections
      const dayOfMonth = now.getDate();
      const avgDailyBurn = expenseThis / dayOfMonth;
      const daysLeft = endOfMonth(now).getDate() - dayOfMonth;
      const projectedBurn = avgDailyBurn * daysLeft;
      
      if (projectedBurn > (allIncome - allExpense)) {
         newInsights.push({
           id: '5',
           type: 'warning',
           title: 'Early Exhaustion Risk',
           description: `At current rate, expenses may exceed current cash in ${( (allIncome - allExpense) / avgDailyBurn).toFixed(0)} days.`,
           icon: Activity
         });
      }

      setInsights(newInsights);
    } catch (error) {
      console.error('Error fetching insights:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="w-8 h-8 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent tracking-tighter">
          Insights
        </h1>
        <p className="text-white/30 text-sm font-medium uppercase tracking-[0.2em]">Simple, actionable business analysis</p>
      </div>

      {/* Cash Flow Summary */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
           <Wallet className="w-5 h-5 text-emerald-400" />
           <h3 className="font-bold text-lg">Cash Flow</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-[#0b0b0b] p-8 rounded-[2rem] border border-white/5 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[60px] -mr-16 -mt-16 group-hover:bg-emerald-500/10 transition-all duration-700" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-4">Current Balance</p>
              <h2 className="text-4xl font-black tracking-tight text-white mb-2">
                 {formatCurrency(stats.currentBalance, company?.currency)}
              </h2>
              <div className="flex items-center gap-2 text-white/30 text-xs font-bold uppercase tracking-widest">
                 <Activity className="w-3.5 h-3.5" />
                 Net Money In - Money Out
              </div>
           </div>

           <div className="bg-[#0b0b0b] p-8 rounded-[2rem] border border-white/5 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[60px] -mr-16 -mt-16 group-hover:bg-blue-500/10 transition-all duration-700" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-4">Monthly Profit</p>
              <h2 className={cn(
                "text-4xl font-black tracking-tight mb-2",
                stats.monthlyProfit >= 0 ? "text-emerald-400" : "text-red-400"
              )}>
                 {formatCurrency(stats.monthlyProfit, company?.currency)}
              </h2>
              <div className="flex items-center gap-2 text-white/30 text-xs font-bold uppercase tracking-widest">
                 {stats.monthlyProfit >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                 This month alone
              </div>
           </div>

           <div className="bg-[#0b0b0b] p-8 rounded-[2rem] border border-white/5 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 blur-[60px] -mr-16 -mt-16 group-hover:bg-purple-500/10 transition-all duration-700" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-4">Expense Trend</p>
              <h2 className={cn(
                "text-4xl font-black tracking-tight mb-2",
                stats.expenseTrend > 0 ? "text-red-400" : "text-emerald-400"
              )}>
                 {stats.expenseTrend > 0 ? '+' : ''}{stats.expenseTrend.toFixed(0)}%
              </h2>
              <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.2em]">Compared to last month</p>
           </div>
        </div>
      </section>

      {/* Key Insights List */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
           <Zap className="w-5 h-5 text-yellow-400" />
           <h3 className="font-bold text-lg">Key Insights</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           {insights.length === 0 ? (
             <div className="md:col-span-2 p-12 text-center bg-white/[0.02] border border-white/5 rounded-[2rem]">
                <p className="text-white/20 text-sm font-medium">Record more transactions to see deep insights.</p>
             </div>
           ) : (
             insights.map((insight) => (
               <div 
                 key={insight.id}
                 className={cn(
                    "p-6 rounded-3xl border border-white/5 flex gap-5 transition-all hover:bg-white/[0.02] active:scale-[0.99]",
                    insight.type === 'danger' ? "bg-red-500/5 border-red-500/10" : 
                    insight.type === 'warning' ? "bg-yellow-500/5 border-yellow-500/10" :
                    insight.type === 'success' ? "bg-emerald-500/5 border-emerald-500/10" : "bg-white/[0.02]"
                 )}
               >
                 <div className={cn(
                   "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0",
                   insight.type === 'danger' ? "bg-red-500/10 text-red-400" : 
                   insight.type === 'warning' ? "bg-yellow-500/10 text-yellow-400" :
                   insight.type === 'success' ? "bg-emerald-500/10 text-emerald-400" : "bg-blue-500/10 text-blue-400"
                 )}>
                   <insight.icon className="w-6 h-6" />
                 </div>
                 <div className="space-y-1">
                    <h4 className="font-bold text-white/90">{insight.title}</h4>
                    <p className="text-sm text-white/40 leading-relaxed">{insight.description}</p>
                 </div>
               </div>
             ))
           )}
        </div>
      </section>

      {/* Top Categories & Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
         <section className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 text-blue-400" />
              <h3 className="font-bold text-lg">Top Spend Categories</h3>
            </div>
            <div className="bg-[#0b0b0b] p-8 rounded-[2rem] border border-white/5 space-y-6">
               {stats.topCategories.map((cat, i) => (
                 <div key={i} className="space-y-2">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-widest leading-none">
                       <span className="text-white/40">{cat.name}</span>
                       <span className="text-white">{formatCurrency(cat.amount, company?.currency)}</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                       <div 
                         className="h-full bg-blue-600 rounded-full" 
                         style={{ width: `${(cat.amount / stats.monthlyExpense) * 100}%` }}
                       />
                    </div>
                 </div>
               ))}
               {stats.topCategories.length === 0 && (
                 <p className="text-white/20 text-xs text-center py-10 font-bold uppercase tracking-widest">No spending data this month</p>
               )}
            </div>
         </section>

         <section className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-purple-400" />
              <h3 className="font-bold text-lg">Quick Trends</h3>
            </div>
            <div className="grid grid-cols-1 gap-4">
               <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                  <span className="text-sm font-bold text-white/40">Money In vs Out</span>
                  <div className="flex gap-4">
                     <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span className="text-[10px] font-black uppercase text-emerald-400">{((stats.monthlyIncome / (stats.monthlyIncome + stats.monthlyExpense || 1)) * 100).toFixed(0)}% In</span>
                     </div>
                     <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-400" />
                        <span className="text-[10px] font-black uppercase text-red-400">{((stats.monthlyExpense / (stats.monthlyIncome + stats.monthlyExpense || 1)) * 100).toFixed(0)}% Out</span>
                     </div>
                  </div>
               </div>
               <div className="p-8 rounded-[2rem] bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 blur-[80px] -mr-24 -mt-24 group-hover:scale-125 transition-transform duration-700" />
                  <h4 className="text-lg font-black tracking-tight mb-2 relative z-10">Ready to expand?</h4>
                  <p className="text-white/70 text-sm font-medium mb-6 relative z-10 leading-relaxed">
                    Based on your current profit margin of {stats.monthlyIncome > 0 ? ((stats.monthlyProfit / stats.monthlyIncome) * 100).toFixed(0) : 0}%, you have a healthy cash position.
                  </p>
                  <button className="bg-white text-blue-600 px-6 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl active:scale-95 transition-all relative z-10">
                    Get Expert Advice
                  </button>
               </div>
            </div>
         </section>
      </div>
    </div>
  );
}
