import { ZODIAC_SIGNS, ZodiacId, ZodiacSign, getZodiacById } from '../data/zodiacData';

export type PlanetKey =
  | 'sun'
  | 'moon'
  | 'mercury'
  | 'venus'
  | 'mars'
  | 'jupiter'
  | 'saturn';

export interface PlanetPosition {
  key: PlanetKey;
  arabicName: string;
  longitude: number; // 0..360 ecliptic degrees
  sign: ZodiacSign;
  degreeInSign: number; // 0..29
  minuteInSign: number; // 0..59
  isRetrograde: boolean;
  formattedDegree: string;
}

export interface MoonPhaseInfo {
  ageDays: number;
  illumination: number; // 0..100
  phaseFraction: number; // 0..1
  arabicPhaseName: string;
  lunarSign: ZodiacSign;
  guidance: string;
}

export interface DailyHoroscopeReading {
  signId: ZodiacId;
  dateKey: string;
  arabicDateLabel: string;
  overview: string;
  love: string;
  career: string;
  wellness: string;
  luckyNumber: number;
  luckyColor: string;
  peakHour: string;
  bestMatchToday: ZodiacSign;
  scores: {
    love: number;
    career: number;
    energy: number;
    luck: number;
  };
  dominantPlanet: PlanetPosition;
}

export interface NatalChartResult {
  sunSign: ZodiacSign;
  moonSign: ZodiacSign;
  ascendantSign: ZodiacSign;
  ascendantDegree: number;
  ascendantFormatted: string;
  planets: PlanetPosition[];
  elementBalance: Record<'ناري' | 'ترابي' | 'هوائي' | 'مائي', number>;
  dominantElement: 'ناري' | 'ترابي' | 'هوائي' | 'مائي';
  summaryAr: string;
}

export interface CompatibilityReport {
  signA: ZodiacSign;
  signB: ZodiacSign;
  aspectNameAr: string;
  aspectDegrees: number;
  overallScore: number;
  emotionalScore: number;
  intellectualScore: number;
  stabilityScore: number;
  headlineAr: string;
  analysisAr: string;
  strengthsAr: string[];
  challengesAr: string[];
  adviceAr: string;
}

const DEG2RAD = Math.PI / 180;
const RAD2DEG = 180 / Math.PI;

function normalizeDeg(deg: number): number {
  const mod = deg % 360;
  return mod < 0 ? mod + 360 : mod;
}

export function getJulianDay(date: Date): number {
  return date.getTime() / 86400000 + 2440587.5;
}

export function getSignFromLongitude(lon: number): {
  sign: ZodiacSign;
  degreeInSign: number;
  minuteInSign: number;
} {
  const norm = normalizeDeg(lon);
  const idx = Math.floor(norm / 30) % 12;
  const rem = norm - idx * 30;
  const degreeInSign = Math.floor(rem);
  const minuteInSign = Math.floor((rem - degreeInSign) * 60);
  return {
    sign: ZODIAC_SIGNS[idx],
    degreeInSign,
    minuteInSign,
  };
}

export function getSignFromBirthDate(month: number, day: number): ZodiacSign {
  for (const sign of ZODIAC_SIGNS) {
    if (sign.startMonth <= sign.endMonth) {
      if (
        (month === sign.startMonth && day >= sign.startDay) ||
        (month === sign.endMonth && day <= sign.endDay)
      ) {
        return sign;
      }
    } else {
      // Capricorn spans Dec -> Jan
      if (
        (month === sign.startMonth && day >= sign.startDay) ||
        (month === sign.endMonth && day <= sign.endDay)
      ) {
        return sign;
      }
    }
  }
  return ZODIAC_SIGNS[0];
}

