import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../utils/api';
import {
  Calendar,
  UserCheck,
  UserX,
  Search,
  MessageCircle,
  Trash2,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';

export default function Attendance({ onRefreshStats }) {
  const { t } = useLanguage();
  const [attendances, setAttendances] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });

  // Fast Absence Form
  const [studentSearch, setStudentSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [reason, setReason] = useState('بدون عذر');

  const fetchAttendances = async () => {
    try {
      setLoading(true);
      const data = await api.getAttendances(selectedDate);
      setAttendances(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const data = await api.getStudents({ status: 'active' });
      setStudents(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchAttendances();
  }, [selectedDate]);

  useEffect(() => {
    fetchStudents();
  }, []);

  const filteredStudents = studentSearch.trim()
    ? students.filter(s => s.fullName.toLowerCase().includes(studentSearch.toLowerCase())).slice(0, 5)
    : [];

  const handleRecordAbsence = async (e) => {
    e.preventDefault();
    if (!selectedStudent) {
      alert('يرجى اختيار تلميذ من القائمة أولاً');
      return;
    }

    try {
      const firstSub = selectedStudent.subjects?.[0] || {};
      await api.createAttendance({
        studentId: selectedStudent._id,
        studentName: selectedStudent.fullName,
        level: selectedStudent.level,
        subject: firstSub.subject || '',
        teacher: firstSub.teacher || '',
        phone: selectedStudent.phone,
        date: selectedDate,
        reason
      });
      setSelectedStudent(null);
      setStudentSearch('');
      fetchAttendances();
      if (onRefreshStats) onRefreshStats();
    } catch (e) {
      alert('خطأ أثناء تسجيل الغياب: ' + e.message);
    }
  };

  const handleDeleteAttendance = async (id) => {
    try {
      await api.deleteAttendance(id);
      fetchAttendances();
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
            {t('navAttendance')}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            تسجيل غياب التلاميذ اليومي وإشعار أولياء الأمور فورياً عبر واتساب
          </p>
        </div>

        {/* Date Selector */}
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-xs">
          <Calendar className="w-4 h-4 text-teal-700" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="text-xs font-bold text-slate-800 outline-none"
          />
        </div>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 block">{t('absentToday')}</span>
          <span className="text-2xl font-black text-rose-600 block mt-1">
            {attendances.length} <span className="text-xs font-bold text-slate-500">تلميذ غائب</span>
          </span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 block">{t('presentToday')}</span>
          <span className="text-2xl font-black text-emerald-700 block mt-1">
            {Math.max(0, students.length - attendances.length)} <span className="text-xs font-bold text-slate-500">حاضر</span>
          </span>
        </div>

        <div className="col-span-2 sm:col-span-1 bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 block">نسبة الحضور</span>
          <span className="text-2xl font-black text-teal-700 block mt-1">
            {students.length > 0 ? Math.round(((students.length - attendances.length) / students.length) * 100) : 100}%
          </span>
        </div>
      </div>

      {/* Instant Absence Logger (matching video demo timestamp 06:42) */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs">
        <h3 className="text-sm font-extrabold text-slate-800 mb-3 flex items-center gap-2">
          <UserX className="w-4 h-4 text-rose-600" />
          <span>تسجيل غياب سريع:</span>
        </h3>

        <form onSubmit={handleRecordAbsence} className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Student Search & Select */}
            <div className="relative">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                اسم التلميذ الغائب *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={selectedStudent ? selectedStudent.fullName : studentSearch}
                  onChange={(e) => {
                    setSelectedStudent(null);
                    setStudentSearch(e.target.value);
                  }}
                  placeholder="ابحث عن التلميذ (مثال: طارق الحوجي)..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-teal-600 outline-none"
                />
                {selectedStudent && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedStudent(null);
                      setStudentSearch('');
                    }}
                    className="absolute left-2.5 top-2.5 text-xs text-rose-600 font-bold"
                  >
                    تغيير
                  </button>
                )}
              </div>

              {/* Autocomplete Dropdown */}
              {!selectedStudent && filteredStudents.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-20 py-1 divide-y divide-slate-100">
                  {filteredStudents.map((s) => (
                    <div
                      key={s._id}
                      onClick={() => {
                        setSelectedStudent(s);
                        setStudentSearch(s.fullName);
                      }}
                      className="p-2 hover:bg-teal-50 cursor-pointer text-xs"
                    >
                      <p className="font-bold text-slate-800">{s.fullName}</p>
                      <p className="text-[10px] text-slate-500">{s.level} • {s.phone}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Absence Reason */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('absenceReason')}
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-teal-600 outline-none font-semibold text-slate-800"
              >
                <option value="بدون عذر">{t('unjustified')}</option>
                <option value="شهادة طبية">{t('medicalCert')}</option>
                <option value="اتصال من الولي">{t('parentCall')}</option>
                <option value="ظروف عائلية">ظروف عائلية</option>
              </select>
            </div>

            {/* Submit Button */}
            <div className="flex items-end">
              <button
                type="submit"
                disabled={!selectedStudent}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-black transition shadow-sm flex items-center justify-center gap-2 ${
                  selectedStudent
                    ? 'bg-rose-600 hover:bg-rose-700 text-white'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                <UserX className="w-4 h-4" />
                <span>{t('recordAbsence')}</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Absences Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-800">
            لائحة الغائبين بتاريخ: <span className="text-teal-700 font-extrabold">{selectedDate}</span>
          </h3>
          <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full">
            {attendances.length} غياب مسجل
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-right">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3.5 w-10 text-center">#</th>
                <th className="p-3.5">{t('fullName')}</th>
                <th className="p-3.5">{t('level')}</th>
                <th className="p-3.5">{t('subject')} / الأستاذ</th>
                <th className="p-3.5">{t('phone')}</th>
                <th className="p-3.5 text-center">{t('absenceReason')}</th>
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
              ) : attendances.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-400">
                    <CheckCircle className="w-6 h-6 text-emerald-500 mx-auto mb-1" />
                    لا توجد أي غيابات مسجلة في هذا اليوم!
                  </td>
                </tr>
              ) : (
                attendances.map((a, idx) => (
                  <tr key={a._id} className="hover:bg-slate-50/70 transition">
                    <td className="p-3.5 text-center font-bold text-slate-400">{idx + 1}</td>
                    <td className="p-3.5 font-extrabold text-slate-900 text-sm">
                      {a.studentName}
                    </td>
                    <td className="p-3.5 text-slate-600 font-medium">
                      {a.level}
                    </td>
                    <td className="p-3.5 text-slate-600">
                      {a.subject ? `${a.subject} (${a.teacher})` : 'دروس المركز'}
                    </td>
                    <td className="p-3.5 font-mono text-slate-700 font-semibold" dir="ltr">
                      {a.phone}
                    </td>
                    <td className="p-3.5 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        a.reason === 'شهادة طبية'
                          ? 'bg-blue-100 text-blue-800'
                          : a.reason === 'اتصال من الولي'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {a.reason || 'بدون عذر'}
                      </span>
                    </td>
                    <td className="p-3.5 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {/* WhatsApp Parent Notification */}
                        <a
                          href={`https://wa.me/${a.phone?.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                            `السلام عليكم ورحمة الله، نخبركم بغياب ابنكم/ابنتكم ${a.studentName} عن حصة اليوم ${a.subject ? `في مادة ${a.subject}` : ''} بمركز أوميغا للدعم والتقوية. وشكراً.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 text-[11px] font-bold transition"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                          <span>إشعار الولي</span>
                        </a>

                        <button
                          onClick={() => handleDeleteAttendance(a._id)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition"
                          title="حذف الغياب"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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
    </div>
  );
}
