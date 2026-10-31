import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { AdminData, ImpactCounter, Pillar, NewsArticle, Project, ContactInfo, AdminUser, Subscriber, NewsletterLog, GalleryItem } from '../types';
import { apiFetch } from '../services/api';
import { OFFICE_ADDRESS } from '../constants/contact';

/* ===== DONNÉES PAR DÉFAUT (affichées pendant le chargement initial) ===== */
const DEFAULT_DATA: AdminData = {
  impact: [
    { id: '1', value: 2500, label: 'Personnes accompagnées', label_en: 'Persons supported', color: 'ba-blue' },
    { id: '2', value: 45, label: 'Centres & Écoles inclusives', label_en: 'Inclusive centres & schools', color: 'ba-blue' },
    { id: '3', value: 1200, label: 'Aides & Appareillages fournis', label_en: 'Technical aids provided', color: 'ba-blue' },
    { id: '4', value: 350, label: 'Plaidoyers & Formations', label_en: 'Advocacy & training sessions', color: 'ba-blue' },
  ],
  pillars: [
    {
      id: '1',
      title: 'Droits & Plaidoyer',
      title_en: 'Rights & Advocacy',
      description: 'Promotion et défense des droits fondamentaux des personnes handicapées, vulgarisation des textes légaux et lutte contre la discrimination.',
      description_en: 'Promoting and defending fundamental rights of persons with disabilities, popularizing legal frameworks and combating discrimination.',
      image: '/pillars/protection.jpg',
      color: 'ba-blue',
      gradient: 'from-blue-600/10 to-blue-700/5',
      bulletPoints: [
        'Défense juridique et plaidoyer auprès des institutions publiques.',
        'Sensibilisation communautaire contre les stéréotypes et exclusions.',
      ],
      bulletPoints_en: [
        'Legal defense and advocacy before public institutions.',
        'Community awareness against stereotypes and exclusions.',
      ],
    },
    {
      id: '2',
      title: 'Accessibilité Universelle',
      title_en: 'Universal Accessibility',
      description: 'Aménagement d\'infrastructures accessibles, accès aux bâtiments publics, aux transports et aux communications adaptées.',
      description_en: 'Accessible infrastructure development, access to public facilities, transportation and adapted communications.',
      image: '/pillars/environnement.jpg',
      color: 'ba-blue',
      gradient: 'from-blue-500/10 to-indigo-600/5',
      bulletPoints: [
        'Plaidoyer pour des rampes et accès adaptés dans les édifices publics.',
        'Sensibilisation à l\'accessibilité numérique et informationnelle.',
      ],
      bulletPoints_en: [
        'Advocacy for ramps and adapted access in public buildings.',
        'Digital and informational accessibility awareness.',
      ],
    },
    {
      id: '3',
      title: 'Éducation Inclusive',
      title_en: 'Inclusive Education',
      description: 'Intégration scolaire des enfants et jeunes avec handicap, formation pédagogique des enseignants et appui en matériels didactiques adaptés.',
      description_en: 'School inclusion for children and youth with disabilities, teacher training and provision of adapted didactic supplies.',
      image: '/pillars/formation.jpg',
      color: 'ba-blue',
      gradient: 'from-sky-500/10 to-blue-600/5',
      bulletPoints: [
        'Octroi de bourses scolaires et kits didactiques adaptés.',
        'Accompagnement pédagogique des écoles partenaires à Beni.',
      ],
      bulletPoints_en: [
        'Scholarships and adapted educational kits.',
        'Pedagogical support for partner schools in Beni.',
      ],
    },
    {
      id: '4',
      title: 'Santé & Réadaptation',
      title_en: 'Health & Rehabilitation',
      description: 'Accès aux soins médicaux spécialisés, réadaptation physique et fourniture d\'aides à la mobilité (prothèses, tricycles, béquilles).',
      description_en: 'Access to specialized healthcare, physical rehabilitation and delivery of mobility aids (prostheses, tricycles, crutches).',
      image: '/pillars/sante.jpg',
      color: 'ba-blue',
      gradient: 'from-blue-600/10 to-cyan-600/5',
      bulletPoints: [
        'Distribution d\'équipements d\'aide à la mobilité.',
        'Suivi psychosocial et kinésithérapie adaptée.',
      ],
      bulletPoints_en: [
        'Distribution of mobility assistance equipment.',
        'Psychosocial support and adapted physical therapy.',
      ],
    },
    {
      id: '5',
      title: 'Autonomisation & Activités Économiques',
      title_en: 'Empowerment & Livelihoods',
      description: 'Formation professionnelle adaptée, appui aux micro-crédits, création d\'ateliers artisanaux et insertion socio-économique durable.',
      description_en: 'Adapted vocational training, micro-credit support, establishment of craft workshops, and sustainable socio-economic inclusion.',
      image: '/pillars/formation.jpg',
      color: 'ba-blue',
      gradient: 'from-amber-600/10 to-orange-600/5',
      bulletPoints: [
        'Financement et coaching de micro-activités génératrices de revenus.',
        'Apprentissage des métiers artisanaux (couture, cordonnerie, vannerie).',
      ],
      bulletPoints_en: [
        'Funding and coaching for income-generating micro-activities.',
        'Vocational training in crafts (tailoring, shoemaking, basketry).',
      ],
    },
  ],
  news: [
    {
      id: '1',
      title: 'Campagne de plaidoyer pour l\'accessibilité des édifices publics à Beni',
      title_en: 'Advocacy campaign for public building accessibility in Beni',
      hookTitle: 'Plaidoyer pour l\'accessibilité des édifices publics à Beni',
      excerpt: 'L\'ACPDPH a rencontré les autorités urbaines de Beni pour la mise en conformité des accès aux bâtiments administratifs.',
      excerpt_en: 'ACPDPH met with local authorities in Beni to advocate for disability access compliance in public administrative buildings.',
      date: '15 Juil 2026',
      category: 'Plaidoyer',
      category_en: 'Advocacy',
      color: 'ba-blue',
    },
    {
      id: '2',
      title: 'Remise d\'aides techniques et bourses scolaires inclusives',
      title_en: 'Distribution of technical mobility aids and inclusive scholarships',
      hookTitle: '',
      excerpt: 'L\'ACPDPH a distribué des tricycles et kits scolaires complets à 120 élèves en situation de handicap à Beni.',
      excerpt_en: 'ACPDPH distributed tricycles and complete school kits to 120 students with disabilities in Beni.',
      date: '02 Juin 2026',
      category: 'Inclusion',
      category_en: 'Inclusion',
      color: 'ba-blue',
    },
  ],
  projects: [
    {
      id: '1',
      title: 'Écoles Inclusives & Équité Éducative',
      title_en: 'Inclusive Schools & Educational Equity',
      hookTitle: 'Éducation inclusive : des enfants handicapés enfin à l\'école',
      location: 'Beni, Nord-Kivu, RDC',
      type: 'Éducation Inclusive',
      type_en: 'Inclusive Education',
      status: 'En cours',
      status_en: 'In progress',
      description: 'Aménagement de salles adaptées, formation des enseignants à l\'inclusion et dotation d\'outils pédagogiques pour les enfants vivant avec handicap.',
      description_en: 'Equipping adapted classrooms, training teachers in inclusive education, and providing learning tools for children with disabilities.',
      color: 'ba-blue',
      image: '/pillars/formation.jpg',
      date: '2026-03-12',
    },
    {
      id: '2',
      title: 'Autonomisation & Métiers pour Personnes Handicapées',
      title_en: 'Empowerment & Vocational Training for Persons with Disabilities',
      location: 'Beni et environs',
      type: 'Autonomisation',
      type_en: 'Empowerment',
      status: 'En cours',
      status_en: 'In progress',
      description: 'Formations professionnelles aux métiers d\'artisanat, numérique et gestion de micro-entreprises avec octroi de kits de démarrage.',
      description_en: 'Vocational training in craftsmanship, digital tools, and micro-business management with starter kits.',
      color: 'ba-blue',
      image: '/pillars/protection.jpg',
      date: '2026-02-18',
    },
    {
      id: '3',
      title: 'Clinique Mobile de Réadaptation & Aides Mobilité',
      title_en: 'Mobile Rehabilitation Clinic & Mobility Aids',
      location: 'Nord-Kivu, RDC',
      type: 'Santé & Réadaptation',
      type_en: 'Health & Rehabilitation',
      status: 'Achevé',
      status_en: 'Completed',
      description: 'Consultations médicales itinérantes, consultations de kinésithérapie et don d\'aides techniques à la mobilité pour les personnes vulnérables.',
      description_en: 'Mobile medical checkups, physical therapy sessions, and delivery of mobility devices to vulnerable individuals.',
      color: 'ba-blue',
      image: '/pillars/sante.jpg',
      date: '2026-01-25',
    },
    {
      id: '4',
      title: 'Plaidoyer & Accessibilité des Bâtiments Publics',
      title_en: 'Advocacy & Public Buildings Accessibility',
      hookTitle: 'Plaidoyer pour des édifices publics accessibles à tous à Beni',
      location: 'Beni, Nord-Kivu, RDC',
      type: 'Plaidoyer & Droits',
      type_en: 'Advocacy & Rights',
      status: 'En cours',
      status_en: 'In progress',
      description: 'Audit architectural et mise aux normes d\'accessibilité universelle des infrastructures administratives et judiciaires.',
      description_en: 'Architectural audit and universal accessibility adaptation of administrative and judicial infrastructures.',
      color: 'ba-blue',
      image: '/pillars/environnement.jpg',
      date: '2025-11-30',
    },
  ],
  contact: {
    address: OFFICE_ADDRESS,
    email: 'info.acpdph.asbl.rdc@gmail.com',
    phone: '+243 976 992 466',
    whatsapp: '+243 852 799 553',
  },
  users: [],
  gallery: [],
};

