/* Filename: components/OrganizationInfo.js */
import React, { useState } from 'react';
import { 
  Building2, Search, Plus, Edit, Trash2, MapPin, 
  Phone, FileText, Upload, X, Save, Printer 
} from 'lucide-react';

const OrganizationInfo = ({ t, isRtl }) => {
  const UI = window.UI || {};
  const { Button, InputField, DataGrid, FilterSection, Modal, Badge } = UI;

  // --- States ---
  const [data, setData] = useState([
    { id: 1, code: 'ORG-001', name: 'دفتر مرکزی تهران', regNo: '123456', phone: '021-88888888', fax: '021-88888889', logo: null, addresses: [{ id: 1, text: 'تهران، میدان ونک، خیابان ملاصدرا' }] },
    { id: 2, code: 'ORG-002', name: 'شعبه اصفهان', regNo: '654321', phone: '031-33333333', fax: '031-33333334', logo: null, addresses: [] },
  ]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  
  // Form States
  const [formData, setFormData] = useState({});
  const [newAddress, setNewAddress] = useState('');

  // --- Columns Definition ---
  const columns = [
    { field: 'code', header: t.colId || 'کد', width: 'w-24', sortable: true },
    { field: 'name', header: t.ph_name || 'نام سازمان', width: 'w-64', sortable: true },
    { field: 'regNo', header: 'شماره ثبت', width: 'w-32' },
    { field: 'phone', header: t.ph_phone || 'تلفن', width: 'w-32' },
    { 
      field: 'addressCount', 
      header: 'تعداد آدرس', 
      width: 'w-24', 
      render: (row) => <Badge variant="info">{row.addresses?.length || 0}</Badge> 
    }
  ];

  // --- Handlers ---
  const handleOpenModal = (record = null) => {
    if (record) {
      setFormData({ ...record });
    } else {
      setFormData({ code: '', name: '', regNo: '', phone: '', fax: '', logo: null, addresses: [] });
    }
    setCurrentRecord(record);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.code || !formData.name) {
      alert(isRtl ? 'لطفاً کد و نام سازمان را وارد کنید.' : 'Please enter Organization Code and Name.');
      return;
    }

    if (currentRecord) {
      setData(prev => prev.map(item => item.id === currentRecord.id ? { ...formData, id: item.id } : item));
    } else {
      setData(prev => [...prev, { ...formData, id: Date.now() }]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (ids) => {
    if (confirm(t.confirm_delete.replace('{0}', ids.length))) {
      setData(prev => prev.filter(item => !ids.includes(item.id)));
      setSelectedIds([]);
    }
  };

  const handleAddAddress = () => {
    if (!newAddress.trim()) return;
    setFormData(prev => ({
      ...prev,
      addresses: [...(prev.addresses || []), { id: Date.now(), text: newAddress }]
    }));
    setNewAddress('');
  };

  const handleRemoveAddress = (addrId) => {
    setFormData(prev => ({
      ...prev,
      addresses: prev.addresses.filter(a => a.id !== addrId)
    }));
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // In a real app, upload to server. Here just mock URL object
      const url = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, logo: url }));
    }
  };

  return (
    <div className="flex flex-col h-full p-4 md:p-6 bg-slate-50/50">
      <div className="mb-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-200">
            <Building2 size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-800">معرفی سازمان</h1>
            <p className="text-xs text-slate-500 font-medium mt-1">مدیریت اطلاعات پایه شرکت و شعبه‌ها</p>
          </div>
        </div>
      </div>

      <FilterSection isRtl={isRtl} onSearch={() => {}} onClear={() => {}}>
        <InputField label={t.colId || 'کد'} placeholder="..." isRtl={isRtl} />
        <InputField label={t.ph_name || 'نام'} placeholder="..." isRtl={isRtl} />
      </FilterSection>

      <div className="flex-1 min-h-0 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <DataGrid 
          columns={columns} 
          data={data} 
          selectedIds={selectedIds}
          onSelectRow={(id, checked) => setSelectedIds(prev => checked ? [...prev, id] : prev.filter(x => x !== id))}
          onSelectAll={(checked) => setSelectedIds(checked ? data.map(d => d.id) : [])}
          onCreate={() => handleOpenModal()}
          onDelete={handleDelete}
          isRtl={isRtl}
          actions={(row) => (
            <>
              <Button variant="ghost" size="iconSm" icon={Edit} onClick={() => handleOpenModal(row)} />
              <Button variant="ghost" size="iconSm" icon={Trash2} className="text-red-500 hover:text-red-600" onClick={() => handleDelete([row.id])} />
            </>
          )}
        />
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={currentRecord ? 'ویرایش اطلاعات سازمان' : 'تعریف سازمان جدید'}
        size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>{t.btn_cancel}</Button>
            <Button variant="primary" icon={Save} onClick={handleSave}>{t.btn_save}</Button>
          </>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Logo Section */}
          <div className="md:col-span-2 flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
             {formData.logo ? (
               <div className="relative group">
                 <img src={formData.logo} alt="Logo" className="h-24 object-contain" />
                 <button 
                   onClick={() => setFormData(prev => ({ ...prev, logo: null }))}
                   className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                 >
                   <X size={12}/>
                 </button>
               </div>
             ) : (
               <div className="text-center">
                 <Upload size={32} className="mx-auto text-slate-400 mb-2"/>
                 <label className="cursor-pointer text-indigo-600 font-bold text-sm hover:underline">
                   <span>انتخاب تصویر لوگو</span>
                   <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                 </label>
                 <p className="text-[10px] text-slate-400 mt-1">PNG, JPG up to 2MB</p>
               </div>
             )}
          </div>

          <InputField 
            label="کد شرکت *" 
            value={formData.code} 
            onChange={e => setFormData({...formData, code: e.target.value})} 
            isRtl={isRtl} 
            className="dir-ltr"
          />
          <InputField 
            label="نام شرکت *" 
            value={formData.name} 
            onChange={e => setFormData({...formData, name: e.target.value})} 
            isRtl={isRtl} 
          />
          <InputField 
            label="شماره ثبت" 
            value={formData.regNo} 
            onChange={e => setFormData({...formData, regNo: e.target.value})} 
            isRtl={isRtl} 
            className="dir-ltr"
          />
          <div className="grid grid-cols-2 gap-4">
             <InputField 
               label="تلفن" 
               value={formData.phone} 
               onChange={e => setFormData({...formData, phone: e.target.value})} 
               isRtl={isRtl} 
               className="dir-ltr"
             />
             <InputField 
               label="فکس" 
               value={formData.fax} 
               onChange={e => setFormData({...formData, fax: e.target.value})} 
               isRtl={isRtl} 
               className="dir-ltr"
             />
          </div>

          {/* Addresses Section */}
          <div className="md:col-span-2 bg-slate-50 rounded-xl p-4 border border-slate-200">
             <label className="block text-[11px] font-bold text-slate-600 mb-2 flex items-center gap-2">
               <MapPin size={14}/> آدرس‌ها
             </label>
             
             <div className="flex gap-2 mb-3">
               <InputField 
                 placeholder="آدرس جدید را وارد کنید..." 
                 value={newAddress} 
                 onChange={e => setNewAddress(e.target.value)} 
                 isRtl={isRtl}
                 className="bg-white"
               />
               <Button variant="secondary" icon={Plus} onClick={handleAddAddress} />
             </div>

             <div className="space-y-2 max-h-32 overflow-y-auto custom-scrollbar">
               {formData.addresses?.map((addr, idx) => (
                 <div key={addr.id} className="flex items-center justify-between bg-white p-2 rounded-lg border border-slate-200 text-xs">
                    <span className="truncate flex-1">{addr.text}</span>
                    <button onClick={() => handleRemoveAddress(addr.id)} className="text-slate-400 hover:text-red-500 px-2">
                      <Trash2 size={14}/>
                    </button>
                 </div>
               ))}
               {(!formData.addresses || formData.addresses.length === 0) && (
                 <p className="text-center text-[10px] text-slate-400 italic py-2">آدرسی ثبت نشده است</p>
               )}
             </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

window.OrganizationInfo = OrganizationInfo;