// Low-precision astronomical ephemeris (accurate within ~1° for Sun/Moon/major planets)
function computeRawLongitudes(jd: number): Record<PlanetKey, number> {
  const d = jd - 2451545.0; // Days since J2000.0

  // Sun geocentric ecliptic longitude
  const M_sun = normalizeDeg(357.5291 + 0.98560028 * d);
  const L_sun = normalizeDeg(280.4665 + 0.98564736 * d);
  const sunLon = normalizeDeg(
    L_sun + 1.9148 * Math.sin(M_sun * DEG2RAD) + 0.02 * Math.sin(2 * M_sun * DEG2RAD)
  );

  // Moon geocentric ecliptic longitude
  const L_moon = normalizeDeg(218.316 + 13.176396 * d);
  const M_moon = normalizeDeg(134.963 + 13.064993 * d);
  const F_moon = normalizeDeg(93.272 + 13.22935 * d);
  const D_moon = normalizeDeg(L_moon - L_sun);
  const moonLon = normalizeDeg(
    L_moon +
      6.289 * Math.sin(M_moon * DEG2RAD) +
      1.274 * Math.sin((2 * D_moon - M_moon) * DEG2RAD) +
      0.658 * Math.sin(2 * D_moon * DEG2RAD) -
      0.186 * Math.sin(M_sun * DEG2RAD) -
      0.114 * Math.sin(2 * F_moon * DEG2RAD)
  );

  // Heliocentric -> Geocentric approximate conversion for planets
  const earthR = 1.00014 - 0.01671 * Math.cos(M_sun * DEG2RAD);
  const earthLon = normalizeDeg(sunLon + 180);

  const geocentric = (
    a: number,
    e: number,
    L0: number,
    n: number,
    wBar: number
  ): number => {
    const L = normalizeDeg(L0 + n * d);
    const M = normalizeDeg(L - wBar);
    const v =
      M +
      (2 * e * RAD2DEG) * Math.sin(M * DEG2RAD) +
      (1.25 * e * e * RAD2DEG) * Math.sin(2 * M * DEG2RAD);
    const r = (a * (1 - e * e)) / (1 + e * Math.cos((v - M + M) * DEG2RAD));
    const helioLon = normalizeDeg(v + wBar);

    const x = r * Math.cos(helioLon * DEG2RAD) - earthR * Math.cos(earthLon * DEG2RAD);
    const y = r * Math.sin(helioLon * DEG2RAD) - earthR * Math.sin(earthLon * DEG2RAD);
    return normalizeDeg(Math.atan2(y, x) * RAD2DEG);
  };

  const mercuryLon = geocentric(0.387098, 0.20563, 252.2509, 4.09233445, 77.4565);
  const venusLon = geocentric(0.723332, 0.006772, 181.9798, 1.60213034, 131.5637);
  const marsLon = geocentric(1.523679, 0.0934, 355.433, 0.52402068, 336.0602);
  const jupiterLon = geocentric(5.2026, 0.048498, 34.3515, 0.08308529, 14.3312);
  const saturnLon = geocentric(9.5549, 0.055546, 50.0774, 0.03344414, 93.0572);

  return {
    sun: sunLon,
    moon: moonLon,
    mercury: mercuryLon,
    venus: venusLon,
    mars: marsLon,
    jupiter: jupiterLon,
    saturn: saturnLon,
  };
}

const PLANET_NAMES_AR: Record<PlanetKey, string> = {
  sun: 'الشمس',
  moon: 'القمر',
  mercury: 'عطارد',
  venus: 'الزهرة',
  mars: 'المريخ',
  jupiter: 'المشتري',
  saturn: 'زحل',
};

export function calculatePlanetaryPositions(date: Date): PlanetPosition[] {
  const jd = getJulianDay(date);
  const jdPrev = jd - 1;
  const current = computeRawLongitudes(jd);
  const prev = computeRawLongitudes(jdPrev);

  const keys: PlanetKey[] = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn'];
  return keys.map((key) => {
    const lon = current[key];
    let delta = lon - prev[key];
    if (delta < -180) delta += 360;
    if (delta > 180) delta -= 360;
    const isRetrograde = key !== 'sun' && key !== 'moon' && delta < 0;
    const { sign, degreeInSign, minuteInSign } = getSignFromLongitude(lon);
    return {
      key,
      arabicName: PLANET_NAMES_AR[key],
      longitude: lon,
      sign,
      degreeInSign,
      minuteInSign,
      isRetrograde,
      formattedDegree: `${degreeInSign}° ${minuteInSign.toString().padStart(2, '0')}'`,
    };
  });
}

