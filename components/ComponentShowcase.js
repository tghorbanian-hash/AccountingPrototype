/* Filename: components/ComponentShowcase.js */
import React, { useState } from 'react';
import { 
  Save, Trash2, Search, Plus, Filter, Download, 
  Printer, MoreHorizontal, Edit, Eye, Shield, DollarSign 
} from 'lucide-react';

// --- MOCK DATA FOR SHOWCASE ---
// نکته: ساختار دیتا برای منوی جدید باید به گونه‌ای باشد که 
// سطح اول (Level 0) به عنوان "سرتیتر" در نظر گرفته شود.
const MOCK_MENU = [
  {
    id: 'section_finance',
    label: 'حوزه مالی', // This will be the Header
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
            label: 'عملیات روزانه',
            children: [
              { id: 'form_doc', label: 'سند حسابداری' }
            ]
          }
        ]
      },
      {
         id: 'mod_treasury',
         label: 'خزانه‌داری',
         children: [
            { id: 'form_cheque', label: 'مدیریت چک‌ها' }
         ]
      }
    ]
  },
  {
    id: 'section_hr',
    label: 'سرمایه انسانی', // Another Header
    children: [
      { 
        id: 'mod_personnel', 
        label: 'مدیریت پرسنل',
        children: [
            { id: 'form_emp', label: 'لیست کارکنان' },
            { id: 'form_contract', label: 'قراردادها' }
        ]
      }
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
  const UI = window.UI || {};
  const { 
    Button, InputField, SelectField, Toggle, Badge, 
    DataGrid, TreeMenu, Modal, DatePicker, LOV 
  } = UI;

  if (!Button) return <div>Error loading UI</div>;

  const [activeMenu, setActiveMenu] = useState('form_accounts');
  const [selectedRows, setSelectedRows] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
    { header: 'Description', field: 'description', width: 'w-auto' },
    { header: 'Amount', field: 'debtor', width: 'w-32 text-end' },
    { 
      header: 'Status', 
      width: 'w-24 text-center',
      render: (row) => (
        <Badge variant={row.status === 'FINAL' ? 'success' : 'warning'}>{row.status}</Badge>
      )
    }
  ];

  return (
    <div className={`flex h-screen bg-slate-100 overflow-hidden ${isRtl ? 'font-vazir' : 'font-sans'}`}>
      
      {/* 1. SIDEBAR with NEW TREE DESIGN */}
      <aside className={`
        bg-white border-r border-slate-300 flex flex-col transition-all duration-300 shadow-sm
        ${isSidebarOpen ? 'w-72' : 'w-0 opacity-0 overflow-hidden'}
      `}>
        <div className="h-16 flex items-center px-6 border-b border-slate-100 bg-slate-50/50 shrink-0">
          <div className="font-black text-slate-800 tracking-tight">Financial System</div>
        </div>
        
        {/* The Improved Tree Menu */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
           <TreeMenu 
             items={MOCK_MENU} 
             activeId={activeMenu} 
             onSelect={setActiveMenu} 
             isRtl={isRtl}
           />
        </div>
        
        <div className="p-4 border-t border-slate-100">
           <div className="text-[10px] text-center text-slate-400">Design System v2.0</div>
        </div>
      </aside>

      {/* 2. MAIN CONTENT */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
           <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" icon={isSidebarOpen ? MoreHorizontal : Filter} onClick={() => setIsSidebarOpen(!isSidebarOpen)} />
              <h1 className="text-lg font-bold text-slate-800">Showcase: New Tree Menu</h1>
           </div>
        </header>

        <div className="flex-1 p-4 overflow-hidden flex flex-col gap-4">
           <div className="bg-white border border-slate-300 rounded p-4 shadow-sm">
             <h2 className="text-sm font-bold text-slate-700 mb-4">Form Components</h2>
             <div className="grid grid-cols-4 gap-4">
                <InputField label="Text Input" placeholder="Type..." isRtl={isRtl} />
                <LOV label="LOV / Search" placeholder="Select..." isRtl={isRtl} />
                <SelectField label="Dropdown" isRtl={isRtl}><option>Option 1</option></SelectField>
                <DatePicker label="Date Picker" isRtl={isRtl} />
             </div>
           </div>

           <div className="flex-1 overflow-hidden bg-white border border-slate-300 rounded shadow-sm">
             <DataGrid 
                columns={columns}
                data={MOCK_GRID_DATA}
                isRtl={isRtl}
                selectedIds={selectedRows}
                onSelectAll={handleSelectAll}
                onSelectRow={handleSelectRow}
             />
           </div>
        </div>
      </main>
    </div>
  );
};

window.ComponentShowcase = ComponentShowcase;
