import { Search, Download, Upload, Type } from 'lucide-react';
import { useRef } from 'react';
import { fontOptions } from '../config';

interface DiaryControlsProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  fontId: string;
  setFontId: (id: string) => void;
  onExport: () => void;
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function DiaryControls({
  searchQuery,
  setSearchQuery,
  fontId,
  setFontId,
  onExport,
  onImport
}: DiaryControlsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 md:px-6 rounded-[20px] shadow-sm border border-stone-200/70 mb-8">
      {/* Search */}
      <div className="relative w-full md:w-auto flex-1 max-w-sm">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search entries..."
          className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-300 transition-shadow text-[15px]"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 w-full md:w-auto items-center justify-between md:justify-end">
        <div className="relative flex-1 md:flex-none">
          <Type className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
          <select
            value={fontId}
            onChange={e => setFontId(e.target.value)}
            className="appearance-none pl-10 pr-10 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-300 text-sm font-medium text-stone-600 w-full cursor-pointer hover:bg-stone-100 transition-colors"
          >
            {fontOptions.map(f => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </select>
          {/* Custom Dropdown Arrow */}
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg className="w-4 h-4 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onExport}
            title="Export Data (Backup)"
            className="p-2.5 text-stone-500 hover:text-stone-900 bg-stone-50 border border-stone-200 rounded-xl hover:bg-stone-100 transition-colors"
          >
            <Download className="w-4 h-4" />
          </button>
          <input
            type="file"
            accept=".json"
            className="hidden"
            ref={fileInputRef}
            onChange={onImport}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            title="Import Data (Restore)"
            className="p-2.5 text-stone-500 hover:text-stone-900 bg-stone-50 border border-stone-200 rounded-xl hover:bg-stone-100 transition-colors"
          >
            <Upload className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
