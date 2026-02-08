/* Filename: components/UIComponents.js */
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Loader2, ChevronDown, ChevronRight, Search, X, 
  Check, Filter, Settings, ChevronLeft,
  ChevronsLeft, ChevronsRight, List, MoreVertical,
  Plus, Trash2, Download, Printer, Edit, Eye, 
  Maximize2, Minimize2, FolderOpen, Folder, FileText,
  AlertCircle, ArrowRight
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
    rowHover: 'hover:bg-indigo-50/40',
    rowSelected: 'bg-indigo-50 border-l-2 border-l-indigo-600',
    groupHeader: 'bg-slate-100/80 backdrop-blur-sm text-slate-700 font-bold',
  },
  metrics: {
    radius: 'rounded-lg',
    inputHeight: 'h-9',
    buttonHeight: 'h-9',
    fontSize: 'text-[13px]',
    headerHeight: 'h-10',
  }
};

// --- HELPER COMPONENTS ---

export const Button = ({ 
  children, variant = 'primary', icon: Icon, isLoading, className = '', onClick, disabled, size = 'default', title
}) => {
  const baseStyle = `flex items-center justify-center gap-2 px-3 ${THEME.metrics.radius} font-medium ${THEME.metrics.fontSize} transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed select-none whitespace-nowrap active:scale-[0.98] outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-100`;
  
  const variants = {
    primary: `${THEME.colors.primary} shadow-sm border border-transparent`,
    secondary: `${THEME.colors.secondary} shadow-sm`,
    ghost: `bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900`,
    danger: `bg-white text-red-600 border border-red-200 hover:bg-red-50 hover:border-red-300 shadow-sm`,
    success: `bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm`,
    outline: `bg-transparent border border-slate-300 text-slate-600 hover:border-indigo-300 hover:text-indigo-600`,
  };

  const sizes = {
    default: THEME.metrics.buttonHeight,
    sm: 'h-7 px-2 text-[11px]',
    lg: 'h-11 px-5 text-[14px]',
    icon: 'h-9 w-9 px-0',
    iconSm: 'h-7 w-7 px-0',
  };

  return (
    <button 
      onClick={onClick} 
      disabled={isLoading || disabled} 
      title={title}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {isLoading ? <Loader2 size={size === 'sm' ? 12 : 16} className="animate-spin" /> : (Icon && <Icon size={size === 'sm' ? 14 : 16} strokeWidth={2} />)}
      {children}
    </button>
  );
};

export const InputField = ({ label, icon: Icon, isRtl, className = '', ...props }) => {
  return (
    <div className={`w-full ${className}`}>
      {label && <label className="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">{label}</label>}
      <div className="relative group">
        {Icon && (
          <div className={`absolute inset-y-0 ${isRtl ? 'right-3' : 'left-3'} flex items-center text-slate-400 group-focus-within:text-indigo-600 transition-colors`}>
            <Icon size={16} />
          </div>
        )}
        <input 
          {...props}
          className={`
            w-full ${THEME.colors.surface} border ${THEME.colors.border}
            ${THEME.metrics.radius} ${THEME.metrics.inputHeight}
            ${Icon ? (isRtl ? 'pr-10 pl-3' : 'pl-10 pr-3') : 'px-3'} 
            outline-none 
            focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100
            transition-all text-[13px] text-slate-800 placeholder:text-slate-400
          `}
        />
      </div>
    </div>
  );
};

export const SelectField = ({ label, children, isRtl, className = '', ...props }) => (
  <div className={`w-full ${className}`}>
    {label && <label className="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">{label}</label>}
    <div className="relative group">
      <select 
        {...props}
        className={`
          w-full ${THEME.colors.surface} border ${THEME.colors.border}
          ${THEME.metrics.radius} ${THEME.metrics.inputHeight} pl-3 pr-10 appearance-none
          outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100
          transition-all text-[13px] text-slate-800 cursor-pointer hover:border-slate-300
        `}
      >
        {children}
      </select>
      <div className={`absolute inset-y-0 ${isRtl ? 'left-3' : 'right-3'} flex items-center pointer-events-none text-slate-400 group-hover:text-slate-600`}>
        <ChevronDown size={14} strokeWidth={2.5} />
      </div>
    </div>
  </div>
);

