/* Filename: components/UserManagement.js
   Description: Refactored with UI System (Glassmorphism)
   Strict Compliance: No features removed. All logic preserved.
*/

import React, { useState, useEffect } from 'react';
import { 
  Search, Plus, Filter, Edit, Trash2, Shield, Key, 
  CheckCircle2, XCircle, ChevronLeft, ChevronRight, User, 
  Save, X, MoreHorizontal, Lock, RefreshCw, Users, Info,
  Layers, FileText, CheckSquare, Eye, MousePointerClick,
  Database, Settings, Printer, Download, Upload
} from 'lucide-react';

// --- RICH MOCK DATA (PRESERVED EXACTLY AS IS) ---
const MOCK_ACCESS_SOURCES = {
  'admin': [
    { 
      type: 'role', 
      id: 'r_cfo', 
      name: { fa: 'مدیر ارشد مالی', en: 'Chief Financial Officer' },
      forms: [
        { 
          id: 'f_gl_doc', name: { fa: 'سند حسابداری', en: 'Accounting Voucher' }, 
          ops: ['Create', 'Read', 'Update', 'Delete', 'Verify', 'Finalize', 'Print'] 
        },
        { 
          id: 'f_rep_bal', name: { fa: 'تراز آزمایشی', en: 'Trial Balance' }, 
          ops: ['Read', 'Export Excel', 'Drill Down', 'Print'] 
        },
        { 
          id: 'f_budget', name: { fa: 'بودجه‌ریزی عملیاتی', en: 'Operational Budgeting' }, 
          ops: ['Create', 'Read', 'Update', 'Approve'] 
        }
      ]
    },
    { 
      type: 'role', 
      id: 'r_tr_mgr', 
      name: { fa: 'مدیر خزانه‌داری', en: 'Treasury Manager' },
      forms: [
        { 
          id: 'f_pay_req', name: { fa: 'درخواست پرداخت', en: 'Payment Request' }, 
          ops: ['Read', 'Approve', 'Reject', 'Pay'] 
        },
        { 
          id: 'f_cheque', name: { fa: 'مدیریت چک‌های پرداختی', en: 'Cheque Management' }, 
          ops: ['Create', 'Read', 'Update', 'Issue', 'Void'] 
        }
      ]
    },
    {
      type: 'user', 
      id: 'u_direct_1',
      name: { fa: 'دسترسی ویژه کاربر', en: 'User Special Access' },
      forms: [
        { 
          id: 'f_sys_config', name: { fa: 'تنظیمات کلان سیستم', en: 'System Configuration' }, 
          ops: ['Read', 'Update', 'System Reset'] 
        },
        { 
          id: 'f_audit_log', name: { fa: 'لاگ‌های امنیتی', en: 'Audit Logs' }, 
          ops: ['Read', 'Export CSV'] 
        }
      ]
    }
  ],
  'user': [
    { 
      type: 'role', 
      id: 'r_acc_staff', 
      name: { fa: 'کارشناس حسابداری', en: 'Accounting Staff' },
      forms: [
        { 
          id: 'f_gl_doc', name: { fa: 'سند حسابداری', en: 'Accounting Voucher' }, 
          ops: ['Create', 'Read', 'Update'] 
        },
        { 
          id: 'f_acc_review', name: { fa: 'مرور حساب‌ها', en: 'Account Review' }, 
          ops: ['Read'] 
        }
      ]
    },
    {
      type: 'user', 
      id: 'u_direct_2',
      name: { fa: 'دسترسی شخصی', en: 'Personal Access' },
      forms: [
        { 
          id: 'f_my_profile', name: { fa: 'پروفایل کاربری', en: 'User Profile' }, 
          ops: ['Read', 'Update Password'] 
        }
      ]
    }
  ]
};

