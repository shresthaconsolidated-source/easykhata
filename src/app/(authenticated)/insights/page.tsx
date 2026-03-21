'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCompany } from '@/contexts/CompanyContext';
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
  PieChart,
  Package,
  Layers,
  FileText
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';
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
  const { company } = useCompany();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'detailed'>('overview');
  const [insights, setInsights] = useState<Insight[]>([]);
  const [stats, setStats] = useState({
    currentBalance: 0,
    monthlyIncome: 0,
    monthlyExpense: 0,
    monthlyProfit: 0,
    incomeTrend: 0,
    expenseTrend: 0,
    topCategories: [] as any[],
    salesReport: [] as any[],
    expenseReport: [] as any[],
    profitLastMonth: 0,
    incomeLastMonth: 0,
    expenseLastMonth: 0
  });

  useEffect(() => {
    if (user && company) {
      fetchData();
    }
  }, [user, company]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const companyId = company.id;
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

      // Top Categories (Overview)
      const catMap: Record<string, number> = {};
      thisMonth.filter(t => t.type === 'expense').forEach(t => {
        const name = t.categories?.name || 'Other';
        catMap[name] = (catMap[name] || 0) + Number(t.amount);
      });
      const topCats = Object.entries(catMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, amount]) => ({ name, amount }));

      // DETAILED REPORT: Sales & Units Sold
      const unitsMapThis: Record<string, { quantity: number, amount: number }> = {};
      const unitsMapLast: Record<string, { quantity: number, amount: number }> = {};
      
      thisMonth.filter(t => t.type === 'income').forEach(t => {
         const name = t.categories?.name || t.note || 'Uncategorized';
         if (!unitsMapThis[name]) unitsMapThis[name] = { quantity: 0, amount: 0 };
         unitsMapThis[name].quantity += Number(t.quantity || 1);
         unitsMapThis[name].amount += Number(t.amount);
      });
      lastMonth.filter(t => t.type === 'income').forEach(t => {
         const name = t.categories?.name || t.note || 'Uncategorized';
         if (!unitsMapLast[name]) unitsMapLast[name] = { quantity: 0, amount: 0 };
         unitsMapLast[name].quantity += Number(t.quantity || 1);
         unitsMapLast[name].amount += Number(t.amount);
      });
      const salesReport = Object.keys({ ...unitsMapThis, ...unitsMapLast }).map(name => {
         const t = unitsMapThis[name] || { quantity: 0, amount: 0 };
         const l = unitsMapLast[name] || { quantity: 0, amount: 0 };
         const qtyDiff = t.quantity - l.quantity;
         const qtyTrend = l.quantity > 0 ? (qtyDiff / l.quantity) * 100 : (t.quantity > 0 ? 100 : 0);
         return { name, thisQty: t.quantity, lastQty: l.quantity, thisAmt: t.amount, lastAmt: l.amount, qtyTrend };
      }).sort((a, b) => b.thisAmt - a.thisAmt);

      // DETAILED REPORT: Expenses Comparative
      const expMapThis: Record<string, number> = {};
      const expMapLast: Record<string, number> = {};
      thisMonth.filter(t => t.type === 'expense').forEach(t => {
         const name = t.categories?.name || 'Uncategorized';
         expMapThis[name] = (expMapThis[name] || 0) + Number(t.amount);
      });
      lastMonth.filter(t => t.type === 'expense').forEach(t => {
         const name = t.categories?.name || 'Uncategorized';
         expMapLast[name] = (expMapLast[name] || 0) + Number(t.amount);
      });
      const expenseReport = Object.keys({ ...expMapThis, ...expMapLast }).map(name => {
         const t = expMapThis[name] || 0;
         const l = expMapLast[name] || 0;
         const diff = t - l;
         const trend = l > 0 ? (diff / l) * 100 : (t > 0 ? 100 : 0);
         return { name, thisAmt: t, lastAmt: l, trend };
      }).sort((a, b) => b.thisAmt - a.thisAmt);

      setStats({
        currentBalance: allIncome - allExpense,
        monthlyIncome: incomeThis,
        monthlyExpense: expenseThis,
        monthlyProfit: incomeThis - expenseThis,
        incomeTrend: incomeLast > 0 ? ((incomeThis - incomeLast) / incomeLast) * 100 : 0,
        expenseTrend: expenseLast > 0 ? ((expenseThis - expenseLast) / expenseLast) * 100 : 0,
        topCategories: topCats,
        salesReport,
        expenseReport,
        profitLastMonth: incomeLast - expenseLast,
        incomeLastMonth: incomeLast,
        expenseLastMonth: expenseLast
      });

      // Rule-Based Insights
      const newInsights: Insight[] = [];
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
      const profit = incomeThis - expenseThis;
      const currency = company.currency || 'NPR';
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
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-black bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent tracking-tighter">
            Insights
          </h1>
          <p className="text-white/30 text-sm font-medium uppercase tracking-[0.2em]">Simple, actionable business analysis</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 bg-[#0b0b0b] p-1.5 rounded-[1.25rem] border border-white/5 w-max">
         <button 
           onClick={() => setActiveTab('overview')}
           className={cn("px-6 py-2.5 rounded-[1rem] text-xs font-bold uppercase tracking-widest transition-all", activeTab === 'overview' ? "bg-white/10 text-white shadow-xl" : "text-white/40 hover:text-white/70 hover:bg-white/5")}
         >
           Overview
         </button>
         <button 
           onClick={() => setActiveTab('detailed')}
           className={cn("px-6 py-2.5 rounded-[1rem] text-xs font-bold uppercase tracking-widest transition-all", activeTab === 'detailed' ? "bg-white/10 text-white shadow-xl" : "text-white/40 hover:text-white/70 hover:bg-white/5")}
         >
           Detailed Report
         </button>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
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
                  <h2 className="text-4xl font-black tracking-tight text-white mb-2 truncate">
                     {formatCurrency(stats.currentBalance, company?.currency)}
                  </h2>
                  <div className="flex items-center gap-2 text-white/30 text-xs font-bold uppercase tracking-widest truncate">
                     <Activity className="w-3.5 h-3.5 shrink-0" />
                     Net Money In - Money Out
                  </div>
               </div>

               <div className="bg-[#0b0b0b] p-8 rounded-[2rem] border border-white/5 shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[60px] -mr-16 -mt-16 group-hover:bg-blue-500/10 transition-all duration-700" />
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-4">Monthly Profit</p>
                  <h2 className={cn(
                    "text-4xl font-black tracking-tight mb-2 truncate",
                    stats.monthlyProfit >= 0 ? "text-emerald-400" : "text-red-400"
                  )}>
                     {formatCurrency(stats.monthlyProfit, company?.currency)}
                  </h2>
                  <div className="flex items-center gap-2 text-white/30 text-xs font-bold uppercase tracking-widest truncate">
                     {stats.monthlyProfit >= 0 ? <TrendingUp className="w-3.5 h-3.5 shrink-0" /> : <TrendingDown className="w-3.5 h-3.5 shrink-0" />}
                     This month alone
                  </div>
               </div>

               <div className="bg-[#0b0b0b] p-8 rounded-[2rem] border border-white/5 shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 blur-[60px] -mr-16 -mt-16 group-hover:bg-purple-500/10 transition-all duration-700" />
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-4">Expense Trend</p>
                  <h2 className={cn(
                    "text-4xl font-black tracking-tight mb-2 truncate",
                    stats.expenseTrend > 0 ? "text-red-400" : "text-emerald-400"
                  )}>
                     {stats.expenseTrend > 0 ? '+' : ''}{stats.expenseTrend.toFixed(0)}%
                  </h2>
                  <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.2em] truncate">Compared to last month</p>
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
                           <span className="text-white/40 truncate pr-4">{cat.name}</span>
                           <span className="text-white shrink-0">{formatCurrency(cat.amount, company?.currency)}</span>
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
      )}

      {activeTab === 'detailed' && (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* P&L Snapshot */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
               <FileText className="w-5 h-5 text-blue-400" />
               <h3 className="font-bold text-lg">P&L Analysis</h3>
               <span className="px-2 py-0.5 rounded-full bg-white/5 text-[9px] font-black uppercase tracking-widest text-white/40 ml-2">MoM Comparison</span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
               <div className="bg-[#0b0b0b] p-8 rounded-[2rem] border border-white/5 shadow-2xl space-y-8">
                  <div className="flex justify-between items-end border-b border-white/5 pb-6">
                     <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-2">{format(new Date(), 'MMMM yyyy')} <span className="text-white/20">(This Month)</span></p>
                        <h4 className={cn("text-3xl font-black tracking-tight", stats.monthlyProfit >= 0 ? "text-emerald-400" : "text-red-400")}>
                           {formatCurrency(stats.monthlyProfit, company?.currency)}
                        </h4>
                        <p className="text-xs font-bold text-white/30 uppercase tracking-widest mt-2 hover:text-white/60 transition-colors">Net Profit</p>
                     </div>
                     <div className="text-right flex flex-col gap-2">
                        <div className="flex items-center justify-between gap-6 text-xs font-bold uppercase tracking-widest">
                           <span className="text-white/30">Revenue</span>
                           <span className="text-white text-right">{formatCurrency(stats.monthlyIncome, company?.currency)}</span>
                        </div>
                        <div className="flex items-center justify-between gap-6 text-xs font-bold uppercase tracking-widest">
                           <span className="text-white/30">Expenses</span>
                           <span className="text-white text-right">{formatCurrency(stats.monthlyExpense, company?.currency)}</span>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="bg-[#0b0b0b] opacity-80 p-8 rounded-[2rem] border border-white/5 shadow-2xl space-y-8">
                  <div className="flex justify-between items-end border-b border-white/5 pb-6">
                     <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mb-2">{format(subMonths(new Date(), 1), 'MMMM yyyy')} <span className="text-white/20">(Last Month)</span></p>
                        <h4 className={cn("text-3xl font-black tracking-tight", stats.profitLastMonth >= 0 ? "text-emerald-400/50" : "text-red-400/50")}>
                           {formatCurrency(stats.profitLastMonth, company?.currency)}
                        </h4>
                        <p className="text-xs font-bold text-white/20 uppercase tracking-widest mt-2 hover:text-white/50 transition-colors">Net Profit</p>
                     </div>
                     <div className="text-right flex flex-col gap-2">
                        <div className="flex items-center justify-between gap-6 text-xs font-bold uppercase tracking-widest">
                           <span className="text-white/20">Revenue</span>
                           <span className="text-white/50 text-right">{formatCurrency(stats.incomeLastMonth, company?.currency)}</span>
                        </div>
                        <div className="flex items-center justify-between gap-6 text-xs font-bold uppercase tracking-widest">
                           <span className="text-white/20">Expenses</span>
                           <span className="text-white/50 text-right">{formatCurrency(stats.expenseLastMonth, company?.currency)}</span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </section>

          {/* Units Sold / Sales Analysis */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
               <Package className="w-5 h-5 text-emerald-400" />
               <h3 className="font-bold text-lg">Sales Analysis (Units Sold)</h3>
            </div>
            
            <div className="bg-[#0b0b0b] rounded-[2rem] border border-white/5 shadow-2xl overflow-hidden">
               <div className="w-full overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[600px]">
                     <thead>
                        <tr className="border-b border-white/5">
                           <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Item / Category</th>
                           <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/30 text-right">Units (This Mo)</th>
                           <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/30 text-right">Units (Last Mo)</th>
                           <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/30 text-right">Unit Trend</th>
                           <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/30 text-right">Revenue (This Mo)</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-white/[0.02]">
                        {stats.salesReport.map((item, idx) => (
                           <tr key={idx} className="hover:bg-white/[0.02] transition-colors group">
                              <td className="p-6 font-bold text-white/90">{item.name}</td>
                              <td className="p-6 font-bold text-white/60 text-right">{Number(item.thisQty).toLocaleString()}</td>
                              <td className="p-6 font-bold text-white/30 text-right">{Number(item.lastQty).toLocaleString()}</td>
                              <td className="p-6 font-black text-right">
                                 {item.qtyTrend !== 0 ? (
                                    <span className={cn("px-2 py-1 rounded-lg text-[10px] uppercase tracking-widest", item.qtyTrend > 0 ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400")}>
                                       {item.qtyTrend > 0 ? '+' : ''}{item.qtyTrend.toFixed(0)}%
                                    </span>
                                 ) : (
                                    <span className="text-white/20 text-[10px] uppercase tracking-widest font-black">-</span>
                                 )}
                              </td>
                              <td className="p-6 font-bold text-emerald-400 text-right">
                                 {formatCurrency(item.thisAmt, company?.currency)}
                              </td>
                           </tr>
                        ))}
                        {stats.salesReport.length === 0 && (
                           <tr>
                              <td colSpan={5} className="p-10 text-center text-white/20 text-xs font-bold uppercase tracking-widest">No Sales Data Found</td>
                           </tr>
                        )}
                     </tbody>
                  </table>
               </div>
            </div>
          </section>

          {/* Expense Comparative Analysis */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
               <Layers className="w-5 h-5 text-red-400" />
               <h3 className="font-bold text-lg">Expense Comparative Analysis</h3>
            </div>
            
            <div className="bg-[#0b0b0b] rounded-[2rem] border border-white/5 shadow-2xl overflow-hidden">
               <div className="w-full overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[600px]">
                     <thead>
                        <tr className="border-b border-white/5">
                           <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Expense Category</th>
                           <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/30 text-right">This Month</th>
                           <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/30 text-right">Last Month</th>
                           <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/30 text-right">Variance / Trend</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-white/[0.02]">
                        {stats.expenseReport.map((item, idx) => (
                           <tr key={idx} className="hover:bg-white/[0.02] transition-colors group">
                              <td className="p-6 font-bold text-white/90">{item.name}</td>
                              <td className="p-6 font-bold text-white/60 text-right">{formatCurrency(item.thisAmt, company?.currency)}</td>
                              <td className="p-6 font-bold text-white/30 text-right">{formatCurrency(item.lastAmt, company?.currency)}</td>
                              <td className="p-6 font-black text-right">
                                 {item.trend !== 0 ? (
                                    <span className={cn("px-2 py-1 rounded-lg text-[10px] uppercase tracking-widest", item.trend > 0 ? "bg-red-500/10 text-red-400" : "bg-emerald-500/10 text-emerald-400")}>
                                       {item.trend > 0 ? '+' : ''}{item.trend.toFixed(0)}%
                                    </span>
                                 ) : (
                                    <span className="text-white/20 text-[10px] uppercase tracking-widest font-black">-</span>
                                 )}
                              </td>
                           </tr>
                        ))}
                        {stats.expenseReport.length === 0 && (
                           <tr>
                              <td colSpan={4} className="p-10 text-center text-white/20 text-xs font-bold uppercase tracking-widest">No Expense Data Found</td>
                           </tr>
                        )}
                     </tbody>
                  </table>
               </div>
            </div>
          </section>

        </div>
      )}

    </div>
  );
}
