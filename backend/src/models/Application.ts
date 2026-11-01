import mongoose, { Schema, Document } from 'mongoose';

export interface IApplicationDocument {
  filename: string;
  originalname: string;
  size: number;
  mimetype: string;
  path: string;
}

export interface IApplication extends Document {
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
  documents: {
    cv?: IApplicationDocument;
    coverLetter?: IApplicationDocument;
    certificates?: IApplicationDocument[];
  };
  consentement: boolean;
  createdAt: Date;
}

const ApplicationSchema: Schema = new Schema({
  jobId: { type: String, required: true },
  jobTitle: { type: String, required: true },
  nom: { type: String, required: true },
  postnom: { type: String, default: '' },
  prenom: { type: String, required: true },
  dateNaissance: { type: String, required: true },
  sexe: { type: String, enum: ['Homme', 'Femme'], required: true },
  email: { type: String, required: true },
  telephone: { type: String, required: true },
  adresse: { type: String, default: '' },
  ville: { type: String, default: '' },
  province: { type: String, default: '' },
  pays: { type: String, default: 'République démocratique du Congo' },
  niveauEducation: { type: String, required: true },
  langues: [
    {
      langue: { type: String },
      niveau: { type: String },
    },
  ],
  experiences: [
    {
      titrePoste: { type: String },
      organisation: { type: String },
      anneesExperience: { type: String },
    },
  ],
  enSituationHandicap: { type: String, default: 'Préfère ne pas répondre' },
  amenagementsSouhaites: { type: String, default: '' },
  documents: {
    cv: {
      filename: String,
      originalname: String,
      size: Number,
      mimetype: String,
      path: String,
    },
    coverLetter: {
      filename: String,
      originalname: String,
      size: Number,
      mimetype: String,
      path: String,
    },
    certificates: [
      {
        filename: String,
        originalname: String,
        size: Number,
        mimetype: String,
        path: String,
      },
    ],
  },
  consentement: { type: Boolean, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IApplication>('Application', ApplicationSchema);

