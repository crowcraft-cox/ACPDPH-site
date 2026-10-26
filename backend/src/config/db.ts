import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  try {
    const connStr = process.env.MONGODB_URI?.trim();
    if (!connStr) {
      console.warn('[MongoDB Atlas] Avertissement: MONGODB_URI non defini dans .env.');
      console.warn('[MongoDB Atlas] Le backend tourne en mode autonome (routes avec fallbacks).');
      return;
    }

    const conn = await mongoose.connect(connStr);
    console.log(`[MongoDB Atlas] Connecte avec succes: ${conn.connection.host} / DB: ${conn.connection.name}`);
  } catch (error) {
    console.error('[MongoDB Atlas] Erreur de connexion:', error);
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

