/* Filename: components/ComponentShowcase.js */
import React, { useState } from 'react';
import { 
  Save, Trash2, Search, Plus, Filter, Download, 
  Printer, MoreHorizontal, Edit, Eye, Shield, DollarSign,
  FileCheck, AlertTriangle, Send
} from 'lucide-react';

// --- MOCK DATA FOR SHOWCASE ---
const MOCK_DATA = Array.from({ length: 100 }).map((_, i) => ({
  id: 1000 + i,
  docNo: `DOC-${202400 + i}`,
  date: `1402/${Math.floor(Math.random() * 12) + 1}/${Math.floor(Math.random() * 28) + 1}`,
  description: i % 3 === 0 ? 'بابت خرید ملزومات اداری و مصرفی' : (i % 2 === 0 ? 'سند افتتاحیه دوره مالی جدید' : 'هزینه تنخواه گردان'),
  dept: i % 4 === 0 ? 'منابع انسانی' : (i % 3 === 0 ? 'فنی و مهندسی' : 'مالی'),
  debtor: (Math.random() * 10000000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
  creditor: (Math.random() * 10000000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
  status: i % 5 === 0 ? 'پیش‌نویس' : (i % 3 === 0 ? 'بررسی شده' : 'نهایی'),
  isActive: i % 4 !== 0, // Toggle Field
  creator: 'Admin User'
}));

const ComponentShowcase = ({ t, isRtl }) => {
  const UI = window.UI || {};
  const { 
    Button, InputField, SelectField, Toggle, Badge, 
    DataGrid, FilterSection, Modal, DatePicker, LOV 
  } = UI;

  if (!Button) return <div>Error loading UI</div>;

  // --- STATES ---
  const [selectedRows, setSelectedRows] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [groupBy, setGroupBy] = useState(['dept']); // پیش‌فرض: گروه‌بندی بر اساس دپارتمان

  // --- HANDLERS ---
  const handleCreate = () => {
    setEditingRow(null);
    setIsModalOpen(true);
  };

  const handleDelete = (ids) => {
    alert(`Delete Request for IDs: ${ids.join(', ')}`);
    setSelectedRows([]);
  };

  const handleEdit = (row) => {
    setEditingRow(row);
    setIsModalOpen(true);
  };

  const handleRowAction = (type, row) => {
    if (type === 'view') alert(`Opening Details for: ${row.docNo}`);
    if (type === 'approve') alert(`Request Approved: ${row.docNo}`);
    if (type === 'redirect') alert(`Redirecting to document page...`);
  };

  // --- COLUMNS DEFINITION ---
  const columns = [
    { header: 'شماره سند', field: 'docNo', width: 'w-32', sortable: true },
    { header: 'تاریخ', field: 'date', width: 'w-28' },
    { header: 'دپارتمان', field: 'dept', width: 'w-32' },
    { header: 'شرح سند', field: 'description', width: 'w-auto' },
    { header: 'مبلغ بدهکار', field: 'debtor', width: 'w-32 text-end font-mono' },
    { 
      header: 'وضعیت', 
      width: 'w-24 text-center',
      render: (row) => {
        const map = { 'نهایی': 'success', 'پیش‌نویس': 'neutral', 'بررسی شده': 'info' };
        return <Badge variant={map[row.status]}>{row.status}</Badge>;
      }
    },
    { header: 'فعال', field: 'isActive', type: 'toggle', width: 'w-20 text-center' },
    // Define Action Column via Column Definition (Method A)
    {
      type: 'action',
      width: 'w-24',
      actions: [
        { icon: Edit, title: 'ویرایش', onClick: handleEdit, colorClass: 'text-indigo-600 hover:bg-indigo-50' },
        { icon: Eye, title: 'مشاهده', onClick: (r) => handleRowAction('view', r) },
      ]
    }
  ];

  return (
    <div className={`flex flex-col h-full bg-slate-50/50 p-6 overflow-hidden ${isRtl ? 'font-vazir' : 'font-sans'}`}>
      
      {/* 1. PAGE HEADER */}
      <div className="flex items-center justify-between mb-6 shrink-0">
         <div>
            <h1 className="text-2xl font-black text-slate-800">مدیریت اسناد حسابداری</h1>
            <p className="text-slate-500 text-xs mt-1 font-medium">لیست تمامی اسناد ثبت شده در سیستم با قابلیت گروه‌بندی و فیلتر پیشرفته</p>
         </div>
         <div className="flex gap-2">
            <Button variant="secondary" icon={Printer}>چاپ گزارش</Button>
            <Button variant="primary" icon={Plus} onClick={handleCreate}>سند جدید</Button>
         </div>
      </div>

      {/* 2. FILTER SECTION (Collapsible) */}
      <FilterSection 
        onSearch={() => alert('Search triggered!')} 
        onClear={() => alert('Filters cleared')}
        isRtl={isRtl}
      >
         <InputField label="شماره سند از" placeholder="مانند: DOC-1000" isRtl={isRtl} />
         <InputField label="شماره سند تا" placeholder="مانند: DOC-2000" isRtl={isRtl} />
         <DatePicker label="تاریخ صدور" isRtl={isRtl} />
         <SelectField label="وضعیت سند" isRtl={isRtl}>
            <option>همه وضعیت‌ها</option>
            <option>نهایی شده</option>
            <option>پیش‌نویس</option>
         </SelectField>
         <LOV label="مرکز هزینه" placeholder="انتخاب مرکز..." isRtl={isRtl} />
         <LOV label="معین (حساب)" placeholder="انتخاب حساب..." isRtl={isRtl} />
      </FilterSection>

      {/* 3. MODERN DATA GRID */}
      <div className="flex-1 min-h-0">
        <DataGrid 
          title="لیست اسناد مالی"
          columns={columns}
          data={MOCK_DATA}
          isRtl={isRtl}
          
          // Selection
          selectedIds={selectedRows}
          onSelectAll={(checked) => setSelectedRows(checked ? MOCK_DATA.map(r=>r.id) : [])}
          onSelectRow={(id, checked) => setSelectedRows(prev => checked ? [...prev, id] : prev.filter(x => x !== id))}
          
          // Actions & Events
          onCreate={handleCreate}
          onDelete={handleDelete}
          onDoubleClick={handleEdit}
          
          // Grouping Config
          groupBy={groupBy}
          setGroupBy={setGroupBy}

          // Optional: Custom Row Actions Render (Method B - overrides column actions if provided)
          actions={(row) => (
             <>
               <Button variant="ghost" size="iconSm" icon={Edit} className="text-blue-600 hover:bg-blue-50" onClick={() => handleEdit(row)} title="ویرایش سریع" />
               <Button variant="ghost" size="iconSm" icon={FileCheck} className="text-emerald-600 hover:bg-emerald-50" onClick={() => handleRowAction('approve', row)} title="تایید سند" />
               <Button variant="ghost" size="iconSm" icon={Send} className="text-slate-400 hover:text-slate-800" onClick={() => handleRowAction('redirect', row)} title="ارسال به کارتابل" />
             </>
          )}
        />
      </div>

      {/* 4. MODAL EXAMPLE */}
      <Modal 
         isOpen={isModalOpen} 
         onClose={() => setIsModalOpen(false)} 
         title={editingRow ? `ویرایش سند ${editingRow.docNo}` : "ایجاد سند حسابداری جدید"}
         size="lg"
         footer={
            <>
               <Button variant="secondary" onClick={() => setIsModalOpen(false)}>انصراف</Button>
               <Button variant="primary" icon={Save}>ذخیره تغییرات</Button>
            </>
         }
      >
         <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-100 p-3 rounded-lg flex items-start gap-3">
               <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={18} />
               <div className="text-[12px] text-amber-800 leading-relaxed">
                  توجه: تغییر در اسناد "نهایی شده" نیازمند مجوز مدیر سیستم است. لطفاً قبل از ویرایش، از وجود مجوز اطمینان حاصل کنید.
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <InputField label="شماره سند" value={editingRow?.docNo || "AUTO"} disabled />
               <DatePicker label="تاریخ سند" defaultValue={editingRow?.date || ""} />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
               <SelectField label="دپارتمان">
                  <option>مالی</option>
                  <option>فنی</option>
               </SelectField>
               <LOV label="طرف حساب" placeholder="جستجو..." />
               <InputField label="مبلغ (ریال)" value={editingRow?.debtor || ""} className="font-mono text-left" dir="ltr" />
            </div>

            <div className="pt-2">
               <InputField label="شرح سند" value={editingRow?.description || ""} />
            </div>

            <div className="flex items-center gap-4 pt-2 border-t border-slate-100 mt-2">
               <span className="text-[12px] font-bold text-slate-700">وضعیت سند:</span>
               <Toggle label="سند فعال باشد" checked={true} onChange={()=>{}} />
            </div>
         </div>
      </Modal>

    </div>
  );
};

window.ComponentShowcase = ComponentShowcase;
