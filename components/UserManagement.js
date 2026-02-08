/* Filename: components/UserManagement.js */
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Users, Search, Plus, Edit, Trash2, Key, Shield, 
  Check, X, RefreshCw, Briefcase, ChevronLeft, 
  Lock, FileText, Filter, CheckSquare, Zap, UserPlus, UserMinus
} from 'lucide-react';

const UserManagement = ({ t, isRtl }) => {
  const UI = window.UI || {};
  const { 
    Button, InputField, SelectField, Toggle, Badge, DataGrid, 
    FilterSection, Modal, SelectionGrid, ToggleChip 
  } = UI;
  const MENU_DATA = window.MENU_DATA || [];

  if (!Button) return <div className="p-4">Loading UI...</div>;

  // --- HELPER: FLATTEN MENU FOR SEARCH ---
  const getAllForms = () => {
    const forms = [];
    const traverse = (nodes, pathPrefix = '') => {
      nodes.forEach(node => {
        const currentPath = pathPrefix ? `${pathPrefix} / ${node.label[isRtl ? 'fa' : 'en']}` : node.label[isRtl ? 'fa' : 'en'];
        if (!node.children || node.children.length === 0) {
          forms.push({ ...node, fullPath: currentPath });
        } else {
          traverse(node.children, currentPath);
        }
      });
    };
    traverse(MENU_DATA);
    return forms;
  };
  const ALL_SYSTEM_FORMS = useMemo(() => getAllForms(), [MENU_DATA, isRtl]);

  // --- MOCK DATA ---
  const MOCK_PARTIES = [
    { id: 101, name: 'علی محمدی', type: 'person', code: 'P-1001' },
    { id: 102, name: 'شرکت فولاد مبارکه', type: 'company', code: 'C-5002' },
    { id: 103, name: 'سارا احمدی', type: 'person', code: 'P-1003' },
  ];

  const MOCK_ROLES_LIST = [
    { id: 1, title: 'مدیر ارشد مالی', code: 'CFO' },
    { id: 2, title: 'حسابدار فروش', code: 'ACC_SALES' },
    { id: 3, title: 'حسابرس داخلی', code: 'AUDITOR' },
    { id: 4, title: 'مدیر سیستم', code: 'ADMIN' },
  ];

  // MOCK PERMISSIONS FOR ROLES (To simulate auto-populate)
  const MOCK_ROLE_PERMISSIONS = {
    1: [ // CFO
       { formId: 'gl_docs', actions: ['view', 'approve'], dataScopes: {} },
       { formId: 'rpt_balance', actions: ['view', 'print'], dataScopes: {} }
    ],
    2: [ // SALES
       { formId: 'gl_docs', actions: ['create', 'view'], dataScopes: {} }, // Overlap with CFO on gl_docs
       { formId: 'inv_list', actions: ['create', 'view'], dataScopes: {} }
    ]
  };

  const [users, setUsers] = useState([
    { id: 1, username: 'admin', partyId: 101, userType: 'مدیر سیستم', isActive: true, lastLogin: '1402/11/15' },
    { id: 2, username: 's.ahmadi', partyId: 103, userType: 'کارشناس مالی', isActive: true, lastLogin: '1402/11/10' },
  ]);

  // --- STATES ---
  const [selectedRows, setSelectedRows] = useState([]);
  const [filterValues, setFilterValues] = useState({ username: '', userType: '', isActive: 'all' });
  const [appliedFilters, setAppliedFilters] = useState({ username: '', userType: '', isActive: 'all' });

  // Create/Edit States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userFormData, setUserFormData] = useState({ username: '', partyId: '', userType: '', isActive: true, password: '' });

  // Permissions Modal States
  const [isPermModalOpen, setIsPermModalOpen] = useState(false);
  const [viewingUser, setViewingUser] = useState(null);
  const [assignedRoles, setAssignedRoles] = useState([]); // IDs of roles assigned to user
  const [directPermissions, setDirectPermissions] = useState([]); // Array of { formId, actions, ... }
  const [selectedPermDetail, setSelectedPermDetail] = useState(null);
  
  // Search Form State (in Permission Modal)
  const [formSearchTerm, setFormSearchTerm] = useState('');
  const [showFormResults, setShowFormResults] = useState(false);

  // --- LOGIC: MERGE PERMISSIONS ---
  // This calculates the effective permissions grid based on Roles + Direct Access
  const effectivePermissions = useMemo(() => {
    const map = new Map();

    // 1. Process Roles
    assignedRoles.forEach(roleId => {
      const rolePerms = MOCK_ROLE_PERMISSIONS[roleId] || [];
      const roleInfo = MOCK_ROLES_LIST.find(r => r.id === roleId);
      
      rolePerms.forEach(p => {
        const formInfo = ALL_SYSTEM_FORMS.find(f => f.id === p.formId);
        if (!formInfo) return;

        if (!map.has(p.formId)) {
          map.set(p.formId, {
            id: p.formId,
            path: formInfo.fullPath,
            sources: [{ type: 'role', label: roleInfo.title }],
            roleActions: p.actions, // Keep separate to show read-only
            roleScopes: p.dataScopes,
            directActions: [],
            directScopes: {}
          });
        } else {
          // Overlap! Add source
          const item = map.get(p.formId);
          item.sources.push({ type: 'role', label: roleInfo.title });
          // In a real app, you might merge actions here for display.
        }
      });
    });

    // 2. Process Direct
    directPermissions.forEach(p => {
      const formInfo = ALL_SYSTEM_FORMS.find(f => f.id === p.formId);
      if (!formInfo) return;

      if (!map.has(p.formId)) {
        map.set(p.formId, {
          id: p.formId,
          path: formInfo.fullPath,
          sources: [{ type: 'direct', label: 'مستقیم' }],
          roleActions: [],
          roleScopes: {},
          directActions: p.actions || [],
          directScopes: p.dataScopes || {}
        });
      } else {
        // Direct access on top of Role
        const item = map.get(p.formId);
        item.sources.push({ type: 'direct', label: 'مستقیم' });
        item.directActions = p.actions || [];
        item.directScopes = p.dataScopes || {};
      }
    });

    return Array.from(map.values());
  }, [assignedRoles, directPermissions, ALL_SYSTEM_FORMS]);

  // --- HANDLERS: USER CRUD ---
  const handleCreate = () => {
    setEditingUser(null);
    setUserFormData({ username: '', partyId: '', userType: 'کارشناس', isActive: true, password: '' });
    setIsEditModalOpen(true);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setUserFormData({ 
      username: user.username, partyId: user.partyId, userType: user.userType, isActive: user.isActive, password: '' 
    });
    setIsEditModalOpen(true);
  };

  const handleSaveUser = () => {
    if (!userFormData.username || !userFormData.partyId) return alert('لطفا نام کاربری و طرف حساب را مشخص کنید.');
    if (!editingUser && !userFormData.password) return alert('لطفا رمز عبور را وارد کنید.');

    if (editingUser) {
      setUsers(prev => prev.map(u => u.id === editingUser.id ? { ...u, ...userFormData, id: u.id } : u));
    } else {
      setUsers(prev => [...prev, { id: Date.now(), ...userFormData, lastLogin: '-' }]);
    }
    setIsEditModalOpen(false);
  };

  const handleResetPassword = (user) => {
    if (confirm(`آیا مطمئن هستید که می‌خواهید رمز عبور "${user.username}" را بازنشانی کنید؟`)) {
      alert('رمز عبور به 123456 تغییر یافت.');
    }
  };

  // --- HANDLERS: PERMISSIONS ---
  const handleOpenPermissions = (user) => {
    setViewingUser(user);
    // Initialize mock state for this user
    setAssignedRoles([1, 2]); // Mock: User has CFO(1) and SALES(2) roles
    setDirectPermissions([]); 
    setSelectedPermDetail(null);
    setFormSearchTerm('');
    setIsPermModalOpen(true);
  };

  const handleAddRole = (e) => {
    const roleId = Number(e.target.value);
    if (roleId && !assignedRoles.includes(roleId)) {
      setAssignedRoles(prev => [...prev, roleId]);
    }
    e.target.value = ''; // Reset select
  };

  const handleRemoveRole = (roleId) => {
    setAssignedRoles(prev => prev.filter(id => id !== roleId));
  };

  const handleAddDirectForm = (form) => {
    // Check if already has DIRECT access (Role access doesn't prevent adding direct override)
    const exists = directPermissions.find(p => p.formId === form.id);
    if (exists) return alert('این فرم قبلاً به لیست دسترسی‌های مستقیم اضافه شده است.');

    setDirectPermissions(prev => [...prev, { formId: form.id, actions: [], dataScopes: {} }]);
    setFormSearchTerm('');
    setShowFormResults(false);
    
    // Auto select for editing
    setTimeout(() => {
        // Need to find the newly added item in effectivePermissions
        // But effectivePermissions is derived. We can manually construct a mock item to set selected
        // Or wait for effect. Simple way: user sees it added, then clicks it.
    }, 100);
  };

  const handleUpdateDirectPermission = (formId, type, key, value) => {
    // Type: 'action' or 'scope'
    setDirectPermissions(prev => prev.map(p => {
       if (p.formId !== formId) return p;
       
       if (type === 'action') {
          const has = p.actions?.includes(key);
          return { 
             ...p, 
             actions: has ? p.actions.filter(a => a !== key) : [...(p.actions || []), key] 
          };
       } else if (type === 'scope') { // scope
          const currentScopes = p.dataScopes?.[key] || [];
          const has = currentScopes.includes(value);
          const newValues = has ? currentScopes.filter(v => v !== value) : [...currentScopes, value];
          return {
             ...p,
             dataScopes: { ...p.dataScopes, [key]: newValues }
          };
       }
       return p;
    }));
  };

  // --- RENDER HELPERS ---
  const getPartyName = (id) => {
    const p = MOCK_PARTIES.find(p => p.id === Number(id));
    return p ? `${p.name} (${p.code})` : 'نامشخص';
  };

  // Filtered User List
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchName = !appliedFilters.username || user.username.toLowerCase().includes(appliedFilters.username.toLowerCase());
      return matchName;
    });
  }, [users, appliedFilters]);

  // Search Results for Forms
  const formSearchResults = useMemo(() => {
     if (!formSearchTerm) return [];
     return ALL_SYSTEM_FORMS.filter(f => f.fullPath.includes(formSearchTerm));
  }, [formSearchTerm, ALL_SYSTEM_FORMS]);

  // --- COLUMNS ---
  const columns = [
    { header: 'شناسه', field: 'id', width: 'w-16', sortable: true },
    { header: 'نام کاربری', field: 'username', width: 'w-32', sortable: true },
    { header: 'نام شخص / شرکت', field: 'partyId', width: 'w-48', render: (row) => <span className="font-bold text-slate-700">{getPartyName(row.partyId)}</span> },
    { header: 'نوع کاربری', field: 'userType', width: 'w-32', sortable: true },
    { header: 'آخرین ورود', field: 'lastLogin', width: 'w-32', render: (r) => <span className="dir-ltr font-mono text-xs text-slate-500">{r.lastLogin}</span> },
    { header: 'وضعیت', field: 'isActive', width: 'w-24 text-center', render: (r) => <Badge variant={r.isActive ? 'success' : 'neutral'}>{r.isActive ? 'فعال' : 'غیرفعال'}</Badge> },
  ];

  const permColumns = [
    { header: 'مسیر فرم', field: 'path', width: 'w-full', render: (r) => <div className="text-[11px] font-medium flex items-center gap-2"><FileText size={12} className="text-indigo-400"/>{r.path}</div> },
    { header: 'منبع دسترسی', field: 'source', width: 'w-64', render: (r) => (
       <div className="flex flex-wrap gap-1">
          {r.sources.map((s, idx) => (
             <Badge key={idx} variant={s.type === 'role' ? 'purple' : 'info'}>
                {s.type === 'role' ? `نقش: ${s.label}` : 'مستقیم'}
             </Badge>
          ))}
       </div>
    )},
  ];

  const AVAILABLE_ACTIONS = [
      { id: 'create', label: 'ایجاد' }, { id: 'edit', label: 'ویرایش' }, { id: 'view', label: 'مشاهده' }, { id: 'delete', label: 'حذف' }
  ];

  const DATA_SCOPES = { // Mock definitions
     'docType': { label: 'نوع سند', options: [{value:'عمومی', label:'عمومی'}, {value:'افتتاحیه', label:'افتتاحیه'}] },
     'status': { label: 'وضعیت', options: [{value:'موقت', label:'موقت'}, {value:'قطعی', label:'قطعی'}] }
  };

  return (
    <div className={`flex flex-col h-full bg-slate-50/50 p-4 overflow-hidden ${isRtl ? 'font-vazir' : 'font-sans'}`}>
      
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4 shrink-0">
         <div>
            <h1 className="text-xl font-black text-slate-800 flex items-center gap-2">
               <Users className="text-indigo-600" size={24}/> مدیریت کاربران
            </h1>
         </div>
      </div>

      {/* FILTER */}
      <FilterSection title="جستجوی پیشرفته" onSearch={() => setAppliedFilters(filterValues)} onClear={() => {setFilterValues({username: ''}); setAppliedFilters({username: ''})}} isRtl={isRtl}>
         <InputField label="نام کاربری" value={filterValues.username} onChange={(e) => setFilterValues({...filterValues, username: e.target.value})} placeholder="جستجو..." isRtl={isRtl} />
      </FilterSection>

      {/* GRID */}
      <div className="flex-1 min-h-0">
         <DataGrid 
            title="لیست کاربران" columns={columns} data={filteredUsers} isRtl={isRtl}
            selectedIds={selectedRows} onSelectAll={(c) => setSelectedRows(c ? filteredUsers.map(r => r.id) : [])}
            onSelectRow={(id, c) => setSelectedRows(p => c ? [...p, id] : p.filter(r => r !== id))}
            onCreate={handleCreate} onDelete={(ids) => setUsers(prev => prev.filter(u => !ids.includes(u.id)))}
            actions={(row) => (
               <>
                 <Button variant="ghost" size="iconSm" icon={Edit} onClick={() => handleEdit(row)} title="ویرایش" />
                 <Button variant="ghost" size="iconSm" icon={Shield} className="text-purple-600" onClick={() => handleOpenPermissions(row)} title="دسترسی‌ها" />
                 <Button variant="ghost" size="iconSm" icon={RefreshCw} className="text-amber-600" onClick={() => handleResetPassword(row)} title="ریست رمز" />
               </>
            )}
         />
      </div>

      {/* EDIT MODAL */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title={editingUser ? "ویرایش کاربر" : "تعریف کاربر جدید"} size="md"
         footer={<><Button variant="secondary" onClick={() => setIsEditModalOpen(false)}>انصراف</Button><Button variant="primary" icon={Check} onClick={handleSaveUser}>ذخیره</Button></>}>
         <div className="grid grid-cols-2 gap-4">
            <InputField label="نام کاربری" value={userFormData.username} onChange={(e) => setUserFormData({...userFormData, username: e.target.value})} isRtl={isRtl} className="dir-ltr" />
            <SelectField label="نوع کاربری" value={userFormData.userType} onChange={(e) => setUserFormData({...userFormData, userType: e.target.value})} isRtl={isRtl}>
               <option value="مدیر سیستم">مدیر سیستم</option><option value="کارشناس">کارشناس</option>
            </SelectField>
            
            <SelectField label="اتصال به شخص / طرف حساب" value={userFormData.partyId} onChange={(e) => setUserFormData({...userFormData, partyId: Number(e.target.value)})} isRtl={isRtl} className="col-span-2">
               <option value="">-- انتخاب کنید --</option>
               {MOCK_PARTIES.map(p => <option key={p.id} value={p.id}>{p.name} ({p.code})</option>)}
            </SelectField>

            {!editingUser && (
                <div className="col-span-2">
                   <InputField label="رمز عبور" type="password" value={userFormData.password} onChange={(e) => setUserFormData({...userFormData, password: e.target.value})} isRtl={isRtl} className="dir-ltr" placeholder="رمز عبور را وارد کنید..." />
                </div>
            )}
            
            <div className="col-span-2 flex items-center justify-between pt-2">
               <span className="text-xs font-bold text-slate-700">وضعیت حساب:</span>
               <Toggle checked={userFormData.isActive} onChange={(val) => setUserFormData({...userFormData, isActive: val})} label={userFormData.isActive ? "فعال" : "غیرفعال"} />
            </div>
         </div>
      </Modal>

      {/* PERMISSIONS MODAL */}
      <Modal isOpen={isPermModalOpen} onClose={() => setIsPermModalOpen(false)} title={`مدیریت دسترسی‌های: ${viewingUser?.username}`} size="xl"
         footer={<Button variant="primary" onClick={() => setIsPermModalOpen(false)}>تایید و بستن</Button>}>
         <div className="flex flex-col h-[600px]">
            
            {/* 1. TOP: ROLES MANAGEMENT */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 mb-3 flex items-center justify-between">
               <div className="flex items-center gap-2">
                  <Shield size={16} className="text-purple-600"/>
                  <span className="text-xs font-bold text-slate-700">نقش‌های تخصیص یافته:</span>
                  <div className="flex gap-1 mr-2">
                     {assignedRoles.map(rId => {
                        const role = MOCK_ROLES_LIST.find(r => r.id === rId);
                        return (
                           <div key={rId} className="flex items-center gap-1 bg-white border border-purple-200 text-purple-700 px-2 py-1 rounded-md text-[11px] font-bold shadow-sm">
                              {role?.title}
                              <button onClick={() => handleRemoveRole(rId)} className="hover:text-red-500 rounded-full p-0.5"><X size={10}/></button>
                           </div>
                        );
                     })}
                     {assignedRoles.length === 0 && <span className="text-[10px] text-slate-400 italic mt-1">بدون نقش</span>}
                  </div>
               </div>
               <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-500">افزودن نقش:</span>
                  <select className="h-7 text-[11px] border border-slate-300 rounded bg-white outline-none" onChange={handleAddRole}>
                     <option value="">انتخاب کنید...</option>
                     {MOCK_ROLES_LIST.filter(r => !assignedRoles.includes(r.id)).map(r => (
                        <option key={r.id} value={r.id}>{r.title}</option>
                     ))}
                  </select>
               </div>
            </div>

            {/* 2. MAIN SPLIT VIEW */}
            <div className="flex flex-1 border border-slate-200 rounded-lg overflow-hidden">
               {/* LEFT: GRID + SEARCH */}
               <div className={`${selectedPermDetail ? 'w-1/2' : 'w-full'} flex flex-col transition-all duration-300 bg-white`}>
                  {/* Search Toolbar for Direct Access */}
                  <div className="p-2 border-b border-slate-100 bg-white relative z-20">
                     <div className="relative">
                        <input 
                           value={formSearchTerm}
                           onChange={(e) => { setFormSearchTerm(e.target.value); setShowFormResults(true); }}
                           placeholder="افزودن دسترسی مستقیم (نام فرم را جستجو کنید)..."
                           className="w-full h-9 bg-slate-50 border border-slate-200 rounded text-xs pr-8 pl-2 outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 transition-all"
                        />
                        <Search size={14} className="absolute top-2.5 right-2.5 text-slate-400"/>
                        {/* Autocomplete Dropdown */}
                        {showFormResults && formSearchTerm && (
                           <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded shadow-xl max-h-48 overflow-y-auto">
                              {formSearchResults.length > 0 ? formSearchResults.map(f => (
                                 <div key={f.id} onClick={() => handleAddDirectForm(f)} className="p-2 hover:bg-indigo-50 cursor-pointer text-xs border-b border-slate-50 last:border-0">
                                    <div className="font-bold text-slate-700">{f.label[isRtl ? 'fa' : 'en']}</div>
                                    <div className="text-[10px] text-slate-400">{f.fullPath}</div>
                                 </div>
                              )) : (
                                 <div className="p-2 text-xs text-slate-400 text-center">موردی یافت نشد</div>
                              )}
                           </div>
                        )}
                        {showFormResults && formSearchTerm && <div className="fixed inset-0 z-[-1]" onClick={() => setShowFormResults(false)}></div>}
                     </div>
                  </div>

                  <div className="flex-1 overflow-hidden">
                     <DataGrid 
                        columns={permColumns} data={effectivePermissions} isRtl={isRtl}
                        onSelectRow={(id) => {
                           const item = effectivePermissions.find(p => p.id === id);
                           if(item) setSelectedPermDetail(item);
                        }}
                        actions={(row) => (
                           <div className="flex gap-1">
                              <Button variant="ghost" size="iconSm" icon={ChevronLeft} onClick={() => setSelectedPermDetail(row)} 
                                className={selectedPermDetail?.id === row.id ? 'bg-indigo-50 text-indigo-700' : ''} />
                           </div>
                        )}
                     />
                  </div>
               </div>

               {/* RIGHT: DETAILS SIDEBAR */}
               {selectedPermDetail && (
                  <div className="w-1/2 border-r border-slate-200 bg-slate-50 flex flex-col animate-in slide-in-from-right-5 duration-200 relative shadow-xl z-10">
                     <div className="absolute top-2 left-2">
                        <button onClick={() => setSelectedPermDetail(null)} className="p-1 hover:bg-slate-200 rounded text-slate-500"><X size={14}/></button>
                     </div>
                     
                     <div className="p-4 border-b border-slate-200 bg-white">
                        <h3 className="font-black text-slate-800 text-sm mb-1">{selectedPermDetail.path.split('/').pop().trim()}</h3>
                        <div className="flex flex-wrap gap-1 mt-2">
                           {selectedPermDetail.sources.map((s, idx) => (
                              <Badge key={idx} variant={s.type === 'role' ? 'purple' : 'info'}>{s.type === 'role' ? `نقش: ${s.label}` : 'مستقیم'}</Badge>
                           ))}
                        </div>
                     </div>

                     <div className="p-5 flex-1 overflow-y-auto space-y-6">
                        {/* Determine if editable: If has 'Direct' source, it is editable */}
                        {(() => {
                           const hasDirect = selectedPermDetail.sources.some(s => s.type === 'direct');
                           return (
                              <>
                                 {!hasDirect && (
                                    <div className="bg-amber-50 border border-amber-200 p-2 rounded text-[10px] text-amber-700 flex items-center gap-1 mb-2">
                                       <Lock size={10}/> این فرم فقط از طریق نقش در دسترس است و قابل ویرایش مستقیم نیست.
                                    </div>
                                 )}

                                 {/* ACTIONS */}
                                 <div>
                                    <div className="text-[11px] font-bold text-slate-500 uppercase mb-3">عملیات مجاز</div>
                                    <div className="grid grid-cols-2 gap-2">
                                       {AVAILABLE_ACTIONS.map(action => {
                                          const roleHas = selectedPermDetail.roleActions?.includes(action.id);
                                          const directHas = selectedPermDetail.directActions?.includes(action.id);
                                          const isChecked = roleHas || directHas;
                                          
                                          return (
                                             <div key={action.id} 
                                                onClick={() => hasDirect && handleUpdateDirectPermission(selectedPermDetail.id, 'action', action.id)}
                                                className={`
                                                   flex items-center gap-2 p-2 rounded border text-xs select-none transition-all
                                                   ${isChecked ? 'bg-indigo-50 border-indigo-300 text-indigo-700' : 'bg-white border-slate-200 text-slate-400'}
                                                   ${hasDirect ? 'cursor-pointer hover:border-indigo-300' : 'opacity-70 cursor-not-allowed'}
                                                `}
                                             >
                                                <div className={`w-4 h-4 rounded border flex items-center justify-center ${isChecked ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-slate-300'}`}>
                                                   {isChecked && <Check size={10} className="text-white"/>}
                                                </div>
                                                <span className="font-bold">{action.label}</span>
                                                {roleHas && <span className="mr-auto text-[9px] bg-purple-100 text-purple-700 px-1 rounded">نقش</span>}
                                             </div>
                                          );
                                       })}
                                    </div>
                                 </div>

                                 {/* SCOPES (Mock for View) */}
                                 <div className="pt-4 border-t border-slate-200">
                                    <div className="text-[11px] font-bold text-slate-500 uppercase mb-3">دسترسی داده</div>
                                    {Object.entries(DATA_SCOPES).map(([key, def]) => (
                                        <div key={key} className="mb-3">
                                            <span className="text-[11px] font-bold block mb-1">{def.label}:</span>
                                            <div className="flex gap-2">
                                                {def.options.map(opt => {
                                                    // Simplify logic for prototype: check simple inclusion
                                                    const roleHas = selectedPermDetail.roleScopes?.[key]?.includes(opt.value);
                                                    const directHas = selectedPermDetail.directScopes?.[key]?.includes(opt.value);
                                                    const isChecked = roleHas || directHas;
                                                    return (
                                                        <ToggleChip 
                                                            key={opt.value} label={opt.label} checked={isChecked}
                                                            onClick={() => hasDirect && handleUpdateDirectPermission(selectedPermDetail.id, 'scope', key, opt.value)}
                                                            colorClass={roleHas ? 'indigo' : 'green'} // Indigo for Role, Green for Direct override
                                                        />
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                 </div>
                              </>
                           );
                        })()}
                     </div>
                  </div>
               )}
            </div>
         </div>
      </Modal>

    </div>
  );
};

window.UserManagement = UserManagement;
