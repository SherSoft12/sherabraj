import React, { useEffect, useState } from 'react';
import { BookMarked, Compass, HeartHandshake, Orbit, Sparkles } from 'lucide-react';
import { CompatibilityView } from './components/CompatibilityView';
import { DailyHoroscopeView, SavedReadingItem } from './components/DailyHoroscopeView';
import { JournalNote, JournalView } from './components/JournalView';
import { NatalChartView, SavedNatalProfile } from './components/NatalChartView';
import { ZodiacId, getZodiacById } from './data/zodiacData';

type AppTab = 'daily' | 'natal' | 'compatibility' | 'journal';

const STORAGE_KEYS = {
  sign: 'abraj_selected_sign_v1',
  profile: 'abraj_natal_profile_v1',
  readings: 'abraj_saved_readings_v1',
  notes: 'abraj_journal_notes_v1',
};

const DEFAULT_PROFILE: SavedNatalProfile = {
  name: '',
  birthDate: '1996-08-14',
  birthTime: '08:30',
  unknownTime: false,
  cityId: 'riyadh',
  sunSignId: 'leo',
};

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('daily');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const [selectedSignId, setSelectedSignId] = useState<ZodiacId>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.sign) as ZodiacId | null;
      return saved || 'leo';
    } catch {
      return 'leo';
    }
  });

  const [profile, setProfile] = useState<SavedNatalProfile>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.profile);
      return raw ? { ...DEFAULT_PROFILE, ...JSON.parse(raw) } : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  const [savedReadings, setSavedReadings] = useState<SavedReadingItem[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.readings);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [notes, setNotes] = useState<JournalNote[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.notes);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.sign, selectedSignId);
    } catch {
      // Ignore storage quota errors
    }
  }, [selectedSignId]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.readings, JSON.stringify(savedReadings));
    } catch {
      // Ignore storage quota errors
    }
  }, [savedReadings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.notes, JSON.stringify(notes));
    } catch {
      // Ignore storage quota errors
    }
  }, [notes]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg((curr) => (curr === msg ? null : curr));
    }, 2600);
  };

  const handleSaveProfile = (nextProfile: SavedNatalProfile) => {
    setProfile(nextProfile);
    setSelectedSignId(nextProfile.sunSignId);
    try {
      localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(nextProfile));
    } catch {
      // Ignore storage quota errors
    }
    showToast(`تم حفظ خريطتك الفلكية — برج ${getZodiacById(nextProfile.sunSignId).arabicName}`);
  };

  const handleToggleSaveReading = (item: SavedReadingItem) => {
    setSavedReadings((prev) => {
      const exists = prev.some((r) => r.id === item.id);
      if (exists) {
        showToast('تمت إزالة التوقع من المحفوظات');
        return prev.filter((r) => r.id !== item.id);
      }
      showToast('تم حفظ التوقع في السجل الفلكي');
      return [item, ...prev];
    });
  };

  const handleAddNote = (note: JournalNote) => {
    setNotes((prev) => [note, ...prev]);
    showToast('تمت إضافة التدوينة إلى السجل');
  };

  const handleDeleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const handleOpenSignInDaily = (signId: ZodiacId) => {
    setSelectedSignId(signId);
    setActiveTab('daily');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navItems: { id: AppTab; label: string; Icon: React.FC<{ className?: string }> }[] = [
    { id: 'daily', label: 'أبراج اليوم', Icon: Sparkles },
    { id: 'natal', label: 'الخريطة الفلكية', Icon: Orbit },
    { id: 'compatibility', label: 'التوافق', Icon: HeartHandshake },
    { id: 'journal', label: 'السجل', Icon: BookMarked },
  ];

  return (
    <div className="min-h-dvh flex flex-col text-[#F8FAFC]">
      {/* Desktop & Mobile Top Header (3-Zone Top Bar Contract on Desktop) */}
      <header className="border-b border-white/8 bg-[#0B090C]/75 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single-element Brand Wordmark */}
          <button
            type="button"
            onClick={() => setActiveTab('daily')}
            className="text-lg sm:text-xl font-bold tracking-tight text-white whitespace-nowrap shrink-0 flex items-center gap-2.5"
          >
            <Compass className="w-5 h-5 text-[#FB7185]" />
            <span>أبراج اليوم</span>
          </button>

          {/* Zone 2: 4 Clean Single-Line Nav Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-7" aria-label="التنقل الرئيسي">
            {navItems.map((item) => {
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`py-2 text-sm font-medium transition-colors whitespace-nowrap shrink-0 border-b-2 ${
                    active
                      ? 'text-[#FDE68A] border-[#E11D48]'
                      : 'text-slate-400 border-transparent hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 Primary Contextual Action */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('natal')}
              className="px-4 py-2 rounded-full bg-[#1C141E] hover:bg-[#281A2B] border border-[#FB7185]/35 text-xs font-semibold text-[#F8FAFC] transition-colors whitespace-nowrap shrink-0 min-h-[40px]"
            >
              برجي: {getZodiacById(profile.sunSignId).arabicName}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-28 lg:pb-12">
        {activeTab === 'daily' && (
          <DailyHoroscopeView
            selectedSignId={selectedSignId}
            onSelectSign={setSelectedSignId}
            savedReadings={savedReadings}
            onToggleSaveReading={handleToggleSaveReading}
            userSunSignId={profile.sunSignId}
          />
        )}

        {activeTab === 'natal' && (
          <NatalChartView
            profile={profile}
            onSaveProfile={handleSaveProfile}
            onOpenSignInDaily={handleOpenSignInDaily}
          />
        )}

        {activeTab === 'compatibility' && (
          <CompatibilityView
            initialSignA={selectedSignId}
            userSunSignId={profile.sunSignId}
          />
        )}

        {activeTab === 'journal' && (
          <JournalView
            selectedSignId={selectedSignId}
            savedReadings={savedReadings}
            onRemoveSavedReading={(id) =>
              setSavedReadings((prev) => prev.filter((item) => item.id !== id))
            }
            onOpenSignInDaily={handleOpenSignInDaily}
            notes={notes}
            onAddNote={handleAddNote}
            onDeleteNote={handleDeleteNote}
          />
        )}
      </main>

      {/* Desktop Quiet Footer */}
      <footer className="hidden lg:block border-t border-white/8 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-8 flex items-center justify-between">
          <span>أبراج اليوم — المرصد الفلكي القرمزي</span>
          <span>حسابات فلكية لحظية لمدارات الشمس والقمر والكواكب</span>
        </div>
      </footer>

      {/* Mobile Floating Glass Bottom Tab Bar (under 15% sticky height cap) */}
      <nav
        className="lg:hidden fixed bottom-3 inset-x-3 z-40 rounded-full bg-[#120D14]/90 backdrop-blur-xl border border-white/12 shadow-[0_12px_32px_rgba(0,0,0,0.65)] px-2 py-1"
        aria-label="التنقل السفلي"
      >
        <div className="grid grid-cols-4 items-center">
          {navItems.map(({ id, label, Icon }) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setActiveTab(id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`flex flex-col items-center justify-center min-h-[48px] rounded-full transition-colors ${
                  active
                    ? 'text-[#FDE68A] bg-gradient-to-t from-[#E11D48]/25 to-transparent'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? 'text-[#FB7185]' : ''}`} />
                <span className="text-[10px] font-semibold mt-0.5 whitespace-nowrap">{label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Subtle Action Feedback Toast */}
      {toastMsg && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-20 lg:bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full bg-[#1E131D]/95 border border-[#FB7185]/45 text-xs font-semibold text-white shadow-xl backdrop-blur-md whitespace-nowrap"
        >
          {toastMsg}
        </div>
      )}
    </div>
  );
}
