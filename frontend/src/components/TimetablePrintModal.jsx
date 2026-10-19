import React, { useRef } from 'react';
import Modal from './Modal';
import { useLanguage } from '../context/LanguageContext';
import { Printer, Download, Calendar } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function TimetablePrintModal({ isOpen, onClose, sessions = [] }) {
  const { t } = useLanguage();
  const printRef = useRef(null);

  const days = ['الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت', 'الأحد'];

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    if (!printRef.current) return;
    try {
      const canvas = await html2canvas(printRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('l', 'mm', 'a4'); // Paysage
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 10, pdfWidth, pdfHeight);
      pdf.save('Emploi_du_temps_Omega.pdf');
    } catch (e) {
      console.error('Erreur PDF:', e);
      window.print();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('weeklyTimetable')} maxWidth="max-w-5xl">
      <div 
        ref={printRef}
        className="bg-white border-2 border-emerald-800/40 rounded-2xl overflow-hidden shadow-lg p-0 print:border-none print:shadow-none"
      >
        {/* Header */}
        <div className="bg-[#064e3b] text-white p-5 text-center relative">
          <div className="flex items-center justify-between">
            <span className="text-xs text-amber-300 font-bold">
              الموسم الدراسي 2025 - 2026
            </span>
            <div className="flex flex-col items-center">
              <h2 className="text-lg font-black text-amber-300">مركز أوميغا للدعم والتقوية واللغات</h2>
              <div className="mt-1 inline-block bg-amber-400 text-slate-950 font-black text-xs px-4 py-0.5 rounded shadow">
                جدول الحصص الأسبوعي الرسمي
              </div>
            </div>
            <span className="text-xs text-emerald-200" dir="ltr">0705782737</span>
          </div>
        </div>

        {/* Weekly Grid */}
        <div className="p-4 overflow-x-auto">
          <div className="grid grid-cols-7 gap-2 min-w-[750px]">
            {days.map((day) => {
              const daySessions = sessions.filter(s => s.day === day);
              return (
                <div key={day} className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden flex flex-col">
                  <div className="bg-emerald-800 text-white text-center py-2 text-xs font-bold border-b border-emerald-900">
                    {day}
                  </div>
                  <div className="p-2 space-y-2 flex-1 min-h-[220px]">
                    {daySessions.length === 0 ? (
                      <p className="text-[10px] text-slate-400 text-center pt-8">لا توجد حصص</p>
                    ) : (
                      daySessions.map((session) => (
                        <div
                          key={session._id}
                          className="rounded-lg p-2 text-white shadow-xs text-xs relative overflow-hidden"
                          style={{ backgroundColor: session.color || '#0f766e' }}
                        >
                          <div className="font-extrabold text-[11px] truncate">{session.subject}</div>
                          <div className="text-[10px] opacity-90 truncate">{session.teacher}</div>
                          <div className="text-[9px] bg-black/20 rounded px-1 py-0.5 mt-1 inline-block font-mono">
                            {session.startTime} - {session.endTime}
                          </div>
                          <div className="text-[9px] opacity-80 mt-0.5">
                            {session.level} • {session.room}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-slate-400 border-t border-slate-100 pt-3">
            <span>مركز أوميغا - يرجى الالتزام بمواعيد الحصص المقررة</span>
            <span>طبع بتاريخ: {new Date().toLocaleDateString('fr-FR')}</span>
          </div>
        </div>
      </div>

      {/* Buttons */}
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
