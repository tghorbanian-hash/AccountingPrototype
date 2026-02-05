import React, { useState, useEffect } from 'react';
import { 
  Search, Plus, Filter, Edit, Trash2, Shield, Key, 
  CheckCircle2, XCircle, ChevronLeft, ChevronRight, User, 
  Save, X, MoreHorizontal, Lock, RefreshCw, Users
} from 'lucide-react';

const UserManagement = ({ t, isRtl }) => {
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'form'
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  
  // Mock Data: Persons (Entities defined in the system)
  const mockPersons = [
    { id: 1, name: 'محمد راد' },
    { id: 2, name: 'سارا تهرانی' },
    { id: 3, name: 'علی محمدی' },
    { id: 4, name: 'رضا قربانی' },
  ];

  // Mock Data: Users
  const [users, setUsers] = useState([
    { id: 1001, username: 'admin', personId: 4, personName: 'رضا قربانی', role: 'admin', status: true, lastLogin: '1402/12/15 08:30' },
    { id: 1002, username: 'm.rad', personId: 1, personName: 'محمد راد', role: 'user', status: true, lastLogin: '1402/12/14 14:20' },
    { id: 1003, username: 's.tehrani', personId: 2, personName: 'سارا تهرانی', role: 'user', status: false, lastLogin: '1402/11/28 09:15' },
  ]);

  // Form State
  const [formData, setFormData] = useState({
    id: '',
    username: '',
    personId: '',
    role: 'user',
    status: true,
    password: '',
    isPasswordChanged: false
  });

  const handleCreateNew = () => {
    // Generate Auto ID (Mock logic)
    const newId = Math.max(...users.map(u => u.id), 1000) + 1;
    setFormData({
      id: newId,
      username: '',
      personId: '',
      role: 'user',
      status: true,
      password: '', // Empty means default or unset
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
      role: user.role,
      status: user.status,
      password: '', // Don't show actual password
      isPasswordChanged: false
    });
    setEditingUser(user);
    setViewMode('form');
  };

  const handleSave = (e) => {
    e.preventDefault();
    // Find person name for the list view
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

  // --- List View Component ---
  const renderList = () => (
    <div className="flex flex-col h-full animate-in fade-in duration-300">
      {/* Compact Header Bar */}
      <div className="flex items-center justify-between bg-white px-6 py-3 border-b border-slate-200 shrink-0">
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

      {/* ERP Style Table */}
      <div className="flex-1 overflow-auto bg-slate-50 p-4">
        <div className="bg-white border border-slate-300 rounded-lg shadow-sm overflow-hidden">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 text-slate-600 font-bold border-b border-slate-300">
              <tr>
                <th className={`px-4 py-2.5 w-20 text-center border-${isRtl ? 'l' : 'r'} border-slate-200`}>{t.colId}</th>
                <th className={`px-4 py-2.5 border-${isRtl ? 'l' : 'r'} border-slate-200 text-${isRtl ? 'right' : 'left'}`}>{t.colUsername}</th>
                <th className={`px-4 py-2.5 border-${isRtl ? 'l' : 'r'} border-slate-200 text-${isRtl ? 'right' : 'left'}`}>{t.colLinkedPerson}</th>
                <th className={`px-4 py-2.5 border-${isRtl ? 'l' : 'r'} border-slate-200 text-${isRtl ? 'right' : 'left'}`}>{t.colRole}</th>
                <th className={`px-4 py-2.5 w-32 text-center border-${isRtl ? 'l' : 'r'} border-slate-200`}>{t.colStatus}</th>
                <th className="px-4 py-2.5 w-24 text-center">{t.colActions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {users.map((user, index) => (
                <tr key={user.id} className={`hover:bg-blue-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                  <td className={`px-4 py-2 text-center font-mono text-slate-500 border-${isRtl ? 'l' : 'r'} border-slate-100`}>{user.id}</td>
                  <td className={`px-4 py-2 font-bold text-slate-700 border-${isRtl ? 'l' : 'r'} border-slate-100 text-${isRtl ? 'right' : 'left'}`}>{user.username}</td>
                  <td className={`px-4 py-2 text-slate-600 border-${isRtl ? 'l' : 'r'} border-slate-100 text-${isRtl ? 'right' : 'left'}`}>{user.personName}</td>
                  <td className={`px-4 py-2 border-${isRtl ? 'l' : 'r'} border-slate-100 text-${isRtl ? 'right' : 'left'}`}>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${user.role === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                      {user.role === 'admin' ? t.roleAdmin : t.roleUser}
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
        <div className="mt-2 text-[10px] text-slate-400 font-medium px-1">
           {users.length} {t.recordsFound}
        </div>
      </div>
    </div>
  );

  // --- Form View Component ---
  const renderForm = () => (
    <div className="flex flex-col h-full bg-slate-50 p-4 md:p-8 animate-in zoom-in-95 duration-200">
      <div className="max-w-4xl mx-auto w-full bg-white rounded-lg shadow-sm border border-slate-300 overflow-hidden flex flex-col">
        
        {/* Form Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200">
          <div>
            <h2 className="text-base font-bold text-slate-800">{editingUser ? t.editUserTitle : t.newUserTitle}</h2>
            <p className="text-xs text-slate-500 mt-0.5">{editingUser ? `${t.editingId}: ${formData.id}` : t.newUserSubtitle}</p>
          </div>
          <button onClick={() => setViewMode('list')} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          
          {/* Row 1: ID & Status */}
          <div className="md:col-span-2 flex items-center justify-between bg-blue-50/50 p-3 rounded border border-blue-100 mb-2">
             <div className="flex items-center gap-4">
                <div className="w-24">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">{t.fieldId}</label>
                  <input 
                    type="text" 
                    value={formData.id} 
                    disabled 
                    className="w-full bg-slate-200 border border-slate-300 rounded px-2 py-1 text-xs font-mono font-bold text-slate-600 text-center"
                  />
                </div>
                <div className="h-8 w-px bg-blue-200"></div>
                <div>
                   <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">{t.fieldStatus}</label>
                   <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.checked})}
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                    <span className={`ms-3 text-xs font-bold ${formData.status ? 'text-green-600' : 'text-slate-500'}`}>
                      {formData.status ? t.active : t.inactive}
                    </span>
                  </label>
                </div>
             </div>
          </div>

          {/* Row 2: Username & User Type */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1.5">{t.fieldUsername} <span className="text-red-500">*</span></label>
            <div className="relative">
              <User size={14} className={`absolute top-1/2 -translate-y-1/2 ${isRtl ? 'right-3' : 'left-3'} text-slate-400`} />
              <input 
                type="text" 
                required
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                className={`w-full bg-white border border-slate-300 rounded px-3 py-2 ${isRtl ? 'pr-9' : 'pl-9'} text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none`}
                placeholder="e.g. user.name"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1.5">{t.fieldRole} <span className="text-red-500">*</span></label>
            <select 
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
              className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            >
              <option value="user">{t.roleUser}</option>
              <option value="admin">{t.roleAdmin}</option>
            </select>
          </div>

          {/* Row 3: Linked Person */}
          <div className="md:col-span-2">
            <label className="block text-[11px] font-bold text-slate-700 mb-1.5">{t.fieldLinkedPerson} <span className="text-red-500">*</span></label>
            <div className="relative">
              <Users size={14} className={`absolute top-1/2 -translate-y-1/2 ${isRtl ? 'right-3' : 'left-3'} text-slate-400`} />
              <select 
                value={formData.personId}
                onChange={(e) => setFormData({...formData, personId: e.target.value})}
                required
                className={`w-full bg-white border border-slate-300 rounded px-3 py-2 ${isRtl ? 'pr-9' : 'pl-9'} text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none`}
              >
                <option value="">{t.selectPersonPlaceholder}</option>
                {mockPersons.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">{t.linkedPersonHelp}</p>
          </div>

          {/* Row 4: Password Management */}
          <div className="md:col-span-2 border-t border-slate-100 pt-4 mt-2">
            <label className="block text-[11px] font-bold text-slate-700 mb-2">{t.fieldPassword}</label>
            <div className="flex items-center gap-2">
               <div className="relative flex-1">
                 <Lock size={14} className={`absolute top-1/2 -translate-y-1/2 ${isRtl ? 'right-3' : 'left-3'} text-slate-400`} />
                 <input 
                   type="password"
                   value={formData.password}
                   onChange={(e) => setFormData({...formData, password: e.target.value})}
                   placeholder={editingUser ? "••••••••" : t.enterPassword}
                   className={`w-full bg-white border border-slate-300 rounded px-3 py-2 ${isRtl ? 'pr-9' : 'pl-9'} text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none`}
                 />
               </div>
               <button 
                 type="button"
                 onClick={resetPassword}
                 className="flex items-center gap-1.5 px-3 py-2 bg-orange-50 border border-orange-200 text-orange-700 rounded text-xs font-bold hover:bg-orange-100 transition-colors whitespace-nowrap"
               >
                 <RefreshCw size={12} /> {t.resetDefault}
               </button>
            </div>
          </div>

        </form>

        {/* Form Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3">
          <button 
            type="button"
            onClick={() => setViewMode('list')}
            className="px-4 py-2 bg-white border border-slate-300 rounded text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            {t.cancel}
          </button>
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Save size={14} /> {t.saveChanges}
          </button>
        </div>
      </div>
    </div>
  );

  return viewMode === 'list' ? renderList() : renderForm();
};

window.UserManagement = UserManagement;
