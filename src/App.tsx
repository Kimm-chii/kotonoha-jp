import { useState, useEffect } from 'react';
import { DiaryEntry } from './types';
import { initialEntries, fontOptions } from './config';
import Header from './components/Header';
import DiaryForm from './components/DiaryForm';
import DiaryList from './components/DiaryList';
import DiaryControls from './components/DiaryControls';

export default function App() {
  const [entries, setEntries] = useState<DiaryEntry[]>(() => {
    try {
      const saved = localStorage.getItem('kotonoha_entries');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.length > 0 ? parsed : initialEntries;
      }
    } catch (e) {
      console.error("Failed to load entries", e);
    }
    return initialEntries;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [fontId, setFontId] = useState(() => localStorage.getItem('kotonoha_font') || 'serif');

  useEffect(() => {
    localStorage.setItem('kotonoha_entries', JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    localStorage.setItem('kotonoha_font', fontId);
  }, [fontId]);

  const addEntry = (entry: DiaryEntry) => setEntries(prev => [entry, ...prev]);
  const deleteEntry = (id: string) => setEntries(prev => prev.filter(e => e.id !== id));
  const updateEntry = (id: string, updated: DiaryEntry) => setEntries(prev => prev.map(e => e.id === id ? updated : e));

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ entries }, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `kotonoha-backup-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        
        let importedEntries: DiaryEntry[] = [];

        // Handle both old array format and new object format
        if (Array.isArray(parsed)) {
          importedEntries = parsed;
        } else if (parsed.entries) {
          importedEntries = parsed.entries;
        }

        if (importedEntries.length > 0) {
          setEntries(prev => {
            const existingIds = new Set(prev.map(p => p.id));
            const newEntries = importedEntries.filter(p => !existingIds.has(p.id));
            return [...newEntries, ...prev].sort((a, b) => b.createdAt - a.createdAt);
          });
          alert(`Import successful! Added ${importedEntries.length} entries.`);
        } else {
          alert("Invalid backup file structure.");
        }
      } catch (err) {
        alert("Failed to parse the backup file.");
      }
    };
    reader.readAsText(file);
    e.target.value = ''; 
  };

  const filteredEntries = entries.filter(e => 
    e.japaneseText.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (e.englishText && e.englishText.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const activeFontFamily = fontOptions.find(f => f.id === fontId)?.family || fontOptions[0].family;

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-stone-800 font-sans relative selection:bg-stone-200">
      <div className="absolute top-0 left-0 w-full h-[40vh] bg-gradient-to-b from-stone-100 to-[#FAF9F6] -z-10" />
      
      <Header />
      
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-6 pb-24 space-y-12">
        <DiaryForm onSave={addEntry} fontFamily={activeFontFamily} />
        
        <div className="space-y-4">
          <DiaryControls 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            fontId={fontId}
            setFontId={setFontId}
            onExport={handleExport}
            onImport={handleImport}
          />
          <DiaryList entries={filteredEntries} onDelete={deleteEntry} onUpdate={updateEntry} fontFamily={activeFontFamily} />
        </div>
      </main>
    </div>
  );
}
