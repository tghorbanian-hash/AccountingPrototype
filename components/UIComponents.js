/* Filename: components/UIComponents.js */
import React, { useState } from 'react';
import { 
  Loader2, ChevronDown, ChevronRight, Search, X, 
  Check, MoreHorizontal, Filter, Settings, ChevronLeft,
  ChevronsLeft, ChevronsRight, Calendar, List, Circle
} from 'lucide-react';

// --- ENTERPRISE THEME TOKENS ---
const THEME = {
  colors: {
    primary: 'bg-indigo-700 hover:bg-indigo-800 text-white',
    secondary: 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300',
    accent: 'text-indigo-700',
    surface: 'bg-white',
    background: 'bg-slate-100',
    border: 'border-slate-300',
    borderLight: 'border-slate-200',
    textMain: 'text-slate-800',
    textMuted: 'text-slate-500',
    headerBg: 'bg-slate-50',
    rowHover: 'hover:bg-indigo-50/50',
    rowSelected: 'bg-indigo-50',
  },
  metrics: {
    radius: 'rounded',
    inputHeight: 'h-8',
    buttonHeight: 'h-8',
    fontSize: 'text-[12px]',
    headerHeight: 'h-9',
  }
};

// --- 1. ATOMIC COMPONENTS ---

export const Button = ({ 
  children, variant = 'primary', icon: Icon, isLoading, className = '', onClick, disabled, size = 'default' 
}) => {
  const baseStyle = `flex items-center justify-center gap-1.5 px-3 ${THEME.metrics.radius} font-medium text-[12px] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed select-none whitespace-nowrap active:scale-[0.98]`;
  
  const variants = {
    primary: `${THEME.colors.primary} shadow-sm`,
    secondary: `${THEME.colors.secondary} shadow-sm`,
    ghost: `bg-transparent text-slate-600 hover:bg-slate-200 hover:text-slate-900`,
    danger: `bg-red-50 text-red-700 border border-red-200 hover:bg-red-100`,
    success: `bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100`,
  };

  const sizes = {
    default: THEME.metrics.buttonHeight,
    sm: 'h-6 px-2 text-[11px]',
    icon: 'h-8 w-8 px-0',
  };

  return (
    <button 
      onClick={onClick} 
      disabled={isLoading || disabled}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {isLoading && <Loader2 size={14} className="animate-spin" />}
      {!isLoading && Icon && <Icon size={14} strokeWidth={2} />}
      {children}
    </button>
  );
};

export const InputField = ({ label, icon: Icon, isRtl, className = '', ...props }) => {
  return (
    <div className={`w-full ${className}`}>
      {label && <label className="block text-[11px] font-bold text-slate-700 mb-1">{label}</label>}
      <div className="relative group">
        {Icon && (
          <div className={`absolute inset-y-0 ${isRtl ? 'right-2' : 'left-2'} flex items-center text-slate-400 group-focus-within:text-indigo-600`}>
            <Icon size={14} />
          </div>
        )}
        <input 
          {...props}
          className={`
            w-full ${THEME.colors.surface} border ${THEME.colors.border}
            ${THEME.metrics.radius} ${THEME.metrics.inputHeight}
            ${Icon ? (isRtl ? 'pr-8 pl-2' : 'pl-8 pr-2') : 'px-2'} 
            outline-none 
            focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600
            transition-all text-[12px] text-slate-900 placeholder:text-slate-400
          `}
        />
      </div>
    </div>
  );
};

export const LOV = ({ label, placeholder, onSearch, isRtl, className = '' }) => {
  return (
    <div className={`w-full ${className}`}>
       {label && <label className="block text-[11px] font-bold text-slate-700 mb-1">{label}</label>}
       <div className="flex">
          <input 
            placeholder={placeholder}
            className={`
              flex-1 ${THEME.colors.surface} border ${THEME.colors.border}
              ${isRtl ? 'rounded-r border-l-0' : 'rounded-l border-r-0'} ${THEME.metrics.inputHeight} px-2
              outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600
              text-[12px]
            `}
          />
          <button className={`
            bg-slate-100 border ${THEME.colors.border} px-3 hover:bg-slate-200 text-slate-600
            ${isRtl ? 'rounded-l border-r-0' : 'rounded-r border-l-0'}
          `}>
             <List size={14} />
          </button>
       </div>
    </div>
  );
};

export const SelectField = ({ label, children, isRtl, className = '', ...props }) => (
  <div className={`w-full ${className}`}>
    {label && <label className="block text-[11px] font-bold text-slate-700 mb-1">{label}</label>}
    <div className="relative">
      <select 
        {...props}
        className={`
          w-full ${THEME.colors.surface} border ${THEME.colors.border}
          ${THEME.metrics.radius} ${THEME.metrics.inputHeight} pl-2 pr-8 appearance-none
          outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600
          text-[12px] text-slate-900 cursor-pointer
        `}
      >
        {children}
      </select>
      <div className={`absolute inset-y-0 ${isRtl ? 'left-2' : 'right-2'} flex items-center pointer-events-none text-slate-500`}>
        <ChevronDown size={14} />
      </div>
    </div>
  </div>
);

