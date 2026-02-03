// دریافت آیکون‌ها از ماژول سراسری React Lucide
// این روش در محیط بدون بیلد (No-Build) بسیار امن‌تر است
import * as LucideIcons from 'lucide-react';

// استخراج آیکون‌های مورد نیاز از پکیج ایمپورت شده
const { 
  LayoutDashboard, Receipt, Wallet, BarChart3, Settings, Languages, Bell, Search, 
  ArrowUpRight, ArrowDownLeft, Plus, MoreVertical, ChevronRight, ChevronLeft, Users, 
  CreditCard, Lock, Mail, User, LogOut, ShieldCheck, Building2, Phone, CheckCircle2, 
  RefreshCw, ChevronDown, Briefcase, UserCheck, GitBranch, Key, Globe, Filter, X, 
  Calendar, Layers, ChevronRightSquare, LayoutGrid
} = LucideIcons;

// --- Helper Functions ---
window.flattenMenu = (items, parentModuleId = null) => {
  return items.reduce((acc, item) => {
    const currentModuleId = parentModuleId || item.id;
    acc.push({ ...item, moduleId: currentModuleId });
    if (item.children) {
      acc.push(...window.flattenMenu(item.children, currentModuleId));
    }
    return acc;
  }, []);
};

// --- Static Menu Structure ---
window.MENU_DATA = [
  { 
    id: 'dashboards', 
    label: { en: 'Dashboards', fa: 'داشبوردها' }, 
    icon: LayoutDashboard,
    children: [
      { id: 'dashboards_gen', label: { en: 'General Dashboards', fa: 'داشبوردهای عمومی' } },
      { id: 'dashboards_spec', label: { en: 'Specific Dashboards', fa: 'داشبوردهای اختصاصی' } }
    ]
  },
  { 
    id: 'workspace', 
    label: { en: 'Workspace', fa: 'میز کار' }, 
    icon: Briefcase,
    children: [
      { id: 'workspace_gen', label: { en: 'General Workspace', fa: 'میزکار عمومی' } },
      { id: 'workspace_spec', label: { en: 'Specific Workspace', fa: 'میزکار اختصاصی' } }
    ]
  },
  { 
    id: 'accounting', 
    label: { en: 'Accounting', fa: 'حسابداری و مالی' }, 
    icon: BarChart3,
    children: [
      { 
        id: 'gl', 
        label: { en: 'General Ledger', fa: 'دفتر کل' },
        children: [
          {
            id: 'gl_settings',
            label: { en: 'GL Settings', fa: 'تنظیمات دفتر کل' },
            children: [
              { id: 'auto_num', label: { en: 'Auto Numbering', fa: 'شماره‌گذاری اتوماتیک' } },
              { id: 'year_end_setup', label: { en: 'Year-end Settings', fa: 'تنظیمات عملیات پایان سال' } },
              { id: 'allowed_modules', label: { en: 'Allowed Modules', fa: 'ماژول‌های مجاز' } },
            ]
          },
          {
            id: 'gl_base_info',
            label: { en: 'Base Information', fa: 'اطلاعات پایه' },
            children: [
              { id: 'ledgers', label: { en: 'Ledgers', fa: 'دفاتر' } },
              { id: 'acc_structure', label: { en: 'Account Structure', fa: 'ساختار حساب' } },
              { id: 'details', label: { en: 'Details', fa: 'تفصیل‌ها' } },
              { id: 'fiscal_periods', label: { en: 'Fiscal Periods', fa: 'دوره‌های مالی' } },
              { id: 'doc_types', label: { en: 'Document Types', fa: 'انواع اسناد' } },
              { id: 'std_desc', label: { en: 'Standard Descriptions', fa: 'شرح‌های استاندارد' } },
            ]
          },
          {
            id: 'gl_docs',
            label: { en: 'Document Management', fa: 'مدیریت اسناد' },
            children: [
              { id: 'doc_list', label: { en: 'Document List', fa: 'فهرست اسناد' } },
              { id: 'doc_review', label: { en: 'Document Review', fa: 'بررسی اسناد' } },
              { id: 'doc_finalize', label: { en: 'Finalize Documents', fa: 'قطعی کردن اسناد' } },
            ]
          },
          {
            id: 'gl_reports',
            label: { en: 'Reports & Analytics', fa: 'گزارش‌ها و تحلیل‌ها' },
            children: [
              { id: 'print_doc', label: { en: 'Print Accounting Doc', fa: 'چاپ سند حسابداری' } },
              { id: 'acc_review', label: { en: 'Account Review', fa: 'مرور حساب‌ها' } },
            ]
          }
        ]
      },
      { 
        id: 'treasury', 
        label: { en: 'Treasury', fa: 'خزانه‌داری' },
        children: [
          {
            id: 'tr_settings',
            label: { en: 'Treasury Settings', fa: 'تنظیمات خزانه‌داری' },
            children: [
              { id: 'balance_control', label: { en: 'Balance Control', fa: 'کنترل مانده منابع' } }
            ]
          },
          {
            id: 'tr_base_info',
            label: { en: 'Base Information', fa: 'اطلاعات پایه' },
            children: [
              { id: 'banks', label: { en: 'Banks', fa: 'بانک‌ها' } },
              { id: 'acc_types', label: { en: 'Account Types', fa: 'انواع حساب‌های بانکی' } },
              { id: 'acc_setup', label: { en: 'Account Setup', fa: 'استقرار حساب‌ها' } },
              { id: 'safes', label: { en: 'Safes', fa: 'صندوق‌ها' } },
              { id: 'promissory', label: { en: 'Promissory Notes', fa: 'سفته‌ها' } },
              { id: 'cheque_types', label: { en: 'Cheque Types', fa: 'انواع چک' } },
              { id: 'petty_cashiers', label: { en: 'Petty Cashiers', fa: 'تنخواه دارها' } },
              { id: 'cheque_books', label: { en: 'Cheque Books', fa: 'دسته چک' } },
              { id: 'print_template', label: { en: 'Print Templates', fa: 'الگوی چاپ چک' } },
              { id: 'reasons', label: { en: 'Reasons/Descriptions', fa: 'بابت‌ها/ شرح‌ها' } },
              { id: 'blank_promissory', label: { en: 'Blank Promissory', fa: 'سفته سفید' } },
            ]
          },
          {
            id: 'tr_init',
            label: { en: 'Initial Operations', fa: 'عملیات ابتدای دوره/ سال' },
            children: [
              { id: 'ap_setup', label: { en: 'A/P Setup', fa: 'استقرار حساب‌های پرداختنی' } },
              { id: 'ar_setup', label: { en: 'A/R Setup', fa: 'استقرار اسناد دریافتنی' } },
              { id: 'opening_balance', label: { en: 'Opening Balance', fa: 'موجودی ابتدای دوره' } },
            ]
          },
          {
            id: 'tr_ops',
            label: { en: 'Receipt & Payment', fa: 'عملیات دریافت و پرداخت' },
            children: [
              { id: 'receipts', label: { en: 'Receipts', fa: 'دریافت‌ها' } },
              { id: 'payments', label: { en: 'Payments', fa: 'پرداخت‌ها' } },
              { id: 'transfers', label: { en: 'Transfers', fa: 'عملیات انتقال' } },
              { id: 'petty_summary', label: { en: 'Petty Cash Summary', fa: 'صورت خلاصه تنخواه' } },
              { id: 'batch_ops', label: { en: 'Batch Operations', fa: 'عملیات گروهی' } },
            ]
          },
          {
            id: 'tr_requests',
            label: { en: 'Request Management', fa: 'مدیریت درخواست‌ها' },
            children: [
              { id: 'payment_req', label: { en: 'Payment Requests', fa: 'درخواست پرداخت' } },
              { id: 'my_requests', label: { en: 'My Requests', fa: 'درخواست‌های من' } },
            ]
          },
          {
            id: 'tr_reports',
            label: { en: 'Reports & Analytics', fa: 'گزارش‌ها و تحلیل‌ها' },
            children: [
              { id: 'print_req', label: { en: 'Print Request', fa: 'چاپ درخواست' } },
              { id: 'print_cheque', label: { en: 'Print Cheque', fa: 'چاپ چک' } },
              { id: 'review_req', label: { en: 'Review Requests', fa: 'مرور درخواست‌ها' } },
              { id: 'review_rp', label: { en: 'Review R/P', fa: 'مرور دریافت/ پرداخت' } },
            ]
          }
        ]
      },
      { id: 'budgeting', label: { en: 'Budgeting', fa: 'بودجه‌ریزی' } },
    ]
  },
  {
    id: 'hr',
    label: { en: 'Human Capital', fa: 'سرمایه انسانی' },
    icon: Users,
    children: [
      { id: 'employees', label: { en: 'Employee Management', fa: 'مدیریت کارکنان' } },
      { id: 'compensation', label: { en: 'Compensation', fa: 'جبران خدمات' } },
    ]
  },
  {
    id: 'workflow',
    label: { en: 'Workflow', fa: 'مدیریت گردش کار' },
    icon: GitBranch,
    children: [
      { id: 'processes', label: { en: 'Process Management', fa: 'مدیریت فرایندها' } },
      { id: 'inbox', label: { en: 'Inbox Management', fa: 'مدیریت کارتابل' } },
      { id: 'tasks', label: { en: 'Task Management', fa: 'مدیریت کارها' } },
    ]
  },
  {
    id: 'system_settings',
    label: { en: 'Settings', fa: 'تنظیمات سیستم' },
    icon: Settings,
    children: [
      { id: 'general_settings', label: { en: 'General Settings', fa: 'تنظیمات عمومی' } },
      { id: 'integrations', label: { en: 'Integrations', fa: 'ارتباط با سایر سیستم‌ها' } },
    ]
  },
  {
    id: 'permissions',
    label: { en: 'Access', fa: 'حقوق دسترسی' },
    icon: Key,
    children: [
      { id: 'users_list', label: { en: 'Users', fa: 'کاربران' } },
      { id: 'roles', label: { en: 'Roles', fa: 'نقش‌ها' } },
      { id: 'access_mgmt', label: { en: 'Access Management', fa: 'مدیریت دسترسی‌ها' } },
    ]
  }
];

