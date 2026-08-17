import { DiaryEntry } from './types';

// Central place for all client-editable text content and site configuration
export const siteConfig = {
  header: {
    title: "Kotonoha",
    subtitle: "言の葉",
    description: "A minimalist diary for your Japanese studies. Write daily to build your vocabulary.",
  },
  form: {
    title: "New Entry",
    japaneseLabel: "Japanese Text (日本語)",
    japanesePlaceholder: "今日の出来事を書いてみましょう... (Let's write about today's events...)",
    englishLabel: "English Translation / Remarks / Notes (Optional)",
    englishPlaceholder: "Write your English translation or notes here...",
    submitButton: "Save Entry",
    hint: "💡 Tip: Wrap words in brackets to mark them for later review (e.g. [漢字])."
  },
  list: {
    title: "Your Entries",
    empty: "No entries found. Start your Japanese study journey today.",
  }
};

// Initial data to populate if the user hasn't created any entries yet
export const initialEntries: DiaryEntry[] = [
  {
    id: "1",
    date: new Date().toISOString(),
    japaneseText: "今日はとてもいい[天気]ですね。\n近くの公園を[散歩]して、新しいカフェを見つけました。\n抹茶ラテが[美味しかった]です。",
    englishText: "The weather is really nice today.\nI took a walk in the nearby park and found a new cafe.\nThe matcha latte was delicious.",
    createdAt: Date.now()
  }
];

export const fontOptions = [
  { id: 'serif', name: 'Noto Serif (明朝)', family: '"Noto Serif JP", serif' },
  { id: 'sans', name: 'Noto Sans (ゴシック)', family: '"Noto Sans JP", sans-serif' },
  { id: 'rounded', name: 'M PLUS Rounded (丸ゴシック)', family: '"M PLUS Rounded 1c", sans-serif' },
  { id: 'handwriting', name: 'Klee One (手書き風)', family: '"Klee One", cursive' },
];
