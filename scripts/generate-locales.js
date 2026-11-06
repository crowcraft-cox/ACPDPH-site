const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '..', 'frontend', 'src', 'locales');
const frDir = path.join(localesDir, 'fr');
const enDir = path.join(localesDir, 'en');

fs.mkdirSync(frDir, { recursive: true });
fs.mkdirSync(enDir, { recursive: true });

// 1. common.json
const common = {
  fr: {
    readMore: "Lire plus",
    learnMore: "En savoir plus",
    viewDetails: "Voir les détails",
    back: "Retour",
    backToHome: "Retour à l'accueil",
    loading: "Chargement en cours...",
    close: "Fermer",
    copy: "Copier",
    copied: "Copié",
    all: "Tout",
    seeAll: "Tout afficher",
    share: "Partager",
    download: "Télécharger",
    downloadPdf: "Télécharger en PDF",
    status: {
      ongoing: "En cours",
      completed: "Achevé",
      planned: "En planification"
    },
    organizationName: "Agence Congolaise de Promotion des Droits des Personnes Handicapées",
    acronym: "ACPDPH",
    officialStatus: "Organisation Non Gouvernementale (ASBL)",
    currency: "USD",
    currencySymbol: "$",
    needReview: "Traduction automatique proposée, à relire avant de publier"
  },
  en: {
    readMore: "Read more",
    learnMore: "Learn more",
    viewDetails: "View details",
    back: "Back",
    backToHome: "Back to home",
    loading: "Loading...",
    close: "Close",
    copy: "Copy",
    copied: "Copied",
    all: "All",
    seeAll: "View all",
    share: "Share",
    download: "Download",
    downloadPdf: "Download PDF",
    status: {
      ongoing: "Ongoing",
      completed: "Completed",
      planned: "Planned"
    },
    organizationName: "Congolese Agency for the Promotion of the Rights of Persons with Disabilities",
    acronym: "ACPDPH",
    officialStatus: "Non-Governmental Organization (NGO)",
    currency: "USD",
    currencySymbol: "$",
    needReview: "Suggested automatic translation, review before publishing"
  }
};

// 2. header.json
const header = {
  fr: {
    home: "Accueil",
    about: "Qui sommes-nous",
    governance: "Gouvernance",
    domains: "Domaines d'intervention",
    projects: "Nos projets",
    news: "Actualités",
    partners: "Nos partenaires",
    jobs: "Offres & Emplois",
    gallery: "Galeries",
    contact: "Contact",
    support: "Nous soutenir",
    donate: "Faire un don",
    organization: "Organisation",
    menu: "Menu",
    openMenu: "Ouvrir le menu de navigation",
    closeMenu: "Fermer le menu de navigation",
    switchLanguage: "Changer de langue",
    currentLanguage: "Langue actuelle : Français",
    highContrast: "Contraste élevé",
    skipToContent: "Aller au contenu principal"
  },
  en: {
    home: "Home",
    about: "About us",
    governance: "Governance",
    domains: "Intervention areas",
    projects: "Our projects",
    news: "News",
    partners: "Our partners",
    jobs: "Jobs & Opportunities",
    gallery: "Galleries",
    contact: "Contact",
    support: "Support us",
    donate: "Donate",
    organization: "Organization",
    menu: "Menu",
    openMenu: "Open navigation menu",
    closeMenu: "Close navigation menu",
    switchLanguage: "Change language",
    currentLanguage: "Current language: English",
    highContrast: "High contrast",
    skipToContent: "Skip to main content"
  }
};

// 3. footer.json
const footer = {
  fr: {
    description: "L'Agence Congolaise de Promotion des Droits des Personnes Handicapées (ACPDPH) œuvre pour la défense des droits, l'accessibilité universelle, l'éducation inclusive, la santé adaptée et l'autonomisation socio-économique en République Démocratique du Congo.",
    navigation: "Navigation",
    legal: "Documents & Légal",
    privacyPolicy: "Politique de confidentialité",
    termsOfService: "Mentions légales",
    statutes: "Statuts de l'ACPDPH",
    internalRegulations: "Règlement d'Ordre Intérieur",
    newsletterTitle: "Abonnez-vous à notre lettre d'information",
    newsletterSubtitle: "Recevez directement nos actualités, rapports de terrain et appels à solidarité.",
    newsletterPlaceholder: "Votre adresse courriel",
    newsletterSubmit: "S'abonner",
    newsletterSubscribed: "Inscrit",
    newsletterSuccess: "Merci, votre inscription est confirmée !",
    newsletterErrorEmail: "Veuillez saisir une adresse courriel valide.",
    newsletterErrorGeneric: "Une erreur est survenue lors de l'inscription.",
    headquarters: "Notre siège social",
    address: "Quartier KASANGA-PAÏDA, Commune de Ruwenzori, ville de Beni, Nord-Kivu, RDC.",
    followUs: "Suivez-nous",
    quickLinks: "Liens rapides",
    rightsReserved: "Tous droits réservés."
  },
  en: {
    description: "The Congolese Agency for the Promotion of the Rights of Persons with Disabilities (ACPDPH) works for rights advocacy, universal accessibility, inclusive education, healthcare and socio-economic empowerment across the Democratic Republic of Congo.",
    navigation: "Navigation",
    legal: "Documents & Legal",
    privacyPolicy: "Privacy policy",
    termsOfService: "Terms of service",
    statutes: "ACPDPH Statutes",
    internalRegulations: "Internal Regulations",
    newsletterTitle: "Subscribe to our newsletter",
    newsletterSubtitle: "Receive our latest news, field reports and advocacy updates directly.",
    newsletterPlaceholder: "Your email address",
    newsletterSubmit: "Subscribe",
    newsletterSubscribed: "Subscribed",
    newsletterSuccess: "Thank you, your subscription is confirmed!",
    newsletterErrorEmail: "Please enter a valid email address.",
    newsletterErrorGeneric: "An error occurred during subscription.",
    headquarters: "Our headquarters",
    address: "Quartier KASANGA-PAIDA, Commune de Ruwenzori, city of Beni, North Kivu, DRC.",
    followUs: "Follow us",
    quickLinks: "Quick links",
    rightsReserved: "All rights reserved."
  }
};

