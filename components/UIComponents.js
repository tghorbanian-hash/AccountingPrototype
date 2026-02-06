/* Filename: components/UIComponents.js
   Style: Pro-Grid (Linear/Vercel Inspired) - High Density, Ultra Clean
*/
import React from 'react';
import { Loader2, ChevronDown } from 'lucide-react';

// --- Design Tokens (Pro-Grid) ---
const THEME = {
  colors: {
    primary: 'blue',       // رنگ اصلی (می‌توانید به indigo یا violet تغییر دهید)
    pageBg: 'bg-white',    // پس‌زمینه کل صفحه سفید مطلق برای تمیزی
    surface: 'bg-zinc-50', // رنگ هدرها و پنل‌های جانبی
    border: 'border-zinc-200', // رنگ خطوط جداکننده (خیلی ملایم)
    borderDark: 'border-zinc-300', // رنگ خطوط اینپوت‌ها
    textMain: 'text-zinc-900', // رنگ متن اصلی (تقریبا مشکی)
    textMuted: 'text-zinc-500', // رنگ متن‌های توضیحی
  },
  radius: {
    card: 'rounded-lg',    // گردی کانتینر اصلی
    elem: 'rounded-md',    // گردی دکمه‌ها و اینپوت‌ها (۶ پیکسل - مدرن)
  },
  typography: {
    xs: 'text-[11px] leading-3', // فونت خیلی ریز برای تگ‌ها
    sm: 'text-[13px] leading-5', // فونت استاندارد سیستم (۱۳ پیکسل)
    base: 'text-[14px] leading-6',
  }
};

