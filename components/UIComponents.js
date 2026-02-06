/* Filename: components/UIComponents.js
   Style: Modular / Structured (Enterprise ERP)
*/
import React from 'react';
import { Loader2, ChevronDown } from 'lucide-react';

// --- Design Tokens (Enterprise Modular Theme) ---
const THEME = {
  colors: {
    primary: 'blue',      // رنگ اصلی سازمانی
    pageBg: 'bg-slate-100', // رنگ پس‌زمینه کل صفحه (خاکستری روشن)
    cardBg: 'bg-white',     // رنگ کارت‌ها (سفید مطلق)
    border: 'border-slate-300', // رنگ حاشیه‌ها (مشخص و قوی)
    headerBg: 'bg-slate-50',    // رنگ هدر جداول و پنل‌ها
  },
  radius: {
    card: 'rounded-lg',   // گردی کم و استاندارد
    field: 'rounded-md',  // اینپوت‌های مکعبی‌تر
  },
  shadows: {
    card: 'shadow-sm',    // سایه کم برای تمیزی
    popover: 'shadow-lg',
  }
};

// --- 1. Modular Card (باکس اصلی محتوا) ---
// ویژگی: دارای نوار رنگی در بالا برای تفکیک ماژول‌ها
export const Card = ({ children, className = '', noPadding = false, title, icon: Icon, headerAction }) => {
  return (
    <div className={`
      ${THEME.colors.cardBg} 
      border ${THEME.colors.border} 
      ${THEME.radius.card} 
      ${THEME.shadows.card} 
      flex flex-col
      overflow-hidden
      ${className}
    `}>
      {/* Card Header (Optional) */}
      {title && (
        <div className={`px-4 py-3 border-b ${THEME.colors.border} ${THEME.colors.headerBg} flex items-center justify-between shrink-0`}>
          <div className="flex items-center gap-2">
            {Icon && <Icon size={18} className={`text-${THEME.colors.primary}-600`} />}
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">{title}</h3>
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      
      {/* Card Body */}
      <div className={`flex-1 ${noPadding ? '' : 'p-5'}`}>
        {children}
      </div>
    </div>
  );
};

// --- 2. Enterprise Buttons ---
export const Button = ({ 
  children, variant = 'primary', icon: Icon, isLoading, className = '', onClick, type = 'button', disabled 
}) => {
  const baseStyle = `flex items-center justify-center gap-2 px-4 py-2 ${THEME.radius.field} font-bold text-xs transition-all active:translate-y-px duration-150 disabled:opacity-60 disabled:cursor-not-allowed border`;
  
  const variants = {
    // دکمه اصلی: توپر، آبی تیره
    primary: `bg-${THEME.colors.primary}-700 text-white border-${THEME.colors.primary}-700 hover:bg-${THEME.colors.primary}-800`,
    // دکمه ثانویه: سفید با بوردر خاکستری
    secondary: `bg-white text-slate-700 border-slate-300 hover:bg-slate-50 hover:text-slate-900`,
    // دکمه خطر: قرمز ملایم
    danger: `bg-white text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300`,
    // دکمه متنی
    ghost: `bg-transparent text-slate-600 border-transparent hover:bg-slate-100`
  };

  return (
    <button 
      type={type}
      onClick={onClick} 
      disabled={isLoading || disabled}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {isLoading && <Loader2 size={14} className="animate-spin" />}
      {!isLoading && Icon && <Icon size={16} />}
      {children}
    </button>
  );
};

// --- 3. Icon Button ---
export const IconButton = ({ icon: Icon, onClick, color = 'slate', title, className='' }) => {
  return (
    <button 
      onClick={onClick} 
      title={title}
      className={`p-2 rounded hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors border border-transparent hover:border-slate-200 ${className}`}
    >
      <Icon size={16} />
    </button>
  );
};

// --- 4. Inputs & Forms ---
export const InputField = ({ label, icon: Icon, isRtl, className = '', ...props }) => {
  return (
    <div className={`w-full ${className}`}>
      {label && <label className="block text-xs font-bold text-slate-700 mb-1.5">{label}</label>}
      <div className="relative group">
        {Icon && (
          <div className={`absolute inset-y-0 ${isRtl ? 'right-3' : 'left-3'} flex items-center text-slate-400`}>
            <Icon size={16} />
          </div>
        )}
        <input 
          {...props}
          className={`
            w-full bg-white border border-slate-300 
            ${THEME.radius.field} py-2 
            ${Icon ? (isRtl ? 'pr-9 pl-3' : 'pl-9 pr-3') : 'px-3'} 
            outline-none focus:border-${THEME.colors.primary}-600 focus:ring-1 focus:ring-${THEME.colors.primary}-600
            transition-all text-sm text-slate-800 placeholder:text-slate-400
          `}
        />
      </div>
    </div>
  );
};

export const SelectField = ({ label, children, isRtl, className = '', ...props }) => {
  return (
    <div className={`w-full ${className}`}>
      {label && <label className="block text-xs font-bold text-slate-700 mb-1.5">{label}</label>}
      <div className="relative">
        <select 
          {...props}
          className={`
            w-full bg-white border border-slate-300 
            ${THEME.radius.field} py-2 px-3 appearance-none
            outline-none focus:border-${THEME.colors.primary}-600 focus:ring-1 focus:ring-${THEME.colors.primary}-600
            transition-all text-sm text-slate-800 cursor-pointer
          `}
        >
          {children}
        </select>
        <div className={`absolute inset-y-0 ${isRtl ? 'left-3' : 'right-3'} flex items-center pointer-events-none text-slate-500`}>
          <ChevronDown size={14} />
        </div>
      </div>
    </div>
  );
};

// --- 5. Toggle Switch ---
export const Toggle = ({ checked, onChange, labelActive, labelInactive }) => {
  return (
    <div className="flex items-center gap-3 cursor-pointer select-none" onClick={() => onChange(!checked)}>
      <div className={`
        w-9 h-5 rounded-full p-0.5 transition-colors duration-200 relative
        ${checked ? `bg-${THEME.colors.primary}-700` : 'bg-slate-300'}
      `}>
        <div className={`
          w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200
          ${checked ? (document.dir === 'rtl' ? '-translate-x-4' : 'translate-x-4') : 'translate-x-0'}
        `}></div>
      </div>
      {(labelActive || labelInactive) && (
         <span className={`text-xs font-bold ${checked ? 'text-slate-800' : 'text-slate-500'}`}>
           {checked ? labelActive : labelInactive}
         </span>
      )}
    </div>
  );
};

// --- 6. Badges (Solid & Crisp) ---
export const Badge = ({ children, variant = 'neutral' }) => {
  const styles = {
    success: 'bg-green-100 text-green-800 border-green-200',
    danger: 'bg-red-100 text-red-800 border-red-200',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    info: 'bg-blue-100 text-blue-800 border-blue-200',
    purple: 'bg-purple-100 text-purple-800 border-purple-200',
    neutral: 'bg-slate-100 text-slate-600 border-slate-200',
  };

  return (
    <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${styles[variant] || styles.neutral}`}>
      {children}
    </span>
  );
};

// --- Export ---
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
