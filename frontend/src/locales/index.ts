import legacyFr from '../i18n/fr.json';
import legacyEn from '../i18n/en.json';

import commonFr from './fr/common.json';
import headerFr from './fr/header.json';
import footerFr from './fr/footer.json';
import homeFr from './fr/home.json';
import aboutFr from './fr/about.json';
import governanceFr from './fr/governance.json';
import domainsFr from './fr/domains.json';
import projectsFr from './fr/projects.json';
import newsFr from './fr/news.json';
import partnersFr from './fr/partners.json';
import jobsFr from './fr/jobs.json';
import galleryFr from './fr/gallery.json';
import contactFr from './fr/contact.json';
import supportFr from './fr/support.json';
import formsFr from './fr/forms.json';
import errorsFr from './fr/errors.json';
import cvFr from './fr/cv.json';

import commonEn from './en/common.json';
import headerEn from './en/header.json';
import footerEn from './en/footer.json';
import homeEn from './en/home.json';
import aboutEn from './en/about.json';
import governanceEn from './en/governance.json';
import domainsEn from './en/domains.json';
import projectsEn from './en/projects.json';
import newsEn from './en/news.json';
import partnersEn from './en/partners.json';
import jobsEn from './en/jobs.json';
import galleryEn from './en/gallery.json';
import contactEn from './en/contact.json';
import supportEn from './en/support.json';
import formsEn from './en/forms.json';
import errorsEn from './en/errors.json';
import cvEn from './en/cv.json';

import commonIt from './it/common.json';
import headerIt from './it/header.json';
import footerIt from './it/footer.json';
import homeIt from './it/home.json';
import aboutIt from './it/about.json';
import governanceIt from './it/governance.json';
import domainsIt from './it/domains.json';
import projectsIt from './it/projects.json';
import newsIt from './it/news.json';
import partnersIt from './it/partners.json';
import jobsIt from './it/jobs.json';
import galleryIt from './it/gallery.json';
import contactIt from './it/contact.json';
import supportIt from './it/support.json';
import formsIt from './it/forms.json';
import errorsIt from './it/errors.json';
import cvIt from './it/cv.json';

import commonDe from './de/common.json';
import headerDe from './de/header.json';
import footerDe from './de/footer.json';
import homeDe from './de/home.json';
import aboutDe from './de/about.json';
import governanceDe from './de/governance.json';
import domainsDe from './de/domains.json';
import projectsDe from './de/projects.json';
import newsDe from './de/news.json';
import partnersDe from './de/partners.json';
import jobsDe from './de/jobs.json';
import galleryDe from './de/gallery.json';
import contactDe from './de/contact.json';
import supportDe from './de/support.json';
import formsDe from './de/forms.json';
import errorsDe from './de/errors.json';
import cvDe from './de/cv.json';

export const localesFr = {
  ...legacyFr,
  common: commonFr,
  header: headerFr,
  footer: {
    ...legacyFr.footer,
    ...footerFr,
  },
  home: {
    ...legacyFr.home,
    ...homeFr,
  },
  about: {
    ...legacyFr.about,
    ...aboutFr,
  },
  governance: {
    ...legacyFr.governance,
    ...governanceFr,
  },
  domains: domainsFr,
  projects: {
    ...legacyFr.projects,
    ...projectsFr,
  },
  news: {
    ...legacyFr.news,
    ...newsFr,
  },
  partners: {
    ...legacyFr.partners,
    ...partnersFr,
  },
  jobs: {
    ...legacyFr.careers,
    ...jobsFr,
  },
  gallery: {
    ...legacyFr.gallery,
    ...galleryFr,
  },
  contact: {
    ...legacyFr.contact,
    ...contactFr,
  },
  support: {
    ...legacyFr.act,
    ...supportFr,
  },
  forms: formsFr,
  errors: errorsFr,
  cv: cvFr,
};

export const localesEn = {
  ...legacyEn,
  common: commonEn,
  header: headerEn,
  footer: {
    ...legacyEn.footer,
    ...footerEn,
  },
  home: {
    ...legacyEn.home,
    ...homeEn,
  },
  about: {
    ...legacyEn.about,
    ...aboutEn,
  },
  governance: {
    ...legacyEn.governance,
    ...governanceEn,
  },
  domains: domainsEn,
  projects: {
    ...legacyEn.projects,
    ...projectsEn,
  },
  news: {
    ...legacyEn.news,
    ...newsEn,
  },
  partners: {
    ...legacyEn.partners,
    ...partnersEn,
  },
  jobs: {
    ...legacyEn.careers,
    ...jobsEn,
  },
  gallery: {
    ...legacyEn.gallery,
    ...galleryEn,
  },
  contact: {
    ...legacyEn.contact,
    ...contactEn,
  },
  support: {
    ...legacyEn.act,
    ...supportEn,
  },
  forms: formsEn,
  errors: errorsEn,
  cv: cvEn,
};

