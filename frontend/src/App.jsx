import React, { useState, useEffect } from 'react';
import { useLanguage } from './context/LanguageContext';
import { api } from './utils/api';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Payments from './pages/Payments';
import Teachers from './pages/Teachers';
import Timetable from './pages/Timetable';
import Attendance from './pages/Attendance';
import DepartedStudents from './pages/DepartedStudents';
import Expenses from './pages/Expenses';
import Reports from './pages/Reports';
import ReceiptModal from './components/ReceiptModal';
import TeacherListModal from './components/TeacherListModal';
import TimetablePrintModal from './components/TimetablePrintModal';
import { MessageCircle } from 'lucide-react';

export default function App() {
  const { isRTL } = useLanguage();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [stats, setStats] = useState(null);

  // Global Modals State
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  const [selectedTeacherData, setSelectedTeacherData] = useState(null);
  const [showTeacherModal, setShowTeacherModal] = useState(false);

  const [timetableSessions, setTimetableSessions] = useState([]);
  const [showTimetableModal, setShowTimetableModal] = useState(false);

  const fetchStats = async () => {
    try {
      const data = await api.getDashboardStats('يناير 2026');
      setStats(data);
    } catch (e) {
      console.error('Erreur chargement stats:', e);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleViewReceipt = async (payment) => {
    try {
      const receiptData = await api.getReceipt(payment._id || payment.receiptNumber);
      setSelectedReceipt(receiptData);
      setShowReceiptModal(true);
    } catch (e) {
      // Fallback avec les données locales du paiement
      setSelectedReceipt({
        receiptNumber: payment.receiptNumber || 'N5601',
        date: payment.paymentDate || new Date().toISOString(),
        studentName: payment.studentName,
        level: payment.level || 'البكالوريا',
        phone: payment.phone || '06283701609',
        month: payment.month || 'يناير 2026',
        amountPaid: payment.amountPaid || payment.totalDue,
        totalDue: payment.totalDue,
        remaining: payment.remaining || 0,
        status: payment.status || 'paid',
        subjects: [
          { subject: 'الرياضيات', teacher: 'أستاذ عادل السعدي' },
          { subject: 'اللغة الإنجليزية', teacher: 'أستاذة خديجة بنجلون' }
        ]
      });
      setShowReceiptModal(true);
    }
  };

  const handleOpenTeacherList = (teacherData) => {
    setSelectedTeacherData(teacherData);
    setShowTeacherModal(true);
  };

  const handleOpenTimetablePrint = (sessions) => {
    setTimetableSessions(sessions);
    setShowTimetableModal(true);
  };

  return (
    <div className={`flex min-h-screen bg-[#f8fafc] text-slate-800 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Sidebar Navigation */}
      <Sidebar
        currentPage={currentPage}
        onSelectPage={setCurrentPage}
        stats={stats}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar
          stats={stats}
          onSelectPage={setCurrentPage}
        />

        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {currentPage === 'dashboard' && (
            <Dashboard
              stats={stats}
              onSelectPage={setCurrentPage}
              onViewReceipt={handleViewReceipt}
            />
          )}

          {currentPage === 'students' && (
            <Students onRefreshStats={fetchStats} />
          )}

          {currentPage === 'payments' && (
            <Payments
              onViewReceipt={handleViewReceipt}
              onRefreshStats={fetchStats}
            />
          )}

          {currentPage === 'teachers' && (
            <Teachers onOpenTeacherList={handleOpenTeacherList} />
          )}

          {currentPage === 'timetable' && (
            <Timetable onOpenTimetablePrint={handleOpenTimetablePrint} />
          )}

          {currentPage === 'attendance' && (
            <Attendance onRefreshStats={fetchStats} />
          )}

          {currentPage === 'departed' && (
            <DepartedStudents onRefreshStats={fetchStats} />
          )}

          {currentPage === 'expenses' && (
            <Expenses onRefreshStats={fetchStats} />
          )}

          {currentPage === 'reports' && (
            <Reports />
          )}
        </main>
      </div>

      {/* Global Modals */}
      <ReceiptModal
        isOpen={showReceiptModal}
        onClose={() => setShowReceiptModal(false)}
        receiptData={selectedReceipt}
      />

      <TeacherListModal
        isOpen={showTeacherModal}
        onClose={() => setShowTeacherModal(false)}
        teacherData={selectedTeacherData}
      />

      <TimetablePrintModal
        isOpen={showTimetableModal}
        onClose={() => setShowTimetableModal(false)}
        sessions={timetableSessions}
      />

      {/* Floating WhatsApp Bubble */}
      <a
        href="https://wa.me/212705782737?text=السلام%20عليكم،%20أريد%20معلومات%20حول%20نظام%20إدارة%20المركز%20المدرسي"
        target="_blank"
        rel="noopener noreferrer"
        className={`fixed bottom-6 ${isRTL ? 'left-6' : 'right-6'} z-50 flex items-center gap-2.5 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-full shadow-2xl transition transform hover:scale-110 group`}
      >
        <MessageCircle className="w-5 h-5 fill-white animate-pulse" />
        <span className="hidden sm:inline font-bold">تواصل معنا عبر واتساب</span>
        <span className="font-mono text-amber-300" dir="ltr">0705782737</span>
      </a>
    </div>
  );
}