// --- Mock Data ---
window.MOCK_TRANSACTIONS = [
  { id: 1, title: { en: 'Monthly Server Hosting', fa: 'هزینه میزبانی سرور ماهانه' }, amount: 1200, type: 'expense', date: '2024-03-01', category: 'IT' },
  { id: 2, title: { en: 'Consultancy Fee', fa: 'هزینه مشاوره' }, amount: 4500, type: 'income', date: '2024-03-02', category: 'Service' },
  { id: 3, title: { en: 'Office Supplies', fa: 'لوازم اداری' }, amount: 350, type: 'expense', date: '2024-03-03', category: 'Admin' },
  { id: 4, title: { en: 'Client Payment', fa: 'پرداخت مشتری' }, amount: 12500, type: 'income', date: '2024-03-04', category: 'Sales' },
];

window.MOCK_STATS = [
  { id: 1, label: { en: 'Total Balance', fa: 'موجودی کل' }, value: '$124,500.00', change: '+12.5%', icon: Wallet, color: 'text-blue-600' },
  { id: 2, label: { en: 'Monthly Revenue', fa: 'درآمد ماهانه' }, value: '$45,200.00', change: '+8.2%', icon: ArrowUpRight, color: 'text-green-600' },
  { id: 3, label: { en: 'Total Expenses', fa: 'مجموع هزینه‌ها' }, value: '$12,800.00', change: '-2.4%', icon: ArrowDownLeft, color: 'text-red-600' },
  { id: 4, label: { en: 'Active Accounts', fa: 'حساب‌های فعال' }, value: '18', change: '0', icon: UserCheck, color: 'text-purple-600' },
];

