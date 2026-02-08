/* Filename: components/Parties.js */
import React, { useState, useMemo, useEffect } from 'react';
import { 
  UserGroupIcon, BuildingOfficeIcon, UserIcon 
} from '@heroicons/react/24/outline'; // Note: Project uses Lucide, switching to Lucide
import { 
  Users, Building2, Plus, Edit, Trash2, Check, X, 
  MapPin, Phone, Mail, Globe, Hash, ShieldAlert,
  ChevronLeft, Save, UserCheck, CreditCard
} from 'lucide-react';

const Parties = ({ t, isRtl }) => {
  const UI = window.UI || {};
  const { Button, InputField, SelectField, Toggle, Badge, DataGrid, Modal, ToggleChip, SelectionGrid } = UI;

  const [parties, setParties] = useState([
    { id: 1, type: 'person', firstName: 'علی', lastName: 'محمدی', fullName: 'علی محمدی', nationalId: '1270001122', nationality: 'iranian', isActive: true, roles: ['customer'], detailCode: '101001' },
    { id: 2, type: 'company', name: 'شرکت فناوران نوین', fullName: 'شرکت فناوران نوین', nationalId: '1010254877', nationality: 'iranian', isActive: true, roles: ['supplier'], detailCode: '' },
  ]);

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

  const PARTY_ROLES = [
    { id: 'employee', label: 'کارمند' }, { id: 'customer', label: 'مشتری' },
    { id: 'supplier', label: 'تامین کننده' }, { id: 'contractor', label: 'پیمانکار' },
    { id: 'shareholder', label: 'سهامدار' }, { id: 'logistics', label: 'شرکت حمل و نقل' },
    { id: 'cashier', label: 'صندوقدار' }, { id: 'petty_cashier', label: 'تنخواه دار' },
    { id: 'bank', label: 'بانک' }, { id: 'trustee', label: 'طرف حساب امانی' }, { id: 'other', label: 'سایر' }
  ];

  const handleCreate = () => {
    setEditingParty(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    // Basic Validation
    if (formData.type === 'person' && (!formData.firstName || !formData.lastName || !formData.nationalId)) return alert('فیلدهای اجباری شخص حقیقی را پر کنید');
    if (formData.type === 'company' && (!formData.name || !formData.nationalId)) return alert('فیلدهای اجباری شخص حقوقی را پر کنید');

    const newParty = { 
      ...formData, 
      id: editingParty ? editingParty.id : Date.now(),
      fullName: formData.type === 'person' ? `${formData.firstName} ${formData.lastName}` : formData.name,
      detailCode: editingParty?.detailCode || ''
    };

    if (editingParty) setParties(prev => prev.map(p => p.id === editingParty.id ? newParty : p));
    else setParties(prev => [...prev, newParty]);

    setIsModalOpen(false);
    // Show detail code assignment after save
    setCurrentPartyForDetail(newParty);
    setShowDetailSidebar(true);
  };

  const columns = [
    { header: 'نوع', field: 'type', width: 'w-20', render: (r) => r.type === 'person' ? <UserIcon size={14} className="text-blue-500"/> : <Building2 size={14} className="text-indigo-500"/> },
    { header: 'نام کامل', field: 'fullName', width: 'w-48', render: (r) => <span className="font-bold">{r.fullName}</span> },
    { header: 'شناسه/کد ملی', field: 'nationalId', width: 'w-32', className: 'font-mono' },
    { header: 'کد تفصیلی', field: 'detailCode', width: 'w-32', render: (r) => r.detailCode ? <Badge variant="info">{r.detailCode}</Badge> : <div className="flex items-center gap-1 text-red-500 font-bold text-[10px] animate-pulse"><ShieldAlert size={12}/> کد تفصیلی ندارد</div> },
    { header: 'نقش‌ها', field: 'roles', width: 'w-40', render: (r) => <div className="flex flex-wrap gap-1">{r.roles.map(role => <Badge key={role} variant="neutral">{PARTY_ROLES.find(pr => pr.id === role)?.label}</Badge>)}</div> },
    { header: 'وضعیت', field: 'isActive', width: 'w-20', render: (r) => <Toggle checked={r.isActive} onChange={() => {}} disabled /> }
  ];

  return (
    <div className={`flex h-full bg-slate-50/50 p-4 gap-4 overflow-hidden ${isRtl ? 'font-vazir' : 'font-sans'}`}>
      <div className={`flex-1 flex flex-col min-w-0 transition-all ${showDetailSidebar ? 'w-2/3' : 'w-full'}`}>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-black text-slate-800 flex items-center gap-2"><Users className="text-indigo-600"/> مدیریت اشخاص و شرکت‌ها</h1>
        </div>

        <DataGrid 
          columns={columns} data={parties} isRtl={isRtl}
          onCreate={handleCreate}
          actions={(row) => (
            <>
              <Button variant="ghost" size="iconSm" icon={Edit} onClick={() => { setEditingParty(row); setFormData(row); setIsModalOpen(true); }} />
              <Button variant="ghost" size="iconSm" icon={CreditCard} className="text-purple-600" onClick={() => { setCurrentPartyForDetail(row); setShowDetailSidebar(true); }} title="کد تفصیلی" />
            </>
          )}
        />
      </div>

      {/* DETAIL CODE SIDEBAR */}
      {showDetailSidebar && (
        <div className="w-80 bg-white border border-slate-200 rounded-lg shadow-xl animate-in slide-in-from-left-5 flex flex-col">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-indigo-50 rounded-t-lg">
            <span className="font-bold text-indigo-900 text-sm">تخصیص کد تفصیلی</span>
            <X size={18} className="cursor-pointer text-indigo-400" onClick={() => setShowDetailSidebar(false)}/>
          </div>
          <div className="p-4 flex-1 space-y-4">
            <div className="bg-slate-50 p-3 rounded border border-slate-200">
               <div className="text-[10px] text-slate-400 mb-1">نام شخص/شرکت:</div>
               <div className="font-black text-slate-800 text-xs">{currentPartyForDetail?.fullName}</div>
            </div>
            <InputField label="کد تفصیلی" value={currentPartyForDetail?.detailCode || ''} 
              onChange={(e) => {
                const val = e.target.value;
                setCurrentPartyForDetail({...currentPartyForDetail, detailCode: val});
                setParties(prev => prev.map(p => p.id === currentPartyForDetail.id ? {...p, detailCode: val} : p));
              }} 
              placeholder="مثلا 101005" className="dir-ltr" />
            <div className="text-[10px] text-slate-400 leading-relaxed italic">پس از وارد کردن کد، سیستم به صورت اتوماتیک در دیتابیس مالی بروزرسانی انجام می‌دهد.</div>
          </div>
          <div className="p-4 bg-slate-50 border-t border-slate-100 rounded-b-lg">
            <Button variant="primary" className="w-full" onClick={() => setShowDetailSidebar(false)}>تایید و بستن</Button>
          </div>
        </div>
      )}

      {/* CREATE/EDIT MODAL */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingParty ? "ویرایش اطلاعات" : "تعریف شخص/شرکت جدید"} size="xl"
        footer={<><Button variant="secondary" onClick={() => setIsModalOpen(false)}>انصراف</Button><Button variant="primary" icon={Check} onClick={handleSave}>ذخیره اطلاعات</Button></>}>
        <div className="space-y-6">
          <div className="flex gap-4 p-2 bg-slate-50 rounded-lg justify-center">
             <ToggleChip label="شخص حقیقی" checked={formData.type === 'person'} onClick={() => setFormData({...formData, type: 'person'})} colorClass="indigo" />
             <ToggleChip label="شخص حقوقی" checked={formData.type === 'company'} onClick={() => setFormData({...formData, type: 'company'})} colorClass="indigo" />
          </div>

          <div className="grid grid-cols-3 gap-4">
            {formData.type === 'person' ? (
              <>
                <InputField label="نام *" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
                <InputField label="نام خانوادگی *" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
                <InputField label="نام کامل" value={`${formData.firstName} ${formData.lastName}`} disabled />
                <InputField label="کد ملی / اتباع *" value={formData.nationalId} onChange={e => setFormData({...formData, nationalId: e.target.value})} />
                <InputField label="نام مستعار" value={formData.alias} onChange={e => setFormData({...formData, alias: e.target.value})} />
                <SelectField label="جنسیت" value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}>
                  <option value="male">مرد</option><option value="female">زن</option>
                </SelectField>
                <InputField label="نام پدر" value={formData.fatherName} onChange={e => setFormData({...formData, fatherName: e.target.value})} />
                <DatePicker label="تاریخ تولد" value={formData.birthDate} onChange={e => setFormData({...formData, birthDate: e.target.value})} />
                <InputField label="شماره شناسنامه" value={formData.birthCertificateNo} onChange={e => setFormData({...formData, birthCertificateNo: e.target.value})} />
              </>
            ) : (
              <>
                <InputField label="نام شرکت *" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="col-span-2" />
                <InputField label="شناسه ملی *" value={formData.nationalId} onChange={e => setFormData({...formData, nationalId: e.target.value})} />
                <InputField label="شماره ثبت" value={formData.regNo} onChange={e => setFormData({...formData, regNo: e.target.value})} />
                <InputField label="وب‌سایت" value={formData.website} onChange={e => setFormData({...formData, website: e.target.value})} />
              </>
            )}
            <SelectField label="تابعیت *" value={formData.nationality} onChange={e => setFormData({...formData, nationality: e.target.value})}>
              <option value="iranian">ایرانی</option><option value="foreign">غیر ایرانی (اتباع)</option>
            </SelectField>
          </div>

          <div className="grid grid-cols-3 gap-4 border-t border-slate-100 pt-4">
            <InputField label="تلفن" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
            <InputField label="تلفن همراه" value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} />
            <InputField label="پست الکترونیک" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="text-[11px] font-bold text-slate-600">آدرس‌ها</label>
              <Button size="sm" variant="ghost" icon={Plus} onClick={() => setFormData({...formData, addresses: [...formData.addresses, '']})}>افزودن آدرس</Button>
            </div>
            {formData.addresses.map((addr, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <InputField placeholder={`آدرس ${idx + 1}`} value={addr} onChange={e => {
                  const newAddr = [...formData.addresses];
                  newAddr[idx] = e.target.value;
                  setFormData({...formData, addresses: newAddr});
                }} />
                {idx > 0 && <Button variant="ghost" size="iconSm" icon={X} className="text-red-400" onClick={() => setFormData({...formData, addresses: formData.addresses.filter((_, i) => i !== idx)})} />}
              </div>
            ))}
          </div>

          <div className="border-t border-slate-100 pt-4">
            <label className="block text-[11px] font-bold text-slate-600 mb-2">نقش‌ها در سیستم</label>
            <SelectionGrid 
              items={PARTY_ROLES} 
              selectedIds={formData.roles} 
              onToggle={id => {
                const newRoles = formData.roles.includes(id) ? formData.roles.filter(r => r !== id) : [...formData.roles, id];
                setFormData({...formData, roles: newRoles});
              }} 
            />
          </div>
          
          <div className="flex items-center justify-between border-t border-slate-100 pt-4">
            <Toggle checked={formData.isActive} onChange={v => setFormData({...formData, isActive: v})} label="وضعیت حساب (فعال/غیرفعال)" />
          </div>
        </div>
      </Modal>
    </div>
  );
};

window.Parties = Parties;
