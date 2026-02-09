/* Filename: components/UserProfile.js */
import React, { useState, useEffect } from 'react';
import { 
  User, Mail, Lock, Globe, Moon, Sun, Save, 
  CheckCircle2, Shield, Settings, ChevronRight, 
  ChevronLeft, Bell, Key, Database, ChevronDown,
  Layout, Type
} from 'lucide-react';

const UserProfile = ({ t, isRtl, onLanguageChange }) => {
  const UI = window.UI || {};
  const { Button, InputField, SelectField, Toggle, Badge } = UI;
  const DEFAULT_VALUES_SCHEMA = window.DEFAULT_VALUES_SCHEMA || [];

  // --- States ---
  const [activeTab, setActiveTab] = useState('personal'); // personal, security, prefs, defaults
  const [theme, setTheme] = useState('light');
  
  // Password State
  const [passMode, setPassMode] = useState('view'); // view, edit
  
  // Default Values State
  const [defaultValues, setDefaultValues] = useState({});
  const [expandedModules, setExpandedModules] = useState(['accounting']);

  // Mock User Data
  const userInfo = {
    username: 'admin',
    email: 'admin@fincorp.co',
    role: 'System Admin',
    lastLogin: '2025/02/09 08:30'
  };

  // --- Handlers ---
  const handleSaveDefaults = () => {
    alert(t.defaultsSaved || 'Default values saved successfully.');
  };

  const toggleModule = (moduleId) => {
    setExpandedModules(prev => 
      prev.includes(moduleId) ? prev.filter(id => id !== moduleId) : [...prev, moduleId]
    );
  };

  const handleDefaultValueChange = (key, value) => {
    setDefaultValues(prev => ({ ...prev, [key]: value }));
  };

  // --- Sidebar Render (Tree Menu Style) ---
  const renderSidebar = () => {
    const tabs = [
      { id: 'personal', icon: User, label: t.personalInfo },
      { id: 'security', icon: Shield, label: t.security },
      { id: 'prefs', icon: Settings, label: t.preferences },
      { id: 'defaults', icon: Database, label: t.defaultValues },
    ];

    return (
      <div className="w-full md:w-64 shrink-0 flex flex-col gap-2">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-3 border-b border-slate-100 bg-slate-50/50">
            <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-wider">
              {t.profileTitle || 'Profile Settings'}
            </h3>
          </div>
          <div className="p-2 space-y-1">
            {tabs.map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[12px] font-bold transition-all duration-200
                    ${isActive 
                      ? 'bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-200/50' 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}
                  `}
                >
                  <tab.icon size={16} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'text-indigo-600' : 'text-slate-400'} />
                  <span>{tab.label}</span>
                  {isActive && (
                    <div className={`ml-auto ${isRtl ? 'rotate-180' : ''}`}>
                      <ChevronRight size={14} className="text-indigo-400" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // --- Content Renderers ---

  const renderPersonalInfo = () => (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-center gap-5 mb-6 pb-6 border-b border-slate-100">
        <div className="w-20 h-20 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 border border-indigo-100 shadow-inner">
          <User size={40} strokeWidth={1.5} />
        </div>
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">{userInfo.username}</h2>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="purple">{userInfo.role}</Badge>
            <span className="text-[10px] text-slate-400 px-2 border-l border-slate-200 h-3 flex items-center">
              ID: #89204
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        <InputField 
          label={t.usernameLabel} 
          value={userInfo.username} 
          disabled 
          icon={User} 
          isRtl={isRtl}
          className="bg-slate-50 text-slate-500 border-slate-200"
        />
        <InputField 
          label={t.emailLabel} 
          value={userInfo.email} 
          disabled 
          icon={Mail} 
          isRtl={isRtl} 
          className="bg-slate-50 text-slate-500 border-slate-200 dir-ltr"
        />
        <InputField 
          label={isRtl ? "آخرین زمان ورود" : "Last Login"} 
          value={userInfo.lastLogin} 
          disabled 
          isRtl={isRtl} 
          className="bg-slate-50 text-slate-500 border-slate-200 dir-ltr"
        />
        <InputField 
          label={isRtl ? "واحد سازمانی" : "Department"} 
          value={isRtl ? "مدیریت محصول" : "Product Management"} 
          disabled 
          isRtl={isRtl} 
          className="bg-slate-50 text-slate-500 border-slate-200"
        />
      </div>
    </div>
  );

  const renderSecurity = () => (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-start justify-between">
           <div className="flex gap-3">
              <div className="p-2 bg-amber-50 text-amber-600 rounded-lg border border-amber-100">
                 <Key size={18}/>
              </div>
              <div>
                 <h3 className="text-sm font-bold text-slate-800">{t.changePass}</h3>
                 <p className="text-xs text-slate-500 mt-1 leading-relaxed max-w-md">{t.changePassDesc}</p>
              </div>
           </div>
           {passMode === 'view' && (
             <Button variant="outline" size="sm" onClick={() => setPassMode('edit')}>
               {t.edit || 'Change'}
             </Button>
           )}
        </div>

        {passMode === 'edit' && (
          <div className="p-4 bg-slate-50/50 space-y-4">
            <InputField 
              label={t.currentPass} 
              type="password" 
              placeholder="••••••••" 
              isRtl={isRtl}
              className="bg-white"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField 
                label={t.newPasswordLabel} 
                type="password" 
                placeholder="••••••••" 
                isRtl={isRtl}
                className="bg-white"
              />
              <InputField 
                label={t.confirmPasswordLabel} 
                type="password" 
                placeholder="••••••••" 
                isRtl={isRtl}
                className="bg-white"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" onClick={() => setPassMode('view')}>{t.btn_cancel}</Button>
              <Button variant="primary" onClick={() => { alert(t.resetSuccess); setPassMode('view'); }}>
                {t.updatePassword}
              </Button>
            </div>
          </div>
        )}
      </div>
      
      <div className="bg-white border border-slate-200 rounded-xl p-4 opacity-60 pointer-events-none grayscale">
         <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 text-green-600 rounded-lg border border-green-100">
               <Shield size={18}/>
            </div>
            <div>
               <h3 className="text-sm font-bold text-slate-800">Two-Factor Authentication (2FA)</h3>
               <p className="text-[10px] text-slate-500 mt-1">Managed by System Administrator</p>
            </div>
         </div>
      </div>
    </div>
  );

  const renderPreferences = () => (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="grid grid-cols-1 gap-4">
        {/* Language */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
          <label className="text-[13px] font-bold text-slate-800 mb-3 flex items-center gap-2">
            <Globe size={16} className="text-blue-500" /> 
            {t.langSettings}
          </label>
          <div className="grid grid-cols-2 gap-3">
             <button 
               onClick={() => onLanguageChange('fa')}
               className={`
                 relative overflow-hidden p-3 rounded-lg border transition-all text-right group
                 ${isRtl 
                   ? 'border-blue-500 bg-blue-50/50' 
                   : 'border-slate-100 bg-slate-50 hover:border-slate-300'}
               `}
             >
               <div className="font-bold text-slate-800 text-xs mb-0.5">فارسی</div>
               <div className="text-[10px] text-slate-500">Persian (Iran)</div>
               {isRtl && <div className="absolute top-0 left-0 w-0 h-0 border-t-[30px] border-l-[30px] border-t-blue-500 border-l-transparent -scale-x-100 z-10"></div>}
               {isRtl && <CheckCircle2 size={12} className="absolute top-1 left-1 text-white z-20"/>}
             </button>

             <button 
               onClick={() => onLanguageChange('en')}
               className={`
                 relative overflow-hidden p-3 rounded-lg border transition-all text-left group
                 ${!isRtl 
                   ? 'border-blue-500 bg-blue-50/50' 
                   : 'border-slate-100 bg-slate-50 hover:border-slate-300'}
               `}
             >
               <div className="font-bold text-slate-800 text-xs mb-0.5">English</div>
               <div className="text-[10px] text-slate-500">United States</div>
               {!isRtl && <div className="absolute top-0 right-0 w-0 h-0 border-t-[30px] border-r-[30px] border-t-blue-500 border-r-transparent z-10"></div>}
               {!isRtl && <CheckCircle2 size={12} className="absolute top-1 right-1 text-white z-20"/>}
             </button>
          </div>
        </div>

        {/* Theme */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
          <label className="text-[13px] font-bold text-slate-800 mb-3 flex items-center gap-2">
            <Type size={16} className="text-orange-500" /> 
            {t.theme}
          </label>
          <div className="grid grid-cols-2 gap-3">
             <button 
               onClick={() => setTheme('light')}
               className={`
                 flex flex-col items-center justify-center p-3 rounded-lg border transition-all gap-1.5
                 ${theme === 'light' 
                   ? 'border-orange-500 bg-orange-50/30 text-orange-700' 
                   : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-300'}
               `}
             >
               <Sun size={20} strokeWidth={1.5} />
               <span className="font-bold text-xs">{t.themeLight}</span>
             </button>

             <button 
               onClick={() => setTheme('dark')}
               className={`
                 flex flex-col items-center justify-center p-3 rounded-lg border transition-all gap-1.5
                 ${theme === 'dark' 
                   ? 'border-slate-700 bg-slate-800 text-white' 
                   : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-300'}
               `}
             >
               <Moon size={20} strokeWidth={1.5} />
               <span className="font-bold text-xs">{t.themeDark}</span>
             </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDefaults = () => (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Moved Save Button to Top inside the Info Box */}
      <div className="bg-blue-50 border border-blue-100 p-3 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
         <div className="flex items-start gap-3">
            <div className="p-1.5 bg-white rounded-lg shadow-sm text-blue-600">
               <Database size={18}/>
            </div>
            <div>
               <h4 className="font-bold text-blue-900 text-xs mb-0.5">{t.defaultValues}</h4>
               <p className="text-[11px] text-blue-700/80 leading-relaxed">{t.defaultValuesDesc}</p>
            </div>
         </div>
         <Button variant="primary" icon={Save} onClick={handleSaveDefaults} size="sm" className="shadow-md shadow-indigo-200 shrink-0">
            {t.saveDefaults}
         </Button>
      </div>

      <div className="space-y-2">
        {DEFAULT_VALUES_SCHEMA.map(moduleDef => {
          const isExpanded = expandedModules.includes(moduleDef.moduleId);
          const ModuleIcon = moduleDef.icon || Settings;
          
          return (
            <div key={moduleDef.moduleId} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm transition-all hover:shadow-md">
              <button 
                onClick={() => toggleModule(moduleDef.moduleId)}
                className="w-full flex items-center justify-between p-3 bg-white hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-lg transition-colors ${isExpanded ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
                    <ModuleIcon size={18} />
                  </div>
                  <span className="font-bold text-slate-800 text-sm">{moduleDef.label[isRtl ? 'fa' : 'en']}</span>
                </div>
                <div className={`text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                  <ChevronDown size={18} />
                </div>
              </button>

              {isExpanded && (
                <div className="p-4 pt-2 border-t border-slate-100 animate-in slide-in-from-top-2">
                  {moduleDef.groups.map(group => (
                    <div key={group.groupId} className="mb-4 last:mb-0">
                      <div className="flex items-center gap-2 mb-3">
                         <div className="h-px bg-slate-200 flex-1"></div>
                         <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider bg-white px-2">
                           {group.label[isRtl ? 'fa' : 'en']}
                         </h4>
                         <div className="h-px bg-slate-200 flex-1"></div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {group.fields.map(field => {
                          const fieldLabel = field.label[isRtl ? 'fa' : 'en'];
                          const fieldKey = `${moduleDef.moduleId}.${group.groupId}.${field.key}`;
                          
                          if (field.type === 'select') {
                            return (
                              <SelectField 
                                key={fieldKey}
                                label={fieldLabel} 
                                isRtl={isRtl}
                                value={defaultValues[fieldKey] || ''}
                                onChange={(e) => handleDefaultValueChange(fieldKey, e.target.value)}
                              >
                                <option value="">- {isRtl ? 'انتخاب کنید' : 'Select'} -</option>
                                {field.options.map(opt => (
                                  <option key={opt.value} value={opt.value}>
                                    {opt.label[isRtl ? 'fa' : 'en']}
                                  </option>
                                ))}
                              </SelectField>
                            );
                          } else if (field.type === 'toggle') {
                             return (
                               <div key={fieldKey} className="flex items-end h-full pb-2">
                                 <Toggle 
                                    label={fieldLabel} 
                                    checked={defaultValues[fieldKey] || false}
                                    onChange={(val) => handleDefaultValueChange(fieldKey, val)}
                                 />
                               </div>
                             );
                          }
                          return null;
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className={`flex flex-col h-full bg-slate-50/50 p-4 md:p-6 overflow-hidden ${isRtl ? 'font-vazir' : 'font-sans'}`}>
      <div className="mb-6 shrink-0 flex items-center justify-between">
         <div>
            <h1 className="text-xl font-black text-slate-900">{t.profileTitle}</h1>
            <p className="text-xs font-medium text-slate-500 mt-1">{t.profileSubtitle}</p>
         </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 flex-1 min-h-0 overflow-hidden">
        {renderSidebar()}
        
        <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 overflow-y-auto custom-scrollbar">
          {activeTab === 'personal' && renderPersonalInfo()}
          {activeTab === 'security' && renderSecurity()}
          {activeTab === 'prefs' && renderPreferences()}
          {activeTab === 'defaults' && renderDefaults()}
        </div>
      </div>
    </div>
  );
};

window.UserProfile = UserProfile;
