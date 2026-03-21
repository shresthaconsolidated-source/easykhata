'use client';

import React, { useState } from 'react';
import { Printer, Download, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const numberToWords = (num: number) => {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];

  const convertThreeDigits = (n: number): string => {
    let res = '';
    if (n >= 100) {
      res += ones[Math.floor(n / 100)] + ' Hundred ';
      n %= 100;
    }
    if (n >= 10 && n < 20) {
      res += teens[n - 10];
    } else {
      res += tens[Math.floor(n / 10)];
      if (n % 10 > 0) {
        if (res.length > 0) res += ' ';
        res += ones[n % 10];
      }
    }
    return res.trim();
  };

  if (num === 0) return 'Zero';

  let result = '';
  if (num >= 10000000) {
    result += convertThreeDigits(Math.floor(num / 10000000)) + ' Crore ';
    num %= 10000000;
  }
  if (num >= 100000) {
    result += convertThreeDigits(Math.floor(num / 100000)) + ' Lakh ';
    num %= 100000;
  }
  if (num >= 1000) {
    result += convertThreeDigits(Math.floor(num / 1000)) + ' Thousand ';
    num %= 1000;
  }
  result += convertThreeDigits(num);

  return result.trim();
};

export default function PublicInvoiceClient({ invoice, items, company }: { invoice: any, items: any[], company: any }) {
  const [downloading, setDownloading] = useState(false);

  const loadScript = (src: string) => {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) return resolve(true);
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  };

  const handleDownloadPDF = async () => {
    if (downloading) return;
    setDownloading(true);
    
    try {
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js');
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
      
      const html2canvas = (window as any).html2canvas;
      const jsPDF = (window as any).jspdf.jsPDF;

      const element = document.getElementById('invoice-document');
      if (!element) throw new Error('Document not found');
      
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      const pdfBlob = pdf.output('blob');
      
      const fileName = `Invoice-${invoice.invoice_number}.pdf`;
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
    } catch (err) {
      console.error('PDF generation error:', err);
      alert('Unable to generate PDF dynamically. Please try the "Print" button instead and save as PDF.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] md:p-8 print:p-0">
      <div className="max-w-4xl mx-auto mb-8 flex items-center justify-end print:hidden">
        <div className="flex gap-3">
          <button 
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="bg-[#1a5f7a] hover:bg-[#154d63] text-white px-5 py-2.5 rounded-2xl flex items-center gap-2 font-bold transition-all shadow-lg active:scale-95 disabled:opacity-75 disabled:cursor-not-allowed"
          >
            {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {downloading ? 'Preparing PDF...' : 'Download PDF'}
          </button>
          <button 
            onClick={() => window.print()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-2xl flex items-center gap-2 font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95"
          >
            <Printer className="w-5 h-5" /> Print Invoice
          </button>
        </div>
      </div>

      <div className="w-full overflow-x-auto pb-12 custom-scrollbar print:overflow-visible">
        <div id="invoice-document" className="max-w-[850px] min-w-[800px] md:min-w-[850px] mx-auto bg-white text-[#1a1f36] shadow-[0_64px_128px_-16px_rgba(0,0,0,0.1)] min-h-[1100px] flex flex-col font-sans print:shadow-none print:p-0 print:mx-0 print:w-full overflow-hidden rounded-sm">
        
        <div className="bg-[#1a5f7a] p-12 text-white flex justify-between items-center">
           <div>
              <h1 className="text-6xl font-black tracking-tight uppercase opacity-90">Invoice</h1>
           </div>
           <div className="text-right space-y-1">
              <h2 className="text-xl font-bold">{company?.name}</h2>
              <div className="text-sm opacity-80 leading-relaxed font-medium">
                 <p>{company?.address}</p>
                 {company?.pan && <p>PAN: {company.pan}</p>}
                 {company?.email && <p>{company.email}</p>}
              </div>
           </div>
        </div>

        <div className="p-16 flex-1 flex flex-col">
          <div className="grid grid-cols-2 gap-20 mb-20">
             <div className="space-y-4">
                <div className="space-y-1">
                   <p className="text-[11px] font-black uppercase tracking-widest text-[#a3acb9]">Invoice Details</p>
                   <div className="grid grid-cols-[100px_1fr] text-sm gap-y-1">
                      <span className="font-bold text-[#4f566b]">Invoice No.</span>
                      <span className="font-bold text-[#1a1f36]">{invoice.invoice_number}</span>
                      <span className="font-bold text-[#4f566b]">Date of Issue</span>
                      <span className="font-medium text-[#1a1f36]">{format(new Date(invoice.date), 'MMMM dd, yyyy')}</span>
                      <span className="font-bold text-[#4f566b]">Due Date</span>
                      <span className="font-medium text-[#1a1f36]">{format(new Date(invoice.due_date), 'MMMM dd, yyyy')}</span>
                   </div>
                </div>
             </div>
             
             <div className="text-right space-y-4">
                <div className="space-y-2">
                   <p className="text-[11px] font-black uppercase tracking-widest text-[#a3acb9]">Bill To</p>
                   <div className="text-sm space-y-1">
                      <p className="font-black text-xl text-[#1a1f36] leading-none mb-1">{invoice.client_name}</p>
                      <p className="text-[#4f566b] font-medium whitespace-pre-line leading-relaxed">{invoice.client_address}</p>
                      {invoice.client_pan && <p className="text-[#4f566b] font-bold mt-2 text-xs">PAN: {invoice.client_pan}</p>}
                   </div>
                </div>
             </div>
          </div>

          <div className="flex-1">
             <table className="w-full border-collapse">
                <thead>
                   <tr className="bg-[#f8fafc] text-[11px] font-black uppercase tracking-widest text-[#4f566b] border-y-2 border-[#1a5f7a]/20">
                      <th className="py-4 px-6 text-left w-16">Item</th>
                      <th className="py-4 px-6 text-left">Description</th>
                      <th className="py-4 px-6 text-center w-24">Qty</th>
                      <th className="py-4 px-6 text-right w-32">Rate</th>
                      <th className="py-4 px-6 text-right w-32">Amount</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9]">
                   {items.map((item, index) => (
                      <tr key={item.id} className={cn("text-sm group hover:bg-[#f8fafc]/50", index % 2 === 1 && "bg-[#f8fafc]/30")}>
                         <td className="py-5 px-6 font-bold text-[#a3acb9]">{index + 1}</td>
                         <td className="py-5 px-6 font-semibold text-[#1a1f36]">{item.description}</td>
                         <td className="py-5 px-6 text-center text-[#4f566b] font-medium">{item.quantity}</td>
                         <td className="py-5 px-6 text-right text-[#4f566b] font-medium">{Number(item.rate).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                         <td className="py-5 px-6 text-right font-black text-[#1a1f36]">{Number(item.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>

          <div className="mt-12 pt-8 border-t-2 border-[#f1f5f9]">
             <div className="flex items-start justify-between">
                <div className="max-w-[450px]">
                   <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#a3acb9] mb-1">In Words</p>
                   <p className="text-sm font-bold text-[#1a5f7a] italic leading-tight">
                      {company?.currency} {numberToWords(Math.floor(invoice.total))} Only
                   </p>
                </div>

                <div className="w-full max-w-[320px] space-y-4">
                   <div className="flex justify-between text-sm text-[#4f566b] font-bold px-6">
                      <span>Subtotal</span>
                      <span className="text-[#1a1f36] font-black">{company?.currency} {Number(invoice.subtotal).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                   </div>
                   {Number(invoice.discount) > 0 && (
                     <div className="flex justify-between text-sm text-emerald-600 font-bold px-6">
                        <span>Discount</span>
                        <span>- {Number(invoice.discount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                     </div>
                   )}
                   <div className="flex justify-between items-center py-4 border-t border-[#f1f5f9] px-6">
                      <span className="text-[11px] font-black uppercase tracking-widest text-[#1a5f7a]">Amount Due</span>
                      <span className="text-2xl font-black text-[#1a5f7a] tracking-tight">
                        {company?.currency} {Number(invoice.total).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                   </div>
                </div>
             </div>
          </div>
        </div>

        <div className="bg-[#1a5f7a] p-8 text-white text-center">
           <p className="text-sm font-black uppercase tracking-widest opacity-90">Thank you for your business!</p>
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
          @page { margin: 20mm; }
        }
      `}</style>
    </div>
  );
}
