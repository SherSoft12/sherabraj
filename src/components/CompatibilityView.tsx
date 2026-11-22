import React, { useMemo, useState } from 'react';
import { ArrowLeftRight, HeartHandshake } from 'lucide-react';
import { ZODIAC_SIGNS, ZodiacId } from '../data/zodiacData';
import { calculateCompatibility } from '../utils/astrologyEngine';
import { ZodiacGlyph } from './ZodiacGlyph';

interface CompatibilityViewProps {
  initialSignA: ZodiacId;
  userSunSignId?: ZodiacId;
}

export const CompatibilityView: React.FC<CompatibilityViewProps> = ({
  initialSignA,
  userSunSignId,
}) => {
  const [signA, setSignA] = useState<ZodiacId>(initialSignA);
  const [signB, setSignB] = useState<ZodiacId>('libra');

  const report = useMemo(() => calculateCompatibility(signA, signB), [signA, signB]);

  const swapSigns = () => {
    setSignA(signB);
    setSignB(signA);
  };

  return (
    <div className="space-y-6">
      {/* Dual Sign Picker */}
      <section className="glass-slab rounded-3xl p-5 sm:p-7 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-white">مختبر التوافق الفلكي</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              تحليل الزوايا الهندسية وتناغم العناصر والطباع بين أي برجين
            </p>
          </div>
          {userSunSignId && (
            <button
              type="button"
              onClick={() => setSignA(userSunSignId)}
              className="text-xs font-semibold text-[#FB7185] hover:text-[#FDA4AF] transition-colors min-h-[44px] px-2"
            >
              تعيين برجي الشخصي كطرف أول
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-center">
          {/* Sign A Selector */}
          <div className="space-y-2">
            <label htmlFor="compat-sign-a" className="block text-xs font-medium text-slate-400">
              البرج الأول
            </label>
            <div className="flex items-center gap-3 bg-[#0B090C] border border-white/12 rounded-2xl px-4 py-2.5 min-h-[52px]">
              <ZodiacGlyph signId={signA} className="w-6 h-6 text-[#FDE68A] shrink-0" />
              <select
                id="compat-sign-a"
                value={signA}
                onChange={(e) => setSignA(e.target.value as ZodiacId)}
                className="w-full bg-transparent text-sm font-semibold text-white outline-none"
              >
                {ZODIAC_SIGNS.map((s) => (
                  <option key={s.id} value={s.id} className="bg-[#151016]">
                    {s.arabicName} ({s.element})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="button"
            onClick={swapSigns}
            aria-label="تبديل البرجين"
            className="mx-auto min-w-[44px] min-h-[44px] rounded-full bg-[#1F1722] border border-white/12 hover:border-[#FB7185]/60 text-[#FFB95F] flex items-center justify-center transition-colors"
          >
            <ArrowLeftRight className="w-4 h-4" />
          </button>

          {/* Sign B Selector */}
          <div className="space-y-2">
            <label htmlFor="compat-sign-b" className="block text-xs font-medium text-slate-400">
              البرج الثاني
            </label>
            <div className="flex items-center gap-3 bg-[#0B090C] border border-white/12 rounded-2xl px-4 py-2.5 min-h-[52px]">
              <ZodiacGlyph signId={signB} className="w-6 h-6 text-[#FB7185] shrink-0" />
              <select
                id="compat-sign-b"
                value={signB}
                onChange={(e) => setSignB(e.target.value as ZodiacId)}
                className="w-full bg-transparent text-sm font-semibold text-white outline-none"
              >
                {ZODIAC_SIGNS.map((s) => (
                  <option key={s.id} value={s.id} className="bg-[#151016]">
                    {s.arabicName} ({s.element})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Compatibility Result Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <section className="lg:col-span-5 glass-slab-crimson rounded-3xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#FFB95F]">{report.aspectNameAr}</span>
            <HeartHandshake className="w-5 h-5 text-[#FB7185]" />
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-5xl font-bold font-mono-tabular text-white">
              {report.overallScore}%
            </span>
            <span className="text-sm text-slate-300">نسبة الانسجام الكلي</span>
          </div>

          <h2 className="text-lg font-bold text-[#FDE68A]">{report.headlineAr}</h2>

          <div className="space-y-3.5 pt-4 border-t border-white/8">
            {[
              { label: 'التواصل العاطفي', value: report.emotionalScore },
              { label: 'التفاهم الفكري', value: report.intellectualScore },
              { label: 'الاستقرار طويل الأمد', value: report.stabilityScore },
            ].map((item) => (
              <div key={item.label} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300">{item.label}</span>
                  <span className="font-mono-tabular font-semibold text-white">
                    {item.value}%
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-white/8 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-l from-[#FB7185] to-[#E11D48] transition-all duration-300"
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="lg:col-span-7 glass-slab rounded-3xl p-6 space-y-5">
          <div>
            <h3 className="text-base font-bold text-white mb-2">
              ديناميكية {report.signA.arabicName} و{report.signB.arabicName}
            </h3>
            <p className="text-sm sm:text-base leading-relaxed text-slate-200">
              {report.analysisAr}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-white/8">
            <div>
              <h4 className="text-xs font-semibold text-[#FDE68A] mb-2.5">نقاط القوة المشتركة</h4>
              <ul className="space-y-2 text-sm text-slate-300 list-disc list-inside">
                {report.strengthsAr.map((item, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-[#FB7185] mb-2.5">تحديات تحتاج وعياً</h4>
              <ul className="space-y-2 text-sm text-slate-300 list-disc list-inside">
                {report.challengesAr.map((item, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-4 border-t border-white/8">
            <h4 className="text-xs font-semibold text-slate-400 mb-1.5">نصيحة التوازن</h4>
            <p className="text-sm leading-relaxed text-slate-200">{report.adviceAr}</p>
          </div>
        </section>
      </div>
    </div>
  );
};