export function calculateMoonPhase(date: Date): MoonPhaseInfo {
  const jd = getJulianDay(date);
  const positions = computeRawLongitudes(jd);
  const elongation = normalizeDeg(positions.moon - positions.sun);
  const phaseFraction = elongation / 360;
  const ageDays = phaseFraction * 29.530588;
  const illumination = Math.round(((1 - Math.cos(elongation * DEG2RAD)) / 2) * 100);
  const { sign: lunarSign } = getSignFromLongitude(positions.moon);

  let arabicPhaseName = 'محاق';
  let guidance = 'وقت مناسب للتأمل الهادئ وترتيب النوايا الداخلية بعيداً عن الضجيج.';
  if (ageDays < 1.8) {
    arabicPhaseName = 'محاق جديد';
    guidance = 'صفحة قمرية بيضاء؛ ازرع بذرة فكرة جديدة وحدد أولوياتك بهدوء.';
  } else if (ageDays < 6.4) {
    arabicPhaseName = 'هلال متزايد';
    guidance = 'طاقة نمو متصاعدة تدعم الخطوات الأولى وتجربة الأفكار الواعدة.';
  } else if (ageDays < 8.4) {
    arabicPhaseName = 'تربيع أول';
    guidance = 'مرحلة حسم عملي ومراجعة المسار لتجاوز أي تردد في قراراتك.';
  } else if (ageDays < 13.8) {
    arabicPhaseName = 'أحدب متزايد';
    guidance = 'زخم متنامٍ يساعدك على تطوير التفاصيل وصقل مشاريعك قبل ذروتها.';
  } else if (ageDays < 16.0) {
    arabicPhaseName = 'بدر مكتمل';
    guidance = 'ذروة الوضوح والإشراق؛ تتجلى الحقائق والمشاعر بصفاء فائق.';
  } else if (ageDays < 21.2) {
    arabicPhaseName = 'أحدب متناقص';
    guidance = 'وقت لمشاركة الحكمة وتصفية الالتزامات الزائدة والتركيز على الجوهر.';
  } else if (ageDays < 23.4) {
    arabicPhaseName = 'تربيع ثانٍ';
    guidance = 'إعادة توازن هادئة ومراجعة ما يستحق الاستمرار وما آن أوان تركه.';
  } else {
    arabicPhaseName = 'هلال متناقص';
    guidance = 'مرحلة سكينة وامتنان وتطهير ذهني استعداداً لدورة قمرية جديدة.';
  }

  return {
    ageDays: Number(ageDays.toFixed(1)),
    illumination,
    phaseFraction,
    arabicPhaseName,
    lunarSign,
    guidance,
  };
}

