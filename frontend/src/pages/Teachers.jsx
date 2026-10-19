import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../utils/api';
import Modal from '../components/Modal';
import {
  Users,
  UserPlus,
  BookOpen,
  Phone,
  Clock,
  Download,
  Trash2,
  Edit,
  GraduationCap,
  Printer
} from 'lucide-react';

export default function Teachers({ onOpenTeacherList }) {
  const { t } = useLanguage();
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add / Edit Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeTeacher, setActiveTeacher] = useState(null);

  const [formData, setFormData] = useState({
    fullName: '',
    subject: 'الرياضيات',
    phone: '06',
    hoursPerWeek: 4,
    hourlyRate: 180,
    percentage: 50,
    notes: ''
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
    'الاقتصاد والمحاسبة',
    'اللغة الإسبانية',
    'اللغة الألمانية'
  ];

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const data = await api.getTeachers();
      setTeachers(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleOpenAdd = () => {
    setFormData({
      fullName: '',
      subject: 'الرياضيات',
      phone: '06',
      hoursPerWeek: 4,
      hourlyRate: 180,
      percentage: 50,
      notes: ''
    });
    setShowAddModal(true);
  };

  const handleOpenEdit = (tchr) => {
    setActiveTeacher(tchr);
    setFormData({
      fullName: tchr.fullName,
      subject: tchr.subject,
      phone: tchr.phone,
      hoursPerWeek: tchr.hoursPerWeek || 4,
      hourlyRate: tchr.hourlyRate || 180,
      percentage: tchr.percentage || 50,
      notes: tchr.notes || ''
    });
    setShowEditModal(true);
  };

  const handleSaveTeacher = async (e) => {
    e.preventDefault();
    try {
      if (showAddModal) {
        await api.createTeacher(formData);
      } else if (showEditModal && activeTeacher) {
        await api.updateTeacher(activeTeacher._id, formData);
      }
      setShowAddModal(false);
      setShowEditModal(false);
      fetchTeachers();
    } catch (e) {
      alert('خطأ أثناء حفظ بيانات الأستاذ: ' + e.message);
    }
  };

  const handleDeleteTeacher = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الأستاذ؟')) return;
    try {
      await api.deleteTeacher(id);
      fetchTeachers();
    } catch (e) {
      alert('خطأ أثناء الحذف: ' + e.message);
    }
  };

  const handleDownloadTeacherStudents = async (teacher) => {
    try {
      const data = await api.getTeacherStudents(teacher._id);
      onOpenTeacherList(data);
    } catch (e) {
      alert('خطأ في جلب بيانات تلاميذ الأستاذ: ' + e.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
            {t('navTeachers')}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            متابعة أساتذة المركز، الحصص الأسبوعية ولوائح التلاميذ المشرفين عليهم
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-extrabold shadow-md transition transform hover:scale-[1.02]"
        >
          <UserPlus className="w-4 h-4" />
          <span>{t('addTeacher')}</span>
        </button>
      </div>

      {/* Teachers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-full py-12 text-center text-slate-400">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-700 mx-auto mb-2"></div>
            {t('loading')}
          </div>
        ) : teachers.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400">
            لا يوجد أساتذة مسجلون حالياً
          </div>
        ) : (
          teachers.map((teacher) => (
            <div
              key={teacher._id}
              className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-100 text-teal-800 flex items-center justify-center font-black text-lg shadow-xs">
                      {teacher.fullName.slice(0, 2)}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900">{teacher.fullName}</h3>
                      <span className="inline-block mt-0.5 px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                        {teacher.subject}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(teacher)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
                      title={t('edit')}
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteTeacher(teacher._id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                      title={t('delete')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <Phone className="w-3.5 h-3.5" />
                      <span>{t('phone')}:</span>
                    </span>
                    <span className="font-mono font-bold text-slate-800" dir="ltr">{teacher.phone}</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{t('hoursPerWeek')}:</span>
                    </span>
                    <span className="font-extrabold text-slate-800">{teacher.hoursPerWeek || 4} ساعات</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <GraduationCap className="w-3.5 h-3.5" />
                      <span>{t('enrolledStudentsCount')}:</span>
                    </span>
                    <span className="font-black text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full">
                      {teacher.studentCount || 0} تلميذ
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button: Download Teacher Student Roster PDF matching video */}
              <div className="mt-5 pt-3 border-t border-slate-100">
                <button
                  onClick={() => handleDownloadTeacherStudents(teacher)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-extrabold transition shadow-xs"
                >
                  <Download className="w-4 h-4" />
                  <span>{t('downloadTeacherList')} (PDF)</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Teacher Modal */}
      <Modal
        isOpen={showAddModal || showEditModal}
        onClose={() => {
          setShowAddModal(false);
          setShowEditModal(false);
        }}
        title={showAddModal ? t('addTeacher') : 'تعديل بيانات الأستاذ'}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSaveTeacher} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              اسم الأستاذ الكامل *
            </label>
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="مثال: أستاذ عادل السعدي"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-teal-600 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t('subject')} *
            </label>
            <select
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-teal-600 outline-none font-semibold text-slate-800"
            >
              {subjectsList.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t('phone')} *
            </label>
            <input
              type="text"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="06XXXXXXXX"
              dir="ltr"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-teal-600 outline-none font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ساعات العمل / أسبوع
              </label>
              <input
                type="number"
                min="1"
                max="40"
                value={formData.hoursPerWeek}
                onChange={(e) => setFormData({ ...formData, hoursPerWeek: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-teal-600 outline-none font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                التعويض بالساعة ({t('currency')})
              </label>
              <input
                type="number"
                min="0"
                step="10"
                value={formData.hourlyRate}
                onChange={(e) => setFormData({ ...formData, hourlyRate: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-teal-600 outline-none font-bold"
              />
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
