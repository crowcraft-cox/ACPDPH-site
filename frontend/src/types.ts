/* ===== ACPDPH — Shared Types ===== */

export interface GalleryItem {
  _id: string;
  title: string;
  alt: string;
  caption?: string;
  type: 'image' | 'video' | 'youtube';
  url: string;
  thumbnailUrl?: string;
  youtubeId?: string;
  date: string;
  order: number;
  active?: boolean;
  sourceCategory?: string;
  sourceLink?: string;
  fileSize?: number;
  mimeType?: string;
}

export interface ImpactCounter {
  id: string;
  value: number;
  label: string;
  label_en?: string;
  color: 'ba-red' | 'ba-green' | 'ba-blue';
}

export interface Pillar {
  id: string;
  title: string;
  title_en?: string;
  description: string;
  description_en?: string;
  image: string;
  color: 'ba-red' | 'ba-green' | 'ba-blue';
  gradient: string;
  bulletPoints: string[];
  bulletPoints_en?: string[];
}

export interface NewsImage {
  id: string;
  url: string;
  caption?: string;
  caption_en?: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  title_en?: string;
  hookTitle?: string;
  excerpt: string;
  excerpt_en?: string;
  content?: string;
  content_en?: string;
  date: string;
  category: string;
  category_en?: string;
  color: 'ba-red' | 'ba-green' | 'ba-blue';
  image?: string;
  images?: NewsImage[];
}

export interface ProjectImage {
  id: string;
  url: string;
  caption?: string;
  caption_en?: string;
}

export interface Project {
  id: string;
  title: string;
  title_en?: string;
  hookTitle?: string;
  location: string;
  type: string;
  type_en?: string;
  status: 'En cours' | 'Achevé' | 'En planification';
  status_en?: string;
  description: string;
  description_en?: string;
  color: string;
  image: string;
  images?: ProjectImage[];
  date?: string;
}

export interface JobOffer {
  id: string;
  title: string;
  location: string;
  contractType: 'CDI' | 'CDD' | 'Stage' | 'Consultance' | 'Bénévolat';
  contractPrecision?: string;
  description?: string;
  missions?: string[];
  profile?: string;
  applicationDossier?: string;
  deadline?: string;
  applicationLink?: string;
  createdAt: string;
}

export interface CandidateApplicationDocument {
  filename: string;
  originalname: string;
  size: number;
  mimetype: string;
  path?: string;
}

export interface CandidateApplication {
  _id?: string;
  id?: string;
  reference?: string;
  jobId: string;
  jobTitle: string;
  nom: string;
  postnom?: string;
  prenom: string;
  dateNaissance: string;
  sexe: 'Homme' | 'Femme';
  email: string;
  telephone: string;
  adresse?: string;
  ville?: string;
  province?: string;
  pays?: string;
  niveauEducation: string;
  langues?: Array<{ langue: string; niveau: string }>;
  experiences?: Array<{ titrePoste: string; organisation: string; anneesExperience: string }>;
  enSituationHandicap?: 'Oui' | 'Non' | 'Préfère ne pas répondre';
  amenagementsSouhaites?: string;
  documents?: {
    cv?: CandidateApplicationDocument;
    coverLetter?: CandidateApplicationDocument;
    certificates?: CandidateApplicationDocument[];
  };
  cvFileName?: string;
  coverLetterFileName?: string;
  certificatesCount?: number;
  createdAt: string;
}

export interface ContactInfo {
  address: string;
  email: string;
  phone: string;
  whatsapp?: string;
}

export interface AdminUser {
  id: string;
  username: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'EDITOR';
  password?: string;
  createdAt: string;
}

export interface Subscriber {
  id?: string;
  email: string;
  subscribedAt: string;
}

export interface DonationItem {
  _id: string;
  reference: string;
  amount: number;
  currency: string;
  frequency: 'monthly' | 'single';
  firstName?: string;
  lastName?: string;
  name: string;
  email: string;
  phone?: string;
  country?: string;
  newsletter?: boolean;
  paymentMethod: string;
  paymentProvider?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  notes?: string;
  createdAt: string;
}

export interface NewsletterLog {
  id: string;
  subject: string;
  content: string;
  type: 'PROJECT' | 'NEWS' | 'DIRECT';
  sentAt: string;
  recipientCount: number;
}

export interface BankAccount {
  id: string;
  bankName: string;
  accountName: string;
  agency: string;
  accountNumber: string;
  swift: string;
  currency: string;
  iban?: string;
  notes?: string;
  active?: boolean;
}

export type GovernanceOrganKey = 'board' | 'audit' | 'secretariat';

export interface GovernanceMember {
  id: string;
  name: string;
  role: string;
  organ: GovernanceOrganKey;
  order?: number;
}

export interface AdminData {
  impact: ImpactCounter[];
  pillars: Pillar[];
  news: NewsArticle[];
  projects: Project[];
  jobs?: JobOffer[];
  applications?: CandidateApplication[];
  donations?: DonationItem[];
  contact: ContactInfo;
  users?: AdminUser[];
  subscribers?: Subscriber[];
  newsletterLogs?: NewsletterLog[];
  gallery?: GalleryItem[];
  bankAccounts?: BankAccount[];
  governanceMembers?: GovernanceMember[];
}
