/* Filename: components/ComponentShowcase.js */
import React, { useState } from 'react';
import { 
  Save, Trash2, Search, Plus, Filter, Download, 
  Printer, MoreHorizontal, Edit, Eye, Shield, DollarSign 
} from 'lucide-react';

// دسترسی ایمن به کامپوننت‌های UI
// اگر فایل UIComponents درست لود نشود، این خط خطا می‌دهد
const UI = window.UI || {}; 
const { 
  Button, InputField, SelectField, Toggle, Badge, 
  DataGrid, TreeMenu, Modal, DatePicker, LOV, THEME 
} = UI;

// --- MOCK DATA FOR SHOWCASE ---
const MOCK_MENU = [
  {
    id: 'domain_finance',
    label: 'حوزه مالی و حسابداری',
    children: [
      {
        id: 'mod_gl',
        label: 'دفتر کل (General Ledger)',
        children: [
          {
            id: 'cat_base',
            label: 'اطلاعات پایه',
            children: [
              { id: 'form_accounts', label: 'ساختار حساب‌ها' },
              { id: 'form_coding', label: 'کدینگ تفصیلی' }
            ]
          },
          {
            id: 'cat_ops',
            label: 'عملیات',
            children: [
              { id: 'form_doc', label: 'سند حسابداری' },
              { id: 'form_close', label: 'بستن حساب‌ها' }
            ]
          }
        ]
      },
      {
        id: 'mod_treasury',
        label: 'خزانه‌داری (Treasury)',
        children: [
          {
             id: 'cat_trs_ops',
             label: 'عملیات دریافت و پرداخت',
             children: [
                { id: 'form_cheque', label: 'مدیریت چک‌ها' }
             ]
          }
        ]
      }
    ]
  },
  {
    id: 'domain_hr',
    label: 'سرمایه انسانی',
    children: [
      { id: 'mod_personnel', label: 'پرسنلی', children: [] }
    ]
  }
];

