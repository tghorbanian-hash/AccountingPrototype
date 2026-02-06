/* Filename: components/UserManagement.js
   Style: Modern Minimal (Ant Design) Implementation
*/

import React, { useState, useEffect } from 'react';
import { 
  Search, Plus, Edit, Trash2, Shield, X, User, 
  Save, Lock, RefreshCw, Users, Settings, ChevronDown, Filter
} from 'lucide-react';

// --- MOCK DATA ---
const UserManagement = ({ t, isRtl }) => {
  const [viewMode, setViewMode] = useState('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  
  // Data
  const [users, setUsers] = useState([
    { id: 1001, username: 'admin', personId: 4, personName: 'رضا قربانی', userType: 'admin', status: true },
    { id: 1002, username: 'm.rad', personId: 1, personName: 'محمد راد', userType: 'user', status: true },
    { id: 1003, username: 's.tehrani', personId: 2, personName: 'سارا تهرانی', userType: 'user', status: false },
    { id: 1004, username: 'a.mohammadi', personId: 3, personName: 'علی محمدی', userType: 'user', status: true },
  ]);

  const [formData, setFormData] = useState({ id: '', username: '', userType: 'user', status: true });

  const handleCreateNew = () => {
    setFormData({ id: 'NEW', username: '', userType: 'user', status: true });
    setEditingUser(null);
    setViewMode('form');
  };

  const handleEdit = (user) => {
    setFormData(user);
    setEditingUser(user);
    setViewMode('form');
  };

  // --- List View (Modern Table) ---
  const renderList = () => (
    <div className="flex flex-col h-full p-6 gap-6 bg-[#f0f2f5]">
      
      {/* 1. Header & Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
         <div>
            <h1 className="text-2xl font-semibold text-gray-800 tracking-tight">{t.usersListTitle}</h1>
            <p className="text-gray-500 text-sm mt-1">{t.recordsFound} {users.length}</p>
         </div>
         <div className="flex items-center gap-3">
             <div className="relative">
                <input 
                  className="pl-9 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none w-64 transition-all"
                  placeholder={t.searchUserPlaceholder}
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
                <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
             </div>
             <window.UI.Button onClick={handleCreateNew} icon={Plus} variant="primary">
                {t.createNewUser}
             </window.UI.Button>
         </div>
      </div>

      {/* 2. Modern Card with Table */}
      <window.UI.Card className="flex-1 overflow-hidden flex flex-col !p-0 shadow-sm border border-gray-200" noPadding>
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t.colId}</th>
                  <th className={`px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-${isRtl ? 'right' : 'left'}`}>{t.colUsername}</th>
                  <th className={`px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-${isRtl ? 'right' : 'left'}`}>{t.colLinkedPerson}</th>
                  <th className={`px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-${isRtl ? 'right' : 'left'}`}>{t.colUserType}</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">{t.colStatus}</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">{t.colActions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-blue-50/40 transition-colors duration-150 group">
                    <td className="px-6 py-4 text-sm font-medium text-gray-400">{user.id}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.username}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.personName}</td>
                    <td className="px-6 py-4">
                      <window.UI.Badge variant={user.userType === 'admin' ? 'purple' : 'neutral'}>
                        {user.userType === 'admin' ? t.roleAdmin : t.roleUser}
                      </window.UI.Badge>
                    </td>
                    <td className="px-6 py-4 text-center">
                       <span className={`inline-block w-2.5 h-2.5 rounded-full ${user.status ? 'bg-green-500' : 'bg-red-400'}`}></span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <window.UI.Button variant="ghost" className="!px-2 !py-1" onClick={() => handleEdit(user)}>
                            <Edit size={16} className="text-blue-600"/>
                        </window.UI.Button>
                        <window.UI.Button variant="ghost" className="!px-2 !py-1" onClick={() => {}}>
                            <Trash2 size={16} className="text-red-500"/>
                        </window.UI.Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
         </div>
         {/* Footer / Pagination Placeholder */}
         <div className="px-6 py-4 border-t border-gray-100 bg-white flex items-center justify-between">
            <span className="text-xs text-gray-400">Showing 1 to {users.length} of {users.length} entries</span>
            <div className="flex gap-1">
                <button className="px-3 py-1 border border-gray-200 rounded text-xs text-gray-600 hover:bg-gray-50" disabled>Previous</button>
                <button className="px-3 py-1 border border-gray-200 rounded text-xs text-white bg-blue-600">1</button>
                <button className="px-3 py-1 border border-gray-200 rounded text-xs text-gray-600 hover:bg-gray-50" disabled>Next</button>
            </div>
         </div>
      </window.UI.Card>
    </div>
  );

  // --- Form View (Clean & Centered) ---
  const renderForm = () => (
    <div className="flex flex-col h-full p-6 justify-center bg-[#f0f2f5]">
      <div className="max-w-3xl w-full mx-auto">
          
          <div className="mb-6 flex items-center justify-between">
              <div>
                  <h2 className="text-xl font-bold text-gray-800">{editingUser ? t.editUserTitle : t.newUserTitle}</h2>
                  <p className="text-sm text-gray-500">Please fill in the information below.</p>
              </div>
              <window.UI.Button variant="secondary" onClick={() => setViewMode('list')} icon={X}>
                  {t.cancel}
              </window.UI.Button>
          </div>

          <window.UI.Card className="shadow-sm" noPadding>
            <div className="p-8 space-y-8">
                
                {/* Section 1 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <window.UI.InputField 
                        label={t.fieldUsername} 
                        value={formData.username} 
                        placeholder="e.g. j.doe"
                        isRtl={isRtl} 
                    />
                    <window.UI.SelectField label={t.fieldUserType} isRtl={isRtl}>
                        <option value="user">{t.roleUser}</option>
                        <option value="admin">{t.roleAdmin}</option>
                    </window.UI.SelectField>
                </div>

                {/* Section 2: Password & Status */}
                <div className="pt-6 border-t border-gray-100">
                    <div className="flex items-start gap-4 p-4 bg-blue-50/50 rounded-lg border border-blue-100">
                        <Lock className="text-blue-500 mt-1" size={20} />
                        <div className="flex-1">
                            <h4 className="font-semibold text-gray-800 text-sm mb-1">{t.fieldPassword}</h4>
                            <p className="text-xs text-gray-500 mb-3">Set a temporary password for the user.</p>
                            <div className="flex gap-2 max-w-sm">
                                <window.UI.InputField type="password" placeholder="••••••••" className="bg-white" isRtl={isRtl} />
                                <window.UI.Button variant="secondary" icon={RefreshCw}>Gen</window.UI.Button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                    <window.UI.Toggle 
                        checked={formData.status} 
                        onChange={() => {}} 
                        labelActive={t.active} 
                        labelInactive={t.inactive} 
                    />
                    
                    <div className="flex gap-3">
                        <window.UI.Button variant="ghost" onClick={() => setViewMode('list')}>{t.cancel}</window.UI.Button>
                        <window.UI.Button variant="primary" icon={Save}>{t.saveChanges}</window.UI.Button>
                    </div>
                </div>

            </div>
          </window.UI.Card>
      </div>
    </div>
  );

  return viewMode === 'list' ? renderList() : renderForm();
};

window.UserManagement = UserManagement;
