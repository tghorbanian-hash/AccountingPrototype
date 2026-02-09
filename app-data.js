/* Filename: app-data.js */

// دریافت تمام آیکون‌ها از ماژول Lucide
import * as LucideIcons from 'lucide-react';

// استخراج آیکون‌های مورد نیاز برای منوها و صفحات
const { 
  LayoutDashboard, Receipt, Wallet, BarChart3, Settings, Languages, Bell, Search, 
  ArrowUpRight, ArrowDownLeft, Plus, MoreVertical, ChevronRight, ChevronLeft, Users, 
  CreditCard, Lock, Mail, User, LogOut, ShieldCheck, Building2, Phone, CheckCircle2, 
  RefreshCw, ChevronDown, Briefcase, UserCheck, GitBranch, Key, Globe, Filter, X, 
  Calendar, Layers, ChevronRightSquare, LayoutGrid, Edit, Trash2, Save, MoreHorizontal,
  XCircle, FileText, CheckSquare, Eye, MousePointerClick, Component, Info, Moon, Sun,
  Shield, Database, Network, Banknote, MapPin, ListTodo, ArrowLeftRight, Coins, Check
} = LucideIcons;

// --- توابع کمکی (Helper Functions) ---
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

// --- ساختار منوی اصلی سیستم (MENU_DATA) ---
window.MENU_DATA = [
  {
    id: 'showcase',
    label: { en: 'UI Kit (Showcase)', fa: 'نمونه دیزاین (UI Kit)' },
    icon: Component,
    children: [
      { id: 'ui_showcase', label: { en: 'All Components', fa: 'نمونه تمام کامپوننت‌ها' } }
    ]
  },
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
      { 
        id: 'general_settings', 
        label: { en: 'General Settings', fa: 'تنظیمات عمومی' },
        children: [
          {
            id: 'base_info_root',
            label: { en: 'Base Information', fa: 'اطلاعات پایه' },
            children: [
              { id: 'org_info', label: { en: 'Organization Info', fa: 'اطلاعات سازمان' }, icon: Building2 },
              { id: 'org_chart', label: { en: 'Organization Chart', fa: 'چارت سازمانی' }, icon: Network },
              { id: 'currency_settings', label: { en: 'Currency Settings', fa: 'تنظیمات ارزها' }, icon: Banknote },
              { id: 'branches', label: { en: 'Branches', fa: 'شعبه ها' }, icon: MapPin },
              { id: 'cost_centers', label: { en: 'Cost Centers', fa: 'مراکز هزینه' }, icon: Layers },
              { id: 'projects', label: { en: 'Projects', fa: 'پروژه ها' }, icon: ListTodo },
              { id: 'parties', label: { en: 'Parties & Companies', fa: 'اشخاص و شرکت‌ها' }, icon: Users }
            ]
          }
        ]
      },
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

// --- Mock Data (داده‌های تستی) ---
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

// --- Schema for Default Values (ساختار تنظیمات پیش‌فرض) ---
window.DEFAULT_VALUES_SCHEMA = [
  {
    moduleId: 'accounting',
    label: { en: 'Accounting & Finance', fa: 'حسابداری و مالی' },
    icon: BarChart3,
    groups: [
      {
        groupId: 'gl',
        label: { en: 'General Ledger', fa: 'دفتر کل' },
        fields: [
          { 
            key: 'defaultDocType', 
            label: { en: 'Default Document Type', fa: 'نوع سند پیش‌فرض' },
            type: 'select',
            options: [
              { value: 'general', label: { en: 'General', fa: 'عمومی' } },
              { value: 'opening', label: { en: 'Opening', fa: 'افتتاحیه' } },
              { value: 'closing', label: { en: 'Closing', fa: 'اختتامیه' } }
            ]
          },
          { 
            key: 'autoPost', 
            label: { en: 'Auto Post Documents', fa: 'قطعی شدن خودکار اسناد' },
            type: 'toggle'
          }
        ]
      },
      {
        groupId: 'treasury',
        label: { en: 'Treasury', fa: 'خزانه‌داری' },
        fields: [
          {
            key: 'paymentType',
            label: { en: 'Default Payment Type', fa: 'نوع پرداخت پیش‌فرض' },
            type: 'select',
            options: [
              { value: 'expense', label: { en: 'Expense', fa: 'هزینه' } },
              { value: 'prepayment', label: { en: 'Prepayment', fa: 'پیش‌پرداخت' } },
              { value: 'transfer', label: { en: 'Transfer', fa: 'انتقال' } }
            ]
          },
          {
             key: 'defaultBank',
             label: { en: 'Default Bank Account', fa: 'حساب بانکی پیش‌فرض' },
             type: 'select',
             options: [
                { value: 'mellat', label: { en: 'Mellat Bank - Main', fa: 'بانک ملت - اصلی' } },
                { value: 'pasargad', label: { en: 'Pasargad Bank', fa: 'بانک پاسارگاد' } }
             ]
          }
        ]
      }
    ]
  },
  {
    moduleId: 'hr',
    label: { en: 'Human Resources', fa: 'منابع انسانی' },
    icon: Users,
    groups: [
      {
        groupId: 'recruitment',
        label: { en: 'Recruitment', fa: 'استخدام' },
        fields: [
          {
             key: 'probationPeriod',
             label: { en: 'Default Probation (Months)', fa: 'مدت آزمایشی پیش‌فرض (ماه)' },
             type: 'select',
             options: [
                { value: '1', label: { en: '1 Month', fa: '۱ ماه' } },
                { value: '3', label: { en: '3 Months', fa: '۳ ماه' } }
             ]
          }
        ]
      }
    ]
  }
];

// --- دیکشنری ترجمه (Translations) ---
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
    emptyPage: 'This module is currently empty or under development.',
    uiKitTitle: 'Design System Showcase',

    // User Profile Translations
    profileTitle: 'User Profile',
    profileSubtitle: 'Manage your account settings and preferences',
    personalInfo: 'Personal Information',
    security: 'Security',
    preferences: 'System Preferences',
    defaultValues: 'Default Values',
    defaultValuesDesc: 'Set default values for faster data entry across the system.',
    changePass: 'Change Password',
    changePassDesc: 'Update your password securely.',
    currentPass: 'Current Password',
    theme: 'Theme',
    themeLight: 'Light Mode',
    themeDark: 'Dark Mode',
    langSettings: 'Language',
    saveDefaults: 'Save Default Values',
    defaultsSaved: 'Default values saved successfully.',
    
    // Organization Info Translations (NEW)
    org_title: "Organization Info",
    org_subtitle: "Manage company base information and branches",
    org_code: "Org Code",
    org_name: "Org Name",
    org_regNo: "Registration No",
    org_phone: "Phone",
    org_fax: "Fax",
    org_logo: "Upload Logo",
    org_address: "Addresses",
    org_newAddr: "Enter new address...",
    org_addrCount: "Addr. Count",
    org_editTitle: "Edit Organization Info",
    org_newTitle: "New Organization",
    org_noAddr: "No addresses registered.",
    org_selectLogo: "Select Logo Image",
    
    // Currency Settings Translations (NEW)
    curr_title: "Currency Settings",
    curr_subtitle: "Manage system currencies and exchange rates",
    curr_global: "Global System Settings",
    curr_base: "Base Currency",
    curr_op: "Operational Currency",
    curr_rep1: "Reporting Currency 1",
    curr_rep2: "Reporting Currency 2",
    curr_history: "Rates History",
    curr_update: "Update Rates",
    curr_code: "Code",
    curr_desc: "Description",
    curr_symbol: "Symbol",
    curr_method: "Rate Method",
    curr_method_auto: "Automatic",
    curr_method_manual: "Manual",
    curr_decimals: "Decimals",
    curr_active: "Active",
    curr_reciprocal: "Reciprocal",
    curr_reciprocal_desc: "Auto-calculate inverse rate",
    curr_status: "Status",
    curr_manage_rates: "Manage Rates",
    curr_defined_rates: "Defined Rates",
    curr_target: "Target Currency",
    curr_rate: "Exchange Rate (1 Unit)",
    curr_no_rates: "No exchange rates defined.",
    curr_history_title: "Exchange Rates Update History",
    curr_source: "Source",
    curr_target_curr: "Target",
    curr_date: "Date",
    curr_time: "Time",
    curr_rate_val: "Rate",
    curr_edit: "Edit Currency",
    curr_new: "New Currency",
    curr_save_global_success: "Global settings saved successfully.",
    curr_update_success: "Exchange rates updated successfully.",
    
    // Common
    btn_save: "Save",
    btn_cancel: "Cancel",
    btn_search: "Apply Filter",
    btn_clear: "Clear",
    btn_add: "Add",
    btn_close: "Close",
    confirm_delete: "Are you sure you want to delete {0} records?",
    confirm_delete_single: "Are you sure you want to delete this record?",
    
    // ... (Other translations remain the same)
    acc_mgmt_title: "Accounting Document Management",
    acc_mgmt_subtitle: "List of all financial documents with search and batch operation capabilities",
    grid_title: "Document List",
    col_docNo: "Doc No",
    col_date: "Date",
    col_dept: "Department",
    col_desc: "Description",
    col_debtor: "Debtor",
    col_status: "Status",
    col_active: "Active",
    col_actions: "Actions",
    status_final: "Final",
    status_draft: "Draft",
    status_reviewed: "Reviewed",
    filter_fromDoc: "From Doc No",
    filter_toDoc: "To Doc No",
    filter_fromDate: "From Date",
    filter_toDate: "To Date",
    filter_status: "Document Status",
    filter_costCenter: "Cost Center",
    filter_subsidiary: "Subsidiary Account",
    filter_allStatus: "All Statuses",
    modal_newDoc: "New Document",
    modal_editDoc: "Edit Document",
    modal_warning: "Note: Changes to final documents require financial manager approval.",
    field_docType: "Document Type",
    field_general: "General",
    field_opening: "Opening",
    field_party: "Party",
    field_selectParty: "Select Person...",
    field_amount: "Document Amount",
    field_isActive: "Active Document",
    
    usersListTitle: 'User Management',
    usersListSubtitle: 'Manage system access and user profiles',
    createNewUser: 'New User',
    searchUserPlaceholder: 'Search by username...',
    filter: 'Filter',
    colId: 'ID',
    colUsername: 'Username',
    colLinkedPerson: 'Linked Person',
    colUserType: 'User Type',
    colStatus: 'Status',
    colActions: 'Actions',
    active: 'Active',
    inactive: 'Inactive',
    roleAdmin: 'System Admin',
    roleUser: 'System User',
    editUserTitle: 'Edit User Profile',
    newUserTitle: 'Define New User',
    newUserSubtitle: 'Fill in the form to create a new user account',
    editingId: 'Editing ID',
    fieldId: 'User ID',
    fieldUsername: 'Username',
    fieldStatus: 'Account Status',
    fieldUserType: 'User Type',
    fieldLinkedPerson: 'Linked Person (Entity)',
    selectPersonPlaceholder: '- Select a Person -',
    linkedPersonHelp: 'Link this user account to a predefined person entity in the system.',
    fieldPassword: 'Password Management',
    enterPassword: 'Enter new password...',
    resetDefault: 'Reset to Default',
    passwordResetMsg: 'Password has been reset to "DefaultPassword123!"',
    cancel: 'Cancel',
    saveChanges: 'Save & Close',
    confirmDelete: 'Are you sure you want to delete this user?',
    recordsFound: 'records found',
    edit: 'Edit',
    delete: 'Delete',
    viewPermissions: 'View Permissions',
    permModalTitle: 'User Access & Permissions',
    permColSource: 'Access Source',
    permColForms: 'Accessible Forms',
    permColOps: 'Allowed Operations',
    permTypeRole: 'Role',
    permTypeUser: 'User',
    permSelectSource: 'Select a Source',
    permSelectForm: 'Select a Form',
    ws_title: "User Workspace",
    ws_subtitle: "Exchange & Accounting Management System",
    kpi_cash: "Cash & Bank Balance",
    kpi_receivable: "Accounts Receivable",
    kpi_payable: "Accounts Payable",
    kpi_profit: "Monthly Net Profit",
    btn_invoice: "+ Buy/Sell Currency",
    btn_check: "Receive Check",
    btn_payment_req: "Payment Request",
    btn_expense: "Record Expense",
    btn_account: "New Contact/Account",
    table_title: "Recent Transactions",
    th_id: "ID",
    th_date: "Date",
    th_desc: "Description",
    th_amount: "Amount",
    th_status: "Status",
    row1_desc: "USD Purchase - 5,000$",
    row2_desc: "Office Rent - Jan 2026",
    row3_desc: "EUR Sale - 2,200€",
    status_paid: "Paid",
    status_pending: "Pending",
    sidebar_title: "Critical Alerts",
    alert1_title: "Check Due Soon",
    alert1_sub: "Mellat Bank - Tomorrow",
    alert2_title: "Overdue Invoice",
    alert2_sub: "Client A - 10 Days Delay",
    alert3_title: "Credit Limit Warning",
    alert3_sub: "Exchange Partner B - Near Limit",
    mod_exp_title: "Record New Expense",
    mod_acc_title: "New Contact",
    lbl_category: "Category",
    lbl_amount: "Amount",
    opt_rent: "Rent",
    opt_salary: "Salary",
    btn_save_data: "Save Data",
    ph_name: "Contact Name",
    ph_phone: "Phone Number"
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
    emptyPage: 'این بخش در حال حاضر خالی است یا در دست توسعه می‌باشد.',
    uiKitTitle: 'نمایش دیزاین سیستم',

    // User Profile Translations
    profileTitle: 'پروفایل کاربری',
    profileSubtitle: 'مدیریت تنظیمات حساب و اولویت‌های شخصی',
    personalInfo: 'اطلاعات فردی',
    security: 'امنیت',
    preferences: 'تنظیمات سیستم',
    defaultValues: 'مقادیر پیش‌فرض',
    defaultValuesDesc: 'تعیین مقادیر پیش‌فرض برای افزایش سرعت ورود اطلاعات در سیستم.',
    changePass: 'تغییر رمز عبور',
    changePassDesc: 'به‌روزرسانی امن کلمه عبور',
    currentPass: 'رمز عبور فعلی',
    theme: 'تم سیستم',
    themeLight: 'حالت روشن',
    themeDark: 'حالت تاریک',
    langSettings: 'زبان',
    saveDefaults: 'ذخیره مقادیر پیش‌فرض',
    defaultsSaved: 'مقادیر پیش‌فرض با موفقیت ذخیره شد.',
    
    // Organization Info Translations (NEW)
    org_title: "معرفی سازمان",
    org_subtitle: "مدیریت اطلاعات پایه شرکت و شعبه‌ها",
    org_code: "کد شرکت",
    org_name: "نام شرکت",
    org_regNo: "شماره ثبت",
    org_phone: "تلفن",
    org_fax: "فکس",
    org_logo: "انتخاب تصویر لوگو",
    org_address: "آدرس‌ها",
    org_newAddr: "آدرس جدید را وارد کنید...",
    org_addrCount: "تعداد آدرس",
    org_editTitle: "ویرایش اطلاعات سازمان",
    org_newTitle: "تعریف سازمان جدید",
    org_noAddr: "آدرسی ثبت نشده است",
    org_selectLogo: "انتخاب لوگو",
    
    // Currency Settings Translations (NEW)
    curr_title: "تنظیمات ارزها",
    curr_subtitle: "مدیریت ارزهای سیستم و نرخ‌های تبدیل",
    curr_global: "تنظیمات کلان سیستم",
    curr_base: "ارز اصلی سیستم (Base)",
    curr_op: "ارز عملیاتی (Operational)",
    curr_rep1: "ارز گزارشگری ۱",
    curr_rep2: "ارز گزارشگری ۲",
    curr_history: "تاریخچه نرخ‌ها",
    curr_update: "بروزرسانی نرخ‌ها",
    curr_code: "کد ارز",
    curr_desc: "عنوان ارز",
    curr_symbol: "علامت",
    curr_method: "نحوه دریافت نرخ",
    curr_method_auto: "اتوماتیک",
    curr_method_manual: "دستی",
    curr_decimals: "تعداد اعشار",
    curr_active: "فعال",
    curr_reciprocal: "تبدیل دو طرفه",
    curr_reciprocal_desc: "محاسبه نرخ معکوس",
    curr_status: "وضعیت",
    curr_manage_rates: "مدیریت تبدیل‌ها",
    curr_defined_rates: "نرخ‌های تعریف شده",
    curr_target: "ارز مقصد",
    curr_rate: "نرخ تبدیل (۱ واحد)",
    curr_no_rates: "هیچ نرخ تبدیلی تعریف نشده است.",
    curr_history_title: "تاریخچه بروزرسانی نرخ‌ها",
    curr_source: "ارز مبدا",
    curr_target_curr: "ارز مقصد",
    curr_date: "تاریخ",
    curr_time: "ساعت",
    curr_rate_val: "نرخ تبدیل",
    curr_edit: "ویرایش ارز",
    curr_new: "تعریف ارز جدید",
    curr_save_global_success: "تنظیمات کلان سیستم با موفقیت ذخیره شد.",
    curr_update_success: "نرخ‌های جدید بروزرسانی شد.",

    // Common
    btn_save: "ذخیره",
    btn_cancel: "انصراف",
    btn_search: "اعمال فیلتر",
    btn_clear: "پاک کردن",
    btn_add: "افزودن",
    btn_close: "بستن",
    confirm_delete: "آیا از حذف {0} رکورد اطمینان دارید؟",
    confirm_delete_single: "آیا از حذف این رکورد اطمینان دارید؟",
    
    // ... (Other translations remain the same)
    acc_mgmt_title: "مدیریت اسناد حسابداری",
    acc_mgmt_subtitle: "لیست کلیه اسناد مالی با قابلیت جستجو و عملیات گروهی",
    grid_title: "لیست اسناد",
    col_docNo: "شماره سند",
    col_date: "تاریخ",
    col_dept: "دپارتمان",
    col_desc: "شرح سند",
    col_debtor: "بدهکار (ریال)",
    col_status: "وضعیت",
    col_active: "فعال",
    col_actions: "عملیات",
    status_final: "نهایی",
    status_draft: "پیش‌نویس",
    status_reviewed: "بررسی شده",
    filter_fromDoc: "از شماره سند",
    filter_toDoc: "تا شماره سند",
    filter_fromDate: "از تاریخ",
    filter_toDate: "تا تاریخ",
    filter_status: "وضعیت سند",
    filter_costCenter: "مرکز هزینه",
    filter_subsidiary: "معین",
    filter_allStatus: "همه وضعیت‌ها",
    modal_newDoc: "سند جدید",
    modal_editDoc: "ویرایش سند",
    modal_warning: "لطفاً دقت کنید: تغییرات در اسناد نهایی نیازمند تایید مدیر مالی می‌باشد.",
    field_docType: "نوع سند",
    field_general: "عمومی",
    field_opening: "افتتاحیه",
    field_party: "طرف حساب",
    field_selectParty: "انتخاب شخص...",
    field_amount: "مبلغ سند",
    field_isActive: "سند فعال باشد",
    
    usersListTitle: 'مدیریت کاربران',
    usersListSubtitle: 'مدیریت دسترسی‌ها و پروفایل‌های کاربری سیستم',
    createNewUser: 'کاربر جدید',
    searchUserPlaceholder: 'جستجو بر اساس نام کاربری...',
    filter: 'فیلتر',
    colId: 'شناسه',
    colUsername: 'نام کاربری',
    colLinkedPerson: 'شخص مرتبط',
    colUserType: 'نوع کاربر',
    colStatus: 'وضعیت',
    colActions: 'عملیات',
    active: 'فعال',
    inactive: 'غیرفعال',
    roleAdmin: 'مدیر سیستم',
    roleUser: 'کاربر سیستم',
    editUserTitle: 'ویرایش اطلاعات کاربر',
    newUserTitle: 'تعریف کاربر جدید',
    newUserSubtitle: 'برای ایجاد حساب کاربری جدید، فرم زیر را تکمیل کنید',
    editingId: 'در حال ویرایش شناسه',
    fieldId: 'شناسه کاربری',
    fieldUsername: 'نام کاربری',
    fieldStatus: 'وضعیت حساب',
    fieldUserType: 'نوع کاربر',
    fieldLinkedPerson: 'شخص مرتبط (طرف حساب)',
    selectPersonPlaceholder: '- انتخاب شخص -',
    linkedPersonHelp: 'این حساب کاربری به یکی از اشخاص تعریف شده در سیستم متصل می‌شود.',
    fieldPassword: 'مدیریت رمز عبور',
    enterPassword: 'رمز عبور جدید را وارد کنید...',
    resetDefault: 'بازنشانی به پیش‌فرض',
    passwordResetMsg: 'رمز عبور کاربر به "DefaultPassword123!" تغییر یافت.',
    cancel: 'انصراف',
    saveChanges: 'ذخیره و بستن',
    confirmDelete: 'آیا از حذف این کاربر اطمینان دارید؟',
    recordsFound: 'رکورد یافت شد',
    edit: 'ویرایش',
    delete: 'حذف',
    viewPermissions: 'مشاهده دسترسی‌ها',
    permModalTitle: 'مدیریت دسترسی‌ها و مجوزها',
    permColSource: 'منبع دسترسی',
    permColForms: 'فرم‌های در دسترس',
    permColOps: 'عملیات مجاز',
    permTypeRole: 'نقش',
    permTypeUser: 'کاربر',
    permSelectSource: 'یک منبع دسترسی انتخاب کنید',
    permSelectForm: 'یک فرم را انتخاب کنید',
    ws_title: "میز کار کاربر",
    ws_subtitle: "سیستم مدیریت حسابداری و صرافی",
    kpi_cash: "موجودی نقد و بانک",
    kpi_receivable: "مطالبات (بدهکاران)",
    kpi_payable: "بدهی‌ها (بستانکاران)",
    kpi_profit: "سود خالص ماهانه",
    btn_invoice: "+ خرید و فروش ارز",
    btn_check: "ثبت چک دریافتی",
    btn_payment_req: "درخواست پرداخت",
    btn_expense: "ثبت هزینه",
    btn_account: "تعریف طرف حساب",
    table_title: "آخرین تراکنش‌ها",
    th_id: "شناسه",
    th_date: "تاریخ",
    th_desc: "شرح",
    th_amount: "مبلغ",
    th_status: "وضعیت",
    row1_desc: "خرید دلار - ۵۰۰۰ واحد",
    row2_desc: "اجاره دفتر - ژانویه ۲۰۲۶",
    row3_desc: "فروش یورو - ۲۲۰۰ واحد",
    status_paid: "تسویه شده",
    status_pending: "در انتظار",
    sidebar_title: "هشدارهای حساس",
    alert1_title: "سررسید چک",
    alert1_sub: "بانک ملت - موعد فردا",
    alert2_title: "فاکتور معوقه",
    alert2_sub: "مشتری الف - ۱۰ روز تاخیر",
    alert3_title: "هشدار حد اعتبار",
    alert3_sub: "همکار صراف ب - نزدیک سقف",
    mod_exp_title: "ثبت هزینه جدید",
    mod_acc_title: "تعریف طرف حساب جدید",
    lbl_category: "دسته بندی",
    lbl_amount: "مبلغ",
    opt_rent: "اجاره",
    opt_salary: "حقوق",
    btn_save_data: "ذخیره اطلاعات",
    ph_name: "نام طرف حساب",
    ph_phone: "شماره تماس"
  }
};
