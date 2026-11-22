import React, { useMemo, useState } from 'react';
import {
  Bookmark,
  Check,
  Compass,
  Heart,
  Briefcase,
  Activity,
  Sparkles,
  Share2,
  Calendar,
} from 'lucide-react';
import { ZODIAC_SIGNS, ZodiacId, getZodiacById } from '../data/zodiacData';
import {
  calculateMoonPhase,
  calculatePlanetaryPositions,
  generateDailyHoroscope,
  getSignFromBirthDate,
} from '../utils/astrologyEngine';
import { PlanetGlyph, ZodiacGlyph } from './ZodiacGlyph';

export interface SavedReadingItem {
  id: string;
  signId: ZodiacId;
  signName: string;
  dateKey: string;
  arabicDateLabel: string;
  overview: string;
  savedAt: string;
}

interface DailyHoroscopeViewProps {
  selectedSignId: ZodiacId;
  onSelectSign: (id: ZodiacId) => void;
  savedReadings: SavedReadingItem[];
  onToggleSaveReading: (item: SavedReadingItem) => void;
  userSunSignId?: ZodiacId;
}

type DayOffset = -1 | 0 | 1;
type ReadingCategory = 'overview' | 'love' | 'career' | 'wellness';

export const DailyHoroscopeView: React.FC<DailyHoroscopeViewProps> = ({
  selectedSignId,
  onSelectSign,
  savedReadings,
  onToggleSaveReading,
  userSunSignId,
}) => {
  const [dayOffset, setDayOffset] = useState<DayOffset>(0);
  const [category, setCategory] = useState<ReadingCategory>('overview');
  const [showFinder, setShowFinder] = useState(false);
  const [finderDate, setFinderDate] = useState('1996-08-14');
  const [copiedToast, setCopiedToast] = useState(false);
  const [heroImgError, setHeroImgError] = useState(false);
  const [moonImgError, setMoonImgError] = useState(false);

  const targetDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + dayOffset);
    return d;
  }, [dayOffset]);

  const sign = useMemo(() => getZodiacById(selectedSignId), [selectedSignId]);
  const reading = useMemo(
    () => generateDailyHoroscope(selectedSignId, targetDate),
    [selectedSignId, targetDate]
  );
  const moonPhase = useMemo(() => calculateMoonPhase(targetDate), [targetDate]);
  const planets = useMemo(() => calculatePlanetaryPositions(targetDate), [targetDate]);

  const readingId = `${selectedSignId}-${reading.dateKey}`;
  const isSaved = savedReadings.some((item) => item.id === readingId);

  const handleFindSign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!finderDate) return;
    const [, month, day] = finderDate.split('-').map(Number);
    if (month && day) {
      const matched = getSignFromBirthDate(month, day);
      onSelectSign(matched.id);
      setShowFinder(false);
    }
  };

  const handleShare = async () => {
    const shareText = `توقعات برج ${sign.arabicName} (${reading.arabicDateLabel}):\n${reading.overview}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: `برج ${sign.arabicName} — أبراج اليوم`, text: shareText });
      } else {
        await navigator.clipboard.writeText(shareText);
        setCopiedToast(true);
        setTimeout(() => setCopiedToast(false), 2200);
      }
    } catch {
      // Fallback copy if share cancelled
      try {
        await navigator.clipboard.writeText(shareText);
        setCopiedToast(true);
        setTimeout(() => setCopiedToast(false), 2200);
      } catch {
        // Ignore clipboard unavailability
      }
    }
  };

  const activeCategoryText =
    category === 'overview'
      ? reading.overview
      : category === 'love'
      ? reading.love
      : category === 'career'
      ? reading.career
      : reading.wellness;

  const scoreMetrics = [
    { label: 'العاطفة', value: reading.scores.love },
    { label: 'العمل', value: reading.scores.career },
    { label: 'الطاقة', value: reading.scores.energy },
    { label: 'الحظ', value: reading.scores.luck },
  ];

  return (
    <div className="space-y-6">
      {/* Top Horizontal Zodiac Carousel + Quick Birthdate Finder */}
      <section aria-label="اختيار البرج">
        <div className="flex items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-semibold text-slate-200">اختر برجك الفلكي</h2>
            {userSunSignId && userSunSignId !== selectedSignId && (
              <button
                type="button"
                onClick={() => onSelectSign(userSunSignId)}
                className="text-xs text-[#FB7185] hover:text-[#FDA4AF] transition-colors whitespace-nowrap min-h-[36px] px-1"
              >
                العودة لبرجي ({getZodiacById(userSunSignId).arabicName})
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={() => setShowFinder((prev) => !prev)}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#FFB95F] hover:text-[#FDE68A] transition-colors min-h-[44px] px-2 whitespace-nowrap shrink-0"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>اكتشف برجك بالميلاد</span>
          </button>
        </div>

        {showFinder && (
          <form
            onSubmit={handleFindSign}
            className="glass-slab rounded-2xl p-4 mb-4 flex flex-wrap items-center gap-3"
          >
            <label htmlFor="quick-birth-date" className="text-xs text-slate-300 font-medium">
              أدخل تاريخ ميلادك:
            </label>
            <input
              id="quick-birth-date"
              type="date"
              value={finderDate}
              onChange={(e) => setFinderDate(e.target.value)}
              className="bg-[#0B090C] border border-white/15 focus:border-[#FB7185] rounded-xl px-3 py-2 text-sm text-white outline-none min-h-[44px]"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#E11D48] hover:bg-[#BE123C] text-white text-xs font-semibold transition-colors min-h-[44px] whitespace-nowrap"
            >
              تحديد البرج
            </button>
          </form>
        )}

        <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1">
          {ZODIAC_SIGNS.map((item) => {
            const active = item.id === selectedSignId;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectSign(item.id)}
                className={`group flex flex-col items-center justify-center min-w-[74px] min-h-[78px] px-3 py-2.5 rounded-2xl transition-all duration-200 shrink-0 ${
                  active
                    ? 'bg-gradient-to-b from-[#E11D48]/25 to-[#9F1239]/20 border border-[#FB7185]/60 text-white shadow-[0_8px_24px_-10px_rgba(225,29,72,0.55)]'
                    : 'bg-[#151016]/75 border border-white/8 text-slate-400 hover:text-slate-100 hover:border-white/20'
                }`}
              >
                <ZodiacGlyph
                  signId={item.id}
                  className={`w-6 h-6 mb-1.5 transition-transform duration-200 ${
                    active
                      ? 'text-[#FDE68A] scale-110'
                      : 'text-slate-400 group-hover:text-[#FFB95F]'
                  }`}
                />
                <span className="text-xs font-semibold whitespace-nowrap">{item.arabicName}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Main 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Primary Column: Hero Horoscope Reading */}
        <article className="lg:col-span-8 glass-slab-crimson rounded-3xl overflow-hidden">
          {/* Atmospheric Crimson Nebula Header Strip */}
          <div className="relative h-40 sm:h-48 w-full overflow-hidden">
            {!heroImgError ? (
              <img
                src="/src/assets/images/crimson_nebula_hero_1795333888669.jpg"
                alt={`سماء برج ${sign.arabicName} الفلكية`}
                referrerPolicy="no-referrer"
                onError={() => setHeroImgError(true)}
                className="w-full h-full object-cover object-center opacity-75"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#3B0A1A] via-[#1B0D14] to-[#0B090C]" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#140E16] via-[#140E16]/55 to-transparent" />

            {/* Top Action Controls inside Hero Banner */}
            <div className="absolute top-4 inset-x-4 sm:inset-x-6 flex items-center justify-between gap-3">
              {/* Day Switcher */}
              <div
                className="inline-flex items-center p-1 rounded-full bg-[#0B090C]/75 backdrop-blur-md border border-white/10"
                role="tablist"
                aria-label="تاريخ التوقعات"
              >
                {[
                  { offset: -1 as DayOffset, label: 'أمس' },
                  { offset: 0 as DayOffset, label: 'اليوم' },
                  { offset: 1 as DayOffset, label: 'غداً' },
                ].map((d) => (
                  <button
                    key={d.offset}
                    type="button"
                    role="tab"
                    aria-selected={dayOffset === d.offset}
                    onClick={() => setDayOffset(d.offset)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors min-h-[36px] whitespace-nowrap ${
                      dayOffset === d.offset
                        ? 'bg-[#E11D48] text-white'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>

              {/* Save & Share Actions */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    onToggleSaveReading({
                      id: readingId,
                      signId: selectedSignId,
                      signName: sign.arabicName,
                      dateKey: reading.dateKey,
                      arabicDateLabel: reading.arabicDateLabel,
                      overview: reading.overview,
                      savedAt: new Date().toISOString(),
                    })
                  }
                  aria-label={isSaved ? 'إزالة من المحفوظات' : 'حفظ التوقع في السجل'}
                  className={`min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center backdrop-blur-md border transition-colors ${
                    isSaved
                      ? 'bg-[#E11D48] border-[#FB7185] text-white'
                      : 'bg-[#0B090C]/70 border-white/15 text-slate-200 hover:border-[#FB7185]/60'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                </button>
                <button
                  type="button"
                  onClick={handleShare}
                  aria-label="مشاركة التوقع"
                  className="min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center bg-[#0B090C]/70 backdrop-blur-md border border-white/15 text-slate-200 hover:border-[#FFB95F]/60 transition-colors"
                >
                  {copiedToast ? (
                    <Check className="w-4 h-4 text-[#FDE68A]" />
                  ) : (
                    <Share2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Sign Title & Unboxed Astronomical Metadata */}
            <div className="absolute bottom-4 inset-x-4 sm:inset-x-6 flex items-end justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                  برج {sign.arabicName}
                </h1>
                <p className="mt-1 text-xs sm:text-sm text-slate-300 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                  <span>عنصر {sign.element}</span>
                  <span aria-hidden="true" className="text-slate-500">·</span>
                  <span>الكوكب الحاكم: {sign.rulingPlanet}</span>
                  <span aria-hidden="true" className="text-slate-500">·</span>
                  <span>{sign.dateRangeAr}</span>
                </p>
              </div>
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#1A1118]/90 border border-[#FFB95F]/35 flex items-center justify-center text-[#FDE68A] shrink-0">
                <ZodiacGlyph signId={sign.id} className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>
            </div>
          </div>

          {/* Reading Body */}
          <div className="p-5 sm:p-7 space-y-6">
            {/* Unboxed Date & Dominant Transit Line */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-white/8 text-xs text-slate-400">
              <span>{reading.arabicDateLabel}</span>
              <span>
                العبور المؤثر: <strong className="text-[#FDE68A] font-semibold">{reading.dominantPlanet.arabicName}</strong> في{' '}
                {reading.dominantPlanet.sign.arabicName} ({reading.dominantPlanet.formattedDegree})
              </span>
            </div>

            {/* Category Segmented Tabs */}
            <div
              className="grid grid-cols-2 sm:grid-cols-4 gap-2"
              role="tablist"
              aria-label="أقسام التوقع اليومي"
            >
              {[
                { key: 'overview' as ReadingCategory, label: 'النظرة العامة', Icon: Sparkles },
                { key: 'love' as ReadingCategory, label: 'الحب والعلاقات', Icon: Heart },
                { key: 'career' as ReadingCategory, label: 'العمل والمال', Icon: Briefcase },
                { key: 'wellness' as ReadingCategory, label: 'الصحة والطاقة', Icon: Activity },
              ].map(({ key, label, Icon }) => {
                const active = category === key;
                return (
                  <button
                    key={key}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setCategory(key)}
                    className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-2xl text-xs font-semibold transition-all min-h-[44px] whitespace-nowrap ${
                      active
                        ? 'bg-[#E11D48] text-white shadow-[0_6px_18px_-6px_rgba(225,29,72,0.65)]'
                        : 'bg-[#1D1620] text-slate-300 hover:text-white border border-white/8'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>

            {/* Primary Horoscope Passage */}
            <div className="min-h-[104px]">
              <p className="text-base sm:text-[17px] leading-[1.85] text-slate-100">
                {activeCategoryText}
              </p>
            </div>

            {/* 4-Column Tabular Indices Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-5 border-t border-white/8">
              {scoreMetrics.map((metric) => (
                <div key={metric.label} className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">{metric.label}</span>
                    <span className="font-mono-tabular font-semibold text-[#FDE68A]">
                      {metric.value}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-white/8 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-l from-[#FB7185] to-[#E11D48] transition-all duration-300"
                      style={{ width: `${metric.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Clean Unboxed Daily Cues Footer */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/8 text-xs">
              <div>
                <div className="text-slate-500 mb-0.5">رقم الحظ</div>
                <div className="font-semibold text-slate-100 font-mono-tabular">
                  {reading.luckyNumber}
                </div>
              </div>
              <div>
                <div className="text-slate-500 mb-0.5">اللون الملائم</div>
                <div className="font-semibold text-slate-100">{reading.luckyColor}</div>
              </div>
              <div>
                <div className="text-slate-500 mb-0.5">ساعة الذروة</div>
                <div className="font-semibold text-slate-100">{reading.peakHour}</div>
              </div>
              <div>
                <div className="text-slate-500 mb-0.5">أفضل توافق اليوم</div>
                <button
                  type="button"
                  onClick={() => onSelectSign(reading.bestMatchToday.id)}
                  className="font-semibold text-[#FB7185] hover:text-[#FDA4AF] transition-colors inline-flex items-center gap-1"
                >
                  <span>{reading.bestMatchToday.arabicName}</span>
                </button>
              </div>
            </div>
          </div>
        </article>

        {/* Secondary Column: Live Moon Phase & Today's Planetary Transits */}
        <aside className="lg:col-span-4 space-y-6">
          {/* Moon Phase Slab */}
          <section className="glass-slab rounded-3xl p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-medium text-[#FFB95F]">الطور القمري المباشر</span>
                <h2 className="text-lg font-bold text-white">{moonPhase.arabicPhaseName}</h2>
                <p className="text-xs text-slate-400">
                  القمر في برج {moonPhase.lunarSign.arabicName} · إضاءة{' '}
                  <span className="font-mono-tabular text-slate-200">{moonPhase.illumination}%</span>
                </p>
              </div>

              <div className="w-16 h-16 rounded-2xl overflow-hidden border border-white/10 shrink-0 bg-[#120D14]">
                {!moonImgError ? (
                  <img
                    src="/src/assets/images/lunar_phase_obsidian_1795333889184.jpg"
                    alt={moonPhase.arabicPhaseName}
                    referrerPolicy="no-referrer"
                    onError={() => setMoonImgError(true)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#FDE68A]">
                    <PlanetGlyph planet="moon" className="w-7 h-7" />
                  </div>
                )}
              </div>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-slate-300">{moonPhase.guidance}</p>

            <div className="mt-4 pt-3 border-t border-white/8 flex items-center justify-between text-xs text-slate-400">
              <span>العمر القمري</span>
              <span className="font-mono-tabular text-slate-200">{moonPhase.ageDays} يوماً</span>
            </div>
          </section>

          {/* Planetary Ephemeris List */}
          <section className="glass-slab rounded-3xl p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#FB7185]" />
                <span>مواقع الكواكب الآن</span>
              </h2>
              <span className="text-xs text-slate-400">رصد فلكي</span>
            </div>

            <ul className="divide-y divide-white/8">
              {planets.map((planet) => (
                <li
                  key={planet.key}
                  className="py-2.5 flex items-center justify-between gap-3 text-sm"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-[#FDE68A] shrink-0">
                      <PlanetGlyph planet={planet.key} className="w-4 h-4" />
                    </span>
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-100 flex items-center gap-1.5">
                        <span>{planet.arabicName}</span>
                        {planet.isRetrograde && (
                          <span className="text-[11px] font-medium text-[#FB7185]">تراجع</span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400">برج {planet.sign.arabicName}</div>
                    </div>
                  </div>
                  <span
                    className="font-mono-tabular text-xs text-slate-300 shrink-0"
                    dir="ltr"
                  >
                    {planet.formattedDegree}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
};