// --- MODERN TOGGLE SWITCH ---
export const Toggle = ({ checked, onChange, label, disabled }) => (
  <div 
    className={`flex items-center gap-3 select-none ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer group'}`}
    onClick={() => !disabled && onChange(!checked)}
  >
    <div className={`
      w-11 h-6 rounded-full p-1 transition-all duration-300 ease-in-out relative border
      ${checked ? 'bg-indigo-600 border-indigo-600' : 'bg-slate-200 border-slate-300 group-hover:border-slate-400'}
    `}>
      <div className={`
        w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300
        ${checked ? (document.dir === 'rtl' ? '-translate-x-5' : 'translate-x-5') : 'translate-x-0'}
      `}></div>
    </div>
    {label && <span className="text-[13px] font-medium text-slate-700">{label}</span>}
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
    dark: 'bg-slate-700 text-slate-100 border-slate-600',
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${styles[variant] || styles.neutral} ${className}`}>
      {children}
    </span>
  );
};

// --- NEW COMPONENT: FILTER SECTION (Collapsible) ---
export const FilterSection = ({ children, onSearch, onClear, isRtl, title = "فیلترهای جستجو" }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={`bg-white border border-slate-200 rounded-xl shadow-sm mb-4 overflow-hidden transition-all duration-300 ${isOpen ? 'ring-1 ring-slate-200' : ''}`}>
      {/* Header */}
      <div 
        className="flex items-center justify-between px-4 py-3 bg-slate-50/50 cursor-pointer select-none border-b border-transparent hover:bg-slate-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm">
          <Filter size={16} />
          <span>{title}</span>
        </div>
        <div className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          <ChevronDown size={18} />
        </div>
      </div>

      {/* Body */}
      <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="p-4 border-t border-slate-100">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {children}
          </div>
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-50">
            <Button variant="ghost" onClick={onClear} size="sm" icon={X}>پاک کردن فیلترها</Button>
            <Button variant="primary" onClick={onSearch} icon={Search} className="min-w-[120px]">جستجو</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MODERN DATA GRID (Heavy Lifting Component) ---
export const DataGrid = ({ 
  columns, 
  data = [], 
  onSelectAll, 
  onSelectRow, 
  selectedIds = [], 
  isLoading, 
  isRtl, 
  title,
  groupBy = [], // Array of field names to group by
  setGroupBy,   // Function to update groups
  onCreate,
  onDelete,
  onDoubleClick,
  actions       // Function that returns actions for a row
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [expandedGroups, setExpandedGroups] = useState({});

  // -- Grouping Logic --
  // Helper to generate a unique key for group headers
  const getGroupKey = (field, value, level) => `grp-${level}-${field}-${value}`;

  // Process Data: Filter -> Group -> Paginate
  const processedData = useMemo(() => {
    let result = [...data];

    // 1. Client-Side Search (Simple)
    if (searchTerm) {
      result = result.filter(item => 
        Object.values(item).some(val => 
          String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // 2. Grouping Implementation
    if (groupBy.length > 0) {
      // Sort by group fields first
      result.sort((a, b) => {
        for (let field of groupBy) {
          if (a[field] < b[field]) return -1;
          if (a[field] > b[field]) return 1;
        }
        return 0;
      });

      // Flatten with Headers
      const flatList = [];
      // This is a simplified 1-level grouping for prototype. 
      // Multi-level requires recursion, implemented here for level 0 only for stability
      let lastValues = {};
      
      result.forEach(row => {
        let isVisible = true;
        
        // Check levels
        groupBy.forEach((field, level) => {
          const val = row[field];
          const groupKey = getGroupKey(field, val, level);
          
          if (lastValues[level] !== val) {
            // New Group Header Found
            flatList.push({
              _type: 'GROUP_HEADER',
              field,
              value: val,
              level,
              key: groupKey,
              count: result.filter(r => r[field] === val).length // Basic count (optimization needed for huge data)
            });
            lastValues[level] = val;
            
            // Reset deeper levels
            for(let l=level+1; l<groupBy.length; l++) lastValues[l] = null;
          }

          // Visibility Check: If any parent group is collapsed, hide this row
          // For simplicity in this demo: we use specific expanded state
          // Default: Expanded.
          if (expandedGroups[groupKey] === false) {
             isVisible = false;
          }
        });

        if (isVisible) flatList.push(row);
      });
      result = flatList;
    }

    return result;
  }, [data, searchTerm, groupBy, expandedGroups]);

  // Pagination on the View
  // Note: Standard approach implies pagination applies to rows. 
  // With grouping, it's tricky. Here we paginate the *visible list*.
  const totalItems = processedData.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const paginatedData = processedData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const toggleGroup = (groupKey) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupKey]: prev[groupKey] === false ? true : false // Default true (open)
    }));
  };

  const removeGroup = (field) => {
    if(setGroupBy) {
      setGroupBy(groupBy.filter(g => g !== field));
    }
  };

  return (
    <div className="flex flex-col h-full bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      
      {/* 1. GRID TOOLBAR */}
      <div className="px-4 py-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
          <h3 className="font-bold text-slate-700 text-sm whitespace-nowrap">{title || 'لیست اطلاعات'}</h3>
          
          {/* Active Groups Chips */}
          {groupBy.map(field => (
             <span key={field} className="flex items-center gap-1 bg-indigo-50 text-indigo-700 px-2 py-1 rounded-md text-[11px] font-bold border border-indigo-100 animate-in fade-in">
                <span>گروه‌بندی: {columns.find(c => c.field === field)?.header || field}</span>
                <button onClick={() => removeGroup(field)} className="hover:text-red-500"><X size={12}/></button>
             </span>
          ))}

          <div className="h-5 w-px bg-slate-200 mx-1 hidden sm:block"></div>
          
          {/* Action Buttons */}
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
               placeholder="جستجو در لیست..." 
               value={searchTerm}
               onChange={e => setSearchTerm(e.target.value)}
               className={`h-8 w-40 sm:w-56 bg-slate-100 border-none rounded-lg text-xs outline-none focus:ring-1 focus:ring-indigo-500 transition-all ${isRtl ? 'pr-8 pl-2' : 'pl-8 pr-2'}`}
             />
             <Search size={14} className={`absolute top-1/2 -translate-y-1/2 text-slate-400 ${isRtl ? 'right-2.5' : 'left-2.5'}`} />
           </div>
           <div className="flex items-center gap-1 border-r border-slate-200 pr-2 mr-1">
             <Button variant="ghost" size="iconSm" icon={Printer} title="چاپ" />
             <Button variant="ghost" size="iconSm" icon={Download} title="خروجی اکسل" />
             <Button variant="ghost" size="iconSm" icon={Settings} title="تنظیمات ستون‌ها" />
           </div>
        </div>
      </div>

      {/* 2. THE TABLE */}
      <div className="flex-1 overflow-auto relative custom-scrollbar">
        <table className="w-full border-collapse text-[13px] relative">
          <thead className="bg-slate-50 sticky top-0 z-20 shadow-sm">
            <tr>
              <th className="w-12 px-3 py-3 border-b border-slate-200 text-center">
                <input 
                  type="checkbox" 
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                  checked={data.length > 0 && selectedIds.length === data.length}
                  onChange={(e) => onSelectAll && onSelectAll(e.target.checked)}
                />
              </th>
              {columns.map((col, idx) => (
                <th 
                  key={idx} 
                  className={`px-4 py-3 border-b border-slate-200 font-bold text-slate-600 text-start whitespace-nowrap ${col.width || ''}`}
                  style={{ minWidth: col.minWidth }}
                >
                  <div className="flex items-center gap-1 cursor-pointer hover:text-indigo-700 transition-colors group">
                    {col.header}
                    {col.sortable && <ChevronDown size={14} className="text-slate-300 group-hover:text-indigo-400" />}
                  </div>
                </th>
              ))}
              {(actions || columns.some(c => c.type === 'action')) && (
                <th className="px-4 py-3 border-b border-slate-200 w-24 text-center sticky left-0 bg-slate-50 z-20 shadow-[-5px_0_10px_-5px_rgba(0,0,0,0.1)]">عملیات</th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-100">
            {isLoading ? (
               <tr><td colSpan={100} className="p-12 text-center text-slate-500"><div className="flex flex-col items-center gap-2"><Loader2 className="animate-spin text-indigo-600" size={32}/><span>در حال بارگذاری اطلاعات...</span></div></td></tr>
            ) : paginatedData.length === 0 ? (
               <tr><td colSpan={100} className="p-12 text-center text-slate-400 italic">هیچ اطلاعاتی یافت نشد.</td></tr>
            ) : (
              paginatedData.map((row, rowIndex) => {
                
                // --- RENDER GROUP HEADER ---
                if (row._type === 'GROUP_HEADER') {
                  const isClosed = expandedGroups[row.key] === false;
                  return (
                    <tr key={row.key} className="bg-slate-50/80 sticky top-10 z-10">
                      <td colSpan={100} className="px-4 py-2 border-y border-slate-200">
                        <div 
                          className="flex items-center gap-2 cursor-pointer select-none"
                          onClick={() => toggleGroup(row.key)}
                          style={{ paddingRight: `${row.level * 20}px` }}
                        >
                           <div className={`p-1 rounded hover:bg-slate-200 transition-transform duration-200 ${isClosed ? (isRtl ? 'rotate-90' : '-rotate-90') : ''}`}>
                             <ChevronDown size={16} className="text-slate-500" />
                           </div>
                           <span className="font-bold text-slate-700 text-sm">{columns.find(c => c.field === row.field)?.header}:</span>
                           <span className="font-medium text-slate-900">{row.value}</span>
                           <Badge variant="neutral" className="mr-2 text-[10px] h-5">{row.count} مورد</Badge>
                        </div>
                      </td>
                    </tr>
                  );
                }

                // --- RENDER DATA ROW ---
                const isSelected = selectedIds.includes(row.id);
                return (
                  <tr 
                    key={row.id || rowIndex} 
                    onDoubleClick={() => onDoubleClick && onDoubleClick(row)}
                    className={`
                      transition-all duration-150 group
                      ${isSelected ? THEME.colors.rowSelected : 'hover:bg-slate-50'}
                    `}
                  >
                    <td className="px-3 py-3 border-r border-slate-100 text-center">
                      <input 
                        type="checkbox" 
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                        checked={isSelected}
                        onChange={(e) => onSelectRow && onSelectRow(row.id, e.target.checked)}
                      />
                    </td>
                    {columns.map((col, cIdx) => (
                      <td key={cIdx} className="px-4 py-3 border-r border-slate-100 text-slate-700 truncate max-w-xs align-middle">
                         {/* Toggle Column Type */}
                         {col.type === 'toggle' ? (
                           <Toggle checked={row[col.field]} onChange={() => {}} disabled /> /* Disabled inside grid usually */
                         ) : col.render ? (
                           col.render(row)
                         ) : (
                           row[col.field]
                         )}
                      </td>
                    ))}
                    
                    {/* Actions Column */}
                    {(actions || columns.some(c => c.type === 'action')) && (
                      <td className="px-2 py-2 text-center sticky left-0 bg-white group-hover:bg-slate-50 border-l border-slate-100 shadow-[-5px_0_10px_-5px_rgba(0,0,0,0.05)] z-10">
                        <div className="flex items-center justify-center gap-1 opacity-100"> {/* Make opacity 0 -> 100 on hover for cleaner look? Keeping 100 for usability */}
                          {actions ? actions(row) : (
                             // Default Actions if configured via columns
                             columns.filter(c => c.type === 'action').map((actCol, i) => (
                               actCol.actions.map((act, j) => (
                                 <Button 
                                    key={j} 
                                    variant={act.variant || 'ghost'} 
                                    size="iconSm" 
                                    icon={act.icon} 
                                    title={act.title}
                                    onClick={(e) => { e.stopPropagation(); act.onClick(row); }}
                                    className={act.colorClass}
                                 />
                               ))
                             ))
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* 3. PAGINATION FOOTER */}
      <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
           <span className="text-[12px] text-slate-500">تعداد در صفحه:</span>
           <select 
             value={pageSize}
             onChange={(e) => setPageSize(Number(e.target.value))}
             className="bg-white border border-slate-300 rounded text-[12px] font-bold text-slate-700 py-1 px-2 outline-none focus:border-indigo-500"
           >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
           </select>
           <div className="h-4 w-px bg-slate-300 mx-2"></div>
           <span className="text-[12px] text-slate-600">
             نمایش <span className="font-bold">{Math.min((currentPage - 1) * pageSize + 1, totalItems)}</span> تا <span className="font-bold">{Math.min(currentPage * pageSize, totalItems)}</span> از <span className="font-bold">{totalItems}</span> رکورد
           </span>
        </div>

        <div className="flex items-center gap-1">
           <Button variant="outline" size="iconSm" icon={ChevronsRight} disabled={currentPage === 1} onClick={() => setCurrentPage(1)} />
           <Button variant="outline" size="iconSm" icon={ChevronRight} disabled={currentPage === 1} onClick={() => setCurrentPage(c => c - 1)} />
           
           <div className="flex items-center gap-1 px-2">
              <span className="text-[12px] text-slate-600">صفحه</span>
              <input 
                value={currentPage}
                onChange={(e) => setCurrentPage(Number(e.target.value))}
                className="w-10 h-7 text-center border border-slate-300 rounded text-[12px] font-bold outline-none focus:border-indigo-500"
              />
              <span className="text-[12px] text-slate-600">از {totalPages}</span>
           </div>

           <Button variant="outline" size="iconSm" icon={ChevronLeft} disabled={currentPage === totalPages} onClick={() => setCurrentPage(c => c + 1)} />
           <Button variant="outline" size="iconSm" icon={ChevronsLeft} disabled={currentPage === totalPages} onClick={() => setCurrentPage(totalPages)} />
        </div>
      </div>
    </div>
  );
};

// ... (Rest of TreeMenu, Modal, etc. remains same, but TreeMenu is already updated in previous step) ...
// Re-exporting TreeMenu from previous step for completeness (Assuming it's there or user has it)
// If I need to provide FULL file, I should include TreeMenu, Modal, DatePicker, LOV again.
// Based on "Rewrite UIComponents completely", I will include everything to be safe.

// --- TreeMenu (Updated previously, including here for full file consistency) ---
export const TreeMenu = ({ items, activeId, onSelect, isRtl }) => {
  const [expanded, setExpanded] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  const toggle = (id, e) => { e.stopPropagation(); setExpanded(prev => ({ ...prev, [id]: !prev[id] })); };
  const getLabel = (item) => (typeof item.label === 'object' && item.label !== null) ? (isRtl ? item.label.fa : item.label.en) : item.label;
  
  const handleExpandAll = () => {
    const allIds = {};
    const traverse = (nodes) => { nodes.forEach(n => { if(n.children?.length){ allIds[n.id]=true; traverse(n.children);} }); };
    traverse(items); setExpanded(allIds);
  };

  const filterItems = (nodes, term) => {
    if (!term) return nodes;
    return nodes.reduce((acc, node) => {
      const label = getLabel(node) || '';
      const matches = label.toLowerCase().includes(term.toLowerCase());
      const filteredChildren = node.children ? filterItems(node.children, term) : [];
      if (matches || filteredChildren.length > 0) acc.push({ ...node, children: filteredChildren, _isMatch: matches });
      return acc;
    }, []);
  };
  const visibleItems = useMemo(() => filterItems(items, searchTerm), [items, searchTerm, isRtl]);

  const renderItem = (item, depth = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = searchTerm ? true : expanded[item.id];
    const label = getLabel(item);
    
    if (depth === 0 && hasChildren) {
      return (
        <div key={item.id} className="mb-2">
           <div onClick={(e) => toggle(item.id, e)} className="px-5 mt-3 mb-1 flex items-center gap-2 select-none group cursor-pointer hover:bg-slate-50 py-1 rounded">
              <div className="text-slate-400">{isExpanded ? <ChevronDown size={14} /> : (isRtl ? <ChevronLeft size={14} /> : <ChevronRight size={14} />)}</div>
              <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest group-hover:text-indigo-700">{label}</span>
              <div className="h-px flex-1 bg-slate-100 group-hover:bg-indigo-50"></div>
           </div>
           {isExpanded && <div className="flex flex-col">{item.children.map(child => renderItem(child, depth + 1))}</div>}
        </div>
      );
    }
    return (
      <div key={item.id} className="relative">
        {depth > 1 && !searchTerm && <div className={`absolute top-0 bottom-0 ${isRtl ? 'right-[19px]' : 'left-[19px]'} w-px bg-slate-200`}></div>}
        <div onClick={(e) => { if(hasChildren) toggle(item.id, e); else onSelect && onSelect(item.id); }} 
             className={`group flex items-center gap-2 py-2 my-0.5 rounded-lg cursor-pointer transition-all select-none ${activeId === item.id && !hasChildren ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-600 hover:bg-slate-100'} ${depth === 0 ? 'mx-4' : (isRtl ? 'mr-8 ml-2' : 'ml-8 mr-2')}`}>
          <div className="shrink-0 flex items-center justify-center w-5 h-5">
             {hasChildren ? <ChevronDown size={14} className={`text-slate-400 ${isExpanded ? '' : (isRtl ? 'rotate-90' : '-rotate-90')}`} /> : <div className={`w-1.5 h-1.5 rounded-full ${activeId === item.id ? 'bg-indigo-600' : 'bg-slate-300 group-hover:bg-slate-400'}`}></div>}
          </div>
          <span className="text-[13px] truncate flex-1 leading-normal pt-0.5">{searchTerm && item._isMatch ? <mark className="bg-yellow-100 rounded px-0.5">{label}</mark> : label}</span>
        </div>
        {hasChildren && isExpanded && <div className="overflow-hidden">{item.children.map(child => renderItem(child, depth + 1))}</div>}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-2 shrink-0 flex flex-col gap-2">
        <div className="relative">
          <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder={isRtl ? "جستجو..." : "Search..."} className={`w-full bg-slate-100 border-none rounded-lg text-xs h-8 focus:ring-2 focus:ring-indigo-100 outline-none ${isRtl ? 'pr-8 pl-2' : 'pl-8 pr-2'}`} />
          <Search size={14} className={`absolute top-1/2 -translate-y-1/2 text-slate-400 ${isRtl ? 'right-2.5' : 'left-2.5'}`} />
        </div>
        <div className="flex justify-end gap-1"><button onClick={handleExpandAll} className="p-1 text-slate-400 hover:text-indigo-600"><FolderOpen size={14}/></button><button onClick={() => setExpanded({})} className="p-1 text-slate-400 hover:text-indigo-600"><Folder size={14}/></button></div>
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar py-2">{visibleItems.length>0?visibleItems.map(item => renderItem(item, 0)):<div className="text-center text-slate-400 text-xs mt-4">No items</div>}</div>
    </div>
  );
};

