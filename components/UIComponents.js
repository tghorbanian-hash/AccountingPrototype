/* Filename: components/UIComponents.js */
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Loader2, ChevronDown, ChevronRight, Search, X, 
  Check, Filter, Settings, ChevronLeft,
  ChevronsLeft, ChevronsRight, List, MoreVertical,
  Plus, Trash2, Download, Printer, Edit, Eye, 
  Maximize2, Minimize2, FolderOpen, Folder, FileText,
  AlertCircle, ArrowRight, ArrowUp, ArrowDown
} from 'lucide-react';

// --- ENTERPRISE THEME TOKENS ---
const THEME = {
  colors: {
    primary: 'bg-indigo-700 hover:bg-indigo-800 text-white',
    primaryLight: 'bg-indigo-50 text-indigo-700',
    secondary: 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300',
    accent: 'text-indigo-700',
    surface: 'bg-white',
    background: 'bg-slate-100',
    border: 'border-slate-200',
    textMain: 'text-slate-800',
    textMuted: 'text-slate-500',
    headerBg: 'bg-slate-50',
    rowHover: 'hover:bg-indigo-50/60',
    rowSelected: 'bg-indigo-50 border-l-4 border-l-indigo-600', 
    groupHeader: 'bg-slate-100/90 backdrop-blur-sm text-slate-700 font-bold',
  },
  metrics: {
    radius: 'rounded-md', 
    inputHeight: 'h-8',
    buttonHeight: 'h-8',
    fontSize: 'text-[12px]', 
    headerHeight: 'h-9',
  }
};

// --- 1. ATOMIC COMPONENTS ---

export const Button = ({ 
  children, variant = 'primary', icon: Icon, isLoading, className = '', onClick, disabled, size = 'default', title
}) => {
  const baseStyle = `flex items-center justify-center gap-1.5 px-3 ${THEME.metrics.radius} font-medium ${THEME.metrics.fontSize} transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed select-none whitespace-nowrap active:scale-[0.98] outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-100`;
  
  const variants = {
    primary: `${THEME.colors.primary} shadow-sm border border-transparent`,
    secondary: `${THEME.colors.secondary} shadow-sm`,
    ghost: `bg-transparent text-slate-600 hover:bg-slate-200 hover:text-slate-900`,
    danger: `bg-white text-red-600 border border-red-200 hover:bg-red-50 hover:border-red-300 shadow-sm`,
    success: `bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm`,
    outline: `bg-transparent border border-slate-300 text-slate-600 hover:border-indigo-300 hover:text-indigo-600`,
  };

  const sizes = {
    default: THEME.metrics.buttonHeight,
    sm: 'h-6 px-2 text-[11px]',
    icon: 'h-8 w-8 px-0',
    iconSm: 'h-6 w-6 px-0',
  };

  return (
    <button 
      onClick={onClick} 
      disabled={isLoading || disabled} 
      title={title}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {isLoading ? <Loader2 size={size === 'sm' || size === 'iconSm' ? 12 : 14} className="animate-spin" /> : (Icon && <Icon size={size === 'sm' || size === 'iconSm' ? 14 : 16} strokeWidth={2} />)}
      {children}
    </button>
  );
};

