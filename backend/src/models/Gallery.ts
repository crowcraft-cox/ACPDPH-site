import mongoose, { Schema, Document } from 'mongoose';

export interface IGalleryItem extends Document {
  title: string;
  alt: string;
  caption?: string;
  type: 'image' | 'video' | 'youtube';
  url: string;
  thumbnailUrl?: string;
  youtubeId?: string;
  date: Date;
  order: number;
  active: boolean;
  fileSize?: number;
  mimeType?: string;
}

const GallerySchema = new Schema<IGalleryItem>({
  title: { type: String, required: true, trim: true },
  alt: { type: String, required: true, trim: true },
  caption: { type: String, trim: true },
  type: { type: String, enum: ['image', 'video', 'youtube'], required: true },
  url: { type: String, required: true },
  thumbnailUrl: { type: String },
  youtubeId: { type: String },
  date: { type: Date, default: Date.now },
  order: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
  fileSize: { type: Number },
  mimeType: { type: String },
}, { timestamps: true });

GallerySchema.index({ order: 1, date: -1 });
GallerySchema.index({ type: 1, active: 1 });

export default mongoose.model<IGalleryItem>('Gallery', GallerySchema);
