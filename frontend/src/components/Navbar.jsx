import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Bell, Globe, ChevronDown, CheckCircle2, AlertTriangle, MessageCircle, User } from 'lucide-react';

export default function Navbar({ stats, onSelectPage }) {
  const { lang, setLang, t, isRTL } = useLanguage();
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  const unpaidCount = stats?.unpaidCount || 0;
  const lateStudents = stats?.lateStudents || [];

  const languages = [
    { code: 'ar', label: 'العربية', flag: '🇲🇦' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
  ];

  const currentLang = languages.find(l => l.code === lang) || languages[0];

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-6 py-3.5 flex items-center justify-between shadow-sm">
      {/* Salutation / Admin Greeting */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <h2 className="text-lg md:text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <span>{t('welcomeAdmin')}</span>
          </h2>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            {t('online')}
          </span>
        </div>
      </div>

      {/* Right Controls: Notifications, Language, Profile */}
      <div className="flex items-center gap-3">
        {/* WhatsApp Direct Quick Action */}
        <a 
          href="https://wa.me/212705782737" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all transform hover:scale-[1.02]"
        >
          <MessageCircle className="w-4 h-4 text-emerald-100" />
          <span>0705782737</span>
        </a>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
            title="الإشعارات"
          >
            <Bell className="w-5 h-5" />
            {unpaidCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] font-black flex items-center justify-center animate-bounce">
                {unpaidCount}
              </span>
            )}
          </button>

          {showNotifMenu && (
            <div className={`absolute ${isRTL ? 'left-0' : 'right-0'} mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-100 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150`}>
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <span className="font-bold text-slate-800 text-sm flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  {t('lateStudentsTitle')}
                </span>
                <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                  {unpaidCount} {t('unpaid')}
                </span>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
                {lateStudents.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-500">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-1" />
                    جميع التلاميذ قاموا بتسوية الواجبات!
                  </div>
                ) : (
                  lateStudents.map((s) => (
                    <div key={s._id} className="p-3 hover:bg-amber-50/50 flex items-center justify-between transition text-xs">
                      <div>
                        <p className="font-bold text-slate-800">{s.studentName}</p>
                        <p className="text-slate-500">{s.level} • {s.totalDue} {t('currency')}</p>
                      </div>
                      <a
                        href={`https://wa.me/${s.phone?.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(t('whatsappReminderText'))}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2 py-1 rounded-md"
                      >
                        <MessageCircle className="w-3 h-3 text-emerald-600" />
                        تذكير
                      </a>
                    </div>
                  ))
                )}
              </div>
              <div className="px-4 pt-2 border-t border-slate-100 text-center">
                <button
                  onClick={() => {
                    setShowNotifMenu(false);
                    onSelectPage('payments');
                  }}
                  className="text-xs font-bold text-teal-700 hover:text-teal-900"
                >
                  {t('viewAll')} {t('navPayments')} →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Language Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowLangMenu(!showLangMenu)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition shadow-xs"
          >
            <span className="text-base">{currentLang.flag}</span>
            <span className="hidden sm:inline">{currentLang.label}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showLangMenu && (
            <div className={`absolute ${isRTL ? 'left-0' : 'right-0'} mt-2 w-36 bg-white rounded-xl shadow-lg border border-slate-100 py-1.5 z-50`}>
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => {
                    setLang(l.code);
                    setShowLangMenu(false);
                  }}
                  className={`w-full text-right ${isRTL ? 'text-right' : 'text-left'} px-3 py-2 text-xs flex items-center gap-2.5 font-medium hover:bg-teal-50 hover:text-teal-900 transition ${
                    lang === l.code ? 'bg-teal-50 text-teal-800 font-bold' : 'text-slate-700'
                  }`}
                >
                  <span className="text-base">{l.flag}</span>
                  <span>{l.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Admin Avatar */}
        <div className="flex items-center gap-2 pl-1">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-800 to-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-md ring-2 ring-emerald-100">
            A
          </div>
        </div>
      </div>
    </header>
  );
}
