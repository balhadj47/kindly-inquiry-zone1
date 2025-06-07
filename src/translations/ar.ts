import { TranslationKeys } from '@/types/language';

export const ar: TranslationKeys = {
  // Navigation
  dashboard: 'لوحة التحكم',
  companies: 'الشركات',
  vansDrivers: 'الشاحنات والسائقين',
  users: 'المستخدمين',
  logTrip: 'تسجيل الرحلة',
  tripHistory: 'تاريخ الرحلات',
  settings: 'الإعدادات',
  
  // Common
  search: 'بحث',
  add: 'إضافة',
  edit: 'تعديل',
  save: 'حفظ',
  cancel: 'إلغاء',
  delete: 'حذف',
  loading: 'جارٍ التحميل',
  error: 'خطأ',
  success: 'نجح',
  
  // Dashboard
  totalTrips: 'إجمالي الرحلات',
  activeVans: 'الشاحنات النشطة',
  totalBranches: 'إجمالي الفروع',
  recentActivity: 'النشاط الأخير',
  
  // Companies
  addNewCompany: 'إضافة شركة جديدة',
  searchCompanies: 'البحث عن الشركات...',
  branches: 'الفروع',
  lastActivity: 'آخر نشاط',
  
  // Trip Logger
  tripLogger: 'مسجل الرحلات',
  recordVanVisits: 'تسجيل زيارات الشاحنات لفروع الشركات',
  currentTime: 'الوقت الحالي',
  logNewTrip: 'رحلة جديدة',
  selectVan: 'اختر الشاحنة',
  chooseVan: 'اختر شاحنة',
  selectCompany: 'اختر الشركة',
  chooseCompany: 'اختر شركة',
  selectBranch: 'اختر الفرع',
  chooseBranch: 'اختر فرعاً',
  selectCompanyFirst: 'اختر الشركة أولاً',
  notes: 'ملاحظات (اختياري)',
  notesPlaceholder: 'أي ملاحظات إضافية حول هذه الرحلة...',
  logTripVisit: 'تسجيل زيارة الرحلة',
  tripsToday: 'رحلات اليوم',
  
  // Trip History
  filterByCompany: 'تصفية حسب الشركة',
  filterByVan: 'تصفية حسب الشاحنة',
  allCompanies: 'جميع الشركات',
  allVans: 'جميع الشاحنات',
  noTripsFound: 'لم يتم العثور على رحلات',
  timeAgo: {
    minsAgo: 'دقيقة مضت',
    hoursAgo: 'ساعة مضت',
    daysAgo: 'يوم مضى',
  },
};