// 4. home.json
const home = {
  fr: {
    badge: "Agence Congolaise de Promotion des Droits des Personnes Handicapées - ACPDPH",
    heroTitle1: "Promouvoir les droits",
    heroTitle2: "des personnes handicapées",
    heroSubtitle: "L'ACPDPH œuvre pour la défense des droits, l'accessibilité universelle, l'éducation inclusive, la santé adaptée et l'autonomisation socio-économique en RDC.",
    heroCtaDonate: "Faire un don",
    heroCtaJoin: "Rejoindre l'ONG",
    heroCtaReport: "Signalement & Sauvegarde",
    carouselAriaLabel: "Carrousel de projets et actualités",
    previousSlide: "Diapositive précédente",
    nextSlide: "Diapositive suivante",
    pauseSlide: "Mettre en pause le défilement automatique",
    playSlide: "Reprendre le défilement automatique",
    slideTypeProject: "Projet",
    slideTypeNews: "Publication",
    impactTitle: "Notre impact sur le terrain",
    impactSubtitle: "Des avancées concrètes et mesurables pour l'inclusion des personnes handicapées en République Démocratique du Congo.",
    impactMetricPersons: "Personnes accompagnées",
    impactMetricSchools: "Écoles & Centres inclusifs",
    impactMetricAids: "Aides techniques remises",
    impactMetricSessions: "Plaidoyers & Formations",
    pillarsTitle: "Nos domaines d'intervention",
    pillarsSubtitle: "L'ACPDPH concentre son action autour de cinq axes stratégiques pour garantir l'épanouissement intégral, l'égalité des chances et la pleine participation citoyenne des personnes en situation de handicap.",
    valuesTitle: "Nos valeurs fondamentales",
    valuesSubtitle: "Cinq principes cardinaux guident l'ensemble de nos actions, de nos prises de position et de nos partenariats.",
    projectsTitle: "Nos projets",
    projectsSubtitle: "Découvrez nos réalisations concrètes et nos initiatives stratégiques menées sur le terrain en RDC pour l'inclusion des personnes handicapées.",
    projectsAll: "Tous les projets",
    newsTitle: "Actualités & Plaidoyers",
    newsSubtitle: "Suivez nos actions de terrain, nos ateliers de sensibilisation et les témoignages inspirants portés par nos membres.",
    newsAll: "Toutes les actualités",
    ctaTitle: "Ensemble pour une société inclusive sans discrimination",
    ctaSubtitle: "Votre engagement et vos contributions permettent de bâtir un environnement digne et accessible pour toutes et tous en RDC.",
    ctaDonate: "Faire un don",
    ctaJoin: "Nous rejoindre",
    regionTag: "Région Nord-Kivu",
    reportTag: "Rapport de terrain 2026",
    auditTag: "Audit annuel conforme"
  },
  en: {
    badge: "Congolese Agency for the Promotion of the Rights of Persons with Disabilities - ACPDPH",
    heroTitle1: "Promoting the rights",
    heroTitle2: "of persons with disabilities",
    heroSubtitle: "ACPDPH works for rights advocacy, universal accessibility, inclusive education, healthcare and socio-economic empowerment across the DRC.",
    heroCtaDonate: "Donate",
    heroCtaJoin: "Join the NGO",
    heroCtaReport: "Reporting & Safeguarding",
    carouselAriaLabel: "Carousel of featured projects and news",
    previousSlide: "Previous slide",
    nextSlide: "Next slide",
    pauseSlide: "Pause automatic slideshow",
    playSlide: "Resume automatic slideshow",
    slideTypeProject: "Project",
    slideTypeNews: "Publication",
    impactTitle: "Our impact on the ground",
    impactSubtitle: "Tangible and measurable progress for the inclusion of persons with disabilities in the Democratic Republic of Congo.",
    impactMetricPersons: "Persons supported",
    impactMetricSchools: "Inclusive schools & centres",
    impactMetricAids: "Assistive devices distributed",
    impactMetricSessions: "Advocacy & training sessions",
    pillarsTitle: "Our intervention areas",
    pillarsSubtitle: "ACPDPH concentrates its actions on five strategic pillars to guarantee the full development, equal opportunities, and civic participation of persons with disabilities.",
    valuesTitle: "Our core values",
    valuesSubtitle: "Five guiding principles direct all our interventions, advocacy positions, and community partnerships.",
    projectsTitle: "Our projects",
    projectsSubtitle: "Discover our concrete achievements and strategic initiatives conducted in the field across the DRC for the inclusion of persons with disabilities.",
    projectsAll: "All projects",
    newsTitle: "News & Advocacy",
    newsSubtitle: "Follow our field actions, community awareness workshops, and inspiring stories championed by our members.",
    newsAll: "All news",
    ctaTitle: "Together for an inclusive society without discrimination",
    ctaSubtitle: "Your commitment and support help build a dignified, accessible environment for everyone in the DRC.",
    ctaDonate: "Donate",
    ctaJoin: "Join us",
    regionTag: "North Kivu Region",
    reportTag: "2026 Field Report",
    auditTag: "Annual audit compliant"
  }
};

