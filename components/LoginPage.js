/* Filename: components/LoginPage.js */
import React from 'react';
import { 
  User, Lock, Mail, Smartphone, ArrowRight, ArrowLeft, 
  CheckCircle2, AlertCircle, Key, ShieldCheck 
} from 'lucide-react';

const LoginPage = ({ 
  t, isRtl, authView, setAuthView, 
  loginMethod, setLoginMethod, 
  loginData, setLoginData, 
  recoveryData, setRecoveryData, 
  error, handleLogin, toggleLanguage,
  handleVerifyOtp, handleUpdatePassword 
}) => {
  
  const DirectionIcon = isRtl ? ArrowLeft : ArrowRight;

  // --- 1. LOGIN VIEW ---
  if (authView === 'login') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 relative overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
           <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-indigo-200/30 rounded-full blur-3xl animate-pulse"></div>
           <div className="absolute top-[40%] -right-[10%] w-[40%] h-[60%] bg-blue-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-full max-w-md z-10 border border-white">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-indigo-200 mb-4">
              <ShieldCheck size={32} className="text-white" />
            </div>
            <h1 className="text-2xl font-black text-slate-800">{t.loginTitle}</h1>
            <p className="text-slate-500 text-sm mt-2">{t.loginSubtitle}</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2 text-red-600 text-sm animate-in slide-in-from-top-2">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">{t.usernameLabel}</label>
              <div className="relative">
                <div className={`absolute top-1/2 -translate-y-1/2 text-slate-400 ${isRtl ? 'right-3' : 'left-3'}`}>
                  <User size={18} />
                </div>
                <input 
                  type="text" 
                  value={loginData.identifier}
                  onChange={e => setLoginData({...loginData, identifier: e.target.value})}
                  className={`w-full h-10 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm text-slate-800 placeholder:text-slate-400 ${isRtl ? 'pr-10 pl-3' : 'pl-10 pr-3'}`}
                  placeholder="admin"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">{t.passwordLabel}</label>
              <div className="relative">
                <div className={`absolute top-1/2 -translate-y-1/2 text-slate-400 ${isRtl ? 'right-3' : 'left-3'}`}>
                  <Lock size={18} />
                </div>
                <input 
                  type="password" 
                  value={loginData.password}
                  onChange={e => setLoginData({...loginData, password: e.target.value})}
                  className={`w-full h-10 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm text-slate-800 placeholder:text-slate-400 ${isRtl ? 'pr-10 pl-3' : 'pl-10 pr-3'}`}
                  placeholder="admin"
                />
              </div>
            </div>

            <div className="flex items-center justify-between mt-2">
               <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded text-indigo-600 focus:ring-indigo-500" />
                  <span className="text-xs text-slate-500">مرا به خاطر بسپار</span>
               </label>
               <button type="button" onClick={() => setAuthView('forgot')} className="text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:underline">
                 {t.forgotPass}
               </button>
            </div>

            <button type="submit" className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-md shadow-indigo-200 transition-all active:scale-[0.98] mt-4">
              {t.loginBtn}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between">
             <button onClick={toggleLanguage} className="text-xs font-medium text-slate-400 hover:text-slate-600 flex items-center gap-1 transition-colors">
                <span className="uppercase">{isRtl ? 'English' : 'فارسی'}</span>
             </button>
             <span className="text-[10px] text-slate-300">v2.5.0 Enterprise</span>
          </div>
        </div>
      </div>
    );
  }

  // --- 2. FORGOT PASSWORD (Selection) ---
  if (authView === 'forgot') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 relative">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md z-10 animate-in zoom-in-95 duration-300">
           <button onClick={() => setAuthView('login')} className="mb-6 flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors">
              <DirectionIcon size={14}/> {t.backToLogin}
           </button>
           
           <div className="text-center mb-8">
              <div className="w-12 h-12 bg-blue-100 rounded-xl mx-auto flex items-center justify-center text-blue-600 mb-3">
                 <Key size={24}/>
              </div>
              <h2 className="text-xl font-bold text-slate-800">{t.resetMethodTitle}</h2>
              <p className="text-slate-500 text-xs mt-1">{t.resetMethodSubtitle}</p>
           </div>

           <div className="space-y-3">
              <button 
                onClick={() => setAuthView('otp')}
                className="w-full flex items-center gap-4 p-4 border border-slate-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all group text-right"
              >
                 <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500 group-hover:bg-white group-hover:text-indigo-600 transition-colors">
                    <Smartphone size={20}/>
                 </div>
                 <div>
                    <span className="block text-sm font-bold text-slate-700 group-hover:text-indigo-800">{t.viaSms}</span>
                    <span className="block text-[10px] text-slate-400">ارسال کد تایید به ۰۹۱۲***۸۹</span>
                 </div>
                 <div className="mr-auto text-slate-300 group-hover:text-indigo-400">
                    <DirectionIcon size={16} className={isRtl ? 'rotate-180' : ''} />
                 </div>
              </button>

              <button className="w-full flex items-center gap-4 p-4 border border-slate-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all group text-right">
                 <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500 group-hover:bg-white group-hover:text-indigo-600 transition-colors">
                    <Mail size={20}/>
                 </div>
                 <div>
                    <span className="block text-sm font-bold text-slate-700 group-hover:text-indigo-800">{t.viaEmail}</span>
                    <span className="block text-[10px] text-slate-400">ارسال لینک به admin@company.com</span>
                 </div>
              </button>
           </div>
        </div>
      </div>
    );
  }

  // --- 3. OTP ENTRY ---
  if (authView === 'otp') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 relative">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md z-10 animate-in slide-in-from-right-8 duration-300">
           <button onClick={() => setAuthView('forgot')} className="mb-6 flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors">
              <DirectionIcon size={14}/> بازگشت
           </button>

           <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-slate-800">کد تایید را وارد کنید</h2>
              <p className="text-slate-500 text-xs mt-1">کد ۶ رقمی ارسال شده به موبایل خود را وارد نمایید</p>
              <div className="mt-2 inline-block bg-yellow-50 text-yellow-700 text-[10px] px-2 py-1 rounded border border-yellow-200">
                 کد آزمایشی: 123456
              </div>
           </div>

           {error && (
            <div className="mb-4 p-2 bg-red-50 text-red-600 text-xs rounded text-center border border-red-100">
              {error}
            </div>
           )}

           <form onSubmit={handleVerifyOtp} className="space-y-6">
              <input 
                 type="text" 
                 value={recoveryData.otp}
                 onChange={e => setRecoveryData({...recoveryData, otp: e.target.value})}
                 className="w-full h-12 text-center text-2xl tracking-[0.5em] font-mono border-2 border-slate-200 rounded-xl outline-none focus:border-indigo-500 transition-all text-slate-700"
                 maxLength={6}
                 autoFocus
                 placeholder="------"
              />
              <button type="submit" className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-md transition-all">
                 {t.verifyOtp}
              </button>
           </form>
        </div>
      </div>
    );
  }

  // --- 4. RESET PASSWORD (The Missing Part) ---
  if (authView === 'reset') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 relative">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md z-10 animate-in fade-in duration-500">
           <div className="text-center mb-8">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl mx-auto flex items-center justify-center text-emerald-600 mb-3">
                 <Lock size={24}/>
              </div>
              <h2 className="text-xl font-bold text-slate-800">{t.resetMethodTitle}</h2>
              <p className="text-slate-500 text-xs mt-1">لطفاً رمز عبور جدید خود را وارد کنید</p>
           </div>

           {error && (
            <div className="mb-4 p-2 bg-red-50 text-red-600 text-xs rounded text-center border border-red-100">
              {error}
            </div>
           )}

           <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                 <label className="block text-xs font-bold text-slate-600 mb-1.5">{t.newPasswordLabel}</label>
                 <div className="relative">
                    <input 
                       type="password" 
                       value={recoveryData.newPass}
                       onChange={e => setRecoveryData({...recoveryData, newPass: e.target.value})}
                       className={`w-full h-10 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm text-slate-800 placeholder:text-slate-400 px-3`}
                       placeholder="********"
                    />
                 </div>
              </div>
              <div>
                 <label className="block text-xs font-bold text-slate-600 mb-1.5">{t.confirmPasswordLabel}</label>
                 <div className="relative">
                    <input 
                       type="password" 
                       value={recoveryData.confirmPass}
                       onChange={e => setRecoveryData({...recoveryData, confirmPass: e.target.value})}
                       className={`w-full h-10 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm text-slate-800 placeholder:text-slate-400 px-3`}
                       placeholder="********"
                    />
                 </div>
              </div>

              <div className="pt-2">
                 <button type="submit" className="w-full h-10 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-md transition-all">
                    {t.updatePassword}
                 </button>
              </div>
           </form>
        </div>
      </div>
    );
  }

  return <div>Loading...</div>;
};

window.LoginPage = LoginPage;
