import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../utils/api';
import Modal from '../components/Modal';
import {
  Search,
  UserPlus,
  Filter,
  Edit,
  UserX,
  Trash2,
  Phone,
  BookOpen,
  GraduationCap,
  Plus,
  X,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

export default function Students({ onRefreshStats }) {
  const { t } = useLanguage();
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDepartModal, setShowDepartModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activeStudent, setActiveStudent] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    level: 'البكالوريا',
    phone: '',
    monthlyFee: 500,
    subjects: [{ subject: 'الرياضيات', teacher: 'أستاذ عادل السعدي', fee: 250 }],
    notes: ''
  });

  const [departureReason, setDepartureReason] = useState('انتقال إلى مدينة أخرى');

  const levelsList = [
    'البكالوريا',
    'البكالوريا - علوم رياضية',
    'البكالوريا - علوم فيزيائية',
    'البكالوريا - علوم اقتصادية',
    'الأولى باك',
    'الأولى باك - علوم تجريبية',
    'الثالثة إعدادي',
    'الثانية إعدادي',
    'الأولى إعدادي',
    'السادس ابتدائي',
    'دروس اللغات'
  ];

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

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const params = { status: 'active' };
      if (search) params.search = search;
      if (selectedLevel) params.level = selectedLevel;
      const data = await api.getStudents(params);
      setStudents(data);
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
    fetchTeachers();
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [search, selectedLevel]);

  const handleOpenAdd = () => {
    setFormData({
      fullName: '',
      level: 'البكالوريا',
      phone: '06',
      monthlyFee: 500,
      subjects: [
        { subject: 'الرياضيات', teacher: teachers[0]?.fullName || 'أستاذ عادل السعدي', fee: 250 }
      ],
      notes: ''
    });
    setShowAddModal(true);
  };

  const handleOpenEdit = (student) => {
    setActiveStudent(student);
    setFormData({
      fullName: student.fullName,
      level: student.level,
      phone: student.phone,
      monthlyFee: student.monthlyFee,
      subjects: student.subjects?.length ? student.subjects : [{ subject: 'الرياضيات', teacher: 'أستاذ عادل السعدي', fee: 250 }],
      notes: student.notes || ''
    });
    setShowEditModal(true);
  };

  const handleAddSubjectField = () => {
    setFormData({
      ...formData,
      subjects: [
        ...formData.subjects,
        { subject: 'الفيزياء والكيمياء', teacher: teachers[1]?.fullName || 'أستاذ محمد العمراني', fee: 200 }
      ]
    });
  };

  const handleRemoveSubjectField = (index) => {
    const updated = formData.subjects.filter((_, idx) => idx !== index);
    setFormData({ ...formData, subjects: updated });
  };

  const handleSubjectChange = (index, field, value) => {
    const updated = [...formData.subjects];
    updated[index][field] = value;
    setFormData({ ...formData, subjects: updated });
  };

  const handleSaveStudent = async (e) => {
    e.preventDefault();
    try {
      if (showAddModal) {
        await api.createStudent(formData);
      } else if (showEditModal && activeStudent) {
        await api.updateStudent(activeStudent._id, formData);
      }
      setShowAddModal(false);
      setShowEditModal(false);
      fetchStudents();
      if (onRefreshStats) onRefreshStats();
    } catch (e) {
      alert('حدث خطأ أثناء حفظ التلميذ: ' + e.message);
    }
  };

  const handleConfirmDepart = async () => {
    if (!activeStudent) return;
    try {
      await api.markDeparted(activeStudent._id, departureReason);
      setShowDepartModal(false);
      fetchStudents();
      if (onRefreshStats) onRefreshStats();
    } catch (e) {
      alert('خطأ: ' + e.message);
    }
  };

  const handleConfirmDelete = async () => {
    if (!activeStudent) return;
    try {
      await api.deleteStudent(activeStudent._id);
      setShowDeleteModal(false);
      fetchStudents();
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
            {t('navStudents')}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            إدارة وتسجيل التلاميذ ومتابعة المواد والأساتذة المشرفين
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-extrabold shadow-md transition transform hover:scale-[1.02]"
        >
          <UserPlus className="w-4 h-4" />
          <span>{t('addStudent')}</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute top-3 right-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('searchStudentPlaceholder')}
            className="w-full pl-3 pr-9 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:bg-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition"
          />
        </div>

        {/* Level Filter Dropdown */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="w-full md:w-56 py-2 px-3 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:bg-white focus:border-teal-500 outline-none transition font-semibold text-slate-700"
          >
            <option value="">{t('allLevels')}</option>
            {levelsList.map((lvl) => (
              <option key={lvl} value={lvl}>{lvl}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-right">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3.5 w-10 text-center">#</th>
                <th className="p-3.5">{t('fullName')}</th>
                <th className="p-3.5">{t('level')}</th>
                <th className="p-3.5">{t('subjects')}</th>
                <th className="p-3.5">{t('phone')}</th>
                <th className="p-3.5">{t('monthlyFee')}</th>
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
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-400">
                    لم يتم العثور على أي تلميذ يطابق بحثك
                  </td>
                </tr>
              ) : (
                students.map((student, idx) => (
                  <tr key={student._id} className="hover:bg-slate-50/70 transition">
                    <td className="p-3.5 text-center font-bold text-slate-400">{idx + 1}</td>
                    <td className="p-3.5">
                      <span className="font-extrabold text-slate-900 block text-sm">
                        {student.fullName}
                      </span>
                      {student.notes && (
                        <span className="text-[10px] text-slate-400 block">{student.notes}</span>
                      )}
                    </td>
                    <td className="p-3.5 font-medium text-slate-700">
                      <span className="inline-block bg-slate-100 text-slate-800 px-2.5 py-0.5 rounded-md font-semibold text-[11px]">
                        {student.level}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {student.subjects?.map((sub, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 bg-teal-50 text-teal-800 border border-teal-200/80 px-2 py-0.5 rounded-md text-[10px] font-bold"
                          >
                            <span>{sub.subject}</span>
                            <span className="text-teal-600 font-normal">({sub.teacher})</span>
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-3.5 font-mono text-slate-700 font-semibold" dir="ltr">
                      {student.phone}
                    </td>
                    <td className="p-3.5 font-extrabold text-teal-800">
                      {student.monthlyFee} {t('currency')}
                    </td>
                    <td className="p-3.5">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(student)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                          title={t('edit')}
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setActiveStudent(student);
                            setShowDepartModal(true);
                          }}
                          className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 transition"
                          title={t('markAsDeparted')}
                        >
                          <UserX className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setActiveStudent(student);
                            setShowDeleteModal(true);
                          }}
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition"
                          title={t('delete')}
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

      {/* Add / Edit Student Modal */}
      <Modal
        isOpen={showAddModal || showEditModal}
        onClose={() => {
          setShowAddModal(false);
          setShowEditModal(false);
        }}
        title={showAddModal ? t('addStudent') : t('editStudent')}
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSaveStudent} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('fullName')} *
              </label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="مثال: سليمان شكري"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-teal-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('level')} *
              </label>
              <select
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-teal-600 outline-none font-medium"
              >
                {levelsList.map((lvl) => (
                  <option key={lvl} value={lvl}>{lvl}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('monthlyFee')} ({t('currency')}) *
              </label>
              <input
                type="number"
                required
                min="0"
                step="50"
                value={formData.monthlyFee}
                onChange={(e) => setFormData({ ...formData, monthlyFee: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-teal-600 outline-none font-bold"
              />
            </div>
          </div>

          {/* Subjects and Assigned Teachers List */}
          <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/60">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-teal-700" />
                <span>{t('selectSubjectAndTeacher')}</span>
              </label>
              <button
                type="button"
                onClick={handleAddSubjectField}
                className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t('addSubject')}</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {formData.subjects.map((sub, index) => (
                <div key={index} className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-slate-200">
                  <select
                    value={sub.subject}
                    onChange={(e) => handleSubjectChange(index, 'subject', e.target.value)}
                    className="flex-1 py-1 px-2 text-xs rounded-lg border border-slate-200 outline-none font-medium"
                  >
                    {subjectsList.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>

                  <select
                    value={sub.teacher}
                    onChange={(e) => handleSubjectChange(index, 'teacher', e.target.value)}
                    className="flex-1 py-1 px-2 text-xs rounded-lg border border-slate-200 outline-none font-medium text-slate-700"
                  >
                    {teachers.map((t) => (
                      <option key={t._id} value={t.fullName}>{t.fullName} ({t.subject})</option>
                    ))}
                  </select>

                  {formData.subjects.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveSubjectField(index)}
                      className="p-1 text-slate-400 hover:text-rose-600 transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t('notes')}
            </label>
            <input
              type="text"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="ملاحظات إضافية حول التلميذ..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-teal-600 outline-none"
            />
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

      {/* Mark As Departed Modal */}
      <Modal
        isOpen={showDepartModal}
        onClose={() => setShowDepartModal(false)}
        title={t('markAsDeparted')}
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600">
            {t('confirmDepart')} <span className="font-bold text-slate-900">{activeStudent?.fullName}</span>
          </p>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t('departureReason')}
            </label>
            <input
              type="text"
              value={departureReason}
              onChange={(e) => setDepartureReason(e.target.value)}
              placeholder={t('departureReasonPlaceholder')}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-3">
            <button
              onClick={() => setShowDepartModal(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
            >
              {t('cancel')}
            </button>
            <button
              onClick={handleConfirmDepart}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition"
            >
              {t('confirm')}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title={t('deletePermanent')}
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-100">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <p className="text-xs font-bold">
              سيتم حذف سجل التلميذ نهائياً بما في ذلك سجلات الأداء والغياب.
            </p>
          </div>

          <p className="text-xs text-slate-600">
            هل تريد بالـتأكيد حذف التلميذ <span className="font-bold text-slate-900">{activeStudent?.fullName}</span>؟
          </p>

          <div className="pt-3 flex items-center justify-end gap-3">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
            >
              {t('cancel')}
            </button>
            <button
              onClick={handleConfirmDelete}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition"
            >
              {t('delete')}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
