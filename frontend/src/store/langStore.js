import { create } from 'zustand';

const STORAGE_KEY = 'wcti-language';

function getStoredLang() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'zh' || stored === 'en') return stored;
  } catch {
    // ignore
  }
  return 'zh';
}

export const useLangStore = create((set) => ({
  lang: getStoredLang(),
  setLang: (lang) => {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // ignore
    }
    set({ lang });
  },
  toggleLang: () => {
    set((state) => {
      const newLang = state.lang === 'zh' ? 'en' : 'zh';
      try {
        localStorage.setItem(STORAGE_KEY, newLang);
      } catch {
        // ignore
      }
      return { lang: newLang };
    });
  }
}));