window.translations = {
  en: {
    loginTitle: 'Secure Sign In',
    loginSubtitle: 'Enter your credentials to access the financial portal',
    usernameLabel: 'Username',
    passwordLabel: 'Password',
    emailLabel: 'Corporate Email',
    loginBtn: 'Sign In',
    logoutBtn: 'Logout',
    standardMethod: 'Standard',
    adMethod: 'Active Directory',
    invalidCreds: 'Invalid username or password',
    forgotPass: 'Forgot Password?',
    backToLogin: 'Back to Login',
    resetMethodTitle: 'Reset Password',
    resetMethodSubtitle: 'Choose how you want to recover your account',
    viaSms: 'Via SMS OTP',
    viaEmail: 'Via Email Link',
    mobileLabel: 'Mobile Number',
    sendOtp: 'Send Code',
    enterOtp: 'Enter 6-digit Code',
    verifyOtp: 'Verify & Continue',
    invalidOtp: 'Invalid OTP code',
    newPasswordLabel: 'New Password',
    confirmPasswordLabel: 'Confirm New Password',
    updatePassword: 'Update Password',
    resetSuccess: 'Password Updated Successfully',
    emailSent: 'Reset Link Sent',
    emailSentDesc: 'Please check your corporate inbox for the recovery link.',
    searchMenu: 'Search all menus...',
    welcome: 'Welcome Back, Admin',
    financialOverview: 'Financial Overview',
    language: 'English',
    recentTransactions: 'Recent Transactions',
    budgetAlloc: 'Budget Allocation',
    fiscalYear: 'Fiscal Year',
    ledger: 'Ledger',
    company: 'Company',
    filters: 'Global Filters',
    all: 'All',
    emptyPage: 'This module is currently empty or under development.'
  },
  fa: {
    loginTitle: 'ورود ایمن به سیستم',
    loginSubtitle: 'برای دسترسی به پرتال مالی، اطلاعات خود را وارد کنید',
    usernameLabel: 'نام کاربری',
    passwordLabel: 'رمز عبور',
    emailLabel: 'ایمیل سازمانی',
    loginBtn: 'ورود به سیستم',
    logoutBtn: 'خروج',
    standardMethod: 'استاندارد',
    adMethod: 'اکتیو دایرکتوری',
    invalidCreds: 'نام کاربری یا رمز عبور اشتباه است',
    forgotPass: 'رمز عبور را فراموش کرده‌اید؟',
    backToLogin: 'بازگشت به ورود',
    resetMethodTitle: 'بازیابی رمز عبور',
    resetMethodSubtitle: 'روش بازیابی حساب کاربری خود را انتخاب کنید',
    viaSms: 'پیامک (کد یکبار مصرف)',
    viaEmail: 'ایمیل (لینک بازیابی)',
    mobileLabel: 'شماره موبایل',
    sendOtp: 'ارسال کد',
    enterOtp: 'کد ۶ رقمی را وارد کنید',
    verifyOtp: 'تایید و ادامه',
    invalidOtp: 'کد تایید وارد شده صحیح نیست',
    newPasswordLabel: 'رمز عبور جدید',
    confirmPasswordLabel: 'تکرار رمز عبور جدید',
    updatePassword: 'بروزرسانی رمز عبور',
    resetSuccess: 'رمز عبور با موفقیت تغییر یافت',
    emailSent: 'لینک بازیابی ارسال شد',
    emailSentDesc: 'لطفاً صندوق ورودی ایمیل سازمانی خود را بررسی کنید.',
    searchMenu: 'جستجو در تمام منوها...',
    welcome: 'خوش آمدید، مدیر سیستم',
    financialOverview: 'مرور وضعیت مالی',
    language: 'فارسی',
    recentTransactions: 'تراکنش‌های اخیر',
    budgetAlloc: 'توزیع بودجه',
    fiscalYear: 'سال مالی',
    ledger: 'دفتر',
    company: 'شرکت',
    filters: 'فیلترهای عمومی',
    all: 'همه',
    emptyPage: 'این بخش در حال حاضر خالی است یا در دست توسعه می‌باشد.'
  }
};
