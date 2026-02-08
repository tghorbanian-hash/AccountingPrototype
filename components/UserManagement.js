/* Filename: components/UserManagement.js */
import React, { useState } from 'react';
import { 
  Plus, Edit, Trash2, Search, Filter, Save, X, 
  Shield, RefreshCw, Lock, User, UserCheck, UserX, Key
} from 'lucide-react';

const UserManagement = ({ t, isRtl }) => {
  // 1. دریافت کامپوننت‌های استاندارد از دیزاین سیستم
  const UI = window.UI || {};
  const { 
    Button, InputField, SelectField, Toggle, Badge, 
    DataGrid, FilterSection, Modal, LOV 
  } = UI;

  // اگر کامپوننت‌ها لود نشده باشند
  if (!Button) return <div className="p-4 text-center">Loading UI...</div>;

  // --- STATES ---
  const [selectedRows, setSelectedRows] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [groupBy, setGroupBy] = useState([]); // امکان گروه‌بندی کاربران

  // --- MOCK DATA ---
  const [users, setUsers] = useState([
    { id: 1001, username: 'admin', fullName: 'رضا قربانی', userType: 'مدیر سیستم', dept: 'فناوری اطلاعات', status: true, lastLogin: '1402/12/20' },
    { id: 1002, username: 'm.rad', fullName: 'محمد راد', userType: 'کاربر عادی', dept: 'مالی', status: true, lastLogin: '1402/12/19' },
    { id: 1003, username: 's.tehrani', fullName: 'سارا تهرانی', userType: 'کاربر ارشد', dept: 'مالی', status: false, lastLogin: '1402/11/05' },
    { id: 1004, username: 'a.mohammadi', fullName: 'علی محمدی', userType: 'کاربر عادی', dept: 'فروش', status: true, lastLogin: '1402/12/18' },
    { id: 1005, username: 'k.yaghoubi', fullName: 'کاوه یعقوبی', userType: 'حسابدار', dept: 'مالی', status: true, lastLogin: '-' },
    { id: 1006, username: 'z.kamali', fullName: 'زهرا کمالی', userType: 'کاربر عادی', dept: 'منابع انسانی', status: true, lastLogin: '1402/12/01' },
  ]);

  const [formData, setFormData] = useState({ id: '', username: '', userType: 'user', status: true });

  // --- HANDLERS ---
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

  const handleDelete = (ids) => {
    if(confirm(`آیا از حذف ${ids.length} کاربر اطمینان دارید؟`)) {
      alert(`کاربران با شناسه ${ids.join(', ')} حذف شدند.`);
      setSelectedRows([]);
    }
  };

  const handleResetPassword = (user) => {
    alert(`لینک بازیابی رمز عبور برای ${user.username} ارسال شد.`);
  };

  // --- COLUMN DEFINITIONS ---
  const columns = [
    { header: 'شناسه', field: 'id', width: 'w-20', sortable: true },
    { header: 'نام کاربری', field: 'username', width: 'w-32', sortable: true },
    { header: 'نام و نام خانوادگی', field: 'fullName', width: 'w-40', sortable: true },
    { 
      header: 'نقش کاربری', 
      field: 'userType', 
      width: 'w-32',
      sortable: true,
      render: (row) => (
        <Badge variant={row.userType === 'مدیر سیستم' ? 'purple' : 'neutral'}>
          {row.userType}
        </Badge>
      )
    },
    { header: 'واحد سازمانی', field: 'dept', width: 'w-32', sortable: true },
    { 
      header: 'وضعیت', 
      field: 'status',
      width: 'w-24 text-center',
      render: (row) => (
        <Badge variant={row.status ? 'success' : 'danger'}>
           {row.status ? 'فعال' : 'غیرفعال'}
        </Badge>
      )
    },
    { header: 'آخرین ورود', field: 'lastLogin', width: 'w-32 text-center dir-ltr' }
  ];

  // --- RENDER ---
  return (
    <div className={`flex flex-col h-full bg-slate-50/50 p-4 overflow-hidden ${isRtl ? 'font-vazir' : 'font-sans'}`}>
      
      {/* 1. PAGE HEADER */}
      <div className="flex items-center justify-between mb-4 shrink-0">
         <div>
            <h1 className="text-xl font-black text-slate-800 flex items-center gap-2">
               <Shield className="text-indigo-600" size={24}/>
               مدیریت کاربران و دسترسی‌ها
            </h1>
            <p className="text-slate-500 text-xs mt-1 font-medium">تعریف کاربران جدید، مدیریت نقش‌ها و تنظیمات امنیتی</p>
         </div>
      </div>

      {/* 2. FILTER SECTION (Standardized) */}
      <FilterSection 
        title="جستجوی پیشرفته کاربران"
        onSearch={() => alert('جستجو انجام شد')} 
        onClear={() => alert('فیلترها پاک شد')}
        isRtl={isRtl}
      >
         <InputField label="نام کاربری" placeholder="جستجو..." isRtl={isRtl} icon={User} />
         <InputField label="نام شخص" placeholder="جستجو..." isRtl={isRtl} />
         <SelectField label="نقش کاربری" isRtl={isRtl}>
             <option>همه نقش‌ها</option>
             <option>مدیر سیستم</option>
             <option>کاربر عادی</option>
         </SelectField>
         <SelectField label="وضعیت" isRtl={isRtl}>
             <option>همه</option>
             <option>فعال</option>
             <option>غیرفعال</option>
         </SelectField>
      </FilterSection>

      {/* 3. DATA GRID (Standardized) */}
      <div className="flex-1 min-h-0">
         <DataGrid 
            title="لیست کاربران سیستم"
            columns={columns}
            data={users}
            isRtl={isRtl}
            
            // Standard Props
            selectedIds={selectedRows}
            onSelectAll={(checked) => setSelectedRows(checked ? users.map(u => u.id) : [])}
            onSelectRow={(id, checked) => setSelectedRows(prev => checked ? [...prev, id] : prev.filter(r => r !== id))}
            
            // Actions
            onCreate={handleCreateNew}
            onDelete={handleDelete}
            onDoubleClick={handleEdit}
            
            // Grouping
            groupBy={groupBy}
            setGroupBy={setGroupBy}

            // Row Actions
            actions={(row) => (
               <>
                 <Button variant="ghost" size="iconSm" icon={Edit} className="text-indigo-600 hover:bg-indigo-50" onClick={() => handleEdit(row)} title="ویرایش" />
                 <Button variant="ghost" size="iconSm" icon={Key} className="text-amber-600 hover:bg-amber-50" onClick={() => handleResetPassword(row)} title="تغییر رمز عبور" />
               </>
            )}
         />
      </div>

      {/* 4. MODAL (Standardized) */}
      <Modal
         isOpen={isModalOpen}
         onClose={() => setIsModalOpen(false)}
         title={editingUser ? "ویرایش کاربر" : "تعریف کاربر جدید"}
         size="md"
         footer={
            <>
               <Button variant="secondary" onClick={() => setIsModalOpen(false)}>انصراف</Button>
               <Button variant="primary" icon={Save}>ذخیره تغییرات</Button>
            </>
         }
      >
         <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
               <InputField 
                  label="نام کاربری" 
                  value={formData.username} 
                  icon={User}
                  isRtl={isRtl} 
               />
               <SelectField label="نقش کاربری" isRtl={isRtl}>
                   <option value="user">کاربر عادی</option>
                   <option value="admin">مدیر سیستم</option>
               </SelectField>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
               <h4 className="text-[11px] font-bold text-slate-500 uppercase mb-3 border-b border-slate-200 pb-2 flex items-center gap-2">
                 <Lock size={14}/> امنیت و رمز عبور
               </h4>
               <div className="flex items-end gap-2">
                  <InputField 
                     label="رمز عبور" 
                     type="password" 
                     placeholder="••••••••" 
                     isRtl={isRtl} 
                     className="flex-1"
                  />
                  <Button variant="secondary" icon={RefreshCw}>تولید خودکار</Button>
               </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-2">
               <span className="text-[13px] font-bold text-slate-700">وضعیت حساب کاربری</span>
               <Toggle 
                  checked={formData.status} 
                  onChange={(val) => setFormData({...formData, status: val})} 
                  label={formData.status ? "حساب فعال است" : "حساب مسدود شده"} 
               />
            </div>
         </div>
      </Modal>

    </div>
  );
};

window.UserManagement = UserManagement;
