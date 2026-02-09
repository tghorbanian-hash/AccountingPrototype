/* Filename: components/UserManagement.js */
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Users, Search, Plus, Edit, Trash2, Key, Shield, 
  Check, X, RefreshCw, Briefcase, ChevronLeft, 
  Lock, FileText, Filter, CheckSquare, Zap, UserPlus, UserMinus, ChevronDown
} from 'lucide-react';

const UserManagement = ({ t, isRtl }) => {
  const UI = window.UI || {};
  const { 
    Button, InputField, SelectField, Toggle, Badge, DataGrid, 
    FilterSection, Modal, SelectionGrid, ToggleChip 
  } = UI;
  const MENU_DATA = window.MENU_DATA || [];

  if (!Button) return <div className="p-4">Loading UI...</div>;

  // --- INTERNAL COMPONENT: MULTI-SELECT WITH SEARCH ---
  const MultiSelect = ({ options, value = [], onChange, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const containerRef = useRef(null);

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (containerRef.current && !containerRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredOptions = options.filter(opt => 
      opt.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleOption = (id) => {
      const newValue = value.includes(id) 
        ? value.filter(v => v !== id) 
        : [...value, id];
      onChange(newValue);
    };

    const removeTag = (e, id) => {
      e.stopPropagation();
      onChange(value.filter(v => v !== id));
    };

    return (
      <div className="relative" ref={containerRef}>
        <div 
          className="min-h-[32px] bg-white border border-slate-200 rounded-md flex flex-wrap items-center gap-1 p-1 cursor-pointer focus-within:border-indigo-400 focus-within:ring-1 focus-within:ring-indigo-100 transition-all"
          onClick={() => setIsOpen(!isOpen)}
        >
          {value.length === 0 && <span className="text-slate-400 text-[11px] px-1 select-none">{placeholder}</span>}
          {value.map(id => {
            const opt = options.find(o => o.id === id);
            return (
              <span key={id} className="bg-indigo-50 text-indigo-700 border border-indigo-100 rounded px-1.5 py-0.5 text-[10px] flex items-center gap-1 font-bold">
                {opt?.label}
                <span onClick={(e) => removeTag(e, id)} className="hover:text-red-500 rounded-full"><X size={10}/></span>
              </span>
            );
          })}
          <div className="ml-auto px-1 text-slate-400">
            <ChevronDown size={14}/>
          </div>
        </div>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-md shadow-lg z-[60] max-h-48 overflow-y-auto animate-in fade-in zoom-in-95 duration-100">
            <div className="p-2 border-b border-slate-50 sticky top-0 bg-white">
              <input 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder={t.search}
                className="w-full text-[11px] border border-slate-200 rounded px-2 py-1 outline-none focus:border-indigo-400"
                autoFocus
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            {filteredOptions.length > 0 ? filteredOptions.map(opt => (
              <div 
                key={opt.id} 
                className={`px-3 py-2 text-[11px] cursor-pointer hover:bg-slate-50 flex items-center justify-between ${value.includes(opt.id) ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-700'}`}
                onClick={() => toggleOption(opt.id)}
              >
                {opt.label}
                {value.includes(opt.id) && <Check size={12}/>}
              </div>
            )) : (
              <div className="p-2 text-center text-slate-400 text-[10px]">{t.noResults || "موردی یافت نشد"}</div>
            )}
          </div>
        )}
      </div>
    );
  };

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
  const MOCK_PARTIES = window.APP_DATA?.mockParties || [
    { id: 101, name: 'علی محمدی', type: 'person', code: 'P-1001' },
    { id: 102, name: 'شرکت فولاد مبارکه', type: 'company', code: 'C-5002' },
    { id: 103, name: 'سارا احمدی', type: 'person', code: 'P-1003' },
  ];

  const MOCK_ROLES_LIST = window.APP_DATA?.mockRoles?.map(r => ({ id: r.id, title: r.name, code: r.code })) || [
    { id: 1, title: 'مدیر ارشد مالی', code: 'CFO' },
    { id: 2, title: 'حسابدار فروش', code: 'ACC_SALES' },
    { id: 3, title: 'حسابرس داخلی', code: 'AUDITOR' },
    { id: 4, title: 'مدیر سیستم', code: 'ADMIN' },
  ];

  const MOCK_ROLE_PERMISSIONS = {
    1: [ 
       { formId: 'doc_list', actions: ['view', 'approve'], dataScopes: {} },
       { formId: 'doc_review', actions: ['view'], dataScopes: {} }, 
       { formId: 'payment_req', actions: ['approve'], dataScopes: {} } 
    ],
    2: [ 
       { formId: 'payment_req', actions: ['create', 'view'], dataScopes: {} },
       { formId: 'doc_list', actions: ['view'], dataScopes: {} }
    ],
    4: [ 
       { formId: 'users_list', actions: ['create', 'edit', 'delete', 'view'], dataScopes: {} },
       { formId: 'roles', actions: ['create', 'edit', 'delete', 'view'], dataScopes: {} },
       { formId: 'access_mgmt', actions: ['view'], dataScopes: {} }
    ]
  };

  const [users, setUsers] = useState(window.APP_DATA?.mockUsers?.map(u => ({
      id: u.id, username: u.username, partyId: 101, userType: u.userType === 'SystemAdmin' ? 'مدیر سیستم' : 'کارشناس', roleIds: u.userType === 'SystemAdmin' ? [4] : [1], isActive: u.status, lastLogin: '1402/11/15'
  })) || [
    { id: 1, username: 'admin', partyId: 101, userType: 'مدیر سیستم', roleIds: [4], isActive: true, lastLogin: '1402/11/15' },
    { id: 2, username: 's.ahmadi', partyId: 103, userType: 'کارشناس مالی', roleIds: [1], isActive: true, lastLogin: '1402/11/10' },
  ]);

  // --- STATES ---
  const [selectedRows, setSelectedRows] = useState([]);
  const [filterValues, setFilterValues] = useState({ username: '', roleIds: [], isActive: 'all' });
  const [appliedFilters, setAppliedFilters] = useState({ username: '', roleIds: [], isActive: 'all' });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userFormData, setUserFormData] = useState({ username: '', partyId: '', userType: '', isActive: true, password: '' });

  const [isPermModalOpen, setIsPermModalOpen] = useState(false);
  const [viewingUser, setViewingUser] = useState(null);
  const [assignedRoles, setAssignedRoles] = useState([]); 
  const [directPermissions, setDirectPermissions] = useState([]); 
  const [selectedPermDetail, setSelectedPermDetail] = useState(null);
  
  const [formSearchTerm, setFormSearchTerm] = useState('');
  const [showFormResults, setShowFormResults] = useState(false);
  
  const [roleSearchTerm, setRoleSearchTerm] = useState('');
  const [isRoleSearchOpen, setIsRoleSearchOpen] = useState(false);

  const getPartyName = (id) => {
    const p = MOCK_PARTIES.find(p => p.id === Number(id));
    return p ? (p.fullName || p.name) + ` (${p.partyCode || p.code})` : t.selectPersonPlaceholder;
  };

  // --- LOGIC: MERGE PERMISSIONS ---
  const effectivePermissions = useMemo(() => {
    const map = new Map();

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
            sources: [{ type: 'role', label: roleInfo?.title || roleInfo?.name }],
            roleActions: p.actions, 
            roleScopes: p.dataScopes,
            directActions: [],
            directScopes: {}
          });
        } else {
          const item = map.get(p.formId);
          item.sources.push({ type: 'role', label: roleInfo?.title || roleInfo?.name });
        }
      });
    });

    directPermissions.forEach(p => {
      const formInfo = ALL_SYSTEM_FORMS.find(f => f.id === p.formId);
      if (!formInfo) return;

      if (!map.has(p.formId)) {
        map.set(p.formId, {
          id: p.formId,
          path: formInfo.fullPath,
          sources: [{ type: 'direct', label: t.permTypeUser }],
          roleActions: [],
          roleScopes: {},
          directActions: p.actions || [],
          directScopes: p.dataScopes || {}
        });
      } else {
        const item = map.get(p.formId);
        item.sources.push({ type: 'direct', label: t.permTypeUser });
        item.directActions = p.actions || [];
        item.directScopes = p.dataScopes || {};
      }
    });

    return Array.from(map.values());
  }, [assignedRoles, directPermissions, ALL_SYSTEM_FORMS, t, isRtl]);

  useEffect(() => {
    if (selectedPermDetail) {
      const updated = effectivePermissions.find(p => p.id === selectedPermDetail.id);
      if (updated) setSelectedPermDetail(updated);
    }
  }, [effectivePermissions]);

  // --- HANDLERS ---
  const handleCreate = () => {
    setEditingUser(null);
    setUserFormData({ username: '', partyId: '', userType: t.roleUser, isActive: true, password: '' });
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
    if (!userFormData.username || !userFormData.partyId) return alert(t.invalidOtp);
    if (!editingUser && !userFormData.password) return alert(t.fieldPassword);

    if (editingUser) {
      setUsers(prev => prev.map(u => u.id === editingUser.id ? { ...u, ...userFormData } : u));
    } else {
      setUsers(prev => [...prev, { id: Date.now(), ...userFormData, lastLogin: '-', roleIds: [] }]);
    }
    setIsEditModalOpen(false);
  };

  const handleResetPassword = (user) => {
    if (confirm(t.confirmDelete)) {
      alert(t.passwordResetMsg);
    }
  };

  const handleOpenPermissions = (user) => {
    setViewingUser(user);
    setAssignedRoles(user.roleIds || []);
    setDirectPermissions([]); 
    setSelectedPermDetail(null);
    setFormSearchTerm('');
    setRoleSearchTerm('');
    setIsPermModalOpen(true);
  };

  const handleAddRole = (roleId) => {
    if (roleId && !assignedRoles.includes(roleId)) {
      setAssignedRoles(prev => [...prev, roleId]);
    }
    setIsRoleSearchOpen(false);
    setRoleSearchTerm('');
  };

  const handleRemoveRole = (roleId) => {
    setAssignedRoles(prev => prev.filter(id => id !== roleId));
  };

  const handleAddDirectForm = (form) => {
    if (directPermissions.find(p => p.formId === form.id)) return;
    setDirectPermissions(prev => [...prev, { formId: form.id, actions: [], dataScopes: {} }]);
    setFormSearchTerm('');
    setShowFormResults(false);
  };

  const handleUpdateDirectPermission = (formId, type, key, value) => {
    setDirectPermissions(prev => {
        const existingDirect = prev.find(p => p.formId === formId);
        let targetEntry = existingDirect ? { ...existingDirect } : { formId, actions: [], dataScopes: {} };

        if (type === 'action') {
            const has = targetEntry.actions.includes(key);
            targetEntry.actions = has ? targetEntry.actions.filter(a => a !== key) : [...targetEntry.actions, key];
        } else if (type === 'scope') {
            const currentScopes = targetEntry.dataScopes[key] || [];
            const has = currentScopes.includes(value);
            targetEntry.dataScopes = { ...targetEntry.dataScopes, [key]: has ? currentScopes.filter(v => v !== value) : [...currentScopes, value] };
        }
        return existingDirect ? prev.map(p => p.formId === formId ? targetEntry : p) : [...prev, targetEntry];
    });
  };

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchName = !appliedFilters.username || user.username.toLowerCase().includes(appliedFilters.username.toLowerCase());
      const matchRole = appliedFilters.roleIds.length === 0 || appliedFilters.roleIds.some(rId => user.roleIds?.includes(rId));
      return matchName && matchRole;
    });
  }, [users, appliedFilters]);

  const formSearchResults = useMemo(() => {
     if (!formSearchTerm) return [];
     return ALL_SYSTEM_FORMS.filter(f => f.fullPath.toLowerCase().includes(formSearchTerm.toLowerCase()));
  }, [formSearchTerm, ALL_SYSTEM_FORMS]);

  const roleSearchResults = useMemo(() => {
     return MOCK_ROLES_LIST.filter(r => 
        !assignedRoles.includes(r.id) && 
        (r.title || r.name).toLowerCase().includes(roleSearchTerm.toLowerCase())
     );
  }, [roleSearchTerm, assignedRoles]);

  // --- COLUMNS ---
  const columns = [
    { header: t.colId, field: 'id', width: 'w-16', sortable: true },
    { header: t.colUsername, field: 'username', width: 'w-32', sortable: true },
    { header: t.colLinkedPerson, field: 'partyId', width: 'w-48', render: (row) => <span className="font-bold text-slate-700">{getPartyName(row.partyId)}</span> },
    { header: t.colUserType, field: 'userType', width: 'w-32', sortable: true },
    { header: t.permissions, field: 'roleIds', width: 'w-48', render: (r) => (
        <div className="flex flex-wrap gap-1">
            {r.roleIds?.map(rid => {
                const role = MOCK_ROLES_LIST.find(x => x.id === rid);
                return role ? <Badge key={rid} variant="neutral" className="px-1 py-0 text-[9px]">{role.title || role.name}</Badge> : null;
            })}
        </div>
    )},
    { header: t.colStatus, field: 'isActive', width: 'w-24 text-center', render: (r) => <Badge variant={r.isActive ? 'success' : 'neutral'}>{r.isActive ? t.active : t.inactive}</Badge> },
  ];

  const permColumns = [
    { header: t.permColForms, field: 'path', width: 'w-full', render: (r) => <div className="text-[11px] font-medium flex items-center gap-2"><FileText size={12} className="text-indigo-400"/>{r.path}</div> },
    { header: t.permColSource, field: 'source', width: 'w-48', render: (r) => (
       <div className="flex flex-wrap gap-1">
          {r.sources.map((s, idx) => (
             <Badge key={idx} variant={s.type === 'role' ? 'purple' : 'info'}>{s.label}</Badge>
          ))}
       </div>
    )},
  ];

  const AVAILABLE_ACTIONS = [
      { id: 'create', label: t.create }, { id: 'edit', label: t.edit }, { id: 'view', label: t.view }, { id: 'delete', label: t.delete },
      { id: 'print', label: t.print }, { id: 'approve', label: t.approve || "تایید" }, { id: 'export', label: t.export }, { id: 'share', label: t.share || "اشتراک" },
  ];

  const DATA_SCOPES = { 
     'docType': { label: t.field_docType, options: [{value:'عمومی', label:t.field_general}, {value:'افتتاحیه', label:t.field_opening}] },
     'status': { label: t.col_status, options: [{value:'موقت', label:t.status_draft}, {value:'قطعی', label:t.status_final}] }
  };

  return (
    <div className={`flex flex-col h-full bg-slate-50/50 p-4 overflow-hidden ${isRtl ? 'font-vazir' : 'font-sans'}`}>
      <div className="flex items-center justify-between mb-4 shrink-0">
         <h1 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <Users className="text-indigo-600" size={24}/> {t.usersListTitle}
         </h1>
      </div>

      <FilterSection title={t.filters} onSearch={() => setAppliedFilters(filterValues)} onClear={() => {setFilterValues({username: '', roleIds: []}); setAppliedFilters({username: '', roleIds: []})}} isRtl={isRtl}>
         <InputField label={t.colUsername} value={filterValues.username} onChange={(e) => setFilterValues({...filterValues, username: e.target.value})} placeholder={t.search} isRtl={isRtl} />
         <div>
           <label className="block text-[11px] font-bold text-slate-600 mb-1">{t.permissions}</label>
           <MultiSelect 
             options={MOCK_ROLES_LIST.map(r => ({id: r.id, label: r.title || r.name}))}
             value={filterValues.roleIds}
             onChange={(vals) => setFilterValues({...filterValues, roleIds: vals})}
             placeholder={t.selectPersonPlaceholder}
           />
         </div>
      </FilterSection>

      <div className="flex-1 min-h-0">
         <DataGrid 
            title={t.grid_title} columns={columns} data={filteredUsers} isRtl={isRtl}
            selectedIds={selectedRows} onSelectAll={(c) => setSelectedRows(c ? filteredUsers.map(r => r.id) : [])}
            onSelectRow={(id, c) => setSelectedRows(p => c ? [...p, id] : p.filter(r => r !== id))}
            onCreate={handleCreate} onDelete={(ids) => setUsers(prev => prev.filter(u => !ids.includes(u.id)))}
            actions={(row) => (
               <>
                 <Button variant="ghost" size="iconSm" icon={Edit} onClick={() => handleEdit(row)} title={t.edit} />
                 <Button variant="ghost" size="iconSm" icon={Shield} className="text-purple-600" onClick={() => handleOpenPermissions(row)} title={t.viewPermissions} />
                 <Button variant="ghost" size="iconSm" icon={RefreshCw} className="text-amber-600" onClick={() => handleResetPassword(row)} title={t.resetDefault} />
               </>
            )}
         />
      </div>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title={editingUser ? t.editUserTitle : t.newUserTitle} size="md"
         footer={<><Button variant="secondary" onClick={() => setIsEditModalOpen(false)}>{t.btn_cancel}</Button><Button variant="primary" icon={Check} onClick={handleSaveUser}>{t.btn_save}</Button></>}>
         <div className="grid grid-cols-2 gap-4">
            <InputField label={t.colUsername} value={userFormData.username} onChange={(e) => setUserFormData({...userFormData, username: e.target.value})} isRtl={isRtl} className="dir-ltr" />
            <SelectField label={t.colUserType} value={userFormData.userType} onChange={(e) => setUserFormData({...userFormData, userType: e.target.value})} isRtl={isRtl}>
               <option value="مدیر سیستم">{t.roleAdmin}</option><option value="کارشناس">{t.roleUser}</option>
            </SelectField>
            <div className="col-span-2 grid grid-cols-2 gap-4">
                <InputField label={t.fieldPassword} type="password" value={userFormData.password} onChange={(e) => setUserFormData({...userFormData, password: e.target.value})} isRtl={isRtl} disabled={!!editingUser} placeholder="********" />
                <SelectField label={t.fieldLinkedPerson} value={userFormData.partyId} onChange={(e) => setUserFormData({...userFormData, partyId: Number(e.target.value)})} isRtl={isRtl}>
                    <option value="">{t.selectPersonPlaceholder}</option>
                    {MOCK_PARTIES.map(p => <option key={p.id} value={p.id}>{p.fullName || p.name} ({p.partyCode || p.code})</option>)}
                </SelectField>
            </div>
            <div className="col-span-2 flex items-center justify-between pt-2">
               <span className="text-xs font-bold text-slate-700">{t.colStatus}:</span>
               <Toggle checked={userFormData.isActive} onChange={(val) => setUserFormData({...userFormData, isActive: val})} label={userFormData.isActive ? t.active : t.inactive} />
            </div>
         </div>
      </Modal>

      <Modal isOpen={isPermModalOpen} onClose={() => setIsPermModalOpen(false)} title={`${t.permModalTitle}: ${viewingUser?.username}`} size="xl"
         footer={<Button variant="primary" onClick={() => setIsPermModalOpen(false)}>{t.btn_save}</Button>}>
         <div className="flex flex-col h-[600px]">
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 mb-3 flex items-center justify-between">
               <div className="flex items-center gap-2 overflow-x-auto">
                  <Shield size={16} className="text-purple-600 shrink-0"/>
                  <span className="text-xs font-bold text-slate-700 shrink-0">{t.permissions}:</span>
                  <div className="flex gap-1 mr-2">
                     {assignedRoles.map(rId => {
                        const role = MOCK_ROLES_LIST.find(r => r.id === rId);
                        return (
                           <div key={rId} className="flex items-center gap-1 bg-white border border-purple-200 text-purple-700 px-2 py-1 rounded-md text-[11px] font-bold shadow-sm whitespace-nowrap">
                              {role?.title || role?.name}
                              <button onClick={() => handleRemoveRole(rId)} className="hover:text-red-500 p-0.5"><X size={10}/></button>
                           </div>
                        );
                     })}
                  </div>
               </div>
               <div className="relative w-64">
                   <div className="flex items-center border border-slate-300 rounded bg-white px-2 h-8 cursor-text" onClick={() => setIsRoleSearchOpen(!isRoleSearchOpen)}>
                       <input className="w-full text-[11px] outline-none" placeholder={t.search} value={roleSearchTerm} onChange={(e) => { setRoleSearchTerm(e.target.value); setIsRoleSearchOpen(true); }} />
                       <ChevronDown size={14} className="text-slate-400"/>
                   </div>
                   {isRoleSearchOpen && (
                       <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded shadow-lg z-[60] max-h-40 overflow-y-auto">
                           {roleSearchResults.map(r => (
                               <div key={r.id} onClick={() => handleAddRole(r.id)} className="px-3 py-2 hover:bg-purple-50 cursor-pointer text-[11px] text-slate-700 border-b border-slate-50">{r.title || r.name}</div>
                           ))}
                       </div>
                   )}
               </div>
            </div>

            <div className="flex flex-1 border border-slate-200 rounded-lg overflow-hidden">
               <div className={`${selectedPermDetail ? 'w-1/2' : 'w-full'} flex flex-col bg-white relative`}>
                  <div className="p-2 border-b border-slate-100 bg-white relative z-[50]">
                     <div className="relative">
                        <input value={formSearchTerm} onChange={(e) => { setFormSearchTerm(e.target.value); setShowFormResults(true); }} placeholder={t.permSelectForm} className="w-full h-9 bg-slate-50 border border-slate-200 rounded text-xs pr-8 pl-2 outline-none focus:border-indigo-400 transition-all" />
                        <Search size={14} className="absolute top-2.5 right-2.5 text-slate-400"/>
                        {showFormResults && formSearchTerm && (
                           <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded shadow-xl max-h-48 overflow-y-auto z-[100]">
                              {formSearchResults.map(f => (
                                 <div key={f.id} onClick={() => handleAddDirectForm(f)} className="p-2 hover:bg-indigo-50 cursor-pointer text-xs border-b border-slate-50">
                                    <div className="font-bold text-slate-700">{f.label[isRtl ? 'fa' : 'en']}</div>
                                    <div className="text-[10px] text-slate-400">{f.fullPath}</div>
                                 </div>
                              ))}
                           </div>
                        )}
                     </div>
                  </div>
                  <DataGrid columns={permColumns} data={effectivePermissions} isRtl={isRtl} actions={(row) => <Button variant="ghost" size="iconSm" icon={ChevronLeft} onClick={() => setSelectedPermDetail(row)} className={selectedPermDetail?.id === row.id ? 'bg-indigo-50' : ''} />} />
               </div>

               {selectedPermDetail && (
                  <div className="w-1/2 border-r border-slate-200 bg-slate-50 flex flex-col relative shadow-xl z-10">
                     <div className="absolute top-2 left-2"><button onClick={() => setSelectedPermDetail(null)} className="p-1 hover:bg-slate-200 rounded text-slate-500"><X size={14}/></button></div>
                     <div className="p-4 border-b border-slate-200 bg-white">
                        <h3 className="font-black text-slate-800 text-sm mb-1">{selectedPermDetail.path.split('/').pop().trim()}</h3>
                        <div className="flex flex-wrap gap-1 mt-2">{selectedPermDetail.sources.map((s, i) => <Badge key={i} variant={s.type === 'role' ? 'purple' : 'info'}>{s.label}</Badge>)}</div>
                     </div>
                     <div className="p-5 flex-1 overflow-y-auto space-y-6">
                        {(() => {
                           const hasDirect = selectedPermDetail.sources.some(s => s.type === 'direct');
                           return (
                              <>
                                 {!hasDirect && <div className="bg-amber-50 border border-amber-200 p-2 rounded text-[10px] text-amber-700 flex items-center gap-1 mb-2"><Lock size={10}/> {t.permTypeRole}</div>}
                                 <div>
                                    <div className="text-[11px] font-bold text-slate-500 uppercase mb-3">{t.permColOps}</div>
                                    <SelectionGrid items={AVAILABLE_ACTIONS} selectedIds={hasDirect ? selectedPermDetail.directActions : selectedPermDetail.roleActions} onToggle={(id) => handleUpdateDirectPermission(selectedPermDetail.id, 'action', id)} columns={4} />
                                 </div>
                                 <div className="pt-4 border-t border-slate-200">
                                    <div className="text-[11px] font-bold text-slate-500 uppercase mb-3">دسترسی داده</div>
                                    {Object.entries(DATA_SCOPES).map(([k, d]) => (
                                        <div key={k} className="bg-white p-3 rounded-lg border border-slate-200 mb-3">
                                            <span className="text-[11px] font-bold block mb-2 text-slate-700">{d.label}:</span>
                                            <div className="flex flex-wrap gap-2">
                                                {d.options.map(o => <ToggleChip key={o.value} label={o.label} checked={hasDirect ? selectedPermDetail.directScopes?.[k]?.includes(o.value) : selectedPermDetail.roleScopes?.[k]?.includes(o.value)} onClick={() => handleUpdateDirectPermission(selectedPermDetail.id, 'scope', k, o.value)} colorClass={hasDirect ? 'green' : 'indigo'} />)}
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