export const Toggle = ({ checked, onChange, label }) => (
  <div 
    className="flex items-center gap-2 cursor-pointer select-none group" 
    onClick={() => onChange(!checked)}
  >
    <div className={`
      w-8 h-4 rounded-full p-0.5 transition-colors duration-200 relative
      ${checked ? 'bg-indigo-600' : 'bg-slate-300 group-hover:bg-slate-400'}
    `}>
      <div className={`
        w-3 h-3 bg-white rounded-full shadow-sm transition-transform duration-200
        ${checked ? (document.dir === 'rtl' ? '-translate-x-4' : 'translate-x-4') : 'translate-x-0'}
      `}></div>
    </div>
    {label && <span className="text-[12px] text-slate-700">{label}</span>}
  </div>
);

export const Badge = ({ children, variant = 'neutral' }) => {
  const styles = {
    success: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    warning: 'bg-amber-100 text-amber-800 border-amber-200',
    danger: 'bg-red-100 text-red-800 border-red-200',
    info: 'bg-blue-100 text-blue-800 border-blue-200',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
    purple: 'bg-purple-100 text-purple-800 border-purple-200',
  };
  return (
    <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${styles[variant] || styles.neutral}`}>
      {children}
    </span>
  );
};

// --- 2. COMPLEX COMPONENTS ---

export const DataGrid = ({ 
  columns, data = [], actions, onSelectAll, onSelectRow, selectedIds = [], 
  isLoading, isRtl, pagination 
}) => {
  return (
    <div className="flex flex-col h-full border border-slate-300 rounded bg-white shadow-sm overflow-hidden">
      {/* Grid Toolbar */}
      <div className="bg-slate-50 border-b border-slate-200 p-2 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" icon={Filter}>Filter</Button>
          <div className="h-4 w-px bg-slate-300 mx-1"></div>
          <span className="text-[11px] font-bold text-slate-500">{data.length} Records Found</span>
        </div>
        <div className="flex items-center gap-2">
           <Button variant="ghost" size="sm" icon={Settings} />
        </div>
      </div>

      {/* The Table Area */}
      <div className="flex-1 overflow-auto relative">
        <table className="w-full border-collapse text-[12px]">
          <thead className="bg-slate-100 sticky top-0 z-10 shadow-sm">
            <tr>
              <th className="w-10 px-2 py-2 border-b border-slate-300 text-center">
                <input 
                  type="checkbox" 
                  className="rounded border-slate-400"
                  checked={data.length > 0 && selectedIds.length === data.length}
                  onChange={(e) => onSelectAll && onSelectAll(e.target.checked)}
                />
              </th>
              {columns.map((col, idx) => (
                <th 
                  key={idx} 
                  className={`px-3 py-2 border-b border-slate-300 font-bold text-slate-700 uppercase tracking-tight text-start whitespace-nowrap ${col.width || ''}`}
                >
                  <div className="flex items-center gap-1 cursor-pointer hover:text-indigo-700">
                    {col.header}
                    {col.sortable && <ChevronDown size={12} className="opacity-50" />}
                  </div>
                </th>
              ))}
              {actions && <th className="px-3 py-2 border-b border-slate-300 w-24 text-center">Actions</th>}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-100">
            {isLoading ? (
               <tr><td colSpan={100} className="p-8 text-center text-slate-500"><Loader2 className="animate-spin mx-auto mb-2"/>Loading Data...</td></tr>
            ) : data.map((row, rowIndex) => {
              const isSelected = selectedIds.includes(row.id);
              return (
                <tr 
                  key={row.id || rowIndex} 
                  className={`
                    transition-colors 
                    ${isSelected ? THEME.colors.rowSelected : 'hover:bg-slate-50'}
                    ${rowIndex % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'} 
                  `}
                >
                  <td className="px-2 py-1.5 border-r border-slate-100 text-center">
                    <input 
                      type="checkbox" 
                      className="rounded border-slate-300"
                      checked={isSelected}
                      onChange={(e) => onSelectRow && onSelectRow(row.id, e.target.checked)}
                    />
                  </td>
                  {columns.map((col, cIdx) => (
                    <td key={cIdx} className="px-3 py-1.5 border-r border-slate-100 text-slate-700 truncate max-w-xs">
                      {col.render ? col.render(row) : row[col.field]}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-2 py-1.5 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {actions(row)}
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Grid Footer */}
      <div className="bg-slate-50 border-t border-slate-300 p-1.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
           <Button variant="ghost" size="sm" icon={ChevronsLeft} disabled />
           <Button variant="ghost" size="sm" icon={ChevronLeft} disabled />
           <span className="text-[11px] text-slate-600 font-medium px-2">Page 1 of 12</span>
           <Button variant="ghost" size="sm" icon={ChevronRight} />
           <Button variant="ghost" size="sm" icon={ChevronsRight} />
        </div>
        <div className="flex items-center gap-2">
           <span className="text-[11px] text-slate-500">Rows per page:</span>
           <select className="bg-transparent text-[11px] font-bold text-slate-700 border-none outline-none">
              <option>25</option>
              <option>50</option>
              <option>100</option>
           </select>
        </div>
      </div>
    </div>
  );
};

// --- IMPROVED TREE MENU ---
export const TreeMenu = ({ items, activeId, onSelect, isRtl }) => {
  const [expanded, setExpanded] = useState({});

  // تابع باز/بسته کردن آیتم‌ها
  const toggle = (id, e) => {
    e.stopPropagation();
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const renderItem = (item, depth = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expanded[item.id];
    const isActive = activeId === item.id;
    
    // دریافت لیبل بر اساس زبان یا رشته ساده
    const label = (typeof item.label === 'object' && item.label !== null) 
      ? (isRtl ? item.label.fa : item.label.en) 
      : item.label;

    // --- Level 0: Section Headers (تیترهای اصلی) ---
    if (depth === 0) {
      return (
        <div key={item.id} className="mb-4">
          {/* Header */}
          <div className="px-5 mt-4 mb-2 flex items-center gap-2 select-none group">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest group-hover:text-slate-600 transition-colors">
              {label}
            </span>
            <div className="h-px flex-1 bg-slate-100 group-hover:bg-slate-200 transition-colors"></div>
          </div>
          {/* Children Container */}
          <div className="flex flex-col">
            {hasChildren && item.children.map(child => renderItem(child, depth + 1))}
          </div>
        </div>
      );
    }

    // --- Level 1+: Interactive Tree Items (آیتم‌های درختی) ---
    const paddingStart = isRtl ? 'pr-3' : 'pl-3';
    
    return (
      <div key={item.id} className="relative">
        {/* Connector Line for nested items (Level 2+) */}
        {depth > 1 && (
           <div className={`absolute top-0 bottom-0 ${isRtl ? 'right-[19px]' : 'left-[19px]'} w-px bg-slate-200`}></div>
        )}

        <div 
          onClick={(e) => {
            if (hasChildren) toggle(item.id, e);
            else onSelect && onSelect(item.id);
          }}
          className={`
            group flex items-center gap-2 py-2 my-0.5 rounded-lg cursor-pointer transition-all duration-200 select-none
            ${isActive && !hasChildren 
              ? 'bg-indigo-50 text-indigo-700 font-bold' 
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}
            ${depth === 1 ? 'mx-2' : (isRtl ? 'mr-8 ml-2' : 'ml-8 mr-2')}
          `}
        >
          {/* Icon / Bullet */}
          <div className="shrink-0 flex items-center justify-center w-5 h-5">
             {hasChildren ? (
               <ChevronDown 
                 size={14} 
                 className={`text-slate-400 transition-transform duration-200 ${isExpanded ? '' : (isRtl ? 'rotate-90' : '-rotate-90')}`} 
               />
             ) : (
               <div className={`w-1.5 h-1.5 rounded-full transition-colors ${isActive ? 'bg-indigo-600' : 'bg-slate-300 group-hover:bg-slate-400'}`}></div>
             )}
          </div>

          <span className="text-[13px] truncate flex-1 leading-none pt-0.5">{label}</span>
        </div>

        {/* Recursive Children Rendering */}
        {hasChildren && isExpanded && (
          <div className="animate-in slide-in-from-top-1 fade-in duration-200 overflow-hidden">
            {item.children.map(child => renderItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  // Render Root Items
  return <div className="py-2">{items.map(item => renderItem(item, 0))}</div>;
};


export const Modal = ({ isOpen, onClose, title, children, footer, size = 'md' }) => {
  if (!isOpen) return null;
  
  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-[95vw] h-[90vh]'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className={`bg-white rounded shadow-2xl flex flex-col w-full ${sizes[size]} max-h-[90vh] animate-in zoom-in-95`}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-50 shrink-0 rounded-t">
          <h3 className="font-bold text-slate-800 text-sm">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-red-500"><X size={18} /></button>
        </div>
        <div className="p-4 overflow-y-auto flex-1">
          {children}
        </div>
        {footer && (
          <div className="px-4 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-2 shrink-0 rounded-b">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export const DatePicker = ({ label, isRtl, className = '', ...props }) => (
  <div className={`w-full ${className}`}>
    {label && <label className="block text-[11px] font-bold text-slate-700 mb-1">{label}</label>}
    <div className="relative">
       <input 
         type="date"
         {...props}
         className={`
           w-full ${THEME.colors.surface} border ${THEME.colors.border}
           ${THEME.metrics.radius} ${THEME.metrics.inputHeight} px-2
           outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600
           text-[12px] text-slate-900 uppercase font-mono
         `} 
       />
    </div>
  </div>
);

// --- Exports ---
window.UI = {
  Button,
  InputField,
  SelectField,
  Toggle,
  Badge,
  DataGrid,
  TreeMenu,
  Modal,
  DatePicker,
  LOV,
  THEME
};
