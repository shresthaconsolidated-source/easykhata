'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { cn, formatCurrency } from '@/lib/utils';
import { 
  Plus, 
  FileText, 
  MoreVertical, 
  Download, 
  Printer, 
  Send, 
  Clock, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

export default function InvoicesPage() {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState<any>(null);

  useEffect(() => {
    if (user) {
      fetchInvoices();
    }
  }, [user]);

  const fetchInvoices = async () => {
    const { data: membership } = await supabase
      .from('company_members')
      .select('company_id, companies(*)')
      .eq('user_id', user?.id)
      .single();

    if (!membership) return;
    setCompany(membership.companies);

    const { data } = await supabase
      .from('invoices')
      .select('*')
      .eq('company_id', membership.company_id)
      .order('date', { ascending: false });

    if (data) setInvoices(data);
    setLoading(false);
  };

  const getStatusBadge = (status: string) => {
    const styles: any = {
      draft: "bg-white/5 text-white/40 border-white/10",
      sent: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      paid: "bg-green-500/10 text-green-400 border-green-500/20",
      overdue: "bg-red-500/10 text-red-400 border-red-500/20"
    };
    const icons: any = {
      draft: <Clock className="w-3 h-3" />,
      sent: <Send className="w-3 h-3" />,
      paid: <CheckCircle2 className="w-3 h-3" />,
      overdue: <AlertCircle className="w-3 h-3" />
    };

    return (
      <div className={cn("px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border flex items-center gap-1.5 w-fit", styles[status])}>
        {icons[status]}
        {status}
      </div>
    );
  };

  if (loading) return null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
          <p className="text-white/40 mt-1">Professional billing for your clients.</p>
        </div>
        <Link 
          href="/invoices/new"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-2xl flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Create Invoice
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {invoices.map((inv) => (
          <div key={inv.id} className="bg-[#1c1c1e] p-6 rounded-[2rem] border border-white/5 shadow-xl hover:border-white/10 transition-all group">
            <div className="flex items-start justify-between mb-6">
              <div className="p-3 bg-white/5 rounded-2xl text-white/40 group-hover:bg-blue-500 group-hover:text-white transition-all">
                <FileText className="w-6 h-6" />
              </div>
              {getStatusBadge(inv.status)}
            </div>

            <div className="mb-6">
              <h3 className="font-bold text-lg mb-1">{inv.client_name}</h3>
              <p className="text-white/40 text-sm">Invoice {inv.invoice_number}</p>
            </div>

            <div className="flex items-end justify-between">
              <div>
                <p className="text-[10px] text-white/30 uppercase tracking-widest mb-1">Total Amount</p>
                <p className="text-xl font-bold">{company?.currency} {Number(inv.total).toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-white/30 uppercase tracking-widest mb-1">Due Date</p>
                <p className="text-sm font-medium text-white/60">{format(new Date(inv.due_date), 'MMM d, yyyy')}</p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 flex gap-2">
              <Link 
                href={`/invoices/${inv.id}`}
                className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all border border-white/5"
              >
                <FileText className="w-4 h-4" /> View
              </Link>
              <Link 
                href={`/invoices/${inv.id}/edit`}
                className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all border border-white/5"
              >
                <AlertCircle className="w-4 h-4" /> Edit
              </Link>
              <Link 
                href={`/invoices/${inv.id}?print=true`}
                className="p-2.5 bg-white/5 hover:bg-white/10 text-white/60 rounded-xl transition-all border border-white/5"
              >
                <Printer className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}

        {invoices.length === 0 && (
          <div className="col-span-full py-32 border-2 border-dashed border-white/5 rounded-[3rem] flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
              <FileText className="w-10 h-10 text-white/10" />
            </div>
            <h3 className="text-xl font-bold mb-2">No invoices yet</h3>
            <p className="text-white/40 max-w-xs mx-auto mb-8">
              Start billing your clients professionally with our simple invoicing system.
            </p>
            <Link 
              href="/invoices/new"
              className="text-blue-400 font-bold hover:text-blue-300 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create your first invoice
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
