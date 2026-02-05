import React, { useState, useEffect } from 'react';
import { 
  Search, Plus, Filter, Edit, Trash2, Shield, Key, 
  CheckCircle2, XCircle, ChevronLeft, ChevronRight, User, 
  Save, X, MoreHorizontal, Lock, RefreshCw, Users, Info,
  Layers, FileText, CheckSquare, Eye, MousePointerClick
} from 'lucide-react';

// --- Mock Data for Permissions (Simulator) ---
// این داده‌ها صرفاً برای نمایش عملکرد مودال دسترسی‌ها تولید شده‌اند
const MOCK_ACCESS_SOURCES = {
  'admin': [
    { 
      type: 'role', 
      id: 'r1', 
      name: { fa: 'مدیر ارشد مالی', en: 'CFO' },
      forms: [
        { 
          id: 'f1', name: { fa: 'سند حسابداری', en: 'Accounting Voucher' }, 
          ops: ['Create', 'Read', 'Update', 'Delete', 'Verify', 'Finalize'] 
        },
        { 
          id: 'f2', name: { fa: 'مرور حساب‌ها', en: 'Account Review' }, 
          ops: ['Read', 'Export Excel', 'Drill Down'] 
        }
      ]
    },
    {
      type: 'user', // Direct User Permission
      id: 'u_direct',
      name: { fa: 'دسترسی‌های مستقیم کاربر', en: 'Direct User Access' },
      forms: [
        { 
          id: 'f3', name: { fa: 'تنظیمات سیستم', en: 'System Settings' }, 
          ops: ['Read', 'Update'] 
        }
      ]
    }
  ],
  'user': [
    { 
      type: 'role', 
      id: 'r2', 
      name: { fa: 'کارشناس حسابداری', en: 'Accounting Expert' },
      forms: [
        { 
          id: 'f1', name: { fa: 'سند حسابداری', en: 'Accounting Voucher' }, 
          ops: ['Create', 'Read', 'Update'] 
        }
      ]
    }
  ]
};