// 5. about.json
const about = {
  fr: {
    title: "Qui sommes-nous ?",
    subtitle: "Découvrez l'historique, le statut juridique, la vision, la mission et les principes fondateurs de l'Agence Congolaise de Promotion des Droits des Personnes Handicapées (ACPDPH).",
    historyTitle: "Historique",
    historyP1: "L'Agence Congolaise de Promotion des Droits des Personnes Handicapées (ACPDPH-ASBL) est une organisation non gouvernementale nationale, apolitique et sans but lucratif, créée le 3 décembre 2018 à Beni, dans la province du Nord-Kivu, en République démocratique du Congo (RDC). Elle est née de la volonté de promouvoir les droits humains, la dignité, l'inclusion sociale et l'autonomisation des personnes handicapées, face aux multiples formes de discrimination, de stigmatisation, de marginalisation et d'exclusion auxquelles elles sont confrontées dans la société.",
    historyP2: "La création de l'ACPDPH s'inscrit dans un contexte où de nombreuses personnes handicapées rencontrent encore des obstacles majeurs à l'accès à l'éducation, aux soins de santé, à l'emploi, aux activités économiques et aux services sociaux de base, aggravés par les préjugés, la précarité et les crises humanitaires affectant l'Est de la RDC.",
    historyP3: "L'initiative a été portée par Monsieur Emmanuel KAKULE SYAYUKUMBITA, acteur du développement communautaire dont le parcours a été marqué par un accident de circulation en 2014 ayant conduit à l'amputation de sa jambe. Cette épreuve a renforcé sa détermination inébranlable à s'engager pour ses pairs et à transformer l'expérience individuelle du handicap en force collective d'action et de plaidoyer.",
    historyP4: "Constituée conjointement par des personnes en situation de handicap et des personnes valides, hommes et femmes d'horizons divers, l'ACPDPH déploie une approche communautaire participative fondée sur les droits humains, l'accessibilité universelle et le développement inclusif.",
    visionTitle: "Notre vision",
    visionText: "Bâtir une société inclusive, équitable et solidaire, exempte de toute discrimination fondée sur le handicap, dans laquelle toutes les personnes handicapées jouissent pleinement de leurs droits fondamentaux, participent activement au développement communautaire et vivent dans la dignité, l'autonomie et le bien-être socio-économique.",
    missionTitle: "Notre mission",
    missionText: "Promouvoir et protéger les droits des personnes handicapées, lutter sans relâche contre toutes les formes de discrimination et favoriser leur inclusion intégrale, leur autonomisation et leur pleine participation citoyenne en vue de garantir leur dignité et leur épanouissement.",
    objectiveTitle: "Objectif social",
    objectiveText: "Combattre, par la sensibilisation, la formation et le plaidoyer, les perceptions négatives du handicap et promouvoir l'exercice effectif des droits humains à travers l'action humanitaire et le développement inclusif à base communautaire.",
    valuesTitle: "Nos valeurs cardinales",
    valuesList: [
      "Professionnalisme",
      "Solidarité",
      "Non-discrimination",
      "Respect de la dignité humaine",
      "Bien-être et épanouissement"
    ],
    documentsTitle: "Documents officiels & Publications",
    downloadStatutes: "Télécharger les Statuts officiels de l'ACPDPH (PDF)",
    downloadRoi: "Télécharger le Règlement d'Ordre Intérieur (PDF)",
    downloadReport: "Télécharger le dernier rapport d'activités certifié (PDF)"
  },
  en: {
    title: "About us",
    subtitle: "Discover the history, legal status, vision, mission, and foundational principles of the Congolese Agency for the Promotion of the Rights of Persons with Disabilities (ACPDPH).",
    historyTitle: "History",
    historyP1: "The Congolese Agency for the Promotion of the Rights of Persons with Disabilities (ACPDPH) is a national, non-political, and non-profit organization established on December 3, 2018, in Beni, North Kivu province, Democratic Republic of Congo (DRC). It emerged from the dedicated resolve to uphold human rights, dignity, social inclusion, and the empowerment of persons with disabilities in the face of widespread discrimination and systemic marginalization.",
    historyP2: "The foundation of ACPDPH responds to severe challenges where persons with disabilities face continuous hurdles in accessing inclusive schooling, healthcare, rehabilitation, decent employment, and fundamental civic rights, compounded by socio-cultural prejudices and humanitarian instability in eastern DRC.",
    historyP3: "The initiative was spearheaded by Mr. Emmanuel KAKULE SYAYUKUMBITA, a community development advocate whose life path was transformed following a traffic accident in 2014 resulting in the amputation of his leg. This lived experience deepened his commitment to turning hardship into a collective movement for inclusive rights.",
    historyP4: "Co-founded by persons with disabilities and non-disabled allies across diverse communities, ACPDPH implements a human-rights-based, community-driven approach fostering universal accessibility and self-reliance.",
    visionTitle: "Our vision",
    visionText: "To build an inclusive, equitable, and cohesive Congolese society free from disability-based discrimination, where all persons with disabilities fully exercise their fundamental human rights, participate actively in community development, and thrive with dignity and self-reliance.",
    missionTitle: "Our mission",
    missionText: "To promote and defend the rights of persons with disabilities, counter all forms of discrimination, and foster their holistic inclusion, empowerment, and civic participation to ensure long-term dignity and well-being.",
    objectiveTitle: "Social objective",
    objectiveText: "To dismantle stigma through persistent awareness, capacity-building, and advocacy, while advancing the human rights of persons with disabilities through humanitarian response and community-based inclusive development.",
    valuesTitle: "Our core values",
    valuesList: [
      "Professionalism",
      "Solidarity",
      "Non-discrimination",
      "Respect for human dignity",
      "Well-being and fulfillment"
    ],
    documentsTitle: "Official documents & Publications",
    downloadStatutes: "Download official ACPDPH Statutes (PDF)",
    downloadRoi: "Download Internal Regulations (PDF)",
    downloadReport: "Download latest certified activity report (PDF)"
  }
};

// 6. governance.json
const governance = {
  fr: {
    title: "Gouvernance",
    subtitle: "Découvrez les organes statutaires et les membres qui dirigent, supervisent et animent les actions de l'ACPDPH avec rigueur, transparence et dévouement.",
    generalAssembly: {
      title: "Assemblée Générale",
      p1: "L'Assemblée Générale est l'organe suprême et souverain de l'ACPDPH. Elle réunit les membres fondateurs et adhérents pour définir les grandes orientations stratégiques et institutionnelles de l'organisation.",
      p2: "Elle est chargée d'adopter les politiques globales, d'approuver les rapports d'activités et financiers annuels, d'élire les membres du Conseil d'administration et de délibérer sur toutes les questions fondamentales de l'organisation.",
      p3: "Elle se réunit en session ordinaire une fois par an et garantit une gouvernance démocratique, participative, transparente et inclusive."
    },
    board: {
      title: "Conseil d'administration",
      intro: "Le Conseil d'administration assure la mise en œuvre des décisions de l'Assemblée Générale et veille à l'orientation stratégique de l'organisation. Il est composé de cinq animateurs engagés pour faire avancer la mission et les objectifs de l'ACPDPH :",
      conclusion: "Par son leadership et son engagement soutenu, le Conseil d'administration accompagne l'ACPDPH dans la concrétisation de sa vision d'une société juste et accessible à tous."
    },
    audit: {
      title: "Commission de Contrôle",
      intro: "La Commission de Contrôle est un organe interne élu par l'Assemblée Générale. Elle veille à la régularité, à la conformité statutaire et à la saine gestion financière et matérielle de l'ACPDPH. Ses membres sont :"
    },
    secretariat: {
      title: "Secrétariat Exécutif",
      intro: "Le Secrétariat Exécutif constitue l'organe opérationnel chargé de la gestion quotidienne, de la coordination technique des projets et de la mise en œuvre des programmes sur le terrain. Les animateurs du Secrétariat Exécutif sont :"
    },
    viewCv: "Consulter la notice biographique",
    noMembers: "Aucun membre répertorié dans cette section.",
    executiveLeadership: "Direction Exécutive",
    roles: {
      boardPresident: "Initiateur et Président du Conseil d'administration",
      boardVicePresident: "Vice-Président du Conseil d'administration",
      boardSecretary: "Secrétaire du Conseil d'administration",
      boardTreasurer: "Trésorier du Conseil d'administration",
      boardAdvisor: "Conseiller du Conseil d'administration",
      auditPresident: "Présidente de la Commission de Contrôle",
      auditSecretary: "Secrétaire rapporteur",
      auditMember: "Membre contrôleur",
      nationalExecutiveSecretary: "Secrétaire exécutif national",
      programsDirector: "Directeur des programmes",
      accountant: "Comptable",
      cashier: "Caissière",
      logistician: "Logisticienne",
      communicationsOfficer: "Chargé de communication",
      signLanguageInterpreter: "Interprète en langue des signes",
      communityWorker: "Agent Communautaire"
    }
  },
  en: {
    title: "Governance",
    subtitle: "Discover the statutory bodies and leadership team that guide, supervise, and implement the actions of ACPDPH with transparency, integrity, and dedication.",
    generalAssembly: {
      title: "General Assembly",
      p1: "The General Assembly is the supreme and sovereign governing body of ACPDPH. It brings together founding and active members to set institutional directions and long-term strategic priorities.",
      p2: "It is responsible for approving strategic policies, adopting annual certified financial and narrative reports, electing members of the Board of Directors, and deciding on major organizational matters.",
      p3: "It convenes in ordinary session once a year and guarantees democratic, participatory, transparent, and inclusive governance."
    },
    board: {
      title: "Board of Directors",
      intro: "The Board of Directors oversees the execution of General Assembly resolutions and steers the organization's strategic vision. It is composed of five dedicated leaders driving the mission of ACPDPH:",
      conclusion: "Through proactive leadership, the Board of Directors accompanies ACPDPH toward the realization of an inclusive society where persons with disabilities enjoy full rights."
    },
    audit: {
      title: "Oversight Committee",
      intro: "The Oversight Committee is an internal supervisory body elected by the General Assembly. It ensures statutory compliance, accountability, and the sound financial and asset management of ACPDPH. Its members are:"
    },
    secretariat: {
      title: "Executive Secretariat",
      intro: "The Executive Secretariat is the operational arm responsible for day-to-day administration, technical project coordination, and the execution of field programs. The Executive Secretariat team includes:"
    },
    viewCv: "View biographical profile",
    noMembers: "No members listed in this section.",
    executiveLeadership: "Executive Leadership",
    roles: {
      boardPresident: "Initiator and President of the Board of Directors",
      boardVicePresident: "Vice-President of the Board of Directors",
      boardSecretary: "Secretary of the Board of Directors",
      boardTreasurer: "Treasurer of the Board of Directors",
      boardAdvisor: "Advisor of the Board of Directors",
      auditPresident: "Chairperson of the Oversight Committee",
      auditSecretary: "Reporting Secretary",
      auditMember: "Oversight Member",
      nationalExecutiveSecretary: "National Executive Secretary",
      programsDirector: "Director of Programs",
      accountant: "Accountant",
      cashier: "Cashier",
      logistician: "Logistician",
      communicationsOfficer: "Communications Officer",
      signLanguageInterpreter: "Sign Language Interpreter",
      communityWorker: "Community Worker"
    }
  }
};

