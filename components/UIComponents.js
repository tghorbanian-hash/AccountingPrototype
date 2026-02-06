/* Filename: components/UIComponents.js
   Style: Enterprise Compact (Industrial / Excel-like)
*/
import React from 'react';
import { Loader2, ChevronDown } from 'lucide-react';

// --- Design Tokens (Compact Theme) ---
const THEME = {
  colors: {
    primary: 'blue',
    pageBg: 'bg-slate-100',
    panelBg: 'bg-white',
    border: 'border-slate-400', // حاشیه‌های تیره‌تر برای دیده شدن خطوط
    headerBg: 'bg-slate-200',   // رنگ هدرهای طوسی کلاسیک
    inputBg: 'bg-white',
  },
  radius: {
    card: 'rounded-sm',   // گوشه‌های تقریبا تیز
    field: 'rounded-none', // اینپوت‌های کاملا مستطیلی (مثل اکسل)
    btn: 'rounded-sm',
  },
  text: {
    base: 'text-xs',      // سایز فونت پایه کوچک (۱۲ پیکسل)
    header: 'text-sm',
  }
};

// --- 1. Compact Panel (جایگزین کارت) ---
export const Card = ({ children, className = '', noPadding = false, title, headerAction }) => {
  return (
    <div className={`
      ${THEME.colors.panelBg} 
      border ${THEME.colors.border} 
      ${THEME.radius.card} 
      flex flex-col
      shadow-sm
      ${className}
    `}>
      {/* Title Bar (Industrial Style) */}
      {title && (
        <div className={`
          px-3 py-2 border-b ${THEME.colors.border} ${THEME.colors.headerBg} 
          flex items-center justify-between shrink-0 h-10
        `}>
          <h3 className="font-bold text-slate-700 text-xs uppercase tracking-tight">{title}</h3>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      
      {/* Body */}
      <div className={`flex-1 ${noPadding ? '' : 'p-3'}`}>
        {children}
      </div>
    </div>
  );
};

// --- 2. Compact Buttons ---
export const Button = ({ 
  children, variant = 'primary', icon: Icon, isLoading, className = '', onClick, type = 'button', disabled 
}) => {
  // دکمه‌ها ارتفاع کمتری دارند (py-1.5)
  const baseStyle = `flex items-center justify-center gap-2 px-4 py-1.5 ${THEME.radius.btn} font-bold text-xs transition-all active:translate-y-[1px] disabled:opacity-60 disabled:cursor-not-allowed border`;
  
  const variants = {
    primary: `bg-[#0f4c81] text-white border-[#0f4c81] hover:bg-[#0c3b66]`, // آبی کلاسیک صنعتی
    secondary: `bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200`,
    danger: `bg-red-600 text-white border-red-700 hover:bg-red-700`,
    ghost: `bg-transparent text-slate-600 border-transparent hover:bg-slate-200`
  };

  return (
    <button 
      type={type}
      onClick={onClick} 
      disabled={isLoading || disabled}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {isLoading && <Loader2 size={12} className="animate-spin" />}
      {!isLoading && Icon && <Icon size={14} />}
      {children}
    </button>
  );
};

// --- 3. Compact Icon Button ---
export const IconButton = ({ icon: Icon, onClick, color = 'slate', title, className='' }) => {
  return (
    <button 
      onClick={onClick} 
      title={title}
      className={`p-1.5 rounded-sm hover:bg-slate-200 text-slate-600 hover:text-black border border-transparent hover:border-slate-300 transition-all ${className}`}
    >
      <Icon size={14} />
    </button>
  );
};

// --- 4. Inputs (Excel Style) ---
export const InputField = ({ label, icon: Icon, isRtl, className = '', ...props }) => {
  return (
    <div className={`w-full ${className}`}>
      {label && <label className="block text-[11px] font-bold text-slate-600 mb-1">{label}</label>}
      <div className="relative group">
        <input 
          {...props}
          className={`
            w-full bg-white border border-slate-400 
            ${THEME.radius.field} py-1.5 
            ${Icon ? (isRtl ? 'pr-2 pl-2' : 'pl-2 pr-2') : 'px-2'} 
            outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600
            transition-none text-xs text-slate-900 placeholder:text-slate-400
            h-8
          `}
        />
      </div>
    </div>
  );
};

export const SelectField = ({ label, children, isRtl, className = '', ...props }) => {
  return (
    <div className={`w-full ${className}`}>
      {label && <label className="block text-[11px] font-bold text-slate-600 mb-1">{label}</label>}
      <div className="relative">
        <select 
          {...props}
          className={`
            w-full bg-white border border-slate-400 
            ${THEME.radius.field} py-1.5 px-2 appearance-none
            outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600
            text-xs text-slate-900 cursor-pointer h-8
          `}
        >
          {children}
        </select>
        <div className={`absolute inset-y-0 ${isRtl ? 'left-2' : 'right-2'} flex items-center pointer-events-none text-slate-500`}>
          <ChevronDown size={12} />
        </div>
      </div>
    </div>
  );
};

// --- 5. Toggle (Small) ---
export const Toggle = ({ checked, onChange, labelActive, labelInactive }) => {
  return (
    <div className="flex items-center gap-2 cursor-pointer select-none" onClick={() => onChange(!checked)}>
      <div className={`
        w-8 h-4 rounded-full p-0.5 transition-colors duration-100 relative
        ${checked ? `bg-[#0f4c81]` : 'bg-slate-300'}
      `}>
        <div className={`
          w-3 h-3 bg-white rounded-full shadow-sm transition-transform duration-100
          ${checked ? (document.dir === 'rtl' ? '-translate-x-4' : 'translate-x-4') : 'translate-x-0'}
        `}></div>
      </div>
      {(labelActive || labelInactive) && (
         <span className={`text-[11px] font-bold ${checked ? 'text-black' : 'text-slate-500'}`}>
           {checked ? labelActive : labelInactive}
         </span>
      )}
    </div>
  );
};

// --- 6. Badges (Rectangular) ---
export const Badge = ({ children, variant = 'neutral' }) => {
  const styles = {
    success: 'bg-green-100 text-green-800 border-green-300',
    danger: 'bg-red-100 text-red-800 border-red-300',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    info: 'bg-blue-100 text-blue-800 border-blue-300',
    purple: 'bg-purple-100 text-purple-800 border-purple-300',
    neutral: 'bg-slate-100 text-slate-600 border-slate-300',
  };

  return (
    <span className={`px-1.5 py-[1px] rounded-[2px] text-[10px] font-bold border ${styles[variant] || styles.neutral}`}>
      {children}
    </span>
  );
};

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
