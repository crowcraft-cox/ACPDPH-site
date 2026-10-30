import { Link } from 'react-router-dom';
import { useI18n } from '../i18n';
import { useScrollReveal, useAnimeReveal } from '../hooks/useScrollReveal';
import { useAdminData } from '../context/adminData';
import { formatNewsDate } from '../utils/dateFormatter';

export default function News() {
  const { t } = useI18n();
  const { ref: headerRef } = useScrollReveal();
  const { ref: cardsContainerRef } = useAnimeReveal<HTMLDivElement>({
    variant: 'stagger-cards',
    itemSelector: '.news-article-card',
    staggerDelay: 80,
  });
  const { data } = useAdminData();

  const articles = data.news;

  return (
    <div className="pt-24 sm:pt-28 md:pt-32 pb-20">
      <div
        ref={headerRef}
        className="container-ba mb-8 text-center"
      >
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-ba-blue dark:text-blue-400 mb-4">
          {t.news.title}
        </h1>
        <p className="w-full text-left md:text-justify hyphens-auto text-ba-text-secondary text-lg leading-relaxed">
          {t.news.subtitle}
        </p>
      </div>

      <div className="container-ba">
        <div ref={cardsContainerRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => {
            const photoCount = article.images ? article.images.length : article.image ? 1 : 0;

            return (
              <article 
                key={article.id} 
                className="news-article-card group flex flex-col h-full bg-white border border-slate-200 rounded-2xl overflow-hidden"
              >
                {/* Cover Photo */}
                <div className="relative h-56 w-full overflow-hidden shrink-0 bg-slate-100">
                  {article.image ? (
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-blue-50 flex items-center justify-center">
                      <svg className="w-12 h-12 text-ba-blue/40" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
                      </svg>
                    </div>
                  )}

                  {photoCount > 1 && (
                    <div className="absolute bottom-3 right-3 bg-black/75 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-white flex items-center gap-1.5 border border-white/20">
                      <svg className="w-3.5 h-3.5 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                      </svg>
                      <span>{photoCount} photos</span>
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-5 flex flex-col flex-1">
                  {/* Date au-dessus du titre, alignée à gauche */}
                  <div className="flex items-center gap-1.5 text-sm font-bold text-black mb-2">
                    <svg className="w-4 h-4 text-black shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                    </svg>
                    <span>{formatNewsDate(article.date)}</span>
                  </div>

                  {/* Titre */}
                  <Link to={`/news/${article.id}`} className="block group/title">
                    <h3 className="font-heading font-bold text-lg sm:text-xl text-slate-900 group-hover/title:text-ba-blue transition-colors line-clamp-2 leading-snug mb-3">
                      {article.title}
                    </h3>
                  </Link>

                  {/* Description */}
                  <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed break-words flex-1">
                    {article.excerpt}
                  </p>

                  {/* Bouton LIRE PLUS */}
                  <div className="mt-4">
                    <Link
                      to={`/news/${article.id}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-xs sm:text-sm font-bold uppercase tracking-wider text-white bg-[#C2530A] hover:bg-[#A84508] transition-colors duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C2530A] focus-visible:ring-offset-2 group/btn"
                    >
                      <span>LIRE PLUS</span>
                      <svg
                        className="w-4 h-4 shrink-0 transition-transform duration-200 group-hover/btn:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-7-7 7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