// 7. domains.json
const domains = {
  fr: {
    title: "Nos domaines d'intervention",
    subtitle: "Cinq axes stratégiques d'intervention pour bâtir une inclusion pérenne, garantir l'égalité des chances et soutenir l'autonomie des personnes handicapées en RDC.",
    protection: {
      title: "Droits & Plaidoyer juridique",
      desc: "Promotion et défense active des droits fondamentaux des personnes handicapées, vulgarisation des lois nationales et traités internationaux, et lutte résolue contre toutes formes de discrimination et d'exclusion sociale.",
      points: [
        "Assistance et accompagnement juridique gratuit pour les personnes handicapées victimes d'abus.",
        "Plaidoyer institutionnel auprès des cours, tribunaux et autorités administratives pour l'application de la législation protectrice.",
        "Campagnes régulières de sensibilisation communautaire pour l'élimination des préjugés."
      ]
    },
    accessibility: {
      title: "Accessibilité universelle",
      desc: "Plaidoyer et réalisations concrètes pour l'accessibilité des infrastructures publiques, de la voirie urbaine, des moyens de transport et des outils de communication pour toutes les formes de handicap.",
      points: [
        "Audits d'accessibilité architecturale des écoles, centres hospitaliers et édifices administratifs.",
        "Installation et aménagement de rampes d'accès, portes élargies et sanitaires adaptés.",
        "Promotion de l'accessibilité numérique et des supports d'information adaptés."
      ]
    },
    education: {
      title: "Éducation inclusive & Formation",
      desc: "Intégration scolaire des enfants et jeunes en situation de handicap, formation continue des enseignants aux pédagogies adaptées et mise à disposition d'outils didactiques appropriés.",
      points: [
        "Scolarisation inclusive et octroi de bourses scolaires complètes pour enfants vulnérables.",
        "Formation des corps enseignants à la pédagogie différenciée et à l'accueil inclusif.",
        "Dotation de kits didactiques spécialisés (braille, supports visuels et manuels adaptés)."
      ]
    },
    health: {
      title: "Santé, Réadaptation & Aides à la mobilité",
      desc: "Accompagnement sanitaire, réadaptation physique et fonctionnelle, soutien psychosocial et fourniture d'aides techniques à la mobilité (béquilles, tricycles, fauteuils roulants, prothèses).",
      points: [
        "Distribution d'appareillages orthopédiques, tricycles manuels et fauteuils roulants adaptés.",
        "Séances régulières de rééducation motrice et accompagnement psychosocial individualisé.",
        "Orientation et prise en charge médicale spécialisée pour les cas complexes."
      ]
    },
    empowerment: {
      title: "Autonomisation socio-économique",
      desc: "Formations professionnelles aux métiers d'avenir, renforcement des capacités entrepreneuriales, appui aux activités génératrices de revenus et insertion socioprofessionnelle durable.",
      points: [
        "Ateliers de formation pratique aux métiers porteurs (couture, artisanat, cordonnerie, numérique).",
        "Octroi de kits de démarrage et micro-subventions pour activités génératrices de revenus.",
        "Accompagnement vers l'emploi et plaidoyer auprès des entreprises pour le recrutement inclusif."
      ]
    }
  },
  en: {
    title: "Our intervention areas",
    subtitle: "Five strategic pillars of intervention to foster sustainable inclusion, equal opportunities, and self-reliance for persons with disabilities across the DRC.",
    protection: {
      title: "Rights & Legal advocacy",
      desc: "Promoting and actively defending fundamental human rights, popularizing domestic legislation and international treaties, and combating discrimination and exclusion.",
      points: [
        "Free legal counsel and guidance for persons with disabilities facing rights violations.",
        "Institutional advocacy targeting municipal authorities and legal bodies for policy enforcement.",
        "Community awareness campaigns to eradicate disability-related prejudice and stigma."
      ]
    },
    accessibility: {
      title: "Universal accessibility",
      desc: "Advocacy and concrete interventions for physical accessibility across public buildings, roads, public transit, and inclusive communication channels.",
      points: [
        "Architectural accessibility audits of partner schools, clinics, and municipal facilities.",
        "Installation and renovation of access ramps, widened entryways, and adapted restrooms.",
        "Promoting digital accessibility and adapted communication materials for all disabilities."
      ]
    },
    education: {
      title: "Inclusive education & Training",
      desc: "School enrollment of children and youth with disabilities, educator training in inclusive pedagogy, and distribution of tailored learning materials.",
      points: [
        "Inclusive enrollment and educational scholarships for vulnerable children with disabilities.",
        "Teacher training in differentiated learning methodologies and inclusive classroom management.",
        "Provision of specialized didactic materials (Braille, tactile supplies, and adapted textbooks)."
      ]
    },
    health: {
      title: "Health, Rehabilitation & Mobility aids",
      desc: "Healthcare support, physical and functional rehabilitation, psychosocial accompaniment, and provision of assistive devices and mobility aids.",
      points: [
        "Distribution of orthopedic devices, hand-pedaled tricycles, crutches, and adapted wheelchairs.",
        "Regular physical therapy sessions and personalized psychosocial counseling.",
        "Medical referral pathways for specialized clinical treatments and rehabilitation care."
      ]
    },
    empowerment: {
      title: "Socio-economic empowerment",
      desc: "Vocational skills training, entrepreneurship coaching, support for income-generating activities, and long-term socio-professional integration.",
      points: [
        "Practical vocational workshops in viable trades (tailoring, crafts, shoe repair, digital skills).",
        "Starter toolkits and seed micro-grants for autonomous income-generating activities.",
        "Career mentoring and private-sector advocacy for inclusive recruitment practices."
      ]
    }
  }
};