export const Modal = ({ isOpen, onClose, title, children, footer, size = 'md' }) => {
  if (!isOpen) return null;
  const sizes = { sm: 'max-w-sm', md: 'max-w-xl', lg: 'max-w-4xl', xl: 'max-w-6xl', full: 'max-w-[95vw] h-[90vh]' };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className={`bg-white rounded-xl shadow-2xl flex flex-col w-full ${sizes[size]} max-h-[90vh] animate-in zoom-in-95 border border-slate-200`}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/50 shrink-0 rounded-t-xl">
          <h3 className="font-bold text-slate-800 text-sm">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-red-500 transition-colors"><X size={20} /></button>
        </div>
        <div className="p-5 overflow-y-auto flex-1">{children}</div>
        {footer && (<div className="px-5 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-2 shrink-0 rounded-b-xl">{footer}</div>)}
      </div>
    </div>
  );
};

export const DatePicker = ({ label, isRtl, className = '', ...props }) => (
  <div className={`w-full ${className}`}>
    {label && <label className="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">{label}</label>}
    <div className="relative">
       <input type="date" {...props} className={`w-full ${THEME.colors.surface} border ${THEME.colors.border} ${THEME.metrics.radius} ${THEME.metrics.inputHeight} px-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-[13px] text-slate-800 uppercase font-mono transition-all`} />
    </div>
  </div>
);

export const LOV = ({ label, placeholder, onSearch, isRtl, className = '' }) => {
  return (
    <div className={`w-full ${className}`}>
       {label && <label className="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">{label}</label>}
       <div className="flex relative group">
          <input placeholder={placeholder} className={`flex-1 ${THEME.colors.surface} border ${THEME.colors.border} ${isRtl ? 'rounded-r-lg border-l-0' : 'rounded-l-lg border-r-0'} ${THEME.metrics.inputHeight} px-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-[13px] z-10`} />
          <button className={`bg-slate-50 border ${THEME.colors.border} px-3 hover:bg-slate-100 text-slate-500 ${isRtl ? 'rounded-l-lg border-r-0' : 'rounded-r-lg border-l-0'}`}><List size={16} /></button>
       </div>
    </div>
  );
};

// --- Exports ---
window.UI = { Button, InputField, SelectField, Toggle, Badge, DataGrid, FilterSection, TreeMenu, Modal, DatePicker, LOV, THEME };
