/* Filename: components/Parties.js */
import React, { useState, useMemo, useEffect, useRef } from 'react';
import * as LucideIcons from 'lucide-react';

const Parties = ({ t, isRtl }) => {
  const UI = window.UI || {};
  const { 
    Button, InputField, SelectField, Toggle, Badge, 
    DataGrid, Modal, ToggleChip, SelectionGrid, DatePicker, FilterSection 
  } = UI;

  const { 
    Users, Building2, User, Plus, Edit, Trash2, Check, X, 
    MapPin, Phone, Mail, Globe, Hash, ShieldAlert,
    CreditCard, Info, Search, ChevronDown
  } = LucideIcons;

  // --- INTERNAL COMPONENT: MULTI-SELECT ---
  const MultiSelect = ({ options, value = [], onChange, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const containerRef = useRef(null);

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (containerRef.current && !containerRef.current.contains(event.target)) setIsOpen(false);
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredOptions = options.filter(opt => opt.label.toLowerCase().includes(searchTerm.toLowerCase()));
    const toggleOption = (id) => {
      const newValue = value.includes(id) ? value.filter(v => v !== id) : [...value, id];
      onChange(newValue);
    };

    return (
      <div className="relative" ref={containerRef}>
        <div className="min-h-[32px] bg-white border border-slate-200 rounded-md flex flex-wrap items-center gap-1 p-1 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
          {value.length === 0 && <span className="text-slate-400 text-[11px] px-1">{placeholder}</span>}
          {value.map(id => (
            <span key={id} className="bg-indigo-50 text-indigo-700 border border-indigo-100 rounded px-1.5 py-0.5 text-[10px] flex items-center gap-1">
              {options.find(o => o.id === id)?.label}
              <X size={10} onClick={(e) => { e.stopPropagation(); onChange(value.filter(v => v !== id)); }}/>
            </span>
          ))}
          <div className="ml-auto px-1 text-slate-400"><ChevronDown size={14}/></div>
        </div>
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-md shadow-lg z-[100] max-h-48 overflow-y-auto p-2">
            <input className="w-full text-[11px] border border-slate-200 rounded px-2 py-1 mb-2 outline-none" placeholder="جستجو..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} onClick={e => e.stopPropagation()}/>
            {filteredOptions.map(opt => (
              <div key={opt.id} className={`px-3 py-2 text-[11px] cursor-pointer hover:bg-slate-50 flex items-center justify-between ${value.includes(opt.id) ? 'bg-indigo-50 text-indigo-700 font-bold' : ''}`} onClick={() => toggleOption(opt.id)}>
                {opt.label} {value.includes(opt.id) && <Check size={12}/>}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const PARTY_ROLES = [
    { id: 'employee', label: 'کارمند' }, { id: 'customer', label: 'مشتری' },
    { id: 'supplier', label: 'تامین کننده' }, { id: 'contractor', label: 'پیمانکار' },
    { id: 'shareholder', label: 'سهامدار' }, { id: 'logistics', label: 'شرکت حمل و نقل' },
    { id: 'cashier', label: 'صندوقدار' }, { id: 'petty_cashier', label: 'تنخواه دار' },
    { id: 'bank', label: 'بانک' }, { id: 'trustee', label: 'طرف حساب امانی' }, { id: 'other', label: 'سایر' }
  ];

  // --- STATES ---
  const [parties, setParties] = useState([
    { id: 1, type: 'person', firstName: 'علی', lastName: 'محمدی', fullName: 'علی محمدی', nationalId: '1270001122', nationality: 'iranian', isActive: true, roles: ['customer'], detailCode: '101001', addresses: ['تهران، خیابان ولیعصر'] },
    { id: 2, type: 'company', name: 'شرکت فناوران نوین', fullName: 'شرکت فناوران نوین', nationalId: '1010254877', nationality: 'iranian', isActive: true, roles: ['supplier'], detailCode: '', addresses: ['اصفهان، شهرک صنعتی'] },
  ]);

  const [filterValues, setFilterValues] = useState({ roles: [], detailCode: '', status: 'all', type: 'all' });
  const [appliedFilters, setAppliedFilters] = useState({ roles: [], detailCode: '', status: 'all', type: 'all' });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingParty, setEditingParty] = useState(null);
  const [showDetailSidebar, setShowDetailSidebar] = useState(false);
  const [currentPartyForDetail, setCurrentPartyForDetail] = useState(null);

  const initialForm = {
    type: 'person', firstName: '', lastName: '', name: '', fullName: '',
    nationalId: '', alias: '', gender: 'male', fatherName: '', birthDate: '',
    birthCertificateNo: '', birthPlace: '', province: '', nationality: 'iranian',
    phone: '', mobile: '', email: '', website: '', regNo: '',
    addresses: [''], roles: [], isActive: true
  };
  const [formData, setFormData] = useState(initialForm);

  // --- FILTER LOGIC ---
  const filteredParties = useMemo(() => {
    return parties.filter(p => {
      const matchRole = appliedFilters.roles.length === 0 || appliedFilters.roles.some(r => p.roles?.includes(r));
      const matchDetail = !appliedFilters.detailCode || p.detailCode?.includes(appliedFilters.detailCode);
      const matchStatus = appliedFilters.status === 'all' || (appliedFilters.status === 'active' ? p.isActive : !p.isActive);
      const matchType = appliedFilters.type === 'all' || p.type === appliedFilters.type;
      return matchRole && matchDetail && matchStatus && matchType;
    });
  }, [parties, appliedFilters]);

  // --- HANDLERS ---
  const handleCreate = () => {
    setEditingParty(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const handleEdit = (row) => {
    setEditingParty(row);
    // Fix: Ensure addresses and roles are arrays even if missing in record to avoid .map error
    setFormData({
      ...row,
      addresses: row.addresses || [''],
      roles: row.roles || []
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (formData.type === 'person') {
      if (!formData.firstName || !formData.lastName || !formData.nationalId) return alert('پر کردن فیلدهای اجباری الزامی است');
    } else {
      if (!formData.name || !formData.nationalId) return alert('پر کردن فیلدهای اجباری الزامی است');
    }

    const finalFullName = formData.type === 'person' ? `${formData.firstName} ${formData.lastName}`.trim() : formData.name;
    const newParty = { ...formData, id: editingParty ? editingParty.id : Date.now(), fullName: finalFullName };

    if (editingParty) setParties(prev => prev.map(p => p.id === editingParty.id ? newParty : p));
    else setParties(prev => [...prev, newParty]);

    setIsModalOpen(false);
    setCurrentPartyForDetail(newParty);
    setShowDetailSidebar(true);
  };

  const columns = [
    { header: 'نوع', field: 'type', width: 'w-20', render: (r) => r.type === 'person' ? <User size={14} className="text-blue-500"/> : <Building2 size={14} className="text-indigo-500"/> },
    { header: 'نام کامل', field: 'fullName', width: 'w-48', render: (r) => <span className="font-bold text-slate-700">{r.fullName}</span> },
    { header: 'شناسه/کد ملی', field: 'nationalId', width: 'w-32', className: 'font-mono' },
    { header: 'کد تفصیلی', field: 'detailCode', width: 'w-32', render: (r) => r.detailCode ? <Badge variant="info">{r.detailCode}</Badge> : <div className="flex items-center gap-1 text-red-500 font-bold text-[10px] animate-pulse"><ShieldAlert size={12}/> کد تفصیلی ندارد</div> },
    { header: 'نقش‌ها', field: 'roles', width: 'w-40', render: (r) => <div className="flex flex-wrap gap-1">{(r.roles || []).map(role => <Badge key={role} variant="neutral">{PARTY_ROLES.find(pr => pr.id === role)?.label}</Badge>)}</div> },
    { header: 'وضعیت', field: 'isActive', width: 'w-20', render: (r) => <Toggle checked={r.isActive} onChange={() => {}} disabled /> }
  ];

  return (
    <div className={`flex flex-col h-full bg-slate-50/50 p-4 gap-4 overflow-hidden ${isRtl ? 'font-vazir' : 'font-sans'}`}>
      
      <div className="flex items-center justify-between shrink-0">
        <h1 className="text-xl font-black text-slate-800 flex items-center gap-2">
          <Users className="text-indigo-600" size={24}/> مدیریت اشخاص و شرکت‌ها
        </h1>
      </div>

      <FilterSection 
        title="جستجوی پیشرفته" 
        onSearch={() => setAppliedFilters(filterValues)} 
        onClear={() => { setFilterValues({ roles: [], detailCode: '', status: 'all', type: 'all' }); setAppliedFilters({ roles: [], detailCode: '', status: 'all', type: 'all' }); }}
        isRtl={isRtl}
      >
        <div className="space-y-1">
          <label className="block text-[11px] font-bold text-slate-600">نقش</label>
          <MultiSelect options={PARTY_ROLES} value={filterValues.roles} onChange={v => setFilterValues({...filterValues, roles: v})} placeholder="فیلتر نقش‌ها..." />
        </div>
        <InputField label="کد تفصیلی" value={filterValues.detailCode} onChange={e => setFilterValues({...filterValues, detailCode: e.target.value})} placeholder="جستجوی کد..." className="dir-ltr" />
        <SelectField label="وضعیت" value={filterValues.status} onChange={e => setFilterValues({...filterValues, status: e.target.value})}>
          <option value="all">همه وضعیت‌ها</option>
          <option value="active">فعال</option>
          <option value="inactive">غیرفعال</option>
        </SelectField>
        <SelectField label="نوع" value={filterValues.type} onChange={e => setFilterValues({...filterValues, type: e.target.value})}>
          <option value="all">همه انواع</option>
          <option value="person">شخص حقیقی</option>
          <option value="company">شخص حقوقی</option>
        </SelectField>
      </FilterSection>

      <div className="flex-1 min-h-0 flex gap-4">
        <div className="flex-1 min-w-0">
          <DataGrid 
            columns={columns} data={filteredParties} isRtl={isRtl}
            onCreate={handleCreate}
            actions={(row) => (
              <>
                <Button variant="ghost" size="iconSm" icon={Edit} onClick={() => handleEdit(row)} />
                <Button variant="ghost" size="iconSm" icon={CreditCard} className="text-purple-600" onClick={() => { setCurrentPartyForDetail(row); setShowDetailSidebar(true); }} />
              </>
            )}
          />
        </div>

        {showDetailSidebar && (
          <div className="w-80 bg-white border border-slate-200 rounded-lg shadow-xl flex flex-col shrink-0 animate-in slide-in-from-left-4">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-indigo-50 rounded-t-lg">
              <span className="font-bold text-indigo-900 text-sm">تخصیص کد تفصیلی</span>
              <X size={18} className="cursor-pointer text-indigo-400" onClick={() => setShowDetailSidebar(false)}/>
            </div>
            <div className="p-4 flex-1 space-y-4">
              <div className="bg-slate-50 p-3 rounded border border-slate-200">
                 <div className="text-[10px] text-slate-400 mb-1">نام طرف حساب:</div>
                 <div className="font-black text-slate-800 text-xs">{currentPartyForDetail?.fullName}</div>
              </div>
              <InputField label="کد تفصیلی" value={currentPartyForDetail?.detailCode || ''} onChange={(e) => {
                  const val = e.target.value;
                  setCurrentPartyForDetail({...currentPartyForDetail, detailCode: val});
                  setParties(prev => prev.map(p => p.id === currentPartyForDetail.id ? {...p, detailCode: val} : p));
                }} className="dir-ltr" />
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100 rounded-b-lg">
              <Button variant="primary" className="w-full" onClick={() => setShowDetailSidebar(false)}>تایید و بستن</Button>
            </div>
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingParty ? "ویرایش اطلاعات" : "تعریف شخص/شرکت جدید"} size="xl"
        footer={<><Button variant="secondary" onClick={() => setIsModalOpen(false)}>انصراف</Button><Button variant="primary" icon={Check} onClick={handleSave}>ذخیره</Button></>}>
        <div className="space-y-6">
          <div className="flex gap-4 p-2 bg-slate-50 rounded-lg justify-center">
             <ToggleChip label="شخص حقیقی" checked={formData.type === 'person'} onClick={() => setFormData({...formData, type: 'person'})} colorClass="indigo" />
             <ToggleChip label="شخص حقوقی" checked={formData.type === 'company'} onClick={() => setFormData({...formData, type: 'company'})} colorClass="indigo" />
          </div>

          <div className="grid grid-cols-4 gap-4 items-end">
            <div className="col-span-1 flex items-center h-8"><Toggle checked={formData.isActive} onChange={v => setFormData({...formData, isActive: v})} label="وضعیت فعال" /></div>
            {formData.type === 'person' ? (
              <>
                <InputField label="نام *" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
                <InputField label="نام خانوادگی *" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
                <InputField label="کد ملی / اتباع *" value={formData.nationalId} onChange={e => setFormData({...formData, nationalId: e.target.value})} />
                <InputField label="نام کامل" value={`${formData.firstName} ${formData.lastName}`} disabled className="bg-slate-100" />
                <InputField label="نام مستعار" value={formData.alias} onChange={e => setFormData({...formData, alias: e.target.value})} />
                <SelectField label="جنسیت" value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}>
                  <option value="male">مرد</option><option value="female">زن</option>
                </SelectField>
                <InputField label="نام پدر" value={formData.fatherName} onChange={e => setFormData({...formData, fatherName: e.target.value})} />
                <DatePicker label="تاریخ تولد" value={formData.birthDate} onChange={e => setFormData({...formData, birthDate: e.target.value})} />
                <InputField label="شماره شناسنامه" value={formData.birthCertificateNo} onChange={e => setFormData({...formData, birthCertificateNo: e.target.value})} />
                <InputField label="محل تولد" value={formData.birthPlace} onChange={e => setFormData({...formData, birthPlace: e.target.value})} />
                <InputField label="استان محل زندگی" value={formData.province} onChange={e => setFormData({...formData, province: e.target.value})} />
              </>
            ) : (
              <>
                <InputField label="نام شرکت *" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="col-span-2" />
                <InputField label="شناسه ملی *" value={formData.nationalId} onChange={e => setFormData({...formData, nationalId: e.target.value})} />
                <InputField label="شماره ثبت" value={formData.regNo} onChange={e => setFormData({...formData, regNo: e.target.value})} />
                <InputField label="وب‌سایت" value={formData.website} onChange={e => setFormData({...formData, website: e.target.value})} />
                <InputField label="شناسه ملی" value={formData.nationalId} disabled className="bg-slate-100" />
              </>
            )}
            <SelectField label="تابعیت *" value={formData.nationality} onChange={e => setFormData({...formData, nationality: e.target.value})}>
              <option value="iranian">ایرانی</option><option value="foreign">غیر ایرانی</option>
            </SelectField>
            <InputField label="تلفن" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
            <InputField label="تلفن همراه" value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} />
            <InputField label="پست الکترونیک" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          </div>

          <div className="space-y-2 border-t pt-4">
            <div className="flex justify-between items-center"><label className="text-[11px] font-bold text-slate-600">آدرس‌ها</label><Button size="sm" variant="ghost" icon={Plus} onClick={() => setFormData({...formData, addresses: [...(formData.addresses || []), '']})}>افزودن آدرس</Button></div>
            {(formData.addresses || ['']).map((addr, idx) => (
              <div key={idx} className="flex gap-2"><InputField placeholder={`آدرس ${idx + 1}`} value={addr} onChange={e => { const n = [...formData.addresses]; n[idx] = e.target.value; setFormData({...formData, addresses: n}); }} />{idx > 0 && <Button variant="ghost" size="iconSm" icon={X} className="text-red-500" onClick={() => setFormData({...formData, addresses: formData.addresses.filter((_, i) => i !== idx)})} />}</div>
            ))}
          </div>

          <div className="border-t pt-4">
            <label className="block text-[11px] font-bold text-slate-600 mb-3">نقش‌ها</label>
            <SelectionGrid items={PARTY_ROLES} selectedIds={formData.roles || []} onToggle={id => { const r = formData.roles || []; const n = r.includes(id) ? r.filter(x => x !== id) : [...r, id]; setFormData({...formData, roles: n}); }} />
          </div>
        </div>
      </Modal>
    </div>
  );
};

window.Parties = Parties;