// 8. projects.json
const projects = {
  fr: {
    title: "Nos projets",
    subtitle: "Découvrez nos réalisations et nos projets en cours pour la promotion, l'inclusion et la protection des personnes vivant avec handicap en République Démocratique du Congo.",
    filterAll: "Tous les projets",
    filterOngoing: "En cours",
    filterCompleted: "Achevés",
    filterPlanned: "En planification",
    noProjects: "Aucun projet ne correspond aux critères sélectionnés.",
    aboutProject: "À propos du projet",
    projectDetails: "Fiche descriptive du projet",
    location: "Zone d'intervention :",
    type: "Axe stratégique :",
    status: "État d'avancement :",
    date: "Date de lancement :",
    gallery: "Galerie photos du projet",
    backToProjects: "Retour à la liste des projets",
    contactAboutProject: "Nous contacter à propos de ce projet",
    annualReports: "Rapports & Publications",
    reportsSubtitle: "La transparence et la redevabilité guident l'ensemble de nos actions. Consultez nos rapports institutionnels et d'activités.",
    downloadReport: "Consulter le rapport",
    shareProject: "Partager ce projet"
  },
  en: {
    title: "Our projects",
    subtitle: "Discover our achievements and ongoing initiatives dedicated to rights promotion, inclusion, and protection of persons with disabilities in the DRC.",
    filterAll: "All projects",
    filterOngoing: "Ongoing",
    filterCompleted: "Completed",
    filterPlanned: "Planned",
    noProjects: "No projects match the selected criteria.",
    aboutProject: "About the project",
    projectDetails: "Project specifications",
    location: "Intervention area:",
    type: "Strategic pillar:",
    status: "Status:",
    date: "Launch date:",
    gallery: "Project photo gallery",
    backToProjects: "Back to projects list",
    contactAboutProject: "Contact us about this project",
    annualReports: "Reports & Publications",
    reportsSubtitle: "Transparency and accountability guide all our endeavors. Access our institutional and activity reports.",
    downloadReport: "View report",
    shareProject: "Share this project"
  }
};

// 9. news.json
const news = {
  fr: {
    title: "Actualités & Plaidoyers",
    subtitle: "Suivez nos actions de terrain, nos prises de parole officielles, nos remises d'équipements et la vie de notre organisation.",
    filterAll: "Toutes les catégories",
    noArticles: "Aucune actualité disponible pour le moment.",
    publishedOn: "Publié le",
    category: "Catégorie",
    readArticle: "Lire l'article complet",
    backToNews: "Retour aux actualités",
    recentNews: "Actualités récentes",
    shareArticle: "Partager cet article",
    relatedProjects: "Projets associés"
  },
  en: {
    title: "News & Advocacy",
    subtitle: "Stay informed about our field operations, policy advocacy, equipment handovers, and ongoing initiatives.",
    filterAll: "All categories",
    noArticles: "No news articles available at the moment.",
    publishedOn: "Published on",
    category: "Category",
    readArticle: "Read full article",
    backToNews: "Back to news",
    recentNews: "Recent news",
    shareArticle: "Share this article",
    relatedProjects: "Associated projects"
  }
};

// 10. partners.json
const partners = {
  fr: {
    title: "Nos partenaires",
    subtitle: "Institutions publiques, organisations internationales, bailleurs de fonds et associations alliées unis à nos côtés pour l'inclusion en RDC.",
    institutionalTitle: "Partenaires institutionnels & Ministères",
    internationalTitle: "Organisations internationales & Bailleurs",
    localTitle: "Réseaux locaux & Société civile",
    becomePartnerTitle: "Devenir partenaire",
    becomePartnerSubtitle: "Vous partagez notre engagement pour l'égalité des droits et l'inclusion ? Rejoignez notre réseau d'action en RDC.",
    contactUs: "Initier un partenariat"
  },
  en: {
    title: "Our partners",
    subtitle: "Public institutions, international agencies, donors, and civil society allies standing alongside us for inclusion across the DRC.",
    institutionalTitle: "Institutional partners & Ministries",
    internationalTitle: "International organizations & Donors",
    localTitle: "Local networks & Civil society",
    becomePartnerTitle: "Become a partner",
    becomePartnerSubtitle: "Do you share our commitment to equal rights and universal inclusion? Join our partner coalition in the DRC.",
    contactUs: "Initiate partnership"
  }
};

