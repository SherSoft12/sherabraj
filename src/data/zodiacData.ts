export type ZodiacId =
  | 'aries'
  | 'taurus'
  | 'gemini'
  | 'cancer'
  | 'leo'
  | 'virgo'
  | 'libra'
  | 'scorpio'
  | 'sagittarius'
  | 'capricorn'
  | 'aquarius'
  | 'pisces';

export type ElementType = 'ناري' | 'ترابي' | 'هوائي' | 'مائي';
export type ModalityType = 'منقلب' | 'ثابت' | 'متغير';

export interface ZodiacSign {
  id: ZodiacId;
  index: number; // 0..11 starting at Aries (0°..30°)
  arabicName: string;
  classicalName: string;
  latinName: string;
  dateRangeAr: string;
  startMonth: number;
  startDay: number;
  endMonth: number;
  endDay: number;
  element: ElementType;
  modality: ModalityType;
  rulingPlanet: string;
  stone: string;
  keyword: string;
  summary: string;
  strengths: string[];
  challenges: string[];
  bestMatches: ZodiacId[];
}

export const ZODIAC_SIGNS: ZodiacSign[] = [
  {
    id: 'aries',
    index: 0,
    arabicName: 'الحمل',
    classicalName: 'الحَمَل',
    latinName: 'Aries',
    dateRangeAr: '٢١ مارس – ١٩ أبريل',
    startMonth: 3,
    startDay: 21,
    endMonth: 4,
    endDay: 19,
    element: 'ناري',
    modality: 'منقلب',
    rulingPlanet: 'المريخ',
    stone: 'العقيق الأحمر',
    keyword: 'المبادرة والشجاعة',
    summary: 'شخصية رائدة تفتح المسارات الجديدة بطاقة متقدة ووضوح مباشر لا يخشى التحديات.',
    strengths: ['الجرأة في القرار', 'الصدق المباشر', 'الحماس الملهم', 'سرعة البديهة'],
    challenges: ['التسرع أحياناً', 'نفاد الصبر', 'الاندفاع العاطفي'],
    bestMatches: ['leo', 'sagittarius', 'gemini', 'aquarius'],
  },
  {
    id: 'taurus',
    index: 1,
    arabicName: 'الثور',
    classicalName: 'الثَّور',
    latinName: 'Taurus',
    dateRangeAr: '٢٠ أبريل – ٢٠ مايو',
    startMonth: 4,
    startDay: 20,
    endMonth: 5,
    endDay: 20,
    element: 'ترابي',
    modality: 'ثابت',
    rulingPlanet: 'الزهرة',
    stone: 'الزمرد',
    keyword: 'الثبات والجمال',
    summary: 'روح هادئة تبني الإنجازات خطوة بخطوة وتقدّر الجودة والاستقرار والوفاء العميق.',
    strengths: ['الموثوقية العالية', 'الذوق الرفيع', 'الصبر والمثابرة', 'الهدوء عند الأزمات'],
    challenges: ['العناد الفكري', 'التمسك بالروتين', 'تأجيل التغيير'],
    bestMatches: ['virgo', 'capricorn', 'cancer', 'pisces'],
  },
  {
    id: 'gemini',
    index: 2,
    arabicName: 'الجوزاء',
    classicalName: 'الجَوزاء',
    latinName: 'Gemini',
    dateRangeAr: '٢١ مايو – ٢٠ يونيو',
    startMonth: 5,
    startDay: 21,
    endMonth: 6,
    endDay: 20,
    element: 'هوائي',
    modality: 'متغير',
    rulingPlanet: 'عطارد',
    stone: 'السترين',
    keyword: 'الفكر والتواصل',
    summary: 'عقل متجدد يربط الأفكار بسرعة لافتة ويزدهر في الحوارات الذكية والتنوع المعرفي.',
    strengths: ['المرونة الذهنية', 'البلاغة والإقناع', 'الفضول المعرفي', 'اللباقة الاجتماعية'],
    challenges: ['تشتت التركيز', 'تقلب المزاج', 'الميل للتفكير المفرط'],
    bestMatches: ['libra', 'aquarius', 'aries', 'leo'],
  },
  {
    id: 'cancer',
    index: 3,
    arabicName: 'السرطان',
    classicalName: 'السَّرَطان',
    latinName: 'Cancer',
    dateRangeAr: '٢١ يونيو – ٢٢ يوليو',
    startMonth: 6,
    startDay: 21,
    endMonth: 7,
    endDay: 22,
    element: 'مائي',
    modality: 'منقلب',
    rulingPlanet: 'القمر',
    stone: 'حجر القمر',
    keyword: 'الحدس والاحتواء',
    summary: 'حساسية عميقة وذاكرة وجدانية حية، يجمع بين الرعاية الصادقة والصلابة الداخلية.',
    strengths: ['الحدس الصادق', 'الوفاء للأسرة', 'الذكاء العاطفي', 'القدرة على الحماية'],
    challenges: ['الحساسية المفرطة', 'الكتمان', 'التعلق بالماضي'],
    bestMatches: ['scorpio', 'pisces', 'taurus', 'virgo'],
  },
  {
    id: 'leo',
    index: 4,
    arabicName: 'الأسد',
    classicalName: 'الأَسَد',
    latinName: 'Leo',
    dateRangeAr: '٢٣ يوليو – ٢٢ أغسطس',
    startMonth: 7,
    startDay: 23,
    endMonth: 8,
    endDay: 22,
    element: 'ناري',
    modality: 'ثابت',
    rulingPlanet: 'الشمس',
    stone: 'الياقوت',
    keyword: 'الحضور والإبداع',
    summary: 'قلب كريم وحضور دافئ يشع ثقة وإبداعاً، ويلهم من حوله بروح القيادة النبيلة.',
    strengths: ['الكرم والنبل', 'الثقة بالنفس', 'الجاذبية الإبداعية', 'الولاء المطلق'],
    challenges: ['الاعتداد المفرط', 'حساسية النقد', 'الرغبة في السيطرة'],
    bestMatches: ['aries', 'sagittarius', 'libra', 'gemini'],
  },
  {
    id: 'virgo',
    index: 5,
    arabicName: 'العذراء',
    classicalName: 'العَذراء',
    latinName: 'Virgo',
    dateRangeAr: '٢٣ أغسطس – ٢٢ سبتمبر',
    startMonth: 8,
    startDay: 23,
    endMonth: 9,
    endDay: 22,
    element: 'ترابي',
    modality: 'متغير',
    rulingPlanet: 'عطارد',
    stone: 'اليشب الأخضر',
    keyword: 'الدقة والاتزان',
    summary: 'بصيرة تحليلية ترى التفاصيل الخفية وتصنع النظام والكمال العملي بهدوء وتفانٍ.',
    strengths: ['التنظيم المتقن', 'التحليل العميق', 'الإخلاص في العمل', 'التواضع العملي'],
    challenges: ['القلق من التفاصيل', 'النقد الذاتي', 'صعوبة الاسترخاء'],
    bestMatches: ['taurus', 'capricorn', 'cancer', 'scorpio'],
  },
  {
    id: 'libra',
    index: 6,
    arabicName: 'الميزان',
    classicalName: 'المِيزان',
    latinName: 'Libra',
    dateRangeAr: '٢٣ سبتمبر – ٢٢ أكتوبر',
    startMonth: 9,
    startDay: 23,
    endMonth: 10,
    endDay: 22,
    element: 'هوائي',
    modality: 'منقلب',
    rulingPlanet: 'الزهرة',
    stone: 'الأوبال',
    keyword: 'الانسجام والعدالة',
    summary: 'باحث عن التوازن والجمال في العلاقات والأفكار، يجيد الدبلوماسية ورؤية كل الزوايا.',
    strengths: ['الإنصاف واللباقة', 'الذوق الفني', 'التفكير المتزن', 'روح الشراكة'],
    challenges: ['التردد عند الحسم', 'تجنب المواجهة', 'السعي لإرضاء الجميع'],
    bestMatches: ['gemini', 'aquarius', 'leo', 'sagittarius'],
  },
  {
    id: 'scorpio',
    index: 7,
    arabicName: 'العقرب',
    classicalName: 'العَقرَب',
    latinName: 'Scorpio',
    dateRangeAr: '٢٣ أكتوبر – ٢١ نوفمبر',
    startMonth: 10,
    startDay: 23,
    endMonth: 11,
    endDay: 21,
    element: 'مائي',
    modality: 'ثابت',
    rulingPlanet: 'المريخ وبلوتو',
    stone: 'الأوبسيديان',
    keyword: 'العمق والتحول',
    summary: 'إرادة نافذة وبصيرة تقرأ ما وراء الكلمات، يتجدد دائماً بقوة داخلية لا تُقهر.',
    strengths: ['التركيز الحاد', 'العمق العاطفي', 'القدرة على التجدد', 'حفظ الأسرار'],
    challenges: ['الغيرة والشك', 'الكتمان الشديد', 'صعوبة التسامح السريع'],
    bestMatches: ['cancer', 'pisces', 'virgo', 'capricorn'],
  },
  {
    id: 'sagittarius',
    index: 8,
    arabicName: 'القوس',
    classicalName: 'القَوس',
    latinName: 'Sagittarius',
    dateRangeAr: '٢٢ نوفمبر – ٢١ ديسمبر',
    startMonth: 11,
    startDay: 22,
    endMonth: 12,
    endDay: 21,
    element: 'ناري',
    modality: 'متغير',
    rulingPlanet: 'المشتري',
    stone: 'الفيروز',
    keyword: 'الأفق والحكمة',
    summary: 'روح متطلعة للحرية والمعرفة والسفر، تمنح المحيطين بها تفاؤلاً ورؤية واسعة.',
    strengths: ['التفاؤل الفطري', 'سعة الأفق', 'الصدق التلقائي', 'حب الاكتشاف'],
    challenges: ['الصراحة الحادة', 'الملل من القيود', 'المبالغة في الوعود'],
    bestMatches: ['aries', 'leo', 'aquarius', 'libra'],
  },
  {
    id: 'capricorn',
    index: 9,
    arabicName: 'الجدي',
    classicalName: 'الجَدي',
    latinName: 'Capricorn',
    dateRangeAr: '٢٢ ديسمبر – ١٩ يناير',
    startMonth: 12,
    startDay: 22,
    endMonth: 1,
    endDay: 19,
    element: 'ترابي',
    modality: 'منقلب',
    rulingPlanet: 'زحل',
    stone: 'الأونيكس',
    keyword: 'الطموح والإنجاز',
    summary: 'بصيرة استراتيجية وإصرار هادئ يرقى القمم بالانضباط والمسؤولية طويلة الأمد.',
    strengths: ['الانضباط الذاتي', 'الحكمة العملية', 'تحمل المسؤولية', 'الوفاء الهادئ'],
    challenges: ['الجدية الزائدة', 'التحفظ العاطفي', 'إرهاق النفس بالعمل'],
    bestMatches: ['taurus', 'virgo', 'scorpio', 'pisces'],
  },
  {
    id: 'aquarius',
    index: 10,
    arabicName: 'الدلو',
    classicalName: 'الدَّلو',
    latinName: 'Aquarius',
    dateRangeAr: '٢٠ يناير – ١٨ فبراير',
    startMonth: 1,
    startDay: 20,
    endMonth: 2,
    endDay: 18,
    element: 'هوائي',
    modality: 'ثابت',
    rulingPlanet: 'زحل وأورانوس',
    stone: 'الأميثيست',
    keyword: 'الابتكار والاستقلال',
    summary: 'فكر مستقبلي مستقل ينظر أبعد من المألوف، يجمع بين النزعة الإنسانية والأصالة.',
    strengths: ['الأصالة الفكرية', 'الاستقلالية', 'النظرة الإنسانية', 'الابتكار'],
    challenges: ['التباعد العاطفي', 'العناد المبدئي', 'تقلب الإيقاع'],
    bestMatches: ['gemini', 'libra', 'sagittarius', 'aries'],
  },
  {
    id: 'pisces',
    index: 11,
    arabicName: 'الحوت',
    classicalName: 'الحُوت',
    latinName: 'Pisces',
    dateRangeAr: '١٩ فبراير – ٢٠ مارس',
    startMonth: 2,
    startDay: 19,
    endMonth: 3,
    endDay: 20,
    element: 'مائي',
    modality: 'متغير',
    rulingPlanet: 'المشتري ونبتون',
    stone: 'الأكوامارين',
    keyword: 'الخيال والرحمة',
    summary: 'وجدان شاعري وخيال خصب يتناغم مع الإشارات اللطيفة ويجلب السكينة والإلهام.',
    strengths: ['التعاطف العميق', 'الحس الفني', 'الحدس الروحاني', 'المرونة'],
    challenges: ['الهروب من الواقع', 'التأثر بطاقة الآخرين', 'تشتت الحدود'],
    bestMatches: ['cancer', 'scorpio', 'taurus', 'capricorn'],
  },
];

