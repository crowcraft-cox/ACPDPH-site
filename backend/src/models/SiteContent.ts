import mongoose, { Schema, Document } from 'mongoose';

export interface ISiteContent extends Document {
  key: string;
  impact: any[];
  pillars: any[];
  news: any[];
  projects: any[];
  contact: {
    address: string;
    email: string;
    phone: string;
    whatsapp?: string;
  };
  users?: any[];
  updatedAt: Date;
}

const SiteContentSchema: Schema = new Schema(
  {
    key: { type: String, required: true, unique: true, default: 'main_site_content' },
    impact: { type: Array, default: [] },
    pillars: { type: Array, default: [] },
    news: { type: Array, default: [] },
    projects: { type: Array, default: [] },
    contact: {
      address: { type: String, default: '' },
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
      whatsapp: { type: String, default: '' },
    },
    users: { type: Array, default: [] },
  },
  { timestamps: true }
);

export default mongoose.model<ISiteContent>('SiteContent', SiteContentSchema);
