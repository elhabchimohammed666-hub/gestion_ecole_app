import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../utils/api';
import Modal from '../components/Modal';
import {
  UserX,
  RotateCcw,
  Trash2,
  Calendar,
  AlertCircle,
  CheckCircle,
  HelpCircle
} from 'lucide-react';

export default function DepartedStudents({ onRefreshStats }) {
  const { t } = useLanguage();
  const [departedStudents, setDepartedStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Re-enroll Modal
  const [showReEnrollModal, setShowReEnrollModal] = useState(false);
  const [activeStudent, setActiveStudent] = useState(null);

  const fetchDeparted = async () => {
    try {
      setLoading(true);
      const data = await api.getDepartedStudents();
      setDepartedStudents(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeparted();
  }, []);

  const handleConfirmReEnroll = async () => {
    if (!activeStudent) return;
    try {
      await api.reEnrollStudent(activeStudent._id);
      setShowReEnrollModal(false);
      fetchDeparted();
      if (onRefreshStats) onRefreshStats();
    } catch (e) {
      alert('خطأ أثناء إعادة التسجيل: ' + e.message);
    }
  };

  const handleDeletePermanent = async (id) => {
    if (!window.confirm('هل أنت متأكد من الحذف النهائي لسجل هذا التلميذ؟')) return;
    try {
      await api.deleteStudent(id);
      fetchDeparted();
      if (onRefreshStats) onRefreshStats();
    } catch (e) {
      alert('خطأ أثناء الحذف: ' + e.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
            {t('navDeparted')}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            سجل التلاميذ الذين غادروا المركز مع إمكانية استرجاعهم وإعادة تفعيل تسجيلهم
          </p>
        </div>

        <div className="px-3.5 py-1.5 bg-amber-50 text-amber-900 border border-amber-200 rounded-xl text-xs font-bold">
          {departedStudents.length} تلميذ في قائمة المغادرين
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-right">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3.5 w-10 text-center">#</th>
                <th className="p-3.5">{t('fullName')}</th>
                <th className="p-3.5">{t('level')}</th>
                <th className="p-3.5">{t('phone')}</th>
                <th className="p-3.5">{t('departureDate')}</th>
                <th className="p-3.5">{t('departureReason')}</th>
                <th className="p-3.5 text-center">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-400">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-700 mx-auto mb-2"></div>
                    {t('loading')}
                  </td>
                </tr>
              ) : departedStudents.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-400">
                    <CheckCircle className="w-6 h-6 text-emerald-500 mx-auto mb-1" />
                    لا يوجد تلاميذ في قائمة المغادرين حالياً!
                  </td>
                </tr>
              ) : (
                departedStudents.map((s, idx) => (
                  <tr key={s._id} className="hover:bg-slate-50/70 transition">
                    <td className="p-3.5 text-center font-bold text-slate-400">{idx + 1}</td>
                    <td className="p-3.5 font-extrabold text-slate-900 text-sm">
                      {s.fullName}
                    </td>
                    <td className="p-3.5 text-slate-600 font-medium">
                      {s.level}
                    </td>
                    <td className="p-3.5 font-mono text-slate-700 font-semibold" dir="ltr">
                      {s.phone}
                    </td>
                    <td className="p-3.5 text-slate-500">
                      {s.departureDate ? new Date(s.departureDate).toLocaleDateString('ar-MA') : 'يناير 2026'}
                    </td>
                    <td className="p-3.5">
                      <span className="inline-block bg-slate-100 text-slate-700 font-medium px-2.5 py-0.5 rounded-md text-[11px]">
                        {s.departureReason || 'مغادرة المركز'}
                      </span>
                    </td>
                    <td className="p-3.5 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {/* Re-enroll button matching video */}
                        <button
                          onClick={() => {
                            setActiveStudent(s);
                            setShowReEnrollModal(true);
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-xs transition"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>{t('reEnrollStudent')}</span>
                        </button>

                        {/* Permanent Delete */}
                        <button
                          onClick={() => handleDeletePermanent(s._id)}
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition"
                          title={t('deletePermanent')}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Re-Enroll Confirmation Modal */}
      <Modal
        isOpen={showReEnrollModal}
        onClose={() => setShowReEnrollModal(false)}
        title={t('reEnrollStudent')}
        maxWidth="max-w-md"
      >
        <div className="space-y-4 text-center py-2">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
            <RotateCcw className="w-6 h-6" />
          </div>

          <h3 className="text-sm font-extrabold text-slate-900">
            تأكيد إعادة تسجيل التلميذ: <span className="text-teal-700">{activeStudent?.fullName}</span>
          </h3>

          <p className="text-xs text-slate-500">
            {t('confirmReEnroll')}
          </p>

          <div className="pt-3 flex items-center justify-center gap-3">
            <button
              onClick={() => setShowReEnrollModal(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
            >
              {t('cancel')}
            </button>
            <button
              onClick={handleConfirmReEnroll}
              className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition shadow-sm"
            >
              {t('confirm')}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