/* ===== Context Type ===== */
interface AdminDataContextType {
  data: AdminData;
  // États de connexion base de données
  isLoading: boolean;       // true pendant le chargement depuis MongoDB
  dbConnected: boolean;     // true si MongoDB Atlas est accessible
  dbError: string | null;   // message d'erreur si DB inaccessible
  isSyncing: boolean;       // true pendant une sauvegarde vers MongoDB
  syncError: string | null; // erreur de sauvegarde
  retryConnection: () => void; // relancer la connexion à MongoDB
  // Impact
  updateImpact: (id: string, item: Partial<ImpactCounter>) => void;
  addImpact: (item: Omit<ImpactCounter, 'id'>) => void;
  deleteImpact: (id: string) => void;
  // Pillars
  updatePillar: (id: string, item: Partial<Pillar>) => void;
  addPillar: (item: Omit<Pillar, 'id'>) => void;
  deletePillar: (id: string) => void;
  // News
  updateNews: (id: string, item: Partial<NewsArticle>) => void;
  addNews: (item: Omit<NewsArticle, 'id'>) => void;
  deleteNews: (id: string) => void;
  // Projects
  updateProject: (id: string, item: Partial<Project>) => void;
  addProject: (item: Omit<Project, 'id'>) => void;
  deleteProject: (id: string) => void;
  // Contact
  updateContact: (info: Partial<ContactInfo>) => void;
  // Users Management
  addUser: (user: Omit<AdminUser, 'id' | 'createdAt'>) => { success: boolean; error?: string };
  deleteUser: (id: string) => void;
  updateUser: (id: string, updates: Partial<Pick<AdminUser, 'name' | 'email' | 'password'>>) => { success: boolean; error?: string };
  // Newsletter & Subscribers
  subscribers: Subscriber[];
  newsletterLogs: NewsletterLog[];
  addSubscriber: (email: string) => { success: boolean; message?: string };
  removeSubscriber: (email: string) => void;
  broadcastNewsletter: (params: { subject: string; content: string; type: 'PROJECT' | 'NEWS' | 'DIRECT' }) => void;
  notifySubscribersNewContent: (params: { title: string; excerpt: string; type: 'PROJECT' | 'NEWS'; id: string }) => void;
  // Gallery
  gallery: GalleryItem[];
  addGalleryItem: (item: Omit<GalleryItem, '_id'>) => Promise<GalleryItem>;
  updateGalleryItem: (id: string, updates: Partial<GalleryItem>) => void;
  deleteGalleryItem: (id: string) => void;
  // Auth
  isAuthenticated: boolean;
  currentUser: AdminUser | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AdminDataContext = createContext<AdminDataContextType | undefined>(undefined);

let nextId = 100;
function generateId(): string {
  return String(Date.now()) + String(++nextId);
}

/* ===== Fonction de sauvegarde vers MongoDB Atlas ===== */
async function saveToCloud(newData: AdminData): Promise<boolean> {
  try {
    const res = await apiFetch('/content', {
      method: 'PUT',
      body: JSON.stringify({
        impact: newData.impact,
        pillars: newData.pillars,
        news: newData.news,
        projects: newData.projects,
        contact: newData.contact,
        users: newData.users || [],
      }),
    });
    return res.success === true;
  } catch {
    return false;
  }
}

export function AdminDataProvider({ children }: { children: ReactNode }) {
  // ── État principal — données chargées depuis MongoDB Atlas ──
  const [data, setData] = useState<AdminData>(DEFAULT_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const [dbConnected, setDbConnected] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  // ── Auth (sessionStorage uniquement — pas de localStorage) ──
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const isAuth = sessionStorage.getItem('ba-admin-auth') === 'true';
    if (isAuth && !sessionStorage.getItem('ba-admin-token')) {
      sessionStorage.setItem('ba-admin-token', 'admin-session-active');
    }
    return isAuth;
  });
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(() => {
    const stored = sessionStorage.getItem('ba-admin-user');
    return stored ? JSON.parse(stored) : null;
  });

