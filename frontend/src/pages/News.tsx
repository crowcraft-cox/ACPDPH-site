import { Link } from 'react-router-dom';
import { useI18n } from '../i18n';
import { useScrollReveal, useAnimeReveal } from '../hooks/useScrollReveal';
import { useAdminData } from '../context/adminData';

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
        className="container-ba text-center mb-16"
      >
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-ba-blue/10 text-ba-blue mb-3">
          Actualités & Communiqués
        </span>
        <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">{t.news.title}</h1>
        <p className="text-ba-text-secondary text-lg max-w-3xl mx-auto leading-relaxed">
          {t.news.subtitle}
        </p>
      </div>

      <div className="container-ba">
        <div ref={cardsContainerRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => {
            const photoCount = article.images ? article.images.length : article.image ? 1 : 0;

            return (
              <article 
                key={article.id} 
                className="news-article-card group flex flex-col justify-between card card-cover card-interactive"
              >
                <div>
                  {/* Cover Photo */}
                  <div className="relative h-56 w-full overflow-hidden">
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
                  <div className="p-6 pb-2" style={{ background: '#ffffff' }}>
                    <div className="card-row mb-3">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-ba-blue text-white shadow-xs">
                        {article.category}
                      </span>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                        </svg>
                        <span>{article.date}</span>
                      </span>
                    </div>

                    <Link to={`/news/${article.id}`}>
                      <h3 className="font-heading font-bold text-xl mb-3 group-hover:text-ba-blue transition-colors line-clamp-2 leading-snug" style={{ color: '#111827' }}>
                        {article.title}
                      </h3>
                    </Link>

                    <p className="text-sm mb-4 line-clamp-3 leading-relaxed break-words" style={{ color: '#6B7280' }}>
                      {article.excerpt}
                    </p>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="p-6 pt-0 mt-auto" style={{ background: '#ffffff' }}>
                  <div className="card-footer pt-4">
                    <Link
                      to={`/news/${article.id}`}
                      className="w-full inline-flex items-center justify-between px-4 py-2.5 rounded-xl bg-ba-blue/10 hover:bg-ba-blue hover:text-white text-ba-blue font-semibold text-sm transition-colors group/btn"
                    >
                      <span>{t.news.read_more}</span>
                      <svg className="w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
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
