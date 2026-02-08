/* Filename: components/UserManagement.js */
import React, { useState } from 'react';
import { 
  Plus, Edit, Trash2, Search, Filter, Save, X, 
  Shield, RefreshCw, Lock, User
} from 'lucide-react';

const UserManagement = ({ t, isRtl }) => {
  // FIX: Destructure window.UI inside the component to ensure it's loaded
  const UI = window.UI || {};
  const { 
    Button, InputField, SelectField, Toggle, Badge, 
    DataGrid, Modal
  } = UI;

  // Safeguard: If UI components aren't ready, return null or loader
  if (!Button || !InputField) {
    return <div className="p-4 text-center text-slate-500">Loading User Management Module...</div>;
  }

  const [viewMode, setViewMode] = useState('list'); // 'list'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  
  // --- MOCK DATA ---
  const [users, setUsers] = useState([
    { id: 1001, username: 'admin', personName: 'رضا قربانی', userType: 'admin', status: true, lastLogin: '1402/12/20' },
    { id: 1002, username: 'm.rad', personName: 'محمد راد', userType: 'user', status: true, lastLogin: '1402/12/19' },
    { id: 1003, username: 's.tehrani', personName: 'سارا تهرانی', userType: 'user', status: false, lastLogin: '1402/11/05' },
    { id: 1004, username: 'a.mohammadi', personName: 'علی محمدی', userType: 'user', status: true, lastLogin: '1402/12/18' },
    { id: 1005, username: 'k.yaghoubi', personName: 'کاوه یعقوبی', userType: 'user', status: true, lastLogin: '-' },
  ]);

  const [formData, setFormData] = useState({ id: '', username: '', userType: 'user', status: true });

  // --- Handlers ---
  const handleCreateNew = () => {
    setFormData({ id: 'NEW', username: '', userType: 'user', status: true });
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleEdit = (user) => {
    setFormData(user);
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleSelectAll = (checked) => {
    if (checked) setSelectedRows(users.map(u => u.id));
    else setSelectedRows([]);
  };

  const handleSelectRow = (id, checked) => {
    if (checked) setSelectedRows(prev => [...prev, id]);
    else setSelectedRows(prev => prev.filter(r => r !== id));
  };

  // --- Column Definitions for DataGrid ---
  const columns = [
    { header: t.colId || 'ID', field: 'id', width: 'w-20' },
    { header: t.colUsername || 'Username', field: 'username', width: 'w-40', sortable: true },
    { header: t.colLinkedPerson || 'Person', field: 'personName', width: 'w-auto' },
    { 
      header: t.colUserType || 'UserType', 
      width: 'w-32',
      render: (row) => (
        <Badge variant={row.userType === 'admin' ? 'purple' : 'neutral'}>
          {row.userType === 'admin' ? t.roleAdmin : t.roleUser}
        </Badge>
      )
    },
    { 
      header: t.colStatus || 'Status', 
      width: 'w-24 text-center',
      render: (row) => (
        <Badge variant={row.status ? 'success' : 'danger'}>
           {row.status ? 'ACTIVE' : 'INACTIVE'}
        </Badge>
      )
    },
    { header: 'Last Login', field: 'lastLogin', width: 'w-32' }
  ];

  // --- Render ---
  return (
    <div className="flex flex-col h-full space-y-4">
      
      {/* 1. Action Bar */}
      <div className="flex items-center justify-between bg-white p-3 rounded border border-slate-300 shadow-sm shrink-0">
         <div className="flex items-center gap-3">
            <h1 className="text-sm font-bold text-slate-800 flex items-center gap-2">
               <Shield size={16} className="text-indigo-600"/>
               {t.usersListTitle}
            </h1>
            <div className="h-4 w-px bg-slate-300"></div>
            <div className="flex items-center gap-2">
               <InputField 
                  placeholder={t.searchUserPlaceholder} 
                  icon={Search} 
                  isRtl={isRtl} 
                  className="w-64"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
               />
            </div>
         </div>
         <div className="flex items-center gap-2">
            <Button variant="danger" icon={Trash2} disabled={selectedRows.length === 0}>Delete</Button>
            <Button variant="primary" icon={Plus} onClick={handleCreateNew}>{t.createNewUser}</Button>
         </div>
      </div>

      {/* 2. Data Grid */}
      <div className="flex-1 overflow-hidden">
         <DataGrid 
            columns={columns}
            data={users.filter(u => u.username.toLowerCase().includes(searchTerm.toLowerCase()))}
            isRtl={isRtl}
            selectedIds={selectedRows}
            onSelectAll={handleSelectAll}
            onSelectRow={handleSelectRow}
            actions={(row) => (
               <div className="flex justify-center gap-1">
                 <Button variant="ghost" size="icon" icon={Edit} onClick={() => handleEdit(row)} />
               </div>
            )}
         />
      </div>

      {/* 3. Create/Edit Modal */}
      <Modal
         isOpen={isModalOpen}
         onClose={() => setIsModalOpen(false)}
         title={editingUser ? t.editUserTitle : t.newUserTitle}
         size="md"
         footer={
            <>
               <Button variant="secondary" onClick={() => setIsModalOpen(false)}>{t.cancel}</Button>
               <Button variant="primary" icon={Save}>{t.saveChanges}</Button>
            </>
         }
      >
         <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
               <InputField 
                  label={t.fieldUsername} 
                  value={formData.username} 
                  icon={User}
                  isRtl={isRtl} 
               />
               <SelectField label={t.fieldUserType} isRtl={isRtl}>
                   <option value="user">{t.roleUser}</option>
                   <option value="admin">{t.roleAdmin}</option>
               </SelectField>
            </div>
            
            <div className="bg-slate-50 p-3 rounded border border-slate-200">
               <h4 className="text-[11px] font-bold text-slate-500 uppercase mb-3 border-b border-slate-200 pb-1">Security</h4>
               <div className="flex items-end gap-2">
                  <InputField 
                     label={t.fieldPassword} 
                     type="password" 
                     placeholder="••••••••" 
                     icon={Lock}
                     isRtl={isRtl} 
                     className="flex-1"
                  />
                  <Button variant="secondary" icon={RefreshCw}>Gen</Button>
               </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
               <span className="text-[12px] font-medium text-slate-700">Account Status</span>
               <Toggle 
                  checked={formData.status} 
                  onChange={(val) => setFormData({...formData, status: val})} 
                  label={formData.status ? "Active Account" : "Blocked"} 
               />
            </div>
         </div>
      </Modal>

    </div>
  );
};

window.UserManagement = UserManagement;