  // ── Chargement depuis MongoDB Atlas (avec 3 tentatives automatiques) ───────
  const loadFromCloud = useCallback(async (attempts = 3) => {
    setIsLoading(true);
    setDbError(null);

    for (let attempt = 1; attempt <= attempts; attempt++) {
      try {
        console.log(`[ACPDPH] Connexion MongoDB Atlas (tentative ${attempt}/${attempts})...`);
        const res = await apiFetch<AdminData>('/content');
        if (res.success && res.data) {
          const cloudContact = res.data.contact || {};
          const mergedContact = {
            address: cloudContact.address && !cloudContact.address.includes('XX') && cloudContact.address !== 'Beni — Nord-Kivu, RDC' ? cloudContact.address : DEFAULT_DATA.contact.address,
            email: cloudContact.email && cloudContact.email !== 'contact@acpdph.org' ? cloudContact.email : DEFAULT_DATA.contact.email,
            phone: cloudContact.phone && !cloudContact.phone.includes('000') && !cloudContact.phone.includes('XX') ? cloudContact.phone : DEFAULT_DATA.contact.phone,
            whatsapp: cloudContact.whatsapp || DEFAULT_DATA.contact.whatsapp,
          };
          setData({ ...res.data, contact: mergedContact, users: res.data.users || [] });
          setDbConnected(true);
          setDbError(null);
          setIsLoading(false);
          console.log('[ACPDPH] [SUCCÈS] Connecté à MongoDB Atlas avec succès !');
          return;
        }
      } catch (err) {
        console.warn(`[ACPDPH] [ATTENTION] Tentative ${attempt}/${attempts} échouée:`, err);
      }

      // Si ce n'est pas la dernière tentative, attendre 4s que le serveur Render sorte de veille
      if (attempt < attempts) {
        await new Promise(resolve => setTimeout(resolve, 4000));
      }
    }

    // Si toutes les tentatives ont échoué
    setDbConnected(false);
    setDbError(
      'La base de données MongoDB Atlas est momentanément inaccessible. ' +
      'Le serveur backend (Render) met du temps à sortir de veille ou votre réseau est ralenti. ' +
      'Cliquez sur "Réessayer la connexion" ci-dessous.'
    );
    setIsLoading(false);
  }, []);

