import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../utils/api';
import Modal from '../components/Modal';
import {
  Search,
  CreditCard,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  MessageCircle,
  Calendar,
  Filter,
  DollarSign
} from 'lucide-react';

export default function Payments({ onViewReceipt, onRefreshStats }) {
  const { t } = useLanguage();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('يناير 2026');
  const [statusFilter, setStatusFilter] = useState('');

  // Payment Recording Modal
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [activePayment, setActivePayment] = useState(null);
  const [paymentForm, setPaymentForm] = useState({
    amountPaid: 0,
    status: 'paid',
    notes: 'مؤدى بالكامل'
  });

  const monthsList = [
    'يناير 2026',
    'فبراير 2026',
    'مارس 2026',
    'أبريل 2026',
    'ماي 2026',
    'يونيو 2026',
    'شتنبر 2025',
    'أكتوبر 2025',
    'نونبر 2025',
    'دجنبر 2025'
  ];

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedMonth) params.month = selectedMonth;
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      const data = await api.getPayments(params);
      setPayments(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [selectedMonth, search, statusFilter]);

  const handleOpenRecord = (payment) => {
    setActivePayment(payment);
    const fullFee = payment.totalDue || 500;
    setPaymentForm({
      amountPaid: payment.status === 'unpaid' ? fullFee : payment.amountPaid,
      status: payment.status === 'unpaid' ? 'paid' : payment.status,
      notes: payment.notes || 'مؤدى بالكامل'
    });
    setShowRecordModal(true);
  };

  const handleSavePayment = async (e) => {
    e.preventDefault();
    if (!activePayment) return;
    try {
      await api.recordPayment(activePayment._id, paymentForm);
      setShowRecordModal(false);
      fetchPayments();
      if (onRefreshStats) onRefreshStats();
    } catch (e) {
      alert('خطأ أثناء تسجيل الأداء: ' + e.message);
    }
  };

  const totalCollected = payments.reduce((sum, p) => sum + (Number(p.amountPaid) || 0), 0);
  const totalRemaining = payments.reduce((sum, p) => sum + (Number(p.remaining) || 0), 0);
  const paidCount = payments.filter(p => p.status === 'paid').length;
  const unpaidCount = payments.filter(p => p.status === 'unpaid').length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
            {t('navPayments')}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            متابعة استخلاص الواجبات الشهرية للتلاميذ وإصدار وصولات الأداء
          </p>
        </div>

        {/* Month Selector */}
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-teal-700" />
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-4 py-2 bg-white border border-slate-200 text-xs font-bold text-slate-800 rounded-xl shadow-xs outline-none focus:border-teal-600"
          >
            {monthsList.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 block">المداخيل المستخلصة</span>
          <span className="text-xl font-black text-emerald-700 block mt-1">
            {totalCollected.toLocaleString()} <span className="text-xs font-bold">{t('currency')}</span>
          </span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 block">المبالغ غير المستخلصة</span>
          <span className="text-xl font-black text-rose-700 block mt-1">
            {totalRemaining.toLocaleString()} <span className="text-xs font-bold">{t('currency')}</span>
          </span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 block">التلاميذ المؤدون</span>
          <span className="text-xl font-black text-slate-800 block mt-1">
            {paidCount} <span className="text-xs font-medium text-slate-500">تلميذ</span>
          </span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 block">التلاميذ المتأخرون</span>
          <span className="text-xl font-black text-amber-600 block mt-1">
            {unpaidCount} <span className="text-xs font-medium text-slate-500">تلميذ</span>
          </span>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute top-3 right-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="البحث عن تلميذ بالاسم أو رقم الهاتف لتسجيل الأداء..."
            className="w-full pl-3 pr-9 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:bg-white focus:border-teal-500 outline-none transition"
          />
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setStatusFilter('')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              statusFilter === '' ? 'bg-teal-700 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {t('all')}
          </button>
          <button
            onClick={() => setStatusFilter('paid')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              statusFilter === 'paid' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {t('paidFull')}
          </button>
          <button
            onClick={() => setStatusFilter('partial')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              statusFilter === 'partial' ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {t('paidPartial')}
          </button>
          <button
            onClick={() => setStatusFilter('unpaid')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              statusFilter === 'unpaid' ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {t('unpaid')}
          </button>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-right">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3.5 w-10 text-center">#</th>
                <th className="p-3.5">{t('fullName')}</th>
                <th className="p-3.5">{t('level')}</th>
                <th className="p-3.5">{t('phone')}</th>
                <th className="p-3.5">{t('monthlyFee')}</th>
                <th className="p-3.5">{t('amountPaid')}</th>
                <th className="p-3.5">{t('remaining')}</th>
                <th className="p-3.5 text-center">{t('paymentStatus')}</th>
                <th className="p-3.5 text-center">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {loading ? (
                <tr>
                  <td colSpan="9" className="p-8 text-center text-slate-400">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-700 mx-auto mb-2"></div>
                    {t('loading')}
                  </td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan="9" className="p-8 text-center text-slate-400">
                    لا توجد واجبات مسجلة مطابقة لهذا الشهر
                  </td>
                </tr>
              ) : (
                payments.map((p, idx) => {
                  const isPaid = p.status === 'paid';
                  const isPartial = p.status === 'partial';
                  const isUnpaid = p.status === 'unpaid';

                  return (
                    <tr key={p._id} className="hover:bg-slate-50/70 transition">
                      <td className="p-3.5 text-center font-bold text-slate-400">{idx + 1}</td>
                      <td className="p-3.5 font-extrabold text-slate-900 text-sm">
                        {p.studentName}
                      </td>
                      <td className="p-3.5 text-slate-600 font-medium">
                        {p.level}
                      </td>
                      <td className="p-3.5 font-mono text-slate-700 font-semibold" dir="ltr">
                        {p.phone}
                      </td>
                      <td className="p-3.5 font-bold text-slate-800">
                        {p.totalDue} {t('currency')}
                      </td>
                      <td className="p-3.5 font-black text-emerald-700">
                        {p.amountPaid} {t('currency')}
                      </td>
                      <td className="p-3.5 font-bold text-rose-600">
                        {p.remaining > 0 ? `${p.remaining} ${t('currency')}` : '-'}
                      </td>
                      <td className="p-3.5 text-center">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-extrabold ${
                          isPaid
                            ? 'bg-emerald-100 text-emerald-800'
                            : isPartial
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {isPaid && <CheckCircle className="w-3.5 h-3.5" />}
                          {isPartial && <Clock className="w-3.5 h-3.5" />}
                          {isUnpaid && <AlertCircle className="w-3.5 h-3.5" />}
                          <span>
                            {isPaid ? t('paidFull') : isPartial ? t('paidPartial') : t('unpaid')}
                          </span>
                        </span>
                      </td>
                      <td className="p-3.5">
                        <div className="flex items-center justify-center gap-2">
                          {/* Record Payment Button */}
                          <button
                            onClick={() => handleOpenRecord(p)}
                            className="px-3 py-1.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs shadow-xs transition flex items-center gap-1"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                            <span>{t('recordPayment')}</span>
                          </button>

                          {/* View Receipt Button (if paid) */}
                          {!isUnpaid && (
                            <button
                              onClick={() => onViewReceipt(p)}
                              className="p-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 transition"
                              title={t('viewReceipt')}
                            >
                              <FileText className="w-4 h-4" />
                            </button>
                          )}

                          {/* WhatsApp Reminder Button (if unpaid or partial) */}
                          {p.remaining > 0 && (
                            <a
                              href={`https://wa.me/${p.phone?.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                                `السلام عليكم، نذكركم بضرورة تسوية واجب الدعم المدرسي لشهر ${p.month} بمبلغ ${p.remaining} درهم وشكراً.`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-800 transition"
                              title="إرسال تذكير واتساب"
                            >
                              <MessageCircle className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Payment Modal matching video demo timestamp 03:07 - 03:26 */}
      <Modal
        isOpen={showRecordModal}
        onClose={() => setShowRecordModal(false)}
        title={`تسجيل أداء - ${activePayment?.studentName}`}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSavePayment} className="space-y-4">
          <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 text-center">
            <span className="text-xs text-amber-900 font-semibold block">الواجب الشهري المقرر</span>
            <span className="text-2xl font-black text-amber-800">
              {activePayment?.totalDue} <span className="text-sm font-bold">{t('currency')}</span>
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              نوع الأداء
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setPaymentForm({
                    ...paymentForm,
                    status: 'paid',
                    amountPaid: activePayment?.totalDue || 500,
                    notes: 'مؤدى بالكامل'
                  });
                }}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                  paymentForm.status === 'paid'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                مؤدى بالكامل
              </button>

              <button
                type="button"
                onClick={() => {
                  const half = Math.floor((activePayment?.totalDue || 500) / 2);
                  setPaymentForm({
                    ...paymentForm,
                    status: 'partial',
                    amountPaid: half,
                    notes: 'أداء جزئي (نصف المبلغ)'
                  });
                }}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                  paymentForm.status === 'partial'
                    ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                أداء جزئي
              </button>

              <button
                type="button"
                onClick={() => {
                  setPaymentForm({
                    ...paymentForm,
                    status: 'unpaid',
                    amountPaid: 0,
                    notes: 'غير مؤدى'
                  });
                }}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                  paymentForm.status === 'unpaid'
                    ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                غير مؤدى
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              المبلغ المدفوع ({t('currency')}) *
            </label>
            <input
              type="number"
              required
              min="0"
              max={activePayment?.totalDue || 5000}
              value={paymentForm.amountPaid}
              onChange={(e) => {
                const paid = Number(e.target.value);
                const total = activePayment?.totalDue || 0;
                let s = 'partial';
                if (paid >= total) s = 'paid';
                if (paid === 0) s = 'unpaid';
                setPaymentForm({ ...paymentForm, amountPaid: paid, status: s });
              }}
              className="w-full px-3 py-2 text-sm font-black text-slate-900 rounded-xl border border-slate-200 focus:border-teal-600 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t('notes')}
            </label>
            <input
              type="text"
              value={paymentForm.notes}
              onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.target.value })}
              placeholder="مثال: نقداً / تحويل بنكي / شيك..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-teal-600 outline-none"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowRecordModal(false)}
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
