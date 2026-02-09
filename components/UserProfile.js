/* Filename: components/UserProfile.js */
import React, { useState, useEffect } from 'react';
import { 
  User, Mail, Lock, Globe, Moon, Sun, Save, 
  CheckCircle2, Shield, Settings, ChevronRight, 
  ChevronLeft, Bell, Key, Database, ChevronDown
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
  const [passData, setPassData] = useState({ current: '', new: '', confirm: '' });

  // Default Values State
  const [defaultValues, setDefaultValues] = useState({});
  const [expandedModules, setExpandedModules] = useState(['accounting']); // For accordion

  // Mock User Data
  const userInfo = {
    username: 'admin',
    email: 'admin@fincorp.co',
    role: 'System Admin',
    lastLogin: '2025/02/09 08:30'
  };

  // --- Handlers ---
  const handleSaveDefaults = () => {
    // In a real app, this would make an API call
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

  // --- Render Sections ---
  
  const renderSidebar = () => {
    const tabs = [
      { id: 'personal', icon: User, label: t.personalInfo },
      { id: 'security', icon: Shield, label: t.security },
      { id: 'prefs', icon: Settings, label: t.preferences },
      { id: 'defaults', icon: Database, label: t.defaultValues },
    ];

    return (
      <div className={`w-full md:w-64 bg-white rounded-2xl border border-slate-200 p-4 shrink-0 h-fit`}>
        <div className="flex flex-col gap-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all
                ${activeTab === tab.id 
                  ? 'bg-indigo-50 text-indigo-700 shadow-sm' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}
              `}
            >
              <tab.icon size={18} strokeWidth={activeTab === tab.id ? 2.5 : 2} />
              <span>{tab.label}</span>
              {activeTab === tab.id && (
                <div className={`ml-auto ${isRtl ? 'rotate-180' : ''}`}>
                  <ChevronRight size={16} />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderPersonalInfo = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 border-4 border-white shadow-lg">
          <User size={40} />
        </div>
        <div>
          <h2 className="text-xl font-black text-slate-800">{userInfo.username}</h2>
          <Badge variant="purple" className="mt-1">{userInfo.role}</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField 
          label={t.usernameLabel} 
          value={userInfo.username} 
          disabled 
          icon={User} 
          isRtl={isRtl}
          className="opacity-75"
        />
        <InputField 
          label={t.emailLabel} 
          value={userInfo.email} 
          disabled 
          icon={Mail} 
          isRtl={isRtl} 
          className="dir-ltr opacity-75"
        />
        <InputField 
          label="آخرین ورود" 
          value={userInfo.lastLogin} 
          disabled 
          isRtl={isRtl} 
          className="dir-ltr opacity-75"
        />
      </div>
    </div>
  );

  const renderSecurity = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-sm">
              <Key size={20} className="text-amber-500" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">{t.changePass}</h3>
              <p className="text-xs text-slate-500 mt-1">{t.changePassDesc}</p>
            </div>
          </div>
          {passMode === 'view' && (
             <Button variant="outline" size="sm" onClick={() => setPassMode('edit')}>
               {t.edit}
             </Button>
          )}
        </div>

        {passMode === 'edit' && (
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <InputField 
              label={t.currentPass} 
              type="password" 
              placeholder="••••••••" 
              isRtl={isRtl}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField 
                label={t.newPasswordLabel} 
                type="password" 
                placeholder="••••••••" 
                isRtl={isRtl}
              />
              <InputField 
                label={t.confirmPasswordLabel} 
                type="password" 
                placeholder="••••••••" 
                isRtl={isRtl}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setPassMode('view')}>{t.btn_cancel}</Button>
              <Button variant="primary" onClick={() => { alert(t.resetSuccess); setPassMode('view'); }}>
                {t.updatePassword}
              </Button>
            </div>
          </div>
        )}
      </div>
      
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 opacity-60 pointer-events-none">
         <div className="flex items-center gap-3">
            <Shield size={20} className="text-green-600" />
            <div>
               <h3 className="font-bold text-slate-800">Two-Factor Authentication (2FA)</h3>
               <p className="text-xs text-slate-500">Currently managed by Administrator</p>
            </div>
         </div>
      </div>
    </div>
  );

  const renderPreferences = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Language */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <label className="block text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
            <Globe size={18} className="text-blue-500" /> {t.langSettings}
          </label>
          <div className="flex gap-2">
             <button 
               onClick={() => onLanguageChange('fa')}
               className={`flex-1 py-3 rounded-xl border font-bold text-sm transition-all ${isRtl ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-slate-50 border-slate-200 text-slate-500'}`}
             >
               فارسی
             </button>
             <button 
               onClick={() => onLanguageChange('en')}
               className={`flex-1 py-3 rounded-xl border font-bold text-sm transition-all ${!isRtl ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-slate-50 border-slate-200 text-slate-500'}`}
             >
               English
             </button>
          </div>
        </div>

        {/* Theme */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <label className="block text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
            <Sun size={18} className="text-orange-500" /> {t.theme}
          </label>
          <div className="flex gap-2">
             <button 
               onClick={() => setTheme('light')}
               className={`flex-1 py-3 rounded-xl border font-bold text-sm transition-all flex items-center justify-center gap-2 ${theme === 'light' ? 'bg-orange-50 border-orange-200 text-orange-700' : 'bg-slate-50 border-slate-200 text-slate-500'}`}
             >
               <Sun size={16}/> {t.themeLight}
             </button>
             <button 
               onClick={() => setTheme('dark')}
               className={`flex-1 py-3 rounded-xl border font-bold text-sm transition-all flex items-center justify-center gap-2 ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-500'}`}
             >
               <Moon size={16}/> {t.themeDark}
             </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDefaults = () => (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-start gap-3 mb-6">
         <div className="p-1 bg-white rounded-full shadow-sm"><Settings size={16} className="text-blue-600"/></div>
         <p className="text-xs text-blue-800 leading-relaxed font-medium">{t.defaultValuesDesc}</p>
      </div>

      {DEFAULT_VALUES_SCHEMA.map(moduleDef => {
        const isExpanded = expandedModules.includes(moduleDef.moduleId);
        const ModuleIcon = moduleDef.icon || Settings;
        
        return (
          <div key={moduleDef.moduleId} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm transition-all">
            <button 
              onClick={() => toggleModule(moduleDef.moduleId)}
              className="w-full flex items-center justify-between p-4 bg-slate-50/50 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3 font-bold text-slate-800">
                <ModuleIcon size={20} className="text-slate-400" />
                <span>{moduleDef.label[isRtl ? 'fa' : 'en']}</span>
              </div>
              <div className={`text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                <ChevronDown size={18} />
              </div>
            </button>

            {isExpanded && (
              <div className="p-6 border-t border-slate-200 animate-in slide-in-from-top-2">
                {moduleDef.groups.map(group => (
                  <div key={group.groupId} className="mb-6 last:mb-0">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2 after:h-px after:flex-1 after:bg-slate-100">
                      {group.label[isRtl ? 'fa' : 'en']}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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

      <div className="flex justify-end pt-4 sticky bottom-0 bg-slate-50/90 backdrop-blur p-4 rounded-xl border border-slate-200 shadow-lg z-10">
         <Button variant="primary" icon={Save} onClick={handleSaveDefaults} className="w-full md:w-auto">
            {t.saveDefaults}
         </Button>
      </div>
    </div>
  );

  return (
    <div className={`flex flex-col h-full bg-slate-50/50 p-4 overflow-hidden ${isRtl ? 'font-vazir' : 'font-sans'}`}>
      <div className="mb-6 shrink-0">
         <h1 className="text-2xl font-black text-slate-900">{t.profileTitle}</h1>
         <p className="text-slate-500 mt-1 text-sm font-medium">{t.profileSubtitle}</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 flex-1 min-h-0 overflow-hidden">
        {renderSidebar()}
        
        <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 overflow-y-auto">
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