// 11. jobs.json
const jobs = {
  fr: {
    title: "Offres & Emplois",
    subtitle: "Rejoignez une équipe engagée sur le terrain. Découvrez nos opportunités d'emploi, stages professionnels et missions de volontariat inclusif.",
    noJobs: "Aucune offre n'est ouverte actuellement. N'hésitez pas à nous transmettre une candidature spontanée.",
    location: "Lieu d'affectation :",
    contract: "Type de contrat :",
    deadline: "Date limite de candidature :",
    noDeadline: "Candidatures ouvertes en continu",
    publishedAt: "Offre publiée le",
    viewOffer: "Voir l'offre détaillée",
    applyNow: "Postuler maintenant",
    backToJobs: "Retour aux offres d'emploi",
    jobNotFound: "Cette offre d'emploi n'est plus disponible ou a été clôturée.",
    missionsTitle: "Missions et responsabilités principales",
    profileTitle: "Profil recherché et compétences requises",
    dossierTitle: "Composition du dossier de candidature",
    equalOpportunityNotice: "L'ACPDPH garantit l'égalité des chances. La candidature des personnes en situation de handicap et des femmes est vivement encouragée.",
    applicationFormTitle: "Formulaire de candidature",
    applicationFormSubtitle: "Remplissez attentivement les informations ci-dessous pour soumettre votre dossier.",
    personalInfoSection: "Informations personnelles",
    educationSection: "Formation et éducation",
    experienceSection: "Expériences professionnelles",
    languagesSection: "Compétences linguistiques",
    disabilitySection: "Inclusion et accessibilité",
    documentsSection: "Pièces justificatives",
    cvFile: "Curriculum Vitae (PDF ou DOCX)",
    coverLetterFile: "Lettre de motivation (PDF ou DOCX)",
    certificatesFile: "Diplômes et attestations (facultatif, PDF)",
    disabilityQuestion: "Êtes-vous une personne en situation de handicap ?",
    disabilityYes: "Oui",
    disabilityNo: "Non",
    disabilityPreferNotToSay: "Préfère ne pas répondre",
    accommodationsNeeded: "Aménagements ou adaptations souhaités lors du processus de sélection :",
    submitApplication: "Envoyer ma candidature",
    submitting: "Transmission du dossier...",
    applicationSuccessTitle: "Candidature enregistrée avec succès !",
    applicationSuccessSubtitle: "Nous accusons bonne réception de votre dossier de candidature. Un accusé de réception vous a été adressé par courriel.",
    applicationReference: "Numéro de référence de votre dossier :",
    backToCareers: "Retour aux offres",
    addExperience: "Ajouter une expérience",
    removeExperience: "Supprimer cette expérience",
    addLanguage: "Ajouter une langue",
    removeLanguage: "Supprimer cette langue",
    jobTitleApplied: "Poste candidaté :"
  },
  en: {
    title: "Jobs & Opportunities",
    subtitle: "Join a dedicated team on the ground. Explore our employment openings, professional internships, and inclusive volunteer positions.",
    noJobs: "No openings are currently available. Feel free to submit an unsolicited application.",
    location: "Location:",
    contract: "Contract type:",
    deadline: "Application deadline:",
    noDeadline: "Open on a rolling basis",
    publishedAt: "Published on",
    viewOffer: "View job description",
    applyNow: "Apply now",
    backToJobs: "Back to openings",
    jobNotFound: "This job opportunity is no longer available or has expired.",
    missionsTitle: "Main duties and responsibilities",
    profileTitle: "Required profile and qualifications",
    dossierTitle: "Application documents required",
    equalOpportunityNotice: "ACPDPH ensures equal opportunity employment. Applications from persons with disabilities and women are strongly encouraged.",
    applicationFormTitle: "Job application form",
    applicationFormSubtitle: "Please complete the form below to submit your application.",
    personalInfoSection: "Personal information",
    educationSection: "Education and academic background",
    experienceSection: "Professional experience",
    languagesSection: "Language proficiencies",
    disabilitySection: "Inclusion and accessibility",
    documentsSection: "Supporting documents",
    cvFile: "Curriculum Vitae (PDF or DOCX)",
    coverLetterFile: "Cover letter (PDF or DOCX)",
    certificatesFile: "Diplomas and certificates (optional, PDF)",
    disabilityQuestion: "Are you a person with a disability?",
    disabilityYes: "Yes",
    disabilityNo: "No",
    disabilityPreferNotToSay: "Prefer not to disclose",
    accommodationsNeeded: "Requested accommodations or accessibility support during the hiring process:",
    submitApplication: "Submit application",
    submitting: "Submitting application...",
    applicationSuccessTitle: "Application submitted successfully!",
    applicationSuccessSubtitle: "We have received your application file. A formal acknowledgment receipt has been sent to your email address.",
    applicationReference: "Application reference number:",
    backToCareers: "Back to jobs",
    addExperience: "Add experience",
    removeExperience: "Remove experience",
    addLanguage: "Add language",
    removeLanguage: "Remove language",
    jobTitleApplied: "Applied position:"
  }
};

// 12. gallery.json
const gallery = {
  fr: {
    title: "Notre Galerie",
    subtitle: "Revivez en images les moments forts de nos actions pour l'inclusion et les droits des personnes vivant avec handicap en RDC.",
    filterAll: "Tout",
    filterPhotos: "Photos",
    filterVideos: "Vidéos",
    loadMore: "Charger plus",
    noItems: "Aucun média disponible dans cette section.",
    closeLightbox: "Fermer la vue agrandie",
    prevItem: "Élément précédent",
    nextItem: "Élément suivant",
    videoPlayer: "Lecteur vidéo",
    youtubePlayer: "Vidéo YouTube"
  },
  en: {
    title: "Our Gallery",
    subtitle: "Explore highlights of our field missions, advocacy actions, and community events promoting disability rights in the DRC.",
    filterAll: "All",
    filterPhotos: "Photos",
    filterVideos: "Videos",
    loadMore: "Load more",
    noItems: "No media available in this section.",
    closeLightbox: "Close enlarged view",
    prevItem: "Previous item",
    nextItem: "Next item",
    videoPlayer: "Video player",
    youtubePlayer: "YouTube video"
  }
};

// 13. contact.json
const contact = {
  fr: {
    title: "Contactez-nous",
    subtitle: "Notre équipe est à votre écoute au siège social de Beni pour toute question, collaboration ou besoin d'accompagnement.",
    addressTitle: "Adresse & Siège Social",
    addressValue: "Quartier KASANGA-PAÏDA, Commune de Ruwenzori, ville de Beni, Nord-Kivu, RDC.",
    emailTitle: "Courriel officiel",
    phoneTitle: "Téléphone & Mobile Money",
    whatsappTitle: "Assistance WhatsApp",
    formTitle: "Envoyez-nous un message",
    formName: "Nom complet",
    formEmail: "Adresse courriel",
    formPhone: "Numéro de téléphone",
    formSubject: "Objet du message",
    formMessage: "Votre message",
    formSend: "Envoyer le message",
    sending: "Envoi en cours...",
    successMessage: "Merci ! Votre message a été transmis avec succès. Notre équipe vous répondra dans les meilleurs délais.",
    errorMessage: "Une erreur est survenue lors de l'envoi de votre message. Veuillez réessayer ou nous joindre directement par téléphone.",
    officeHours: "Heures d'ouverture des bureaux",
    officeHoursValue: "Du Lundi au Vendredi, de 08h00 à 16h30 (Heure locale de Beni, UTC+2)"
  },
  en: {
    title: "Contact us",
    subtitle: "Our team welcomes your inquiries, collaboration proposals, and assistance requests at our headquarters in Beni.",
    addressTitle: "Headquarters Address",
    addressValue: "Quartier KASANGA-PAIDA, Commune de Ruwenzori, city of Beni, North Kivu, DRC.",
    emailTitle: "Official email",
    phoneTitle: "Telephone & Mobile Money",
    whatsappTitle: "WhatsApp assistance",
    formTitle: "Send us a message",
    formName: "Full name",
    formEmail: "Email address",
    formPhone: "Phone number",
    formSubject: "Subject",
    formMessage: "Your message",
    formSend: "Send message",
    sending: "Sending...",
    successMessage: "Thank you! Your message was sent successfully. Our team will get back to you as soon as possible.",
    errorMessage: "An error occurred while transmitting your message. Please try again or reach us directly by telephone.",
    officeHours: "Office operating hours",
    officeHoursValue: "Monday to Friday, 08:00 AM to 04:30 PM (Local Beni time, UTC+2)"
  }
};