export const InputField = ({ label, icon: Icon, isRtl, className = '', ...props }) => {
  return (
    <div className={`w-full ${className}`}>
      {label && <label className="block text-[11px] font-bold text-slate-600 mb-1">{label}</label>}
      <div className="relative group">
        {Icon && (
          <div className={`absolute inset-y-0 ${isRtl ? 'right-2' : 'left-2'} flex items-center text-slate-400 group-focus-within:text-indigo-600 transition-colors`}>
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
            focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
            transition-all text-[12px] text-slate-800 placeholder:text-slate-400
          `}
        />
      </div>
    </div>
  );
};

export const SelectField = ({ label, children, isRtl, className = '', ...props }) => (
  <div className={`w-full ${className}`}>
    {label && <label className="block text-[11px] font-bold text-slate-600 mb-1">{label}</label>}
    <div className="relative group">
      <select 
        {...props}
        className={`
          w-full ${THEME.colors.surface} border ${THEME.colors.border}
          ${THEME.metrics.radius} ${THEME.metrics.inputHeight} pl-2 pr-8 appearance-none
          outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
          transition-all text-[12px] text-slate-800 cursor-pointer hover:border-slate-300
        `}
      >
        {children}
      </select>
      <div className={`absolute inset-y-0 ${isRtl ? 'left-2' : 'right-2'} flex items-center pointer-events-none text-slate-400 group-hover:text-slate-600`}>
        <ChevronDown size={14} />
      </div>
    </div>
  </div>
);

export const Toggle = ({ checked, onChange, label, disabled }) => (
  <div 
    className={`flex items-center gap-2 select-none ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer group'}`}
    onClick={() => !disabled && onChange(!checked)}
  >
    <div className={`
      w-8 h-4 rounded-full p-0.5 transition-all duration-200 ease-in-out relative border
      ${checked ? 'bg-indigo-600 border-indigo-600' : 'bg-slate-200 border-slate-300 group-hover:border-slate-400'}
    `}>
      <div className={`
        w-3 h-3 bg-white rounded-full shadow-sm transform transition-transform duration-200
        ${checked ? (document.dir === 'rtl' ? '-translate-x-4' : 'translate-x-4') : 'translate-x-0'}
      `}></div>
    </div>
    {label && <span className="text-[12px] font-medium text-slate-700">{label}</span>}
  </div>
);

export const Badge = ({ children, variant = 'neutral', className='' }) => {
  const styles = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-red-50 text-red-700 border-red-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
    neutral: 'bg-slate-100 text-slate-600 border-slate-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0 rounded-md text-[11px] font-bold border ${styles[variant] || styles.neutral} ${className}`}>
      {children}
    </span>
  );
};

// --- NEW COMPONENTS FOR ROLES & ACCESS ---

// 1. ToggleChip: دکمه‌های انتخاب چندگانه کوچک (مثل تگ‌ها)
export const ToggleChip = ({ label, checked, onClick, icon: Icon, colorClass = "green" }) => {
  const styles = {
    green: checked ? 'bg-green-50 border-green-500 text-green-700 ring-1 ring-green-100' : 'bg-white border-slate-300 text-slate-500 hover:border-slate-400',
    indigo: checked ? 'bg-indigo-50 border-indigo-500 text-indigo-700 ring-1 ring-indigo-100' : 'bg-white border-slate-300 text-slate-500 hover:border-slate-400',
  };

  const activeStyle = styles[colorClass] || styles.green;

  return (
    <button
      onClick={onClick}
      className={`
        px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-all flex items-center gap-1.5
        ${activeStyle} shadow-sm
      `}
    >
      {checked && (Icon ? <Icon size={12} className={checked ? `text-${colorClass}-600` : ''}/> : <Check size={12} />)}
      {label}
    </button>
  );
};

// 2. SelectionGrid: گرید انتخاب آیتم‌ها (مثل عملیات CRUD)
export const SelectionGrid = ({ items, selectedIds = [], onToggle, columns = 4 }) => {
  const gridCols = { 2: 'grid-cols-2', 3: 'grid-cols-3', 4: 'grid-cols-4', 6: 'grid-cols-6' };
  
  return (
    <div className={`grid ${gridCols[columns] || 'grid-cols-4'} gap-2`}>
      {items.map(item => {
         const isChecked = selectedIds.includes(item.id);
         return (
            <div 
               key={item.id} 
               className={`
                  flex flex-col items-center gap-2 p-2 rounded-lg border transition-all cursor-pointer select-none text-center
                  ${isChecked ? 'bg-indigo-50 border-indigo-200 shadow-sm' : 'bg-white border-slate-200 hover:border-slate-300'}
               `}
               onClick={() => onToggle(item.id)}
            >
               <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isChecked ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-slate-300'}`}>
                  {isChecked && <Check size={14} className="text-white"/>}
               </div>
               <span className={`text-[10px] font-bold ${isChecked ? 'text-indigo-700' : 'text-slate-600'}`}>{item.label}</span>
            </div>
         );
      })}
    </div>
  );
};

// 3. TreeView: درخت عمومی با قابلیت جستجو و رندر سفارشی
export const TreeView = ({ data, onSelectNode, selectedNodeId, renderNodeContent, isRtl, searchPlaceholder = "جستجو..." }) => {
  const [expandedNodes, setExpandedNodes] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  // Filtering Logic
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    const filterNodes = (nodes) => {
      return nodes.reduce((acc, node) => {
        const label = (node.label[isRtl ? 'fa' : 'en'] || '').toLowerCase();
        const matches = label.includes(searchTerm.toLowerCase());
        let children = [];
        if (node.children) children = filterNodes(node.children);
        if (matches || children.length > 0) {
          acc.push({ ...node, children, _matches: matches });
        }
        return acc;
      }, []);
    };
    return filterNodes(data);
  }, [data, searchTerm, isRtl]);

  // Auto Expand on Search
  useEffect(() => {
    if (searchTerm) {
      const allIds = {};
      const traverse = (nodes) => {
        nodes.forEach(n => {
          if (n.children && n.children.length > 0) {
            allIds[n.id] = true;
            traverse(n.children);
          }
        });
      };
      traverse(filteredData);
      setExpandedNodes(allIds);
    } else {
      setExpandedNodes({});
    }
  }, [searchTerm, filteredData]);

  const toggleNode = (id, e) => {
    e.stopPropagation();
    setExpandedNodes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const renderTree = (items, depth = 0) => {
    return items.map(item => {
      const hasChildren = item.children && item.children.length > 0;
      const isExpanded = expandedNodes[item.id];
      const isSelected = selectedNodeId === item.id;
      
      // Highlight Label
      const label = item.label[isRtl ? 'fa' : 'en'];
      const displayLabel = (searchTerm && item._matches) ? <mark className="bg-yellow-100 rounded px-0.5">{label}</mark> : label;

      return (
        <div key={item.id} className="select-none relative">
           {depth > 0 && <div className={`absolute top-0 bottom-0 w-px bg-slate-200 ${isRtl ? 'right-[11px]' : 'left-[11px]'}`}></div>}
           <div 
             className={`
               flex items-center gap-2 py-1.5 px-2 my-0.5 cursor-pointer rounded-lg transition-all
               ${isSelected ? 'bg-indigo-50 text-indigo-700 font-bold ring-1 ring-indigo-200' : 'hover:bg-slate-100 text-slate-700'}
             `}
             style={{ paddingRight: isRtl ? `${depth * 16 + 8}px` : '8px', paddingLeft: isRtl ? '8px' : `${depth * 16 + 8}px` }}
             onClick={(e) => {
               if(hasChildren) toggleNode(item.id, e);
               else onSelectNode(item);
             }}
           >
             {hasChildren ? (
               <div className="w-5 h-5 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors z-10">
                  <div className={`transition-transform duration-200 ${isExpanded ? '' : (isRtl ? 'rotate-90' : '-rotate-90')}`}>
                    <ChevronDown size={14} />
                  </div>
               </div>
             ) : (
                <div className="shrink-0">{renderNodeContent ? renderNodeContent(item) : <div className="w-5 h-5"/>}</div>
             )}
             
             <div className="flex items-center gap-2 truncate">
                {hasChildren && <span className={`text-slate-400 ${isExpanded ? 'text-indigo-400' : ''}`}>{isExpanded ? <FolderOpen size={14}/> : <Folder size={14}/>}</span>}
                <span className="text-[12px] truncate">{displayLabel}</span>
             </div>
           </div>
           {hasChildren && isExpanded && <div className="overflow-hidden animate-in slide-in-from-top-1 duration-200">{renderTree(item.children, depth + 1)}</div>}
        </div>
      );
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="relative mb-2 shrink-0">
         <input 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={searchPlaceholder} 
            className={`w-full bg-slate-100 border border-slate-200 rounded-md text-[11px] h-8 focus:bg-white focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none transition-all ${isRtl ? 'pr-8 pl-2' : 'pl-8 pr-2'}`} 
         />
         <Search size={14} className={`absolute top-1/2 -translate-y-1/2 text-slate-400 ${isRtl ? 'right-2.5' : 'left-2.5'}`}/>
         {searchTerm && <button onClick={() => setSearchTerm('')} className={`absolute top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500 ${isRtl ? 'left-2' : 'right-2'}`}><X size={12}/></button>}
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar p-1">
         {filteredData.length > 0 ? renderTree(filteredData) : <div className="text-center p-4 text-slate-400 text-xs">موردی یافت نشد.</div>}
      </div>
    </div>
  );
};


// --- EXISTING COMPLEX COMPONENTS ---

// 2. FILTER SECTION
export const FilterSection = ({ children, onSearch, onClear, isRtl, title = "فیلترهای پیشرفته" }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={`bg-white border border-slate-300 rounded-lg shadow-sm mb-3 overflow-hidden transition-all duration-300`}>
      <div 
        className="flex items-center justify-between px-3 py-2 bg-slate-50 cursor-pointer select-none border-b border-transparent hover:bg-slate-100"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2 text-indigo-700 font-bold text-[12px]">
          <Filter size={14} />
          <span>{title}</span>
        </div>
        <div className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          <ChevronDown size={16} />
        </div>
      </div>

      <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="p-3 border-t border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-3">
            {children}
          </div>
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="ghost" onClick={onClear} size="sm" icon={X}>پاک کردن</Button>
            <Button variant="primary" onClick={onSearch} size="sm" icon={Search}>اعمال فیلتر</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// 3. DATA GRID
export const DataGrid = ({ 
  columns, 
  data = [], 
  onSelectAll, 
  onSelectRow, 
  selectedIds = [], 
  isLoading, 
  isRtl, 
  title,
  groupBy = [], 
  setGroupBy,
  onCreate,
  onDelete,
  onDoubleClick,
  actions 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [expandedGroups, setExpandedGroups] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const processedData = useMemo(() => {
    let result = [...data];
    if (searchTerm) {
      result = result.filter(item => 
        Object.values(item).some(val => 
          String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    if (sortConfig.key) {
      result.sort((a, b) => {
        const valA = a[sortConfig.key];
        const valB = b[sortConfig.key];
        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    if (groupBy.length > 0) {
      result.sort((a, b) => {
        for (let field of groupBy) {
          if (a[field] < b[field]) return -1;
          if (a[field] > b[field]) return 1;
        }
        return 0;
      });
      const flatList = [];
      let lastValues = {};
      result.forEach(row => {
        let isVisible = true;
        groupBy.forEach((field, level) => {
          const val = row[field];
          const groupKey = `grp-${level}-${field}-${val}`;
          if (lastValues[level] !== val) {
            flatList.push({
              _type: 'GROUP_HEADER',
              field,
              value: val,
              level,
              key: groupKey,
              count: result.filter(r => r[field] === val).length 
            });
            lastValues[level] = val;
            for(let l=level+1; l<groupBy.length; l++) lastValues[l] = null;
          }
          if (expandedGroups[groupKey] === false) {
             isVisible = false;
          }
        });
        if (isVisible) flatList.push(row);
      });
      result = flatList;
    }
    return result;
  }, [data, searchTerm, groupBy, expandedGroups, sortConfig]);

  const totalItems = processedData.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  
  useEffect(() => { if(currentPage > totalPages) setCurrentPage(1); }, [totalItems, pageSize]);
  const paginatedData = processedData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const toggleGroup = (groupKey) => {
    setExpandedGroups(prev => ({ ...prev, [groupKey]: prev[groupKey] === false ? true : false }));
  };

  const removeGroup = (field) => {
    if(setGroupBy) setGroupBy(groupBy.filter(g => g !== field));
  };

  return (
    <div className="flex flex-col h-full bg-white border border-slate-300 rounded-lg shadow-sm overflow-hidden">
      <div className="px-3 py-2 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {groupBy.map(field => (
             <span key={field} className="flex items-center gap-1 bg-white text-indigo-700 px-2 py-0.5 rounded border border-indigo-200 text-[11px] font-bold shadow-sm">
                <span>{columns.find(c => c.field === field)?.header || field}</span>
                <button onClick={() => removeGroup(field)} className="hover:text-red-500"><X size={12}/></button>
             </span>
          ))}
          {onCreate && (
             <Button variant="primary" size="sm" icon={Plus} onClick={onCreate}>جدید</Button>
          )}
          {selectedIds.length > 0 && onDelete && (
             <Button variant="danger" size="sm" icon={Trash2} onClick={() => onDelete(selectedIds)}>حذف ({selectedIds.length})</Button>
          )}
        </div>

        <div className="flex items-center gap-2">
           <div className="relative">
             <input 
               placeholder="جستجو..." 
               value={searchTerm}
               onChange={e => setSearchTerm(e.target.value)}
               className={`h-7 w-40 bg-white border border-slate-300 rounded text-[11px] outline-none focus:border-indigo-500 transition-all ${isRtl ? 'pr-7 pl-2' : 'pl-7 pr-2'}`}
             />
             <Search size={12} className={`absolute top-1/2 -translate-y-1/2 text-slate-400 ${isRtl ? 'right-2' : 'left-2'}`} />
           </div>
           <div className="flex items-center gap-1 border-r border-slate-300 pr-2 mr-1">
             <Button variant="ghost" size="iconSm" icon={Download} title="خروجی اکسل" />
             <Button variant="ghost" size="iconSm" icon={Settings} title="تنظیمات ستون‌ها" />
           </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto relative custom-scrollbar bg-white">
        <table className="w-full border-collapse text-[12px] relative">
          <thead className="bg-slate-100 sticky top-0 z-20 shadow-sm border-b border-slate-300">
            <tr>
              <th className="w-10 px-2 py-2 text-center">
                <input 
                  type="checkbox" 
                  className="rounded border-slate-400 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5 cursor-pointer"
                  checked={data.length > 0 && selectedIds.length === data.length}
                  onChange={(e) => onSelectAll && onSelectAll(e.target.checked)}
                />
              </th>
              {columns.map((col, idx) => (
                <th 
                  key={idx} 
                  className={`px-3 py-2 font-bold text-slate-700 text-start whitespace-nowrap ${col.width || ''} hover:bg-slate-200 cursor-pointer transition-colors select-none`}
                  style={{ minWidth: col.minWidth }}
                  onClick={() => col.sortable && handleSort(col.field)}
                >
                  <div className="flex items-center gap-1">
                    {col.header}
                    {col.sortable && (
                      <div className="flex flex-col text-slate-400">
                        {sortConfig.key === col.field ? (
                           sortConfig.direction === 'asc' ? <ArrowUp size={12} className="text-indigo-600"/> : <ArrowDown size={12} className="text-indigo-600"/>
                        ) : (
                           <div className="opacity-0 group-hover:opacity-50"><ArrowDown size={12}/></div>
                        )}
                      </div>
                    )}
                  </div>
                </th>
              ))}
              <th className="px-3 py-2 w-20 text-center sticky left-0 bg-slate-100 z-20 shadow-[-2px_0_5px_rgba(0,0,0,0.05)] border-l border-slate-300">عملیات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
               <tr><td colSpan={100} className="p-10 text-center text-slate-500"><Loader2 className="animate-spin mx-auto mb-2"/>در حال بارگذاری...</td></tr>
            ) : paginatedData.length === 0 ? (
               <tr><td colSpan={100} className="p-10 text-center text-slate-400 italic">اطلاعاتی یافت نشد.</td></tr>
            ) : (
              paginatedData.map((row, rowIndex) => {
                if (row._type === 'GROUP_HEADER') {
                  const isClosed = expandedGroups[row.key] === false;
                  return (
                    <tr key={row.key} className="bg-slate-50 sticky top-9 z-10">
                      <td colSpan={100} className="px-3 py-1.5 border-y border-slate-200">
                        <div 
                          className="flex items-center gap-2 cursor-pointer select-none"
                          onClick={() => toggleGroup(row.key)}
                          style={{ paddingRight: `${row.level * 16}px` }}
                        >
                           <div className={`p-0.5 rounded hover:bg-slate-200 transition-transform duration-200 ${isClosed ? (isRtl ? 'rotate-90' : '-rotate-90') : ''}`}>
                             <ChevronDown size={14} className="text-slate-500" />
                           </div>
                           <span className="font-bold text-slate-800 text-[11px]">{columns.find(c => c.field === row.field)?.header}:</span>
                           <span className="text-indigo-700 font-medium">{row.value}</span>
                           <Badge variant="neutral" className="mr-2 text-[10px] h-4 py-0">{row.count}</Badge>
                        </div>
                      </td>
                    </tr>
                  );
                }
                const isSelected = selectedIds.includes(row.id);
                return (
                  <tr 
                    key={row.id || rowIndex} 
                    onDoubleClick={() => onDoubleClick && onDoubleClick(row)}
                    className={`
                      transition-all duration-100 group
                      ${isSelected ? THEME.colors.rowSelected : 'hover:bg-slate-50'}
                    `}
                  >
                    <td className="px-2 py-1.5 border-r border-slate-100 text-center">
                      <input 
                        type="checkbox" 
                        className="rounded border-slate-400 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5 cursor-pointer"
                        checked={isSelected}
                        onChange={(e) => onSelectRow && onSelectRow(row.id, e.target.checked)}
                      />
                    </td>
                    {columns.map((col, cIdx) => (
                      <td key={cIdx} className="px-3 py-1.5 border-r border-slate-100 text-slate-700 truncate max-w-xs align-middle">
                         {col.type === 'toggle' ? (
                           <div className="flex justify-center"><Toggle checked={row[col.field]} onChange={() => {}} disabled /></div>
                         ) : col.render ? (
                           col.render(row)
                         ) : (
                           row[col.field]
                         )}
                      </td>
                    ))}
                    <td className="px-1 py-1 text-center sticky left-0 bg-white group-hover:bg-slate-50 border-l border-slate-100 shadow-[-2px_0_5px_rgba(0,0,0,0.02)] z-10">
                      <div className="flex items-center justify-center gap-1 opacity-100">
                        {actions ? actions(row) : null}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="px-3 py-2 bg-slate-50 border-t border-slate-300 flex items-center justify-between shrink-0 select-none">
        <div className="flex items-center gap-2">
           <select 
             value={pageSize}
             onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
             className="bg-white border border-slate-300 rounded text-[11px] font-bold text-slate-700 py-0.5 px-1 outline-none focus:border-indigo-500 cursor-pointer"
           >
              <option value={10}>10 سطر</option>
              <option value={25}>25 سطر</option>
              <option value={50}>50 سطر</option>
           </select>
           <div className="h-3 w-px bg-slate-300 mx-1"></div>
           <span className="text-[11px] text-slate-500">
             <span className="font-bold text-slate-800">{totalItems}</span> رکورد
           </span>
        </div>
        <div className="flex items-center gap-1">
           <Button variant="outline" size="iconSm" icon={ChevronsRight} disabled={currentPage === 1} onClick={() => setCurrentPage(1)} />
           <Button variant="outline" size="iconSm" icon={ChevronRight} disabled={currentPage === 1} onClick={() => setCurrentPage(c => c - 1)} />
           <div className="flex items-center gap-1 px-2">
              <span className="text-[11px] text-slate-500">صفحه</span>
              <input 
                value={currentPage}
                onChange={(e) => setCurrentPage(Number(e.target.value))}
                className="w-8 h-6 text-center border border-slate-300 rounded text-[11px] font-bold outline-none focus:border-indigo-500"
              />
              <span className="text-[11px] text-slate-500">از {totalPages}</span>
           </div>
           <Button variant="outline" size="iconSm" icon={ChevronLeft} disabled={currentPage === totalPages} onClick={() => setCurrentPage(c => c + 1)} />
           <Button variant="outline" size="iconSm" icon={ChevronsLeft} disabled={currentPage === totalPages} onClick={() => setCurrentPage(totalPages)} />
        </div>
      </div>
    </div>
  );
};

// 4. TREE MENU (Sidebar Navigation)
export const TreeMenu = ({ items, activeId, onSelect, isRtl }) => {
  // Uses TreeView internally but tailored for navigation
  const renderNode = (item) => (
     <div className={`w-1.5 h-1.5 rounded-full transition-colors ${activeId === item.id ? 'bg-indigo-600 scale-125' : 'bg-slate-300'}`}></div>
  );
  
  return <TreeView data={items} selectedNodeId={activeId} onSelectNode={(item) => onSelect(item.id)} renderNodeContent={renderNode} isRtl={isRtl} searchPlaceholder={isRtl ? "جستجوی منو..." : "Search Menu..."} />;
};

export const Modal = ({ isOpen, onClose, title, children, footer, size = 'md' }) => {
  if (!isOpen) return null;
  const sizes = { sm: 'max-w-sm', md: 'max-w-xl', lg: 'max-w-4xl', xl: 'max-w-6xl', full: 'max-w-[95vw] h-[90vh]' };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className={`bg-white rounded-lg shadow-2xl flex flex-col w-full ${sizes[size]} max-h-[90vh] animate-in zoom-in-95 border border-slate-200`}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-50 shrink-0 rounded-t-lg">
          <h3 className="font-bold text-slate-800 text-sm">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-red-500"><X size={18} /></button>
        </div>
        <div className="p-4 overflow-y-auto flex-1">{children}</div>
        {footer && <div className="px-4 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-2 shrink-0 rounded-b-lg">{footer}</div>}
      </div>
    </div>
  );
};

export const DatePicker = ({ label, isRtl, className = '', ...props }) => (
  <div className={`w-full ${className}`}>
    {label && <label className="block text-[11px] font-bold text-slate-600 mb-1">{label}</label>}
    <div className="relative">
       <input type="date" {...props} className={`w-full ${THEME.colors.surface} border ${THEME.colors.border} ${THEME.metrics.radius} ${THEME.metrics.inputHeight} px-2 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-[12px] text-slate-800 uppercase font-mono transition-all`} />
    </div>
  </div>
);

export const LOV = ({ label, placeholder, isRtl }) => (
  <div className="w-full">
    {label && <label className="block text-[11px] font-bold text-slate-600 mb-1">{label}</label>}
    <div className="flex relative">
      <input placeholder={placeholder} className={`flex-1 ${THEME.colors.surface} border ${THEME.colors.border} rounded-r-md border-l-0 ${THEME.metrics.inputHeight} px-2 outline-none focus:border-indigo-500 text-[12px]`} />
      <button className={`bg-slate-50 border ${THEME.colors.border} px-2 hover:bg-slate-100 rounded-l-md border-r-0`}><List size={14}/></button>
    </div>
  </div>
);

window.UI = { Button, InputField, SelectField, Toggle, Badge, DataGrid, FilterSection, TreeMenu, TreeView, SelectionGrid, ToggleChip, Modal, DatePicker, LOV, THEME };
