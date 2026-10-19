import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  LayoutDashboard,
  GraduationCap,
  CreditCard,
  Users,
  Calendar,
  UserCheck,
  UserX,
  Wallet,
  BarChart3,
  Phone,
  MessageCircle,
  Sparkles
} from 'lucide-react';

export default function Sidebar({ currentPage, onSelectPage, stats }) {
  const { t, isRTL } = useLanguage();

  const menuItems = [
    { id: 'dashboard', label: t('navDashboard'), icon: LayoutDashboard },
    { id: 'students', label: t('navStudents'), icon: GraduationCap, badge: stats?.totalStudents },
    { id: 'payments', label: t('navPayments'), icon: CreditCard, alertBadge: stats?.unpaidCount },
    { id: 'teachers', label: t('navTeachers'), icon: Users, badge: stats?.totalTeachers },
    { id: 'timetable', label: t('navTimetable'), icon: Calendar },
    { id: 'attendance', label: t('navAttendance'), icon: UserCheck, alertBadge: stats?.absencesCount },
    { id: 'departed', label: t('navDeparted'), icon: UserX, badge: stats?.departedCount },
    { id: 'expenses', label: t('navExpenses'), icon: Wallet },
    { id: 'reports', label: t('navReports'), icon: BarChart3 },
  ];

  return (
    <aside className="w-64 md:w-72 bg-[#064e3b] text-white flex flex-col justify-between shrink-0 shadow-2xl relative z-40 min-h-screen">
      {/* Top: Logo & Center Name */}
      <div>
        <div className="p-5 border-b border-emerald-800/60 flex items-center gap-3.5 bg-[#044232]">
          {/* Omega Emblem Logo */}
          <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 p-0.5 shadow-lg flex items-center justify-center shrink-0">
            <div className="w-full h-full bg-[#064e3b] rounded-[14px] flex items-center justify-center text-amber-400">
              <span className="text-2xl font-black tracking-wider">Ω</span>
            </div>
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#064e3b]"></span>
          </div>

          <div className="overflow-hidden">
            <h1 className="text-base font-extrabold text-amber-400 tracking-wide truncate">
              {t('brandName')}
            </h1>
            <p className="text-[11px] text-emerald-200/80 font-medium truncate">
              {t('brandSubtitle')}
            </p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1.5 mt-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectPage(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs md:text-sm font-semibold transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-amber-400 text-slate-900 shadow-md font-bold'
                    : 'text-emerald-100/90 hover:bg-emerald-800/50 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${
                    isActive ? 'text-slate-900' : 'text-emerald-300'
                  }`} />
                  <span>{item.label}</span>
                </div>

                {/* Badges */}
                <div className="flex items-center gap-1.5">
                  {item.alertBadge > 0 && (
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                      isActive 
                        ? 'bg-red-600 text-white' 
                        : 'bg-amber-500 text-slate-950 font-extrabold'
                    }`}>
                      {item.alertBadge}
                    </span>
                  )}
                  {item.badge !== undefined && !item.alertBadge && (
                    <span className={`text-[11px] px-2 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-emerald-900/20 text-slate-900 font-bold'
                        : 'bg-emerald-800 text-emerald-200'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </div>

                {/* Active indicator bar */}
                {isActive && (
                  <span className={`absolute ${isRTL ? 'right-0' : 'left-0'} top-2 bottom-2 w-1.5 bg-slate-900 rounded-full`}></span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Contact Info (as seen in video demo) */}
      <div className="p-4 border-t border-emerald-800/60 bg-[#044232]">
        <div className="rounded-xl p-3 bg-emerald-800/40 border border-emerald-700/50 text-center">
          <p className="text-[11px] font-medium text-emerald-200 mb-1.5">
            مركز الدعم المدرسي والتقوية
          </p>
          <a
            href="https://wa.me/212705782737"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-2 px-3 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg text-xs font-bold transition shadow-sm"
          >
            <MessageCircle className="w-4 h-4 fill-slate-950" />
            <span dir="ltr">0705782737</span>
          </a>
        </div>
      </div>
    </aside>
  );
}
