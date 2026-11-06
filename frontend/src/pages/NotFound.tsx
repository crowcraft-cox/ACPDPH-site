import { Link } from 'react-router-dom';
import { useI18n } from '../i18n';

export default function NotFound() {
  const { lang, getLocalizedPath } = useI18n();

  return (
    <div className="pt-32 pb-24 min-h-[70vh] flex items-center justify-center bg-slate-50 dark:bg-ba-dark px-4">
      <div className="max-w-lg w-full text-center bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-8 sm:p-12 shadow-sm">
        <span className="font-heading font-black text-6xl sm:text-7xl text-[#2350D9] dark:text-blue-400 block mb-4">
          404
        </span>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white uppercase tracking-tight mb-3">
          {lang === 'en' ? 'Page not found' : lang === 'it' ? 'Pagina non trovata' : lang === 'de' ? 'Seite nicht gefunden' : 'Page non trouvée'}
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed mb-8">
          {lang === 'en'
            ? 'The page you are looking for does not exist or has been moved.'
            : lang === 'it'
            ? 'La pagina cercata non esiste o è stata spostata.'
            : lang === 'de'
            ? 'Die gesuchte Seite existiert nicht oder wurde verschoben.'
            : "La page que vous recherchez n'existe pas ou a été déplacée."}
        </p>
        <Link
          to={getLocalizedPath('/')}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#2350D9] hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          <span>{lang === 'en' ? 'Back to homepage' : lang === 'it' ? 'Torna alla home' : lang === 'de' ? 'Zurück zur Startseite' : "Retour à l'accueil"}</span>
        </Link>
      </div>
    </div>
  );
}

