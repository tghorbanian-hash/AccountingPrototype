/* Filename: components/Roles.js */
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Shield, Plus, Edit, Trash2, Save, X, Check, 
  ChevronRight, ChevronLeft, Lock, Filter, 
  Calendar, Layers, CheckSquare, Eye, AlertCircle,
  Search, ChevronDown, Folder, FolderOpen
} from 'lucide-react';

const Roles = ({ t, isRtl }) => {
  // 1. دریافت کامپوننت‌های استاندارد
  const UI = window.UI || {};
  const { 
    Button, InputField, Toggle, Badge, DataGrid, 
    FilterSection, Modal, DatePicker, SelectField 
  } = UI;
  const MENU_DATA = window.MENU_DATA || [];

  if (!Button) return <div className="p-4 text-center">Loading UI...</div>;

  // --- MOCK DATA FOR ROLES ---
  const [roles, setRoles] = useState([
    { id: 1, title: 'مدیر ارشد مالی', code: 'CFO', isActive: true, startDate: '1402/01/01', endDate: '' },
    { id: 2, title: 'حسابدار فروش', code: 'ACC_SALES', isActive: true, startDate: '1402/05/10', endDate: '1403/05/10' },
    { id: 3, title: 'حسابرس داخلی', code: 'AUDITOR', isActive: false, startDate: '1402/10/01', endDate: '' },
  ]);

  // --- MOCK PERMISSIONS DATA STORE ---
  const [permissions, setPermissions] = useState({});

  // --- STATES ---
  const [selectedRows, setSelectedRows] = useState([]);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [formData, setFormData] = useState({ title: '', code: '', isActive: true, startDate: '', endDate: '' });

  // Access Management States
  const [selectedModule, setSelectedModule] = useState(null);
  const [tempPermissions, setTempPermissions] = useState({});
  
  // Tree States
  const [expandedNodes, setExpandedNodes] = useState({});
  const [treeSearchTerm, setTreeSearchTerm] = useState('');

  // --- DEFINITIONS FOR LAYERS 2 & 3 ---
  const AVAILABLE_ACTIONS = [
    { id: 'create', label: 'ایجاد' },
    { id: 'view', label: 'مشاهده' },
    { id: 'edit', label: 'ویرایش' },
    { id: 'delete', label: 'حذف' },
    { id: 'print', label: 'چاپ' },
    { id: 'approve', label: 'تایید' },
    { id: 'export', label: 'خروجی اکسل' },
    { id: 'share', label: 'اشتراک گذاری' },
  ];

  const DATA_SCOPES = {
    'gl_docs': [ // شناسه صحیح برای لیست اسناد در MENU_DATA
      {
        id: 'docType',
        label: 'نوع سند',
        options: [
          { value: 'opening', label: 'سند افتتاحیه' },
          { value: 'general', label: 'سند عمومی' },
          { value: 'closing', label: 'سند اختتامیه' },
          { value: 'depreciation', label: 'سند استهلاک' }
        ]
      },
      {
        id: 'docStatus',
        label: 'وضعیت سند',
        options: [
          { value: 'draft', label: 'پیش‌نویس / موقت' },
          { value: 'reviewed', label: 'بررسی شده' },
          { value: 'final', label: 'قطعی / نهایی' }
        ]
      }
    ]
  };

  // --- HANDLERS: ROLE MANAGEMENT ---
  const handleCreate = () => {
    setEditingRole(null);
    setFormData({ title: '', code: '', isActive: true, startDate: '', endDate: '' });
    setIsRoleModalOpen(true);
  };

  const handleEdit = (role) => {
    setEditingRole(role);
    setFormData(role);
    setIsRoleModalOpen(true);
  };

  const handleDelete = (ids) => {
    if (confirm(`آیا از حذف ${ids.length} نقش اطمینان دارید؟`)) {
      setRoles(prev => prev.filter(r => !ids.includes(r.id)));
      setSelectedRows([]);
    }
  };

  const saveRole = () => {
    if (editingRole) {
      setRoles(prev => prev.map(r => r.id === editingRole.id ? { ...formData, id: r.id } : r));
    } else {
      setRoles(prev => [...prev, { ...formData, id: Date.now() }]);
    }
    setIsRoleModalOpen(false);
  };

  // --- HANDLERS: ACCESS MANAGEMENT ---
  const openAccessModal = (role) => {
    setEditingRole(role);
    setTempPermissions(JSON.parse(JSON.stringify(permissions[role.id] || {})));
    setSelectedModule(null);
    setExpandedNodes({}); // Reset tree expansion
    setTreeSearchTerm(''); // Reset search
    setIsAccessModalOpen(true);
  };

  const saveAccess = () => {
    setPermissions(prev => ({
      ...prev,
      [editingRole.id]: tempPermissions
    }));
    setIsAccessModalOpen(false);
    alert('دسترسی‌ها با موفقیت اعمال شد.');
  };

  const toggleAction = (moduleId, actionId) => {
    setTempPermissions(prev => {
      const modulePerms = prev[moduleId] || { actions: [], dataScopes: {} };
      const hasAction = modulePerms.actions.includes(actionId);
      const newActions = hasAction 
        ? modulePerms.actions.filter(a => a !== actionId)
        : [...modulePerms.actions, actionId];

      return {
        ...prev,
        [moduleId]: { ...modulePerms, actions: newActions }
      };
    });
  };

  const toggleDataScope = (moduleId, scopeId, value) => {
    setTempPermissions(prev => {
      const modulePerms = prev[moduleId] || { actions: [], dataScopes: {} };
      const currentScopeValues = modulePerms.dataScopes[scopeId] || [];
      const newValues = currentScopeValues.includes(value) 
        ? currentScopeValues.filter(v => v !== value)
        : [...currentScopeValues, value];

      return {
        ...prev,
        [moduleId]: {
          ...modulePerms,
          dataScopes: {
            ...modulePerms.dataScopes,
            [scopeId]: newValues
          }
        }
      };
    });
  };

  const getModuleStatus = (item) => {
    const perm = tempPermissions[item.id];
    if (perm && perm.actions.length > 0) return 'full';
    return 'none';
  };

  // --- TREE LOGIC (SEARCH & EXPAND) ---
  const toggleNode = (id, e) => {
    e.stopPropagation();
    setExpandedNodes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Filter Menu Data based on Search Term
  const filteredMenuData = useMemo(() => {
    if (!treeSearchTerm) return MENU_DATA;

    const filterNodes = (nodes) => {
      return nodes.reduce((acc, node) => {
        const label = node.label[isRtl ? 'fa' : 'en'] || '';
        const matches = label.toLowerCase().includes(treeSearchTerm.toLowerCase());
        
        let children = [];
        if (node.children) {
          children = filterNodes(node.children);
        }

        if (matches || children.length > 0) {
          acc.push({ ...node, children, _matches: matches });
        }
        return acc;
      }, []);
    };

    return filterNodes(MENU_DATA);
  }, [treeSearchTerm, MENU_DATA, isRtl]);

  // Auto-expand tree when searching
  useEffect(() => {
    if (treeSearchTerm) {
      const allIds = {};
      const traverse = (nodes) => {
        nodes.forEach(n => {
          if (n.children && n.children.length > 0) {
            allIds[n.id] = true;
            traverse(n.children);
          }
        });
      };
      traverse(filteredMenuData);
      setExpandedNodes(allIds);
    } else {
      setExpandedNodes({}); // Collapse all when search cleared
    }
  }, [treeSearchTerm, filteredMenuData]);

  const renderTree = (items, depth = 0) => {
    return items.map(item => {
      const hasChildren = item.children && item.children.length > 0;
      const status = getModuleStatus(item);
      const isSelected = selectedModule?.id === item.id;
      const isExpanded = expandedNodes[item.id];
      const label = item.label[isRtl ? 'fa' : 'en'];
      
      // Highlight matching text
      const displayLabel = (treeSearchTerm && item._matches) ? (
        <span className="bg-yellow-100 text-slate-900 rounded px-1">{label}</span>
      ) : label;

      return (
        <div key={item.id} className="select-none relative">
           {/* Connecting Line for tree hierarchy */}
           {depth > 0 && (
             <div className={`absolute top-0 bottom-0 w-px bg-slate-200 ${isRtl ? 'right-[11px]' : 'left-[11px]'}`}></div>
           )}

          <div 
            className={`
              flex items-center gap-2 py-1.5 px-2 my-0.5 cursor-pointer rounded-lg transition-all
              ${isSelected ? 'bg-indigo-50 text-indigo-700 font-bold ring-1 ring-indigo-200' : 'hover:bg-slate-100 text-slate-700'}
            `}
            style={{ paddingRight: `${depth * 16 + 8}px`, paddingLeft: isRtl ? '8px' : `${depth * 16 + 8}px` }}
            onClick={(e) => {
              if(hasChildren) toggleNode(item.id, e);
              else setSelectedModule(item);
            }}
          >
            {hasChildren ? (
              <div className="w-5 h-5 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors z-10">
                 <div className={`transition-transform duration-200 ${isExpanded ? '' : (isRtl ? 'rotate-90' : '-rotate-90')}`}>
                   <ChevronDown size={14} />
                 </div>
              </div>
            ) : (
              <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all shrink-0 ${status === 'full' ? 'bg-green-500 border-green-500 text-white shadow-sm' : 'border-slate-300 bg-white'}`}>
                {status === 'full' && <Check size={12} strokeWidth={3} />}
              </div>
            )}
            
            <div className="flex items-center gap-2 truncate">
               {hasChildren && (
                 <span className={`text-slate-400 ${isExpanded ? 'text-indigo-400' : ''}`}>
                   {isExpanded ? <FolderOpen size={14}/> : <Folder size={14}/>}
                 </span>
               )}
               <span className="text-[12px] truncate">{displayLabel}</span>
            </div>
          </div>
          
          {hasChildren && isExpanded && (
            <div className="overflow-hidden animate-in slide-in-from-top-1 duration-200">
              {renderTree(item.children, depth + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  // --- RENDER COLUMNS ---
  const columns = [
    { header: 'شناسه', field: 'id', width: 'w-16', sortable: true },
    { header: 'عنوان نقش', field: 'title', width: 'w-48', sortable: true },
    { header: 'کد سیستمی', field: 'code', width: 'w-32', sortable: true },
    { header: 'تاریخ شروع', field: 'startDate', width: 'w-32', render: (r) => <span className="dir-ltr font-mono text-xs">{r.startDate || '-'}</span> },
    { header: 'تاریخ پایان', field: 'endDate', width: 'w-32', render: (r) => <span className="dir-ltr font-mono text-xs text-slate-500">{r.endDate || 'نامحدود'}</span> },
    { header: 'وضعیت', field: 'isActive', width: 'w-24 text-center', render: (r) => <Badge variant={r.isActive ? 'success' : 'neutral'}>{r.isActive ? 'فعال' : 'غیرفعال'}</Badge> },
  ];

  return (
    <div className={`flex flex-col h-full bg-slate-50/50 p-4 overflow-hidden ${isRtl ? 'font-vazir' : 'font-sans'}`}>
      
      {/* 1. HEADER */}
      <div className="flex items-center justify-between mb-4 shrink-0">
         <div>
            <h1 className="text-xl font-black text-slate-800 flex items-center gap-2">
               <Shield className="text-indigo-600" size={24}/>
               مدیریت نقش‌ها و دسترسی‌ها
            </h1>
            <p className="text-slate-500 text-xs mt-1">تعریف نقش‌های سازمانی و تعیین سطوح دسترسی ۳ لایه</p>
         </div>
      </div>

      {/* 2. FILTER & GRID */}
      <FilterSection 
        title="جستجوی نقش‌ها"
        onSearch={() => {}} 
        onClear={() => {}}
        isRtl={isRtl}
      >
         <InputField label="عنوان نقش" placeholder="جستجو..." isRtl={isRtl} />
         <InputField label="کد نقش" placeholder="جستجو..." isRtl={isRtl} />
         <SelectField label="وضعیت" isRtl={isRtl}>
             <option>همه</option>
             <option>فعال</option>
             <option>غیرفعال</option>
         </SelectField>
      </FilterSection>

      <div className="flex-1 min-h-0">
         <DataGrid 
            title="لیست نقش‌های تعریف شده"
            columns={columns}
            data={roles}
            isRtl={isRtl}
            selectedIds={selectedRows}
            onSelectAll={(c) => setSelectedRows(c ? roles.map(r => r.id) : [])}
            onSelectRow={(id, c) => setSelectedRows(p => c ? [...p, id] : p.filter(r => r !== id))}
            onCreate={handleCreate}
            onDelete={handleDelete}
            onDoubleClick={handleEdit}
            actions={(row) => (
               <>
                 <Button variant="ghost" size="iconSm" icon={Edit} className="text-blue-600 hover:bg-blue-50" onClick={() => handleEdit(row)} title="ویرایش مشخصات" />
                 <Button variant="ghost" size="iconSm" icon={Lock} className="text-amber-600 hover:bg-amber-50" onClick={() => openAccessModal(row)} title="مدیریت دسترسی‌ها" />
               </>
            )}
         />
      </div>

      {/* 3. CREATE/EDIT ROLE MODAL */}
      <Modal
         isOpen={isRoleModalOpen}
         onClose={() => setIsRoleModalOpen(false)}
         title={editingRole ? "ویرایش مشخصات نقش" : "تعریف نقش جدید"}
         size="md"
         footer={
            <>
               <Button variant="secondary" onClick={() => setIsRoleModalOpen(false)}>انصراف</Button>
               <Button variant="primary" icon={Save} onClick={saveRole}>ذخیره تغییرات</Button>
            </>
         }
      >
         <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
               <InputField 
                  label="عنوان نقش" 
                  value={formData.title} 
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  isRtl={isRtl} 
                  placeholder="مثال: حسابدار ارشد"
               />
               <InputField 
                  label="کد سیستمی" 
                  value={formData.code} 
                  onChange={(e) => setFormData({...formData, code: e.target.value})}
                  isRtl={isRtl} 
                  placeholder="AC_SENIOR"
                  className="dir-ltr"
               />
            </div>
            <div className="grid grid-cols-2 gap-4">
               <DatePicker 
                  label="تاریخ شروع موثر" 
                  value={formData.startDate}
                  onChange={(e) => setFormData({...formData, startDate: e.target.value})}
               />
               <DatePicker 
                  label="تاریخ پایان موثر" 
                  value={formData.endDate}
                  onChange={(e) => setFormData({...formData, endDate: e.target.value})}
               />
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-2">
               <span className="text-[13px] font-bold text-slate-700">وضعیت نقش</span>
               <Toggle 
                  checked={formData.isActive} 
                  onChange={(val) => setFormData({...formData, isActive: val})} 
                  label={formData.isActive ? "نقش فعال است" : "نقش غیرفعال است"} 
               />
            </div>
         </div>
      </Modal>

      {/* 4. ACCESS MANAGEMENT MODAL */}
      <Modal
         isOpen={isAccessModalOpen}
         onClose={() => setIsAccessModalOpen(false)}
         title={editingRole ? `مدیریت دسترسی‌های نقش: ${editingRole.title}` : "مدیریت دسترسی"}
         size="xl"
         footer={
            <>
               <Button variant="secondary" onClick={() => setIsAccessModalOpen(false)}>انصراف</Button>
               <Button variant="primary" icon={Save} onClick={saveAccess}>اعمال دسترسی‌ها</Button>
            </>
         }
      >
         <div className="flex h-[550px] border border-slate-200 rounded-lg overflow-hidden">
            
            {/* LEFT PANE: TREE MENU */}
            <div className="w-1/3 border-l border-slate-200 bg-slate-50 flex flex-col">
               <div className="p-3 border-b border-slate-200 bg-white font-bold text-xs text-slate-700 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Layers size={14} className="text-indigo-600"/>
                    لایه ۱: انتخاب فرم/صفحه
                  </div>
                  {/* SEARCH INPUT */}
                  <div className="relative">
                     <input 
                        value={treeSearchTerm}
                        onChange={(e) => setTreeSearchTerm(e.target.value)}
                        placeholder="جستجو در منو..." 
                        className={`w-full bg-slate-100 border border-slate-200 rounded-md text-[11px] h-8 focus:bg-white focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none transition-all ${isRtl ? 'pr-8 pl-2' : 'pl-8 pr-2'}`} 
                     />
                     <Search size={14} className={`absolute top-1/2 -translate-y-1/2 text-slate-400 ${isRtl ? 'right-2.5' : 'left-2.5'}`}/>
                     {treeSearchTerm && (
                        <button onClick={() => setTreeSearchTerm('')} className={`absolute top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500 ${isRtl ? 'left-2' : 'right-2'}`}>
                           <X size={12}/>
                        </button>
                     )}
                  </div>
               </div>
               <div className="flex-1 overflow-y-auto p-1 custom-scrollbar">
                  {filteredMenuData.length > 0 ? renderTree(filteredMenuData) : (
                     <div className="text-center p-4 text-slate-400 text-xs">
                        موردی یافت نشد.
                     </div>
                  )}
               </div>
            </div>

            {/* RIGHT PANE: PERMISSIONS */}
            <div className="w-2/3 bg-white flex flex-col">
               {selectedModule ? (
                  <>
                     <div className="p-4 border-b border-slate-100">
                        <h3 className="font-black text-slate-800 text-sm flex items-center gap-2">
                           <span className="bg-indigo-100 text-indigo-700 p-1 rounded"><CheckSquare size={16}/></span>
                           تنظیمات دسترسی: {selectedModule.label[isRtl ? 'fa' : 'en']}
                        </h3>
                        <p className="text-[10px] text-slate-400 mt-1 mr-8">شناسه سیستمی: {selectedModule.id}</p>
                     </div>
                     
                     <div className="flex-1 overflow-y-auto p-5 space-y-8 custom-scrollbar">
                        
                        {/* LAYER 2: OPERATIONS */}
                        <div>
                           <div className="text-xs font-black text-slate-400 uppercase mb-3 flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold">2</span>
                              لایه ۲: عملیات مجاز (Operations)
                           </div>
                           {/* UPDATE: Changed to 4 columns for better layout */}
                           <div className="grid grid-cols-4 gap-2">
                              {AVAILABLE_ACTIONS.map(action => {
                                 const isChecked = tempPermissions[selectedModule.id]?.actions?.includes(action.id);
                                 return (
                                    <div 
                                       key={action.id} 
                                       className={`
                                          flex flex-col items-center gap-2 p-2 rounded-lg border transition-all cursor-pointer select-none text-center
                                          ${isChecked ? 'bg-indigo-50 border-indigo-200 shadow-sm' : 'bg-white border-slate-200 hover:border-slate-300'}
                                       `}
                                       onClick={() => toggleAction(selectedModule.id, action.id)}
                                    >
                                       <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isChecked ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-slate-300'}`}>
                                          {isChecked && <Check size={14} className="text-white"/>}
                                       </div>
                                       <span className={`text-[10px] font-bold ${isChecked ? 'text-indigo-700' : 'text-slate-600'}`}>{action.label}</span>
                                    </div>
                                 );
                              })}
                           </div>
                        </div>

                        {/* LAYER 3: DATA SCOPES */}
                        {DATA_SCOPES[selectedModule.id] ? (
                           <div className="animate-in slide-in-from-bottom-2 duration-300">
                              <div className="text-xs font-black text-slate-400 uppercase mb-3 flex items-center gap-2 border-t border-slate-100 pt-6">
                                 <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold">3</span>
                                 لایه ۳: دسترسی روی داده (Data Scopes)
                              </div>
                              <div className="space-y-4">
                                 {DATA_SCOPES[selectedModule.id].map(scope => (
                                    <div key={scope.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                       <h4 className="text-xs font-bold text-slate-800 mb-3 flex items-center gap-2">
                                          <Filter size={14} className="text-slate-400"/>
                                          {scope.label}:
                                       </h4>
                                       <div className="flex flex-wrap gap-2">
                                          {scope.options.map(opt => {
                                             const selectedValues = tempPermissions[selectedModule.id]?.dataScopes?.[scope.id] || [];
                                             const isActive = selectedValues.includes(opt.value);
                                             return (
                                                <button
                                                   key={opt.value}
                                                   onClick={() => toggleDataScope(selectedModule.id, scope.id, opt.value)}
                                                   // UPDATE: Changed background color for active state
                                                   className={`
                                                      px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-all flex items-center gap-1.5
                                                      ${isActive ? 'bg-green-50 border-green-500 text-green-700 shadow-sm ring-1 ring-green-100' : 'bg-white border-slate-300 text-slate-500 hover:border-slate-400'}
                                                   `}
                                                >
                                                   {isActive && <Check size={12} className="text-green-600"/>}
                                                   {opt.label}
                                                </button>
                                             );
                                          })}
                                       </div>
                                    </div>
                                 ))}
                              </div>
                           </div>
                        ) : (
                           <div className="mt-6 p-6 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-center flex flex-col items-center justify-center gap-2 opacity-70">
                              <Shield size={24} className="text-slate-300"/>
                              <span className="text-xs text-slate-400 font-medium">برای این فرم محدودیت لایه ۳ (فیلتر داده) تعریف نشده است.</span>
                           </div>
                        )}

                     </div>
                  </>
               ) : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-300 select-none">
                     <div className="bg-slate-50 p-6 rounded-full mb-4">
                        <Eye size={48} className="opacity-50"/>
                     </div>
                     <p className="text-sm font-bold text-slate-400">لطفاً یک آیتم را از درخت سمت راست انتخاب کنید</p>
                     <p className="text-xs text-slate-400 mt-1">تا تنظیمات دسترسی نمایش داده شود</p>
                  </div>
               )}
            </div>
         </div>
      </Modal>

    </div>
  );
};

window.Roles = Roles;
