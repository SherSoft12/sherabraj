import React, { useMemo, useState } from 'react';
import { BookOpen, Plus, Trash2 } from 'lucide-react';
import { getZodiacById, ZodiacId } from '../data/zodiacData';
import { calculateMoonPhase } from '../utils/astrologyEngine';
import { SavedReadingItem } from './DailyHoroscopeView';
import { ZodiacGlyph } from './ZodiacGlyph';

export interface JournalNote {
  id: string;
  title: string;
  body: string;
  moonPhase: string;
  signId: ZodiacId;
  createdAt: string;
}

interface JournalViewProps {
  selectedSignId: ZodiacId;
  savedReadings: SavedReadingItem[];
  onRemoveSavedReading: (id: string) => void;
  onOpenSignInDaily: (id: ZodiacId) => void;
  notes: JournalNote[];
  onAddNote: (note: JournalNote) => void;
  onDeleteNote: (id: string) => void;
}

export const JournalView: React.FC<JournalViewProps> = ({
  selectedSignId,
  savedReadings,
  onRemoveSavedReading,
  onOpenSignInDaily,
  notes,
  onAddNote,
  onDeleteNote,
}) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [activeSubTab, setActiveSubTab] = useState<'notes' | 'saved'>('notes');

  const todayMoon = useMemo(() => calculateMoonPhase(new Date()), []);
  const currentSign = useMemo(() => getZodiacById(selectedSignId), [selectedSignId]);

  const handleSubmitNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) return;

    const newNote: JournalNote = {
      id: `${Date.now()}`,
      title: title.trim() || `تأمل ${todayMoon.arabicPhaseName}`,
      body: body.trim(),
      moonPhase: todayMoon.arabicPhaseName,
      signId: selectedSignId,
      createdAt: new Intl.DateTimeFormat('ar-EG-u-nu-latn', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(new Date()),
    };
    onAddNote(newNote);
    setTitle('');
    setBody('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">السجل والمجلة الفلكية</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            دوّن نواياك اليومية مع أطوار القمر واحتفظ بالتوقعات الملهمة
          </p>
        </div>

        <div className="inline-flex items-center p-1 rounded-full bg-[#151016] border border-white/10">
          <button
            type="button"
            onClick={() => setActiveSubTab('notes')}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors min-h-[40px] whitespace-nowrap ${
              activeSubTab === 'notes' ? 'bg-[#E11D48] text-white' : 'text-slate-300 hover:text-white'
            }`}
          >
            التأملات ({notes.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('saved')}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors min-h-[40px] whitespace-nowrap ${
              activeSubTab === 'saved' ? 'bg-[#E11D48] text-white' : 'text-slate-300 hover:text-white'
            }`}
          >
            التوقعات المحفوظة ({savedReadings.length})
          </button>
        </div>
      </div>

      {activeSubTab === 'notes' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* New Reflection Form */}
          <form onSubmit={handleSubmitNote} className="lg:col-span-5 glass-slab rounded-3xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400 pb-3 border-b border-white/8">
              <span>الطور الحالي: {todayMoon.arabicPhaseName}</span>
              <span>برج {currentSign.arabicName}</span>
            </div>

            <div>
              <label htmlFor="note-title" className="block text-xs font-medium text-slate-300 mb-1.5">
                عنوان التدوينة (اختياري)
              </label>
              <input
                id="note-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="مثال: نية بداية الأسبوع"
                className="w-full bg-[#0B090C] border border-white/12 focus:border-[#FB7185] rounded-2xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none min-h-[44px]"
              />
            </div>

            <div>
              <label htmlFor="note-body" className="block text-xs font-medium text-slate-300 mb-1.5">
                ملاحظتك أو تأملك الفلكي
              </label>
              <textarea
                id="note-body"
                rows={4}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                required
                placeholder="ما الذي لاحظته في طاقتك أو قراراتك اليوم؟"
                className="w-full bg-[#0B090C] border border-white/12 focus:border-[#FB7185] rounded-2xl px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-5 rounded-full bg-[#E11D48] hover:bg-[#BE123C] text-white text-sm font-semibold transition-colors inline-flex items-center justify-center gap-2 min-h-[48px]"
            >
              <Plus className="w-4 h-4" />
              <span>حفظ في المجلة</span>
            </button>
          </form>

          {/* Reflections Feed */}
          <div className="lg:col-span-7 space-y-4">
            {notes.length === 0 ? (
              <div className="glass-slab rounded-3xl p-8 text-center space-y-2">
                <BookOpen className="w-8 h-8 text-slate-500 mx-auto" />
                <p className="text-sm font-semibold text-slate-200">المجلة فارغة حالياً</p>
                <p className="text-xs text-slate-400">
                  سجّل أول ملاحظة أو نية يومية لربطها بحركة القمر والأبراج.
                </p>
              </div>
            ) : (
              notes.map((note) => {
                const sign = getZodiacById(note.signId);
                return (
                  <article key={note.id} className="glass-slab rounded-3xl p-5 sm:p-6 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-base font-bold text-white">{note.title}</h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {note.createdAt} · {note.moonPhase} · برج {sign.arabicName}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => onDeleteNote(note.id)}
                        aria-label="حذف التدوينة"
                        className="min-w-[40px] min-h-[40px] rounded-full text-slate-400 hover:text-[#FB7185] hover:bg-white/5 flex items-center justify-center transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-sm leading-relaxed text-slate-200 whitespace-pre-line">
                      {note.body}
                    </p>
                  </article>
                );
              })
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {savedReadings.length === 0 ? (
            <div className="md:col-span-2 glass-slab rounded-3xl p-8 text-center space-y-2">
              <p className="text-sm font-semibold text-slate-200">لا توجد توقعات محفوظة بعد</p>
              <p className="text-xs text-slate-400">
                اضغط على أيقونة الحفظ في صفحة «اليوم» لإضافة أي توقع إلى أرشيفك.
              </p>
            </div>
          ) : (
            savedReadings.map((item) => (
              <article key={item.id} className="glass-slab rounded-3xl p-5 sm:p-6 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => onOpenSignInDaily(item.signId)}
                    className="flex items-center gap-3 text-right group"
                  >
                    <span className="w-10 h-10 rounded-2xl bg-[#E11D48]/15 border border-[#FB7185]/30 flex items-center justify-center text-[#FDE68A]">
                      <ZodiacGlyph signId={item.signId} className="w-5 h-5" />
                    </span>
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-[#FB7185] transition-colors">
                        برج {item.signName}
                      </h3>
                      <p className="text-xs text-slate-400">{item.arabicDateLabel}</p>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => onRemoveSavedReading(item.id)}
                    aria-label="إزالة من المحفوظات"
                    className="min-w-[40px] min-h-[40px] rounded-full text-slate-400 hover:text-[#FB7185] hover:bg-white/5 flex items-center justify-center transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm leading-relaxed text-slate-300">{item.overview}</p>
              </article>
            ))
          )}
        </div>
      )}
    </div>
  );
};
