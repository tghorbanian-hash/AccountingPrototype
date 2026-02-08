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
    rowSelected: 'bg-indigo-50 border-l-4 border-l-indigo-600', // Selected row indicator
    groupHeader: 'bg-slate-100/90 backdrop-blur-sm text-slate-700 font-bold',
  },
  metrics: {
    radius: 'rounded-md', // Slightly sharper corners for enterprise look
    inputHeight: 'h-8',   // Compact inputs
    buttonHeight: 'h-8',  // Compact buttons
    fontSize: 'text-[12px]', // Standard readable size
    headerHeight: 'h-9',
  }
};

// --- HELPER COMPONENTS ---

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
    sm: 'h-6 px-2 text-[11px]', // Very compact
    icon: 'h-8 w-8 px-0',
    iconSm: 'h-6 w-6 px-0', // Tiny icon button
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

// --- FILTER SECTION ---
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

// --- DATA GRID ---
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

  // -- Sort Handler --
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // -- Processing Data --
  const processedData = useMemo(() => {
    let result = [...data];

    // 1. Search
    if (searchTerm) {
      result = result.filter(item => 
        Object.values(item).some(val => 
          String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // 2. Sorting (Column Sort)
    if (sortConfig.key) {
      result.sort((a, b) => {
        const valA = a[sortConfig.key];
        const valB = b[sortConfig.key];
        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    // 3. Grouping
    if (groupBy.length > 0) {
      // Prioritize group sorting
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

  // -- Pagination Logic --
  const totalItems = processedData.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  // Reset page if data length changes
  useEffect(() => { if(currentPage > totalPages) setCurrentPage(1); }, [totalItems]);
  
  const paginatedData = processedData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const toggleGroup = (groupKey) => {
    setExpandedGroups(prev => ({ ...prev, [groupKey]: prev[groupKey] === false ? true : false }));
  };

  const removeGroup = (field) => {
    if(setGroupBy) setGroupBy(groupBy.filter(g => g !== field));
  };

  return (
    <div className="flex flex-col h-full bg-white border border-slate-300 rounded-lg shadow-sm overflow-hidden">
      
      {/* TOOLBAR */}
      <div className="px-3 py-2 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {/* Active Groups */}
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
             <Button variant="ghost" size="iconSm" icon={Download} title="اکسل" />
             <Button variant="ghost" size="iconSm" icon={Settings} title="تنظیمات" />
           </div>
        </div>
      </div>

      {/* TABLE */}
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
                           <div className="opacity-0 group-hover:opacity-50"><ArrowDown size={12}/></div> // Hint
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
                
                // Group Header
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

                // Data Row
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
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5 cursor-pointer"
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
                    
                    {/* Actions Column */}
                    <td className="px-1 py-1 text-center sticky left-0 bg-white group-hover:bg-slate-50 border-l border-slate-100 shadow-[-2px_0_5px_rgba(0,0,0,0.02)] z-10">
                      <div className="flex items-center justify-center gap-1">
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

      {/* PAGINATION FOOTER */}
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

// --- Re-export TreeMenu & others to keep file complete ---
export const TreeMenu = ({ items, activeId, onSelect, isRtl }) => {
  const [expanded, setExpanded] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const toggle = (id, e) => { e.stopPropagation(); setExpanded(prev => ({ ...prev, [id]: !prev[id] })); };
  const getLabel = (item) => (typeof item.label === 'object' && item.label !== null) ? (isRtl ? item.label.fa : item.label.en) : item.label;
  const handleExpandAll = () => { const all={}; const t=(n)=>{n.forEach(x=>{if(x.children)all[x.id]=true;if(x.children)t(x.children)})}; t(items); setExpanded(all); };
  const filter = (nodes, term) => { if(!term)return nodes; return nodes.reduce((acc,n)=>{ const l=getLabel(n)||''; const m=l.toLowerCase().includes(term.toLowerCase()); const c=n.children?filter(n.children,term):[]; if(m||c.length>0)acc.push({...n,children:c,_isMatch:m}); return acc; },[])};
  const visible = useMemo(()=>filter(items,searchTerm),[items,searchTerm,isRtl]);
  const render = (item,d=0) => {
    const hasC=item.children?.length>0, isEx=searchTerm?true:expanded[item.id], label=getLabel(item);
    if(d===0&&hasC) return <div key={item.id} className="mb-2"><div onClick={(e)=>toggle(item.id,e)} className="px-4 py-1 flex items-center gap-2 cursor-pointer hover:bg-slate-100 rounded text-[11px] font-black text-slate-500 uppercase tracking-widest">{isEx?<ChevronDown size={14}/>:(isRtl?<ChevronLeft size={14}/>:<ChevronRight size={14}/>)}<span>{label}</span><div className="h-px bg-slate-200 flex-1"/></div>{isEx&&<div>{item.children.map(c=>render(c,d+1))}</div>}</div>;
    return <div key={item.id} className="relative"><div onClick={(e)=>hasC?toggle(item.id,e):onSelect(item.id)} className={`flex items-center gap-2 py-1 px-2 mx-2 rounded cursor-pointer ${activeId===item.id&&!hasC?'bg-indigo-50 text-indigo-700 font-bold border-r-2 border-indigo-600':'text-slate-600 hover:bg-slate-100'} text-[12px]`} style={{paddingRight:d===0?'8px':(isRtl?`${d*12+8}px`:'8px')}}>{hasC?<ChevronDown size={14} className={isEx?'':'rotate-90'}/>:<div className={`w-1.5 h-1.5 rounded-full ${activeId===item.id?'bg-indigo-600':'bg-slate-300'}`}/>}<span className="truncate">{label}</span></div>{hasC&&isEx&&<div>{item.children.map(c=>render(c,d+1))}</div>}</div>;
  };
  return <div className="flex flex-col h-full"><div className="px-3 py-2 flex flex-col gap-2 shrink-0"><div className="relative"><input value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} placeholder="جستجو..." className="w-full bg-slate-100 border-none rounded text-xs h-7 pr-7 outline-none"/><Search size={12} className="absolute top-2 right-2 text-slate-400"/></div><div className="flex justify-end gap-1"><button onClick={handleExpandAll} className="p-1 hover:bg-slate-200 rounded"><FolderOpen size={14}/></button><button onClick={()=>setExpanded({})} className="p-1 hover:bg-slate-200 rounded"><Folder size={14}/></button></div></div><div className="flex-1 overflow-y-auto custom-scrollbar">{visible.map(i=>render(i))}</div></div>;
};

export const Modal = ({ isOpen, onClose, title, children, footer, size = 'md' }) => {
  if (!isOpen) return null;
  const sizes = { sm: 'max-w-sm', md: 'max-w-xl', lg: 'max-w-4xl', xl: 'max-w-6xl', full: 'max-w-[95vw] h-[90vh]' };
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4"><div className={`bg-white rounded-lg shadow-2xl flex flex-col w-full ${sizes[size]} max-h-[90vh] animate-in zoom-in-95 border border-slate-200`}><div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-50 rounded-t-lg"><h3 className="font-bold text-slate-800 text-sm">{title}</h3><button onClick={onClose}><X size={18} className="text-slate-400 hover:text-red-500"/></button></div><div className="p-4 overflow-y-auto flex-1">{children}</div>{footer&&<div className="px-4 py-3 border-t border-slate-200 bg-slate-50 flex justify-end gap-2 rounded-b-lg">{footer}</div>}</div></div>;
};

export const DatePicker = ({ label, isRtl, className = '', ...props }) => (
  <div className={`w-full ${className}`}>{label && <label className="block text-[11px] font-bold text-slate-600 mb-1">{label}</label>}<div className="relative"><input type="date" {...props} className={`w-full ${THEME.colors.surface} border ${THEME.colors.border} ${THEME.metrics.radius} ${THEME.metrics.inputHeight} px-2 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-[12px] text-slate-800 uppercase font-mono transition-all`} /></div></div>
);

export const LOV = ({ label, placeholder, isRtl }) => (
  <div className="w-full">{label&&<label className="block text-[11px] font-bold text-slate-600 mb-1">{label}</label>}<div className="flex relative"><input placeholder={placeholder} className={`flex-1 ${THEME.colors.surface} border ${THEME.colors.border} rounded-r-md border-l-0 ${THEME.metrics.inputHeight} px-2 outline-none focus:border-indigo-500 text-[12px]`}/><button className={`bg-slate-50 border ${THEME.colors.border} px-2 hover:bg-slate-100 rounded-l-md border-r-0`}><List size={14}/></button></div></div>
);

// --- Exports ---
window.UI = { Button, InputField, SelectField, Toggle, Badge, DataGrid, FilterSection, TreeMenu, Modal, DatePicker, LOV, THEME };
