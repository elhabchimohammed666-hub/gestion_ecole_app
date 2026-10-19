import React, { useRef } from 'react';
import Modal from './Modal';
import { useLanguage } from '../context/LanguageContext';
import { Printer, Download, CheckCircle, Phone, Calendar, Hash, User, BookOpen } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function ReceiptModal({ isOpen, onClose, receiptData }) {
  const { t, isRTL } = useLanguage();
  const receiptRef = useRef(null);

  if (!receiptData) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    if (!receiptRef.current) return;
    try {
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 10, pdfWidth, pdfHeight);
      pdf.save(`Recu_${receiptData.receiptNumber || 'omega'}_${receiptData.studentName}.pdf`);
    } catch (e) {
      console.error('Erreur PDF:', e);
      window.print();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('viewReceipt')} maxWidth="max-w-xl">
      {/* Printable Receipt Paper */}
      <div 
        ref={receiptRef} 
        className="bg-white border-2 border-emerald-800/40 rounded-2xl overflow-hidden shadow-lg p-0 print:border-none print:shadow-none"
      >
        {/* Top Header Banner (exact match with video demo) */}
        <div className="bg-[#064e3b] text-white p-5 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl"></div>
          
          <div className="flex items-center justify-between mb-3">
            <div className="text-right">
              <span className="text-[11px] text-emerald-200 block">التاريخ:</span>
              <span className="text-xs font-bold text-amber-300">
                {receiptData.date ? new Date(receiptData.date).toLocaleDateString('ar-MA', { year: 'numeric', month: 'long', day: 'numeric' }) : '29 يناير 2026'}
              </span>
            </div>

            {/* Emblem Logo */}
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-400 to-amber-200 p-0.5 shadow-md flex items-center justify-center">
                <div className="w-full h-full bg-[#064e3b] rounded-full flex items-center justify-center text-amber-300 font-black text-2xl">
                  Ω
                </div>
              </div>
              <h2 className="text-sm font-black text-amber-300 mt-1">
                مركز أوميغا
              </h2>
              <p className="text-[10px] text-emerald-200">
                للدعم والتقوية واللغات
              </p>
            </div>

            <div className="text-left">
              <span className="text-[11px] text-emerald-200 block">رقم الوصل:</span>
              <span className="text-sm font-black text-white bg-emerald-800 px-2.5 py-0.5 rounded-md border border-emerald-700">
                {receiptData.receiptNumber || 'N5601'}
              </span>
            </div>
          </div>

          {/* Yellow Badge */}
          <div className="mt-2 inline-block bg-amber-400 text-slate-950 font-black text-sm px-6 py-1.5 rounded-md shadow-md tracking-wider">
            وصل الأداء
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          {/* Student Info Box */}
          <div className="bg-emerald-50/60 rounded-xl p-4 border border-emerald-100">
            <h4 className="text-xs font-bold text-emerald-900 mb-2.5 flex items-center gap-2 border-b border-emerald-200/60 pb-1.5">
              <User className="w-4 h-4 text-emerald-700" />
              <span>معلومات التلميذ</span>
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-500 block text-[11px]">اسم التلميذ:</span>
                <span className="font-extrabold text-slate-900 text-sm">{receiptData.studentName}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">المستوى الدراسي:</span>
                <span className="font-bold text-slate-800">{receiptData.level || 'البكالوريا'}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">رقم الهاتف:</span>
                <span className="font-bold text-slate-800" dir="ltr">{receiptData.phone || '06283701609'}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">شهر الأداء:</span>
                <span className="font-bold text-teal-800">{receiptData.month || 'يناير 2026'}</span>
              </div>
            </div>
          </div>

          {/* Subjects Table */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-700" />
              <span>المواد والأساتذة المشرفون:</span>
            </h4>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-xs text-right">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-2.5">المادة</th>
                    <th className="p-2.5">الأستاذ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {receiptData.subjects && receiptData.subjects.length > 0 ? (
                    receiptData.subjects.map((sub, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-2.5 font-bold text-emerald-900">{sub.subject}</td>
                        <td className="p-2.5 text-slate-600">{sub.teacher}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="p-2.5 font-bold text-emerald-900">دروس الدعم والتقوية</td>
                      <td className="p-2.5 text-slate-600">أساتذة المركز</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Amount Paid Box */}
          <div className="bg-gradient-to-r from-amber-50 to-amber-100/70 border border-amber-200 rounded-xl p-4 flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-amber-900 block">المبلغ المؤدى:</span>
              <span className="text-2xl font-black text-amber-800">
                {receiptData.amountPaid} <span className="text-sm font-bold">درهم</span>
              </span>
            </div>
            <div className="text-left">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-600 text-white shadow-xs">
                <CheckCircle className="w-4 h-4" />
                <span>مؤدى بالكامل</span>
              </span>
              {receiptData.remaining > 0 && (
                <p className="text-[11px] text-rose-700 font-bold mt-1">
                  المتبقي: {receiptData.remaining} درهم
                </p>
              )}
            </div>
          </div>

          {/* Stamp & Signature Area */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <div className="text-center">
              <p className="font-bold text-slate-700 mb-6">خاتم وتوقيع الإدارة</p>
              <div className="w-24 h-12 border border-dashed border-slate-300 rounded-lg flex items-center justify-center text-[10px] text-slate-400">
                طابع المركز
              </div>
            </div>
            <div className="text-left text-[11px] text-slate-400">
              <p>مركز أوميغا للدعم والتقوية</p>
              <p dir="ltr">الهاتف: 0705782737</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons (Print, Download PDF, Close) */}
      <div className="mt-5 flex items-center justify-end gap-3 print:hidden">
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold transition"
        >
          <Printer className="w-4 h-4" />
          <span>{t('print')}</span>
        </button>

        <button
          onClick={handleDownloadPdf}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition shadow-sm"
        >
          <Download className="w-4 h-4" />
          <span>{t('downloadPdf')}</span>
        </button>

        <button
          onClick={onClose}
          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
        >
          {t('cancel')}
        </button>
      </div>
    </Modal>
  );
}
