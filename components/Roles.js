/* Filename: components/Roles.js */
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Shield, Plus, Edit, Trash2, Save, X, Check, 
  ChevronRight, ChevronLeft, Lock, Filter, 
  Calendar, Layers, CheckSquare, Eye, AlertCircle 
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
  // ساختار: { roleId: { moduleId: { actions: [], dataScopes: {} } } }
  const [permissions, setPermissions] = useState({});

  // --- STATES ---
  const [selectedRows, setSelectedRows] = useState([]);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [formData, setFormData] = useState({ title: '', code: '', isActive: true, startDate: '', endDate: '' });

  // Access Management States
  const [selectedModule, setSelectedModule] = useState(null);
  const [tempPermissions, setTempPermissions] = useState({}); // برای ذخیره موقت قبل از دکمه "ذخیره تغییرات"

  // --- DEFINITIONS FOR LAYERS 2 & 3 ---
  const AVAILABLE_ACTIONS = [
    { id: 'create', label: 'ایجاد / ثبت' },
    { id: 'edit', label: 'ویرایش' },
    { id: 'delete', label: 'حذف' },
    { id: 'view', label: 'مشاهده' },
    { id: 'print', label: 'چاپ / خروجی' },
    { id: 'approve', label: 'تایید / قطعی کردن' },
  ];

  // نمونه محدودیت‌های سطح داده (Layer 3)
  const DATA_SCOPES = {
    'gl_docs': [ // فقط برای فرم مدیریت اسناد
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
    // کپی عمیق دسترسی‌های فعلی به متغیر موقت
    setTempPermissions(JSON.parse(JSON.stringify(permissions[role.id] || {})));
    setSelectedModule(null);
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

  // تغییر در دسترسی لایه ۲ (Actions)
  const toggleAction = (moduleId, actionId) => {
    setTempPermissions(prev => {
      const modulePerms = prev[moduleId] || { actions: [], dataScopes: {} };
      const hasAction = modulePerms.actions.includes(actionId);
      
      let newActions;
      if (hasAction) {
        newActions = modulePerms.actions.filter(a => a !== actionId);
      } else {
        newActions = [...modulePerms.actions, actionId];
      }

      // اگر هیچ اکشنی نماند، کل پرمیشن ماژول حذف شود؟ (اختیاری: اینجا نگه میداریم)
      return {
        ...prev,
        [moduleId]: { ...modulePerms, actions: newActions }
      };
    });
  };

  // تغییر در دسترسی لایه ۳ (Data Scopes)
  const toggleDataScope = (moduleId, scopeId, value) => {
    setTempPermissions(prev => {
      const modulePerms = prev[moduleId] || { actions: [], dataScopes: {} };
      const currentScopeValues = modulePerms.dataScopes[scopeId] || [];
      
      let newValues;
      if (currentScopeValues.includes(value)) {
        newValues = currentScopeValues.filter(v => v !== value);
      } else {
        newValues = [...currentScopeValues, value];
      }

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

  // بررسی وضعیت تیک خوردن یک ماژول در درخت
  const getModuleStatus = (item) => {
    const perm = tempPermissions[item.id];
    if (perm && perm.actions.length > 0) return 'full'; // دارای دسترسی
    // اینجا میتوان منطق برای Parent Node ها نوشت که اگر فرزندانش دسترسی داشتند، نیمه پر نشان دهد
    return 'none';
  };

  // --- RENDER HELPERS ---
  // رندر کردن درخت منو به صورت بازگشتی برای انتخاب ماژول
  const renderTree = (items, depth = 0) => {
    return items.map(item => {
      const hasChildren = item.children && item.children.length > 0;
      const status = getModuleStatus(item);
      const isSelected = selectedModule?.id === item.id;
      
      return (
        <div key={item.id} className="select-none">
          <div 
            className={`
              flex items-center gap-2 py-2 px-2 cursor-pointer rounded-lg transition-colors
              ${isSelected ? 'bg-indigo-50 text-indigo-700 font-bold' : 'hover:bg-slate-50 text-slate-700'}
            `}
            style={{ paddingRight: `${depth * 20 + 8}px` }}
            onClick={() => !hasChildren && setSelectedModule(item)}
          >
            {hasChildren ? (
              <div className="w-4 h-4 flex items-center justify-center text-slate-400">
                {isRtl ? <ChevronLeft size={12}/> : <ChevronRight size={12}/>}
              </div>
            ) : (
              <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${status === 'full' ? 'bg-green-500 border-green-500 text-white' : 'border-slate-300 bg-white'}`}>
                {status === 'full' && <Check size={10} />}
              </div>
            )}
            <span className="text-[12px] truncate">{item.label[isRtl ? 'fa' : 'en']}</span>
          </div>
          {hasChildren && <div>{renderTree(item.children, depth + 1)}</div>}
        </div>
      );
    });
  };

  // --- COLUMNS ---
  const columns = [
    { header: 'شناسه', field: 'id', width: 'w-16', sortable: true },
    { header: 'عنوان نقش', field: 'title', width: 'w-48', sortable: true },
    { header: 'کد سیستمی', field: 'code', width: 'w-32', sortable: true },
    { 
      header: 'تاریخ شروع', 
      field: 'startDate', 
      width: 'w-32',
      render: (row) => <span className="dir-ltr font-mono text-xs">{row.startDate || '-'}</span>
    },
    { 
      header: 'تاریخ پایان', 
      field: 'endDate', 
      width: 'w-32',
      render: (row) => <span className="dir-ltr font-mono text-xs text-slate-500">{row.endDate || 'نامحدود'}</span>
    },
    { 
      header: 'وضعیت', 
      field: 'isActive',
      width: 'w-24 text-center',
      render: (row) => (
        <Badge variant={row.isActive ? 'success' : 'neutral'}>
           {row.isActive ? 'فعال' : 'غیرفعال'}
        </Badge>
      )
    },
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
            
            <div className="bg-amber-50 p-3 rounded border border-amber-200 text-amber-800 text-xs flex gap-2 items-start">
               <AlertCircle size={16} className="shrink-0 mt-0.5"/>
               <span>
                  توجه: اگر تاریخ پایان مشخص شود، پس از آن تاریخ، تمام دسترسی‌های کاربرانی که این نقش را دارند به طور خودکار قطع خواهد شد.
               </span>
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

      {/* 4. ACCESS MANAGEMENT MODAL (THE 3-LAYER LOGIC) */}
      <Modal
         isOpen={isAccessModalOpen}
         onClose={() => setIsAccessModalOpen(false)}
         title={editingRole ? `مدیریت دسترسی‌های نقش: ${editingRole.title}` : "مدیریت دسترسی"}
         size="xl" // مودال عریض برای نمایش دو ستون
         footer={
            <>
               <Button variant="secondary" onClick={() => setIsAccessModalOpen(false)}>انصراف</Button>
               <Button variant="primary" icon={Save} onClick={saveAccess}>اعمال دسترسی‌ها</Button>
            </>
         }
      >
         <div className="flex h-[500px] border border-slate-200 rounded-lg overflow-hidden">
            
            {/* LEFT PANE: LAYER 1 (Tree Menu) */}
            <div className="w-1/3 border-l border-slate-200 bg-slate-50 flex flex-col">
               <div className="p-3 border-b border-slate-200 bg-white font-bold text-xs text-slate-700 flex items-center gap-2">
                  <Layers size={14} className="text-indigo-600"/>
                  لایه ۱: انتخاب فرم/صفحه
               </div>
               <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
                  {renderTree(MENU_DATA)}
               </div>
            </div>

            {/* RIGHT PANE: LAYERS 2 & 3 (Permissions) */}
            <div className="w-2/3 bg-white flex flex-col">
               {selectedModule ? (
                  <>
                     <div className="p-4 border-b border-slate-100">
                        <h3 className="font-black text-slate-800 text-sm flex items-center gap-2">
                           <span className="bg-indigo-100 text-indigo-700 p-1 rounded"><CheckSquare size={16}/></span>
                           تنظیمات دسترسی: {selectedModule.label[isRtl ? 'fa' : 'en']}
                        </h3>
                     </div>
                     
                     <div className="flex-1 overflow-y-auto p-5 space-y-8">
                        
                        {/* LAYER 2: OPERATIONS */}
                        <div>
                           <div className="text-xs font-black text-slate-400 uppercase mb-3 flex items-center gap-2">
                              <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">2</span>
                              لایه ۲: عملیات مجاز (Operations)
                           </div>
                           <div className="grid grid-cols-2 gap-3">
                              {AVAILABLE_ACTIONS.map(action => {
                                 const isChecked = tempPermissions[selectedModule.id]?.actions?.includes(action.id);
                                 return (
                                    <div 
                                       key={action.id} 
                                       className={`
                                          flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer
                                          ${isChecked ? 'bg-indigo-50 border-indigo-200 shadow-sm' : 'bg-white border-slate-200 hover:border-slate-300'}
                                       `}
                                       onClick={() => toggleAction(selectedModule.id, action.id)}
                                    >
                                       <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isChecked ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-slate-300'}`}>
                                          {isChecked && <Check size={14} className="text-white"/>}
                                       </div>
                                       <span className={`text-xs font-bold ${isChecked ? 'text-indigo-700' : 'text-slate-600'}`}>{action.label}</span>
                                    </div>
                                 );
                              })}
                           </div>
                        </div>

                        {/* LAYER 3: DATA SCOPES */}
                        {DATA_SCOPES[selectedModule.id] ? (
                           <div>
                              <div className="text-xs font-black text-slate-400 uppercase mb-3 flex items-center gap-2 border-t border-slate-100 pt-6">
                                 <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">3</span>
                                 لایه ۳: دسترسی روی داده (Data Scopes)
                              </div>
                              <div className="space-y-4">
                                 {DATA_SCOPES[selectedModule.id].map(scope => (
                                    <div key={scope.id} className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                                       <h4 className="text-xs font-bold text-slate-800 mb-2">{scope.label}:</h4>
                                       <div className="flex flex-wrap gap-2">
                                          {scope.options.map(opt => {
                                             const selectedValues = tempPermissions[selectedModule.id]?.dataScopes?.[scope.id] || [];
                                             const isActive = selectedValues.includes(opt.value);
                                             return (
                                                <button
                                                   key={opt.value}
                                                   onClick={() => toggleDataScope(selectedModule.id, scope.id, opt.value)}
                                                   className={`
                                                      px-3 py-1.5 rounded text-[11px] font-bold border transition-all
                                                      ${isActive ? 'bg-white border-green-500 text-green-700 shadow-sm' : 'bg-white border-slate-300 text-slate-500 hover:border-slate-400'}
                                                   `}
                                                >
                                                   {opt.label}
                                                   {isActive && <Check size={10} className="inline-block mr-1"/>}
                                                </button>
                                             );
                                          })}
                                       </div>
                                    </div>
                                 ))}
                              </div>
                           </div>
                        ) : (
                           <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-dashed border-slate-300 text-center">
                              <span className="text-xs text-slate-400">برای این فرم محدودیت لایه ۳ (فیلتر داده) تعریف نشده است.</span>
                           </div>
                        )}

                     </div>
                  </>
               ) : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-400">
                     <Layers size={48} className="mb-4 opacity-20"/>
                     <p className="text-sm font-medium">لطفاً یک آیتم را از درخت سمت راست انتخاب کنید</p>
                  </div>
               )}
            </div>
         </div>
      </Modal>

    </div>
  );
};

window.Roles = Roles;
