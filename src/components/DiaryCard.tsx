import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, Calendar, Check, X } from 'lucide-react';
import { DiaryEntry } from '../types';

export default function DiaryCard({ entry, onDelete, onUpdate, fontFamily }: { entry: DiaryEntry, onDelete: (id: string) => void, onUpdate: (id: string, entry: DiaryEntry) => void, fontFamily: string }) {
  const [isEditingDate, setIsEditingDate] = useState(false);
  const [editDate, setEditDate] = useState('');

  const openDatePicker = () => {
    const d = new Date(entry.date);
    setEditDate(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`);
    setIsEditingDate(true);
  };

  const handleSaveDate = () => {
    if (!editDate) return;
    const [year, month, day] = editDate.split('-').map(Number);
    const updatedDate = new Date(entry.date);
    updatedDate.setFullYear(year, month - 1, day);
    
    onUpdate(entry.id, { ...entry, date: updatedDate.toISOString() });
    setIsEditingDate(false);
  };

  const formattedDate = new Date(entry.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Function to highlight known vocabulary words using simple inline syntax [word]
  const renderHighlightedText = (text: string) => {
    // Regex to match anything inside brackets [word]
    const regex = /(\[[^\]]+\])/g;
    const parts = text.split(regex);

    return parts.map((part, i) => {
      if (part.startsWith('[') && part.endsWith(']')) {
        const word = part.slice(1, -1);
        
        return (
          <span key={i} className="inline-block px-1 mx-0.5 rounded bg-stone-100 text-stone-900 border border-stone-200/80 font-medium">
            {word}
          </span>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="group relative bg-white p-8 md:p-10 rounded-[24px] shadow-sm border border-stone-200/70 hover:shadow-md transition-all"
    >
      <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onDelete(entry.id)}
          className="p-2.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
          aria-label="Delete entry"
          title="Delete entry"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="mb-6">
        <button 
          onClick={openDatePicker}
          className="flex items-center gap-1.5 text-xs font-medium text-stone-400 tracking-[0.15em] uppercase hover:text-stone-600 transition-colors"
          title="Edit date"
        >
          <Calendar className="w-3.5 h-3.5" />
          {formattedDate}
        </button>

        <AnimatePresence>
          {isEditingDate && (
            <>
              {/* Backdrop */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="fixed inset-0 z-40 bg-stone-900/15 backdrop-blur-sm"
                onClick={() => setIsEditingDate(false)}
              />
              
              {/* Modal */}
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="bg-white p-6 rounded-[24px] shadow-2xl border border-stone-200/80 w-full max-w-[320px] pointer-events-auto"
                >
                  <h3 className="text-lg font-serif text-stone-800 mb-5 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-stone-400" />
                    Change Date
                  </h3>
                  
                  <div className="space-y-5">
                    <div>
                      <label className="block text-xs font-medium text-stone-500 mb-2 uppercase tracking-wide">
                        Select new date
                      </label>
                      <input
                        type="date"
                        value={editDate}
                        onChange={(e) => setEditDate(e.target.value)}
                        className="w-full text-stone-700 bg-stone-50 border border-stone-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-stone-300 transition-shadow font-medium cursor-pointer text-lg"
                      />
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button 
                        onClick={() => setIsEditingDate(false)}
                        className="flex-1 flex justify-center items-center gap-2 py-3 text-sm font-medium text-stone-600 hover:bg-stone-100 rounded-xl transition-colors"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                      <button 
                        onClick={handleSaveDate}
                        className="flex-1 flex justify-center items-center gap-2 py-3 text-sm font-medium text-stone-50 bg-stone-800 hover:bg-stone-700 rounded-xl transition-colors shadow-sm"
                      >
                        <Check className="w-4 h-4" />
                        Save
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>
      </div>

      <div className="space-y-6 relative">
        <div 
          style={{ fontFamily }}
          className="text-xl md:text-2xl leading-[2.2] text-stone-800 whitespace-pre-wrap"
        >
          {renderHighlightedText(entry.japaneseText)}
        </div>

        {entry.englishText && (
          <div className="pt-6 border-t border-stone-100">
            <p className="text-stone-500 leading-relaxed whitespace-pre-wrap text-[15px]">
              {entry.englishText}
            </p>
          </div>
        )}
      </div>
    </motion.article>
  );
}
