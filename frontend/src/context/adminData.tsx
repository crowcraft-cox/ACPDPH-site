import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { AdminData, ImpactCounter, Pillar, NewsArticle, Project, ContactInfo, AdminUser, Subscriber, NewsletterLog } from '../types';
import { apiFetch } from '../services/api';

/* ===== DONNÉES PAR DÉFAUT (affichées pendant le chargement initial) ===== */
const DEFAULT_DATA: AdminData = {
  impact: [
    { id: '1', value: 2500, label: 'Enfants accompagnés', label_en: 'Children supported', color: 'ba-red' },
    { id: '2', value: 45, label: 'Écoles soutenues', label_en: 'Schools supported', color: 'ba-green' },
    { id: '3', value: 12000, label: 'Arbres plantés', label_en: 'Trees planted', color: 'ba-green' },
    { id: '4', value: 350, label: 'Sensibilisations', label_en: 'Awareness sessions', color: 'ba-red' },
  ],
  pillars: [
    {
      id: '1',
      title: 'Protection de l\'Enfant',
      title_en: 'Child Protection',
      description: 'Lutte contre les violences, l\'exploitation, le travail des enfants, le mariage forcé/précoce et le recrutement dans les groupes armés. Accompagnement psychosocial, juridique et mécanisme d\'alerte aux autorités.',
      description_en: 'Fighting violence, exploitation, child labor, forced/early marriage and recruitment into armed groups. Psychosocial and legal support, and alert mechanisms to authorities.',
      image: '/pillars/protection.jpg',
      color: 'ba-red',
      gradient: 'from-red-500/10 to-red-600/5',
      bulletPoints: [
        'Lutte contre le travail des enfants et le recrutement armé.',
        'Accompagnement psychosocial pour les enfants victimes de violences.',
      ],
      bulletPoints_en: [
        'Fight against child labor and armed recruitment.',
        'Psychosocial support for children who are victims of violence.',
      ],
    },
    {
      id: '2',
      title: 'Santé Maternelle & Infantile',
      title_en: 'Maternal & Child Health',
      description: 'Sensibilisation à l\'hygiène, prévention sanitaire, assainissement et santé de la mère et de l\'enfant.',
      description_en: 'Hygiene awareness, health prevention, sanitation and maternal and child health.',
      image: '/pillars/sante.jpg',
      color: 'ba-green',
      gradient: 'from-green-500/10 to-green-600/5',
      bulletPoints: [
        'Prévention sanitaire et campagnes de vaccination.',
        'Sensibilisation à l\'hygiène et assainissement (WASH).',
      ],
      bulletPoints_en: [
        'Health prevention and vaccination campaigns.',
        'Hygiene awareness and sanitation (WASH).',
      ],
    },
    {
      id: '3',
      title: 'Éducation & Formation',
      title_en: 'Education & Training',
      description: 'Alphabétisation, formation professionnelle des jeunes, soutien à la scolarisation (notamment la jeune fille).',
      description_en: 'Literacy, youth vocational training, support for schooling (especially for girls).',
      image: '/pillars/formation.jpg',
      color: 'ba-red',
      gradient: 'from-red-500/10 to-orange-500/5',
      bulletPoints: [
        'Soutien matériel et financier à la scolarisation.',
        'Formation professionnelle pour l\'autonomisation des jeunes.',
      ],
      bulletPoints_en: [
        'Material and financial support for schooling.',
        'Vocational training for youth empowerment.',
      ],
    },
    {
      id: '4',
      title: 'Éducation Environnementale',
      title_en: 'Environmental Education',
      description: 'Reforestation, préservation des écosystèmes, lutte contre la déboisement, gestion durable des déchets et sensibilisation au changement climatique.',
      description_en: 'Reforestation, ecosystem preservation, fight against deforestation, sustainable waste management and climate change awareness.',
      image: '/pillars/environnement.jpg',
      color: 'ba-green',
      gradient: 'from-green-500/10 to-emerald-500/5',
      bulletPoints: [
        'Campagnes de reboisement en Afrique.',
        'Sensibilisation communautaire au changement climatique.',
      ],
      bulletPoints_en: [
        'Reforestation campaigns across Africa.',
        'Community awareness on climate change.',
      ],
    },
  ],
  news: [
    {
      id: '1',
      title: 'Campagne de sensibilisation dans les écoles de Goma',
      title_en: 'Awareness campaign in Goma schools',
      excerpt: 'Plus de 500 élèves ont été sensibilisés aux droits de l\'enfant lors de notre dernière campagne dans 12 écoles en Afrique.',
      excerpt_en: 'Over 500 students were made aware of children\'s rights during our latest campaign in 12 schools in Africa.',
      date: '15 Juil 2026',
      category: 'Éducation',
      category_en: 'Education',
      color: 'ba-red',
    },
    {
      id: '2',
      title: 'Distribution de kits scolaires aux enfants vulnérables',
      title_en: 'Distribution of school kits to vulnerable children',
      excerpt: 'L\'ONG Bright African a distribué des fournitures scolaires complètes à 200 enfants vulnérables pour la rentrée.',
      excerpt_en: 'Bright African distributed complete school supplies to 200 vulnerable children for the back-to-school season.',
      date: '02 Juin 2026',
      category: 'Protection',
      category_en: 'Protection',
      color: 'ba-green',
    },
  ],
  projects: [
    {
      id: '1',
      title: 'Écoles Sûres & Protectrices',
      title_en: 'Safe & Protective Schools',
      location: 'Goma, RDC',
      type: 'Protection & Éducation',
      type_en: 'Protection & Education',
      status: 'En cours',
      status_en: 'In progress',
      description: 'Mise en place de comités de protection de l\'enfant dans 15 écoles partenaires, formation des enseignants à la discipline positive, et aménagement d\'espaces d\'écoute pour les élèves vulnérables.',
      description_en: 'Establishment of child protection committees in 15 partner schools, teacher training in positive discipline, and creation of listening spaces for vulnerable students.',
      color: 'ba-red',
      image: '/pillars/protection.jpg',
    },
    {
      id: '2',
      title: 'Reboisement Communautaire',
      title_en: 'Community Reforestation',
      location: 'Territoire de Nyiragongo',
      type: 'Environnement',
      type_en: 'Environment',
      status: 'En cours',
      status_en: 'In progress',
      description: 'Plantation de 12 000 arbres avec la participation active des jeunes et des écoles locales pour lutter contre la déforestation et l\'érosion des sols.',
      description_en: 'Plantation of 12,000 trees with the active participation of youth and local schools to fight deforestation and soil erosion.',
      color: 'ba-green',
      image: '/pillars/environnement.jpg',
    },
    {
      id: '3',
      title: 'Cliniques Mobiles de Santé Maternelle',
      title_en: 'Maternal Health Mobile Clinics',
      location: 'Zones rurales isolées',
      type: 'Santé',
      type_en: 'Health',
      status: 'Achevé',
      status_en: 'Completed',
      description: 'Déploiement d\'une clinique mobile pour fournir des soins prénataux et postnataux dans les zones rurales isolées, réduisant ainsi la mortalité maternelle et infantile.',
      description_en: 'Deployment of a mobile clinic to provide prenatal and postnatal care in isolated rural areas, reducing maternal and child mortality.',
      color: 'ba-red',
      image: '/pillars/sante.jpg',
    },
  ],
  contact: {
    address: 'Avenue de la Paix, Quartier Himbi, Goma — Nord-Kivu, RDC',
    email: 'contact@brightafrica.org',
    phone: '+243 990 000 000 / +243 810 000 000',
  },
  users: [],
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
        console.log(`[BrightAfrican] Connexion MongoDB Atlas (tentative ${attempt}/${attempts})...`);
        const res = await apiFetch<AdminData>('/content');
        if (res.success && res.data) {
          setData({ ...res.data, users: res.data.users || [] });
          setDbConnected(true);
          setDbError(null);
          setIsLoading(false);
          console.log('[BrightAfrican] ✅ Connecté à MongoDB Atlas avec succès !');
          return;
        }
      } catch (err) {
        console.warn(`[BrightAfrican] ⚠️ Tentative ${attempt}/${attempts} échouée:`, err);
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
      console.log('[BrightAfrican] ✅ Données sauvegardées dans MongoDB Atlas');
    } else {
      setSyncError(
        'La sauvegarde a échoué. La base de données est peut-être hors ligne. ' +
        'Vos modifications sont visibles ici mais ne sont pas encore enregistrées.'
      );
      setDbConnected(false);
      console.error('[BrightAfrican] ❌ Échec sauvegarde cloud');
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
      (trimUser === 'admin' || trimUser === 'administrator' || trimUser === 'brightafrica') &&
      password === 'BrightAfrica2026'
    ) {
      const user: AdminUser = {
        id: 'super-admin',
        username: 'admin',
        name: 'Administrateur Principal',
        email: 'admin@brightafrica.org',
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
    return { success: true, message: 'Félicitations ! Vous êtes désormais inscrit à la newsletter de l\'ONG Bright African.' };
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
      ? `L'ONG Bright African a le plaisir de vous annoncer le lancement de son nouveau projet : "${params.title}". ${params.excerpt}`
      : `Découvrez la dernière actualité de l'ONG Bright African : "${params.title}". ${params.excerpt}`;
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
        isAuthenticated, currentUser, login, logout,
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