// 14. support.json
const support = {
  fr: {
    title: "Chaque enfant a le droit d'apprendre, de grandir et d'être inclus",
    heroDescription: "Avec l'ACPDPH, vous aidez les personnes handicapées du Nord-Kivu à accéder à l'éducation, aux soins et à l'autonomie.",
    heroCta: "Faire un don",
    heroImageAlt: "Enfant assis sur une chaise dans une salle de classe, soutenu par l'ACPDPH",
    step1Title: "1. Choisissez votre modalité de soutien",
    step2Title: "2. Choisissez votre moyen de paiement",
    step3Title: "3. Confirmation de votre don",
    frequencyMonthly: "Don mensuel",
    frequencySingle: "Don ponctuel",
    chooseAmount: "Montant du don :",
    customAmountPlaceholder: "Autre montant ($)",
    minAmountError: "Le montant minimum est de 5 $.",
    donorInfoTitle: "Coordonnées du donateur",
    firstName: "Prénom",
    lastName: "Nom",
    email: "Adresse courriel",
    phone: "Téléphone",
    newsletterOptIn: "Je souhaite recevoir la lettre d'information et les rapports de l'ACPDPH.",
    nextStep: "Continuer vers le règlement",
    previousStep: "Modifier le montant",
    confirmDonation: "Confirmer mon intention de don",
    paymentMethods: {
      mobileMoney: "Mobile Money",
      mobileMoneyDesc: "Paiement direct et instantané via réseau mobile congolais.",
      bankTransfer: "Virement bancaire",
      bankTransferDesc: "Virement international ou interbancaire en USD vers notre compte officiel.",
      card: "Carte bancaire",
      cardComingSoon: "Bientôt disponible"
    },
    mobileMoneyInstructions: "Envoyez {{amount}} au numéro Mobile Money de l'ACPDPH : {{phone}}. Indiquez votre nom en référence.",
    bankTransferInstructions: "Effectuez votre virement vers notre compte officiel ci-dessous. Indiquez votre nom en motif du virement.",
    bankInfoSectionTitle: "Nos informations bancaires",
    bankNameLabel: "Nom de la banque",
    accountNameLabel: "Intitulé du compte",
    bankAddressLabel: "Adresse de la banque",
    accountNumberLabel: "Numéro de compte",
    swiftLabel: "SWIFT",
    currencyLabel: "Devise du compte",
    mobileMoneyLineLabel: "Mobile Money",
    callNumber: "Appeler",
    whatSupportEnablesTitle: "Votre soutien permet concrètement :",
    supportPoint1: "De financer des tricycles adaptés, béquilles et prothèses orthopédiques pour la mobilité autonome.",
    supportPoint2: "D'assurer la scolarisation complète d'enfants handicapés avec matériel didactique spécialisé.",
    supportPoint3: "D'offrir une assistance juridique gratuite et des ateliers de réadaptation fonctionnelle.",
    supportPoint4: "De doter des artisans handicapés de kits de démarrage pour leurs activités économiques.",
    successTitle: "Merci pour votre généreuse solidarité !",
    successSubtitle: "Votre engagement auprès de l'ACPDPH fait une différence directe dans le quotidien des personnes handicapées au Nord-Kivu.",
    summaryReference: "Référence de votre don :",
    summaryAmount: "Montant :",
    summaryFrequency: "Fréquence :",
    summaryPaymentMethod: "Moyen de règlement choisi :",
    emailSentNotice: "Un récapitulatif complet vous a été transmis par courriel.",
    backToHomeBtn: "Retour à l'accueil",
    faqTitle: "Foire aux questions sur les dons",
    faq1Question: "Comment mes contributions sont-elles utilisées ?",
    faq1Answer: "Toutes les contributions sont allouées en priorité aux actions directes de terrain : acquisition d'équipements de mobilité, bourses scolaires inclusives, consultations de kinésithérapie et kits d'autonomisation.",
    faq2Question: "Les virements bancaires internationaux sont-ils acceptés ?",
    faq2Answer: "Oui, notre compte bancaire auprès d'EQUITY BCDC est configuré pour recevoir des virements internationaux en devise USD via le code SWIFT BCDCCDKI.",
    faq3Question: "Vais-je recevoir une preuve ou un reçu ?",
    faq3Answer: "Dès réception de votre don, notre secrétariat exécutif vous délivre un reçu officiel numéroté attestant de votre contribution solidaire."
  },
  en: {
    title: "Every child has the right to learn, grow, and be included",
    heroDescription: "With ACPDPH, you empower persons with disabilities in North Kivu to access inclusive education, healthcare, and self-reliance.",
    heroCta: "Donate",
    heroImageAlt: "Child seated on a classroom chair, supported by ACPDPH",
    step1Title: "1. Choose your support option",
    step2Title: "2. Choose your payment method",
    step3Title: "3. Confirm your donation",
    frequencyMonthly: "Monthly donation",
    frequencySingle: "One-time donation",
    chooseAmount: "Donation amount:",
    customAmountPlaceholder: "Other amount ($)",
    minAmountError: "The minimum amount is $5.",
    donorInfoTitle: "Donor information",
    firstName: "First name",
    lastName: "Last name",
    email: "Email address",
    phone: "Phone number",
    newsletterOptIn: "I want to receive the ACPDPH newsletter and field impact reports.",
    nextStep: "Proceed to payment",
    previousStep: "Edit amount",
    confirmDonation: "Confirm donation pledge",
    paymentMethods: {
      mobileMoney: "Mobile Money",
      mobileMoneyDesc: "Instant local mobile payment through Congolese telecom networks.",
      bankTransfer: "Bank transfer",
      bankTransferDesc: "International or interbank transfer in USD to our official bank account.",
      card: "Credit / Debit Card",
      cardComingSoon: "Coming soon"
    },
    mobileMoneyInstructions: "Send {{amount}} to the ACPDPH Mobile Money number: {{phone}}. Please include your name in the payment reference.",
    bankTransferInstructions: "Please execute your transfer using our official banking details below. State your name in the transfer purpose/memo.",
    bankInfoSectionTitle: "Our banking information",
    bankNameLabel: "Bank name",
    accountNameLabel: "Account name",
    bankAddressLabel: "Bank branch address",
    accountNumberLabel: "Account number",
    swiftLabel: "SWIFT",
    currencyLabel: "Account currency",
    mobileMoneyLineLabel: "Mobile Money",
    callNumber: "Call",
    whatSupportEnablesTitle: "Your support enables directly:",
    supportPoint1: "Funding adapted tricycles, crutches, and orthopedic prostheses for independent mobility.",
    supportPoint2: "Securing full schooling enrollment and specialized learning supplies for children with disabilities.",
    supportPoint3: "Providing free legal assistance, rights advocacy, and physical rehabilitation therapies.",
    supportPoint4: "Equipping vocational artisans with starter toolkits to launch sustainable income-generating activities.",
    successTitle: "Thank you for your generous solidarity!",
    successSubtitle: "Your commitment alongside ACPDPH creates immediate, life-changing progress for persons with disabilities in North Kivu.",
    summaryReference: "Donation reference number:",
    summaryAmount: "Amount:",
    summaryFrequency: "Frequency:",
    summaryPaymentMethod: "Selected payment method:",
    emailSentNotice: "A comprehensive donation summary has been forwarded to your email address.",
    backToHomeBtn: "Return to home",
    faqTitle: "Frequently Asked Questions about donations",
    faq1Question: "How are my contributions allocated?",
    faq1Answer: "All contributions are prioritized toward direct field programs: procuring mobility devices, inclusive schooling sponsorships, physical therapy sessions, and economic empowerment toolkits.",
    faq2Question: "Are international wire transfers supported?",
    faq2Answer: "Yes, our official bank account with EQUITY BCDC is configured to receive international wire transfers in USD using SWIFT code BCDCCDKI.",
    faq3Question: "Will I receive a formal receipt?",
    faq3Answer: "Upon confirmation of your contribution, our executive secretariat issues an official numbered receipt documenting your solidarity contribution."
  }
};

