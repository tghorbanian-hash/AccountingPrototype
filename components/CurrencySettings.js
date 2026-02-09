/* Filename: components/CurrencySettings.js */
import React, { useState, useEffect } from 'react';
import { 
  Banknote, Search, Plus, Edit, Trash2, RefreshCw, 
  History, Settings, ArrowLeftRight, Coins, ChevronLeft, Save 
} from 'lucide-react';

const CurrencySettings = ({ t, isRtl }) => {
  const UI = window.UI || {};
  const { Button, InputField, SelectField, DataGrid, FilterSection, Modal, Badge, Toggle } = UI;

  // --- States ---
  // Global Settings
  const [globalSettings, setGlobalSettings] = useState({
    main: 'IRR',
    operational: 'IRR',
    reporting1: 'USD',
    reporting2: 'EUR'
  });

  // Data
  const [currencies, setCurrencies] = useState([
    { id: 1, code: 'IRR', title: 'ریال ایران', method: 'auto', decimals: 0, symbol: '﷼', active: true },
    { id: 2, code: 'USD', title: 'دلار آمریکا', method: 'auto', decimals: 2, symbol: '$', active: true },
    { id: 3, code: 'EUR', title: 'یورو', method: 'auto', decimals: 2, symbol: '€', active: true },
    { id: 4, code: 'AED', title: 'درهم امارات', method: 'manual', decimals: 2, symbol: 'د.إ', active: true },
  ]);

  // Conversions (Mock DB)
  const [conversions, setConversions] = useState({
    'USD': [{ target: 'IRR', rate: 600000 }, { target: 'EUR', rate: 0.92 }, { target: 'AED', rate: 3.67 }],
    'EUR': [{ target: 'IRR', rate: 650000 }, { target: 'USD', rate: 1.09 }],
  });

  // History Log
  const [historyLog, setHistoryLog] = useState([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Form & Selection
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [selectedCurrency, setSelectedCurrency] = useState(null); // For Sidebar
  const [formData, setFormData] = useState({});
  const [isLoadingRates, setIsLoadingRates] = useState(false);

  // --- Handlers ---
  
  // 1. Fetch Automatic Rates (Mock API)
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
      alert('نرخ‌های جدید از بانک مرکزی دریافت و بروزرسانی شد.');
    }, 1500);
  };

  // 2. CRUD Handlers
  const handleOpenModal = (record = null) => {
    if (record) {
      setFormData({ ...record });
    } else {
      setFormData({ code: '', title: '', method: 'auto', decimals: 0, symbol: '', active: true });
    }
    setCurrentRecord(record);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.code || !formData.title || !formData.symbol) return;
    
    if (currentRecord) {
      setCurrencies(prev => prev.map(c => c.id === currentRecord.id ? { ...formData, id: c.id } : c));
    } else {
      setCurrencies(prev => [...prev, { ...formData, id: Date.now() }]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (confirm('آیا از حذف این ارز اطمینان دارید؟')) {
      setCurrencies(prev => prev.filter(c => c.id !== id));
      if (selectedCurrency?.id === id) setSelectedCurrency(null);
    }
  };

  const handleSelectRow = (row) => {
    setSelectedCurrency(row);
  };

  // --- Columns ---
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
    { field: 'decimals', header: 'اعشار', width: 'w-16', className: 'text-center' },
  ];

  const historyColumns = [
    { field: 'date', header: 'تاریخ', width: 'w-24' },
    { field: 'time', header: 'ساعت', width: 'w-24' },
    { field: 'source', header: 'ارز مبدا', width: 'w-20' },
    { field: 'target', header: 'ارز مقصد', width: 'w-20' },
    { field: 'rate', header: 'نرخ تبدیل', width: 'w-32', className: 'font-mono font-bold' },
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

      {/* Top Section: Global Settings */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 mb-4 shadow-sm shrink-0">
         <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Settings size={14}/> تنظیمات کلان سیستم
         </h3>
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

      <div className="flex-1 flex gap-4 min-h-0 overflow-hidden">
        {/* Left: Data Grid */}
        <div className="flex-1 flex flex-col min-w-0">
          <FilterSection isRtl={isRtl} onSearch={() => {}} onClear={() => {}}>
             <div className="col-span-1"><InputField label="کد / عنوان" placeholder="..." isRtl={isRtl} /></div>
             <div className="col-span-1">
                <SelectField label="نحوه دریافت نرخ" isRtl={isRtl}>
                   <option value="">همه</option>
                   <option value="auto">اتوماتیک</option>
                   <option value="manual">دستی</option>
                </SelectField>
             </div>
          </FilterSection>

          <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden min-h-0">
            <DataGrid 
              columns={columns} 
              data={currencies} 
              onCreate={() => handleOpenModal()}
              isRtl={isRtl}
              onSelectRow={(id) => handleSelectRow(currencies.find(c => c.id === id))}
              actions={(row) => (
                <>
                  <Button variant="ghost" size="iconSm" icon={Edit} onClick={() => handleOpenModal(row)} />
                  <Button variant="ghost" size="iconSm" icon={Trash2} className="text-red-500" onClick={() => handleDelete(row.id)} />
                </>
              )}
            />
          </div>
        </div>

        {/* Right: Sidebar (Conversions) */}
        <div className={`w-72 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden transition-all duration-300 ${!selectedCurrency ? 'w-0 opacity-0 border-0 p-0' : 'p-0 opacity-100'}`}>
           <div className="p-4 border-b border-slate-100 bg-slate-50">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                 <ArrowLeftRight size={16} className="text-indigo-600"/>
                 نرخ‌های تبدیل
              </h3>
              {selectedCurrency && (
                 <div className="mt-2 text-xs text-slate-500">
                    مبدا: <span className="font-bold text-slate-800">{selectedCurrency.title} ({selectedCurrency.code})</span>
                 </div>
              )}
           </div>
           
           <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {selectedCurrency && conversions[selectedCurrency.code]?.map((conv, idx) => (
                 <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-white hover:border-indigo-200 hover:shadow-sm transition-all group">
                    <div className="flex items-center gap-2">
                       <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600">
                          {conv.target}
                       </div>
                       <span className="text-xs font-bold text-slate-700">{conv.rate.toLocaleString()}</span>
                    </div>
                    <Button variant="ghost" size="iconSm" icon={Edit} className="opacity-0 group-hover:opacity-100"/>
                 </div>
              ))}
              {selectedCurrency && (!conversions[selectedCurrency.code] || conversions[selectedCurrency.code].length === 0) && (
                 <div className="text-center py-6 text-slate-400 text-xs italic">
                    <Coins size={24} className="mx-auto mb-2 opacity-50"/>
                    هیچ نرخ تبدیلی تعریف نشده است.
                 </div>
              )}
              
              <Button variant="secondary" icon={Plus} className="w-full mt-2 border-dashed">افزودن نرخ تبدیل</Button>
           </div>
        </div>
      </div>

      {/* Create/Edit Modal */}
      <Modal 
        isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} 
        title={currentRecord ? 'ویرایش ارز' : 'تعریف ارز جدید'}
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>{t.btn_cancel}</Button>
            <Button variant="primary" icon={Save} onClick={handleSave}>{t.btn_save}</Button>
          </>
        }
      >
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            
            <div className="md:col-span-2 pt-2">
               <div className="flex items-center gap-2">
                  <Toggle checked={formData.active} onChange={val => setFormData({...formData, active: val})} />
                  <span className="text-sm font-medium text-slate-700">این ارز در سیستم فعال باشد</span>
               </div>
            </div>
         </div>
      </Modal>

      {/* History Modal */}
      <Modal isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} title="تاریخچه بروزرسانی نرخ‌ها" size="lg">
         <div className="h-96">
            <DataGrid columns={historyColumns} data={historyLog} isRtl={isRtl} />
         </div>
      </Modal>

    </div>
  );
};

window.CurrencySettings = CurrencySettings;