export function calculateNatalChart(
  birthDateStr: string,
  birthTimeStr: string,
  lat: number,
  lng: number,
  tzOffset: number
): NatalChartResult {
  const [year, month, day] = birthDateStr.split('-').map(Number);
  const [hour, minute] = (birthTimeStr || '12:00').split(':').map(Number);

  // Convert local birth time to UTC Date
  const utcMs = Date.UTC(year, month - 1, day, hour - tzOffset, minute || 0, 0);
  const birthUtc = new Date(utcMs);

  const planets = calculatePlanetaryPositions(birthUtc);
  const sunSign = getSignFromBirthDate(month, day);
  const moonPlanet = planets.find((p) => p.key === 'moon')!;
  const moonSign = moonPlanet.sign;

  // Ascendant via Local Sidereal Time & obliquity of ecliptic
  const jd = getJulianDay(birthUtc);
  const T = (jd - 2451545.0) / 36525.0;
  const gmst = normalizeDeg(
    280.46061837 + 360.98564736629 * (jd - 2451545.0) + 0.000387933 * T * T
  );
  const lst = normalizeDeg(gmst + lng) * DEG2RAD;
  const eps = (23.439291 - 0.0130042 * T) * DEG2RAD;
  const latRad = lat * DEG2RAD;

  const y = -Math.cos(lst);
  const x = Math.sin(lst) * Math.cos(eps) + Math.tan(latRad) * Math.sin(eps);
  let ascLon = normalizeDeg(Math.atan2(y, x) * RAD2DEG);
  // Correct quadrant alignment relative to RAMC
  if (Math.cos(lst) < 0 && ascLon < 180) {
    // atan2 already handles signs, keep standard astronomical quadrant
  }
  const { sign: ascendantSign, degreeInSign, minuteInSign } = getSignFromLongitude(ascLon);

  const elementBalance: Record<'ناري' | 'ترابي' | 'هوائي' | 'مائي', number> = {
    ناري: 0,
    ترابي: 0,
    هوائي: 0,
    مائي: 0,
  };
  planets.forEach((p, idx) => {
    const weight = idx < 2 ? 2 : 1; // Sun & Moon carry double weight
    elementBalance[p.sign.element] += weight;
  });
  elementBalance[ascendantSign.element] += 2;

  const dominantElement = (Object.entries(elementBalance).sort((a, b) => b[1] - a[1])[0][0] ??
    sunSign.element) as 'ناري' | 'ترابي' | 'هوائي' | 'مائي';

  const summaryAr = `تجمع خريطتك الفلكية بين شمس ${sunSign.arabicName} (${sunSign.keyword}) وقمر ${moonSign.arabicName} في العمق العاطفي، مع طالع ${ascendantSign.arabicName} الذي يشكّل حضورك أمام العالم. يغلب على توزيعك الكوكبي العنصر الـ${dominantElement}، مما يمنحك إيقاعاً متفرداً في التفكير والتعبير.`;

  return {
    sunSign,
    moonSign,
    ascendantSign,
    ascendantDegree: ascLon,
    ascendantFormatted: `${degreeInSign}° ${minuteInSign.toString().padStart(2, '0')}'`,
    planets,
    elementBalance,
    dominantElement,
    summaryAr,
  };
}

