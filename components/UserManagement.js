import React, { useState } from 'react';
import { 
  Search, Plus, Filter, MoreVertical, Edit, Trash2, Shield, Key, 
  CheckCircle2, XCircle, ChevronLeft, ChevronRight, User, Mail, Lock
} from 'lucide-react';

const UserManagement = ({ t, isRtl }) => {
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'form'
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState(null);

  // Mock Data for Users
  const [users, setUsers] = useState([
    { id: 101, username: 'admin', fullName: 'System Administrator', email: 'admin@fincorp.com', role: 'Super Admin', status: 'active', lastLogin: '2024-03-05 08:30' },
    { id: 102, username: 'm.rad', fullName: 'Mohammad Rad', email: 'm.rad@fincorp.com', role: 'Financial Manager', status: 'active', lastLogin: '2024-03-04 14:20' },
    { id: 103, username: 's.tehrani', fullName: 'Sara Tehrani', email: 's.tehrani@fincorp.com', role: 'Accountant', status: 'inactive', lastLogin: '2024-02-28 09:15' },
  ]);

  const handleCreateNew = () => {
    setEditingUser(null);
    setViewMode('form');
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setViewMode('form');
  };

  const handleBack = () => {
    setViewMode('list');
    setEditingUser(null);
  };

  const handleDelete = (id) => {
    if (window.confirm(isRtl ? 'آیا از حذف این کاربر اطمینان دارید؟' : 'Are you sure you want to delete this user?')) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  // --- Render List View ---
  if (viewMode === 'list') {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Header & Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900">{t.usersListTitle}</h1>
            <p className="text-slate-500 mt-1 text-sm font-medium">{t.usersListSubtitle}</p>
          </div>
          <button 
            onClick={handleCreateNew}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all text-sm"
          >
            <Plus size={18} /> {t.createNewUser}
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white p-4 rounded-[1.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search size={18} className={`absolute top-1/2 -translate-y-1/2 ${isRtl ? 'right-4' : 'left-4'} text-slate-400`} />
            <input 
              type="text" 
              placeholder={t.searchUserPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full bg-slate-50 border border-slate-200 rounded-xl py-3 ${isRtl ? 'pr-12 pl-4' : 'pl-12 pr-4'} text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all`}
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <button className="flex items-center gap-2 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 font-bold text-xs hover:bg-slate-100 transition-all flex-1 md:flex-none justify-center">
              <Filter size={16} /> {t.filter}
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50/50 text-slate-500 font-bold uppercase tracking-wider text-xs border-b border-slate-100">
                <tr>
                  <th className={`px-6 py-5 text-${isRtl ? 'right' : 'left'}`}>#</th>
                  <th className={`px-6 py-5 text-${isRtl ? 'right' : 'left'}`}>{t.colUser}</th>
                  <th className={`px-6 py-5 text-${isRtl ? 'right' : 'left'}`}>{t.colFullName}</th>
                  <th className={`px-6 py-5 text-${isRtl ? 'right' : 'left'}`}>{t.colStatus}</th>
                  <th className="px-6 py-5 text-center">{t.colActions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className={`px-6 py-4 font-mono text-slate-400 text-${isRtl ? 'right' : 'left'}`}>{user.id}</td>
                    <td className={`px-6 py-4 text-${isRtl ? 'right' : 'left'}`}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
                          <User size={18} />
                        </div>
                        <div>
                          <div className="font-bold text-slate-800">{user.username}</div>
                          <div className="text-xs text-slate-400">{user.role}</div>
                        </div>
                      </div>
                    </td>
                    <td className={`px-6 py-4 font-medium text-slate-600 text-${isRtl ? 'right' : 'left'}`}>{user.fullName}</td>
                    <td className={`px-6 py-4 text-${isRtl ? 'right' : 'left'}`}>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${user.status === 'active' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                        {user.status === 'active' ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                        {user.status === 'active' ? t.statusActive : t.statusInactive}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                        <button title={t.resetPass} className="p-2 text-orange-500 hover:bg-orange-50 rounded-lg transition-colors">
                          <Key size={16} />
                        </button>
                        <button title={t.permissions} className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                          <Shield size={16} />
                        </button>
                        <div className="w-px h-4 bg-slate-200 mx-1"></div>
                        <button onClick={() => handleEdit(user)} title={t.edit} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleDelete(user.id)} title={t.delete} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Placeholder */}
          <div className="p-4 border-t border-slate-50 flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>{isRtl ? 'نمایش ۱ تا ۳ از ۳ کاربر' : 'Showing 1 to 3 of 3 users'}</span>
            <div className="flex gap-2">
              <button className="p-2 hover:bg-slate-50 rounded-lg disabled:opacity-50" disabled><ChevronRight size={16} /></button>
              <button className="p-2 hover:bg-slate-50 rounded-lg disabled:opacity-50" disabled><ChevronLeft size={16} /></button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- Render Form View ---
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-300">
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={handleBack}
          className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-500 transition-colors"
        >
          {isRtl ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
        <div>
          <h1 className="text-2xl font-black text-slate-900">
            {editingUser ? t.editUserTitle : t.newUserTitle}
          </h1>
          <p className="text-slate-500 text-sm font-medium">
            {editingUser ? `${t.editing}: ${editingUser.fullName}` : t.newUserSubtitle}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-8 space-y-8">
          
          {/* Placeholder content as requested */}
          <div className="text-center py-12 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
             <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <User size={32} />
             </div>
             <h3 className="text-lg font-bold text-slate-800">{t.formUnderDev}</h3>
             <p className="text-slate-400 text-sm mt-2 max-w-md mx-auto">{t.formUnderDevDesc}</p>
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t border-slate-50">
            <button 
              onClick={handleBack}
              className="px-6 py-3 rounded-xl font-bold text-sm text-slate-500 hover:bg-slate-50 transition-colors"
            >
              {t.cancel}
            </button>
            <button 
              className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all"
            >
              {t.saveChanges}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

window.UserManagement = UserManagement;
