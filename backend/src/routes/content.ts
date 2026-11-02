import { Router, Request, Response } from 'express';
import SiteContent from '../models/SiteContent';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// Default data fallback if MongoDB database is empty
const DEFAULT_CONTENT = {
  key: 'main_site_content',
  impact: [
    { id: '1', value: 2500, label: 'Personnes accompagnées', label_en: 'Persons supported', color: 'ba-blue' },
    { id: '2', value: 45, label: 'Écoles et centres inclusifs', label_en: 'Inclusive schools & centers', color: 'ba-blue' },
    { id: '3', value: 1200, label: 'Aides techniques distribuées', label_en: 'Assistive devices distributed', color: 'ba-blue' },
    { id: '4', value: 350, label: 'Actions de plaidoyer menées', label_en: 'Advocacy actions led', color: 'ba-blue' },
  ],
  pillars: [
    {
      id: '1',
      title: 'Droits & Plaidoyer Juridique',
      title_en: 'Rights & Legal Advocacy',
      description: 'Défense active des droits fondamentaux des personnes en situation de handicap, lutte contre les discriminations et promotion de l\'application des lois et conventions protectrices.',
      description_en: 'Active defense of fundamental rights for persons with disabilities, fighting discrimination, and promoting protective legal frameworks.',
      image: '/pillars/protection.jpg',
      color: 'ba-blue',
      gradient: 'from-blue-600/15 to-blue-800/5',
      bulletPoints: [
        'Assistance juridique et écoute des victimes de violations de droits.',
        'Plaidoyer pour l\'application des lois nationales et internationales relatives au handicap.',
      ],
      bulletPoints_en: [
        'Legal aid and counseling for victims of rights violations.',
        'Advocacy for the enforcement of national and international disability laws.',
      ],
    },
    {
      id: '2',
      title: 'Accessibilité Universelle',
      title_en: 'Universal Accessibility',
      description: 'Promotion de l\'aménagement du cadre bâti, des voiries, des transports et de l\'information pour garantir la libre circulation et l\'autonomie de tous.',
      description_en: 'Advocating for accessible infrastructure, transportation, and public information to guarantee universal mobility.',
      image: '/pillars/formation.jpg',
      color: 'ba-blue',
      gradient: 'from-blue-600/15 to-blue-800/5',
      bulletPoints: [
        'Audit d\'accessibilité des bâtiments publics et des écoles.',
        'Sensibilisation des décideurs et ingénieurs aux normes d\'accessibilité.',
      ],
      bulletPoints_en: [
        'Accessibility audits for public buildings and educational facilities.',
        'Awareness campaigns targeting decision-makers and urban planners.',
      ],
    },
    {
      id: '3',
      title: 'Éducation Inclusive & Formation',
      title_en: 'Inclusive Education & Training',
      description: 'Facilitation de l\'accès à l\'école pour les enfants en situation de handicap et organisation de formations professionnelles adaptées vers l\'autonomie.',
      description_en: 'Facilitating school access for children with disabilities and delivering adapted vocational training toward independence.',
      image: '/pillars/sante.jpg',
      color: 'ba-blue',
      gradient: 'from-blue-600/15 to-blue-800/5',
      bulletPoints: [
        'Fourniture de kits scolaires et matériel didactique adapté.',
        'Formations aux métiers porteurs d\'avenir et à l\'entrepreneuriat.',
      ],
      bulletPoints_en: [
        'Provision of tailored school kits and didactic resources.',
        'Skills and entrepreneurship training for long-term self-reliance.',
      ],
    },
    {
      id: '4',
      title: 'Santé, Réadaptation & Aides',
      title_en: 'Health, Rehabilitation & Assistive Devices',
      description: 'Accompagnement sanitaire, soutien à la réadaptation fonctionnelle et distribution d\'appareillages et aides à la mobilité pour les personnes vulnérables.',
      description_en: 'Healthcare support, physical rehabilitation guidance, and provision of mobility and assistive equipment.',
      image: '/pillars/environnement.jpg',
      color: 'ba-blue',
      gradient: 'from-blue-600/15 to-blue-800/5',
      bulletPoints: [
        'Distribution de béquilles, tricycles et fauteuils roulants adaptés.',
        'Orientation vers les services médicaux et de réadaptation spécialisés.',
      ],
      bulletPoints_en: [
        'Distribution of crutches, tricycles, and appropriate wheelchairs.',
        'Referral pathways to specialized rehabilitation healthcare providers.',
      ],
    },
  ],
  news: [
    {
      id: '1',
      title: 'Plaidoyer pour l\'accessibilité des services publics à Beni',
      title_en: 'Advocacy for public service accessibility in Beni',
      excerpt: 'L\'ACPDPH a rencontré les autorités urbaines pour promouvoir l\'intégration des rampes et facilités d\'accès dans les édifices publics.',
      excerpt_en: 'ACPDPH met with municipal authorities to promote accessibility ramps and inclusive facilities in public buildings.',
      date: '15 Juil 2026',
      category: 'Accessibilité',
      category_en: 'Accessibility',
      color: 'ba-blue',
    },
    {
      id: '2',
      title: 'Remise d\'équipements de mobilité et kits scolaires adaptés',
      title_en: 'Handover of mobility devices and adapted school supplies',
      excerpt: 'L\'ACPDPH a doté des enfants et jeunes en situation de handicap d\'aides techniques et de matériel scolaire adapté pour la rentrée.',
      excerpt_en: 'ACPDPH equipped children and youth with disabilities with mobility aids and adapted school kits.',
      date: '02 Juin 2026',
      category: 'Inclusion',
      category_en: 'Inclusion',
      color: 'ba-blue',
    },
  ],
  projects: [
    {
      id: '1',
      title: 'Programme d\'Éducation Inclusive & Appui Didactique',
      title_en: 'Inclusive Education and Didactic Support Program',
      location: 'Beni, Nord-Kivu, RDC',
      type: 'Éducation',
      type_en: 'Education',
      status: 'En cours',
      status_en: 'Ongoing',
      description: 'Aménagement de salles inclusives, formation des enseignants aux pédagogies adaptées et appui aux enfants en situation de handicap pour une scolarité réussie.',
      description_en: 'Fitting inclusive classrooms, teacher training in adapted pedagogy, and dedicated learning support for students with disabilities.',
      color: 'bg-ba-blue',
      image: '/pillars/protection.jpg',
    },
    {
      id: '2',
      title: 'Projet d\'Appareillage & Réadaptation Fonctionnelle',
      title_en: 'Assistive Devices and Physical Rehabilitation Initiative',
      location: 'Grand Nord-Kivu (Beni - Butembo)',
      type: 'Santé & Mobilité',
      type_en: 'Health & Mobility',
      status: 'En cours',
      status_en: 'Ongoing',
      description: 'Distribution de béquilles, tricycles et fauteuils roulants avec séances de rééducation pour favoriser l\'indépendance motrice.',
      description_en: 'Distribution of crutches, wheelchairs, and tricycles with physical therapy sessions to foster physical independence.',
      color: 'bg-ba-blue',
      image: '/pillars/formation.jpg',
    },
    {
      id: '3',
      title: 'Ateliers d\'Autonomisation Économique et Métiers Adaptés',
      title_en: 'Economic Empowerment and Adapted Vocational Workshops',
      location: 'Commune de Mulekera, Beni',
      type: 'Autonomisation',
      type_en: 'Empowerment',
      status: 'Achevé',
      status_en: 'Completed',
      description: 'Formations professionnelles pratiques (artisanat, couture, numérique) suivies de kits de démarrage d\'activités génératrices de revenus.',
      description_en: 'Practical skills training (crafts, sewing, digital skills) accompanied by seed micro-grant startup kits.',
      color: 'bg-ba-blue',
      image: '/pillars/sante.jpg',
    },
  ],
  contact: {
    address: 'Quartier KASANGA-PAÏDA, Commune de Ruwenzori, ville de Beni, Nord-Kivu, RDC.',
    email: 'info.acpdph.asbl.rdc@gmail.com',
    phone: '+243 976 992 466',
    whatsapp: '+243 852 799 553',
  },
  jobs: [
    {
      id: 'j1',
      title: 'Chargé(e) de Plaidoyer Juridique & Droits Fondamentaux',
      location: 'Beni (Nord-Kivu, RDC)',
      contractType: 'CDD',
      contractPrecision: '12 mois',
      description: 'Conduire les actions de plaidoyer auprès des autorités locales, vulgariser la Loi organique n°22/003 et offrir une assistance juridique gratuite aux personnes handicapées victimes de discrimination.',
      missions: [
        'Documenter les cas de violations de droits des personnes avec handicap dans le Grand Nord-Kivu.',
        'Organiser des séances de formation juridique pour les magistrats, policiers et agents administratifs.',
        'Rédiger des notes de position et des rapports de plaidoyer pour la direction.',
      ],
      profile: 'Diplôme universitaire en Droit, Sciences Politiques ou Droits de l\'Homme. Expérience confirmée d\'au moins 2 ans dans une organisation de la société civile. Excellente maîtrise du cadre légal congolais sur le handicap. La candidature d\'une personne en situation de handicap est vivement encouragée.',
      applicationDossier: '',
      deadline: '2026-11-30',
      applicationLink: '',
      createdAt: '2026-10-01',
    },
    {
      id: 'j2',
      title: 'Animateur(trice) Communautaire — Éducation Inclusive & Sensibilisation',
      location: 'Beni Ville & Territoire',
      contractType: 'CDI',
      contractPrecision: '',
      description: 'Assurer la liaison quotidienne entre les familles, les écoles partenaires et les centres de réadaptation pour favoriser l\'intégration scolaire des enfants handicapés.',
      missions: [
        'Identifier et recenser les enfants vivant avec un handicap non scolarisés dans les quartiers de Beni.',
        'Accompagner les directeurs d\'écoles et enseignants dans l\'aménagement des salles de classe.',
        'Animer des ateliers de sensibilisation communautaire contre la stigmatisation.',
      ],
      profile: 'Diplôme en Pédagogie, Sciences Sociales, Travail Social ou domaine connexe. Sens aigu de l\'écoute, empathie et parfaite maîtrise du Swahili et du Français. Capacité à se déplacer sur le terrain dans les différents quartiers de Beni.',
      applicationDossier: '',
      deadline: '',
      applicationLink: '',
      createdAt: '2026-10-01',
    },
    {
      id: 'j3',
      title: 'Assistant(e) Logistique & Réadaptation Technique',
      location: 'Beni (Nord-Kivu)',
      contractType: 'Stage',
      contractPrecision: '6 mois',
      description: 'Stage professionnel indemnisé : Appuyer l\'assemblage, l\'entretien et la distribution des tricycles, fauteuils roulants et matériels orthopédiques.',
      missions: [
        'Gérer l\'inventaire des aides techniques à la mobilité et fournitures adaptées.',
        'Participer aux séances d\'ajustement et de remise officielle du matériel aux bénéficiaires.',
        'Assurer le suivi technique et l\'évaluation de la satisfaction des usagers.',
      ],
      profile: 'Formation technique ou logistique (Bac+2 minimum ou formation professionnelle équivalente). Rigueur, ponctualité et motivation pour la cause de l\'accessibilité. Possibilité d\'embauche à l\'issue du stage.',
      applicationDossier: '',
      deadline: '2026-12-15',
      applicationLink: '',
      createdAt: '2026-10-01',
    },
    {
      id: 'j4',
      title: 'Interprètes Volontaires en Langue des Signes & Bénévoles',
      location: 'Beni (Présentiel ou Événementiel)',
      contractType: 'Bénévolat',
      contractPrecision: 'Missions ponctuelles',
      description: 'Missions bénévoles ponctuelles lors de nos conférences, assemblées et sessions de formation pour assurer la traduction en langue des signes ou l\'accompagnement physique.',
      missions: [
        'Assurer l\'interprétation simultanée lors des réunions publiques et ateliers.',
        'Participer à l\'encadrement des activités récréatives et sportives inclusives.',
      ],
      profile: 'Maîtrise de la langue des signes congolaise ou francophone. Motivation et engagement pour les droits des personnes sourdes et malentendantes.',
      applicationDossier: '',
      deadline: '',
      applicationLink: '',
      createdAt: '2026-10-01',
    },
  ],
  users: [],
  bankAccounts: [
    {
      id: 'bank-equity-bcdc-usd',
      bankName: 'EQUITY BCDC',
      accountName: 'ACPDPH',
      agency: 'AGENCE DE BENI',
      accountNumber: '00011150666200168501311',
      swift: 'BCDCCDKI',
      currency: 'USD',
      iban: '',
      notes: 'Compte principal pour les virements en devises (USD). Indiquer la référence de don en communication.',
      active: true,
    },
  ],
  governanceMembers: [
    {
      id: 'gov-board-1',
      name: 'Emmanuel KAKULE SYAYUKUMBITA',
      role: 'Initiateur et Président du Conseil d’administration',
      organ: 'board',
      order: 1,
    },
    {
      id: 'gov-board-2',
      name: 'Talent KASEREKA HANGI',
      role: 'Vice-Président du Conseil d’administration',
      organ: 'board',
      order: 2,
    },
    {
      id: 'gov-board-3',
      name: 'KAMATE MULITSO Denis',
      role: 'Secrétaire du Conseil d’administration',
      organ: 'board',
      order: 3,
    },
    {
      id: 'gov-board-4',
      name: 'PALUKU NYARUKE Jean-Faustin',
      role: 'Trésorier du Conseil d’administration',
      organ: 'board',
      order: 4,
    },
    {
      id: 'gov-board-5',
      name: 'BWAKYANAKAZI MUKAVURA Achille',
      role: 'Conseiller du Conseil d’administration',
      organ: 'board',
      order: 5,
    },
    {
      id: 'gov-audit-1',
      name: 'KASWERA KINAHWA Jacquis',
      role: 'Présidente',
      organ: 'audit',
      order: 1,
    },
    {
      id: 'gov-audit-2',
      name: 'MULUME MOAVINGI Daniel',
      role: 'Secrétaire rapporteur',
      organ: 'audit',
      order: 2,
    },
    {
      id: 'gov-audit-3',
      name: 'KAMBALE LYANABO Dédié',
      role: 'Membre contrôleur',
      organ: 'audit',
      order: 3,
    },
    {
      id: 'gov-sec-1',
      name: 'KATEMBO TSONGO Moïse',
      role: 'Secrétaire exécutif national',
      organ: 'secretariat',
      order: 1,
    },
    {
      id: 'gov-sec-2',
      name: 'PALUKU SINDANI',
      role: 'Directeur des programmes',
      organ: 'secretariat',
      order: 2,
    },
    {
      id: 'gov-sec-3',
      name: 'KATHAKA KISWERE Christien',
      role: 'Comptable',
      organ: 'secretariat',
      order: 3,
    },
    {
      id: 'gov-sec-4',
      name: 'MASIKA KALIPI Rachel',
      role: 'Caissière',
      organ: 'secretariat',
      order: 4,
    },
    {
      id: 'gov-sec-5',
      name: 'MASIKA VINDUSIVYOLO Vinciane',
      role: 'Logisticienne',
      organ: 'secretariat',
      order: 5,
    },
    {
      id: 'gov-sec-6',
      name: 'KAKULE SYASEMBA Olivier',
      role: 'Chargé de communication',
      organ: 'secretariat',
      order: 6,
    },
    {
      id: 'gov-sec-7',
      name: 'KAVIRA BAHAKISI DIEU MERCI',
      role: 'Interprète en langue des signes',
      organ: 'secretariat',
      order: 7,
    },
    {
      id: 'gov-sec-8',
      name: 'SOKI MUSYENENE Yvonne',
      role: 'Agent Communautaire',
      organ: 'secretariat',
      order: 8,
    },
  ],
  cvs: [],
};

