/* Filename: components/Roles.js */
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Shield, Edit, Save, Check, Lock, Layers, CheckSquare, Eye, Filter, AlertCircle,
  FolderOpen, Trash2, Zap, Users, Search, UserPlus, X, UserMinus
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

  // --- MOCK DATA: USERS (برای شبیه‌سازی دیتابیس کاربران) ---
  const [allUsers, setAllUsers] = useState([
    { id: 101, username: 'admin', fullName: 'رضا قربانی', isActive: true, roleIds: [1, 4] },
    { id: 102, username: 's.ahmadi', fullName: 'سارا احمدی', isActive: true, roleIds: [2] },
    { id: 103, username: 'm.rad', fullName: 'محمد راد', isActive: true, roleIds: [] },
    { id: 104, username: 'k.tehrani', fullName: 'کاوه تهرانی', isActive: false, roleIds: [1] },
    { id: 105, username: 'z.kamali', fullName: 'زهرا کمالی', isActive: true, roleIds: [2, 3] },
  ]);

  // --- MOCK DATA: ROLES ---
  const [roles, setRoles] = useState([
    { id: 1, title: 'مدیر ارشد مالی', code: 'CFO', isActive: true, startDate: '1402/01/01', endDate: '' },
    { id: 2, title: 'حسابدار فروش', code: 'ACC_SALES', isActive: true, startDate: '1402/05/10', endDate: '1403/05/10' },
    { id: 3, title: 'حسابرس داخلی', code: 'AUDITOR', isActive: false, startDate: '1402/10/01', endDate: '' },
    { id: 4, title: 'مدیر سیستم', code: 'ADMIN', isActive: true, startDate: '1400/01/01', endDate: '' },
  ]);

  // --- STATES ---
  const [permissions, setPermissions] = useState({});
  const [selectedRows, setSelectedRows] = useState([]);
  
  // Role Modal States
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [formData, setFormData] = useState({ title: '', code: '', isActive: true, startDate: '', endDate: '' });

  // Access Modal States
  const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState(null);
  const [tempPermissions, setTempPermissions] = useState({});

  // ** NEW: User Assignment Modal States **
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [showUserResults, setShowUserResults] = useState(false);

  // --- CONFIG ---
  const AVAILABLE_ACTIONS = [
    { id: 'create', label: 'ایجاد' }, { id: 'view', label: 'مشاهده' }, { id: 'edit', label: 'ویرایش' }, { id: 'delete', label: 'حذف' },
    { id: 'print', label: 'چاپ' }, { id: 'approve', label: 'تایید' }, { id: 'export', label: 'خروجی' }, { id: 'share', label: 'اشتراک' },
  ];

  const DATA_SCOPES = {
    'doc_list': [
      { id: 'docType', label: 'نوع سند', options: [{ value: 'opening', label: 'سند افتتاحیه' }, { value: 'general', label: 'سند عمومی' }] },
      { id: 'docStatus', label: 'وضعیت سند', options: [{ value: 'draft', label: 'پیش‌نویس' }, { value: 'final', label: 'نهایی' }] }
    ]
  };

  // --- HANDLERS: ROLE CRUD ---
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
    setIsAccessModalOpen(true);
  };

  const saveAccess = () => {
    setPermissions(prev => ({ ...prev, [editingRole.id]: tempPermissions }));
    setIsAccessModalOpen(false);
  };

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

  const getAllDescendantIds = (node) => {
     let ids = [node.id];
     if (node.children && node.children.length > 0) {
        node.children.forEach(child => { ids = [...ids, ...getAllDescendantIds(child)]; });
     }
     return ids;
  };

  const handleBulkPermission = (mode) => {
     if (!selectedModule) return;
     const targetIds = getAllDescendantIds(selectedModule);
     if (targetIds.length > 1 && !confirm(`این عملیات روی ${targetIds.length} آیتم اعمال می‌شود. ادامه می‌دهید؟`)) return;

     setTempPermissions(prev => {
        const next = { ...prev };
        targetIds.forEach(id => {
           if (mode === 'revoke') delete next[id];
           else {
              let allScopes = {};
              if (DATA_SCOPES[id]) DATA_SCOPES[id].forEach(scope => { allScopes[scope.id] = scope.options.map(o => o.value); });
              next[id] = { actions: AVAILABLE_ACTIONS.map(a => a.id), dataScopes: allScopes };
           }
        });
        return next;
     });
  };

  const renderPermissionNode = (item) => {
    const hasAccess = tempPermissions[item.id]?.actions?.length > 0;
    return (
      <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all shrink-0 ${hasAccess ? 'bg-green-500 border-green-500 text-white shadow-sm' : 'border-slate-300 bg-white'}`}>
        {hasAccess && <Check size={12} strokeWidth={3} />}
      </div>
    );
  };

  // --- HANDLERS: USER ASSIGNMENT (NEW) ---
  const openUserAssignment = (role) => {
    setEditingRole(role);
    setUserSearchTerm('');
    setShowUserResults(false);
    setIsUserModalOpen(true);
  };

  // Filter users who HAVE this role
  const assignedUsers = useMemo(() => {
    if (!editingRole) return [];
    return allUsers.filter(u => u.roleIds.includes(editingRole.id));
  }, [allUsers, editingRole]);

  // Search users who DO NOT have this role
  const searchResults = useMemo(() => {
    if (!editingRole || !userSearchTerm) return [];
    const term = userSearchTerm.toLowerCase();
    return allUsers.filter(u => 
      !u.roleIds.includes(editingRole.id) && // Not already assigned
      (u.username.toLowerCase().includes(term) || u.fullName.toLowerCase().includes(term))
    );
  }, [userSearchTerm, allUsers, editingRole]);

  const handleAssignUser = (userId) => {
    setAllUsers(prev => prev.map(u => 
      u.id === userId ? { ...u, roleIds: [...u.roleIds, editingRole.id] } : u
    ));
    setUserSearchTerm('');
    setShowUserResults(false);
  };

  const handleUnassignUser = (userId) => {
    if (confirm('آیا از سلب مسئولیت این نقش از کاربر اطمینان دارید؟')) {
      setAllUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, roleIds: u.roleIds.filter(id => id !== editingRole.id) } : u
      ));
    }
  };

  // --- COLUMNS ---
  const roleColumns = [
    { header: 'شناسه', field: 'id', width: 'w-16', sortable: true },
    { header: 'عنوان نقش', field: 'title', width: 'w-48', sortable: true },
    { header: 'کد سیستمی', field: 'code', width: 'w-32', sortable: true },
    { header: 'تاریخ شروع', field: 'startDate', width: 'w-32', render: (r) => <span className="dir-ltr font-mono text-xs">{r.startDate || '-'}</span> },
    { header: 'وضعیت', field: 'isActive', width: 'w-24 text-center', render: (r) => <Badge variant={r.isActive ? 'success' : 'neutral'}>{r.isActive ? 'فعال' : 'غیرفعال'}</Badge> },
  ];

  const assignedUsersColumns = [
    { header: 'شناسه', field: 'id', width: 'w-16' },
    { header: 'نام کاربری', field: 'username', width: 'w-32' },
    { header: 'نام و نام خانوادگی', field: 'fullName', width: 'w-48', render: (r) => <span className="font-bold text-slate-700">{r.fullName}</span> },
    { header: 'وضعیت کاربر', field: 'isActive', width: 'w-24', render: (r) => <div className="flex justify-center"><Toggle checked={r.isActive} disabled /></div> },
  ];

  return (
    <div className={`flex flex-col h-full bg-slate-50/50 p-4 overflow-hidden ${isRtl ? 'font-vazir' : 'font-sans'}`}>
      
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4 shrink-0">
         <div>
            <h1 className="text-xl font-black text-slate-800 flex items-center gap-2">
               <Shield className="text-indigo-600" size={24}/> مدیریت نقش‌ها
            </h1>
         </div>
      </div>

      {/* GRID */}
      <FilterSection title="جستجو" onSearch={() => {}} onClear={() => {}} isRtl={isRtl}>
         <InputField label="عنوان نقش" placeholder="جستجو..." isRtl={isRtl} />
      </FilterSection>

      <div className="flex-1 min-h-0">
         <DataGrid 
            columns={roleColumns} data={roles} isRtl={isRtl}
            selectedIds={selectedRows} onSelectAll={(c) => setSelectedRows(c ? roles.map(r => r.id) : [])}
            onSelectRow={(id, c) => setSelectedRows(p => c ? [...p, id] : p.filter(r => r !== id))}
            onCreate={handleCreate} onDelete={handleDelete} onDoubleClick={handleEdit}
            actions={(row) => (
               <>
                 <Button variant="ghost" size="iconSm" icon={Edit} onClick={() => handleEdit(row)} title="ویرایش" />
                 <Button variant="ghost" size="iconSm" icon={Users} className="text-indigo-600" onClick={() => openUserAssignment(row)} title="کاربران نقش" />
                 <Button variant="ghost" size="iconSm" icon={Lock} className="text-amber-600" onClick={() => openAccessModal(row)} title="دسترسی‌ها" />
               </>
            )}
         />
      </div>

      {/* ROLE MODAL */}
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
               <span className="text-[13px] font-bold text-slate-700">وضعیت نقش</span>
               <Toggle checked={formData.isActive} onChange={(val) => setFormData({...formData, isActive: val})} label={formData.isActive ? "فعال" : "غیرفعال"} />
            </div>
         </div>
      </Modal>

      {/* USER ASSIGNMENT MODAL (NEW) */}
      <Modal isOpen={isUserModalOpen} onClose={() => setIsUserModalOpen(false)} title={`کاربران دارای نقش: ${editingRole?.title}`} size="lg"
         footer={<Button variant="primary" onClick={() => setIsUserModalOpen(false)}>بستن</Button>}>
         <div className="flex flex-col h-[500px]">
            
            {/* ADD USER SEARCH BAR */}
            <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-3 mb-3 relative z-[60]">
               <label className="text-xs font-bold text-indigo-800 mb-2 block flex items-center gap-2">
                  <UserPlus size={14}/> افزودن کاربر جدید به این نقش
               </label>
               <div className="relative">
                  <input 
                     value={userSearchTerm}
                     onChange={(e) => { setUserSearchTerm(e.target.value); setShowUserResults(true); }}
                     placeholder="جستجوی نام کاربری یا نام شخص..."
                     className="w-full h-9 bg-white border border-indigo-200 rounded text-xs pr-9 pl-2 outline-none focus:ring-2 focus:ring-indigo-300 transition-all"
                  />
                  <Search size={16} className="absolute top-2.5 right-2.5 text-indigo-400"/>
                  
                  {showUserResults && userSearchTerm && (
                     <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-xl max-h-48 overflow-y-auto z-[100]">
                        {searchResults.length > 0 ? searchResults.map(user => (
                           <div key={user.id} onClick={() => handleAssignUser(user.id)} className="p-2 hover:bg-indigo-50 cursor-pointer flex items-center justify-between border-b border-slate-50 last:border-0 group transition-colors">
                              <div className="flex flex-col">
                                 <span className="text-xs font-bold text-slate-700">{user.fullName}</span>
                                 <span className="text-[10px] text-slate-400 font-mono">@{user.username}</span>
                              </div>
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity text-indigo-600 bg-indigo-100 p-1 rounded">
                                 <Plus size={14}/>
                              </div>
                           </div>
                        )) : (
                           <div className="p-3 text-center text-xs text-slate-400">کاربری یافت نشد یا قبلاً اضافه شده است.</div>
                        )}
                     </div>
                  )}
                  {showUserResults && userSearchTerm && <div className="fixed inset-0 z-[-1]" onClick={() => setShowUserResults(false)}></div>}
               </div>
            </div>

            {/* ASSIGNED USERS GRID */}
            <div className="flex-1 overflow-hidden border border-slate-200 rounded-lg bg-white relative z-0">
               <DataGrid 
                  columns={assignedUsersColumns}
                  data={assignedUsers}
                  isRtl={isRtl}
                  actions={(row) => (
                     <Button variant="ghost" size="iconSm" icon={UserMinus} className="text-red-500 hover:bg-red-50" onClick={() => handleUnassignUser(row.id)} title="حذف نقش از کاربر" />
                  )}
               />
            </div>
         </div>
      </Modal>

      {/* ACCESS MODAL */}
      <Modal isOpen={isAccessModalOpen} onClose={() => setIsAccessModalOpen(false)} title={`دسترسی‌های: ${editingRole?.title}`} size="xl"
         footer={<><Button variant="secondary" onClick={() => setIsAccessModalOpen(false)}>انصراف</Button><Button variant="primary" icon={Save} onClick={saveAccess}>اعمال</Button></>}>
         <div className="flex h-[550px] border border-slate-200 rounded-lg overflow-hidden">
            <div className="w-1/3 border-l border-slate-200 bg-slate-50 flex flex-col p-2">
               <TreeView data={MENU_DATA} selectedNodeId={selectedModule?.id} onSelectNode={setSelectedModule} renderNodeContent={renderPermissionNode} isRtl={isRtl} />
            </div>
            <div className="w-2/3 bg-white flex flex-col">
               {selectedModule ? (
                  <>
                     <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                        <h3 className="font-bold text-sm">{selectedModule.label[isRtl ? 'fa' : 'en']}</h3>
                        <div className="flex gap-1">
                           <Button variant="outline" size="sm" icon={Trash2} onClick={() => handleBulkPermission('revoke')}>حذف همه</Button>
                           <Button variant="success" size="sm" icon={Zap} onClick={() => handleBulkPermission('grant')}>دسترسی کامل</Button>
                        </div>
                     </div>
                     <div className="flex-1 overflow-y-auto p-5 space-y-6">
                        <div>
                           <div className="text-[11px] font-bold text-slate-500 uppercase mb-2">عملیات</div>
                           <SelectionGrid items={AVAILABLE_ACTIONS} selectedIds={tempPermissions[selectedModule.id]?.actions || []} onToggle={(id) => updateAction(selectedModule.id, id)} />
                        </div>
                        {DATA_SCOPES[selectedModule.id] && (
                           <div className="pt-4 border-t border-slate-100">
                              <div className="text-[11px] font-bold text-slate-500 uppercase mb-2">داده‌ها</div>
                              {DATA_SCOPES[selectedModule.id].map(scope => (
                                 <div key={scope.id} className="mb-3">
                                    <span className="text-xs font-bold block mb-1">{scope.label}:</span>
                                    <div className="flex flex-wrap gap-2">{scope.options.map(o => <ToggleChip key={o.value} label={o.label} checked={tempPermissions[selectedModule.id]?.dataScopes?.[scope.id]?.includes(o.value)} onClick={() => updateScope(selectedModule.id, scope.id, o.value)} />)}</div>
                                 </div>
                              ))}
                           </div>
                        )}
                     </div>
                  </>
               ) : <div className="flex items-center justify-center h-full text-slate-400 text-sm">یک آیتم انتخاب کنید</div>}
            </div>
         </div>
      </Modal>
    </div>
  );
};

window.Roles = Roles;
