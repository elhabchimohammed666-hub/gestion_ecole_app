import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../utils/api';
import Modal from '../components/Modal';
import {
  Wallet,
  Plus,
  Trash2,
  TrendingDown,
  TrendingUp,
  DollarSign,
  Calendar,
  Building,
  Users,
  Zap,
  Wifi,
  Package
} from 'lucide-react';

export default function Expenses({ onRefreshStats }) {
  const { t } = useLanguage();
  const [expenses, setExpenses] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState('يناير 2026');

  // Add Expense Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'إيجار المركز',
    amount: '',
    recipient: '',
    month: 'يناير 2026',
    notes: ''
  });

  const categories = [
    { label: 'إيجار المركز', icon: Building, color: 'text-amber-600 bg-amber-50' },
    { label: 'أجور الأساتذة', icon: Users, color: 'text-blue-600 bg-blue-50' },
    { label: 'أجور العمال', icon: Users, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'الماء والكهرباء', icon: Zap, color: 'text-yellow-600 bg-yellow-50' },
    { label: 'اشتراك الإنترنت', icon: Wifi, color: 'text-sky-600 bg-sky-50' },
    { label: 'مصاريف أخرى', icon: Package, color: 'text-purple-600 bg-purple-50' }
  ];

  const monthsList = [
    'يناير 2026',
    'فبراير 2026',
    'مارس 2026',
    'شتنبر 2025',
    'أكتوبر 2025',
    'نونبر 2025',
    'دجنبر 2025'
  ];

  const fetchExpensesAndStats = async () => {
    try {
      setLoading(true);
      const [expData, statsData] = await Promise.all([
        api.getExpenses(selectedMonth),
        api.getDashboardStats(selectedMonth)
      ]);
      setExpenses(expData);
      setStats(statsData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpensesAndStats();
  }, [selectedMonth]);

  const handleCreateExpense = async (e) => {
    e.preventDefault();
    try {
      await api.createExpense({
        ...formData,
        amount: Number(formData.amount),
        month: selectedMonth
      });
      setShowAddModal(false);
      setFormData({
        title: '',
        category: 'إيجار المركز',
        amount: '',
        recipient: '',
        month: selectedMonth,
        notes: ''
      });
      fetchExpensesAndStats();
      if (onRefreshStats) onRefreshStats();
    } catch (e) {
      alert('خطأ أثناء إضافة المصروف: ' + e.message);
    }
  };

  const handleDeleteExpense = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا المصروف؟')) return;
    try {
      await api.deleteExpense(id);
      fetchExpensesAndStats();
      if (onRefreshStats) onRefreshStats();
    } catch (e) {
      alert('خطأ أثناء الحذف: ' + e.message);
    }
  };

  const totalExp = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  const totalRev = stats?.totalRevenue || 0;
  const netProf = totalRev - totalExp;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
            {t('navExpenses')}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            إدارة كافة تكاليف ومصاريف المركز وحساب صافي الأرباح الشهرية
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Month Selector */}
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs">
            <Calendar className="w-4 h-4 text-teal-700" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="text-xs font-bold text-slate-800 outline-none"
            >
              {monthsList.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-extrabold shadow-md transition"
          >
            <Plus className="w-4 h-4" />
            <span>{t('addExpense')}</span>
          </button>
        </div>
      </div>

      {/* Top 3 KPI Financial Cards matching video demo timestamp 07:33 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Expenses */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 block">{t('totalExpenses')}</span>
              <span className="text-2xl md:text-3xl font-black text-rose-600 block mt-1">
                {totalExp.toLocaleString()} <span className="text-sm font-bold">{t('currency')}</span>
              </span>
              <span className="text-[11px] text-slate-400 mt-1 block">مجموع فواتير وأجور {selectedMonth}</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <TrendingDown className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 block">{t('monthlyRevenue')}</span>
              <span className="text-2xl md:text-3xl font-black text-emerald-700 block mt-1">
                {totalRev.toLocaleString()} <span className="text-sm font-bold">{t('currency')}</span>
              </span>
              <span className="text-[11px] text-slate-400 mt-1 block">واجبات التلاميذ المستخلصة</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Net Profit */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 block">{t('netProfit')}</span>
              <span className="text-2xl md:text-3xl font-black text-teal-800 block mt-1">
                {netProf.toLocaleString()} <span className="text-sm font-bold">{t('currency')}</span>
              </span>
              <span className="text-[11px] text-teal-600 font-bold mt-1 block">
                هامش ربح: {totalRev > 0 ? Math.round((netProf / totalRev) * 100) : 0}%
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Categories Visual Breakdown Cards (matching video demo timestamp 08:20) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const sumForCat = expenses
            .filter(e => e.category === cat.label)
            .reduce((s, e) => s + (Number(e.amount) || 0), 0);

          return (
            <div key={cat.label} className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-xs text-center">
              <div className={`w-9 h-9 rounded-xl ${cat.color} flex items-center justify-center mx-auto mb-2`}>
                <Icon className="w-4 h-4" />
              </div>
              <p className="text-[11px] font-bold text-slate-600 truncate">{cat.label}</p>
              <p className="text-xs font-black text-slate-900 mt-1">
                {sumForCat.toLocaleString()} <span className="text-[10px] text-slate-400">{t('currency')}</span>
              </p>
            </div>
          );
        })}
      </div>

      {/* Expenses List Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-800">
            سجل مصاريف شهر: <span className="text-teal-700 font-extrabold">{selectedMonth}</span>
          </h3>
          <span className="text-xs font-bold text-slate-500">{expenses.length} عملية</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-right">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3.5 w-10 text-center">#</th>
                <th className="p-3.5">عنوان المصروف</th>
                <th className="p-3.5">التصنيف</th>
                <th className="p-3.5">المستفيد</th>
                <th className="p-3.5">المبلغ</th>
                <th className="p-3.5">التاريخ</th>
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
              ) : expenses.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-400">
                    لا توجد مصاريف مسجلة في هذا الشهر
                  </td>
                </tr>
              ) : (
                expenses.map((e, idx) => (
                  <tr key={e._id} className="hover:bg-slate-50/70 transition">
                    <td className="p-3.5 text-center font-bold text-slate-400">{idx + 1}</td>
                    <td className="p-3.5">
                      <span className="font-extrabold text-slate-900 block">{e.title}</span>
                      {e.notes && <span className="text-[10px] text-slate-400">{e.notes}</span>}
                    </td>
                    <td className="p-3.5">
                      <span className="inline-block bg-slate-100 text-slate-800 px-2.5 py-0.5 rounded-md font-bold text-[11px]">
                        {e.category}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-600 font-medium">{e.recipient || '-'}</td>
                    <td className="p-3.5 font-black text-rose-600 text-sm">
                      {e.amount} {t('currency')}
                    </td>
                    <td className="p-3.5 text-slate-500">
                      {e.date ? new Date(e.date).toLocaleDateString('fr-FR') : '-'}
                    </td>
                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => handleDeleteExpense(e._id)}
                        className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition"
                        title={t('delete')}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Expense Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title={t('addExpense')}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleCreateExpense} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              عنوان المصروف *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="مثال: إيجار المركز / فاتورة الكهرباء / أقلام..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t('expenseCategory')} *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none font-bold text-slate-800"
            >
              {categories.map((c) => (
                <option key={c.label} value={c.label}>{c.label}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                المبلغ ({t('currency')}) *
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="0"
                className="w-full px-3 py-2 text-xs font-black rounded-xl border border-slate-200 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('recipient')}
              </label>
              <input
                type="text"
                value={formData.recipient}
                onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
                placeholder="الجهة أو الشخص المستفيد"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none"
              />
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
              placeholder="رقم الشيك أو تفاصيل إضافية..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
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
