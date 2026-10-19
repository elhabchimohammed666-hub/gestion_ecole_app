import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../utils/api';
import {
  BarChart3,
  PieChart as PieIcon,
  TrendingUp,
  AlertTriangle,
  MessageCircle,
  Calendar,
  CheckCircle2,
  DollarSign
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';

export default function Reports() {
  const { t } = useLanguage();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState('يناير 2026');

  const monthsList = [
    'يناير 2026',
    'فبراير 2026',
    'شتنبر 2025',
    'أكتوبر 2025',
    'نونبر 2025',
    'دجنبر 2025'
  ];

  const COLORS = ['#0f766e', '#f59e0b', '#0284c7', '#7c3aed', '#059669', '#dc2626', '#e11d48', '#d97706'];

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await api.getDashboardStats(selectedMonth);
      setStats(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [selectedMonth]);

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center h-96 text-slate-400">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-700"></div>
      </div>
    );
  }

  // Formatting chart data
  const subjectChartData = Object.entries(stats.subjectCounts || {}).map(([name, count]) => ({
    name,
    count
  }));

  const levelChartData = Object.entries(stats.levelCounts || {}).map(([name, count]) => ({
    name,
    count
  }));

  const teacherChartData = Object.entries(stats.teacherStudentCounts || {})
    .slice(0, 10)
    .map(([name, count]) => ({
      name,
      count
    }));

  const paymentStatusData = [
    { name: 'مؤدى بالكامل', value: stats.paidCount || 0, color: '#10b981' },
    { name: 'أداء جزئي', value: stats.partialCount || 0, color: '#f59e0b' },
    { name: 'غير مؤدى', value: stats.unpaidCount || 0, color: '#ef4444' }
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
            {t('navReports')}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            إحصائيات ورسوم بيانية شاملة لأداء المركز المالي والتربوي
          </p>
        </div>

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
      </div>

      {/* Top KPI Cards (matching video demo timestamp 04:26) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 block">المتوقع من الأرباح</span>
          <span className="text-2xl font-black text-slate-900 block mt-1">
            {stats.expectedRevenue?.toLocaleString()} <span className="text-xs font-bold text-slate-500">{t('currency')}</span>
          </span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 block">المحصل عليها (المداخيل)</span>
          <span className="text-2xl font-black text-emerald-700 block mt-1">
            {stats.totalRevenue?.toLocaleString()} <span className="text-xs font-bold text-slate-500">{t('currency')}</span>
          </span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 block">التلاميذ المؤدون</span>
          <span className="text-2xl font-black text-teal-700 block mt-1">
            {stats.paidCount} <span className="text-xs font-medium text-slate-500">تلميذ</span>
          </span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 block">المتأخرون عن الأداء</span>
          <span className="text-2xl font-black text-rose-600 block mt-1">
            {stats.unpaidCount} <span className="text-xs font-medium text-slate-500">تلميذ</span>
          </span>
        </div>
      </div>

      {/* Charts Grid Row 1 (matching video demo timestamp 04:46 - 05:00) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Students by Subject (التلاميذ حسب المادة) */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-extrabold text-slate-800 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-teal-700" />
              <span>{t('studentsBySubject')}</span>
            </h3>
            <span className="text-[10px] text-slate-400">توزيع الحصص</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#0f766e" radius={[6, 6, 0, 0]} name="عدد التلاميذ" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Students by Grade Level (التلاميذ حسب المستوى) */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-extrabold text-slate-800 flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-amber-500" />
              <span>{t('studentsByLevel')}</span>
            </h3>
            <span className="text-[10px] text-slate-400">النسب المئوية</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={levelChartData}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={85}
                  innerRadius={45}
                  paddingAngle={2}
                  label={({ name, percent }) => `${name.slice(0, 8)} (${(percent * 100).toFixed(0)}%)`}
                >
                  {levelChartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Grid Row 2 (matching video demo timestamp 05:01 - 05:25) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 3: Students per Teacher (التلاميذ حسب الأستاذ) */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-extrabold text-slate-800 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-700" />
              <span>{t('studentsByTeacher')}</span>
            </h3>
            <span className="text-[10px] text-slate-400">أعلى الأساتذة إقبالاً</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={teacherChartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 10 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 9 }} width={100} />
                <Tooltip />
                <Bar dataKey="count" fill="#d97706" radius={[0, 6, 6, 0]} name="تلميذ" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Payment Status Breakdown (توزيع حالات الأداء) */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-extrabold text-slate-800 flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-teal-600" />
              <span>{t('paymentStatusDistribution')}</span>
            </h3>
            <span className="text-[10px] text-slate-400">شهر {selectedMonth}</span>
          </div>

          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentStatusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={50}
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {paymentStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Chart 5: Monthly Revenue vs Expenses Comparison (مقارنة المداخيل والمصاريف) */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xs font-extrabold text-slate-800 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-teal-700" />
              <span>{t('monthlyFinancialComparison')}</span>
            </h3>
            <p className="text-[11px] text-slate-400">تطور المداخيل، المصاريف والأرباح الصافية عبر الأشهر</p>
          </div>
        </div>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.monthlyFinancials || []}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="revenue" fill="#10b981" name="المداخيل (DH)" radius={[6, 6, 0, 0]} />
              <Bar dataKey="expenses" fill="#ef4444" name="المصاريف (DH)" radius={[6, 6, 0, 0]} />
              <Bar dataKey="profit" fill="#0f766e" name="الربح الصافي (DH)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Late Students List Table (المتأخرون عن الأداء - matching video timestamp 05:37) */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-4 bg-amber-50/60 border-b border-amber-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <div>
              <h3 className="text-xs font-extrabold text-amber-900">
                لائحة التلاميذ المتأخرين عن أداء واجب شهر {selectedMonth}
              </h3>
              <p className="text-[10px] text-amber-700">يمكنك الاتصال بهم أو مراسلتهم مباشرة عبر واتساب</p>
            </div>
          </div>
          <span className="text-xs font-black bg-amber-200 text-amber-900 px-3 py-1 rounded-full">
            {stats.lateStudents?.length || 0} تلميذ متأخر
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-right">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3 w-10 text-center">#</th>
                <th className="p-3">اسم التلميذ</th>
                <th className="p-3">المستوى</th>
                <th className="p-3">رقم الهاتف</th>
                <th className="p-3">الواجب الشهري</th>
                <th className="p-3">المبلغ المستحق</th>
                <th className="p-3 text-center">تذكير عبر واتساب</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {stats.lateStudents && stats.lateStudents.length > 0 ? (
                stats.lateStudents.map((s, idx) => (
                  <tr key={s._id} className="hover:bg-slate-50">
                    <td className="p-3 text-center font-bold text-slate-400">{idx + 1}</td>
                    <td className="p-3 font-extrabold text-slate-900">{s.studentName}</td>
                    <td className="p-3 text-slate-600">{s.level}</td>
                    <td className="p-3 font-mono font-medium text-slate-700" dir="ltr">{s.phone}</td>
                    <td className="p-3 font-bold text-slate-700">{s.totalDue} {t('currency')}</td>
                    <td className="p-3 font-black text-rose-600">{s.remaining || s.totalDue} {t('currency')}</td>
                    <td className="p-3 text-center">
                      <a
                        href={`https://wa.me/${s.phone?.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                          `السلام عليكم، نذكركم بضرورة أداء واجب شهر ${selectedMonth} بمبلغ ${s.remaining || s.totalDue} درهم لمركز أوميغا. وشكراً.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-xs transition"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>مراسلة واتساب</span>
                      </a>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="p-6 text-center text-slate-400">
                    لا يوجد أي تلميذ متأخر في هذا الشهر!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
