import React from 'react';
import { 
  ChevronRight, 
  ChevronLeft, 
  Phone, 
  Mail, 
  ShieldCheck, 
  RefreshCw, 
  CheckCircle2, 
  Lock, 
  User, 
  Building2, 
  Languages, 
  BarChart3 
} from 'lucide-react';

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
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-1">{t.passwordLabel}</label>
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
                <div className="flex justify-end mt-2 px-1">
                  <button type="button" onClick={() => {setAuthView('forgot-choice');}} className="text-xs font-bold text-blue-600 hover:underline">{t.forgotPass}</button>
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

export default LoginPage;
