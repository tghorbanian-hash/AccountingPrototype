/* Filename: components/UIComponents.js
   Description: Centralized Design System (Glassmorphism Theme)
   Author: Gemini for Product Manager
*/

import React from 'react';
import { Loader2, ChevronDown } from 'lucide-react';

// --- Design Tokens (تنظیمات مرکزی ظاهر سیستم) ---
const THEME = {
  colors: {
    primary: 'blue',      // رنگ اصلی (قابل تغییر به purple, emerald, etc)
    glassBg: 'bg-white/60', // پس‌زمینه شیشه‌ای (شفافیت ۶۰٪)
    glassBorder: 'border-white/40', // حاشیه سفید نیمه‌شفاف
    glassBlur: 'backdrop-blur-xl', // تاری پس‌زمینه (Blur)
    surface: 'bg-white/40', // سطوح داخلی کارت‌ها
  },
  radius: {
    card: 'rounded-[1.5rem]', // گردی زیاد برای کارت‌ها
    field: 'rounded-xl',      // گردی اینپوت‌ها و دکمه‌ها
  },
  shadows: {
    card: 'shadow-2xl shadow-slate-200/50',
    soft: 'shadow-sm',
  }
};

// --- 1. Glass Card (کانتینر اصلی) ---
export const Card = ({ children, className = '', noPadding = false, isSurface = false }) => {
  const baseClass = isSurface 
    ? `${THEME.colors.surface} border border-white/20` // کارت‌های داخلی (تیره تر)
    : `${THEME.colors.glassBg} ${THEME.colors.glassBlur} border ${THEME.colors.glassBorder} ${THEME.shadows.card}`; // کارت اصلی
  
  return (
    <div className={`
      ${baseClass} 
      ${THEME.radius.card} 
      ${noPadding ? '' : 'p-6'} 
      ${className}
    `}>
      {children}
    </div>
  );
};

// --- 2. Buttons (دکمه‌ها) ---
export const Button = ({ 
  children, variant = 'primary', icon: Icon, isLoading, className = '', onClick, type = 'button', disabled 
}) => {
  const baseStyle = `flex items-center justify-center gap-2 px-5 py-3 ${THEME.radius.field} font-bold text-xs transition-all active:scale-95 duration-200 disabled:opacity-50 disabled:cursor-not-allowed`;
  
  const variants = {
    primary: `bg-${THEME.colors.primary}-600 text-white hover:bg-${THEME.colors.primary}-700 shadow-lg shadow-${THEME.colors.primary}-200 border border-transparent`,
    secondary: `bg-white/50 text-slate-700 border border-white/50 hover:bg-white hover:text-${THEME.colors.primary}-600 hover:border-${THEME.colors.primary}-200`,
    danger: `bg-red-50/80 text-red-600 border border-red-100 hover:bg-red-100`,
    ghost: `text-slate-500 hover:text-${THEME.colors.primary}-600 hover:bg-${THEME.colors.primary}-50/50`
  };

  return (
    <button 
      type={type}
      onClick={onClick} 
      disabled={isLoading || disabled}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {isLoading && <Loader2 size={16} className="animate-spin" />}
      {!isLoading && Icon && <Icon size={16} />}
      {children}
    </button>
  );
};

// --- 3. Icon Button (دکمه‌های کوچک آیکون‌دار) ---
export const IconButton = ({ icon: Icon, onClick, color = 'slate', title }) => {
  const colors = {
    slate: 'text-slate-500 hover:bg-slate-100/50 hover:text-slate-700',
    blue: 'text-blue-500 hover:bg-blue-50/50 hover:text-blue-700',
    red: 'text-red-500 hover:bg-red-50/50 hover:text-red-700',
    purple: 'text-purple-500 hover:bg-purple-50/50 hover:text-purple-700',
  };

  return (
    <button 
      onClick={onClick} 
      title={title}
      className={`p-2 rounded-lg transition-colors ${colors[color] || colors.slate}`}
    >
      <Icon size={16} />
    </button>
  );
};

