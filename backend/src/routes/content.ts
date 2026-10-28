import { Router, Request, Response } from 'express';
import SiteContent from '../models/SiteContent';

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
  users: [],
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

    res.status(200).json({
      success: true,
      data: {
        impact: content.impact,
        pillars: content.pillars,
        news: content.news,
        projects: content.projects,
        contact: content.contact,
        users: content.users || [],
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
router.put('/', async (req: Request, res: Response) => {
  try {
    const { impact, pillars, news, projects, contact, users } = req.body;

    const updated = await SiteContent.findOneAndUpdate(
      { key: 'main_site_content' },
      {
        $set: {
          impact: impact || [],
          pillars: pillars || [],
          news: news || [],
          projects: projects || [],
          contact: contact || {},
          users: users || [],
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
        contact: updated.contact,
        users: updated.users || [],
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
