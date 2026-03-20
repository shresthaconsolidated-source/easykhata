'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCompany } from '@/contexts/CompanyContext';
import { supabase } from '@/lib/supabase';
import { formatCurrency, cn } from '@/lib/utils';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Calendar as CalendarIcon,
  ChevronRight,
  ChevronDown,
  Check as CheckIcon
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';

export default function PLPage() {
  const { user } = useAuth();
  const { company } = useCompany();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [compareDate, setCompareDate] = useState(subMonths(new Date(), 1));
  const [isComparing, setIsComparing] = useState(false);
  const [data, setData] = useState<any>(null);
  const [compareData, setCompareData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && company) {
      fetchAllData();
    }
  }, [user, company, selectedDate, compareDate, isComparing]);

  const fetchAllData = async () => {
    setLoading(true);
    const companyId = company.id;

    const d1 = await fetchPeriodData(companyId, selectedDate);
    setData(d1);

    if (isComparing) {
      const d2 = await fetchPeriodData(companyId, compareDate);
      setCompareData(d2);
    }

    setLoading(false);
  };

  const fetchPeriodData = async (companyId: string, date: Date) => {
    const monthStart = format(startOfMonth(date), 'yyyy-MM-dd');
    const monthEnd = format(endOfMonth(date), 'yyyy-MM-dd');

    const { data: transactions } = await supabase
      .from('transactions')
      .select('*, categories(name)')
      .eq('company_id', companyId)
      .gte('date', monthStart)
      .lte('date', monthEnd);

    if (!transactions) return null;

    const incomeMap = new Map();
    const expenseMap = new Map();
    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach(t => {
      const amt = Number(t.amount);
      const catName = (Array.isArray(t.categories) ? t.categories[0]?.name : (t.categories as any)?.name) || 'Uncategorized';
      if (t.type === 'income') {
        totalIncome += amt;
        incomeMap.set(catName, (incomeMap.get(catName) || 0) + amt);
      } else {
        totalExpense += amt;
        expenseMap.set(catName, (expenseMap.get(catName) || 0) + amt);
      }
    });

    return {
      income: Array.from(incomeMap.entries()).map(([name, value]) => ({ name, value })),
      expense: Array.from(expenseMap.entries()).map(([name, value]) => ({ name, value })),
      totalIncome,
      totalExpense,
      netProfit: totalIncome - totalExpense
    };
  };

  const PLRow = ({ name, value, compareValue, isBold = false, isSub = false }: any) => {
    const variance = compareValue !== undefined ? value - compareValue : null;
    return (
      <div className={cn(
        "flex items-center justify-between py-1.5 border-b border-white/5 group transition-colors",
        isBold ? "font-bold text-white text-sm mt-4 pb-2 border-white/10" : "text-white/50 text-[12px]",
        isSub ? "pl-4" : "pl-0"
      )}>
        <div className="flex items-center gap-2 flex-1">
           {!isBold && <ChevronRight className="w-3 h-3 opacity-10 group-hover:opacity-100 transition-opacity" />}
           <span className={cn(isBold && "uppercase tracking-wider text-[10px]")}>{name}</span>
        </div>
        <div className="flex items-center gap-8 text-right">
           <div className="min-w-[80px]">
             <span className={cn(isBold && "text-sm font-black text-blue-400")}>{formatCurrency(value, company?.currency)}</span>
           </div>
           {isComparing && (
             <>
               <div className="min-w-[80px] text-white/20">
                 {formatCurrency(compareValue || 0, company?.currency)}
               </div>
               <div className={cn(
                 "min-w-[60px] font-bold text-[9px] tracking-tight",
                 (variance || 0) >= 0 ? "text-green-500/60" : "text-red-500/60"
               )}>
                 {variance !== null && (variance >= 0 ? `+${variance.toLocaleString()}` : variance.toLocaleString())}
               </div>
             </>
           )}
        </div>
      </div>
    );
  };

  if (!company) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 lg:pb-0">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Profit & Loss</h1>
          <p className="text-white/30 text-xs mt-1">Detailed financial performance and comparison.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
           <div className="relative group">
              <input 
                type="month" 
                value={format(selectedDate, 'yyyy-MM')}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                className="bg-[#1c1c1e] px-4 py-2.5 rounded-xl border border-white/10 text-[11px] font-bold uppercase tracking-wider text-white/60 outline-none hover:border-white/20 transition-all cursor-pointer appearance-none"
              />
              <div className="absolute inset-y-0 right-3.5 flex items-center pointer-events-none opacity-20">
                <CalendarIcon className="w-3.5 h-3.5" />
              </div>
           </div>

           <button 
             onClick={() => setIsComparing(!isComparing)}
             className={cn(
               "px-4 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all border",
               isComparing 
                ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20" 
                : "bg-[#1c1c1e] border-white/10 text-white/40 hover:border-white/30"
             )}
           >
             {isComparing ? 'Close' : 'Compare'}
           </button>

           {isComparing && (
             <div className="relative group animate-in slide-in-from-left-4 fade-in">
                <input 
                  type="month" 
                  value={format(compareDate, 'yyyy-MM')}
                  onChange={(e) => setCompareDate(new Date(e.target.value))}
                  className="bg-blue-600/10 px-4 py-2.5 rounded-xl border border-blue-500/20 text-[11px] font-bold uppercase tracking-wider text-blue-400 outline-none hover:border-blue-500/40 transition-all cursor-pointer appearance-none"
                />
                <div className="absolute inset-y-0 right-3.5 flex items-center pointer-events-none opacity-40">
                  <CalendarIcon className="w-3.5 h-3.5 text-blue-400" />
                </div>
             </div>
           )}
        </div>
      </div>

      <div className="w-full overflow-x-auto custom-scrollbar pb-6 lg:pb-0">
        <div className="bg-[#0b0b0b] p-6 md:p-8 rounded-[2rem] border border-white/[0.03] shadow-2xl space-y-8 relative overflow-hidden min-w-[500px] md:min-w-0">
        {isComparing && (
          <div className="flex justify-end gap-8 pr-4 text-[8px] font-black uppercase tracking-[0.2em] text-white/10">
            <div className="min-w-[80px] text-right">{format(selectedDate, 'MMM yy')}</div>
            <div className="min-w-[80px] text-right">{format(compareDate, 'MMM yy')}</div>
            <div className="min-w-[60px] text-right">VAR</div>
          </div>
        )}

        {/* Income Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-green-500/5 flex items-center justify-center ring-1 ring-green-500/10">
              <TrendingUp className="w-4 h-4 text-green-400/50" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-white/80 uppercase tracking-tight">Operating Income</h2>
              <p className="text-[9px] font-black text-white/10 uppercase tracking-[0.2em] mt-0.5">Revenue / Sales</p>
            </div>
          </div>

          <div className="space-y-1">
            {data?.income.map((cat: any) => {
              const cVal = compareData?.income.find((c: any) => c.name === cat.name)?.value || 0;
              return <PLRow key={cat.name} name={cat.name} value={cat.value} compareValue={isComparing ? cVal : undefined} isSub />;
            })}
            <div className="pt-8">
               <PLRow name="Total Operating Income" value={data?.totalIncome} compareValue={isComparing ? (compareData?.totalIncome || 0) : undefined} isBold />
            </div>
          </div>
        </section>

        {/* Expense Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-red-500/5 flex items-center justify-center ring-1 ring-red-500/10">
              <TrendingDown className="w-4 h-4 text-red-400/50" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-white/80 uppercase tracking-tight">Operating Expenses</h2>
              <p className="text-[9px] font-black text-white/10 uppercase tracking-[0.2em] mt-0.5">Costs / Overheads</p>
            </div>
          </div>

          <div className="space-y-1">
            {data?.expense.map((cat: any) => {
              const cVal = compareData?.expense.find((c: any) => c.name === cat.name)?.value || 0;
              return <PLRow key={cat.name} name={cat.name} value={cat.value} compareValue={isComparing ? cVal : undefined} isSub />;
            })}
            <div className="pt-8">
               <PLRow name="Total Operating Expenses" value={data?.totalExpense} compareValue={isComparing ? (compareData?.totalExpense || 0) : undefined} isBold />
            </div>
          </div>
        </section>

        {/* Net Profit Section */}
        <div className="pt-6">
          <div className={cn(
            "p-6 rounded-[1.5rem] flex items-center justify-between border transition-all duration-700",
            data?.netProfit >= 0 ? "bg-green-500/[0.02] border-green-500/10" : "bg-red-500/[0.02] border-red-500/10"
          )}>
            <div className="flex-1">
              <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-white/10 mb-1">Consolidated Net Profit</h3>
              <div className="flex items-baseline gap-6">
                <p className={cn(
                  "text-2xl font-bold tracking-tighter",
                  data?.netProfit >= 0 ? "text-green-400" : "text-red-400"
                )}>
                  {formatCurrency(data?.netProfit, company?.currency)}
                </p>
                
                {isComparing && (
                   <div className="flex items-baseline gap-3">
                     <span className="text-white/5 text-[10px] font-medium line-through">
                        {formatCurrency(compareData?.netProfit || 0, company?.currency)}
                     </span>
                     <span className={cn(
                       "text-[10px] font-black",
                       (data?.netProfit - (compareData?.netProfit || 0)) >= 0 ? "text-green-500/40" : "text-red-500/40"
                     )}>
                       {data?.netProfit - (compareData?.netProfit || 0) >= 0 ? '+' : ''}{formatCurrency(data?.netProfit - (compareData?.netProfit || 0), company?.currency)}
                     </span>
                   </div>
                )}
              </div>
            </div>
            <div className={cn(
              "p-3 rounded-xl border",
              data?.netProfit >= 0 ? "bg-green-500/5 border-green-500/10 text-green-400/30" : "bg-red-500/5 border-red-500/10 text-red-400/30"
            )}>
              <BarChart3 className="w-5 h-5" />
            </div>
          </div>
        </div>
        </div>
      </div>

      <div className="p-6 bg-white/[0.01] border border-white/5 rounded-2xl flex items-center justify-center gap-3 text-white/10 text-[9px] font-bold uppercase tracking-[0.3em]">
        <CheckIcon className="w-3.5 h-3.5" /> End of Financial Report
      </div>
    </div>
  );
}
