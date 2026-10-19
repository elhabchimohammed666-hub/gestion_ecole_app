import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import StatCard from '../components/StatCard';
import {
  Users,
  GraduationCap,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  CalendarX,
  CreditCard,
  UserPlus,
  ArrowRight,
  ArrowLeft,
  FileText,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

export default function Dashboard({ stats, onSelectPage, onViewReceipt }) {
  const { t, isRTL } = useLanguage();

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-96 text-slate-400">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-700"></div>
      </div>
    );
  }

  const {
    totalStudents = 0,
    totalTeachers = 0,
    paidCount = 0,
    unpaidCount = 0,
    totalRevenue = 0,
    expectedRevenue = 0,
    totalExpenses = 0,
    netProfit = 0,
    absencesCount = 0,
    recentPayments = [],
    newRegistrations = [],
    departedCount = 0
  } = stats;

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <div className="space-y-6">
      {/* Top Welcome & Month Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-amber-300 text-xs font-bold mb-2">
            <span>✨ نظام إدارة مركز الدعم المدرسي والتقوية واللغات</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight">
            لوحة القيادة والتحكم الشاملة
          </h1>
          <p className="text-emerald-100 text-xs md:text-sm mt-1">
            متابعة دقيقة للتلاميذ، المداخيل الشهرية، حصص الأساتذة والمصاريف
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/15 text-center">
            <span className="text-[11px] text-emerald-200 block font-medium">الشهر الحالي</span>
            <span className="text-sm font-extrabold text-amber-300">يناير 2026</span>
          </div>
          <button
            onClick={() => onSelectPage('students')}
            className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-extrabold transition shadow-md flex items-center gap-1.5"
          >
            <UserPlus className="w-4 h-4" />
            <span>{t('addStudent')}</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid (Matches video demo top cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title={t('totalStudents')}
          value={totalStudents}
          icon={GraduationCap}
          color="teal"
          subtitle="تلميذ مسجل بالمركز"
          onClick={() => onSelectPage('students')}
        />

        <StatCard
          title={t('totalTeachers')}
          value={totalTeachers}
          icon={Users}
          color="blue"
          subtitle="أستاذ ومشرف"
          onClick={() => onSelectPage('teachers')}
        />

        <StatCard
          title={t('paidThisMonth')}
          value={paidCount}
          icon={CheckCircle2}
          color="emerald"
          subtitle={`${Math.round((paidCount / (totalStudents || 1)) * 100)}% من التلاميذ`}
          onClick={() => onSelectPage('payments')}
        />

        <StatCard
          title={t('unpaidThisMonth')}
          value={unpaidCount}
          icon={AlertCircle}
          color="amber"
          subtitle="في انتظار التسوية"
          onClick={() => onSelectPage('payments')}
        />

        <StatCard
          title={t('monthlyRevenue')}
          value={totalRevenue}
          unit={t('currency')}
          icon={TrendingUp}
          color="teal"
          subtitle={`المتوقع: ${expectedRevenue.toLocaleString()} ${t('currency')}`}
          onClick={() => onSelectPage('reports')}
        />

        <StatCard
          title={t('monthAbsences')}
          value={absencesCount}
          icon={CalendarX}
          color="rose"
          subtitle="تسجيلات الغياب"
          onClick={() => onSelectPage('attendance')}
        />
      </div>

      {/* 4 Summary Widgets (Exact match with video demo layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Recent Payments (آخر المدفوعات) */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-800">{t('recentPayments')}</h3>
                  <p className="text-[11px] text-slate-400">آخر عمليات تسوية الواجبات</p>
                </div>
              </div>
              <button
                onClick={() => onSelectPage('payments')}
                className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1"
              >
                <span>{t('viewAll')}</span>
                <ArrowIcon className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100 mt-2">
              {recentPayments.length === 0 ? (
                <p className="py-6 text-center text-xs text-slate-400">{t('noRecentPayments')}</p>
              ) : (
                recentPayments.slice(0, 5).map((p) => (
                  <div key={p._id} className="py-3 flex items-center justify-between hover:bg-slate-50/70 px-2 rounded-xl transition">
                    <div>
                      <p className="font-bold text-xs text-slate-900">{p.studentName}</p>
                      <p className="text-[11px] text-slate-500">{p.level} • {p.month}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-left">
                        <span className="font-extrabold text-xs text-emerald-700 block">
                          +{p.amountPaid} {t('currency')}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          p.status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {p.status === 'paid' ? t('paidFull') : t('paidPartial')}
                        </span>
                      </div>
                      {p.receiptNumber && (
                        <button
                          onClick={() => onViewReceipt(p)}
                          className="p-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-700 transition"
                          title="عرض الوصل"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* 2. New Registrations (التسجيلات الجديدة) */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-800">{t('newRegistrations')}</h3>
                  <p className="text-[11px] text-slate-400">التلاميذ المسجلون حديثاً</p>
                </div>
              </div>
              <button
                onClick={() => onSelectPage('students')}
                className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1"
              >
                <span>{t('viewAll')}</span>
                <ArrowIcon className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100 mt-2">
              {newRegistrations.length === 0 ? (
                <p className="py-6 text-center text-xs text-slate-400">{t('noRecentRegistrations')}</p>
              ) : (
                newRegistrations.slice(0, 5).map((s) => (
                  <div key={s._id} className="py-3 flex items-center justify-between hover:bg-slate-50/70 px-2 rounded-xl transition">
                    <div>
                      <p className="font-bold text-xs text-slate-900">{s.fullName}</p>
                      <p className="text-[11px] text-slate-500">{s.level} • {s.phone}</p>
                    </div>
                    <div className="text-left">
                      <span className="font-bold text-xs text-slate-800 block">
                        {s.monthlyFee} {t('currency')}/شهر
                      </span>
                      <span className="text-[10px] text-teal-600 font-semibold bg-teal-50 px-2 py-0.5 rounded-full">
                        {s.subjects?.length || 1} مواد
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* 3. Quick Financial Summary (ملخص مالي سريع) */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-800">{t('quickFinancialSummary')}</h3>
                <p className="text-[11px] text-slate-400">إيرادات ومصاريف وأرباح الشهر</p>
              </div>
            </div>
            <button
              onClick={() => onSelectPage('expenses')}
              className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1"
            >
              <span>{t('viewAll')}</span>
              <ArrowIcon className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 my-4">
            <div className="bg-emerald-50/80 rounded-2xl p-3 border border-emerald-100 text-center">
              <span className="text-[11px] font-semibold text-emerald-800 block">المداخيل</span>
              <span className="text-base font-black text-emerald-900 block mt-1">
                {totalRevenue.toLocaleString()}
              </span>
              <span className="text-[10px] text-emerald-700">{t('currency')}</span>
            </div>

            <div className="bg-rose-50/80 rounded-2xl p-3 border border-rose-100 text-center">
              <span className="text-[11px] font-semibold text-rose-800 block">{t('totalExpenses')}</span>
              <span className="text-base font-black text-rose-900 block mt-1">
                {totalExpenses.toLocaleString()}
              </span>
              <span className="text-[10px] text-rose-700">{t('currency')}</span>
            </div>

            <div className="bg-teal-50/80 rounded-2xl p-3 border border-teal-100 text-center">
              <span className="text-[11px] font-semibold text-teal-800 block">{t('netProfit')}</span>
              <span className="text-base font-black text-teal-900 block mt-1">
                {netProfit.toLocaleString()}
              </span>
              <span className="text-[10px] text-teal-700">{t('currency')}</span>
            </div>
          </div>

          {/* Profitability progress bar */}
          <div className="mt-2 bg-slate-50 p-3 rounded-2xl border border-slate-100">
            <div className="flex items-center justify-between text-xs mb-1.5 font-bold">
              <span className="text-slate-600">نسبة التحصيل الشهري:</span>
              <span className="text-emerald-700">
                {expectedRevenue > 0 ? Math.round((totalRevenue / expectedRevenue) * 100) : 0}%
              </span>
            </div>
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.round((totalRevenue / (expectedRevenue || 1)) * 100))}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* 4. Departed Students Preview (قائمة التلاميذ المغادرين) */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center font-bold">
                  <CalendarX className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-800">{t('departedPreview')}</h3>
                  <p className="text-[11px] text-slate-400">التلاميذ الذين غادروا المركز مع إمكانية استرجاعهم</p>
                </div>
              </div>
              <button
                onClick={() => onSelectPage('departed')}
                className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1"
              >
                <span>{t('viewAll')}</span>
                <ArrowIcon className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="py-4 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 text-slate-700 font-black text-xl mb-2">
                {departedCount}
              </div>
              <p className="text-xs font-bold text-slate-700">
                يوجد حالياً {departedCount} تلاميذ في سجل المغادرين
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                يمكنك إعادة تسجيل أي تلميذ بنقرة زر واحدة أو حذف سجله نهائياً
              </p>

              <button
                onClick={() => onSelectPage('departed')}
                className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition"
              >
                فتح سجل التلاميذ المغادرين
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
