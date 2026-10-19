import React from 'react';

export default function StatCard({ title, value, unit, icon: Icon, color = 'teal', subtitle, onClick }) {
  const colorMap = {
    teal: {
      bg: 'bg-teal-50',
      text: 'text-teal-700',
      border: 'border-teal-200/80',
      iconBg: 'bg-teal-600 text-white',
      badge: 'bg-teal-100 text-teal-800'
    },
    emerald: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200/80',
      iconBg: 'bg-emerald-600 text-white',
      badge: 'bg-emerald-100 text-emerald-800'
    },
    amber: {
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-200/80',
      iconBg: 'bg-amber-500 text-white',
      badge: 'bg-amber-100 text-amber-800'
    },
    rose: {
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      border: 'border-rose-200/80',
      iconBg: 'bg-rose-600 text-white',
      badge: 'bg-rose-100 text-rose-800'
    },
    blue: {
      bg: 'bg-sky-50',
      text: 'text-sky-700',
      border: 'border-sky-200/80',
      iconBg: 'bg-sky-600 text-white',
      badge: 'bg-sky-100 text-sky-800'
    },
    indigo: {
      bg: 'bg-indigo-50',
      text: 'text-indigo-700',
      border: 'border-indigo-200/80',
      iconBg: 'bg-indigo-600 text-white',
      badge: 'bg-indigo-100 text-indigo-800'
    }
  };

  const c = colorMap[color] || colorMap.teal;

  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:border-teal-400' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-xs font-semibold text-slate-500 mb-1">{title}</p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </span>
            {unit && <span className="text-xs font-bold text-slate-500">{unit}</span>}
          </div>
          {subtitle && (
            <p className="text-[11px] font-medium text-slate-400 mt-1">{subtitle}</p>
          )}
        </div>

        <div className={`w-12 h-12 rounded-2xl ${c.iconBg} flex items-center justify-center shadow-md shrink-0`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