// GET /api/v1/content - Fetch site content (accessible to all devices)
router.get('/', async (req: Request, res: Response) => {
  try {
    let content = await SiteContent.findOne({ key: 'main_site_content' });

    if (!content) {
      // Create initial content in MongoDB Atlas if db is empty
      content = await SiteContent.create(DEFAULT_CONTENT);
      console.log('[MongoDB] Initialized default site content in Atlas database');
    }

    const bankAccounts = Array.isArray((content as any).bankAccounts) && (content as any).bankAccounts.length > 0
      ? (content as any).bankAccounts
      : DEFAULT_CONTENT.bankAccounts;

    const governanceMembers = Array.isArray((content as any).governanceMembers) && (content as any).governanceMembers.length > 0
      ? (content as any).governanceMembers
      : DEFAULT_CONTENT.governanceMembers;

    const cvs = Array.isArray((content as any).cvs)
      ? (content as any).cvs
      : [];

    res.status(200).json({
      success: true,
      data: {
        impact: content.impact,
        pillars: content.pillars,
        news: content.news,
        projects: content.projects,
        jobs: (content as any).jobs || [],
        contact: content.contact,
        users: content.users || [],
        bankAccounts,
        governanceMembers,
        cvs,
      },
    });
  } catch (error: any) {
    console.error('Error fetching site content:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch content from database.',
      fallback: DEFAULT_CONTENT,
    });
  }
});

