import { motion, AnimatePresence } from 'motion/react';
import { DiaryEntry } from '../types';
import DiaryCard from './DiaryCard';
import { siteConfig } from '../config';

export default function DiaryList({ entries, onDelete, onUpdate, fontFamily }: { entries: DiaryEntry[], onDelete: (id: string) => void, onUpdate: (id: string, entry: DiaryEntry) => void, fontFamily: string }) {
  const labels = siteConfig.list;

  return (
    <section className="space-y-8 pt-8">
      <div className="flex items-center justify-between border-b border-stone-200/80 pb-5 px-2">
        <h2 className="text-2xl font-serif text-stone-800">{labels.title}</h2>
        <span className="text-sm font-medium text-stone-500 bg-stone-100/80 px-3 py-1 rounded-full border border-stone-200/50">
          {entries.length}
        </span>
      </div>

      {entries.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 text-stone-500 bg-stone-50 rounded-[24px] border border-dashed border-stone-300"
        >
          {labels.empty}
        </motion.div>
      ) : (
        <div className="space-y-8">
          <AnimatePresence mode="popLayout">
            {entries.map((entry) => (
              <DiaryCard key={entry.id} entry={entry} onDelete={onDelete} onUpdate={onUpdate} fontFamily={fontFamily} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </section>
  );
}