  // Charger au démarrage
  useEffect(() => {
    loadFromCloud();
  }, [loadFromCloud]);

  // Fonction de reconnexion manuelle (bouton "Réessayer" dans l'admin)
  const retryConnection = useCallback(() => {
    loadFromCloud();
  }, [loadFromCloud]);

  // ── Sauvegarde vers MongoDB Atlas (SANS localStorage) ────────────────────
  const persist = useCallback(async (newData: AdminData) => {
    // Mise à jour optimiste de l'interface immédiatement
    setData(newData);
    setIsSyncing(true);
    setSyncError(null);

    const success = await saveToCloud(newData);

    if (success) {
      setSyncError(null);
      setDbConnected(true);
      setDbError(null);
      console.log('[ACPDPH] [SUCCÈS] Données sauvegardées dans MongoDB Atlas');
    } else {
      setSyncError(
        'La sauvegarde a échoué. La base de données est peut-être hors ligne. ' +
        'Vos modifications sont visibles ici mais ne sont pas encore enregistrées.'
      );
      setDbConnected(false);
      console.error('[ACPDPH] [ERREUR] Échec sauvegarde cloud');
    }
    setIsSyncing(false);
  }, []);

  // ── Auth ─────────────────────────────────────────────────────────────────
  const login = useCallback(async (username: string, password: string): Promise<boolean> => {
    const trimUser = username.trim().toLowerCase();

    // 1. Authentification via le backend
    try {
      const res = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username: trimUser, password }),
      });
      if (res.success && res.data?.user) {
        setIsAuthenticated(true);
        setCurrentUser(res.data.user);
        sessionStorage.setItem('ba-admin-auth', 'true');
        sessionStorage.setItem('ba-admin-user', JSON.stringify(res.data.user));
        if (res.data.token) {
          sessionStorage.setItem('ba-admin-token', res.data.token);
        }
        return true;
      }
    } catch {
      // Ignorer l'erreur réseau et tenter le super-admin local
    }

    // 2. Super Admin local (mot de passe fixe)
    if (
      (trimUser === 'admin' || trimUser === 'administrator' || trimUser === 'acpdph') &&
      (password === 'Acpdph2026' || password === 'ACPDPH2026' || password === 'Acpdph2026!' || password === 'ACPDPH2026!')
    ) {
      const user: AdminUser = {
        id: 'super-admin',
        username: 'admin',
        name: 'Administrateur ACPDPH',
        email: 'admin@acpdph.org',
        role: 'ADMIN',
        createdAt: '2026-01-01',
      };
      setIsAuthenticated(true);
      setCurrentUser(user);
      sessionStorage.setItem('ba-admin-auth', 'true');
      sessionStorage.setItem('ba-admin-user', JSON.stringify(user));
      sessionStorage.setItem('ba-admin-token', 'admin-session-active');
      return true;
    }

    // 3. Éditeurs enregistrés dans MongoDB
    const foundUser = (data.users || []).find(
      u => u.username.toLowerCase() === trimUser && u.password === password
    );
    if (foundUser) {
      setIsAuthenticated(true);
      setCurrentUser(foundUser);
      sessionStorage.setItem('ba-admin-auth', 'true');
      sessionStorage.setItem('ba-admin-user', JSON.stringify(foundUser));
      sessionStorage.setItem('ba-admin-token', 'admin-session-active');
      return true;
    }

    return false;
  }, [data.users]);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    sessionStorage.removeItem('ba-admin-auth');
    sessionStorage.removeItem('ba-admin-user');
    sessionStorage.removeItem('ba-admin-token');
  }, []);

  // ── Users CRUD ───────────────────────────────────────────────────────────
  const addUser = useCallback((userItem: Omit<AdminUser, 'id' | 'createdAt'>): { success: boolean; error?: string } => {
    const currentUsers = data.users || [];
    if (currentUsers.length >= 5) {
      return { success: false, error: 'Limite maximale atteinte. Vous ne pouvez pas ajouter plus de 5 éditeurs.' };
    }
    const exists = currentUsers.some(u => u.username.toLowerCase() === userItem.username.trim().toLowerCase());
    if (exists || userItem.username.trim().toLowerCase() === 'admin') {
      return { success: false, error: 'Ce nom d\'utilisateur est déjà utilisé.' };
    }
    const newUser: AdminUser = {
      ...userItem,
      username: userItem.username.trim(),
      id: generateId(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    persist({ ...data, users: [...currentUsers, newUser] });
    return { success: true };
  }, [data, persist]);

  const deleteUser = useCallback((id: string) => {
    persist({ ...data, users: (data.users || []).filter(u => u.id !== id) });
  }, [data, persist]);

  const updateUser = useCallback((id: string, updates: Partial<Pick<AdminUser, 'name' | 'email' | 'password'>>): { success: boolean; error?: string } => {
    const currentUsers = data.users || [];
    const userIndex = currentUsers.findIndex(u => u.id === id);
    if (userIndex === -1) return { success: false, error: 'Utilisateur introuvable.' };
    const updatedUser = { ...currentUsers[userIndex], ...updates };
    persist({ ...data, users: currentUsers.map(u => u.id === id ? updatedUser : u) });
    setCurrentUser(prev => prev?.id === id ? { ...prev, ...updates } : prev);
    const sessionUser = sessionStorage.getItem('ba-admin-user');
    if (sessionUser) {
      const parsed = JSON.parse(sessionUser);
      if (parsed.id === id) {
        sessionStorage.setItem('ba-admin-user', JSON.stringify({ ...parsed, ...updates }));
      }
    }
    return { success: true };
  }, [data, persist]);

  // ── Impact CRUD ──────────────────────────────────────────────────────────
  const updateImpact = useCallback((id: string, item: Partial<ImpactCounter>) => {
    persist({ ...data, impact: data.impact.map(c => c.id === id ? { ...c, ...item } : c) });
  }, [data, persist]);

  const addImpact = useCallback((item: Omit<ImpactCounter, 'id'>) => {
    persist({ ...data, impact: [...data.impact, { ...item, id: generateId() }] });
  }, [data, persist]);

  const deleteImpact = useCallback((id: string) => {
    persist({ ...data, impact: data.impact.filter(c => c.id !== id) });
  }, [data, persist]);

  // ── Pillars CRUD ─────────────────────────────────────────────────────────
  const updatePillar = useCallback((id: string, item: Partial<Pillar>) => {
    persist({ ...data, pillars: data.pillars.map(p => p.id === id ? { ...p, ...item } : p) });
  }, [data, persist]);

  const addPillar = useCallback((item: Omit<Pillar, 'id'>) => {
    persist({ ...data, pillars: [...data.pillars, { ...item, id: generateId() }] });
  }, [data, persist]);

  const deletePillar = useCallback((id: string) => {
    persist({ ...data, pillars: data.pillars.filter(p => p.id !== id) });
  }, [data, persist]);

  // ── Subscribers (en mémoire — les emails vont au backend via POST /newsletter) ──
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [newsletterLogs, setNewsletterLogs] = useState<NewsletterLog[]>([]);

  const addSubscriber = useCallback((email: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const existing = subscribers.find(s => s.email.toLowerCase() === cleanEmail);
    if (existing) {
      return { success: false, message: 'Cet e-mail est déjà inscrit à la newsletter.' };
    }
    const newSub: Subscriber = {
      id: generateId(),
      email: cleanEmail,
      subscribedAt: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }),
    };
    setSubscribers(prev => [newSub, ...prev]);
    // Enregistrer l'abonné dans le backend MongoDB
    apiFetch('/newsletter', {
      method: 'POST',
      body: JSON.stringify({ email: cleanEmail }),
    }).catch(() => {});
    return { success: true, message: 'Félicitations ! Vous êtes désormais inscrit à la newsletter de l\'ACPDPH.' };
  }, [subscribers]);

  const removeSubscriber = useCallback((email: string) => {
    setSubscribers(prev => prev.filter(s => s.email.toLowerCase() !== email.toLowerCase()));
  }, []);

  const broadcastNewsletter = useCallback((params: { subject: string; content: string; type: 'PROJECT' | 'NEWS' | 'DIRECT' }) => {
    const newLog: NewsletterLog = {
      id: generateId(),
      subject: params.subject,
      content: params.content,
      type: params.type,
      sentAt: new Date().toLocaleString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      recipientCount: subscribers.length,
    };
    setNewsletterLogs(prev => [newLog, ...prev]);
  }, [subscribers.length]);

  const notifySubscribersNewContent = useCallback((params: { title: string; excerpt: string; type: 'PROJECT' | 'NEWS'; id: string }) => {
    if (subscribers.length === 0) return;
    const isProject = params.type === 'PROJECT';
    const subject = isProject
      ? `Nouveau Projet - ${params.title}`
      : `Nouvelle Actualité - ${params.title}`;
    const content = isProject
      ? `L'ACPDPH a le plaisir de vous annoncer le lancement de son nouveau projet : "${params.title}". ${params.excerpt}`
      : `Découvrez la dernière actualité de l'ACPDPH : "${params.title}". ${params.excerpt}`;
    broadcastNewsletter({ subject, content, type: params.type });
  }, [subscribers.length, broadcastNewsletter]);

  // ── News CRUD ────────────────────────────────────────────────────────────
  const updateNews = useCallback((id: string, item: Partial<NewsArticle>) => {
    persist({ ...data, news: data.news.map(n => n.id === id ? { ...n, ...item } : n) });
  }, [data, persist]);

  const addNews = useCallback((item: Omit<NewsArticle, 'id'>) => {
    const newId = generateId();
    const newArticle = { ...item, id: newId };
    persist({ ...data, news: [newArticle, ...data.news] });
    notifySubscribersNewContent({ title: item.title, excerpt: item.excerpt, type: 'NEWS', id: newId });
  }, [data, persist, notifySubscribersNewContent]);

  const deleteNews = useCallback((id: string) => {
    persist({ ...data, news: data.news.filter(n => n.id !== id) });
  }, [data, persist]);

  // ── Projects CRUD ────────────────────────────────────────────────────────
  const updateProject = useCallback((id: string, item: Partial<Project>) => {
    persist({ ...data, projects: data.projects.map(p => p.id === id ? { ...p, ...item } : p) });
  }, [data, persist]);

  const addProject = useCallback((item: Omit<Project, 'id'>) => {
    const newId = generateId();
    const newProj = { ...item, id: newId };
    persist({ ...data, projects: [...data.projects, newProj] });
    notifySubscribersNewContent({ title: item.title, excerpt: item.description?.slice(0, 150) || '', type: 'PROJECT', id: newId });
  }, [data, persist, notifySubscribersNewContent]);

  const deleteProject = useCallback((id: string) => {
    persist({ ...data, projects: data.projects.filter(p => p.id !== id) });
  }, [data, persist]);

  // ── Gallery CRUD ──
  const [gallery, setGallery] = useState<GalleryItem[]>(() => {
    try {
      const stored = localStorage.getItem('ACPDPH_GALLERY_ITEMS');
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return [];
  });

  useEffect(() => {
    apiFetch('/gallery/all')
      .then(res => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          setGallery(prev => {
            const map = new Map<string, GalleryItem>();
            res.data.forEach((item: GalleryItem) => map.set(item._id || item.url, item));
            prev.forEach(item => {
              if (!map.has(item._id) && !map.has(item.url)) {
                map.set(item._id, item);
              }
            });
            const merged = Array.from(map.values());
            try {
              localStorage.setItem('ACPDPH_GALLERY_ITEMS', JSON.stringify(merged));
            } catch {}
            return merged;
          });
        }
      })
      .catch(() => {});
  }, []);

  const persistGallery = useCallback((updated: GalleryItem[]) => {
    setGallery(updated);
    try {
      localStorage.setItem('ACPDPH_GALLERY_ITEMS', JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('gallery-updated', { detail: updated }));
    } catch (e) {
      console.warn('Could not save gallery to localStorage', e);
    }
  }, []);

  const addGalleryItem = useCallback(async (item: Omit<GalleryItem, '_id'>): Promise<GalleryItem> => {
    const newItem: GalleryItem = {
      ...item,
      _id: 'gal-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7),
      date: item.date || new Date().toISOString(),
      order: item.order ?? 0,
      active: item.active ?? true,
    };
    persistGallery([newItem, ...gallery]);
    return newItem;
  }, [gallery, persistGallery]);

  const updateGalleryItem = useCallback((id: string, updates: Partial<GalleryItem>) => {
    const updated = gallery.map(item => item._id === id ? { ...item, ...updates } : item);
    persistGallery(updated);
    if (!id.startsWith('gal-') && !id.startsWith('proj-') && !id.startsWith('news-') && !id.startsWith('pillar-')) {
      apiFetch('/gallery/' + id, {
        method: 'PUT',
        body: JSON.stringify(updates),
      }).catch(() => {});
    }
  }, [gallery, persistGallery]);

  const deleteGalleryItem = useCallback((id: string) => {
    const updated = gallery.filter(item => item._id !== id);
    persistGallery(updated);
    if (!id.startsWith('gal-') && !id.startsWith('proj-') && !id.startsWith('news-') && !id.startsWith('pillar-')) {
      apiFetch('/gallery/' + id, { method: 'DELETE' }).catch(() => {});
    }
  }, [gallery, persistGallery]);

  // ── Contact ──────────────────────────────────────────────────────────────
  const updateContact = useCallback((info: Partial<ContactInfo>) => {
    persist({ ...data, contact: { ...data.contact, ...info } });
  }, [data, persist]);

  return (
    <AdminDataContext.Provider
      value={{
        data,
        isLoading,
        dbConnected,
        dbError,
        isSyncing,
        syncError,
        retryConnection,
        updateImpact, addImpact, deleteImpact,
        updatePillar, addPillar, deletePillar,
        updateNews, addNews, deleteNews,
        updateProject, addProject, deleteProject,
        updateContact,
        addUser, deleteUser, updateUser,
        subscribers, newsletterLogs, addSubscriber, removeSubscriber, broadcastNewsletter, notifySubscribersNewContent,
        gallery, addGalleryItem, updateGalleryItem, deleteGalleryItem, isAuthenticated, currentUser, login, logout,
      }}
    >
      {children}
    </AdminDataContext.Provider>
  );
}

export function useAdminData() {
  const context = useContext(AdminDataContext);
  if (!context) {
    throw new Error('useAdminData must be used within an AdminDataProvider');
  }
  return context;
}
