import { Globe } from 'lucide-react';
import { useLangStore } from '../store/langStore';
import { translations } from '../i18n/translations';

export default function LanguageSwitch() {
  const { lang, toggleLang } = useLangStore();
  const t = translations[lang].home;

  return (
    <button
      onClick={toggleLang}
      className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-700 text-sm font-bold text-zinc-400 hover:text-zinc-100 hover:border-zinc-500 transition-all active:scale-95 font-mono tracking-widest"
      aria-label="Switch language"
    >
      <Globe className="w-4 h-4" />
      <span>{t.langSwitch}</span>
    </button>
  );
}