const MOCK_GRID_DATA = Array.from({ length: 50 }).map((_, i) => ({
  id: 1000 + i,
  docNo: `DOC-${202400 + i}`,
  date: '1402/12/20',
  description: i % 3 === 0 ? 'بابت خرید ملزومات اداری و مصرفی' : 'سند افتتاحیه دوره مالی جدید',
  debtor: (Math.random() * 10000000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
  creditor: (Math.random() * 10000000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
  status: i % 4 === 0 ? 'DRAFT' : 'FINAL',
  creator: 'Admin User'
}));

const ComponentShowcase = ({ t, isRtl }) => {
  // اگر کامپوننت‌ها لود نشده باشند، پیام خطا نشان بده
  if (!window.UI || !Button) {
    return <div className="p-10 text-red-600 font-bold">Error: UI Components not loaded properly. Please check index.html order.</div>;
  }

  const [activeMenu, setActiveMenu] = useState('form_accounts');
  const [selectedRows, setSelectedRows] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Grid Selection Logic
  const handleSelectAll = (checked) => {
    if (checked) setSelectedRows(MOCK_GRID_DATA.map(r => r.id));
    else setSelectedRows([]);
  };

  const handleSelectRow = (id, checked) => {
    if (checked) setSelectedRows(prev => [...prev, id]);
    else setSelectedRows(prev => prev.filter(r => r !== id));
  };

  const columns = [
    { header: 'No.', field: 'id', width: 'w-16' },
    { header: 'Doc Number', field: 'docNo', width: 'w-32', sortable: true },
    { header: 'Date', field: 'date', width: 'w-24' },
    { header: 'Description', field: 'description', width: 'w-auto' },
    { header: 'Debtor (Rial)', field: 'debtor', width: 'w-32 text-end' },
    { header: 'Creditor (Rial)', field: 'creditor', width: 'w-32 text-end' },
    { 
      header: 'Status', 
      width: 'w-24 text-center',
      render: (row) => (
        <Badge variant={row.status === 'FINAL' ? 'success' : 'warning'}>
          {row.status}
        </Badge>
      )
    },
    { header: 'Creator', field: 'creator', width: 'w-32' },
  ];

  return (
    <div className={`flex h-screen bg-slate-100 overflow-hidden ${isRtl ? 'font-vazir' : 'font-sans'}`}>
      
      {/* 1. SIDEBAR (Navigation) */}
      <aside className={`
        bg-white border-r border-slate-300 flex flex-col transition-all duration-300
        ${isSidebarOpen ? 'w-64' : 'w-0 opacity-0 overflow-hidden'}
      `}>
        <div className="h-12 flex items-center px-4 border-b border-slate-200 bg-indigo-900 text-white shrink-0">
          <div className="font-black tracking-widest">ERP SYSTEM</div>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
           <TreeMenu 
             items={MOCK_MENU} 
             activeId={activeMenu} 
             onSelect={setActiveMenu} 
             isRtl={isRtl}
           />
        </div>
        <div className="p-3 border-t border-slate-200 bg-slate-50 text-[10px] text-center text-slate-400">
           Version 3.0.1 (Build 2026)
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header */}
        <header className="h-12 bg-white border-b border-slate-300 flex items-center justify-between px-4 shrink-0 shadow-sm z-20">
           <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" icon={isSidebarOpen ? MoreHorizontal : Filter} onClick={() => setIsSidebarOpen(!isSidebarOpen)} />
              <div className="flex items-center gap-2 text-sm text-slate-500">
                 <span>Accounting</span>
                 <span className="text-slate-300">/</span>
                 <span className="font-bold text-slate-800">General Ledger Documents</span>
              </div>
           </div>
           <div className="flex items-center gap-2">
              <div className="bg-amber-100 text-amber-800 text-[10px] px-2 py-1 rounded border border-amber-200 font-bold">
                 TEST ENVIRONMENT
              </div>
              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-xs border border-indigo-200">
                 AD
              </div>
           </div>
        </header>

        {/* Action Toolbar (Breadcrumbs + Actions) */}
        <div className="h-14 bg-slate-50 border-b border-slate-300 flex items-center justify-between px-4 shrink-0">
           <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-800">Accounting Documents</h1>
              <Badge variant="info">{MOCK_GRID_DATA.length} Items</Badge>
           </div>
           <div className="flex items-center gap-2">
              <Button variant="secondary" icon={Printer}>Print</Button>
              <Button variant="secondary" icon={Download}>Export</Button>
              <div className="h-6 w-px bg-slate-300 mx-2"></div>
              <Button variant="primary" icon={Plus} onClick={() => setIsModalOpen(true)}>New Document</Button>
           </div>
        </div>

        {/* Workspace (The Grid) */}
        <div className="flex-1 p-2 overflow-hidden flex flex-col gap-4">
          
          {/* Example: Filters Section */}
          <div className="bg-white border border-slate-300 rounded p-3 flex items-end gap-3 shrink-0 shadow-sm">
             <div className="grid grid-cols-4 gap-3 flex-1">
                <InputField label="Document Number" placeholder="Ex: DOC-2024..." isRtl={isRtl} />
                <LOV label="Account Code" placeholder="Select Account..." isRtl={isRtl} />
                <DatePicker label="From Date" isRtl={isRtl} />
                <SelectField label="Status" isRtl={isRtl}>
                   <option>All Statuses</option>
                   <option>Finalized</option>
                   <option>Draft</option>
                </SelectField>
             </div>
             <Button variant="primary" icon={Search} className="mb-[1px]">Search</Button>
          </div>

          {/* The Data Grid */}
          <div className="flex-1 overflow-hidden">
             <DataGrid 
                columns={columns}
                data={MOCK_GRID_DATA}
                isRtl={isRtl}
                selectedIds={selectedRows}
                onSelectAll={handleSelectAll}
                onSelectRow={handleSelectRow}
                actions={(row) => (
                   <>
                     <Button variant="ghost" size="icon" icon={Eye} />
                     <Button variant="ghost" size="icon" icon={Edit} />
                   </>
                )}
             />
          </div>
        </div>

      </main>

      {/* 3. MODAL EXAMPLE */}
      <Modal 
         isOpen={isModalOpen} 
         onClose={() => setIsModalOpen(false)} 
         title="Create New Accounting Document"
         size="lg"
         footer={
            <>
               <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
               <Button variant="primary" icon={Save}>Save Document</Button>
            </>
         }
      >
         <div className="space-y-4">
            <div className="bg-indigo-50 border border-indigo-100 p-3 rounded flex items-start gap-3">
               <Shield className="text-indigo-600 shrink-0 mt-0.5" size={16} />
               <div className="text-[11px] text-indigo-900 leading-relaxed">
                  You are creating a document in the <strong>FY-2026</strong> period. Ensure all dates match the active fiscal year settings.
               </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
               <InputField label="Document Number" value="AUTO-GEN" disabled />
               <DatePicker label="Posting Date" />
               <SelectField label="Document Type">
                  <option>General</option>
                  <option>Opening</option>
                  <option>Closing</option>
               </SelectField>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <LOV label="Subsidiary Ledger (Moein)" placeholder="Search Ledger..." />
               <LOV label="Cost Center" placeholder="Search Center..." />
            </div>

            <div className="border-t border-slate-200 pt-4 mt-2">
               <div className="flex justify-between items-center mb-2">
                  <h4 className="font-bold text-xs text-slate-700">Line Items</h4>
                  <Button size="sm" variant="secondary" icon={Plus}>Add Line</Button>
               </div>
               <div className="bg-slate-50 border border-slate-200 rounded h-32 flex items-center justify-center text-slate-400 text-xs">
                  [Interactive Grid for Line Items would go here]
               </div>
               
               <div className="flex justify-end gap-8 mt-4 pr-4">
                  <div className="text-right">
                     <div className="text-[10px] text-slate-500 uppercase font-bold">Total Debtor</div>
                     <div className="text-sm font-mono font-bold text-slate-800">12,500,000</div>
                  </div>
                  <div className="text-right">
                     <div className="text-[10px] text-slate-500 uppercase font-bold">Total Creditor</div>
                     <div className="text-sm font-mono font-bold text-slate-800">12,500,000</div>
                  </div>
                  <div className="text-right">
                     <div className="text-[10px] text-slate-500 uppercase font-bold">Balance</div>
                     <div className="text-sm font-mono font-bold text-emerald-600">0</div>
                  </div>
               </div>
            </div>
         </div>
      </Modal>

    </div>
  );
};

window.ComponentShowcase = ComponentShowcase;