// --- 4. Inputs & Selects (فیلدهای ورودی) ---
export const InputField = ({ label, icon: Icon, isRtl, className = '', ...props }) => {
  return (
    <div className={`w-full ${className}`}>
      {label && <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 px-1">{label}</label>}
      <div className="relative group">
        {Icon && (
          <div className={`absolute inset-y-0 ${isRtl ? 'right-4' : 'left-4'} flex items-center text-slate-400 group-focus-within:text-${THEME.colors.primary}-600 transition-colors`}>
            <Icon size={18} />
          </div>
        )}
        <input 
          {...props}
          className={`
            w-full bg-white/50 border border-slate-200/60 
            ${THEME.radius.field} py-3 
            ${Icon ? (isRtl ? 'pr-11 pl-4' : 'pl-11 pr-4') : 'px-4'} 
            outline-none focus:border-${THEME.colors.primary}-500 focus:ring-4 focus:ring-${THEME.colors.primary}-500/10 focus:bg-white
            transition-all text-xs font-bold text-slate-700 placeholder:text-slate-400
          `}
        />
      </div>
    </div>
  );
};

export const SelectField = ({ label, children, isRtl, className = '', ...props }) => {
  return (
    <div className={`w-full ${className}`}>
      {label && <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 px-1">{label}</label>}
      <div className="relative">
        <select 
          {...props}
          className={`
            w-full bg-white/50 border border-slate-200/60 
            ${THEME.radius.field} py-3 px-4 appearance-none
            outline-none focus:border-${THEME.colors.primary}-500 focus:ring-4 focus:ring-${THEME.colors.primary}-500/10 focus:bg-white
            transition-all text-xs font-bold text-slate-700 cursor-pointer
          `}
        >
          {children}
        </select>
        <div className={`absolute inset-y-0 ${isRtl ? 'left-3' : 'right-3'} flex items-center pointer-events-none text-slate-400`}>
          <ChevronDown size={14} />
        </div>
      </div>
    </div>
  );
};

// --- 5. Toggle Switch (برای وضعیت فعال/غیرفعال) ---
export const Toggle = ({ checked, onChange, labelActive, labelInactive }) => {
  return (
    <div className="flex items-center gap-3 cursor-pointer" onClick={() => onChange(!checked)}>
      <div className={`
        w-10 h-6 rounded-full p-1 transition-colors duration-300 relative
        ${checked ? `bg-${THEME.colors.primary}-500` : 'bg-slate-300'}
      `}>
        <div className={`
          w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-300
          ${checked ? (document.dir === 'rtl' ? '-translate-x-4' : 'translate-x-4') : 'translate-x-0'}
        `}></div>
      </div>
      {(labelActive || labelInactive) && (
         <span className={`text-xs font-bold ${checked ? `text-${THEME.colors.primary}-600` : 'text-slate-400'}`}>
           {checked ? labelActive : labelInactive}
         </span>
      )}
    </div>
  );
};

// --- 6. Badges (نشانگرها) ---
export const Badge = ({ children, variant = 'neutral' }) => {
  const styles = {
    success: 'bg-emerald-100/80 text-emerald-700 border-emerald-200',
    danger: 'bg-rose-100/80 text-rose-700 border-rose-200',
    warning: 'bg-amber-100/80 text-amber-700 border-amber-200',
    info: 'bg-blue-100/80 text-blue-700 border-blue-200',
    purple: 'bg-purple-100/80 text-purple-700 border-purple-200',
    neutral: 'bg-slate-100/80 text-slate-600 border-slate-200',
  };

  return (
    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wide border ${styles[variant] || styles.neutral}`}>
      {children}
    </span>
  );
};

// --- Export to Window ---
// این بخش باعث می‌شود بدون نیاز به ایمپورت پیچیده، در کل پروژه به UI دسترسی داشته باشید
window.UI = {
  Card,
  Button,
  IconButton,
  InputField,
  SelectField,
  Toggle,
  Badge,
  THEME
};
