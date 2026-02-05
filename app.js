import React, { useState, useEffect, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  LayoutDashboard, Receipt, Wallet, BarChart3, Settings, Languages, Bell, Search, 
  ArrowUpRight, ArrowDownLeft, Plus, MoreVertical, ChevronRight, ChevronLeft, Users, 
  CreditCard, Lock, Mail, User, LogOut, ShieldCheck, Building2, Phone, CheckCircle2, 
  RefreshCw, ChevronDown, Briefcase, UserCheck, GitBranch, Key, Globe, Filter, X, 
  Calendar, Layers, ChevronRightSquare, LayoutGrid
} from 'lucide-react';

// --- دریافت داده‌ها و کامپوننت‌ها از window ---
const { MENU_DATA, translations, flattenMenu } = window;
const { KpiDashboard, LoginPage, UserManagement, GeneralWorkspace } = window;

// --- Shared Components (Nav) ---

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
  
  const showFilters = useMemo(() => {
    const docMgmtIds = ['gl_docs', 'doc_list', 'doc_review', 'doc_finalize'];
    return docMgmtIds.includes(activeId);
  }, [activeId]);

  // Logic to determine if the page should be Full Screen (No Padding)
  const isFullScreenPage = useMemo(() => {
    return ['users_list'].includes(activeId);
  }, [activeId]);

  const renderContent = () => {
    switch (activeId) {
      case 'workspace_gen':
        return <GeneralWorkspace t={t} isRtl={isRtl} />;
      
      case 'users_list':
        return <UserManagement t={t} isRtl={isRtl} />;

      // Fallback for Dashboard - temporarily same as General Workspace or previous KpiDashboard
      case 'dashboards_gen':
        return <KpiDashboard t={t} isRtl={isRtl} />;

      default:
        return (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-6 opacity-60">
             <div className="p-8 bg-white rounded-[3rem] shadow-xl border border-slate-100"><LayoutGrid size={64} className="text-slate-200" /></div>
             <div>
                <h2 className="text-xl font-black text-slate-900">{activeId.toUpperCase()}</h2>
                <p className="text-slate-500 mt-2 font-medium">{t.emptyPage}</p>
             </div>
          </div>
        );
    }
  };

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
        <div className="flex-1 flex flex-col gap-3 items-center">
          {MENU_DATA.map(mod => (
            <button 
              key={mod.id} onClick={() => setActiveModuleId(mod.id)}
              className={`relative p-3.5 rounded-2xl transition-all group ${activeModuleId === mod.id ? 'bg-white text-blue-600 shadow-md' : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'}`}
            >
              <mod.icon size={22} />
              <span className={`absolute ${isRtl ? 'right-full mr-4' : 'left-full ml-4'} top-1/2 -translate-y-1/2 bg-slate-800 text-white text-[10px] font-black px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all whitespace-nowrap z-50`}>{mod.label[lang]}</span>
              {activeModuleId === mod.id && <div className={`absolute w-1 h-6 bg-blue-500 rounded-full top-1/2 -translate-y-1/2 ${isRtl ? 'right-[-8px]' : 'left-[-8px]'}`}></div>}
            </button>
          ))}
        </div>
        <button onClick={handleLogout} className="mt-auto p-4 text-slate-400 hover:text-red-500 transition-colors"><LogOut size={22} /></button>
      </aside>

      {/* 2. Sub-Menu Pane */}
      <aside className={`bg-white border-${isRtl ? 'l' : 'r'} border-slate-200 transition-all duration-300 flex flex-col overflow-hidden ${sidebarCollapsed ? 'w-0' : 'w-72'}`}>
        
        <div className="px-6 mt-8 mb-4">
          <div className="relative group">
            <Search size={14} className={`absolute top-1/2 -translate-y-1/2 ${isRtl ? 'right-4' : 'left-4'} text-slate-400 group-focus-within:text-blue-500`} />
            <input 
              type="text" placeholder={t.searchMenu} value={menuSearch} onChange={(e) => handleGlobalSearch(e.target.value)}
              className={`w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 ${isRtl ? 'pr-11 pl-4' : 'pl-11 pr-4'} text-xs focus:ring-4 focus:ring-blue-50 outline-none transition-all`}
            />
          </div>
        </div>

        <div className="px-8 pb-4 flex items-center justify-between border-b border-slate-50 mb-2">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">{currentModule.label[lang]}</h2>
          <LayoutGrid size={16} className="text-slate-200" />
        </div>

        <nav className="flex-1 px-4 overflow-y-auto custom-scrollbar max-h-[calc(100vh-160px)]">
          {currentModule.children?.map(item => (
            <TreeNavItem 
              key={item.id} item={item} lang={lang} activeId={activeId} setActiveId={setActiveId} 
              expandedItems={expandedItems} toggleExpand={toggleExpand} isRtl={isRtl}
            />
          ))}
        </nav>

        <div className="p-6 mt-auto">
          <div className="bg-slate-50 p-4 rounded-[1.5rem] flex items-center gap-3 border border-slate-100 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-black">AD</div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-black text-slate-800 truncate">Administrator</p>
              <p className="text-[10px] text-slate-400 truncate">System CFO</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Viewport */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 z-20">
          <div className="flex items-center gap-4">
             <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="p-2 bg-slate-50 rounded-xl text-slate-400 hover:text-slate-900 transition-all">
                <ChevronRightSquare size={20} className={sidebarCollapsed ? (isRtl ? 'rotate-180' : '') : (isRtl ? '' : 'rotate-180')} />
             </button>
             <div className="flex items-center gap-2 text-slate-300">
               <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{activeModuleId}</span>
               <ChevronRight size={12} className={isRtl ? 'rotate-180' : ''} />
               <span className="text-xs font-black text-blue-600 uppercase tracking-widest">{activeId}</span>
             </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 cursor-pointer hover:bg-slate-100 relative group transition-all">
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </div>
            <button onClick={() => setLang(l => l === 'en' ? 'fa' : 'en')} className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl hover:bg-white text-xs font-black transition-all">
              <Languages size={14} />{t.language}
            </button>
          </div>
        </header>

        {showFilters && <GlobalFilterBar t={t} isRtl={isRtl} />}

        {/* --- CRITICAL CHANGE: Conditional Padding and Overflow based on Route Type --- */}
        <div className={`flex-1 bg-slate-50/30 ${isFullScreenPage ? 'p-0 overflow-hidden' : 'p-10 overflow-y-auto'}`}>
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

const root = createRoot(document.getElementById('root'));
root.render(<App />);