// --- 1. Pro Surface (کانتینر اصلی) ---
// در این سبک، کارت‌ها سایه ندارند، فقط یک بوردر ظریف دارند
export const Card = ({ children, className = '', noPadding = false, title, headerAction, footer }) => {
  return (
    <div className={`
      bg-white 
      border ${THEME.colors.border} 
      ${THEME.radius.card} 
      flex flex-col
      overflow-hidden
      ${className}
    `}>
      {/* Header: Minimalist border-bottom */}
      {title && (
        <div className={`px-4 py-3 border-b ${THEME.colors.border} flex items-center justify-between shrink-0 ${THEME.colors.surface}`}>
          <h3 className={`font-semibold ${THEME.colors.textMain} text-sm tracking-tight`}>{title}</h3>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      
      {/* Body */}
      <div className={`flex-1 ${noPadding ? '' : 'p-4'}`}>
        {children}
      </div>

      {/* Footer (Optional) */}
      {footer && (
        <div className={`px-4 py-3 border-t ${THEME.colors.border} ${THEME.colors.surface}`}>
          {footer}
        </div>
      )}
    </div>
  );
};

// --- 2. Pro Buttons ---
export const Button = ({ 
  children, variant = 'primary', icon: Icon, isLoading, className = '', onClick, type = 'button', disabled 
}) => {
  // دکمه‌ها ارتفاع کم (h-8) و فونت ۱۳ پیکسل دارند
  const baseStyle = `flex items-center justify-center gap-2 px-3 h-8 ${THEME.radius.elem} font-medium text-[13px] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed select-none`;
  
  const variants = {
    // Primary: رنگ تیره و قوی، بدون سایه
    primary: `bg-${THEME.colors.primary}-600 text-white hover:bg-${THEME.colors.primary}-700 shadow-sm border border-transparent`,
    // Secondary: سفید با بوردر مشخص
    secondary: `bg-white text-zinc-700 border ${THEME.colors.borderDark} hover:bg-zinc-50 hover:border-zinc-400 hover:text-zinc-900 shadow-sm`,
    // Ghost: برای دکمه‌های کم اهمیت
    ghost: `bg-transparent text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900`,
    // Danger
    danger: `bg-white text-red-600 border border-red-200 hover:bg-red-50`,
  };

  return (
    <button 
      type={type}
      onClick={onClick} 
      disabled={isLoading || disabled}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {isLoading && <Loader2 size={14} className="animate-spin" />}
      {!isLoading && Icon && <Icon size={14} />}
      {children}
    </button>
  );
};

// --- 3. Icon Button (Minimal) ---
export const IconButton = ({ icon: Icon, onClick, color = 'neutral', title, className='' }) => {
  const colors = {
    neutral: 'text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100',
    primary: `text-${THEME.colors.primary}-500 hover:bg-${THEME.colors.primary}-50 hover:text-${THEME.colors.primary}-700`,
    danger: 'text-zinc-400 hover:text-red-600 hover:bg-red-50',
  };

  return (
    <button 
      onClick={onClick} 
      title={title}
      className={`p-1.5 ${THEME.radius.elem} transition-colors ${colors[color] || colors.neutral} ${className}`}
    >
      <Icon size={16} strokeWidth={2} />
    </button>
  );
};

// --- 4. Inputs (Pro Style) ---
export const InputField = ({ label, icon: Icon, isRtl, className = '', ...props }) => {
  return (
    <div className={`w-full ${className}`}>
      {label && <label className="block text-[12px] font-medium text-zinc-700 mb-1.5">{label}</label>}
      <div className="relative group">
        {Icon && (
          <div className={`absolute inset-y-0 ${isRtl ? 'right-2.5' : 'left-2.5'} flex items-center text-zinc-400 group-focus-within:text-${THEME.colors.primary}-600`}>
            <Icon size={14} />
          </div>
        )}
        <input 
          {...props}
          className={`
            w-full bg-white border ${THEME.colors.borderDark}
            ${THEME.radius.elem} h-9 
            ${Icon ? (isRtl ? 'pr-9 pl-3' : 'pl-9 pr-3') : 'px-3'} 
            outline-none 
            focus:border-${THEME.colors.primary}-500 focus:ring-1 focus:ring-${THEME.colors.primary}-500
            transition-all text-[13px] text-zinc-900 placeholder:text-zinc-400 shadow-sm
          `}
        />
      </div>
    </div>
  );
};

export const SelectField = ({ label, children, isRtl, className = '', ...props }) => {
  return (
    <div className={`w-full ${className}`}>
      {label && <label className="block text-[12px] font-medium text-zinc-700 mb-1.5">{label}</label>}
      <div className="relative">
        <select 
          {...props}
          className={`
            w-full bg-white border ${THEME.colors.borderDark}
            ${THEME.radius.elem} h-9 px-3 appearance-none
            outline-none 
            focus:border-${THEME.colors.primary}-500 focus:ring-1 focus:ring-${THEME.colors.primary}-500
            text-[13px] text-zinc-900 cursor-pointer shadow-sm
          `}
        >
          {children}
        </select>
        <div className={`absolute inset-y-0 ${isRtl ? 'left-2.5' : 'right-2.5'} flex items-center pointer-events-none text-zinc-500`}>
          <ChevronDown size={14} />
        </div>
      </div>
    </div>
  );
};

// --- 5. Toggle (Pro Switch) ---
export const Toggle = ({ checked, onChange, labelActive, labelInactive }) => {
  return (
    <div className="flex items-center gap-2 cursor-pointer select-none group" onClick={() => onChange(!checked)}>
      <div className={`
        w-8 h-4 rounded-full p-0.5 transition-colors duration-200 relative
        ${checked ? `bg-${THEME.colors.primary}-600` : 'bg-zinc-300 group-hover:bg-zinc-400'}
      `}>
        <div className={`
          w-3 h-3 bg-white rounded-full shadow-sm transition-transform duration-200
          ${checked ? (document.dir === 'rtl' ? '-translate-x-4' : 'translate-x-4') : 'translate-x-0'}
        `}></div>
      </div>
      {(labelActive || labelInactive) && (
         <span className={`text-[12px] font-medium ${checked ? 'text-zinc-900' : 'text-zinc-500'}`}>
           {checked ? labelActive : labelInactive}
         </span>
      )}
    </div>
  );
};

// --- 6. Badges (Dot Style or Soft) ---
export const Badge = ({ children, variant = 'neutral', style = 'soft' }) => {
  // style: 'soft' (bg + text) | 'dot' (dot + text) | 'outline'
  
  const colors = {
    success: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' },
    danger: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', dot: 'bg-red-500' },
    warning: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500' },
    info: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500' },
    neutral: { bg: 'bg-zinc-100', text: 'text-zinc-600', border: 'border-zinc-200', dot: 'bg-zinc-400' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', dot: 'bg-purple-500' },
  };

  const theme = colors[variant] || colors.neutral;

  if (style === 'dot') {
    return (
      <span className={`flex items-center gap-1.5 text-[12px] font-medium ${theme.text}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${theme.dot}`} />
        {children}
      </span>
    );
  }

  return (
    <span className={`
      px-2 py-0.5 rounded-[4px] text-[11px] font-semibold border 
      ${theme.bg} ${theme.text} ${theme.border}
    `}>
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