// Deterministic seeded PRNG for consistent daily horoscopes per sign & date
function hashSeed(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

const LUCKY_COLORS = [
  'القرمزي الداكن',
  'الذهبي الشامبانيا',
  'العنبر المضيء',
  'الكحلي الليلي',
  'الياقوتي الدافئ',
  'الأوبسيديان الفضي',
  'النحاسي الهادئ',
  'الأبيض اللؤلؤي',
];

const PEAK_HOURS = [
  '٩:٠٠ صباحاً',
  '١١:٣٠ صباحاً',
  '٢:٠٠ ظهراً',
  '٤:٤٥ عصراً',
  '٧:١٥ مساءً',
  '٩:٣٠ مساءً',
];

export function generateDailyHoroscope(signId: ZodiacId, date: Date): DailyHoroscopeReading {
  const sign = getZodiacById(signId);
  const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
    date.getDate()
  ).padStart(2, '0')}`;
  const seed = hashSeed(`${signId}:${dateKey}`);

  const planets = calculatePlanetaryPositions(date);
  const moonPhase = calculateMoonPhase(date);
  const sunPos = planets[0];
  const moonPos = planets[1];
  const venusPos = planets[3];
  const marsPos = planets[4];

  const arabicDateLabel = new Intl.DateTimeFormat('ar-EG-u-nu-latn', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);

  const overviewThemes: Record<ZodiacSign['element'], string[]> = {
    ناري: [
      `تنسجم حركة ${moonPos.arabicName} في برج ${moonPos.sign.arabicName} مع طبيعتك النارية لتفتح أمامك نافذة للجرأة الهادئة. اليوم يكافئ الخطوات الواضحة التي تجمع بين الحماس والتخطيط، بعيداً عن ردود الفعل السريعة.`,
      `إشراقة ${sunPos.arabicName} في ${sunPos.sign.arabicName} تمنحك وضوحاً في ترتيب أولوياتك. استثمر ساعات الصباح في حسم ملف مؤجل، فالكواكب تدعم مبادراتك المدروسة وتمنح صوتك ثقلاً ملموساً.`,
      `بين تأثير ${marsPos.arabicName} في ${marsPos.sign.arabicName} وطور ${moonPhase.arabicPhaseName}، تجد طاقتك تتجه نحو الإنجاز الملموس. تأنَّ في التفاصيل الصغيرة وستحصد نتائج تتجاوز توقعاتك.`,
    ],
    ترابي: [
      `هدوء الفلك اليوم يتناغم مع بصيرتك العملية؛ عبور ${moonPos.arabicName} في ${moonPos.sign.arabicName} يمنحك قدرة لافتة على تحويل الأفكار المجردة إلى خطط قابلة للتنفيذ. ثباتك هو سر تفوقك الآن.`,
      `مع تمركز ${venusPos.arabicName} في ${venusPos.sign.arabicName}، يزداد تقديرك للتفاصيل الجمالية والراحة النفسية. لا تتردد في إعادة تنظيم جدولك بما يضمن توازناً أفضل بين الالتزام والهدوء.`,
      `يوم مستقر يدعم القرارات المالية والمهنية الرصينة. تمنحك زوايا الكواكب اليوم نظرة بعيدة المدى تكشف لك الفرص المستدامة من الوعود العابرة.`,
    ],
    هوائي: [
      `يتسارع إيقاع الأفكار والحوارات مع وجود ${moonPos.arabicName} في ${moonPos.sign.arabicName}. رسالة أو مكالمة عابرة قد تحمل لك زاوية نظر جديدة تماماً تعيد ترتيب خططك لهذا الأسبوع.`,
      `الوضوح الذهني في ذروته اليوم؛ استغل هذه المرونة في تقريب وجهات النظر وصياغة مشاريع مشتركة. تجنب تشتيت انتباهك في أكثر من مسار واحد في الوقت نفسه.`,
      `طور ${moonPhase.arabicPhaseName} يضيء جانب التواصل والإبداع في يومك. كتابة أفكارك وتبادلها مع أشخاص تثق برؤيتهم سيثمر عن حلول ذكية وغير تقليدية.`,
    ],
    مائي: [
      `حدسك اليوم يعمل كـبوصلة دقيقة بفضل موقع ${moonPos.arabicName} في ${moonPos.sign.arabicName}. ثق بما تلتقطه بين السطور في محادثاتك، فالإشارات الهادئة أصدق من الضجيج.`,
      `طاقة القمر في طور ${moonPhase.arabicPhaseName} تدعوك لاحترام إيقاعك الداخلي ومنح مشاعرك مساحة صادقة للتعبير. صفاء الروح يسبق دائماً وضوح القرار.`,
      `حركة ${venusPos.arabicName} اليوم تلطّف الأجواء وتفتح باب المصارحة الهادئة. يوم مثالي لإغلاق ملف عاطفي قديم أو تعزيز رابطة تمنحك الأمان.`,
    ],
  };

  const loveLines = [
    `في العلاقات، الحضور الصادق والاستماع العميق يصنعان فارقاً حقيقياً اليوم. مبادرة لطيفة أو كلمة تقدير غير متوقعة تعيد الدفء وتبدد أي سوء فهم عابر.`,
    `تُضفي الزهرة في ${venusPos.sign.arabicName} لمسة من الرقة والجاذبية الهادئة؛ إن كنت في علاقة فالحوار الصريح يقرب المسافات، وإن كنت أعزباً فقد يلفت انتباهك شخص يشاركك نفس القيم.`,
    `ابتعد عن التوقعات الصامتة وعبّر عمّا تريده ببساطة. الشراكات الناضجة اليوم تقوم على الوضوح والاحترام المتبادل للمساحة الشخصية.`,
  ];

  const careerLines = [
    `مهنياً، دقة التنظيم تمنحك أفضلية واضحة. راجع بنود اتفاق أو خطة عمل قبل اعتمادها النهائي، ولا تتردد في طلب الدعم عند الحاجة لتوفير الوقت.`,
    `فرصة لعرض فكرة مؤجلة أمام من يقدر قيمتها. تواصل بثقة وركز على الأرقام والنتائج الملموسة، وتجنب الدخول في جدال جانبي لا يخدم أهدافك.`,
    `الجانب المالي يميل للاستقرار إذا ابتعدت عن النفقات الاندفاعية. التفكير في استثمار طويل الأمد أو تنمية مهارة جديدة يعود عليك بنفع قريب.`,
  ];

  const wellnessLines = [
    `طاقتك البدنية تحتاج إلى فواصل قصيرة من التنفس العميق والابتعاد عن الشاشات قبل النوم؛ كوب دافئ ومشي هادئ في المساء يعيدان توازنك.`,
    `راقب جودة نومك وتجنب إرهاق ذهنك بتعدد المهام. الرياضة الخفيفة أو التأمل لعشر دقائق ترفع من صفاء تركيزك بقية اليوم.`,
    `جسمك يستجيب سريعاً للروتين المنظم اليوم؛ انتظم في شرب الماء ومنح عينيك راحة دورية بين ساعات العمل المتواصلة.`,
  ];

  const loveScore = 64 + (seed % 34);
  const careerScore = 62 + ((seed >> 3) % 35);
  const energyScore = 60 + ((seed >> 5) % 37);
  const luckScore = 65 + ((seed >> 7) % 33);

  const bestMatchId = sign.bestMatches[seed % sign.bestMatches.length];
  const dominantPlanet = planets[(seed + sign.index) % planets.length];

  return {
    signId,
    dateKey,
    arabicDateLabel,
    overview: overviewThemes[sign.element][seed % overviewThemes[sign.element].length],
    love: loveLines[(seed >> 2) % loveLines.length],
    career: careerLines[(seed >> 4) % careerLines.length],
    wellness: wellnessLines[(seed >> 6) % wellnessLines.length],
    luckyNumber: 3 + (seed % 27),
    luckyColor: LUCKY_COLORS[(seed >> 3) % LUCKY_COLORS.length],
    peakHour: PEAK_HOURS[(seed >> 5) % PEAK_HOURS.length],
    bestMatchToday: getZodiacById(bestMatchId),
    scores: {
      love: loveScore,
      career: careerScore,
      energy: energyScore,
      luck: luckScore,
    },
    dominantPlanet,
  };
}

export function calculateCompatibility(signAId: ZodiacId, signBId: ZodiacId): CompatibilityReport {
  const signA = getZodiacById(signAId);
  const signB = getZodiacById(signBId);

  const rawDiff = Math.abs(signA.index - signB.index);
  const steps = Math.min(rawDiff, 12 - rawDiff);
  const aspectDegrees = steps * 30;

  let aspectNameAr = 'اقتران (٠°)';
  let baseOverall = 84;
  let emotional = 82;
  let intellectual = 80;
  let stability = 84;
  let headlineAr = 'تناغم روحي ومرايا متشابهة';
  let analysisAr = '';

  if (steps === 0) {
    aspectNameAr = 'اقتران (٠°)';
    baseOverall = 85;
    emotional = 84;
    intellectual = 88;
    stability = 80;
    headlineAr = 'فهم فطري عميق وطاقة متطابقة';
    analysisAr = `التقاء ${signA.arabicName} مع ${signB.arabicName} يخلق علاقة مرآة واضحة؛ كل طرف يفهم دوافع الآخر دون شرح مطول، لكن التحدي يكمن في تجنب تضخيم نفس العيوب المشتركة.`;
  } else if (steps === 1) {
    aspectNameAr = 'تآلف متجاور (٣٠°)';
    baseOverall = 71;
    emotional = 70;
    intellectual = 73;
    stability = 69;
    headlineAr = 'تعلّم متبادل واختلاف مكمل';
    analysisAr = `العلاقة بين ${signA.arabicName} (${signA.element}) و${signB.arabicName} (${signB.element}) تجمع بين عالمين متجاورين يمتلك كل منهما ما ينقص الآخر. النجاح هنا يزدهر بالصبر والإنصات.`;
  } else if (steps === 2) {
    aspectNameAr = 'تسديس متناغم (٦٠°)';
    baseOverall = 88;
    emotional = 85;
    intellectual = 91;
    stability = 86;
    headlineAr = 'انسيابية فكرية وصداقة دافئة';
    analysisAr = `زاوية التسديس بين ${signA.arabicName} و${signB.arabicName} تمنح العلاقة سهولة في التواصل وروح شراكة محفزة، حيث يشجع كل طرف نمو الآخر دون صراع على المساحة.`;
  } else if (steps === 3) {
    aspectNameAr = 'تربيع ديناميكي (٩٠°)';
    baseOverall = 68;
    emotional = 72;
    intellectual = 65;
    stability = 64;
    headlineAr = 'جاذبية قوية وتحدي الإرادات';
    analysisAr = `التربيع بين ${signA.arabicName} و${signB.arabicName} يولّد شرارة جذب حقيقية وحيوية عالية، غير أن اختلاف إيقاع العمل والعاطفة يتطلب مرونة وتنازلاً واعياً من الطرفين.`;
  } else if (steps === 4) {
    aspectNameAr = 'تثليث ميمون (١٢٠°)';
    baseOverall = 94;
    emotional = 95;
    intellectual = 92;
    stability = 93;
    headlineAr = 'انسجام طبيعي من أصفى الدرجات الفلكية';
    analysisAr = `يشترك ${signA.arabicName} و${signB.arabicName} في العنصر الـ${signA.element} نفسه، مما يصنع تدفقاً سلساً للمشاعر والثقة والأهداف المشتركة بأقل قدر من الاحتكاك.`;
  } else if (steps === 5) {
    aspectNameAr = 'انفصال خماسي (١٥٠°)';
    baseOverall = 65;
    emotional = 66;
    intellectual = 68;
    stability = 62;
    headlineAr = 'تكيف واعٍ واكتشاف مستمر';
    analysisAr = `لا يجتمع ${signA.arabicName} و${signB.arabicName} في عنصر أو طبيعة متطابقة، لكن هذا الاختلاف يصبح مصدر ثراء حقيقي عندما يتفق الطرفان على احترام إيقاع كل منهما.`;
  } else {
    aspectNameAr = 'مقابلة قطبية (١٨٠°)';
    baseOverall = 81;
    emotional = 86;
    intellectual = 79;
    stability = 77;
    headlineAr = 'تجاذب الأضداد والتكامل المغناطيسي';
    analysisAr = `يقف ${signA.arabicName} قبالة ${signB.arabicName} على عجلة الأبراج؛ انجذاب مغناطيسي قوي وتكامل بين الحضور والعمق إذا اتجه الطرفان للتكامل لا التنافس.`;
  }

  return {
    signA,
    signB,
    aspectNameAr,
    aspectDegrees,
    overallScore: baseOverall,
    emotionalScore: emotional,
    intellectualScore: intellectual,
    stabilityScore: stability,
    headlineAr,
    analysisAr,
    strengthsAr: [
      `توازن بين ${signA.keyword} لدى ${signA.arabicName} و${signB.keyword} لدى ${signB.arabicName}.`,
      `إمكانية بناء ثقة متينة عند وضوح التوقعات منذ البداية.`,
      `دعم متبادل في القرارات المصيرية وتبادل الخبرات الحياتية.`,
    ],
    challengesAr: [
      `تباين ردود الفعل وقت الضغوط بين الطبيعة الـ${signA.modality}ة والـ${signB.modality}ة.`,
      `الحاجة إلى صياغة لغة حوار تراعي حساسية كل طرف.`,
    ],
    adviceAr: `السر في ازدهار هذه العلاقة هو تحويل الاختلاف من مساحة نقد إلى مساحة فضول؛ امنحا بعضكما حرية التعبير مع الحفاظ على طقوس تواصل ثابتة.`,
  };
}
