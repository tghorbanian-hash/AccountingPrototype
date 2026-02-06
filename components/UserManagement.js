/* Filename: components/UserManagement.js
   Style: Enterprise Compact Implementation
*/

import React, { useState, useEffect } from 'react';
import { 
  Search, Plus, Edit, Trash2, Shield, X, User, 
  Save, Lock, RefreshCw, Users, Settings, ChevronDown
} from 'lucide-react';

// --- MOCK DATA (Simplified for brevity, assumes same logic) ---
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
    { id: 1005, username: 'k.yaghoubi', personId: 5, personName: 'کاوه یعقوبی', userType: 'user', status: true },
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

  // --- List View (Compact Grid) ---
  const renderList = () => (
    <div className="flex flex-col h-full p-2 gap-2 bg-slate-100 text-xs">
      
      {/* Toolbar */}
      <window.UI.Card className="!p-2 flex-row items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
           <h1 className="text-sm font-bold text-slate-800 uppercase px-2 border-r border-slate-300">
             {t.usersListTitle}
           </h1>
           <span className="text-[10px] text-slate-500 font-mono">
             Total: {users.length}
           </span>
        </div>
        <div className="flex items-center gap-2">
           <div className="flex items-center bg-white border border-slate-400 px-2 h-8 w-64">
              <Search size={14} className="text-slate-400"/>
              <input 
                className="w-full h-full outline-none text-xs px-2"
                placeholder={t.searchUserPlaceholder}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
           </div>
           <window.UI.Button onClick={handleCreateNew} icon={Plus} variant="primary">
             {t.createNewUser}
           </window.UI.Button>
        </div>
      </window.UI.Card>

      {/* Grid / Table */}
      <div className="flex-1 bg-white border border-slate-400 overflow-auto shadow-sm flex flex-col">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-200 sticky top-0 z-10">
              <tr>
                <th className="border border-slate-400 px-2 py-1.5 w-16 text-center text-slate-700 font-bold">{t.colId}</th>
                <th className={`border border-slate-400 px-2 py-1.5 text-${isRtl ? 'right' : 'left'} text-slate-700 font-bold`}>{t.colUsername}</th>
                <th className={`border border-slate-400 px-2 py-1.5 text-${isRtl ? 'right' : 'left'} text-slate-700 font-bold`}>{t.colLinkedPerson}</th>
                <th className={`border border-slate-400 px-2 py-1.5 text-${isRtl ? 'right' : 'left'} text-slate-700 font-bold w-32`}>{t.colUserType}</th>
                <th className="border border-slate-400 px-2 py-1.5 w-24 text-center text-slate-700 font-bold">{t.colStatus}</th>
                <th className="border border-slate-400 px-2 py-1.5 w-32 text-center text-slate-700 font-bold">{t.colActions}</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, idx) => (
                <tr key={user.id} className={`hover:bg-blue-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}>
                  <td className="border border-slate-300 px-2 py-1 text-center font-mono text-slate-600">{user.id}</td>
                  <td className="border border-slate-300 px-2 py-1 font-bold text-slate-900">{user.username}</td>
                  <td className="border border-slate-300 px-2 py-1 text-slate-800">{user.personName}</td>
                  <td className="border border-slate-300 px-2 py-1">
                     {user.userType === 'admin' ? 
                       <span className="font-bold text-purple-700">{t.roleAdmin}</span> : 
                       <span className="text-slate-600">{t.roleUser}</span>
                     }
                  </td>
                  <td className="border border-slate-300 px-2 py-1 text-center">
                     {user.status ? 
                       <span className="text-green-700 font-bold text-[10px] uppercase">ACTIVE</span> : 
                       <span className="text-red-700 font-bold text-[10px] uppercase">INACTIVE</span>
                     }
                  </td>
                  <td className="border border-slate-300 px-1 py-1 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <window.UI.IconButton onClick={() => handleEdit(user)} icon={Edit} title={t.edit} />
                      <window.UI.IconButton onClick={() => {}} icon={Shield} color="purple" title={t.viewPermissions} />
                      <window.UI.IconButton onClick={() => {}} icon={Trash2} color="red" title={t.delete} />
                    </div>
                  </td>
                </tr>
              ))}
              {/* Empty rows filler to look like excel */}
              {[...Array(5)].map((_, i) => (
                 <tr key={`empty-${i}`}>
                    <td className="border border-slate-300 py-4"></td>
                    <td className="border border-slate-300"></td>
                    <td className="border border-slate-300"></td>
                    <td className="border border-slate-300"></td>
                    <td className="border border-slate-300"></td>
                    <td className="border border-slate-300"></td>
                 </tr>
              ))}
            </tbody>
          </table>
      </div>
    </div>
  );

  // --- Form View (Compact) ---
  const renderForm = () => (
    <div className="flex flex-col h-full p-4 justify-center bg-slate-100">
      <window.UI.Card 
        className="max-w-3xl w-full mx-auto shadow-md"
        title={editingUser ? `EDIT RECORD: ${editingUser.id}` : 'NEW RECORD ENTRY'}
        headerAction={
            <window.UI.IconButton icon={X} onClick={() => setViewMode('list')} color="red" />
        }
      >
        <div className="grid grid-cols-2 gap-4">
            {/* Field Set 1 */}
            <fieldset className="border border-slate-300 p-3 pt-1 relative col-span-2 md:col-span-1">
               <legend className="text-[10px] font-bold text-blue-700 px-1 uppercase">General Information</legend>
               <div className="space-y-3 mt-2">
                 <window.UI.InputField label={t.fieldUsername} value={formData.username} isRtl={isRtl} />
                 <window.UI.SelectField label={t.fieldUserType} isRtl={isRtl}>
                    <option value="user">{t.roleUser}</option>
                    <option value="admin">{t.roleAdmin}</option>
                 </window.UI.SelectField>
               </div>
            </fieldset>

            {/* Field Set 2 */}
            <fieldset className="border border-slate-300 p-3 pt-1 relative col-span-2 md:col-span-1">
               <legend className="text-[10px] font-bold text-blue-700 px-1 uppercase">Security & Status</legend>
               <div className="space-y-3 mt-2">
                 <div className="flex items-end gap-2">
                    <window.UI.InputField label="Password Reset" type="password" placeholder="New Password" isRtl={isRtl} />
                    <window.UI.Button variant="secondary" icon={RefreshCw}>Gen</window.UI.Button>
                 </div>
                 <div className="pt-4">
                    <window.UI.Toggle 
                        checked={formData.status} 
                        onChange={() => {}} 
                        labelActive="ACCOUNT ACTIVE" 
                        labelInactive="ACCOUNT LOCKED" 
                    />
                 </div>
               </div>
            </fieldset>
        </div>

        {/* Footer Actions */}
        <div className="mt-4 pt-3 border-t border-slate-200 flex justify-end gap-2 bg-slate-50 -m-3 p-3">
             <window.UI.Button variant="ghost" onClick={() => setViewMode('list')}>{t.cancel}</window.UI.Button>
             <window.UI.Button variant="primary" icon={Save}>{t.saveChanges}</window.UI.Button>
        </div>

      </window.UI.Card>
    </div>
  );

  return viewMode === 'list' ? renderList() : renderForm();
};

window.UserManagement = UserManagement;
