import React, { useState, useEffect, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  LayoutDashboard, Receipt, Wallet, BarChart3, Settings, Languages, Bell, Search, 
  ArrowUpRight, ArrowDownLeft, Plus, MoreVertical, ChevronRight, ChevronLeft, Users, 
  CreditCard, Lock, Mail, User, LogOut, ShieldCheck, Building2, Phone, CheckCircle2, 
  RefreshCw, ChevronDown, Briefcase, UserCheck, GitBranch, Key, Globe, Filter, X, 
  Calendar, Layers, ChevronRightSquare, LayoutGrid
} from 'lucide-react';

// Import Data
import { MENU_DATA, translations, flattenMenu } from './data.js';

// Import Components (اینجا کامپوننت‌های جدید را صدا می‌زنیم)
// نکته مهم: حتما پسوند .js را بنویسید
import KpiDashboard from './components/KpiDashboard.js';

// --- Shared Components (Nav & Login) ---
// Note: We can move these to separate files later too!

const TreeNavItem = ({ item, lang, activeId, setActiveId, expandedItems, toggleExpand, isRtl, depth = 0 }) => {
  const hasChildren = item.children && item.children.length > 0;
  const isExpanded = expandedItems.includes(item.id);
  const isActive = activeId === item.id;
  const label = item.label[lang];
  
  const handleItemClick = (e) => {
    e.stopPropagation();
    if (!hasChildren) {
      setActiveId(item.id);
    } else {
      toggleExpand(item.id);
    }
  };

  const getDepthStyle = () => {
    if (depth === 0) return "text-slate-800 font-bold bg-slate-100/40 mb-1 border-b border-slate-50";
    if (depth === 1) return "text-slate-600 font-semibold text-[13px]";
    return "text-slate-500 font-medium text-[12px]";
  };

  return (
    <div className="w-full select-none">
      <div 
        onClick={handleItemClick}
        className={`
          flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer transition-all
          ${isActive ? 'bg-blue-600 text-white shadow-lg ring-2 ring-blue-100' : 'hover:bg-slate-100/80'}
          ${getDepthStyle()}
        `}
      >
        <div className="shrink-0 flex items-center justify-center w-5 h-5">
          {hasChildren ? (
            <ChevronDown size={14} className={`transition-transform duration-200 ${isExpanded ? '' : (isRtl ? 'rotate-90' : '-rotate-90')}`} />
          ) : (
            <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-white' : 'bg-slate-300'}`}></div>
          )}
        </div>
        <span className="flex-1 truncate">{label}</span>
      </div>
      
      {hasChildren && isExpanded && (
        <div className={`relative mt-1 ${isRtl ? 'mr-4 pr-1' : 'ml-4 pl-1'}`}>
          <div className={`absolute top-0 bottom-0 ${isRtl ? 'right-0 border-r-2' : 'left-0 border-l-2'} border-slate-100/80`}></div>
          <div className="space-y-1 py-1">
            {item.children.map(child => (
              <TreeNavItem 
                key={child.id} 
                item={child} 
                lang={lang} 
                activeId={activeId} 
                setActiveId={setActiveId} 
                expandedItems={expandedItems}
                toggleExpand={toggleExpand}
                isRtl={isRtl}
                depth={depth + 1}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const FilterChip = ({ label }) => (
  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white text-slate-700 rounded-lg text-[11px] font-bold border border-slate-200 shadow-sm">
    <span>{label}</span>
    <X size={10} className="text-slate-400 hover:text-red-500 cursor-pointer" />
  </div>
);

const GlobalFilterBar = ({ t, isRtl }) => (
  <div className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-3 flex flex-wrap items-center gap-6 shrink-0 z-10 sticky top-0 animate-in slide-in-from-top duration-300">
    <div className="flex items-center gap-2 text-blue-600">
      <div className="p-1.5 bg-blue-50 rounded-lg"><Filter size={14} /></div>
      <span className="text-[10px] font-black uppercase tracking-widest">{t.filters}</span>
    </div>
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-2">
        <Calendar size={13} className="text-slate-400" />
        <span className="text-xs font-bold text-slate-500">{t.fiscalYear}:</span>
        <div className="flex items-center gap-2"><FilterChip label="1402" /><FilterChip label="1403" /></div>
      </div>
      <div className="w-px h-4 bg-slate-200"></div>
      <div className="flex items-center gap-2">
        <Building2 size={13} className="text-slate-400" />
        <span className="text-xs font-bold text-slate-500">{t.company}:</span>
        <div className="flex items-center gap-2"><FilterChip label={isRtl ? 'هلدینگ اصلی' : 'Main Corp'} /></div>
      </div>
      <div className="w-px h-4 bg-slate-200"></div>
      <div className="flex items-center gap-2">
        <Layers size={13} className="text-slate-400" />
        <span className="text-xs font-bold text-slate-500">{t.ledger}:</span>
        <div className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[11px] font-bold text-slate-500 hover:bg-white transition-all cursor-pointer">{t.all}</div>
      </div>
    </div>
  </div>
);

const LoginPage = ({ 
  t, isRtl, authView, setAuthView, loginMethod, setLoginMethod, 
  loginData, setLoginData, recoveryData, setRecoveryData, error, 
  handleLogin, handleVerifyOtp, handleUpdatePassword, toggleLanguage 
}) => {
  const renderAuthView = () => {
    switch (authView) {
      case 'forgot-choice':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <button 
              onClick={() => setAuthView('login')}
              className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors text-sm font-bold mb-4"
            >
              {isRtl ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
              {t.backToLogin}
            </button>
            <div className="grid grid-cols-1 gap-4">
              <button 
                onClick={() => setAuthView('otp')}
                className="flex flex-col items-center gap-4 p-6 bg-slate-50 border border-slate-200 rounded-2xl hover:border-blue-500 hover:bg-blue-50/50 transition-all group"
              >
                <div className="p-4 bg-white rounded-xl shadow-sm text-blue-600 group-hover:scale-110 transition-transform">
                  <Phone size={24} />
                </div>
                <div className="text-center">
                  <h3 className="font-bold text-slate-900">{t.viaSms}</h3>
                </div>
              </button>
              <button 
                onClick={() => setAuthView('email-sent')}
                className="flex flex-col items-center gap-4 p-6 bg-slate-50 border border-slate-200 rounded-2xl hover:border-blue-500 hover:bg-blue-50/50 transition-all group"
              >
                <div className="p-4 bg-white rounded-xl shadow-sm text-purple-600 group-hover:scale-110 transition-transform">
                  <Mail size={24} />
                </div>
                <div className="text-center">
                  <h3 className="font-bold text-slate-900">{t.viaEmail}</h3>
                </div>
              </button>
            </div>
          </div>
        );

      case 'otp':
        return (
          <form onSubmit={handleVerifyOtp} className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <button onClick={() => setAuthView('forgot-choice')} className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors text-sm font-bold">
              {isRtl ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
              {isRtl ? 'تغییر روش بازیابی' : 'Change Method'}
            </button>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-1">{t.mobileLabel}</label>
              <input 
                type="text" 
                disabled
                value="0912****345"
                className="w-full bg-slate-100 border border-slate-200 rounded-xl py-3 px-4 text-sm font-medium text-slate-500 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-1">{t.enterOtp}</label>
              <input 
                type="text" 
                autoFocus
                required
                value={recoveryData.otp}
                onChange={(e) => setRecoveryData({...recoveryData, otp: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-4 text-center text-2xl font-bold tracking-[0.5em] focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all outline-none font-mono"
                placeholder="000000"
                maxLength={6}
              />
            </div>
            {error && <div className="text-red-600 text-xs font-bold flex items-center gap-2"><ShieldCheck size={16}/>{error}</div>}
            <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-sm shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
              {t.verifyOtp}
            </button>
            <button type="button" className="w-full text-slate-500 text-xs font-bold flex items-center justify-center gap-2 hover:text-blue-600 transition-colors">
              <RefreshCw size={14} />
              {isRtl ? 'ارسال مجدد کد' : 'Resend Code'}
            </button>
          </form>
        );

      case 'email-sent':
        return (
          <div className="text-center space-y-6 animate-in fade-in zoom-in-95 duration-500">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={40} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">{t.emailSent}</h2>
              <p className="text-slate-500 text-sm mt-2">{t.emailSentDesc}</p>
            </div>
            <button 
              onClick={() => setAuthView('login')}
              className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all"
            >
              {t.backToLogin}
            </button>
          </div>
        );

      case 'reset-password':
        return (
          <form onSubmit={handleUpdatePassword} className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-1">{t.newPasswordLabel}</label>
              <div className="relative group">
                <div className={`absolute inset-y-0 ${isRtl ? 'right-4' : 'left-4'} flex items-center text-slate-400`}><Lock size={20}/></div>
                <input 
                  type="password" 
                  required
                  className={`w-full bg-slate-50 border border-slate-200 rounded-xl py-3 ${isRtl ? 'pr-12 pl-4' : 'pl-12 pr-4'} outline-none focus:border-blue-500 transition-all text-sm`}
                  placeholder="••••••••"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-1">{t.confirmPasswordLabel}</label>
              <div className="relative group">
                <div className={`absolute inset-y-0 ${isRtl ? 'right-4' : 'left-4'} flex items-center text-slate-400`}><Lock size={20}/></div>
                <input 
                  type="password" 
                  required
                  className={`w-full bg-slate-50 border border-slate-200 rounded-xl py-3 ${isRtl ? 'pr-12 pl-4' : 'pl-12 pr-4'} outline-none focus:border-blue-500 transition-all text-sm`}
                  placeholder="••••••••"
                />
              </div>
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-sm shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all">
              {t.updatePassword}
            </button>
          </form>
        );

      default: // Login View
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex bg-slate-100 p-1 rounded-xl mb-8">
              <button 
                onClick={() => {setLoginMethod('standard');}}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${loginMethod === 'standard' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <User size={16} />
                {t.standardMethod}
              </button>
              <button 
                onClick={() => {setLoginMethod('ad');}}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${loginMethod === 'ad' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <Building2 size={16} />
                {t.adMethod}
              </button>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-1">
                  {loginMethod === 'standard' ? t.usernameLabel : t.emailLabel}
                </label>
                <div className="relative group">
                  <div className={`absolute inset-y-0 ${isRtl ? 'right-4' : 'left-4'} flex items-center text-slate-400 group-focus-within:text-blue-600 transition-colors`}>
                    {loginMethod === 'standard' ? <User size={20} /> : <Mail size={20} />}
                  </div>
                  <input 
                    type={loginMethod === 'standard' ? 'text' : 'email'}
                    required
                    value={loginData.identifier}
                    onChange={(e) => setLoginData({...loginData, identifier: e.target.value})}
                    className={`w-full bg-slate-50 border border-slate-200 rounded-xl py-3 ${isRtl ? 'pr-12 pl-4' : 'pl-12 pr-4'} outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all text-sm`}
                    placeholder={loginMethod === 'standard' ? 'admin' : 'user@company.com'}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2 px-1">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">{t.passwordLabel}</label>
                  <button type="button" onClick={() => {setAuthView('forgot-choice');}} className="text-xs font-bold text-blue-600 hover:underline">{t.forgotPass}</button>
                </div>
                <div className="relative group">
                  <div className={`absolute inset-y-0 ${isRtl ? 'right-4' : 'left-4'} flex items-center text-slate-400 group-focus-within:text-blue-600 transition-colors`}>
                    <Lock size={20} />
                  </div>
                  <input 
                    type="password"
                    required
                    value={loginData.password}
                    onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                    className={`w-full bg-slate-50 border border-slate-200 rounded-xl py-3 ${isRtl ? 'pr-12 pl-4' : 'pl-12 pr-4'} outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all text-sm`}
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-xs font-bold flex items-center gap-2 border border-red-100"><ShieldCheck size={16}/>{error}</div>}

              <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-sm shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2">
                {t.loginBtn}
                {isRtl ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
              </button>
            </form>
          </div>
        );
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center bg-slate-50 p-4 ${isRtl ? 'font-vazir' : 'font-sans'}`}>
      <div className="absolute top-8 right-8 left-8 flex justify-end">
        <button onClick={toggleLanguage} className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-slate-200 text-sm font-medium hover:bg-slate-50 transition-colors">
          <Languages size={18} /> {t.language}
        </button>
      </div>

      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
        <div className="p-8 text-center bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
            <BarChart3 size={32} />
          </div>
          <h1 className="text-2xl font-black">{authView === 'login' ? t.loginTitle : t.resetMethodTitle}</h1>
          <p className="text-blue-100 text-sm mt-2 opacity-90">{authView === 'login' ? t.loginSubtitle : t.resetMethodSubtitle}</p>
        </div>

        <div className="p-8">
          {renderAuthView()}
          <p className="mt-8 text-center text-slate-400 text-xs">© 2024 FinCorp OS. Professional Accounting Protocol.</p>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [lang, setLang] = useState('en');
  
  // Navigation State
  const [activeModuleId, setActiveModuleId] = useState('workspace');
  const [activeId, setActiveId] = useState('workspace_gen');
  const [expandedItems, setExpandedItems] = useState(['gl', 'treasury']);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [menuSearch, setMenuSearch] = useState('');
  
  // Auth Flow States
  const [authView, setAuthView] = useState('login');
  const [loginMethod, setLoginMethod] = useState('standard');
  const [loginData, setLoginData] = useState({ identifier: '', password: '' });
  const [recoveryData, setRecoveryData] = useState({ otp: '' });
  const [error, setError] = useState('');
  
  const t = translations[lang];
  const isRtl = lang === 'fa';

  useEffect(() => {
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang, isRtl]);

  const toggleExpand = (id) => {
    setExpandedItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleGlobalSearch = (term) => {
    setMenuSearch(term);
    if (!term) return;
    const flat = flattenMenu(MENU_DATA);
    const found = flat.find(item => item.label[lang].toLowerCase().includes(term.toLowerCase()));
    if (found && found.moduleId) setActiveModuleId(found.moduleId);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginData.identifier === 'admin' && loginData.password === 'admin') {
      setIsLoggedIn(true);
      setError('');
    } else setError(t.invalidCreds);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (recoveryData.otp === '630328') {
      setAuthView('reset-password');
      setError('');
    } else setError(t.invalidOtp);
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    setAuthView('login');
    alert(t.resetSuccess);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setAuthView('login');
    setLoginData({ identifier: '', password: '' });
  };

  const currentModule = useMemo(() => MENU_DATA.find(m => m.id === activeModuleId), [activeModuleId]);
  const showFilters = useMemo(() => activeModuleId === 'accounting', [activeModuleId]);

  if (!isLoggedIn) {
    return (
      <LoginPage 
        t={t} isRtl={isRtl} authView={authView} setAuthView={setAuthView}
        loginMethod={loginMethod} setLoginMethod={setLoginMethod}
        loginData={loginData} setLoginData={setLoginData}
        recoveryData={recoveryData} setRecoveryData={setRecoveryData}
        error={error} handleLogin={handleLogin} handleVerifyOtp={handleVerifyOtp}
        handleUpdatePassword={handleUpdatePassword} toggleLanguage={() => setLang(l => l === 'en' ? 'fa' : 'en')}
      />
    );
  }

  return (
    <div className={`min-h-screen bg-slate-50 flex ${isRtl ? 'font-vazir' : 'font-sans'}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@100..900&display=swap'); 
        .font-vazir { font-family: 'Vazirmatn', sans-serif; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}</style>
      
      {/* 1. Module Rail */}
      <aside className={`bg-slate-100 w-20 flex flex-col items-center py-8 shrink-0 z-30 shadow-sm border-${isRtl ? 'l' : 'r'} border-slate-200`}>
        <div className="bg-blue-600 p-2.5 rounded-2xl text-white mb-12 shadow-lg shadow-blue-500/20"><BarChart3 size={24} /></div>
        <div className="flex-1 flex flex-col gap-6 items-center">
          {MENU_DATA.map(mod => (
            <button 
              key={mod.id} onClick={() => setActiveModuleId(mod.id)}
              className={`relative p-3.5 rounded-2xl transition-all group ${activeModuleId === mod.id ? 'bg-white text-blue-600 shadow-md' : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'}`}
            >
              <mod.icon size={22} />
              <span className={`absolute ${isRtl ? 'right-full mr-4' : 'left-full ml-4'} top-1/2 -translate-y-1/2 bg-slate-800 text-white text-[10px] font-black px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all whitespace-nowrap z-50`}>{mod.label[lang]}</span>
              {activeModuleId === mod.id && <div className={`absolute w-1 h-6 bg-blue-500 rounded-full top-1/2 -translate-y
