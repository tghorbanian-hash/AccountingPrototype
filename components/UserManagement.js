/* Filename: components/UserManagement.js
   Style: Pro-Grid Implementation (Clean, Dense, Modern)
*/

import React, { useState, useEffect } from 'react';
import { 
  Search, Plus, Edit, Trash2, Shield, X, User, 
  Save, Lock, RefreshCw, Users, Settings, ChevronDown, Filter,
  MoreHorizontal, FileText, Download
} from 'lucide-react';

// --- MOCK DATA ---
const UserManagement = ({ t, isRtl }) => {
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'form'
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  
  // Data
  const [users, setUsers] = useState([
    { id: 1001, username: 'admin', personId: 4, personName: 'رضا قربانی', userType: 'admin', status: true, lastLogin: '1402/12/20 10:00' },
    { id: 1002, username: 'm.rad', personId: 1, personName: 'محمد راد', userType: 'user', status: true, lastLogin: '1402/12/19 14:30' },
    { id: 1003, username: 's.tehrani', personId: 2, personName: 'سارا تهرانی', userType: 'user', status: false, lastLogin: '1402/11/05 09:15' },
    { id: 1004, username: 'a.mohammadi', personId: 3, personName: 'علی محمدی', userType: 'user', status: true, lastLogin: '1402/12/18 16:45' },
    { id: 1005, username: 'k.yaghoubi', personId: 5, personName: 'کاوه یعقوبی', userType: 'user', status: true, lastLogin: '-' },
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

  // --- List View (The Pro Layout) ---
  const renderList = () => (
    <div className="flex h-full bg-white">
      
      {/* Sidebar / Filter Panel (Optional but adds 'App' feel) */}
      <div className={`w-64 border-${isRtl ? 'l' : 'r'} border-zinc-200 bg-zinc-50 flex flex-col shrink-0`}>
         <div className="p-4 border-b border-zinc-200">
            <h2 className="font-semibold text-sm text-zinc-900 flex items-center gap-2">
               <Filter size={16} /> {t.filters || 'Filters'}
            </h2>
         </div>
         <div className="p-4 space-y-4">
             <window.UI.SelectField label={t.colUserType} isRtl={isRtl}>
                <option value="">All Roles</option>
                <option value="admin">{t.roleAdmin}</option>
                <option value="user">{t.roleUser}</option>
             </window.UI.SelectField>
             <window.UI.SelectField label={t.colStatus} isRtl={isRtl}>
                <option value="">All Status</option>
                <option value="active">{t.active}</option>
                <option value="inactive">{t.inactive}</option>
             </window.UI.SelectField>
         </div>
         <div className="mt-auto p-4 border-t border-zinc-200">
             <div className="text-[11px] text-zinc-400 text-center">
                System v2.5.0 (Pro)
             </div>
         </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
         
         {/* 1. Top Toolbar (Clean) */}
         <div className="h-16 border-b border-zinc-200 flex items-center justify-between px-6 bg-white shrink-0">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Users size={18} />
               </div>
               <div>
                  <h1 className="text-base font-bold text-zinc-900 leading-tight">{t.usersListTitle}</h1>
                  <p className="text-[11px] text-zinc-500 font-medium">{users.length} Records</p>
               </div>
            </div>
            
            <div className="flex items-center gap-3">
               <div className="relative group">
                  <Search size={16} className={`absolute top-2.5 text-zinc-400 ${isRtl ? 'right-3' : 'left-3'}`} />
                  <input 
                    className={`
                      h-9 w-64 bg-zinc-50 border border-zinc-200 rounded-md text-[13px] 
                      ${isRtl ? 'pr-9 pl-3' : 'pl-9 pr-3'} outline-none focus:bg-white focus:border-blue-500 transition-all
                    `}
                    placeholder={t.searchUserPlaceholder}
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
               </div>
               <div className="h-6 w-px bg-zinc-200 mx-1"></div>
               <window.UI.Button onClick={handleCreateNew} icon={Plus} variant="primary">
                  {t.createNewUser}
               </window.UI.Button>
            </div>
         </div>

         {/* 2. The Grid (Data Table) */}
         <div className="flex-1 overflow-auto bg-white">
            <table className="w-full text-left border-collapse">
               <thead className="bg-white sticky top-0 z-10 shadow-[0_1px_0_rgba(0,0,0,0.05)]">
                  <tr>
                     <th className={`px-6 py-3 border-b border-zinc-200 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider ${isRtl ? 'text-right' : 'text-left'}`}>{t.colId}</th>
                     <th className={`px-6 py-3 border-b border-zinc-200 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider ${isRtl ? 'text-right' : 'text-left'}`}>{t.colUsername}</th>
                     <th className={`px-6 py-3 border-b border-zinc-200 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider ${isRtl ? 'text-right' : 'text-left'}`}>{t.colLinkedPerson}</th>
                     <th className={`px-6 py-3 border-b border-zinc-200 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider ${isRtl ? 'text-right' : 'text-left'}`}>{t.colUserType}</th>
                     <th className="px-6 py-3 border-b border-zinc-200 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider w-32 text-center">{t.colStatus}</th>
                     <th className="px-6 py-3 border-b border-zinc-200 w-24"></th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-zinc-100">
                  {users.map((user) => (
                     <tr key={user.id} className="group hover:bg-zinc-50/80 transition-colors">
                        <td className="px-6 py-2.5 text-[13px] font-mono text-zinc-500">{user.id}</td>
                        <td className="px-6 py-2.5">
                           <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-zinc-200 flex items-center justify-center text-[10px] font-bold text-zinc-600">
                                 {user.username.charAt(0).toUpperCase()}
                              </div>
                              <span className="text-[13px] font-medium text-zinc-900">{user.username}</span>
                           </div>
                        </td>
                        <td className="px-6 py-2.5 text-[13px] text-zinc-600">{user.personName}</td>
                        <td className="px-6 py-2.5">
                           <window.UI.Badge variant={user.userType === 'admin' ? 'purple' : 'neutral'} style="dot">
                              {user.userType === 'admin' ? t.roleAdmin : t.roleUser}
                           </window.UI.Badge>
                        </td>
                        <td className="px-6 py-2.5 text-center">
                           <window.UI.Badge variant={user.status ? 'success' : 'danger'}>
                              {user.status ? 'ACTIVE' : 'INACTIVE'}
                           </window.UI.Badge>
                        </td>
                        <td className="px-6 py-2.5 text-right">
                           <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <window.UI.IconButton onClick={() => handleEdit(user)} icon={Edit} />
                              <window.UI.IconButton onClick={() => {}} icon={Trash2} color="danger" />
                           </div>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>

         {/* 3. Footer / Status Bar */}
         <div className="h-10 border-t border-zinc-200 bg-zinc-50 flex items-center justify-between px-6 shrink-0">
            <span className="text-[11px] text-zinc-400">Selected: 0</span>
            <div className="flex gap-2">
               <button className="text-[11px] text-zinc-500 hover:text-zinc-900 font-medium">Previous</button>
               <span className="text-[11px] text-zinc-300">|</span>
               <button className="text-[11px] text-zinc-500 hover:text-zinc-900 font-medium">Next</button>
            </div>
         </div>

      </div>
    </div>
  );

  // --- Form View (Pro Overlay) ---
  const renderForm = () => (
    <div className="flex items-center justify-center h-full bg-zinc-100/50 p-6">
       <window.UI.Card 
          className="w-full max-w-2xl shadow-xl border-zinc-300" 
          title={editingUser ? t.editUserTitle : t.newUserTitle}
          headerAction={
             <window.UI.IconButton icon={X} onClick={() => setViewMode('list')} />
          }
          footer={
             <div className="flex justify-end gap-2">
                <window.UI.Button variant="secondary" onClick={() => setViewMode('list')}>{t.cancel}</window.UI.Button>
                <window.UI.Button variant="primary" icon={Save}>{t.saveChanges}</window.UI.Button>
             </div>
          }
       >
          <div className="grid grid-cols-2 gap-6">
             {/* Left Column */}
             <div className="space-y-4">
                <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wide border-b border-zinc-100 pb-2">Account Details</h4>
                <window.UI.InputField 
                   label={t.fieldUsername} 
                   value={formData.username} 
                   icon={User}
                   isRtl={isRtl} 
                />
                <window.UI.SelectField label={t.fieldUserType} isRtl={isRtl}>
                   <option value="user">{t.roleUser}</option>
                   <option value="admin">{t.roleAdmin}</option>
                </window.UI.SelectField>
             </div>

             {/* Right Column */}
             <div className="space-y-4">
                <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wide border-b border-zinc-100 pb-2">Security</h4>
                <div className="bg-zinc-50 p-3 rounded-md border border-zinc-200">
                   <window.UI.InputField 
                      label={t.fieldPassword} 
                      type="password" 
                      placeholder="••••••••" 
                      icon={Lock}
                      isRtl={isRtl} 
                      className="mb-2"
                   />
                   <window.UI.Button variant="secondary" className="w-full h-7 text-xs" icon={RefreshCw}>Generate Random</window.UI.Button>
                </div>
                
                <div className="flex items-center justify-between pt-2">
                   <span className="text-[13px] font-medium text-zinc-700">Account Status</span>
                   <window.UI.Toggle 
                      checked={formData.status} 
                      onChange={() => {}} 
                      labelActive="Active" 
                      labelInactive="Blocked" 
                   />
                </div>
             </div>
          </div>
       </window.UI.Card>
    </div>
  );

  return viewMode === 'list' ? renderList() : renderForm();
};

window.UserManagement = UserManagement;
