/* Filename: components/Roles.js */
import React, { useState } from 'react';
import { 
  Shield, Edit, Save, Check, Lock, Layers, CheckSquare, Eye, Filter, AlertCircle,
  FolderOpen, Trash2, Zap
} from 'lucide-react';

const Roles = ({ t, isRtl }) => {
  // 1. دریافت کامپوننت‌های استاندارد
  const UI = window.UI || {};
  const { 
    Button, InputField, Toggle, Badge, DataGrid, 
    FilterSection, Modal, DatePicker, SelectField,
    TreeView, SelectionGrid, ToggleChip 
  } = UI;
  const MENU_DATA = window.MENU_DATA || [];

  if (!Button) return <div className="p-4 text-center">Loading UI...</div>;

  // --- MOCK DATA ---
  const [roles, setRoles] = useState([
    { id: 1, title: 'مدیر ارشد مالی', code: 'CFO', isActive: true, startDate: '1402/01/01', endDate: '' },
    { id: 2, title: 'حسابدار فروش', code: 'ACC_SALES', isActive: true, startDate: '1402/05/10', endDate: '1403/05/10' },
    { id: 3, title: 'حسابرس داخلی', code: 'AUDITOR', isActive: false, startDate: '1402/10/01', endDate: '' },
  ]);

  const [permissions, setPermissions] = useState({});
  const [selectedRows, setSelectedRows] = useState([]);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [formData, setFormData] = useState({ title: '', code: '', isActive: true, startDate: '', endDate: '' });

  // Access Management States
  const [selectedModule, setSelectedModule] = useState(null);
  const [tempPermissions, setTempPermissions] = useState({});
  
  // --- CONFIG ---
  const AVAILABLE_ACTIONS = [
    { id: 'create', label: 'ایجاد' },
    { id: 'view', label: 'مشاهده' },
    { id: 'edit', label: 'ویرایش' },
    { id: 'delete', label: 'حذف' },
    { id: 'print', label: 'چاپ' },
    { id: 'approve', label: 'تایید' },
    { id: 'export', label: 'خروجی' },
    { id: 'share', label: 'اشتراک' },
  ];

  const DATA_SCOPES = {
    'doc_list': [
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

  // --- HANDLERS ---
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

  const openAccessModal = (role) => {
    setEditingRole(role);
    setTempPermissions(JSON.parse(JSON.stringify(permissions[role.id] || {})));
    setSelectedModule(null);
    setIsAccessModalOpen(true);
  };

  const saveAccess = () => {
    setPermissions(prev => ({ ...prev, [editingRole.id]: tempPermissions }));
    setIsAccessModalOpen(false);
  };

  // --- PERMISSION LOGIC ---

  const updateAction = (moduleId, actionId) => {
    setTempPermissions(prev => {
      const modulePerms = prev[moduleId] || { actions: [], dataScopes: {} };
      const newActions = modulePerms.actions.includes(actionId)
        ? modulePerms.actions.filter(a => a !== actionId)
        : [...modulePerms.actions, actionId];
      return { ...prev, [moduleId]: { ...modulePerms, actions: newActions } };
    });
  };

  const updateScope = (moduleId, scopeId, value) => {
    setTempPermissions(prev => {
      const modulePerms = prev[moduleId] || { actions: [], dataScopes: {} };
      const current = modulePerms.dataScopes[scopeId] || [];
      const newValues = current.includes(value) ? current.filter(v => v !== value) : [...current, value];
      return { ...prev, [moduleId]: { ...modulePerms, dataScopes: { ...modulePerms.dataScopes, [scopeId]: newValues } } };
    });
  };

  // --- RECURSIVE BULK ACTIONS ---
  
  // Helper to find all children IDs recursively
  const getAllDescendantIds = (node) => {
     let ids = [node.id];
     if (node.children && node.children.length > 0) {
        node.children.forEach(child => {
           ids = [...ids, ...getAllDescendantIds(child)];
        });
     }
     return ids;
  };

  const handleBulkPermission = (mode) => {
     if (!selectedModule) return;
     
     const targetIds = getAllDescendantIds(selectedModule);
     const count = targetIds.length;

     // Confirmation for safety
     if (count > 1 && !confirm(`این عملیات روی ${count} آیتم زیرمجموعه اعمال می‌شود. آیا اطمینان دارید؟`)) return;

     setTempPermissions(prev => {
        const next = { ...prev };
        
        targetIds.forEach(id => {
           if (mode === 'revoke') {
              // Delete permissions for this module
              delete next[id];
           } else {
              // Grant FULL permissions
              const allActions = AVAILABLE_ACTIONS.map(a => a.id);
              let allScopes = {};
              
              // Apply Data Scopes if any defined for this ID
              if (DATA_SCOPES[id]) {
                 DATA_SCOPES[id].forEach(scope => {
                    allScopes[scope.id] = scope.options.map(o => o.value);
                 });
              }

              next[id] = {
                 actions: allActions,
                 dataScopes: allScopes
              };
           }
        });
        
        return next;
     });
  };

  // Render node for TreeView
  const renderPermissionNode = (item) => {
    const hasAccess = tempPermissions[item.id]?.actions?.length > 0;
    return (
      <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all shrink-0 ${hasAccess ? 'bg-green-500 border-green-500 text-white shadow-sm' : 'border-slate-300 bg-white'}`}>
        {hasAccess && <Check size={12} strokeWidth={3} />}
      </div>
    );
  };

  // --- COLUMNS ---
  const columns = [
    { header: 'شناسه', field: 'id', width: 'w-16', sortable: true },
    { header: 'عنوان نقش', field: 'title', width: 'w-48', sortable: true },
    { header: 'کد سیستمی', field: 'code', width: 'w-32', sortable: true },
    { header: 'تاریخ شروع', field: 'startDate', width: 'w-32', render: (r) => <span className="dir-ltr font-mono text-xs">{r.startDate || '-'}</span> },
    { header: 'تاریخ پایان', field: 'endDate', width: 'w-32', render: (r) => <span className="dir-ltr font-mono text-xs text-slate-500">{r.endDate || 'نامحدود'}</span> },
    { header: 'وضعیت', field: 'isActive', width: 'w-24 text-center', render: (r) => <Badge variant={r.isActive ? 'success' : 'neutral'}>{r.isActive ? 'فعال' : 'غیرفعال'}</Badge> },
  ];

  const hasChildren = selectedModule?.children && selectedModule.children.length > 0;

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

      {/* 2. GRID */}
      <FilterSection title="جستجوی نقش‌ها" onSearch={() => {}} onClear={() => {}} isRtl={isRtl}>
         <InputField label="عنوان نقش" placeholder="جستجو..." isRtl={isRtl} />
         <InputField label="کد نقش" placeholder="جستجو..." isRtl={isRtl} />
         <SelectField label="وضعیت" isRtl={isRtl}><option>همه</option></SelectField>
      </FilterSection>

      <div className="flex-1 min-h-0">
         <DataGrid 
            columns={columns} data={roles} isRtl={isRtl}
            selectedIds={selectedRows}
            onSelectAll={(c) => setSelectedRows(c ? roles.map(r => r.id) : [])}
            onSelectRow={(id, c) => setSelectedRows(p => c ? [...p, id] : p.filter(r => r !== id))}
            onCreate={handleCreate} onDelete={handleDelete} onDoubleClick={handleEdit}
            actions={(row) => (
               <>
                 <Button variant="ghost" size="iconSm" icon={Edit} className="text-blue-600 hover:bg-blue-50" onClick={() => handleEdit(row)} title="ویرایش" />
                 <Button variant="ghost" size="iconSm" icon={Lock} className="text-amber-600 hover:bg-amber-50" onClick={() => openAccessModal(row)} title="دسترسی‌ها" />
               </>
            )}
         />
      </div>

      {/* 3. ROLE MODAL */}
      <Modal isOpen={isRoleModalOpen} onClose={() => setIsRoleModalOpen(false)} title={editingRole ? "ویرایش نقش" : "نقش جدید"} size="md"
         footer={<><Button variant="secondary" onClick={() => setIsRoleModalOpen(false)}>انصراف</Button><Button variant="primary" icon={Save} onClick={saveRole}>ذخیره</Button></>}>
         <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
               <InputField label="عنوان نقش" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} isRtl={isRtl} />
               <InputField label="کد سیستمی" value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value})} isRtl={isRtl} className="dir-ltr" />
            </div>
            <div className="grid grid-cols-2 gap-4">
               <DatePicker label="تاریخ شروع" value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} />
               <DatePicker label="تاریخ پایان" value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})} />
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-2">
               <span className="text-[13px] font-bold text-slate-700">وضعیت</span>
               <Toggle checked={formData.isActive} onChange={(val) => setFormData({...formData, isActive: val})} label={formData.isActive ? "فعال" : "غیرفعال"} />
            </div>
         </div>
      </Modal>

      {/* 4. ACCESS MODAL */}
      <Modal isOpen={isAccessModalOpen} onClose={() => setIsAccessModalOpen(false)} title={`دسترسی‌های: ${editingRole?.title}`} size="xl"
         footer={<><Button variant="secondary" onClick={() => setIsAccessModalOpen(false)}>انصراف</Button><Button variant="primary" icon={Save} onClick={saveAccess}>اعمال</Button></>}>
         <div className="flex h-[550px] border border-slate-200 rounded-lg overflow-hidden">
            <div className="w-1/3 border-l border-slate-200 bg-slate-50 flex flex-col p-2">
               <div className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-2"><Layers size={14} className="text-indigo-600"/>لایه ۱: انتخاب فرم</div>
               <TreeView 
                 data={MENU_DATA} 
                 selectedNodeId={selectedModule?.id} 
                 onSelectNode={setSelectedModule} 
                 renderNodeContent={renderPermissionNode} 
                 isRtl={isRtl} 
               />
            </div>

            <div className="w-2/3 bg-white flex flex-col">
               {selectedModule ? (
                  <>
                     <div className="p-4 border-b border-slate-100 bg-white flex items-center justify-between">
                        <div>
                           <h3 className="font-black text-slate-800 text-sm flex items-center gap-2">
                              {hasChildren ? <FolderOpen size={16} className="text-indigo-500"/> : <CheckSquare size={16} className="text-indigo-500"/>}
                              {selectedModule.label[isRtl ? 'fa' : 'en']}
                           </h3>
                           <p className="text-[10px] text-slate-400 mt-0.5 mr-6">{hasChildren ? 'این آیتم دارای زیرمجموعه است' : `شناسه: ${selectedModule.id}`}</p>
                        </div>
                        {/* BULK ACTIONS TOOLBAR */}
                        <div className="flex items-center gap-2">
                           <Button variant="outline" size="sm" icon={Trash2} onClick={() => handleBulkPermission('revoke')} className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-100">حذف تمام دسترسی‌ها</Button>
                           <Button variant="success" size="sm" icon={Zap} onClick={() => handleBulkPermission('grant')}>اعطای دسترسی کامل</Button>
                        </div>
                     </div>

                     {hasChildren ? (
                        <div className="flex flex-col items-center justify-center flex-1 text-slate-400 bg-slate-50/30">
                           <Layers size={48} className="mb-4 opacity-10 text-indigo-500"/>
                           <p className="font-bold text-slate-500 text-sm">شما یک سرشاخه را انتخاب کرده‌اید</p>
                           <p className="text-xs mt-2 max-w-xs text-center">
                              برای تنظیم دسترسی تکی، روی زیرمجموعه‌ها در درخت کلیک کنید. 
                              <br/>
                              یا از دکمه‌های بالا برای <span className="font-bold text-slate-700">اعمال گروهی</span> روی تمام فرزندان استفاده کنید.
                           </p>
                        </div>
                     ) : (
                        <div className="flex-1 overflow-y-auto p-5 space-y-8 custom-scrollbar">
                           <div>
                              <div className="text-xs font-black text-slate-400 uppercase mb-3 flex items-center gap-2">
                                 <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold">2</span>لایه ۲: عملیات
                              </div>
                              <SelectionGrid 
                                 items={AVAILABLE_ACTIONS} 
                                 selectedIds={tempPermissions[selectedModule.id]?.actions || []} 
                                 onToggle={(id) => updateAction(selectedModule.id, id)}
                              />
                           </div>

                           {DATA_SCOPES[selectedModule.id] ? (
                              <div className="animate-in slide-in-from-bottom-2 duration-300">
                                 <div className="text-xs font-black text-slate-400 uppercase mb-3 flex items-center gap-2 border-t border-slate-100 pt-6">
                                    <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold">3</span>لایه ۳: فیلتر داده
                                 </div>
                                 <div className="space-y-4">
                                    {DATA_SCOPES[selectedModule.id].map(scope => (
                                       <div key={scope.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                          <h4 className="text-xs font-bold text-slate-800 mb-3 flex items-center gap-2"><Filter size={14}/>{scope.label}:</h4>
                                          <div className="flex flex-wrap gap-2">
                                             {scope.options.map(opt => (
                                                <ToggleChip 
                                                   key={opt.value} 
                                                   label={opt.label} 
                                                   checked={tempPermissions[selectedModule.id]?.dataScopes?.[scope.id]?.includes(opt.value)} 
                                                   onClick={() => updateScope(selectedModule.id, scope.id, opt.value)}
                                                />
                                             ))}
                                          </div>
                                       </div>
                                    ))}
                                 </div>
                              </div>
                           ) : (
                              <div className="mt-6 p-6 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-center opacity-70">
                                 <Shield size={24} className="mx-auto mb-2 text-slate-300"/><span className="text-xs text-slate-400">بدون محدودیت لایه ۳</span>
                              </div>
                           )}
                        </div>
                     )}
                  </>
               ) : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-300 select-none">
                     <Eye size={48} className="opacity-50 mb-4"/><p className="text-sm font-bold text-slate-400">یک آیتم انتخاب کنید</p>
                  </div>
               )}
            </div>
         </div>
      </Modal>
    </div>
  );
};

window.Roles = Roles;
