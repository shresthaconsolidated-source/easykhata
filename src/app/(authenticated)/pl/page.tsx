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
  ChevronDown
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';

export default function PLPage() {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState<any>(null);

  useEffect(() => {
    if (user) {
      fetchPLData();
    }
  }, [user]);

  const fetchPLData = async () => {
    const { data: membership } = await supabase
      .from('company_members')
      .select('company_id, companies(*)')
      .eq('user_id', user?.id)
      .single();

    if (!membership) return;
    setCompany(membership.companies);

    const monthStart = format(startOfMonth(new Date()), 'yyyy-MM-dd');
    const monthEnd = format(endOfMonth(new Date()), 'yyyy-MM-dd');

    const { data: transactions } = await supabase
      .from('transactions')
      .select('*, categories(name)')
      .eq('company_id', membership.company_id)
      .gte('date', monthStart)
      .lte('date', monthEnd);

    if (transactions) {
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

      setData({
        income: Array.from(incomeMap.entries()).map(([name, value]) => ({ name, value })),
        expense: Array.from(expenseMap.entries()).map(([name, value]) => ({ name, value })),
        totalIncome,
        totalExpense,
        netProfit: totalIncome - totalExpense
      });
    }
    setLoading(false);
  };

  const PLRow = ({ name, value, isBold = false, isSub = false }: any) => (
    <div className={cn(
      "flex items-center justify-between py-4 border-b border-white/5 group transition-colors",
      isBold ? "font-bold text-white" : "text-white/60",
      isSub ? "pl-8 text-sm" : "pl-0"
    )}>
      <div className="flex items-center gap-2">
         {!isBold && <ChevronRight className="w-3 h-3 opacity-20 group-hover:opacity-100 transition-opacity" />}
         <span>{name}</span>
      </div>
      <span>{formatCurrency(value, company?.currency)}</span>
    </div>
  );

  if (loading) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profit & Loss</h1>
          <p className="text-white/40 mt-1">Detailed breakdown of your financial health.</p>
        </div>
        <div className="bg-[#1c1c1e] px-4 py-2 rounded-2xl border border-white/5 text-sm font-medium flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-white/20" />
          {format(new Date(), 'MMMM yyyy')}
        </div>
      </div>

      <div className="bg-[#1c1c1e] p-8 md:p-12 rounded-[3rem] border border-white/5 shadow-2xl space-y-12">
        {/* Income Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-2xl bg-green-500/10 text-green-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h2 className="font-bold text-xl uppercase tracking-widest text-white/80">Operating Income</h2>
          </div>

          <div className="space-y-1">
            {data?.income.map((cat: any) => (
              <PLRow key={cat.name} name={cat.name} value={cat.value} isSub />
            ))}
            <div className="pt-4 mt-2">
               <PLRow name="Total Operating Income" value={data?.totalIncome} isBold />
            </div>
          </div>
        </section>

        {/* Expense Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-2xl bg-red-500/10 text-red-400">
              <TrendingDown className="w-5 h-5" />
            </div>
            <h2 className="font-bold text-xl uppercase tracking-widest text-white/80">Operating Expenses</h2>
          </div>

          <div className="space-y-1">
            {data?.expense.map((cat: any) => (
              <PLRow key={cat.name} name={cat.name} value={cat.value} isSub />
            ))}
            <div className="pt-4 mt-2">
               <PLRow name="Total Operating Expenses" value={data?.totalExpense} isBold />
            </div>
          </div>
        </section>

        {/* Net Profit Section */}
        <div className="pt-8 border-t-2 border-dashed border-white/10">
          <div className={cn(
            "p-8 rounded-[2rem] flex items-center justify-between",
            data?.netProfit >= 0 ? "bg-green-500/10" : "bg-red-500/10"
          )}>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-1">Net Profit / Loss</h3>
              <p className={cn(
                "text-4xl font-black tracking-tighter",
                data?.netProfit >= 0 ? "text-green-400" : "text-red-400"
              )}>
                {formatCurrency(data?.netProfit, company?.currency)}
              </p>
            </div>
            <BarChart3 className={cn(
              "w-12 h-12",
              data?.netProfit >= 0 ? "text-green-500/20" : "text-red-500/20"
            )} />
          </div>
        </div>
      </div>

      <div className="p-6 bg-white/5 rounded-2xl flex items-center justify-center gap-2 text-white/20 text-xs font-bold uppercase tracking-[0.2em]">
        <BarChart3 className="w-4 h-4" /> End of Report
      </div>
    </div>
  );
}