export const localesIt = {
  ...legacyEn,
  nav: {
    home: headerIt.home,
    about: headerIt.about,
    governance: headerIt.governance,
    pillars: headerIt.domains,
    projects: headerIt.projects,
    news: headerIt.news,
    partners: headerIt.partners,
    careers: headerIt.jobs,
    support: headerIt.support,
    contact: headerIt.contact,
    donate: headerIt.donate,
    language: 'IT',
    gallery: headerIt.gallery,
  },
  hero: {
    badge: homeIt.badge,
    title1: homeIt.heroTitle1,
    title2: homeIt.heroTitle2,
    subtitle: homeIt.heroSubtitle,
    cta_donate: homeIt.heroCtaDonate,
    cta_join: homeIt.heroCtaJoin,
    cta_report: homeIt.heroCtaReport,
  },
  impact: {
    title: homeIt.impactTitle,
    subtitle: homeIt.impactSubtitle,
    children: homeIt.impactMetricPersons,
    schools: homeIt.impactMetricSchools,
    trees: homeIt.impactMetricAids,
    sessions: homeIt.impactMetricSessions,
  },
  pillars: {
    ...legacyEn.pillars,
    title: domainsIt.title,
    subtitle: domainsIt.subtitle,
    learn_more: 'Scopri di più',
    protection: domainsIt.protection,
    health: domainsIt.health,
    education: domainsIt.education,
  },
  cta: {
    title: homeIt.ctaTitle,
    subtitle: homeIt.ctaSubtitle,
    donate: homeIt.ctaDonate,
    join: homeIt.ctaJoin,
  },
  common: commonIt,
  header: headerIt,
  footer: {
    ...legacyEn.footer,
    ...footerIt,
  },
  home: {
    ...legacyEn.home,
    ...homeIt,
  },
  about: {
    ...legacyEn.about,
    ...aboutIt,
  },
  governance: {
    ...legacyEn.governance,
    ...governanceIt,
  },
  domains: domainsIt,
  projects: {
    ...legacyEn.projects,
    ...projectsIt,
  },
  news: {
    ...legacyEn.news,
    ...newsIt,
  },
  partners: {
    ...legacyEn.partners,
    ...partnersIt,
  },
  jobs: {
    ...legacyEn.careers,
    ...jobsIt,
  },
  gallery: {
    ...legacyEn.gallery,
    ...galleryIt,
  },
  contact: {
    ...legacyEn.contact,
    ...contactIt,
  },
  support: {
    ...legacyEn.act,
    ...supportIt,
  },
  forms: formsIt,
  errors: errorsIt,
  cv: cvIt,
};

export const localesDe = {
  ...legacyEn,
  nav: {
    home: headerDe.home,
    about: headerDe.about,
    governance: headerDe.governance,
    pillars: headerDe.domains,
    projects: headerDe.projects,
    news: headerDe.news,
    partners: headerDe.partners,
    careers: headerDe.jobs,
    support: headerDe.support,
    contact: headerDe.contact,
    donate: headerDe.donate,
    language: 'DE',
    gallery: headerDe.gallery,
  },
  hero: {
    badge: homeDe.badge,
    title1: homeDe.heroTitle1,
    title2: homeDe.heroTitle2,
    subtitle: homeDe.heroSubtitle,
    cta_donate: homeDe.heroCtaDonate,
    cta_join: homeDe.heroCtaJoin,
    cta_report: homeDe.heroCtaReport,
  },
  impact: {
    title: homeDe.impactTitle,
    subtitle: homeDe.impactSubtitle,
    children: homeDe.impactMetricPersons,
    schools: homeDe.impactMetricSchools,
    trees: homeDe.impactMetricAids,
    sessions: homeDe.impactMetricSessions,
  },
  pillars: {
    ...legacyEn.pillars,
    title: domainsDe.title,
    subtitle: domainsDe.subtitle,
    learn_more: 'Mehr erfahren',
    protection: domainsDe.protection,
    health: domainsDe.health,
    education: domainsDe.education,
  },
  cta: {
    title: homeDe.ctaTitle,
    subtitle: homeDe.ctaSubtitle,
    donate: homeDe.ctaDonate,
    join: homeDe.ctaJoin,
  },
  common: commonDe,
  header: headerDe,
  footer: {
    ...legacyEn.footer,
    ...footerDe,
  },
  home: {
    ...legacyEn.home,
    ...homeDe,
  },
  about: {
    ...legacyEn.about,
    ...aboutDe,
  },
  governance: {
    ...legacyEn.governance,
    ...governanceDe,
  },
  domains: domainsDe,
  projects: {
    ...legacyEn.projects,
    ...projectsDe,
  },
  news: {
    ...legacyEn.news,
    ...newsDe,
  },
  partners: {
    ...legacyEn.partners,
    ...partnersDe,
  },
  jobs: {
    ...legacyEn.careers,
    ...jobsDe,
  },
  gallery: {
    ...legacyEn.gallery,
    ...galleryDe,
  },
  contact: {
    ...legacyEn.contact,
    ...contactDe,
  },
  support: {
    ...legacyEn.act,
    ...supportDe,
  },
  forms: formsDe,
  errors: errorsDe,
  cv: cvDe,
};

export type LocaleTranslations = typeof localesFr;
