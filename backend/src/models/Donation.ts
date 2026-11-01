import mongoose, { Schema, Document } from 'mongoose';

export interface IDonation extends Document {
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
  createdAt: Date;
}

const DonationSchema: Schema = new Schema({
  reference: { type: String, unique: true, index: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  frequency: { type: String, enum: ['monthly', 'single'], default: 'monthly' },
  firstName: { type: String },
  lastName: { type: String },
  name: { type: String, required: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  phone: { type: String, trim: true },
  country: { type: String, default: 'RDC' },
  newsletter: { type: Boolean, default: false },
  paymentMethod: { type: String, default: 'MOBILE_MONEY' },
  paymentProvider: { type: String },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IDonation>('Donation', DonationSchema);
