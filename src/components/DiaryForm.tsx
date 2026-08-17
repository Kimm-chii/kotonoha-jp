import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DiaryEntry } from '../types';
import { siteConfig } from '../config';

export default function DiaryForm({ onSave, fontFamily }: { onSave: (e: DiaryEntry) => void, fontFamily: string }) {
  const [japaneseText, setJapaneseText] = useState('');
  const [englishText, setEnglishText] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  
  const labels = siteConfig.form;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!japaneseText.trim()) return;

    const newEntry: DiaryEntry = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      japaneseText: japaneseText.trim(),
      englishText: englishText.trim() || undefined,
      createdAt: Date.now(),
    };

    onSave(newEntry);
    setJapaneseText('');
    setEnglishText('');
    setIsFocused(false);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="bg-white rounded-[24px] p-6 md:p-10 shadow-sm border border-stone-200/70"
    >
      <h2 className="text-xl font-medium mb-8 text-stone-800">{labels.title}</h2>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-3">
          <label htmlFor="japanese" className="block text-xs font-medium text-stone-500 tracking-wide uppercase">
            {labels.japaneseLabel}
          </label>
          <textarea
            id="japanese"
            value={japaneseText}
            onChange={(e) => setJapaneseText(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder={labels.japanesePlaceholder}
            style={{ fontFamily }}
            className="w-full min-h-[140px] p-5 bg-stone-50 border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-stone-300 focus:border-stone-300 transition-all resize-y text-lg leading-relaxed text-stone-800 placeholder:text-stone-400"
            required
          />
          <p className="text-sm text-stone-500 mt-2">{labels.hint}</p>
        </div>

        <AnimatePresence>
          {isFocused && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 32 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              className="space-y-3 overflow-hidden"
            >
              <label htmlFor="english" className="block text-xs font-medium text-stone-500 tracking-wide uppercase">
                {labels.englishLabel}
              </label>
              <textarea
                id="english"
                value={englishText}
                onChange={(e) => setEnglishText(e.target.value)}
                placeholder={labels.englishPlaceholder}
                className="w-full min-h-[100px] p-5 bg-stone-50 border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-stone-300 focus:border-stone-300 transition-all resize-y text-[15px] text-stone-600 leading-relaxed placeholder:text-stone-400"
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={!japaneseText.trim()}
            className="px-8 py-3.5 bg-stone-800 hover:bg-stone-700 disabled:bg-stone-200 disabled:text-stone-400 disabled:cursor-not-allowed text-stone-50 rounded-xl font-medium transition-colors shadow-sm"
          >
            {labels.submitButton}
          </button>
        </div>
      </form>
    </motion.section>
  );
}
