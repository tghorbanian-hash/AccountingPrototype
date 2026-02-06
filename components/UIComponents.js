import React from 'react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

// --- Design Tokens & Constants ---
// تغییر این بخش، کل ظاهر نرم‌افزار را تغییر می‌دهد
const THEME = {
  colors: {
    primary: 'blue',      // رنگ اصلی برند
    secondary: 'slate',   // رنگ‌های فرعی
    glassBg: 'bg-white/70', // پس‌زمینه شیشه‌ای (70% شفافیت)
    glassBorder: 'border-white/50', // حاشیه شیشه‌ای
    glassBlur: 'backdrop-blur-xl', // میزان ماتی پشت شیشه
  },
  radius: {
    card: 'rounded-[1.5rem]',
    button: 'rounded-xl',
    input: 'rounded-xl',
  }
};

// --- 1. Glass Card (کارت شیشه‌ای) ---
// جایگزین تمام div هایی که bg-white دارند می‌شود
export const Card = ({ children, className = '', noPadding = false }) => {
  return (
    <div className={`
      ${THEME.colors.glassBg} 
      ${THEME.colors.glassBlur} 
      border ${THEME.colors.glassBorder} 
      ${THEME.radius.card} 
      shadow-xl shadow-slate-200/50 
      ${noPadding ? '' : 'p-6'} 
      ${className}
    `}>
      {children}
    </div>
  );
};

// --- 2. Primary & Secondary Buttons ---
export const Button = ({ 
  children, variant = 'primary', icon: Icon, isLoading, className = '', onClick 
}) => {
  const baseStyle = `flex items-center justify-center gap-2 px-5 py-3 ${THEME.radius.button} font-bold text-sm transition-all active:scale-95 duration-200`;
  
  const variants = {
    primary: `bg-${THEME.colors.primary}-600 text-white hover:bg-${THEME.colors.primary}-700 shadow-lg shadow-${THEME.colors.primary}-200`,
    secondary: `bg-white text-slate-600 border border-slate-200 hover:bg-slate-50`,
    danger: `bg-red-50 text-red-600 border border-red-100 hover:bg-red-100`,
    ghost: `text-slate-500 hover:text-${THEME.colors.primary}-600 hover:bg-${THEME.colors.primary}-50`
  };

  return (
    <button 
      onClick={onClick} 
      disabled={isLoading}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {isLoading && <Loader2 size={16} className="animate-spin" />}
      {!isLoading && Icon && <Icon size={18} />}
      {children}
    </button>
  );
};

// --- 3. Standard Input Field ---
export const InputField = ({ label, icon: Icon, isRtl, ...props }) => {
  return (
    <div className="w-full">
      {label && <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-1">{label}</label>}
      <div className="relative group">
        {Icon && (
          <div className={`absolute inset-y-0 ${isRtl ? 'right-4' : 'left-4'} flex items-center text-slate-400 group-focus-within:text-${THEME.colors.primary}-600 transition-colors`}>
            <Icon size={20} />
          </div>
        )}
        <input 
          {...props}
          className={`
            w-full bg-slate-50/50 border border-slate-200 
            ${THEME.radius.input} py-3 
            ${Icon ? (isRtl ? 'pr-12 pl-4' : 'pl-12 pr-4') : 'px-4'} 
            outline-none focus:border-${THEME.colors.primary}-500 focus:ring-4 focus:ring-${THEME.colors.primary}-50/50 
            transition-all text-sm font-medium text-slate-700 placeholder:text-slate-400
          `}
        />
      </div>
    </div>
  );
};

// --- 4. Status Badge ---
export const Badge = ({ status, text, type = 'neutral' }) => {
  const styles = {
    success: 'bg-emerald-100 text-emerald-700',
    danger: 'bg-rose-100 text-rose-700',
    warning: 'bg-amber-100 text-amber-700',
    info: 'bg-blue-100 text-blue-700',
    neutral: 'bg-slate-100 text-slate-600',
  };
  
  // اگر status پاس داده شود، رنگ را خودکار انتخاب میکند
  let appliedStyle = styles[type];
  if (status === true || status === 'active' || status === 'paid') appliedStyle = styles.success;
  if (status === false || status === 'inactive' || status === 'pending') appliedStyle = styles.danger;

  return (
    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wide ${appliedStyle}`}>
      {text}
    </span>
  );
};

// Export to Window (for no-build environment)
window.UI = {
  Card,
  Button,
  InputField,
  Badge,
  THEME
};
