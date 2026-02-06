/* Filename: components/UIComponents.js
   Style: Modern Minimal / Ant Design Inspired
*/
import React from 'react';
import { Loader2, ChevronDown } from 'lucide-react';

// --- Design Tokens (Modern Minimal Theme) ---
const THEME = {
  colors: {
    primary: 'blue',      // رنگ اصلی (Daybreak Blue)
    pageBg: 'bg-[#f0f2f5]', // رنگ پس‌زمینه استاندارد Ant Design (خاکستری خیلی روشن)
    cardBg: 'bg-white',     // کارت‌های سفید
    border: 'border-gray-200', // بوردرهای بسیار ملایم
    textMain: 'text-gray-800', // رنگ متن اصلی
    textSec: 'text-gray-500',  // رنگ متن ثانویه
  },
  radius: {
    card: 'rounded-lg',   // گردی ۸ پیکسل (استاندارد مدرن)
    field: 'rounded-md',  // گردی ۶ پیکسل برای اینپوت‌ها و دکمه‌ها
  },
  shadows: {
    card: 'shadow-sm',    // سایه بسیار محو و تمیز
    hover: 'hover:shadow-md',
  }
};

// --- 1. Modern Card (Clean Surface) ---
export const Card = ({ children, className = '', noPadding = false, title, headerAction }) => {
  return (
    <div className={`
      ${THEME.colors.cardBg} 
      border ${THEME.colors.border} 
      ${THEME.radius.card} 
      ${THEME.shadows.card} 
      flex flex-col
      transition-shadow duration-300
      ${className}
    `}>
      {/* Modern Header: Clean, usually white with border-b */}
      {title && (
        <div className={`px-6 py-4 border-b ${THEME.colors.border} flex items-center justify-between shrink-0`}>
          <h3 className="font-semibold text-gray-800 text-base">{title}</h3>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      
      {/* Body */}
      <div className={`flex-1 ${noPadding ? '' : 'p-6'}`}>
        {children}
      </div>
    </div>
  );
};

// --- 2. Modern Buttons (Ant Design Style) ---
export const Button = ({ 
  children, variant = 'primary', icon: Icon, isLoading, className = '', onClick, type = 'button', disabled 
}) => {
  // Ant Design buttons are typically px-4 py-1.5 or py-2 depending on size. We use py-2 for better touch/click area.
  const baseStyle = `flex items-center justify-center gap-2 px-4 py-2 ${THEME.radius.field} font-medium text-sm transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed border select-none`;
  
  const variants = {
    // Primary: Solid Blue, no border or matching border
    primary: `bg-${THEME.colors.primary}-600 text-white border-${THEME.colors.primary}-600 hover:bg-${THEME.colors.primary}-500 hover:border-${THEME.colors.primary}-500 shadow-sm`,
    // Secondary/Default: White with Gray Border, turns Blue on hover
    secondary: `bg-white text-gray-700 border-gray-300 hover:text-${THEME.colors.primary}-600 hover:border-${THEME.colors.primary}-600`,
    // Dashed (often used for 'Add New')
    dashed: `bg-white text-gray-600 border-gray-300 border-dashed hover:text-${THEME.colors.primary}-600 hover:border-${THEME.colors.primary}-600`,
    // Text/Link
    ghost: `bg-transparent text-gray-600 border-transparent hover:bg-gray-100`,
    // Danger
    danger: `bg-white text-red-500 border-red-200 hover:bg-red-50 hover:border-red-400`
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

// --- 3. Icon Button (Clean) ---
export const IconButton = ({ icon: Icon, onClick, color = 'slate', title, className='' }) => {
  // Minimalist icon button
  const colors = {
    slate: 'text-gray-400 hover:text-gray-700 hover:bg-gray-100',
    blue: 'text-blue-500 hover:text-blue-700 hover:bg-blue-50',
    red: 'text-gray-400 hover:text-red-600 hover:bg-red-50', // Red usually subtle until hovered
  };

  return (
    <button 
      onClick={onClick} 
      title={title}
      className={`p-1.5 rounded-md transition-all duration-200 ${colors[color] || colors.slate} ${className}`}
    >
      <Icon size={18} />
    </button>
  );
};

// --- 4. Inputs (Ant Design Style) ---
export const InputField = ({ label, icon: Icon, isRtl, className = '', ...props }) => {
  return (
    <div className={`w-full ${className}`}>
      {label && <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>}
      <div className="relative group">
        {Icon && (
          <div className={`absolute inset-y-0 ${isRtl ? 'right-3' : 'left-3'} flex items-center text-gray-400 group-focus-within:text-${THEME.colors.primary}-500 transition-colors`}>
            <Icon size={16} />
          </div>
        )}
        <input 
          {...props}
          className={`
            w-full bg-white border border-gray-300 
            ${THEME.radius.field} py-2 
            ${Icon ? (isRtl ? 'pr-10 pl-3' : 'pl-10 pr-3') : 'px-3'} 
            outline-none 
            focus:border-${THEME.colors.primary}-500 focus:ring-2 focus:ring-${THEME.colors.primary}-100
            hover:border-${THEME.colors.primary}-400
            transition-all text-sm text-gray-800 placeholder:text-gray-400
          `}
        />
      </div>
    </div>
  );
};

export const SelectField = ({ label, children, isRtl, className = '', ...props }) => {
  return (
    <div className={`w-full ${className}`}>
      {label && <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>}
      <div className="relative">
        <select 
          {...props}
          className={`
            w-full bg-white border border-gray-300 
            ${THEME.radius.field} py-2 px-3 appearance-none
            outline-none 
            focus:border-${THEME.colors.primary}-500 focus:ring-2 focus:ring-${THEME.colors.primary}-100
            hover:border-${THEME.colors.primary}-400
            transition-all text-sm text-gray-800 cursor-pointer
          `}
        >
          {children}
        </select>
        <div className={`absolute inset-y-0 ${isRtl ? 'left-3' : 'right-3'} flex items-center pointer-events-none text-gray-400`}>
          <ChevronDown size={14} />
        </div>
      </div>
    </div>
  );
};

// --- 5. Toggle (Ant Design Switch) ---
export const Toggle = ({ checked, onChange, labelActive, labelInactive }) => {
  return (
    <div className="flex items-center gap-3 cursor-pointer select-none" onClick={() => onChange(!checked)}>
      <div className={`
        w-11 h-6 rounded-full p-0.5 transition-colors duration-300 relative
        ${checked ? `bg-${THEME.colors.primary}-500` : 'bg-gray-300'}
      `}>
        <div className={`
          w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300
          ${checked ? (document.dir === 'rtl' ? '-translate-x-5' : 'translate-x-5') : 'translate-x-0'}
        `}></div>
      </div>
      {(labelActive || labelInactive) && (
         <span className="text-sm text-gray-600">
           {checked ? labelActive : labelInactive}
         </span>
      )}
    </div>
  );
};

// --- 6. Badges (Subtle/Soft) ---
export const Badge = ({ children, variant = 'neutral' }) => {
  // Ant Design Style: Pastel background, darker text, thin matching border
  const styles = {
    success: 'bg-green-50 text-green-600 border-green-200',
    danger: 'bg-red-50 text-red-600 border-red-200',
    warning: 'bg-orange-50 text-orange-600 border-orange-200',
    info: 'bg-blue-50 text-blue-600 border-blue-200',
    neutral: 'bg-gray-100 text-gray-500 border-gray-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
  };

  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium border ${styles[variant] || styles.neutral}`}>
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
