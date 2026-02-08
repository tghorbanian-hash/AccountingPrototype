/* Filename: components/UserManagement.js */
import React, { useState, useMemo } from 'react';
import { 
  Users, Search, Plus, Edit, Trash2, Key, Shield, 
  Check, X, RefreshCw, UserCheck, Briefcase, 
  ChevronLeft, Layout, Lock, FileText, Filter, CheckSquare
} from 'lucide-react';

const UserManagement = ({ t, isRtl }) => {
  const UI = window.UI || {};
  const { 
    Button, InputField, SelectField, Toggle, Badge, DataGrid, 
    FilterSection, Modal, SelectionGrid, ToggleChip 
  } = UI;

  if (!Button) return <div className="p-4">Loading UI...</div>;

  // --- MOCK DATA: PARTIES (اشخاص/طرف حساب‌ها) ---
  const MOCK_PARTIES = [
    { id: 101, name: 'علی محمدی', type: 'person', code: 'P-1001' },
    { id: 102, name: 'شرکت فولاد مبارکه', type: 'company', code: 'C-5002' },
    { id: 103, name: 'سارا احمدی', type: 'person', code: 'P-1003' },
    { id: 104, name: 'رضا کلهر', type: 'person', code: 'P-1004' },
  ];

  // --- MOCK DATA: USERS ---
  const [users, setUsers] = useState([
    { id: 1, username: 'admin', partyId: 101, userType: 'مدیر سیستم', isActive: true, lastLogin: '1402/11/15' },
    { id: 2, username: 's.ahmadi', partyId: 103, userType: 'کارشناس مالی', isActive: true, lastLogin: '1402/11/10' },
    { id: 3, username: 'rezakalhor', partyId: 104, userType: 'حسابدار انبار', isActive: false, lastLogin: '1402/10/05' },
  ]);

  // --- STATES ---
  const [selectedRows, setSelectedRows] = useState([]);
  
  // Filter States
  const [filterValues, setFilterValues] = useState({ username: '', userType: '', isActive: 'all' });
  const [appliedFilters, setAppliedFilters] = useState({ username: '', userType: '', isActive: 'all' });

  // Modal States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userFormData, setUserFormData] = useState({ username: '', partyId: '', userType: '', isActive: true, password: '' });

  // Permissions Modal States
  const [isPermModalOpen, setIsPermModalOpen] = useState(false);
  const [viewingUser, setViewingUser] = useState(null);
  const [userPermissions, setUserPermissions] = useState([]); // List of accessible forms
  const [selectedPermDetail, setSelectedPermDetail] = useState(null); // For sidebar details

  // --- LOGIC: FILTERING ---
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchName = !appliedFilters.username || user.username.toLowerCase().includes(appliedFilters.username.toLowerCase());
      const matchType = !appliedFilters.userType || user.userType.includes(appliedFilters.userType);
      const matchStatus = appliedFilters.isActive === 'all' || 
                          (appliedFilters.isActive === 'active' && user.isActive) || 
                          (appliedFilters.isActive === 'inactive' && !user.isActive);
      return matchName && matchType && matchStatus;
    });
  }, [users, appliedFilters]);

  const handleSearch = () => {
    setAppliedFilters(filterValues);
    // No alert needed based on request
  };

  const handleClearSearch = () => {
    const reset = { username: '', userType: '', isActive: 'all' };
    setFilterValues(reset);
    setAppliedFilters(reset);
  };

  // --- LOGIC: USER CRUD ---
  const handleCreate = () => {
    setEditingUser(null);
    setUserFormData({ username: '', partyId: '', userType: 'کارشناس', isActive: true, password: '' });
    setIsEditModalOpen(true);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setUserFormData({ 
      username: user.username, 
      partyId: user.partyId, 
      userType: user.userType, 
      isActive: user.isActive,
      password: '' // Keep empty unless changing
    });
    setIsEditModalOpen(true);
  };

  const handleSaveUser = () => {
    if (!userFormData.username || !userFormData.partyId) {
      alert('لطفا نام کاربری و طرف حساب را مشخص کنید.');
      return;
    }

    if (editingUser) {
      setUsers(prev => prev.map(u => u.id === editingUser.id ? { ...u, ...userFormData, id: u.id } : u));
    } else {
      const newUser = {
        id: Date.now(),
        ...userFormData,
        lastLogin: '-'
      };
      setUsers(prev => [...prev, newUser]);
    }
    setIsEditModalOpen(false);
  };

  const handleDelete = (ids) => {
    if (confirm(`آیا از حذف ${ids.length} کاربر اطمینان دارید؟`)) {
      setUsers(prev => prev.filter(u => !ids.includes(u.id)));
      setSelectedRows([]);
    }
  };

  const handleResetPassword = (user) => {
    if (confirm(`آیا مطمئن هستید که می‌خواهید رمز عبور کاربر "${user.username}" را به "123456" تغییر دهید؟`)) {
      alert('رمز عبور با موفقیت بازنشانی شد.');
    }
  };

  // --- LOGIC: VIEW PERMISSIONS ---
  const handleViewPermissions = (user) => {
    setViewingUser(user);
    // MOCK: Generate permissions based on user
    // In a real app, fetch from backend. Here we simulate "Role" vs "Direct" access.
    const mockPerms = [
      { 
        id: 'doc_list', 
        path: 'حسابداری / دفتر کل / اسناد / مدیریت اسناد', 
        source: 'role', 
        roleName: 'مدیر مالی', 
        actions: ['create', 'edit', 'view', 'approve'], 
        dataScopes: { 'نوع سند': ['عمومی', 'افتتاحیه'], 'وضعیت': ['قطعی'] }
      },
      { 
        id: 'rpt_balance', 
        path: 'حسابداری / گزارشات / تراز آزمایشی', 
        source: 'role', 
        roleName: 'حسابدار ارشد', 
        actions: ['view', 'print', 'export'], 
        dataScopes: {}
      },
      { 
        id: 'user_profile', 
        path: 'تنظیمات / پروفایل کاربری', 
        source: 'direct', 
        roleName: '-', 
        actions: ['edit', 'view'], 
        dataScopes: {}
      }
    ];
    setUserPermissions(mockPerms);
    setSelectedPermDetail(null);
    setIsPermModalOpen(true);
  };

  // --- RENDER HELPERS ---
  const getPartyName = (id) => {
    const p = MOCK_PARTIES.find(p => p.id === Number(id));
    return p ? `${p.name} (${p.code})` : 'نامشخص';
  };

  // --- COLUMNS FOR MAIN GRID ---
  const columns = [
    { header: 'شناسه', field: 'id', width: 'w-16', sortable: true },
    { header: 'نام کاربری', field: 'username', width: 'w-32', sortable: true },
    { 
      header: 'نام شخص / شرکت', 
      field: 'partyId', 
      width: 'w-48', 
      render: (row) => <span className="font-bold text-slate-700">{getPartyName(row.partyId)}</span>
    },
    { header: 'نوع کاربری', field: 'userType', width: 'w-32', sortable: true }, // Changed from Role to UserType
    { header: 'آخرین ورود', field: 'lastLogin', width: 'w-32', render: (r) => <span className="dir-ltr font-mono text-xs text-slate-500">{r.lastLogin}</span> },
    { 
      header: 'وضعیت', 
      field: 'isActive', 
      width: 'w-24 text-center', 
      render: (row) => <Badge variant={row.isActive ? 'success' : 'neutral'}>{row.isActive ? 'فعال' : 'غیرفعال'}</Badge>
    },
  ];

  // --- COLUMNS FOR PERMISSION MODAL GRID ---
  const permColumns = [
    { header: 'مسیر فرم / صفحه', field: 'path', width: 'w-full', render: (r) => <div className="text-[11px] text-slate-600 font-medium flex items-center gap-2"><FileText size={12} className="text-indigo-400"/>{r.path}</div> },
    { 
      header: 'منبع دسترسی', 
      field: 'source', 
      width: 'w-32 text-center', 
      render: (r) => (
        <Badge variant={r.source === 'role' ? 'purple' : 'info'}>
          {r.source === 'role' ? 'نقش سازمانی' : 'مستقیم'}
        </Badge>
      )
    },
    { header: 'نام نقش', field: 'roleName', width: 'w-32', render: (r) => <span className="text-[10px]">{r.roleName}</span> },
  ];

  return (
    <div className={`flex flex-col h-full bg-slate-50/50 p-4 overflow-hidden ${isRtl ? 'font-vazir' : 'font-sans'}`}>
      
      {/* 1. HEADER */}
      <div className="flex items-center justify-between mb-4 shrink-0">
         <div>
            <h1 className="text-xl font-black text-slate-800 flex items-center gap-2">
               <Users className="text-indigo-600" size={24}/>
               مدیریت کاربران
            </h1>
            <p className="text-slate-500 text-xs mt-1">تعریف کاربران، اتصال به اشخاص و مدیریت دسترسی‌ها</p>
         </div>
      </div>

      {/* 2. FILTER SECTION */}
      <FilterSection 
        title="جستجوی پیشرفته کاربران"
        onSearch={handleSearch} 
        onClear={handleClearSearch}
        isRtl={isRtl}
      >
         <InputField 
           label="نام کاربری" 
           value={filterValues.username}
           onChange={(e) => setFilterValues({...filterValues, username: e.target.value})}
           placeholder="جستجو..." 
           isRtl={isRtl} 
         />
         <InputField 
           label="نوع کاربری" 
           value={filterValues.userType}
           onChange={(e) => setFilterValues({...filterValues, userType: e.target.value})}
           placeholder="مثال: مدیر..." 
           isRtl={isRtl} 
         />
         <SelectField 
           label="وضعیت" 
           value={filterValues.isActive}
           onChange={(e) => setFilterValues({...filterValues, isActive: e.target.value})}
           isRtl={isRtl}
         >
             <option value="all">همه</option>
             <option value="active">فعال</option>
             <option value="inactive">غیرفعال</option>
         </SelectField>
      </FilterSection>

      {/* 3. MAIN GRID */}
      <div className="flex-1 min-h-0">
         <DataGrid 
            title="لیست کاربران سیستم"
            columns={columns}
            data={filteredUsers}
            isRtl={isRtl}
            selectedIds={selectedRows}
            onSelectAll={(c) => setSelectedRows(c ? filteredUsers.map(r => r.id) : [])}
            onSelectRow={(id, c) => setSelectedRows(p => c ? [...p, id] : p.filter(r => r !== id))}
            onCreate={handleCreate}
            onDelete={handleDelete}
            onDoubleClick={handleEdit}
            actions={(row) => (
               <>
                 <Button variant="ghost" size="iconSm" icon={Edit} className="text-blue-600 hover:bg-blue-50" onClick={() => handleEdit(row)} title="ویرایش کاربر" />
                 <Button variant="ghost" size="iconSm" icon={Shield} className="text-purple-600 hover:bg-purple-50" onClick={() => handleViewPermissions(row)} title="مشاهده دسترسی‌ها" />
                 <Button variant="ghost" size="iconSm" icon={RefreshCw} className="text-amber-600 hover:bg-amber-50" onClick={() => handleResetPassword(row)} title="بازنشانی رمز عبور" />
               </>
            )}
         />
      </div>

      {/* 4. CREATE/EDIT USER MODAL */}
      <Modal
         isOpen={isEditModalOpen}
         onClose={() => setIsEditModalOpen(false)}
         title={editingUser ? "ویرایش اطلاعات کاربر" : "تعریف کاربر جدید"}
         size="md"
         footer={
            <>
               <Button variant="secondary" onClick={() => setIsEditModalOpen(false)}>انصراف</Button>
               <Button variant="primary" icon={Check} onClick={handleSaveUser}>ذخیره اطلاعات</Button>
            </>
         }
      >
         <div className="space-y-4">
            {/* User Details */}
            <div className="grid grid-cols-2 gap-4">
               <InputField 
                  label="نام کاربری" 
                  value={userFormData.username} 
                  onChange={(e) => setUserFormData({...userFormData, username: e.target.value})}
                  isRtl={isRtl} 
                  placeholder="مثال: ali.rezaei"
                  className="dir-ltr"
               />
               <SelectField 
                   label="نوع کاربری" 
                   value={userFormData.userType}
                   onChange={(e) => setUserFormData({...userFormData, userType: e.target.value})}
                   isRtl={isRtl}
               >
                   <option value="مدیر سیستم">مدیر سیستم</option>
                   <option value="مدیر مالی">مدیر مالی</option>
                   <option value="کارشناس">کارشناس</option>
                   <option value="کاربر عادی">کاربر عادی</option>
               </SelectField>
            </div>

            {/* Party Link (LOV Simulation) */}
            <div className="bg-slate-50 p-3 rounded border border-slate-200">
               <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
                  <Briefcase size={12}/> اتصال به شخص / طرف حساب
               </label>
               <SelectField 
                   value={userFormData.partyId}
                   onChange={(e) => setUserFormData({...userFormData, partyId: Number(e.target.value)})}
                   isRtl={isRtl}
               >
                   <option value="">-- انتخاب کنید --</option>
                   {MOCK_PARTIES.map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({p.code}) - {p.type === 'person' ? 'شخص حقیقی' : 'شخص حقوقی'}</option>
                   ))}
               </SelectField>
               <p className="text-[10px] text-slate-400 mt-1 mr-1">
                  * هر کاربر سیستم باید به یک شخص یا شرکت تعریف شده متصل باشد تا امکان ثبت سند و عملیات مالی فراهم شود.
               </p>
            </div>

            {/* Password & Status */}
            <div className="grid grid-cols-2 gap-4 items-end">
                <div>
                   <label className="block text-[11px] font-bold text-slate-600 mb-1">رمز عبور</label>
                   <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => setUserFormData({...userFormData, password: '123'})} icon={Key} className="w-full justify-center">
                         تنظیم روی 123456
                      </Button>
                   </div>
                </div>
                <div className="flex items-center justify-between h-10 px-2 bg-slate-50 rounded border border-slate-200">
                   <span className="text-[12px] text-slate-700 font-bold">وضعیت حساب:</span>
                   <Toggle 
                      checked={userFormData.isActive} 
                      onChange={(val) => setUserFormData({...userFormData, isActive: val})} 
                      label={userFormData.isActive ? "فعال" : "غیرفعال"} 
                   />
                </div>
            </div>
         </div>
      </Modal>

      {/* 5. VIEW PERMISSIONS MODAL */}
      <Modal
         isOpen={isPermModalOpen}
         onClose={() => setIsPermModalOpen(false)}
         title={viewingUser ? `دسترسی‌های کاربر: ${viewingUser.username}` : "مشاهده دسترسی‌ها"}
         size="xl"
         footer={
            <Button variant="primary" onClick={() => setIsPermModalOpen(false)}>بستن</Button>
         }
      >
         <div className="flex h-[500px] border border-slate-200 rounded-lg overflow-hidden">
            {/* Left: List of Forms */}
            <div className={`${selectedPermDetail ? 'w-1/2' : 'w-full'} flex flex-col transition-all duration-300`}>
               <div className="p-3 bg-slate-50 border-b border-slate-200 font-bold text-xs text-slate-700 flex items-center justify-between">
                  <span>لیست فرم‌ها و صفحات مجاز</span>
                  <span className="text-[10px] text-slate-400 bg-white px-2 py-0.5 rounded border">تعداد: {userPermissions.length}</span>
               </div>
               <div className="flex-1 bg-white overflow-hidden">
                  <DataGrid 
                    columns={permColumns}
                    data={userPermissions}
                    isRtl={isRtl}
                    onSelectRow={(id) => {
                       const perm = userPermissions.find(p => p.id === id); // Mock ID matching logic
                       // Since DataGrid passes ID, we need to ensure permissions have IDs or use index.
                       // Assuming mockPerms have unique 'id'.
                       if(!perm && userPermissions.length > 0) setSelectedPermDetail(userPermissions.find(p => p.id === id));
                    }}
                    actions={(row) => (
                       <Button 
                          variant="ghost" 
                          size="iconSm" 
                          icon={ChevronLeft} 
                          className={`text-slate-400 hover:text-indigo-600 ${selectedPermDetail?.id === row.id ? 'bg-indigo-50 text-indigo-700' : ''}`}
                          onClick={() => setSelectedPermDetail(row)} 
                          title="جزئیات"
                       />
                    )}
                  />
               </div>
            </div>

            {/* Right: Sidebar Details (Animation slide-in) */}
            {selectedPermDetail && (
               <div className="w-1/2 border-r border-slate-200 bg-slate-50 flex flex-col animate-in slide-in-from-right-5 duration-200 relative shadow-xl z-10">
                  <div className="absolute top-2 left-2">
                     <button onClick={() => setSelectedPermDetail(null)} className="p-1 hover:bg-slate-200 rounded text-slate-500"><X size={14}/></button>
                  </div>
                  
                  <div className="p-4 border-b border-slate-200 bg-white">
                     <h3 className="font-black text-slate-800 text-sm mb-1">{selectedPermDetail.path.split('/').pop().trim()}</h3>
                     <p className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Lock size={10}/> منبع: {selectedPermDetail.source === 'role' ? `نقش (${selectedPermDetail.roleName})` : 'مستقیم'}
                     </p>
                  </div>

                  <div className="p-5 flex-1 overflow-y-auto space-y-6">
                     {/* Layer 2: Actions */}
                     <div>
                        <div className="text-[11px] font-bold text-slate-500 uppercase mb-3 flex items-center gap-2">
                           <span className="w-5 h-5 rounded bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px]">2</span>
                           عملیات مجاز (Operations)
                        </div>
                        <div className="flex flex-wrap gap-2">
                           {selectedPermDetail.actions.map(action => (
                              <span key={action} className="px-3 py-1.5 bg-white border border-indigo-200 text-indigo-700 rounded-lg text-[11px] font-bold shadow-sm flex items-center gap-1.5">
                                 <Check size={10}/> {action}
                              </span>
                           ))}
                           {selectedPermDetail.actions.length === 0 && <span className="text-xs text-slate-400 italic">هیچ عملیاتی تعریف نشده</span>}
                        </div>
                     </div>

                     {/* Layer 3: Data Scopes */}
                     <div>
                        <div className="text-[11px] font-bold text-slate-500 uppercase mb-3 flex items-center gap-2 pt-4 border-t border-slate-200">
                           <span className="w-5 h-5 rounded bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px]">3</span>
                           دسترسی روی داده (Data Scopes)
                        </div>
                        <div className="space-y-3">
                           {Object.keys(selectedPermDetail.dataScopes).length > 0 ? (
                              Object.entries(selectedPermDetail.dataScopes).map(([key, values]) => (
                                 <div key={key} className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                                    <span className="text-[11px] font-bold text-slate-700 block mb-2">{key}:</span>
                                    <div className="flex flex-wrap gap-1">
                                       {values.map(val => (
                                          <span key={val} className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded text-[10px] border border-emerald-100">
                                             {val}
                                          </span>
                                       ))}
                                    </div>
                                 </div>
                              ))
                           ) : (
                              <div className="p-4 border border-dashed border-slate-300 rounded text-center text-[11px] text-slate-400">
                                 بدون محدودیت فیلتر داده (دسترسی کامل)
                              </div>
                           )}
                        </div>
                     </div>
                  </div>
               </div>
            )}
         </div>
      </Modal>

    </div>
  );
};

window.UserManagement = UserManagement;
