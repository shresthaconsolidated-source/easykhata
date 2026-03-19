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
      <div className="max-w-[800px] mx-auto bg-white text-black p-12 shadow-2xl min-h-[1050px] flex flex-col font-serif print:shadow-none print:p-8 print:mx-0 print:w-full">
        
        {/* Header Section */}
        <div className="border-b-2 border-black pb-8 mb-8">
           <div className="flex justify-between items-start">
              <div>
                 <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">{company?.name}</h1>
                 <p className="text-sm whitespace-pre-line text-black/70">
                   {company?.address}
                   {company?.pan && `\nPAN: ${company.pan}`}
                 </p>
              </div>
              <div className="text-right">
                 <h2 className="text-2xl font-black text-blue-800 uppercase tracking-widest mb-4">Tax Invoice</h2>
                 <div className="space-y-1 text-sm">
                   <p><span className="font-bold">Invoice No:</span> {invoice.invoice_number}</p>
                   <p><span className="font-bold">Date:</span> {format(new Date(invoice.date), 'dd-MM-yyyy')}</p>
                 </div>
              </div>
           </div>
        </div>

        {/* Bill To & Details Section */}
        <div className="grid grid-cols-2 gap-12 mb-12">
           <div className="border border-black p-4">
              <h3 className="text-xs font-black uppercase bg-black text-white px-2 py-1 mb-3 inline-block">Bill To:</h3>
              <div className="space-y-1">
                 <p className="font-bold text-lg leading-none mb-1">{invoice.client_name}</p>
                 <p className="text-sm text-black/70 whitespace-pre-line leading-tight">{invoice.client_address}</p>
                 {invoice.client_pan && <p className="text-sm font-bold mt-2">PAN: {invoice.client_pan}</p>}
              </div>
           </div>
           <div className="flex flex-col justify-end text-right space-y-2 text-sm italic">
              <p><span className="font-bold not-italic">Due Date:</span> {format(new Date(invoice.due_date), 'dd-MM-yyyy')}</p>
              <p><span className="font-bold not-italic">Status:</span> <span className="uppercase">{invoice.status}</span></p>
           </div>
        </div>

        {/* Items Table */}
        <div className="flex-1">
           <table className="w-full border-collapse border border-black">
              <thead>
                 <tr className="bg-gray-100 text-xs font-black uppercase tracking-wider">
                    <th className="border border-black p-3 text-left w-12">SN</th>
                    <th className="border border-black p-3 text-left">Description</th>
                    <th className="border border-black p-3 text-center w-20">Qty</th>
                    <th className="border border-black p-3 text-right w-32">Rate ({company?.currency})</th>
                    <th className="border border-black p-3 text-right w-32">Amount ({company?.currency})</th>
                 </tr>
              </thead>
              <tbody>
                 {items.map((item, idx) => (
                    <tr key={item.id} className="text-sm">
                       <td className="border border-black p-3 text-center">{idx + 1}</td>
                       <td className="border border-black p-3 font-medium">{item.description}</td>
                       <td className="border border-black p-3 text-center">{item.quantity}</td>
                       <td className="border border-black p-3 text-right">{Number(item.rate).toLocaleString()}</td>
                       <td className="border border-black p-3 text-right font-bold">{Number(item.amount).toLocaleString()}</td>
                    </tr>
                 ))}
                 {/* Fill empty rows for aesthetics */}
                 {Array.from({ length: Math.max(0, 10 - items.length) }).map((_, i) => (
                    <tr key={`empty-${i}`} className="h-10">
                       <td className="border border-black p-3"></td>
                       <td className="border border-black p-3"></td>
                       <td className="border border-black p-3"></td>
                       <td className="border border-black p-3"></td>
                       <td className="border border-black p-3"></td>
                    </tr>
                 ))}
              </tbody>
           </table>
        </div>

        {/* Totals Section */}
        <div className="mt-8 flex justify-end">
           <div className="w-full max-w-[300px] border border-black overflow-hidden">
              <div className="flex justify-between p-3 border-b border-black text-sm">
                 <span className="font-bold">Subtotal:</span>
                 <span>{company?.currency} {Number(invoice.subtotal).toLocaleString()}</span>
              </div>
              <div className="flex justify-between p-3 border-b border-black text-sm italic">
                 <span>Discount:</span>
                 <span>- {Number(invoice.discount).toLocaleString()}</span>
              </div>
              <div className="flex justify-between p-3 bg-black text-white font-black text-lg">
                 <span className="uppercase tracking-tighter">Grand Total:</span>
                 <span>{company?.currency} {Number(invoice.total).toLocaleString()}</span>
              </div>
           </div>
        </div>

        {/* Footer Section */}
        <div className="mt-12 pt-12 flex justify-between items-end border-t border-black/10">
           <div className="text-[10px] text-black/40 italic">
              Generated by easyKhata - Simple Digital Bookkeeping
           </div>
           <div className="text-center w-48">
              <div className="border-b border-black w-full mb-2 h-12 flex items-end justify-center">
                 {/* Sign space */}
              </div>
              <p className="text-[10px] font-black uppercase tracking-wider">Authorised Signatory</p>
           </div>
        </div>

      </div>

      <style jsx global>{`
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
