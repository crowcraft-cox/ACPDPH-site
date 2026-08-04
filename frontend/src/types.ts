/* ===== BRIGHT AFRICAN — Shared Types ===== */

export interface ImpactCounter {
  id: string;
  value: number;
  label: string;
  label_en?: string;
  color: 'ba-red' | 'ba-green';
}

export interface Pillar {
  id: string;
  title: string;
  title_en?: string;
  description: string;
  description_en?: string;
  image: string;
  color: 'ba-red' | 'ba-green';
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
  excerpt: string;
  excerpt_en?: string;
  content?: string;
  content_en?: string;
  date: string;
  category: string;
  category_en?: string;
  color: 'ba-red' | 'ba-green';
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
}

export interface ContactInfo {
  address: string;
  email: string;
  phone: string;
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

export interface NewsletterLog {
  id: string;
  subject: string;
  content: string;
  type: 'PROJECT' | 'NEWS' | 'DIRECT';
  sentAt: string;
  recipientCount: number;
}

export interface AdminData {
  impact: ImpactCounter[];
  pillars: Pillar[];
  news: NewsArticle[];
  projects: Project[];
  contact: ContactInfo;
  users?: AdminUser[];
  subscribers?: Subscriber[];
  newsletterLogs?: NewsletterLog[];
}

