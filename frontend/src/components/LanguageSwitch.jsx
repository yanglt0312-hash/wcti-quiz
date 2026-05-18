
import { Globe } from 'lucide-react';
import { useLangStore } from '../store/langStore';
import { translations } from '../i18n/translations';

export default function LanguageSwitch() {
  const { lang, toggleLang } = useLangStore();
  const t = translations[lang].home;

  return (
    <button
      onClick={toggleLang}
      className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2 bg-slate-900/80 backdrop-blur-md border border-slate-700 rounded-full text-sm font-bold text-slate-300 hover:text-white hover:border-slate-500 transition-all active:scale-95"
      aria-label="Switch language"
    >
      <Globe className="w-4 h-4" />
      <span>{t.langSwitch}</span>
    </button>
  );
}
