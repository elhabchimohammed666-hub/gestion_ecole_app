import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../utils/api';
import Modal from '../components/Modal';
import {
  Calendar,
  Clock,
  Plus,
  Download,
  Trash2,
  Edit,
  User,
  BookOpen,
  MapPin,
  Printer
} from 'lucide-react';

export default function Timetable({ onOpenTimetablePrint }) {
  const { t } = useLanguage();
  const [sessions, setSessions] = useState([]);
  const [teacherHours, setTeacherHours] = useState({});
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeSession, setActiveSession] = useState(null);

  const days = ['الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت', 'الأحد'];

  const [formData, setFormData] = useState({
    subject: 'الرياضيات',
    teacher: 'أستاذ عادل السعدي',
    level: 'البكالوريا',
    day: 'الإثنين',
    startTime: '16:00',
    endTime: '18:00',
    room: 'قاعة 1',
    color: '#0f766e'
  });

  const subjectsList = [
    'الرياضيات',
    'الفيزياء والكيمياء',
    'علوم الحياة والأرض',
    'اللغة الفرنسية',
    'اللغة الإنجليزية',
    'الفلسفة',
    'اللغة العربية',
    'الإعلاميات والبرمجة',
    'الاقتصاد والمحاسبة'
  ];

  const levelsList = [
    'البكالوريا',
    'الأولى باك',
    'الثالثة إعدادي',
    'الثانية إعدادي',
    'الأولى إعدادي',
    'لغات للكبار'
  ];

  const colorsList = [
    { label: 'أخضر تيل', value: '#0f766e' },
    { label: 'أزرق سماوي', value: '#0284c7' },
    { label: 'بنفسجي', value: '#7c3aed' },
    { label: 'كهرماني', value: '#d97706' },
    { label: 'أخضر زمردي', value: '#059669' },
    { label: 'أحمر قرمزي', value: '#dc2626' }
  ];

  const fetchTimetable = async () => {
    try {
      setLoading(true);
      const data = await api.getTimetable();
      setSessions(data.sessions || []);
      setTeacherHours(data.teacherHours || {});
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeachers = async () => {
    try {
      const data = await api.getTeachers();
      setTeachers(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchTimetable();
    fetchTeachers();
  }, []);

  const handleOpenAdd = () => {
    setFormData({
      subject: 'الرياضيات',
      teacher: teachers[0]?.fullName || 'أستاذ عادل السعدي',
      level: 'البكالوريا',
      day: 'الإثنين',
      startTime: '16:00',
      endTime: '18:00',
      room: 'قاعة 1',
      color: '#0f766e'
    });
    setShowAddModal(true);
  };

  const handleOpenEdit = (session) => {
    setActiveSession(session);
    setFormData({
      subject: session.subject,
      teacher: session.teacher,
      level: session.level,
      day: session.day,
      startTime: session.startTime,
      endTime: session.endTime,
      room: session.room || 'قاعة 1',
      color: session.color || '#0f766e'
    });
    setShowEditModal(true);
  };

  const handleSaveSession = async (e) => {
    e.preventDefault();
    try {
      if (showAddModal) {
        await api.createSession(formData);
      } else if (showEditModal && activeSession) {
        await api.updateSession(activeSession._id, formData);
      }
      setShowAddModal(false);
      setShowEditModal(false);
      fetchTimetable();
    } catch (e) {
      alert('خطأ أثناء حفظ الحصة: ' + e.message);
    }
  };

  const handleDeleteSession = async (id) => {
    if (!window.confirm('هل تود بالتأكيد حذف هذه الحصة؟')) return;
    try {
      await api.deleteSession(id);
      fetchTimetable();
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
            {t('navTimetable')}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            جدول الحصص الأسبوعي وتوزيع الساعات على الأساتذة والقاعات
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onOpenTimetablePrint(sessions)}
            className="flex items-center gap-2 px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-black shadow-md transition"
          >
            <Download className="w-4 h-4" />
            <span>تحميل وطباعة الجدول (PDF)</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-extrabold shadow-md transition"
          >
            <Plus className="w-4 h-4" />
            <span>{t('addSession')}</span>
          </button>
        </div>
      </div>

      {/* Teachers Hours Cards at Top (matching video demo timestamp 05:46) */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs">
        <h3 className="text-xs font-extrabold text-slate-700 mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4 text-teal-700" />
          <span>ساعات التدريس الأسبوعية لكل أستاذ:</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {Object.entries(teacherHours).map(([teacherName, hours]) => (
            <div key={teacherName} className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-center">
              <span className="text-[11px] font-bold text-slate-800 block truncate">
                {teacherName}
              </span>
              <span className="text-xs font-black text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full inline-block mt-1">
                {hours} ساعات / أسبوع
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Visual Weekly Grid (الجدول الأسبوعي) */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs overflow-hidden">
        <h3 className="text-sm font-extrabold text-slate-800 mb-4 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-teal-700" />
          <span>الجدول الأسبوعي التفاعلي:</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
          {days.map((day) => {
            const daySessions = sessions.filter(s => s.day === day);
            return (
              <div key={day} className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden flex flex-col">
                <div className="bg-teal-800 text-white text-center py-2 text-xs font-bold">
                  {day}
                </div>
                <div className="p-2 space-y-2 flex-1 min-h-[180px]">
                  {daySessions.length === 0 ? (
                    <p className="text-[10px] text-slate-400 text-center pt-8">فارغ</p>
                  ) : (
                    daySessions.map((s) => (
                      <div
                        key={s._id}
                        onClick={() => handleOpenEdit(s)}
                        className="rounded-xl p-2.5 text-white shadow-xs text-xs cursor-pointer hover:opacity-90 transition relative group"
                        style={{ backgroundColor: s.color || '#0f766e' }}
                      >
                        <div className="font-black text-xs truncate">{s.subject}</div>
                        <div className="text-[10px] opacity-90 truncate">{s.teacher}</div>
                        <div className="text-[10px] bg-black/20 rounded px-1.5 py-0.5 mt-1 inline-block font-mono">
                          {s.startTime} - {s.endTime}
                        </div>
                        <div className="text-[9px] opacity-80 mt-1">
                          {s.level} • {s.room}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sessions List Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-800">قائمة الحصص المبرمجة</h3>
          <span className="text-xs font-bold text-slate-500">{sessions.length} حصة</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-right">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3">اليوم</th>
                <th className="p-3">المادة</th>
                <th className="p-3">الأستاذ</th>
                <th className="p-3">المستوى</th>
                <th className="p-3 text-center">التوقيت</th>
                <th className="p-3">القاعة</th>
                <th className="p-3 text-center">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {sessions.map((s) => (
                <tr key={s._id} className="hover:bg-slate-50">
                  <td className="p-3 font-extrabold text-teal-900">{s.day}</td>
                  <td className="p-3 font-bold text-slate-900">{s.subject}</td>
                  <td className="p-3 text-slate-700">{s.teacher}</td>
                  <td className="p-3 text-slate-500">{s.level}</td>
                  <td className="p-3 text-center font-mono font-bold text-teal-700" dir="ltr">
                    {s.startTime} - {s.endTime}
                  </td>
                  <td className="p-3 text-slate-600">{s.room}</td>
                  <td className="p-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(s)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteSession(s._id)}
                        className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Session Modal */}
      <Modal
        isOpen={showAddModal || showEditModal}
        onClose={() => {
          setShowAddModal(false);
          setShowEditModal(false);
        }}
        title={showAddModal ? t('addSession') : t('editSession')}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSaveSession} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">{t('subject')} *</label>
            <select
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none font-medium"
            >
              {subjectsList.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">{t('teacher')} *</label>
            <select
              value={formData.teacher}
              onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none font-medium text-slate-700"
            >
              {teachers.map((t) => (
                <option key={t._id} value={t.fullName}>{t.fullName} ({t.subject})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">{t('level')} *</label>
              <select
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none"
              >
                {levelsList.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">{t('dayOfWeek')} *</label>
              <select
                value={formData.day}
                onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none font-bold"
              >
                {days.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">{t('startTime')} *</label>
              <input
                type="time"
                required
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">{t('endTime')} *</label>
              <input
                type="time"
                required
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">{t('room')}</label>
              <input
                type="text"
                value={formData.room}
                onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                placeholder="قاعة 1"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">اللون التمييزي</label>
              <select
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none"
              >
                {colorsList.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                setShowAddModal(false);
                setShowEditModal(false);
              }}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-extrabold shadow-md transition"
            >
              {t('save')}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
