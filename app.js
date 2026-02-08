import React, { useState, useEffect, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  BarChart3, Settings, Languages, Bell, Search, 
  ChevronRight, ChevronDown, LogOut, LayoutGrid, ChevronRightSquare,
  Menu
} from 'lucide-react';

// --- Get Data and Components from Window ---
// اطمینان حاصل می‌کنیم که داده‌ها وجود دارند تا از کرش کردن جلوگیری شود
const MENU_DATA = window.MENU_DATA || [];
const translations = window.translations || { en: {}, fa: {} };
const { KpiDashboard, LoginPage, UserManagement, GeneralWorkspace, ComponentShowcase } = window;

// --- Tree Navigation Item Component ---
const TreeNavItem = ({ item, lang, activeId, setActiveId, expandedItems, toggleExpand, isRtl, depth = 0 }) => {
  const hasChildren = item.children && item.children.length > 0;
  const isExpanded = expandedItems.includes(item.id);
  const isActive = activeId === item.id;
  const label = item.label ? item.label[lang] : item.id;
  
  const handleItemClick = (e) => {
    e.stopPropagation();
    if (!hasChildren) {
      setActiveId(item.id);
    } else {
      toggleExpand(item.id);
    }
  };

  const getDepthStyle = () => {
    if (depth === 0) return "text-slate-800 font-bold bg-slate-100/50 mb-1 mx-2 mt-2 border-b border-slate-100";
    return "text-slate-600 font-medium text-[12px] hover:text-indigo-700";
  };

  return (
    <div className="w-full select-none">
      <div 
        onClick={handleItemClick}
        className={`
          flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer transition-all duration-200
          ${isActive && !hasChildren ? 'bg-indigo-50 text-indigo-700 font-bold border-r-2 border-indigo-600' : 'hover:bg-slate-50'}
          ${getDepthStyle()}
        `}
        style={{ paddingInlineStart: depth > 0 ? `${depth * 16 + 12}px` : '12px' }}
      >
        <div className="shrink-0 flex items-center justify-center w-4 h-4 text-slate-400">
          {hasChildren ? (
            <ChevronDown size={14} className={`transition-transform duration-200 ${isExpanded ? '' : (isRtl ? 'rotate-90' : '-rotate-90')}`} />
          ) : (
            <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-indigo-600' : 'bg-slate-300'}`}></div>
          )}
        </div>
        <span className="flex-1 truncate">{label}</span>
      </div>
      
      {hasChildren && isExpanded && (
        <div className="animate-in slide-in-from-top-1 duration-200">
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
      )}
    </div>
  );
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [lang, setLang] = useState('en');
  
  // Navigation State
  const [activeModuleId, setActiveModuleId] = useState('showcase'); // Default to Showcase
  const [activeId, setActiveId] = useState('ui_showcase');
  const [expandedItems, setExpandedItems] = useState([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Auth Flow States
  const [authView, setAuthView] = useState('login');
  const [loginMethod, setLoginMethod] = useState('standard');
  const [loginData, setLoginData] = useState({ identifier: '', password: '' });
  const [error, setError] = useState('');
  
  const t = translations[lang] || {};
  const isRtl = lang === 'fa';

  useEffect(() => {
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang, isRtl]);

  const toggleExpand = (id) => {
    setExpandedItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginData.identifier === 'admin' && loginData.password === 'admin') {
      setIsLoggedIn(true);
      setError('');
    } else setError(t.invalidCreds || 'Invalid credentials');
  };

  // Safe retrieval of current module
  const currentModule = useMemo(() => {
    return MENU_DATA.find(m => m.id === activeModuleId) || MENU_DATA[0] || {};
  }, [activeModuleId]);
  
  const renderContent = () => {
    if (activeId === 'workspace_gen') return GeneralWorkspace ? <GeneralWorkspace t={t} isRtl={isRtl} /> : <div>Loading Workspace...</div>;
    if (activeId === 'users_list') return UserManagement ? <UserManagement t={t} isRtl={isRtl} /> : <div>Loading Users...</div>;
    if (activeId === 'dashboards_gen') return KpiDashboard ? <KpiDashboard t={t} isRtl={isRtl} /> : <div>Loading Dashboard...</div>;

    return (
      <div className="flex flex-col items-center justify-center h-full text-center space-y-6 opacity-60">
          <div className="p-8 bg-white rounded-[2rem] shadow-sm border border-slate-200">
            <LayoutGrid size={64} className="text-slate-300" strokeWidth={1} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">{activeId}</h2>
            <p className="text-slate-500 mt-2 text-sm font-medium">{t.emptyPage || 'This page is empty.'}</p>
          </div>
      </div>
    );
  };

  // --- 1. Login Screen ---
  if (!isLoggedIn) {
    if (!LoginPage) return <div className="p-10 text-center">Loading Login Module...</div>;
    return (
      <LoginPage 
        t={t} isRtl={isRtl} authView={authView} setAuthView={setAuthView}
        loginMethod={loginMethod} setLoginMethod={setLoginMethod}
        loginData={loginData} setLoginData={setLoginData}
        recoveryData={{otp: ''}} setRecoveryData={() => {}}
        error={error} handleLogin={handleLogin} toggleLanguage={() => setLang(l => l === 'en' ? 'fa' : 'en')}
        handleVerifyOtp={() => {}} handleUpdatePassword={() => {}}
      />
    );
  }

  // --- 2. SHOWCASE MODE ---
  if (activeId === 'ui_showcase') {
    return (
      <div className="h-screen w-full bg-white relative">
        <button 
          onClick={() => { setActiveModuleId('workspace'); setActiveId('workspace_gen'); }}
          className={`
            fixed bottom-4 ${isRtl ? 'left-4' : 'right-4'} z-[9999] 
            bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-full shadow-xl 
            text-xs font-bold flex items-center gap-2 transition-transform hover:scale-105
          `}
        >
          <LogOut size={14} /> Exit Showcase
        </button>
        {/* Safe check for ComponentShowcase */}
        {ComponentShowcase ? <ComponentShowcase t={t} isRtl={isRtl} /> : <div className="p-10 text-center">Loading Showcase...</div>}
      </div>
    );
  }

  // --- 3. STANDARD APP SHELL ---
  return (
    <div className={`min-h-screen bg-slate-50 flex ${isRtl ? 'font-vazir' : 'font-sans'}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@100..900&display=swap'); 
        .font-vazir { font-family: 'Vazirmatn', sans-serif; }
      `}</style>
      
      {/* A. Module Rail */}
      <aside className={`bg-white w-[70px] flex flex-col items-center py-4 shrink-0 z-30 border-${isRtl ? 'l' : 'r'} border-slate-200 shadow-[0_0_15px_rgba(0,0,0,0.03)]`}>
        <div className="bg-indigo-700 p-2.5 rounded-xl text-white mb-6 shadow-lg shadow-indigo-500/30">
          <BarChart3 size={24} strokeWidth={2} />
        </div>
        
        <div className="flex-1 flex flex-col gap-3 items-center w-full px-2 overflow-y-auto no-scrollbar">
          {MENU_DATA.map(mod => (
            <button 
              key={mod.id} onClick={() => setActiveModuleId(mod.id)}
              className={`
                relative p-3 rounded-xl transition-all w-full flex justify-center group
                ${activeModuleId === mod.id ? 'bg-indigo-50 text-indigo-700' : 'text-slate-400 hover:text-slate-800 hover:bg-slate-50'}
              `}
              title={mod.label ? mod.label[lang] : mod.id}
            >
              {mod.icon ? <mod.icon size={22} strokeWidth={1.5} /> : <div className="w-5 h-5 bg-slate-300 rounded-full"/>}
              {activeModuleId === mod.id && (
                <div className={`absolute w-1 h-8 bg-indigo-600 rounded-full top-1/2 -translate-y-1/2 ${isRtl ? 'right-0' : 'left-0'}`}></div>
              )}
              <div className={`
                absolute ${isRtl ? 'right-full mr-3' : 'left-full ml-3'} top-1/2 -translate-y-1/2 
                bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 invisible 
                group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50
              `}>
                {mod.label ? mod.label[lang] : mod.id}
              </div>
            </button>
          ))}
        </div>
        
        <button onClick={() => setIsLoggedIn(false)} className="mt-auto p-3 text-slate-400 hover:text-red-600 transition-colors">
          <LogOut size={22} strokeWidth={1.5} />
        </button>
      </aside>

      {/* B. Sub-Menu Pane */}
      <aside className={`
        bg-slate-50/50 border-${isRtl ? 'l' : 'r'} border-slate-200 
        flex flex-col transition-all duration-300 ease-in-out overflow-hidden
        ${sidebarCollapsed ? 'w-0 opacity-0' : 'w-64 opacity-100'}
      `}>
        <div className="h-16 flex items-center px-6 border-b border-slate-200/60 shrink-0">
           <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest truncate">
             {currentModule.label ? currentModule.label[lang] : 'Menu'}
           </h2>
        </div>
        
        <nav className="flex-1 p-2 overflow-y-auto custom-scrollbar">
          {currentModule.children?.map(item => (
            <TreeNavItem 
              key={item.id} item={item} lang={lang} activeId={activeId} setActiveId={setActiveId} 
              expandedItems={expandedItems} toggleExpand={toggleExpand} isRtl={isRtl}
            />
          ))}
        </nav>
        
        <div className="p-4 border-t border-slate-200/60">
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white transition-colors cursor-pointer border border-transparent hover:border-slate-200">
             <div className="w-8 h-8 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-xs">
                JD
             </div>
             <div className="min-w-0">
                <div className="text-[12px] font-bold text-slate-700 truncate">John Doe</div>
                <div className="text-[10px] text-slate-400 truncate">Financial Manager</div>
             </div>
          </div>
        </div>
      </aside>

      {/* C. Main Viewport */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-50 relative shadow-inner">
        
        {/* C1. Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-20">
           <div className="flex items-center gap-4">
             <button 
               onClick={() => setSidebarCollapsed(!sidebarCollapsed)} 
               className="p-2 -ml-2 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-800 transition-colors"
             >
                {sidebarCollapsed ? <Menu size={20} /> : <ChevronRightSquare size={20} className={isRtl ? '' : 'rotate-180'} />}
             </button>
             
             <div className="flex items-center gap-2 text-sm">
                <span className="text-slate-400 font-medium">{currentModule.label ? currentModule.label[lang] : ''}</span>
                <ChevronRight size={14} className={`text-slate-300 ${isRtl ? 'rotate-180' : ''}`} />
                <span className="text-slate-800 font-bold">{activeId}</span>
             </div>
           </div>

           <div className="flex items-center gap-3">
              <div className="relative">
                 <Search size={16} className={`absolute top-1/2 -translate-y-1/2 ${isRtl ? 'right-3' : 'left-3'} text-slate-400`} />
                 <input 
                    placeholder={t.searchMenu || 'Search...'}
                    className={`
                       h-9 bg-slate-100 border-none rounded-full text-xs w-48 focus:w-64 transition-all
                       ${isRtl ? 'pr-9 pl-4' : 'pl-9 pr-4'} focus:ring-2 focus:ring-indigo-100 outline-none
                    `}
                 />
              </div>
              <button 
                onClick={() => setLang(l => l === 'en' ? 'fa' : 'en')} 
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
                title="Switch Language"
              >
                 <Languages size={18} />
              </button>
              <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-500 transition-colors relative">
                 <Bell size={18} />
                 <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
           </div>
        </header>

        {/* C2. Content Area */}
        <div className="flex-1 overflow-hidden relative">
           {renderContent()}
        </div>
      </main>
    </div>
  );
};

const root = createRoot(document.getElementById('root'));
root.render(<App />);
