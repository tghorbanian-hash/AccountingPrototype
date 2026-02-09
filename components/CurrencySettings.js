/* Filename: components/CurrencySettings.js */
import React, { useState, useMemo } from 'react';
import { 
  Banknote, Search, Plus, Edit, Trash2, RefreshCw, 
  History, Settings, ArrowLeftRight, Coins, Save, X, Check 
} from 'lucide-react';

const CurrencySettings = ({ t, isRtl }) => {
  const UI = window.UI || {};
  const { Button, InputField, SelectField, DataGrid, FilterSection, Modal, Badge, Toggle } = UI;

  // --- States ---
  
  // 1. Global Settings
  const [globalSettings, setGlobalSettings] = useState({
    main: 'IRR',
    operational: 'IRR',
    reporting1: 'USD',
    reporting2: 'EUR'
  });

  // 2. Data & Filters
  const [currencies, setCurrencies] = useState([
    { id: 1, code: 'IRR', title: 'ریال ایران', method: 'auto', decimals: 0, symbol: '﷼', active: true, reciprocal: false },
    { id: 2, code: 'USD', title: 'دلار آمریکا', method: 'auto', decimals: 2, symbol: '$', active: true, reciprocal: true },
    { id: 3, code: 'EUR', title: 'یورو', method: 'auto', decimals: 2, symbol: '€', active: true, reciprocal: true },
    { id: 4, code: 'AED', title: 'درهم امارات', method: 'manual', decimals: 2, symbol: 'د.إ', active: true, reciprocal: false },
  ]);

  const [filters, setFilters] = useState({ search: '', method: '' });

  // 3. Conversions (Mock DB: { 'USD': [ {target: 'IRR', rate: 60000}, ... ] })
  const [conversions, setConversions] = useState({
    'USD': [{ target: 'IRR', rate: 600000 }, { target: 'EUR', rate: 0.92 }, { target: 'AED', rate: 3.67 }],
    'EUR': [{ target: 'IRR', rate: 650000 }, { target: 'USD', rate: 1.09 }],
  });

  // 4. History Log
  const [historyLog, setHistoryLog] = useState([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isLoadingRates, setIsLoadingRates] = useState(false);

  // 5. Modals State
  const [isModalOpen, setIsModalOpen] = useState(false); // Edit Currency Modal
  const [isConvModalOpen, setIsConvModalOpen] = useState(false); // Manage Conversions Modal
  
  const [currentRecord, setCurrentRecord] = useState(null);
  const [formData, setFormData] = useState({});
  
  // Conversion Modal Temporary State
  const [selectedForConv, setSelectedForConv] = useState(null);
  const [newConvTarget, setNewConvTarget] = useState('');
  const [newConvRate, setNewConvRate] = useState('');

  // --- Logic & Handlers ---

  // Filter Logic
  const filteredData = useMemo(() => {
    return currencies.filter(item => {
      const matchSearch = filters.search 
        ? (item.code.toLowerCase().includes(filters.search.toLowerCase()) || item.title.includes(filters.search))
        : true;
      const matchMethod = filters.method ? item.method === filters.method : true;
      return matchSearch && matchMethod;
    });
  }, [currencies, filters]);

  // Global Settings Save
  const handleSaveGlobals = () => {
    // API Call would go here
    alert(isRtl ? 'تنظیمات کلان سیستم با موفقیت ذخیره شد.' : 'Global settings saved successfully.');
  };

  // Fetch Automatic Rates (Mock)
  const handleFetchRates = () => {
    setIsLoadingRates(true);
    setTimeout(() => {
      const now = new Date();
      const dateStr = now.toLocaleDateString('fa-IR');
      const timeStr = now.toLocaleTimeString('fa-IR');
      
      const newLogs = [
        { id: Date.now(), date: dateStr, time: timeStr, source: 'USD', target: 'IRR', rate: 605000 + Math.floor(Math.random() * 1000) },
        { id: Date.now()+1, date: dateStr, time: timeStr, source: 'EUR', target: 'IRR', rate: 655000 + Math.floor(Math.random() * 1000) },
      ];
      
      setHistoryLog(prev => [...newLogs, ...prev]);
      
      // Update conversions mock
      setConversions(prev => ({
        ...prev,
        'USD': prev['USD'].map(c => c.target === 'IRR' ? { ...c, rate: newLogs[0].rate } : c)
      }));

      setIsLoadingRates(false);
      alert('نرخ‌های جدید بروزرسانی شد.');
    }, 1500);
  };

  // Currency CRUD
  const handleOpenModal = (record = null) => {
    if (record) {
      setFormData({ ...record });
    } else {
      setFormData({ code: '', title: '', method: 'auto', decimals: 0, symbol: '', active: true, reciprocal: false });
    }
    setCurrentRecord(record);
    setIsModalOpen(true);
  };

  const handleSaveCurrency = () => {
    if (!formData.code || !formData.title || !formData.symbol) return;
    
    if (currentRecord) {
      setCurrencies(prev => prev.map(c => c.id === currentRecord.id ? { ...formData, id: c.id } : c));
    } else {
      setCurrencies(prev => [...prev, { ...formData, id: Date.now() }]);
    }
    setIsModalOpen(false);
  };

  const handleDeleteCurrency = (id) => {
    if (confirm('آیا از حذف این ارز اطمینان دارید؟')) {
      setCurrencies(prev => prev.filter(c => c.id !== id));
    }
  };

  const handleToggleActive = (id, newVal) => {
    setCurrencies(prev => prev.map(c => c.id === id ? { ...c, active: newVal } : c));
  };

  // History CRUD
  const handleDeleteHistory = (id) => {
     if(confirm('آیا از حذف این رکورد تاریخچه اطمینان دارید؟')) {
        setHistoryLog(prev => prev.filter(x => x.id !== id));
     }
  };

  // Conversion Management
  const handleOpenConvModal = (row) => {
    setSelectedForConv(row);
    setNewConvTarget('');
    setNewConvRate('');
    setIsConvModalOpen(true);
  };

  const handleAddConversion = () => {
    if (!newConvTarget || !newConvRate || !selectedForConv) return;
    const rate = parseFloat(newConvRate);
    if (isNaN(rate)) return;

    const sourceCode = selectedForConv.code;
    const targetCode = newConvTarget;

    // 1. Add Source -> Target
    setConversions(prev => {
      const currentList = prev[sourceCode] || [];
      // Remove existing if any
      const filtered = currentList.filter(c => c.target !== targetCode);
      return { ...prev, [sourceCode]: [...filtered, { target: targetCode, rate: rate }] };
    });

    // 2. Reciprocal Logic (If enabled)
    if (selectedForConv.reciprocal) {
      const inverseRate = 1 / rate;
      setConversions(prev => {
        const currentList = prev[targetCode] || [];
        const filtered = currentList.filter(c => c.target !== sourceCode);
        return { 
          ...prev, 
          [targetCode]: [...filtered, { target: sourceCode, rate: inverseRate }] 
        };
      });
      alert(`نرخ تبدیل معکوس (${targetCode} به ${sourceCode}) نیز به صورت اتوماتیک ثبت شد.`);
    }

    setNewConvTarget('');
    setNewConvRate('');
  };

  const handleDeleteConversion = (targetCode) => {
    const sourceCode = selectedForConv.code;
    setConversions(prev => ({
       ...prev,
       [sourceCode]: prev[sourceCode].filter(c => c.target !== targetCode)
    }));
  };

  // --- Column Definitions ---

  const columns = [
    { field: 'code', header: 'کد ارز', width: 'w-20', sortable: true },
    { field: 'title', header: 'عنوان', width: 'w-32', sortable: true },
    { field: 'symbol', header: 'علامت', width: 'w-16', className: 'text-center font-mono' },
    { 
      field: 'method', 
      header: 'نحوه دریافت نرخ', 
      width: 'w-32',
      render: (row) => (
        <Badge variant={row.method === 'auto' ? 'info' : 'warning'}>
          {row.method === 'auto' ? 'اتوماتیک' : 'دستی'}
        </Badge>
      )
    },
    { 
       field: 'active', 
       header: 'فعال', 
       width: 'w-20', 
       type: 'toggle' // This DataGrid supports type: 'toggle' but we need to handle the change via a custom renderer if the grid doesn't auto-bind
    },
    { 
      field: 'reciprocal', 
      header: 'تبدیل دو طرفه', 
      width: 'w-24', 
      render: (row) => row.reciprocal ? <Check size={16} className="text-emerald-600 mx-auto"/> : <span className="text-slate-300 mx-auto block text-center">-</span>
    }
  ];

  // Custom Toggle Renderer for Active Column (Since standard DataGrid toggle might be read-only)
  const customColumns = columns.map(col => {
     if(col.field === 'active') {
        return {
           ...col,
           type: undefined, // Override default type
           render: (row) => (
              <div className="flex justify-center">
                 <Toggle checked={row.active} onChange={(val) => handleToggleActive(row.id, val)} />
              </div>
           )
        };
     }
     return col;
  });

  const historyColumns = [
    { field: 'date', header: 'تاریخ', width: 'w-24' },
    { field: 'time', header: 'ساعت', width: 'w-24' },
    { field: 'source', header: 'ارز مبدا', width: 'w-20' },
    { field: 'target', header: 'ارز مقصد', width: 'w-20' },
    { 
      field: 'rate', 
      header: 'نرخ تبدیل', 
      width: 'w-32', 
      className: 'font-mono font-bold text-left dir-ltr',
      render: (row) => row.rate.toLocaleString('fa-IR', { maximumFractionDigits: 4 }) 
    },
    {
       field: 'actions',
       header: 'عملیات',
       width: 'w-20',
       render: (row) => (
          <Button variant="ghost" size="iconSm" icon={Trash2} className="text-red-500 hover:bg-red-50" onClick={() => handleDeleteHistory(row.id)} />
       )
    }
  ];

  return (
    <div className="flex flex-col h-full p-4 md:p-6 bg-slate-50/50">
      
      {/* Header */}
      <div className="mb-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-200">
            <Banknote size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-800">تنظیمات ارزها</h1>
            <p className="text-xs text-slate-500 font-medium mt-1">مدیریت ارزهای سیستم و نرخ‌های تبدیل</p>
          </div>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" icon={History} onClick={() => setIsHistoryOpen(true)}>تاریخچه نرخ‌ها</Button>
           <Button variant="primary" icon={RefreshCw} onClick={handleFetchRates} isLoading={isLoadingRates}>بروزرسانی نرخ‌ها</Button>
        </div>
      </div>

      {/* 1. Global Settings Section */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 mb-4 shadow-sm shrink-0">
         <div className="flex items-center justify-between mb-3">
            <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <Settings size={14}/> تنظیمات کلان سیستم
            </h3>
            <Button variant="primary" size="sm" icon={Save} onClick={handleSaveGlobals}>ذخیره تغییرات</Button>
         </div>
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <SelectField label="ارز اصلی سیستم (Base)" isRtl={isRtl} value={globalSettings.main} onChange={e => setGlobalSettings({...globalSettings, main: e.target.value})}>
               {currencies.map(c => <option key={c.id} value={c.code}>{c.title} ({c.code})</option>)}
            </SelectField>
            <SelectField label="ارز عملیاتی (Operational)" isRtl={isRtl} value={globalSettings.operational} onChange={e => setGlobalSettings({...globalSettings, operational: e.target.value})}>
               {currencies.map(c => <option key={c.id} value={c.code}>{c.title} ({c.code})</option>)}
            </SelectField>
            <SelectField label="ارز گزارشگری ۱" isRtl={isRtl} value={globalSettings.reporting1} onChange={e => setGlobalSettings({...globalSettings, reporting1: e.target.value})}>
               {currencies.map(c => <option key={c.id} value={c.code}>{c.title} ({c.code})</option>)}
            </SelectField>
            <SelectField label="ارز گزارشگری ۲" isRtl={isRtl} value={globalSettings.reporting2} onChange={e => setGlobalSettings({...globalSettings, reporting2: e.target.value})}>
               {currencies.map(c => <option key={c.id} value={c.code}>{c.title} ({c.code})</option>)}
            </SelectField>
         </div>
      </div>

      {/* 2. Main Grid & Filters */}
      <div className="flex-1 flex flex-col min-h-0">
        <FilterSection 
          isRtl={isRtl} 
          onSearch={() => {}} 
          onClear={() => setFilters({ search: '', method: '' })}
        >
           <div className="col-span-1">
             <InputField 
               label="کد / عنوان" 
               placeholder="..." 
               isRtl={isRtl} 
               value={filters.search} 
               onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
             />
           </div>
           <div className="col-span-1">
              <SelectField 
                label="نحوه دریافت نرخ" 
                isRtl={isRtl}
                value={filters.method}
                onChange={(e) => setFilters(prev => ({ ...prev, method: e.target.value }))}
              >
                 <option value="">همه</option>
                 <option value="auto">اتوماتیک</option>
                 <option value="manual">دستی</option>
              </SelectField>
           </div>
        </FilterSection>

        <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden min-h-0">
          <DataGrid 
            columns={customColumns} 
            data={filteredData} 
            onCreate={() => handleOpenModal()}
            isRtl={isRtl}
            actions={(row) => (
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="iconSm" icon={ArrowLeftRight} title="مدیریت تبدیل‌ها" className="text-indigo-600 hover:bg-indigo-50" onClick={() => handleOpenConvModal(row)} />
                <Button variant="ghost" size="iconSm" icon={Edit} onClick={() => handleOpenModal(row)} />
                <Button variant="ghost" size="iconSm" icon={Trash2} className="text-red-500 hover:bg-red-50" onClick={() => handleDeleteCurrency(row.id)} />
              </div>
            )}
          />
        </div>
      </div>

      {/* --- MODALS --- */}

      {/* 1. Create/Edit Currency Modal */}
      <Modal 
        isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} 
        title={currentRecord ? 'ویرایش ارز' : 'تعریف ارز جدید'}
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>{t.btn_cancel}</Button>
            <Button variant="primary" icon={Save} onClick={handleSaveCurrency}>{t.btn_save}</Button>
          </>
        }
      >
         <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InputField label="کد ارز (۳ حرفی) *" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})} isRtl={isRtl} className="dir-ltr uppercase" placeholder="USD" maxLength={3} />
            <InputField label="عنوان ارز *" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} isRtl={isRtl} />
            <InputField label="علامت (Symbol) *" value={formData.symbol} onChange={e => setFormData({...formData, symbol: e.target.value})} isRtl={isRtl} className="text-center" placeholder="$" />
            <InputField label="تعداد اعشار" type="number" value={formData.decimals} onChange={e => setFormData({...formData, decimals: parseInt(e.target.value)})} isRtl={isRtl} />
            
            <div className="md:col-span-2">
               <SelectField label="نحوه دریافت نرخ" value={formData.method} onChange={e => setFormData({...formData, method: e.target.value})} isRtl={isRtl}>
                  <option value="auto">اتوماتیک (از بانک مرکزی)</option>
                  <option value="manual">دستی (توسط کاربر)</option>
               </SelectField>
            </div>
            
            <div className="md:col-span-2 bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
               <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-700">وضعیت در سیستم</span>
                  <div className="flex items-center gap-2">
                     <span className="text-xs text-slate-500">فعال</span>
                     <Toggle checked={formData.active} onChange={val => setFormData({...formData, active: val})} />
                  </div>
               </div>
               <div className="h-px bg-slate-200"></div>
               <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-bold text-slate-700 block">تبدیل دو طرفه (Reciprocal)</span>
                    <span className="text-[10px] text-slate-500">محاسبه خودکار نرخ معکوس هنگام درج نرخ تبدیل</span>
                  </div>
                  <Toggle checked={formData.reciprocal} onChange={val => setFormData({...formData, reciprocal: val})} />
               </div>
            </div>
         </div>
      </Modal>

      {/* 2. Manage Conversions Modal */}
      <Modal 
        isOpen={isConvModalOpen} onClose={() => setIsConvModalOpen(false)}
        title={selectedForConv ? `مدیریت نرخ‌های تبدیل: ${selectedForConv.title} (${selectedForConv.code})` : 'مدیریت تبدیل‌ها'}
        size="md"
        footer={<Button variant="ghost" onClick={() => setIsConvModalOpen(false)}>بستن</Button>}
      >
        <div className="space-y-4">
           {/* Add New Section */}
           <div className="bg-indigo-50 border border-indigo-100 p-3 rounded-xl flex items-end gap-2">
              <div className="flex-1">
                 <SelectField label="ارز مقصد" isRtl={isRtl} value={newConvTarget} onChange={e => setNewConvTarget(e.target.value)}>
                    <option value="">انتخاب کنید...</option>
                    {currencies.filter(c => selectedForConv && c.code !== selectedForConv.code).map(c => (
                       <option key={c.id} value={c.code}>{c.title} ({c.code})</option>
                    ))}
                 </SelectField>
              </div>
              <div className="w-32">
                 <InputField label="نرخ تبدیل" type="number" placeholder="1.00" value={newConvRate} onChange={e => setNewConvRate(e.target.value)} isRtl={isRtl} />
              </div>
              <Button variant="primary" icon={Plus} onClick={handleAddConversion} className="mb-0.5">افزودن</Button>
           </div>
           
           {/* List Section */}
           <div>
              <h4 className="text-xs font-bold text-slate-500 mb-2 uppercase">نرخ‌های تعریف شده</h4>
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                 {selectedForConv && conversions[selectedForConv.code]?.length > 0 ? (
                    <div className="divide-y divide-slate-100">
                       {conversions[selectedForConv.code].map((conv, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 hover:bg-slate-50">
                             <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-[10px] text-slate-600 border border-slate-200">
                                   {conv.target}
                                </div>
                                <div className="flex flex-col">
                                   <span className="text-xs font-bold text-slate-800">1 {selectedForConv.code} = {conv.rate.toLocaleString()} {conv.target}</span>
                                </div>
                             </div>
                             <button onClick={() => handleDeleteConversion(conv.target)} className="text-slate-400 hover:text-red-500 transition-colors">
                                <X size={16} />
                             </button>
                          </div>
                       ))}
                    </div>
                 ) : (
                    <div className="p-8 text-center text-slate-400 text-xs italic">
                       هنوز نرخ تبدیلی برای این ارز تعریف نشده است.
                    </div>
                 )}
              </div>
           </div>

           {selectedForConv?.reciprocal && (
              <div className="text-[10px] text-emerald-600 bg-emerald-50 p-2 rounded-lg flex items-center gap-2">
                 <Check size={12}/>
                 قابلیت تبدیل دو طرفه برای این ارز فعال است. نرخ‌های معکوس به طور خودکار اعمال می‌شوند.
              </div>
           )}
        </div>
      </Modal>

      {/* 3. History Modal */}
      <Modal isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} title="تاریخچه بروزرسانی نرخ‌ها" size="lg">
         <div className="h-96">
            <DataGrid columns={historyColumns} data={historyLog} isRtl={isRtl} />
         </div>
      </Modal>

    </div>
  );
};

window.CurrencySettings = CurrencySettings;
