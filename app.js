/* Filename: app.js */
import React, { useState, useMemo, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import * as LucideIcons from 'lucide-react';

const { 
  Menu, X, ChevronRight, Bell, Settings, User, LogOut, 
  Search, Sun, Moon, Globe, ChevronLeft 
} = LucideIcons;

const App = () => {
  // 1. دریافت داده‌ها و کامپوننت‌ها از Window
  const MENU_DATA = window.MENU_DATA || [];
  const UI = window.UI || {};
  const { Button, Badge, InputField, Modal } = UI;
  
  // کامپوننت‌های صفحات
  const { 
    KpiDashboard, 
    GeneralWorkspace, 
    UserManagement, 
    Roles, 
    Parties, 
    ComponentShowcase, 
    LoginPage 
  } = window;

  // 2. وضعیت‌های اصلی (States)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isRtl, setIsRtl] = useState(true);
  const [lang, setLang] = useState('fa');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeId, setActiveId] = useState('workspace_gen');
  const [expandedMenus, setExpandedMenus] = useState(['system_settings', 'general_settings', 'base_info_root']);
  const [searchQuery, setSearchQuery] = useState('');

  // 3. توابع کمکی
  const t = (key) => {
    return window.translations?.[lang]?.[key] || window.translations?.['en']?.[key] || key;
  };

  const toggleMenu = (menuId) => {
    setExpandedMenus(prev => 
      prev.includes(menuId) ? prev.filter(id => id !== menuId) : [...prev, menuId]
    );
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  // 4. رندر محتوای اصلی بر اساس activeId
  const renderContent = () => {
    if (!isAuthenticated) return <LoginPage onLogin={(userData) => { setUser(userData); setIsAuthenticated(true); }} t={t} isRtl={isRtl} />;

    switch (activeId) {
      case 'dashboards_gen':
        return KpiDashboard ? <KpiDashboard t={t} isRtl={isRtl} /> : null;
      case 'workspace_gen':
        return GeneralWorkspace ? <GeneralWorkspace t={t} isRtl={isRtl} /> : null;
      case 'users_list':
        return UserManagement ? <UserManagement t={t} isRtl={isRtl} /> : null;
      case 'roles':
        return Roles ? <Roles t={t} isRtl={isRtl} /> : null;
      case 'parties':
        return Parties ? <Parties t={t} isRtl={isRtl} /> : null;
      case 'ui_showcase':
        return ComponentShowcase ? <ComponentShowcase t={t} isRtl={isRtl} /> : null;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full text-slate-400">
            <LucideIcons.Construction size={64} className="mb-4 opacity-20" />
            <h2 className="text-xl font-bold">{t('emptyPage')}</h2>
            <p className="text-sm mt-2">Module ID: {activeId}</p>
          </div>
        );
    }
  };

  // 5. رندر منوی درختی (Recursive Sidebar)
  const renderMenuItems = (items) => {
    return items.map(item => {
      const hasChildren = item.children && item.children.length > 0;
      const isExpanded = expandedMenus.includes(item.id);
      const isActive = activeId === item.id;
      const Icon = item.icon || ChevronRight;

      return (
        <div key={item.id} className="select-none">
          <div 
            onClick={() => hasChildren ? toggleMenu(item.id) : setActiveId(item.id)}
            className={`
              flex items-center gap-2 px-3 py-2 cursor-pointer transition-all duration-200 rounded-lg mx-2 mb-1
              ${isActive ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-200'}
            `}
          >
            <Icon size={18} className={isActive ? 'text-white' : 'text-slate-400'} />
            <span className="flex-1 text-xs font-medium">{item.label[lang]}</span>
            {hasChildren && (
              <LucideIcons.ChevronDown 
                size={14} 
                className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} 
              />
            )}
          </div>
          {hasChildren && isExpanded && (
            <div className={`mr-4 border-r border-slate-200 ml-2 pr-2 mb-2`}>
              {renderMenuItems(item.children)}
            </div>
          )}
        </div>
      );
    });
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={(userData) => { setUser(userData); setIsAuthenticated(true); }} t={t} isRtl={isRtl} />;
  }

  return (
    <div className={`flex h-screen bg-slate-100 ${isRtl ? 'dir-rtl' : 'dir-ltr'} font-vazir`}>
      {/* Sidebar */}
      <aside 
        className={`
          ${isSidebarOpen ? 'w-64' : 'w-0'} 
          bg-white border-l border-slate-200 flex flex-col transition-all duration-300 overflow-hidden shrink-0 z-50
        `}
      >
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-indigo-900 text-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <LucideIcons.Layers size={20} />
            </div>
            <span className="font-black text-lg tracking-tight">STRATUM</span>
          </div>
        </div>

        <div className="p-3">
          <div className="relative">
            <Search className="absolute right-3 top-2.5 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder={t('searchMenu')}
              className="w-full bg-slate-100 border-none rounded-xl py-2 pr-10 pl-4 text-xs focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto no-scrollbar py-2">
          {renderMenuItems(MENU_DATA)}
        </nav>

        <div className="p-4 border-t border-slate-100 bg-slate-50">
          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-200 cursor-pointer transition-all">
            <div className="w-10 h-10 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold">
              {user?.fullName?.charAt(0) || 'A'}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-bold text-slate-800 truncate">{user?.fullName || 'Administrator'}</p>
              <p className="text-[10px] text-slate-500 truncate">{user?.username || 'admin'}</p>
            </div>
            <LogOut size={16} className="text-slate-400 hover:text-red-500" onClick={logout} />
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Top Header */}
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
            >
              <Menu size={20} />
            </button>
            <div className="h-6 w-[1px] bg-slate-200 mx-2"></div>
            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <LucideIcons.Home size={16} />
              <ChevronLeft size={14} className="opacity-50" />
              <span className="font-medium text-slate-800">
                {activeId === 'workspace_gen' ? t('ws_title') : activeId}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg relative transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-6 w-[1px] bg-slate-200 mx-1"></div>
            <button 
              className="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-100 rounded-lg text-slate-600 transition-all"
              onClick={() => {
                const newLang = lang === 'fa' ? 'en' : 'fa';
                setLang(newLang);
                setIsRtl(newLang === 'fa');
              }}
            >
              <Globe size={18} />
              <span className="text-xs font-bold">{lang === 'fa' ? 'EN' : 'FA'}</span>
            </button>
            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">
              <Settings size={20} />
            </button>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <section className="flex-1 overflow-hidden relative bg-slate-50/50">
          {renderContent()}
        </section>
      </main>
    </div>
  );
};

// Mount the App
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<App />);
}

export default App;