export interface BirthCity {
  id: string;
  nameAr: string;
  countryAr: string;
  lat: number;
  lng: number;
  tzOffset: number;
}

export const BIRTH_CITIES: BirthCity[] = [
  { id: 'riyadh', nameAr: 'الرياض', countryAr: 'السعودية', lat: 24.7136, lng: 46.6753, tzOffset: 3 },
  { id: 'jeddah', nameAr: 'جدة', countryAr: 'السعودية', lat: 21.4858, lng: 39.1925, tzOffset: 3 },
  { id: 'cairo', nameAr: 'القاهرة', countryAr: 'مصر', lat: 30.0444, lng: 31.2357, tzOffset: 2 },
  { id: 'alexandria', nameAr: 'الإسكندرية', countryAr: 'مصر', lat: 31.2001, lng: 29.9187, tzOffset: 2 },
  { id: 'dubai', nameAr: 'دبي', countryAr: 'الإمارات', lat: 25.2048, lng: 55.2708, tzOffset: 4 },
  { id: 'abudhabi', nameAr: 'أبوظبي', countryAr: 'الإمارات', lat: 24.4539, lng: 54.3773, tzOffset: 4 },
  { id: 'amman', nameAr: 'عمّان', countryAr: 'الأردن', lat: 31.9454, lng: 35.9284, tzOffset: 3 },
  { id: 'beirut', nameAr: 'بيروت', countryAr: 'لبنان', lat: 33.8938, lng: 35.5018, tzOffset: 2 },
  { id: 'doha', nameAr: 'الدوحة', countryAr: 'قطر', lat: 25.2854, lng: 51.531, tzOffset: 3 },
  { id: 'kuwait', nameAr: 'الكويت', countryAr: 'الكويت', lat: 29.3759, lng: 47.9774, tzOffset: 3 },
  { id: 'muscat', nameAr: 'مسقط', countryAr: 'عُمان', lat: 23.588, lng: 58.3829, tzOffset: 4 },
  { id: 'manama', nameAr: 'المنامة', countryAr: 'البحرين', lat: 26.2285, lng: 50.586, tzOffset: 3 },
  { id: 'baghdad', nameAr: 'بغداد', countryAr: 'العراق', lat: 33.3152, lng: 44.3661, tzOffset: 3 },
  { id: 'damascus', nameAr: 'دمشق', countryAr: 'سوريا', lat: 33.5138, lng: 36.2765, tzOffset: 3 },
  { id: 'rabat', nameAr: 'الرباط', countryAr: 'المغرب', lat: 34.0209, lng: -6.8416, tzOffset: 1 },
  { id: 'casablanca', nameAr: 'الدار البيضاء', countryAr: 'المغرب', lat: 33.5731, lng: -7.5898, tzOffset: 1 },
  { id: 'tunis', nameAr: 'تونس', countryAr: 'تونس', lat: 36.8065, lng: 10.1815, tzOffset: 1 },
  { id: 'algiers', nameAr: 'الجزائر', countryAr: 'الجزائر', lat: 36.7538, lng: 3.0588, tzOffset: 1 },
  { id: 'istanbul', nameAr: 'إسطنبول', countryAr: 'تركيا', lat: 41.0082, lng: 28.9784, tzOffset: 3 },
  { id: 'london', nameAr: 'لندن', countryAr: 'المملكة المتحدة', lat: 51.5072, lng: -0.1276, tzOffset: 0 },
  { id: 'paris', nameAr: 'باريس', countryAr: 'فرنسا', lat: 48.8566, lng: 2.3522, tzOffset: 1 },
  { id: 'newyork', nameAr: 'نيويورك', countryAr: 'الولايات المتحدة', lat: 40.7128, lng: -74.006, tzOffset: -5 },
];

export function getZodiacById(id: ZodiacId): ZodiacSign {
  return ZODIAC_SIGNS.find((s) => s.id === id) ?? ZODIAC_SIGNS[0];
}
