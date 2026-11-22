import React, { useMemo, useState } from 'react';
import { Calendar, Clock, MapPin, User } from 'lucide-react';
import { BIRTH_CITIES, ZodiacId } from '../data/zodiacData';
import { calculateNatalChart } from '../utils/astrologyEngine';
import { PlanetGlyph, ZodiacGlyph } from './ZodiacGlyph';
import { ZodiacWheel } from './ZodiacWheel';

export interface SavedNatalProfile {
  name: string;
  birthDate: string;
  birthTime: string;
  unknownTime: boolean;
  cityId: string;
  sunSignId: ZodiacId;
}

interface NatalChartViewProps {
  profile: SavedNatalProfile;
  onSaveProfile: (profile: SavedNatalProfile) => void;
  onOpenSignInDaily: (signId: ZodiacId) => void;
}

export const NatalChartView: React.FC<NatalChartViewProps> = ({
  profile,
  onSaveProfile,
  onOpenSignInDaily,
}) => {
  const [name, setName] = useState(profile.name);
  const [birthDate, setBirthDate] = useState(profile.birthDate);
  const [birthTime, setBirthTime] = useState(profile.birthTime);
  const [unknownTime, setUnknownTime] = useState(profile.unknownTime);
  const [cityId, setCityId] = useState(profile.cityId);
  const [backdropError, setBackdropError] = useState(false);

  const selectedCity = useMemo(
    () => BIRTH_CITIES.find((c) => c.id === cityId) ?? BIRTH_CITIES[0],
    [cityId]
  );

  const natalResult = useMemo(() => {
    const safeDate = birthDate || '1996-08-14';
    const safeTime = unknownTime ? '12:00' : birthTime || '12:00';
    return calculateNatalChart(
      safeDate,
      safeTime,
      selectedCity.lat,
      selectedCity.lng,
      selectedCity.tzOffset
    );
  }, [birthDate, birthTime, unknownTime, selectedCity]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile({
      name: name.trim(),
      birthDate,
      birthTime,
      unknownTime,
      cityId,
      sunSignId: natalResult.sunSign.id,
    });
  };

  const totalWeight = Object.values(natalResult.elementBalance).reduce((a, b) => a + b, 0) || 1;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Birth Data Form & Big Three */}
        <div className="lg:col-span-5 space-y-6">
          <form onSubmit={handleSubmit} className="glass-slab rounded-3xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between gap-3 pb-3 border-b border-white/8">
              <div>
                <h1 className="text-xl font-bold text-white">حاسبة الخريطة الفلكية</h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  احسب برجك الشمسي والقمري والطالع بدقة فلكية
                </p>
              </div>
              <div className="w-11 h-11 rounded-2xl overflow-hidden border border-white/10 shrink-0 bg-[#140E16]">
                {!backdropError ? (
                  <img
                    src="/src/assets/images/natal_chart_backdrop_1795333888749.jpg"
                    alt="الإسطرلاب الفلكي"
                    referrerPolicy="no-referrer"
                    onError={() => setBackdropError(true)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#FDE68A]">
                    <PlanetGlyph planet="sun" className="w-5 h-5" />
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3.5">
              <div>
                <label htmlFor="natal-name" className="block text-xs font-medium text-slate-300 mb-1.5">
                  الاسم (اختياري)
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="natal-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="مثال: سارة"
                    className="w-full bg-[#0B090C] border border-white/12 focus:border-[#FB7185] rounded-2xl pr-10 pl-4 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none min-h-[44px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="natal-date" className="block text-xs font-medium text-slate-300 mb-1.5">
                    تاريخ الميلاد
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="natal-date"
                      type="date"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      required
                      className="w-full bg-[#0B090C] border border-white/12 focus:border-[#FB7185] rounded-2xl pr-10 pl-3 py-2.5 text-sm text-white outline-none min-h-[44px]"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="natal-time" className="block text-xs font-medium text-slate-300 mb-1.5">
                    ساعة الميلاد
                  </label>
                  <div className="relative">
                    <Clock className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="natal-time"
                      type="time"
                      value={birthTime}
                      disabled={unknownTime}
                      onChange={(e) => setBirthTime(e.target.value)}
                      className="w-full bg-[#0B090C] border border-white/12 focus:border-[#FB7185] disabled:opacity-45 rounded-2xl pr-10 pl-3 py-2.5 text-sm text-white outline-none min-h-[44px]"
                    />
                  </div>
                </div>
              </div>

              <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer select-none min-h-[36px]">
                <input
                  type="checkbox"
                  checked={unknownTime}
                  onChange={(e) => setUnknownTime(e.target.checked)}
                  className="w-4 h-4 accent-[#E11D48] rounded"
                />
                <span>وقت الميلاد غير معروف (استخدام منتصف النهار التقديري)</span>
              </label>

              <div>
                <label htmlFor="natal-city" className="block text-xs font-medium text-slate-300 mb-1.5">
                  مدينة الميلاد
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select
                    id="natal-city"
                    value={cityId}
                    onChange={(e) => setCityId(e.target.value)}
                    className="w-full bg-[#0B090C] border border-white/12 focus:border-[#FB7185] rounded-2xl pr-10 pl-4 py-2.5 text-sm text-white outline-none min-h-[44px]"
                  >
                    {BIRTH_CITIES.map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.nameAr} — {city.countryAr}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-5 rounded-full bg-gradient-to-l from-[#E11D48] to-[#9F1239] hover:from-[#F43F5E] hover:to-[#BE123C] text-white text-sm font-semibold transition-all shadow-[0_8px_24px_-8px_rgba(225,29,72,0.65)] min-h-[48px]"
            >
              حفظ واعتماد الخريطة الشخصية
            </button>
          </form>

          {/* Big Three Summary */}
          <section className="glass-slab-crimson rounded-3xl p-5 sm:p-6 space-y-4">
            <h2 className="text-base font-bold text-white">
              {name ? `الثالوث الفلكي لـ ${name}` : 'الثالوث الفلكي الأساسي'}
            </h2>

            <div className="divide-y divide-white/8">
              <div className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-[#FDE68A]">
                    <ZodiacGlyph signId={natalResult.sunSign.id} className="w-5 h-5" />
                  </span>
                  <div>
                    <div className="text-xs text-slate-400">البرج الشمسي (الجوهر)</div>
                    <div className="text-base font-bold text-white">
                      {natalResult.sunSign.arabicName}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenSignInDaily(natalResult.sunSign.id)}
                  className="text-xs text-[#FB7185] hover:text-[#FDA4AF] font-semibold min-h-[40px] px-2"
                >
                  عرض التوقعات
                </button>
              </div>

              <div className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-[#FDE68A]">
                    <ZodiacGlyph signId={natalResult.moonSign.id} className="w-5 h-5" />
                  </span>
                  <div>
                    <div className="text-xs text-slate-400">البرج القمري (المشاعر)</div>
                    <div className="text-base font-bold text-white">
                      {natalResult.moonSign.arabicName}
                    </div>
                  </div>
                </div>
                <span className="text-xs text-slate-400">عنصر {natalResult.moonSign.element}</span>
              </div>

              <div className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-[#FB7185]">
                    <ZodiacGlyph signId={natalResult.ascendantSign.id} className="w-5 h-5" />
                  </span>
                  <div>
                    <div className="text-xs text-slate-400">
                      الطالع (الصعود عند الولادة)
                    </div>
                    <div className="text-base font-bold text-white">
                      {unknownTime ? 'تقديري: ' : ''}
                      {natalResult.ascendantSign.arabicName}
                    </div>
                  </div>
                </div>
                <span className="font-mono-tabular text-xs text-slate-400" dir="ltr">
                  {natalResult.ascendantFormatted}
                </span>
              </div>
            </div>

            <p className="text-sm leading-relaxed text-slate-300 pt-2 border-t border-white/8">
              {natalResult.summaryAr}
            </p>
          </section>
        </div>

        {/* Interactive Zodiac Wheel + Element Distribution + Planets Table */}
        <div className="lg:col-span-7 space-y-6">
          <section className="glass-slab rounded-3xl p-5 sm:p-7">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <div>
                <h2 className="text-lg font-bold text-white">الدائرة الفلكية التفاعلية</h2>
                <p className="text-xs text-slate-400">
                  اضغط على أي كوكب أو برج لمعاينة موقعه الفلكي الدقيق لحظة الميلاد
                </p>
              </div>
              <span className="text-xs text-[#FFB95F]">
                {selectedCity.nameAr} · {birthDate}
              </span>
            </div>

            <ZodiacWheel
              planets={natalResult.planets}
              selectedSignId={natalResult.sunSign.id}
              ascendantDegree={natalResult.ascendantDegree}
              onSelectSign={onOpenSignInDaily}
            />
          </section>

          <section className="glass-slab rounded-3xl p-5 sm:p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white">توازن العناصر الأربعة</h2>
              <span className="text-xs text-slate-400">
                العنصر الغالب: <strong className="text-[#FDE68A]">{natalResult.dominantElement}</strong>
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {(['ناري', 'ترابي', 'هوائي', 'مائي'] as const).map((elem) => {
                const pct = Math.round((natalResult.elementBalance[elem] / totalWeight) * 100);
                return (
                  <div key={elem} className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300">{elem}</span>
                      <span className="font-mono-tabular text-[#FDE68A]">{pct}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/8 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-l from-[#FFB95F] to-[#E11D48]"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 border-t border-white/8">
              <h3 className="text-sm font-semibold text-white mb-3">توزيع الكواكب في الأبراج</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 divide-y sm:divide-y-0 divide-white/8">
                {natalResult.planets.map((p) => (
                  <div
                    key={p.key}
                    className="py-2.5 flex items-center justify-between gap-2 border-b border-white/6 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <PlanetGlyph planet={p.key} className="w-4 h-4 text-[#FDE68A]" />
                      <span className="font-semibold text-slate-100">{p.arabicName}</span>
                      <span className="text-slate-400">في {p.sign.arabicName}</span>
                    </div>
                    <span className="font-mono-tabular text-slate-300" dir="ltr">
                      {p.formattedDegree}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
