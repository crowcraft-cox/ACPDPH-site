/* ===== ACPDPH — Shared Types ===== */

export interface GalleryItem {
  _id: string;
  title: string;
  title_en?: string;
  title_it?: string;
  title_de?: string;
  alt: string;
  alt_en?: string;
  alt_it?: string;
  alt_de?: string;
  caption?: string;
  caption_en?: string;
  caption_it?: string;
  caption_de?: string;
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
  needsReview_en?: boolean;
  needsReview_it?: boolean;
  needsReview_de?: boolean;
}

export interface ImpactCounter {
  id: string;
  value: number;
  label: string;
  label_en?: string;
  label_it?: string;
  label_de?: string;
  color: 'ba-red' | 'ba-green' | 'ba-blue';
  needsReview_en?: boolean;
  needsReview_it?: boolean;
  needsReview_de?: boolean;
}

export interface Pillar {
  id: string;
  title: string;
  title_en?: string;
  title_it?: string;
  title_de?: string;
  description: string;
  description_en?: string;
  description_it?: string;
  description_de?: string;
  image: string;
  color: 'ba-red' | 'ba-green' | 'ba-blue';
  gradient: string;
  bulletPoints: string[];
  bulletPoints_en?: string[];
  bulletPoints_it?: string[];
  bulletPoints_de?: string[];
  needsReview_en?: boolean;
  needsReview_it?: boolean;
  needsReview_de?: boolean;
}

export interface NewsImage {
  id: string;
  url: string;
  caption?: string;
  caption_en?: string;
  caption_it?: string;
  caption_de?: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  title_en?: string;
  title_it?: string;
  title_de?: string;
  hookTitle?: string;
  excerpt: string;
  excerpt_en?: string;
  excerpt_it?: string;
  excerpt_de?: string;
  content?: string;
  content_en?: string;
  content_it?: string;
  content_de?: string;
  date: string;
  category: string;
  category_en?: string;
  category_it?: string;
  category_de?: string;
  color: 'ba-red' | 'ba-green' | 'ba-blue';
  image?: string;
  images?: NewsImage[];
  needsReview_en?: boolean;
  needsReview_it?: boolean;
  needsReview_de?: boolean;
}

export interface ProjectImage {
  id: string;
  url: string;
  caption?: string;
  caption_en?: string;
  caption_it?: string;
  caption_de?: string;
}

export interface Project {
  id: string;
  title: string;
  title_en?: string;
  title_it?: string;
  title_de?: string;
  hookTitle?: string;
  location: string;
  location_en?: string;
  location_it?: string;
  location_de?: string;
  type: string;
  type_en?: string;
  type_it?: string;
  type_de?: string;
  status: 'En cours' | 'Achevé' | 'En planification';
  status_en?: string;
  status_it?: string;
  status_de?: string;
  description: string;
  description_en?: string;
  description_it?: string;
  description_de?: string;
  color: string;
  image: string;
  images?: ProjectImage[];
  date?: string;
  needsReview_en?: boolean;
  needsReview_it?: boolean;
  needsReview_de?: boolean;
}

export interface JobOffer {
  id: string;
  title: string;
  title_en?: string;
  title_it?: string;
  title_de?: string;
  location: string;
  location_en?: string;
  location_it?: string;
  location_de?: string;
  contractType: 'CDI' | 'CDD' | 'Stage' | 'Consultance' | 'Bénévolat';
  contractType_en?: string;
  contractType_it?: string;
  contractType_de?: string;
  contractPrecision?: string;
  contractPrecision_en?: string;
  contractPrecision_it?: string;
  contractPrecision_de?: string;
  description?: string;
  description_en?: string;
  description_it?: string;
  description_de?: string;
  missions?: string[];
  missions_en?: string[];
  missions_it?: string[];
  missions_de?: string[];
  profile?: string;
  profile_en?: string;
  profile_it?: string;
  profile_de?: string;
  applicationDossier?: string;
  applicationDossier_en?: string;
  applicationDossier_it?: string;
  applicationDossier_de?: string;
  deadline?: string;
  applicationLink?: string;
  createdAt: string;
  needsReview_en?: boolean;
  needsReview_it?: boolean;
  needsReview_de?: boolean;
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
  role_en?: string;
  role_it?: string;
  role_de?: string;
  organ: GovernanceOrganKey;
  order?: number;
  photo?: string;
  needsReview_en?: boolean;
  needsReview_it?: boolean;
  needsReview_de?: boolean;
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
  cvs?: MemberCv[];
}

export interface MemberCvContact {
  phone?: string;
  email?: string;
  address?: string;
}

export interface MemberCvLanguage {
  name: string;
  level: number;
}

export interface MemberCvExperience {
  title: string;
  organization: string;
  period: string;
  bullets: string[];
}

export interface MemberCvEducation {
  institution: string;
  degree: string;
  period: string;
}

export interface MemberCvVisibility {
  phone: boolean;
  email: boolean;
  address: boolean;
}

export interface MemberCv {
  id?: string;
  memberId: string;
  slug: string;
  givenNames: string;
  familyNames: string;
  role: string;
  role_en?: string;
  role_it?: string;
  role_de?: string;
  about: string;
  about_en?: string;
  about_it?: string;
  about_de?: string;
  contact: MemberCvContact;
  skills: string[];
  skills_en?: string[];
  skills_it?: string[];
  skills_de?: string[];
  languages: MemberCvLanguage[];
  experiences: MemberCvExperience[];
  experiences_en?: MemberCvExperience[];
  experiences_it?: MemberCvExperience[];
  experiences_de?: MemberCvExperience[];
  education: MemberCvEducation[];
  education_en?: MemberCvEducation[];
  education_it?: MemberCvEducation[];
  education_de?: MemberCvEducation[];
  photo?: string;
  visibility: MemberCvVisibility;
  published: boolean;
  updatedAt?: string;
  needsReview_en?: boolean;
  needsReview_it?: boolean;
  needsReview_de?: boolean;
}
