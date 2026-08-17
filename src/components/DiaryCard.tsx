import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, Calendar, Check, X, ChevronDown } from 'lucide-react';
import { DiaryEntry } from '../types';

const months = [
  { value: 1, label: 'January' }, { value: 2, label: 'February' },
  { value: 3, label: 'March' }, { value: 4, label: 'April' },
  { value: 5, label: 'May' }, { value: 6, label: 'June' },
  { value: 7, label: 'July' }, { value: 8, label: 'August' },
  { value: 9, label: 'September' }, { value: 10, label: 'October' },
  { value: 11, label: 'November' }, { value: 12, label: 'December' }
];

export default function DiaryCard({ entry, onDelete, onUpdate, fontFamily }: { entry: DiaryEntry, onDelete: (id: string) => void, onUpdate: (id: string, entry: DiaryEntry) => void, fontFamily: string }) {
  const [isEditingDate, setIsEditingDate] = useState(false);
  const [editYear, setEditYear] = useState<number>(new Date().getFullYear());
  const [editMonth, setEditMonth] = useState<number>(new Date().getMonth() + 1);
  const [editDay, setEditDay] = useState<number>(new Date().getDate());

  const openDatePicker = () => {
    const d = new Date(entry.date);
    setEditYear(d.getFullYear());
    setEditMonth(d.getMonth() + 1);
    setEditDay(d.getDate());
    setIsEditingDate(true);
  };

  const handleSaveDate = () => {
    const updatedDate = new Date(entry.date);
    const maxDay = new Date(editYear, editMonth, 0).getDate();
    const finalDay = editDay > maxDay ? maxDay : editDay;
    
    updatedDate.setFullYear(editYear, editMonth - 1, finalDay);
    
    onUpdate(entry.id, { ...entry, date: updatedDate.toISOString() });
    setIsEditingDate(false);
  };

  useEffect(() => {
    const maxDay = new Date(editYear, editMonth, 0).getDate();
    if (editDay > maxDay) setEditDay(maxDay);
  }, [editYear, editMonth]);

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
                  className="bg-white p-6 rounded-[24px] shadow-2xl border border-stone-200/80 w-full max-w-[380px] pointer-events-auto"
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
                      <div className="flex gap-2">
                        {/* Month Dropdown */}
                        <div className="relative flex-[2]">
                          <select 
                            value={editMonth} 
                            onChange={(e) => setEditMonth(Number(e.target.value))}
                            className="w-full appearance-none bg-stone-50 border border-stone-200 rounded-xl pl-3 pr-8 py-3 focus:outline-none focus:ring-2 focus:ring-stone-300 text-stone-700 font-medium cursor-pointer"
                          >
                            {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                          </select>
                          <ChevronDown className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                        
                        {/* Day Dropdown */}
                        <div className="relative flex-1">
                          <select 
                            value={editDay} 
                            onChange={(e) => setEditDay(Number(e.target.value))}
                            className="w-full appearance-none bg-stone-50 border border-stone-200 rounded-xl pl-3 pr-8 py-3 focus:outline-none focus:ring-2 focus:ring-stone-300 text-stone-700 font-medium cursor-pointer"
                          >
                            {Array.from({ length: new Date(editYear, editMonth, 0).getDate() }, (_, i) => i + 1).map(d => (
                              <option key={d} value={d}>{d}</option>
                            ))}
                          </select>
                          <ChevronDown className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>

                        {/* Year Dropdown */}
                        <div className="relative flex-[1.5]">
                          <select 
                            value={editYear} 
                            onChange={(e) => setEditYear(Number(e.target.value))}
                            className="w-full appearance-none bg-stone-50 border border-stone-200 rounded-xl pl-3 pr-8 py-3 focus:outline-none focus:ring-2 focus:ring-stone-300 text-stone-700 font-medium cursor-pointer"
                          >
                            {Array.from({ length: 20 }, (_, i) => new Date().getFullYear() - 10 + i).map(y => (
                              <option key={y} value={y}>{y}</option>
                            ))}
                          </select>
                          <ChevronDown className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </div>
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
