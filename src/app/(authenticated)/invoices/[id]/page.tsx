'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Printer, Download } from 'lucide-react';
import { format } from 'date-fns';
import { formatCurrency } from '@/lib/utils';

export default function InvoiceDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [invoice, setInvoice] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [company, setCompany] = useState<any>(null);

  useEffect(() => {
    if (user && id) {
      fetchInvoiceDetails();
    }
  }, [user, id]);

  const fetchInvoiceDetails = async () => {
    // 1. Fetch Invoice
    const { data: invData, error: invError } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', id)
      .single();

    if (invError || !invData) {
      console.error(invError);
      return;
    }
    setInvoice(invData);

    // 2. Fetch Items
    const { data: itemData } = await supabase
      .from('invoice_items')
      .select('*')
      .eq('invoice_id', id);
    if (itemData) setItems(itemData);

    // 3. Fetch Company
    const { data: compData } = await supabase
      .from('companies')
      .select('*')
      .eq('id', invData.company_id)
      .single();
    if (compData) setCompany(compData);

    setLoading(false);

    // Auto trigger print if requested
    if (searchParams.get('print') === 'true') {
      setTimeout(() => window.print(), 500);
    }
  };

  if (loading) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0b] md:p-8 print:p-0">
      {/* Controls - Hidden on print */}
      <div className="max-w-4xl mx-auto mb-8 flex items-center justify-between print:hidden">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-white/40 hover:text-white transition-all font-medium"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Invoices
        </button>
        <div className="flex gap-4">
          <button 
            onClick={() => window.print()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-2xl flex items-center gap-2 font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95"
          >
            <Printer className="w-5 h-5" /> Print Invoice
          </button>
        </div>
      </div>

      {/* The Invoice Document */}
      <div className="max-w-[850px] mx-auto bg-white text-[#1a1f36] p-16 shadow-2xl min-h-[1100px] flex flex-col font-sans print:shadow-none print:p-12 print:mx-0 print:w-full">
        
        {/* Header Section */}
        <div className="flex justify-between items-start mb-20">
           <div>
              <h1 className="text-2xl font-bold tracking-tight mb-4 text-[#1a1f36]">{company?.name}</h1>
              <div className="text-[13px] text-[#4f566b] space-y-1.5 leading-relaxed">
                 <p className="whitespace-pre-line">{company?.address}</p>
                 {company?.pan && <p className="font-medium pt-1 text-[#1a1f36]">PAN: {company.pan}</p>}
              </div>
           </div>
           <div className="text-right">
              <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#3b82f6] mb-8">Invoice</h2>
              <div className="space-y-4 text-[13px]">
                 <div>
                    <p className="text-[#a3acb9] uppercase tracking-wider text-[10px] font-bold mb-1">Invoice Number</p>
                    <p className="font-semibold text-[#1a1f36]">{invoice.invoice_number}</p>
                 </div>
                 <div className="flex gap-8 justify-end">
                    <div>
                      <p className="text-[#a3acb9] uppercase tracking-wider text-[10px] font-bold mb-1">Date Issued</p>
                      <p className="font-medium">{format(new Date(invoice.date), 'MMMM dd, yyyy')}</p>
                    </div>
                    <div>
                      <p className="text-[#a3acb9] uppercase tracking-wider text-[10px] font-bold mb-1">Due Date</p>
                      <p className="font-medium">{format(new Date(invoice.due_date), 'MMMM dd, yyyy')}</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Bill To Section */}
        <div className="mb-20">
           <h3 className="text-[#a3acb9] uppercase tracking-wider text-[10px] font-bold mb-4">Bill To</h3>
           <div className="text-[13px] text-[#1a1f36]">
              <p className="font-bold text-base mb-2">{invoice.client_name}</p>
              <p className="text-[#4f566b] whitespace-pre-line leading-relaxed max-w-xs">{invoice.client_address}</p>
              {invoice.client_pan && <p className="font-medium mt-3">PAN: {invoice.client_pan}</p>}
           </div>
        </div>

        {/* Items Table */}
        <div className="flex-1">
           <table className="w-full">
              <thead>
                 <tr className="text-[11px] font-bold uppercase tracking-wider text-[#a3acb9] border-b border-[#e3e8ee]">
                    <th className="py-4 text-left font-bold">Description</th>
                    <th className="py-4 text-center w-16">Qty</th>
                    <th className="py-4 text-right w-32">Rate</th>
                    <th className="py-4 text-right w-32">Amount</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-[#f7f9fc]">
                 {items.map((item) => (
                    <tr key={item.id} className="text-[13px]">
                       <td className="py-5 font-medium text-[#1a1f36]">{item.description}</td>
                       <td className="py-5 text-center text-[#4f566b]">{item.quantity}</td>
                       <td className="py-5 text-right text-[#4f566b]">{Number(item.rate).toLocaleString()}</td>
                       <td className="py-5 text-right font-semibold text-[#1a1f36]">{Number(item.amount).toLocaleString()}</td>
                    </tr>
                 ))}
              </tbody>
           </table>
        </div>

        {/* Totals Section */}
        <div className="mt-12 flex justify-end border-t border-[#e3e8ee] pt-12">
           <div className="w-full max-w-[280px] space-y-4">
              <div className="flex justify-between text-[13px]">
                 <span className="text-[#4f566b]">Subtotal</span>
                 <span className="font-medium text-[#1a1f36]">{company?.currency} {Number(invoice.subtotal).toLocaleString()}</span>
              </div>
              {Number(invoice.discount) > 0 && (
                <div className="flex justify-between text-[13px] text-[#4f566b]">
                   <span>Discount</span>
                   <span>- {Number(invoice.discount).toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between items-baseline pt-4 border-t border-[#f7f9fc]">
                 <span className="text-[11px] font-black uppercase tracking-wider text-[#1a1f36]">Amount Due</span>
                 <span className="text-2xl font-bold text-[#1a1f36]">{company?.currency} {Number(invoice.total).toLocaleString()}</span>
              </div>
           </div>
        </div>

        {/* Footer Section */}
        <div className="mt-32 pt-12 flex justify-between items-end border-t border-[#f7f9fc]">
           <div className="text-[11px] text-[#a3acb9] font-medium">
              Thank you for your business.
           </div>
           <div className="text-right">
              <div className="mb-4 h-12 flex items-end justify-end">
                 {/* Sign space */}
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#1a1f36]">Authorized Signature</p>
           </div>
        </div>

      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        
        .font-sans {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
        }

        @media print {
          body { background: white !important; }
          .print\\:hidden { display: none !important; }
          .print\\:p-0 { padding: 0 !important; }
          @page { margin: 0; }
        }
      `}</style>
    </div>
  );
}
