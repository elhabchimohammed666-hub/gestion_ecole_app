import React, { useRef } from 'react';
import Modal from './Modal';
import { useLanguage } from '../context/LanguageContext';
import { Printer, Download, Users, Phone, Calendar } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function TeacherListModal({ isOpen, onClose, teacherData }) {
  const { t } = useLanguage();
  const printRef = useRef(null);

  if (!teacherData) return null;

  const { teacher, students = [], totalCount = 0 } = teacherData;

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
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 10, pdfWidth, pdfHeight);
      pdf.save(`Liste_Eleves_${teacher?.fullName || 'prof'}.pdf`);
    } catch (e) {
      console.error('Erreur PDF:', e);
      window.print();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('downloadTeacherList')} maxWidth="max-w-3xl">
      <div 
        ref={printRef}
        className="bg-white border-2 border-emerald-800/40 rounded-2xl overflow-hidden shadow-lg p-0 print:border-none print:shadow-none"
      >
        {/* Top Header Banner matching video */}
        <div className="bg-[#064e3b] text-white p-5 text-center relative">
          <div className="flex items-center justify-between mb-2">
            <div className="text-right">
              <span className="text-[11px] text-emerald-200 block">التاريخ:</span>
              <span className="text-xs font-bold text-amber-300">
                {new Date().toLocaleDateString('ar-MA', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>

            {/* Emblem */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-400 to-amber-200 p-0.5 shadow-md flex items-center justify-center">
                <div className="w-full h-full bg-[#064e3b] rounded-full flex items-center justify-center text-amber-300 font-black text-xl">
                  Ω
                </div>
              </div>
              <h2 className="text-sm font-black text-amber-300 mt-1">مركز أوميغا للدعم والتقوية</h2>
            </div>

            <div className="text-left">
              <span className="text-[11px] text-emerald-200 block">عدد التلاميذ:</span>
              <span className="text-sm font-black text-slate-900 bg-amber-400 px-2.5 py-0.5 rounded-full">
                {totalCount} تلميذ
              </span>
            </div>
          </div>

          <div className="mt-2 inline-block bg-amber-400 text-slate-950 font-black text-sm px-6 py-1 rounded-md shadow-md">
            قائمة التلاميذ
          </div>

          <div className="mt-2 text-xs text-emerald-100 font-medium">
            مجموعات الأستاذ: <span className="font-bold text-amber-300">{teacher?.fullName}</span> | المادة: <span className="font-bold text-white">{teacher?.subject}</span>
          </div>
        </div>

        {/* Student List Table */}
        <div className="p-5">
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-xs text-right">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3 w-12 text-center">#</th>
                  <th className="p-3">اسم التلميذ</th>
                  <th className="p-3">المستوى الدراسي</th>
                  <th className="p-3">رقم الهاتف</th>
                  <th className="p-3 text-center">تاريخ التسجيل</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {students.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-6 text-center text-slate-500">
                      لا يوجد تلاميذ مسجلين حالياً مع هذا الأستاذ
                    </td>
                  </tr>
                ) : (
                  students.map((s, idx) => (
                    <tr key={s._id || idx} className="hover:bg-slate-50">
                      <td className="p-3 text-center font-bold text-slate-400">{idx + 1}</td>
                      <td className="p-3 font-bold text-slate-900">{s.fullName}</td>
                      <td className="p-3 text-slate-600">{s.level}</td>
                      <td className="p-3 font-mono font-medium text-slate-700" dir="ltr">{s.phone}</td>
                      <td className="p-3 text-center text-slate-500 text-[11px]">
                        {s.registrationDate ? new Date(s.registrationDate).toLocaleDateString('fr-FR') : '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer note */}
          <div className="mt-4 flex items-center justify-between text-xs text-slate-400 border-t border-slate-100 pt-3">
            <span>مركز أوميغا للدعم المدرسي والتقوية واللغات</span>
            <span dir="ltr">الهاتف: 0705782737</span>
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