// PUT /api/v1/content - Update site content in MongoDB Atlas (saves admin changes to cloud)
router.put('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { impact, pillars, news, projects, jobs, contact, users, bankAccounts, governanceMembers, cvs } = req.body;

    const updated = await SiteContent.findOneAndUpdate(
      { key: 'main_site_content' },
      {
        $set: {
          impact: impact || [],
          pillars: pillars || [],
          news: news || [],
          projects: projects || [],
          jobs: jobs || [],
          contact: contact || {},
          users: users || [],
          bankAccounts: bankAccounts || [],
          governanceMembers: governanceMembers || [],
          cvs: cvs || [],
        },
      },
      { new: true, upsert: true }
    );

    console.log('[MongoDB Cloud] Site content updated successfully');

    res.status(200).json({
      success: true,
      message: 'Content updated and synchronized across all devices!',
      data: {
        impact: updated.impact,
        pillars: updated.pillars,
        news: updated.news,
        projects: updated.projects,
        jobs: (updated as any).jobs || [],
        contact: updated.contact,
        users: updated.users || [],
        bankAccounts: (updated as any).bankAccounts || [],
        governanceMembers: (updated as any).governanceMembers || [],
        cvs: (updated as any).cvs || [],
      },
    });
  } catch (error: any) {
    console.error('Error updating site content:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to synchronize content to database.',
    });
  }
});

export default router;
