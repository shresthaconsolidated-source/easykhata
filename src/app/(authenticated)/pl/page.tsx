'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
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
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [compareDate, setCompareDate] = useState(subMonths(new Date(), 1));
  const [isComparing, setIsComparing] = useState(false);
  const [data, setData] = useState<any>(null);
  const [compareData, setCompareData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState<any>(null);

  useEffect(() => {
    if (user) {
      fetchAllData();
    }
  }, [user, selectedDate, compareDate, isComparing]);

  const fetchAllData = async () => {
    setLoading(true);
    const { data: membership } = await supabase
      .from('company_members')
      .select('company_id, companies(*)')
      .eq('user_id', user?.id)
      .single();

    if (!membership) return;
    setCompany(membership.companies);

    const d1 = await fetchPeriodData(membership.company_id, selectedDate);
    setData(d1);

    if (isComparing) {
      const d2 = await fetchPeriodData(membership.company_id, compareDate);
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
        "flex items-center justify-between py-4 border-b border-white/5 group transition-colors",
        isBold ? "font-black text-white" : "text-white/60",
        isSub ? "pl-8 text-xs" : "pl-0"
      )}>
        <div className="flex items-center gap-2 flex-1">
           {!isBold && <ChevronRight className="w-3.5 h-3.5 opacity-20 group-hover:opacity-100 transition-opacity" />}
           <span className="uppercase tracking-widest">{name}</span>
        </div>
        <div className="flex items-center gap-12 text-right">
           <div className="min-w-[100px]">
             <span className={cn(isBold && "text-lg italic")}>{formatCurrency(value, company?.currency)}</span>
           </div>
           {isComparing && (
             <>
               <div className="min-w-[100px] text-white/20 italic">
                 {formatCurrency(compareValue || 0, company?.currency)}
               </div>
               <div className={cn(
                 "min-w-[80px] font-black italic text-[10px] tracking-tighter",
                 (variance || 0) >= 0 ? "text-green-500" : "text-red-500"
               )}>
                 {variance !== null && (variance >= 0 ? `+${variance}` : variance)}
               </div>
             </>
           )}
        </div>
      </div>
    );
  };

  if (!company) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight uppercase italic">Profit & Loss</h1>
          <p className="text-white/30 font-medium mt-1 uppercase tracking-widest text-[10px]">Financial health breakdown and comparison.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
           {/* Primary Picker */}
           <div className="relative group">
              <input 
                type="month" 
                value={format(selectedDate, 'yyyy-MM')}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                className="bg-[#1c1c1e] px-5 py-3 rounded-2xl border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-white/60 outline-none hover:border-white/20 transition-all cursor-pointer appearance-none"
              />
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none opacity-20">
                <CalendarIcon className="w-3.5 h-3.5" />
              </div>
           </div>

           <button 
             onClick={() => setIsComparing(!isComparing)}
             className={cn(
               "px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border",
               isComparing 
                ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20" 
                : "bg-[#1c1c1e] border-white/10 text-white/40 hover:border-white/30"
             )}
           >
             {isComparing ? 'Close Comparison' : 'Compare Period'}
           </button>

           {isComparing && (
             <div className="relative group animate-in slide-in-from-left-4 fade-in">
                <input 
                  type="month" 
                  value={format(compareDate, 'yyyy-MM')}
                  onChange={(e) => setCompareDate(new Date(e.target.value))}
                  className="bg-blue-600/10 px-5 py-3 rounded-2xl border border-blue-500/30 text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 outline-none hover:border-blue-500/50 transition-all cursor-pointer appearance-none"
                />
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none opacity-40">
                  <CalendarIcon className="w-3.5 h-3.5 text-blue-400" />
                </div>
             </div>
           )}
        </div>
      </div>

      <div className="bg-[#1c1c1e] p-8 md:p-12 rounded-[3.5rem] border border-white/5 shadow-2xl space-y-16 relative overflow-hidden backdrop-blur-xl">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        
        {isComparing && (
          <div className="flex justify-end gap-12 pr-4 text-[9px] font-black uppercase tracking-[0.3em] text-white/20">
            <div className="min-w-[100px] text-right">{format(selectedDate, 'MMM yyyy')}</div>
            <div className="min-w-[100px] text-right">{format(compareDate, 'MMM yyyy')}</div>
            <div className="min-w-[80px] text-right">Variance</div>
          </div>
        )}

        {/* Income Section */}
        <section>
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center ring-1 ring-green-500/20">
              <TrendingUp className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <h2 className="font-black text-xl uppercase tracking-[0.1em] italic text-white/90 leading-none">Operating Income</h2>
              <p className="text-[9px] font-bold text-white/20 uppercase tracking-[0.3em] mt-2">Revenue streams and sales</p>
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
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center ring-1 ring-red-500/20">
              <TrendingDown className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <h2 className="font-black text-xl uppercase tracking-[0.1em] italic text-white/90 leading-none">Operating Expenses</h2>
              <p className="text-[9px] font-bold text-white/20 uppercase tracking-[0.3em] mt-2">Costs and overheads</p>
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
        <div className="pt-12 border-t border-white/5">
          <div className={cn(
            "p-12 rounded-[2.5rem] flex items-center justify-between border ring-1 transition-all duration-700",
            data?.netProfit >= 0 ? "bg-green-500/5 border-green-500/20 ring-green-500/10" : "bg-red-500/5 border-red-500/20 ring-red-500/10"
          )}>
            <div className="flex-1">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-2 italic">Consolidated Net Profit</h3>
              <div className="flex items-baseline gap-12">
                <p className={cn(
                  "text-6xl font-black tracking-tighter italic",
                  data?.netProfit >= 0 ? "text-green-400" : "text-red-400"
                )}>
                  {formatCurrency(data?.netProfit, company?.currency)}
                </p>
                
                {isComparing && (
                   <div className="flex flex-col gap-1">
                     <span className="text-white/20 text-xs font-bold italic line-through decoration-white/10">
                        {formatCurrency(compareData?.netProfit || 0, company?.currency)}
                     </span>
                     <span className={cn(
                       "text-sm font-black italic",
                       (data?.netProfit - (compareData?.netProfit || 0)) >= 0 ? "text-green-400" : "text-red-400"
                     )}>
                       {data?.netProfit - (compareData?.netProfit || 0) >= 0 ? '+' : ''}{data?.netProfit - (compareData?.netProfit || 0)}
                     </span>
                   </div>
                )}
              </div>
            </div>
            <div className={cn(
              "p-6 rounded-3xl ring-1",
              data?.netProfit >= 0 ? "bg-green-500/10 ring-green-500/20 text-green-400" : "bg-red-500/10 ring-red-500/20 text-red-400"
            )}>
              <BarChart3 className="w-10 h-10" />
            </div>
          </div>
        </div>
      </div>

      <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[2rem] flex items-center justify-center gap-3 text-white/10 text-[10px] font-black uppercase tracking-[0.4em]">
        <CheckIcon className="w-4 h-4" /> End of Financial Report
      </div>
    </div>
  );
}