// 15. forms.json
const forms = {
  fr: {
    fullName: "Nom complet",
    firstName: "Prénom",
    lastName: "Nom de famille",
    postName: "Post-nom",
    email: "Adresse courriel",
    phone: "Numéro de téléphone",
    address: "Adresse de résidence",
    city: "Ville",
    province: "Province",
    country: "Pays",
    birthDate: "Date de naissance",
    gender: "Genre",
    genderMale: "Homme",
    genderFemale: "Femme",
    educationLevel: "Niveau d'études",
    subject: "Objet",
    message: "Message",
    requiredField: "Ce champ est obligatoire",
    invalidEmail: "Veuillez entrer une adresse courriel valide",
    invalidPhone: "Veuillez entrer un numéro de téléphone valide",
    submit: "Envoyer",
    save: "Enregistrer",
    cancel: "Annuler",
    delete: "Supprimer",
    edit: "Modifier",
    search: "Rechercher...",
    chooseFile: "Choisir un fichier",
    noFileChosen: "Aucun fichier sélectionné",
    fileSizeNotice: "Taille maximale acceptée : 10 Mo par document.",
    tabs: {
      french: "Français",
      english: "English",
      autoTranslate: "Traduire automatiquement en anglais",
      translating: "Traduction en cours...",
      translationNotice: "Traduction automatique proposée, à relire avant de publier."
    }
  },
  en: {
    fullName: "Full name",
    firstName: "First name",
    lastName: "Last name",
    postName: "Middle / Post-name",
    email: "Email address",
    phone: "Phone number",
    address: "Residential address",
    city: "City",
    province: "Province",
    country: "Country",
    birthDate: "Date of birth",
    gender: "Gender",
    genderMale: "Male",
    genderFemale: "Female",
    educationLevel: "Education level",
    subject: "Subject",
    message: "Message",
    requiredField: "This field is required",
    invalidEmail: "Please enter a valid email address",
    invalidPhone: "Please enter a valid phone number",
    submit: "Submit",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    search: "Search...",
    chooseFile: "Choose file",
    noFileChosen: "No file chosen",
    fileSizeNotice: "Maximum accepted file size: 10 MB per document.",
    tabs: {
      french: "Français",
      english: "English",
      autoTranslate: "Auto-translate to English",
      translating: "Translating...",
      translationNotice: "Suggested automatic translation, review before publishing."
    }
  }
};

// 16. errors.json
const errors = {
  fr: {
    pageNotFoundTitle: "Page introuvable (Erreur 404)",
    pageNotFoundDesc: "La page que vous recherchez n'existe pas, a été déplacée ou son adresse a changé.",
    serverErrorTitle: "Une erreur est survenue",
    serverErrorDesc: "Notre serveur a rencontré une difficulté momentanée. Veuillez rafraîchir la page ou réessayer dans quelques instants.",
    backHome: "Retourner à la page d'accueil",
    contactSupport: "Contacter l'équipe technique"
  },
  en: {
    pageNotFoundTitle: "Page not found (Error 404)",
    pageNotFoundDesc: "The page you are looking for does not exist, has been relocated, or its URL has changed.",
    serverErrorTitle: "An error occurred",
    serverErrorDesc: "Our server encountered a momentary issue. Please refresh the page or try again in a few moments.",
    backHome: "Return to homepage",
    contactSupport: "Contact technical team"
  }
};

const namespaces = {
  common,
  header,
  footer,
  home,
  about,
  governance,
  domains,
  projects,
  news,
  partners,
  jobs,
  gallery,
  contact,
  support,
  forms,
  errors
};

let countFr = 0;
let countEn = 0;

for (const [ns, content] of Object.entries(namespaces)) {
  const frPath = path.join(frDir, `${ns}.json`);
  const enPath = path.join(enDir, `${ns}.json`);
  
  fs.writeFileSync(frPath, JSON.stringify(content.fr, null, 2), 'utf8');
  fs.writeFileSync(enPath, JSON.stringify(content.en, null, 2), 'utf8');
  
  const countKeys = (obj) => {
    let count = 0;
    for (const k in obj) {
      if (typeof obj[k] === 'object' && !Array.isArray(obj[k])) {
        count += countKeys(obj[k]);
      } else {
        count++;
      }
    }
    return count;
  };
  
  countFr += countKeys(content.fr);
  countEn += countKeys(content.en);
  console.log(`Generated namespace [${ns}]: ${countKeys(content.fr)} keys in FR, ${countKeys(content.en)} keys in EN`);
}

console.log(`Total keys generated: ${countFr} FR, ${countEn} EN. Parity: ${countFr === countEn ? 'PERFECT MATCH' : 'MISMATCH'}`);