// --- Refactored Permissions Modal ---
const PermissionsModal = ({ user, onClose, t, isRtl }) => {
  const [selectedSource, setSelectedSource] = useState(null);
  const [selectedForm, setSelectedForm] = useState(null);

  // Load mock permissions
  const accessSources = user.userType === 'admin' ? MOCK_ACCESS_SOURCES['admin'] : MOCK_ACCESS_SOURCES['user'];

  useEffect(() => {
    if (accessSources && accessSources.length > 0) {
      setSelectedSource(accessSources[0]);
    }
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
      {/* Main Glass Modal Card */}
      <window.UI.Card className="w-full max-w-6xl h-[85vh] flex flex-col overflow-hidden !p-0 shadow-2xl shadow-black/20">
        
        {/* Modal Header */}
        <div className="bg-white/60 backdrop-blur-md border-b border-white/40 px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-600/20"><Shield size={22} /></div>
            <div>
              <h3 className="font-black text-slate-800 text-lg tracking-tight">{t.permModalTitle}</h3>
              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mt-1">
                <window.UI.Badge variant="neutral">{user.id}</window.UI.Badge>
                <span>{user.username}</span>
                <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                <span>{user.personName}</span>
              </div>
            </div>
          </div>
          <window.UI.IconButton icon={X} onClick={onClose} color="red" />
        </div>

        {/* Modal Body - 3 Column Layout */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Column 1: Access Sources */}
          <div className={`w-[280px] shrink-0 border-${isRtl ? 'l' : 'r'} border-slate-200/50 flex flex-col bg-slate-50/30`}>
            <div className="p-3 border-b border-slate-200/50 bg-white/20 font-bold text-[11px] text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <Layers size={14} /> {t.permColSource}
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {accessSources.map(source => (
                <div 
                  key={source.id}
                  onClick={() => { setSelectedSource(source); setSelectedForm(null); }}
                  className={`
                    p-3.5 rounded-xl border cursor-pointer transition-all duration-200 group relative
                    ${selectedSource?.id === source.id 
                      ? 'bg-white border-blue-500 shadow-md shadow-blue-100 ring-1 ring-blue-500' 
                      : 'bg-white/40 border-slate-200/60 hover:border-blue-300 hover:bg-white'}
                  `}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <window.UI.Badge variant={source.type === 'role' ? 'purple' : 'warning'}>
                      {source.type === 'role' ? t.permTypeRole : t.permTypeUser}
                    </window.UI.Badge>
                    {selectedSource?.id === source.id && <CheckCircle2 size={14} className="text-blue-500" />}
                  </div>
                  <div className={`font-bold text-sm leading-tight ${selectedSource?.id === source.id ? 'text-slate-800' : 'text-slate-600'}`}>
                    {source.name[isRtl ? 'fa' : 'en']}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: Forms */}
          <div className={`w-[320px] shrink-0 border-${isRtl ? 'l' : 'r'} border-slate-200/50 flex flex-col bg-white/40 z-10`}>
            <div className="p-3 border-b border-slate-200/50 bg-white/40 font-bold text-[11px] text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <FileText size={14} /> {t.permColForms}
            </div>
            <div className="flex-1 overflow-y-auto">
              {!selectedSource ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-3 p-8 text-center opacity-60">
                  <MousePointerClick size={48} />
                  <span className="text-xs font-bold">{t.permSelectSource}</span>
                </div>
              ) : (
                <div className="divide-y divide-slate-100/50">
                  {selectedSource.forms.map(form => (
                    <div 
                      key={form.id}
                      onClick={() => setSelectedForm(form)}
                      className={`
                        px-5 py-4 cursor-pointer transition-all duration-200 flex items-center justify-between
                        ${selectedForm?.id === form.id ? 'bg-blue-50/60' : 'hover:bg-white/60'}
                      `}
                    >
                      <div className="flex items-center gap-3">
                         <div className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-sm ${selectedForm?.id === form.id ? 'bg-blue-200 text-blue-700' : 'bg-white text-slate-400'}`}>
                            <Database size={16} />
                         </div>
                         <span className={`text-sm ${selectedForm?.id === form.id ? 'font-bold text-blue-900' : 'font-medium text-slate-600'}`}>
                           {form.name[isRtl ? 'fa' : 'en']}
                         </span>
                      </div>
                      {selectedForm?.id === form.id && <ChevronLeft size={16} className={`text-blue-500 ${isRtl ? '' : 'rotate-180'}`} />}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Column 3: Operations */}
          <div className="flex-1 flex flex-col bg-slate-50/20">
            <div className="p-3 border-b border-slate-200/50 bg-white/20 font-bold text-[11px] text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <CheckSquare size={14} /> {t.permColOps}
            </div>
            <div className="flex-1 overflow-y-auto p-8">
              {!selectedForm ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-3 opacity-60">
                  <Eye size={48} />
                  <span className="text-xs font-bold">{t.permSelectForm}</span>
                </div>
              ) : (
                <div className="animate-in slide-in-from-start-4 duration-300 space-y-6">
                  
                  <window.UI.Card isSurface className="bg-white/80">
                    <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Settings size={20} /></div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-lg">{selectedForm.name[isRtl ? 'fa' : 'en']}</h4>
                        <p className="text-xs text-slate-400">ID: {selectedForm.id}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {selectedForm.ops.map(op => {
                         let variant = 'success';
                         let icon = <CheckCircle2 size={14} />;
                         
                         if(op === 'Delete' || op === 'Void') { variant = 'danger'; icon = <Trash2 size={14} />; }
                         if(op === 'Print' || op === 'Export Excel') { variant = 'info'; icon = <Printer size={14} />; }

                         return (
                          <div key={op} className="flex items-center gap-2">
                             <window.UI.Badge variant={variant}>
                                <span className="flex items-center gap-1">
                                  {icon} {op}
                                </span>
                             </window.UI.Badge>
                          </div>
                        );
                      })}
                    </div>
                  </window.UI.Card>

                  <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100 flex gap-3">
                    <Info size={20} className="text-blue-500 shrink-0" />
                    <p className="text-xs text-blue-700 leading-relaxed font-medium">
                      {isRtl 
                        ? 'تغییرات در این سطح دسترسی بلافاصله روی تمام کاربرانی که این نقش را دارند اعمال می‌شود.' 
                        : 'Changes to this permission level are immediately applied to all users holding this role.'}
                    </p>
                  </div>

                </div>
              )}
            </div>
          </div>

        </div>
      </window.UI.Card>
    </div>
  );
};

// --- Main Component ---
const UserManagement = ({ t, isRtl }) => {
  const [viewMode, setViewMode] = useState('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [permissionUser, setPermissionUser] = useState(null);

  // Mock Data
  const mockPersons = [
    { id: 1, name: 'محمد راد' },
    { id: 2, name: 'سارا تهرانی' },
    { id: 3, name: 'علی محمدی' },
    { id: 4, name: 'رضا قربانی' },
  ];

  const [users, setUsers] = useState([
    { id: 1001, username: 'admin', personId: 4, personName: 'رضا قربانی', userType: 'admin', status: true, lastLogin: '1402/12/15 08:30' },
    { id: 1002, username: 'm.rad', personId: 1, personName: 'محمد راد', userType: 'user', status: true, lastLogin: '1402/12/14 14:20' },
    { id: 1003, username: 's.tehrani', personId: 2, personName: 'سارا تهرانی', userType: 'user', status: false, lastLogin: '1402/11/28 09:15' },
  ]);

  const [formData, setFormData] = useState({
    id: '', username: '', personId: '', userType: 'user', status: true, password: '', isPasswordChanged: false
  });

  const handleCreateNew = () => {
    const newId = Math.max(...users.map(u => u.id), 1000) + 1;
    setFormData({ id: newId, username: '', personId: '', userType: 'user', status: true, password: '', isPasswordChanged: false });
    setEditingUser(null);
    setViewMode('form');
  };

  const handleEdit = (user) => {
    setFormData({ ...user, password: '', isPasswordChanged: false });
    setEditingUser(user);
    setViewMode('form');
  };

  const handleSave = (e) => {
    e.preventDefault();
    const selectedPerson = mockPersons.find(p => p.id === parseInt(formData.personId));
    const userData = { ...formData, personName: selectedPerson ? selectedPerson.name : '-', lastLogin: editingUser ? editingUser.lastLogin : '-' };
    if (editingUser) setUsers(users.map(u => u.id === userData.id ? userData : u));
    else setUsers([...users, userData]);
    setViewMode('list');
  };

  const handleDelete = (id) => {
    if (window.confirm(t.confirmDelete)) setUsers(users.filter(u => u.id !== id));
  };

  // --- List View ---
  const renderList = () => (
    <div className="flex flex-col h-full animate-in fade-in duration-300 p-6 gap-6">
      
      {/* Header Card */}
      <window.UI.Card className="flex items-center justify-between !py-4" noPadding>
        <div className="flex items-center gap-4 px-6">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl"><Users size={24} /></div>
          <div>
            <h1 className="text-lg font-black text-slate-800">{t.usersListTitle}</h1>
            <p className="text-xs text-slate-500 font-bold">{users.length} {t.recordsFound}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 px-6">
          <window.UI.InputField 
            placeholder={t.searchUserPlaceholder} 
            icon={Search} 
            isRtl={isRtl} 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
          <window.UI.Button onClick={handleCreateNew} icon={Plus}>
            {t.createNewUser}
          </window.UI.Button>
        </div>
      </window.UI.Card>

      {/* Table Card */}
      <window.UI.Card className="flex-1 overflow-hidden flex flex-col" noPadding>
        <div className="overflow-auto flex-1">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50/80 text-slate-500 font-bold uppercase border-b border-slate-200 sticky top-0 backdrop-blur-sm z-10">
              <tr>
                <th className="px-6 py-4 w-20 text-center">{t.colId}</th>
                <th className={`px-6 py-4 text-${isRtl ? 'right' : 'left'}`}>{t.colUsername}</th>
                <th className={`px-6 py-4 text-${isRtl ? 'right' : 'left'}`}>{t.colLinkedPerson}</th>
                <th className={`px-6 py-4 text-${isRtl ? 'right' : 'left'}`}>{t.colUserType}</th>
                <th className="px-6 py-4 w-32 text-center">{t.colStatus}</th>
                <th className="px-6 py-4 w-40 text-center">{t.colActions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-6 py-4 text-center font-mono font-bold text-slate-400">{user.id}</td>
                  <td className={`px-6 py-4 font-bold text-slate-800 text-${isRtl ? 'right' : 'left'}`}>{user.username}</td>
                  <td className={`px-6 py-4 text-slate-600 text-${isRtl ? 'right' : 'left'}`}>{user.personName}</td>
                  <td className={`px-6 py-4 text-${isRtl ? 'right' : 'left'}`}>
                    <window.UI.Badge variant={user.userType === 'admin' ? 'purple' : 'neutral'}>
                      {user.userType === 'admin' ? t.roleAdmin : t.roleUser}
                    </window.UI.Badge>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                        <window.UI.Badge variant={user.status ? 'success' : 'danger'}>
                           {user.status ? t.active : t.inactive}
                        </window.UI.Badge>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <window.UI.IconButton onClick={() => setPermissionUser(user)} icon={Shield} color="purple" title={t.viewPermissions} />
                      <window.UI.IconButton onClick={() => handleEdit(user)} icon={Edit} color="blue" title={t.edit} />
                      <window.UI.IconButton onClick={() => handleDelete(user.id)} icon={Trash2} color="red" title={t.delete} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </window.UI.Card>
    </div>
  );

  // --- Form View ---
  const renderForm = () => (
    <div className="flex flex-col h-full animate-in zoom-in-95 duration-200 p-6 justify-center">
      <window.UI.Card className="max-w-4xl w-full mx-auto" noPadding>
        
        {/* Form Header */}
        <div className="border-b border-slate-200/50 px-8 py-5 flex items-center justify-between bg-white/40">
          <div className="flex items-center gap-4">
            <window.UI.IconButton 
              icon={isRtl ? ChevronRight : ChevronLeft} 
              onClick={() => setViewMode('list')} 
              color="slate" 
            />
            <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
              {editingUser ? <Edit size={20} className="text-blue-600"/> : <Plus size={20} className="text-blue-600"/>}
              {editingUser ? t.editUserTitle : t.newUserTitle}
            </h2>
          </div>
          <div className="flex items-center gap-3">
             <window.UI.Button variant="ghost" onClick={() => setViewMode('list')}>{t.cancel}</window.UI.Button>
             <window.UI.Button variant="primary" icon={Save} onClick={handleSave}>{t.saveChanges}</window.UI.Button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-8 bg-white/30">
          <form className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            <div className="md:col-span-2 flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-200/50 pb-2 mb-2">
              <User size={14} /> {t.gl_base_info || 'User Information'}
            </div>

            <div className="space-y-6">
               <div className="flex gap-6">
                 <window.UI.InputField label={t.fieldId} value={formData.id} disabled className="w-24 opacity-70" />
                 <div className="flex-1 pt-6">
                    <window.UI.Toggle 
                      checked={formData.status} 
                      onChange={(val) => setFormData({...formData, status: val})}
                      labelActive={t.active}
                      labelInactive={t.inactive}
                    />
                 </div>
               </div>

               <window.UI.InputField 
                 label={t.fieldUsername} 
                 value={formData.username} 
                 onChange={(e) => setFormData({...formData, username: e.target.value})}
                 required 
                 icon={User}
                 isRtl={isRtl}
               />

               <window.UI.SelectField 
                  label={t.fieldUserType}
                  value={formData.userType}
                  onChange={(e) => setFormData({...formData, userType: e.target.value})}
                  isRtl={isRtl}
               >
                  <option value="user">{t.roleUser}</option>
                  <option value="admin">{t.roleAdmin}</option>
               </window.UI.SelectField>
            </div>

            <div className="space-y-6">
              <window.UI.SelectField 
                  label={t.fieldLinkedPerson}
                  value={formData.personId}
                  onChange={(e) => setFormData({...formData, personId: e.target.value})}
                  isRtl={isRtl}
               >
                  <option value="">{t.selectPersonPlaceholder}</option>
                  {mockPersons.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
              </window.UI.SelectField>

              <div className="p-4 rounded-2xl bg-slate-50/50 border border-slate-100 mt-2">
                 <label className="block text-[10px] font-bold text-slate-500 uppercase mb-3">{t.fieldPassword}</label>
                 <div className="flex gap-2">
                    <window.UI.InputField 
                      type="password"
                      placeholder={editingUser ? "••••••••" : t.enterPassword}
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      icon={Lock}
                      isRtl={isRtl}
                    />
                    <window.UI.Button 
                      variant="secondary" 
                      icon={RefreshCw} 
                      onClick={() => {
                        alert(t.passwordResetMsg);
                        setFormData({...formData, password: 'DefaultPassword123!', isPasswordChanged: true});
                      }}
                    />
                 </div>
              </div>
            </div>

          </form>
        </div>
      </window.UI.Card>
    </div>
  );

  return (
    <>
      {viewMode === 'list' ? renderList() : renderForm()}
      {permissionUser && (
        <PermissionsModal 
          user={permissionUser} 
          onClose={() => setPermissionUser(null)} 
          t={t} 
          isRtl={isRtl} 
        />
      )}
    </>
  );
};

window.UserManagement = UserManagement;