const PermissionsModal = ({ user, onClose, t, isRtl }) => {
  const [selectedSource, setSelectedSource] = useState(null);
  const [selectedForm, setSelectedForm] = useState(null);

  // Load mock permissions based on user role (just for simulation)
  const accessSources = user.userType === 'admin' ? MOCK_ACCESS_SOURCES['admin'] : MOCK_ACCESS_SOURCES['user'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-5xl h-[80vh] rounded-lg shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        
        {/* Modal Header */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Shield size={20} /></div>
            <div>
              <h3 className="font-bold text-slate-800 text-lg">{t.permModalTitle}</h3>
              <p className="text-xs text-slate-500 font-mono mt-0.5">{user.username} - {user.personName}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Modal Body - 3 Column Layout */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Column 1: Access Sources (Roles/User) */}
          <div className={`w-1/3 border-${isRtl ? 'l' : 'r'} border-slate-200 flex flex-col bg-slate-50/50`}>
            <div className="p-3 border-b border-slate-200 font-bold text-xs text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <Users size={14} /> {t.permColSource}
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
              {accessSources.map(source => (
                <div 
                  key={source.id}
                  onClick={() => { setSelectedSource(source); setSelectedForm(null); }}
                  className={`p-3 rounded border cursor-pointer transition-all group ${selectedSource?.id === source.id ? 'bg-white border-blue-500 shadow-md' : 'bg-slate-100 border-transparent hover:bg-white hover:border-slate-300'}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-black uppercase ${source.type === 'role' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                      {source.type === 'role' ? t.permTypeRole : t.permTypeUser}
                    </span>
                  </div>
                  <div className={`font-bold text-sm ${selectedSource?.id === source.id ? 'text-blue-700' : 'text-slate-700'}`}>
                    {source.name[isRtl ? 'fa' : 'en']}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: Forms */}
          <div className={`w-1/3 border-${isRtl ? 'l' : 'r'} border-slate-200 flex flex-col bg-white`}>
            <div className="p-3 border-b border-slate-200 font-bold text-xs text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <FileText size={14} /> {t.permColForms}
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              {!selectedSource ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-300 gap-2">
                  <MousePointerClick size={32} />
                  <span className="text-xs">{t.permSelectSource}</span>
                </div>
              ) : (
                <div className="space-y-1">
                  {selectedSource.forms.map(form => (
                    <div 
                      key={form.id}
                      onClick={() => setSelectedForm(form)}
                      className={`px-4 py-3 border-b border-slate-50 cursor-pointer hover:bg-blue-50 transition-colors flex items-center justify-between ${selectedForm?.id === form.id ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600'}`}
                    >
                      <span className="text-xs">{form.name[isRtl ? 'fa' : 'en']}</span>
                      {selectedForm?.id === form.id && <ChevronLeft size={14} className={isRtl ? '' : 'rotate-180'} />}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Column 3: Operations */}
          <div className="w-1/3 flex flex-col bg-slate-50/30">
            <div className="p-3 border-b border-slate-200 font-bold text-xs text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <CheckSquare size={14} /> {t.permColOps}
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {!selectedForm ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-300 gap-2">
                  <Eye size={32} />
                  <span className="text-xs">{t.permSelectForm}</span>
                </div>
              ) : (
                <div className="space-y-4 animate-in slide-in-from-start-4 duration-200">
                  <div className="bg-white p-4 rounded border border-slate-200 shadow-sm">
                    <h4 className="text-xs font-black text-slate-800 mb-3 border-b border-slate-100 pb-2">{selectedForm.name[isRtl ? 'fa' : 'en']}</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedForm.ops.map(op => (
                        <span key={op} className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded bg-green-50 text-green-700 border border-green-200 text-[11px] font-bold">
                          <CheckCircle2 size={10} /> {op}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

const UserManagement = ({ t, isRtl }) => {
  const [viewMode, setViewMode] = useState('list'); // 'list', 'form'
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  
  // Permissions Modal State
  const [permissionUser, setPermissionUser] = useState(null); // User object if modal is open, null otherwise

  // Mock Data: Persons
  const mockPersons = [
    { id: 1, name: 'محمد راد' },
    { id: 2, name: 'سارا تهرانی' },
    { id: 3, name: 'علی محمدی' },
    { id: 4, name: 'رضا قربانی' },
  ];

  // Mock Data: Users (Refactored: role -> userType)
  const [users, setUsers] = useState([
    { id: 1001, username: 'admin', personId: 4, personName: 'رضا قربانی', userType: 'admin', status: true, lastLogin: '1402/12/15 08:30' },
    { id: 1002, username: 'm.rad', personId: 1, personName: 'محمد راد', userType: 'user', status: true, lastLogin: '1402/12/14 14:20' },
    { id: 1003, username: 's.tehrani', personId: 2, personName: 'سارا تهرانی', userType: 'user', status: false, lastLogin: '1402/11/28 09:15' },
  ]);

  // Form State (Refactored: role -> userType)
  const [formData, setFormData] = useState({
    id: '',
    username: '',
    personId: '',
    userType: 'user',
    status: true,
    password: '',
    isPasswordChanged: false
  });

  const handleCreateNew = () => {
    const newId = Math.max(...users.map(u => u.id), 1000) + 1;
    setFormData({
      id: newId,
      username: '',
      personId: '',
      userType: 'user',
      status: true,
      password: '', 
      isPasswordChanged: false
    });
    setEditingUser(null);
    setViewMode('form');
  };

  const handleEdit = (user) => {
    setFormData({
      id: user.id,
      username: user.username,
      personId: user.personId,
      userType: user.userType,
      status: user.status,
      password: '', 
      isPasswordChanged: false
    });
    setEditingUser(user);
    setViewMode('form');
  };

  const handleSave = (e) => {
    e.preventDefault();
    const selectedPerson = mockPersons.find(p => p.id === parseInt(formData.personId));
    
    const userData = {
      ...formData,
      personName: selectedPerson ? selectedPerson.name : '-',
      lastLogin: editingUser ? editingUser.lastLogin : '-'
    };

    if (editingUser) {
      setUsers(users.map(u => u.id === userData.id ? userData : u));
    } else {
      setUsers([...users, userData]);
    }
    setViewMode('list');
  };

  const handleDelete = (id) => {
    if (window.confirm(t.confirmDelete)) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const resetPassword = () => {
    alert(t.passwordResetMsg);
    setFormData({...formData, password: 'DefaultPassword123!', isPasswordChanged: true});
  };

  // --- List View ---
  const renderList = () => (
    <div className="flex flex-col h-full bg-white animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-slate-200 shrink-0 bg-white">
        <h1 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Users size={20} className="text-blue-600"/>
          {t.usersListTitle}
        </h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <input 
              type="text" 
              placeholder={t.searchUserPlaceholder}
              className={`w-64 bg-slate-50 border border-slate-300 rounded-md py-1.5 ${isRtl ? 'pr-8 pl-3' : 'pl-8 pr-3'} text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search size={14} className={`absolute top-1/2 -translate-y-1/2 ${isRtl ? 'right-2.5' : 'left-2.5'} text-slate-400`} />
          </div>
          <button 
            onClick={handleCreateNew}
            className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-1.5 rounded-md font-bold text-xs hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus size={16} /> {t.createNewUser}
          </button>
        </div>
      </div>

      {/* Table Area */}
      <div className="flex-1 overflow-auto bg-white">
        <table className="w-full text-xs text-left border-collapse">
          <thead className="bg-slate-100 text-slate-600 font-bold border-b border-slate-300 sticky top-0 z-10 shadow-sm">
            <tr>
              <th className={`px-4 py-3 w-20 text-center border-${isRtl ? 'l' : 'r'} border-slate-200`}>{t.colId}</th>
              <th className={`px-4 py-3 border-${isRtl ? 'l' : 'r'} border-slate-200 text-${isRtl ? 'right' : 'left'}`}>{t.colUsername}</th>
              <th className={`px-4 py-3 border-${isRtl ? 'l' : 'r'} border-slate-200 text-${isRtl ? 'right' : 'left'}`}>{t.colLinkedPerson}</th>
              <th className={`px-4 py-3 border-${isRtl ? 'l' : 'r'} border-slate-200 text-${isRtl ? 'right' : 'left'}`}>{t.colUserType}</th>
              <th className={`px-4 py-3 w-32 text-center border-${isRtl ? 'l' : 'r'} border-slate-200`}>{t.colStatus}</th>
              <th className="px-4 py-3 w-32 text-center">{t.colActions}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {users.map((user, index) => (
              <tr key={user.id} className={`hover:bg-blue-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}>
                <td className={`px-4 py-2 text-center font-mono text-slate-500 border-${isRtl ? 'l' : 'r'} border-slate-100`}>{user.id}</td>
                <td className={`px-4 py-2 font-bold text-slate-700 border-${isRtl ? 'l' : 'r'} border-slate-100 text-${isRtl ? 'right' : 'left'}`}>{user.username}</td>
                <td className={`px-4 py-2 text-slate-600 border-${isRtl ? 'l' : 'r'} border-slate-100 text-${isRtl ? 'right' : 'left'}`}>{user.personName}</td>
                <td className={`px-4 py-2 border-${isRtl ? 'l' : 'r'} border-slate-100 text-${isRtl ? 'right' : 'left'}`}>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${user.userType === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                    {user.userType === 'admin' ? t.roleAdmin : t.roleUser}
                  </span>
                </td>
                <td className={`px-4 py-2 text-center border-${isRtl ? 'l' : 'r'} border-slate-100`}>
                  {user.status ? (
                    <span className="inline-flex items-center gap-1 text-green-600 font-bold text-[10px]"><CheckCircle2 size={12}/> {t.active}</span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-slate-400 font-bold text-[10px]"><XCircle size={12}/> {t.inactive}</span>
                  )}
                </td>
                <td className="px-4 py-2 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <button 
                      onClick={() => setPermissionUser(user)} 
                      title={t.viewPermissions} 
                      className="p-1.5 text-slate-500 hover:bg-slate-100 hover:text-purple-600 rounded transition-colors"
                    >
                      <Shield size={14} />
                    </button>
                    <div className="w-px h-3 bg-slate-300 mx-1"></div>
                    <button onClick={() => handleEdit(user)} title={t.edit} className="p-1.5 text-blue-600 hover:bg-blue-100 rounded transition-colors">
                      <Edit size={14} />
                    </button>
                    <button onClick={() => handleDelete(user.id)} title={t.delete} className="p-1.5 text-red-500 hover:bg-red-100 rounded transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Footer */}
      <div className="px-4 py-2 border-t border-slate-200 bg-slate-50 text-[10px] text-slate-500 font-medium">
         {users.length} {t.recordsFound}
      </div>
    </div>
  );

  // --- Form View ---
  const renderForm = () => (
    <div className="flex flex-col h-full bg-white animate-in zoom-in-95 duration-200">
      
      {/* Action Bar */}
      <div className="bg-white border-b border-slate-300 px-6 py-3 flex items-center justify-between shrink-0 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setViewMode('list')}
            className="p-1.5 hover:bg-slate-100 rounded text-slate-500 transition-colors"
          >
            {isRtl ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
          <div>
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              {editingUser ? <Edit size={16} className="text-blue-600"/> : <Plus size={16} className="text-blue-600"/>}
              {editingUser ? t.editUserTitle : t.newUserTitle}
            </h2>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            type="button"
            onClick={() => setViewMode('list')}
            className="px-4 py-1.5 border border-slate-300 bg-white text-slate-600 rounded text-xs font-bold hover:bg-slate-50 transition-colors"
          >
            {t.cancel}
          </button>
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-1.5 bg-blue-600 text-white rounded text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Save size={14} /> {t.saveChanges}
          </button>
        </div>
      </div>

      {/* Main Form Content */}
      <div className="flex-1 overflow-y-auto">
        <form className="p-8 max-w-7xl mx-auto">
            
            <div className="mb-8">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2 flex items-center gap-2">
                <User size={14} />
                {t.gl_base_info || 'User Information'}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* 1. ID */}
                <div className="bg-slate-50 p-3 border border-slate-200">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">{t.fieldId}</label>
                  <div className="font-mono text-sm font-bold text-slate-700">{formData.id}</div>
                </div>

                {/* 2. Status */}
                <div className="bg-slate-50 p-3 border border-slate-200 flex flex-col justify-center">
                   <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">{t.fieldStatus}</label>
                   <div className="flex items-center gap-3">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer"
                          checked={formData.status}
                          onChange={(e) => setFormData({...formData, status: e.target.checked})}
                        />
                        <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
                      </label>
                      <span className={`text-xs font-bold ${formData.status ? 'text-green-600' : 'text-slate-400'}`}>
                        {formData.status ? t.active : t.inactive}
                      </span>
                   </div>
                </div>

                {/* 3. Username */}
                <div className="lg:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1.5">{t.fieldUsername} <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    className="w-full bg-white border border-slate-300 rounded-none border-b-2 px-3 py-2 text-xs focus:border-blue-500 focus:ring-0 outline-none transition-colors"
                    placeholder="e.g. j.doe"
                  />
                </div>

                {/* 4. User Type (Changed from Role) */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1.5">{t.fieldUserType} <span className="text-red-500">*</span></label>
                  <select 
                    value={formData.userType}
                    onChange={(e) => setFormData({...formData, userType: e.target.value})}
                    className="w-full bg-white border border-slate-300 rounded-none border-b-2 px-3 py-2 text-xs focus:border-blue-500 focus:ring-0 outline-none transition-colors"
                  >
                    <option value="user">{t.roleUser}</option>
                    <option value="admin">{t.roleAdmin}</option>
                  </select>
                </div>

                {/* 5. Linked Person */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1.5">{t.fieldLinkedPerson} <span className="text-red-500">*</span></label>
                  <div className="flex items-center gap-2">
                    <select 
                      value={formData.personId}
                      onChange={(e) => setFormData({...formData, personId: e.target.value})}
                      required
                      className="flex-1 bg-white border border-slate-300 rounded-none border-b-2 px-3 py-2 text-xs focus:border-blue-500 focus:ring-0 outline-none transition-colors"
                    >
                      <option value="">{t.selectPersonPlaceholder}</option>
                      {mockPersons.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                    <div className="text-slate-400" title={t.linkedPersonHelp}><Info size={16} /></div>
                  </div>
                </div>

                {/* 6. Password & Reset */}
                <div className="lg:col-span-2">
                   <label className="block text-[11px] font-bold text-slate-700 mb-1.5">{t.fieldPassword}</label>
                   <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <Lock size={14} className={`absolute top-1/2 -translate-y-1/2 ${isRtl ? 'right-3' : 'left-3'} text-slate-400`} />
                        <input 
                          type="password"
                          value={formData.password}
                          onChange={(e) => setFormData({...formData, password: e.target.value})}
                          placeholder={editingUser ? "••••••••" : t.enterPassword}
                          className={`w-full bg-white border border-slate-300 rounded-none px-3 py-2 ${isRtl ? 'pr-9' : 'pl-9'} text-xs focus:border-blue-500 focus:ring-1 outline-none`}
                        />
                      </div>
                      <button 
                        type="button"
                        onClick={resetPassword}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-orange-200 text-orange-700 text-xs font-bold hover:bg-orange-50 transition-colors shadow-sm whitespace-nowrap"
                      >
                        <RefreshCw size={14} /> {t.resetDefault}
                      </button>
                   </div>
                </div>

              </div>
            </div>

        </form>
      </div>

      {/* Permissions Modal Overlay */}
      {permissionUser && (
        <PermissionsModal 
          user={permissionUser} 
          onClose={() => setPermissionUser(null)} 
          t={t} 
          isRtl={isRtl} 
        />
      )}
    </div>
  );

  return viewMode === 'list' ? renderList() : renderForm();
};

window.UserManagement = UserManagement;
