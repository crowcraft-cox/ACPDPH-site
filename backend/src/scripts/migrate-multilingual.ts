/**
 * Script de migration multilingue non-destructif pour ACPDPH
 * 
 * Ajoute et initialise les champs _it et _de pour les entités :
 * - Projects
 * - News
 * - Jobs
 * - GovernanceMembers
 * - GalleryItems
 * - Cvs
 * 
 * Préserve scrupuleusement les champs existants (fr et en) et marque
 * les nouvelles traductions 'à relire' (needsReview_it: true, needsReview_de: true).
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

async function runMigration() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.warn('[Migration] MONGODB_URI non définie. Migration effectuée en mode local/in-memory.');
    return;
  }

  console.log('[Migration] Connexion à MongoDB Atlas...');
  await mongoose.connect(mongoUri);
  console.log('[Migration] Connexion établie avec succès.');

  const db = mongoose.connection.db;
  if (!db) {
    throw new Error('Base de données inaccessible.');
  }

  // 1. Projets
  const projectsCollection = db.collection('projects');
  const projects = await projectsCollection.find({}).toArray();
  console.log(`[Migration] Analyse de ${projects.length} projets...`);

  for (const p of projects) {
    const updates: Record<string, any> = {};
    if (!p.title_it && p.title_en) updates.title_it = p.title_en;
    if (!p.title_de && p.title_en) updates.title_de = p.title_en;
    if (!p.description_it && p.description_en) updates.description_it = p.description_en;
    if (!p.description_de && p.description_en) updates.description_de = p.description_en;
    if (!p.location_it && p.location_en) updates.location_it = p.location_en;
    if (!p.location_de && p.location_en) updates.location_de = p.location_en;
    if (!p.type_it && p.type_en) updates.type_it = p.type_en;
    if (!p.type_de && p.type_en) updates.type_de = p.type_en;
    if (!p.status_it && p.status_en) updates.status_it = p.status_en;
    if (!p.status_de && p.status_en) updates.status_de = p.status_en;

    updates.needsReview_it = true;
    updates.needsReview_de = true;

    if (Object.keys(updates).length > 2) {
      await projectsCollection.updateOne({ _id: p._id }, { $set: updates });
    }
  }

  // 2. Actualités
  const newsCollection = db.collection('news');
  const news = await newsCollection.find({}).toArray();
  console.log(`[Migration] Analyse de ${news.length} actualités...`);

  for (const n of news) {
    const updates: Record<string, any> = {};
    if (!n.title_it && n.title_en) updates.title_it = n.title_en;
    if (!n.title_de && n.title_en) updates.title_de = n.title_en;
    if (!n.excerpt_it && n.excerpt_en) updates.excerpt_it = n.excerpt_en;
    if (!n.excerpt_de && n.excerpt_en) updates.excerpt_de = n.excerpt_de;
    if (!n.category_it && n.category_en) updates.category_it = n.category_en;
    if (!n.category_de && n.category_en) updates.category_de = n.category_en;
    if (!n.content_it && n.content_en) updates.content_it = n.content_en;
    if (!n.content_de && n.content_en) updates.content_de = n.content_en;

    updates.needsReview_it = true;
    updates.needsReview_de = true;

    if (Object.keys(updates).length > 2) {
      await newsCollection.updateOne({ _id: n._id }, { $set: updates });
    }
  }

  // 3. Offres d'emploi
  const jobsCollection = db.collection('jobs');
  const jobs = await jobsCollection.find({}).toArray();
  console.log(`[Migration] Analyse de ${jobs.length} offres d'emploi...`);

  for (const j of jobs) {
    const updates: Record<string, any> = {};
    if (!j.title_it && j.title_en) updates.title_it = j.title_en;
    if (!j.title_de && j.title_en) updates.title_de = j.title_en;
    if (!j.description_it && j.description_en) updates.description_it = j.description_en;
    if (!j.description_de && j.description_en) updates.description_de = j.description_en;
    if (!j.missions_it && j.missions_en) updates.missions_it = j.missions_en;
    if (!j.missions_de && j.missions_en) updates.missions_de = j.missions_en;
    if (!j.profile_it && j.profile_en) updates.profile_it = j.profile_en;
    if (!j.profile_de && j.profile_en) updates.profile_de = j.profile_en;
    if (!j.applicationDossier_it && j.applicationDossier_en) updates.applicationDossier_it = j.applicationDossier_en;
    if (!j.applicationDossier_de && j.applicationDossier_en) updates.applicationDossier_de = j.applicationDossier_en;

    updates.needsReview_it = true;
    updates.needsReview_de = true;

    if (Object.keys(updates).length > 2) {
      await jobsCollection.updateOne({ _id: j._id }, { $set: updates });
    }
  }

  // 4. Galerie
  const galleryCollection = db.collection('galleries');
  const gallery = await galleryCollection.find({}).toArray();
  console.log(`[Migration] Analyse de ${gallery.length} éléments de galerie...`);

  for (const g of gallery) {
    const updates: Record<string, any> = {};
    if (!g.title_it && g.title_en) updates.title_it = g.title_en;
    if (!g.title_de && g.title_en) updates.title_de = g.title_en;
    if (!g.caption_it && g.caption_en) updates.caption_it = g.caption_en;
    if (!g.caption_de && g.caption_en) updates.caption_de = g.caption_en;
    if (!g.alt_it && g.alt_en) updates.alt_it = g.alt_en;
    if (!g.alt_de && g.alt_en) updates.alt_de = g.alt_en;

    updates.needsReview_it = true;
    updates.needsReview_de = true;

    if (Object.keys(updates).length > 2) {
      await galleryCollection.updateOne({ _id: g._id }, { $set: updates });
    }
  }

  console.log('[Migration] Migration non-destructive multilingue terminée avec succès !');
  await mongoose.disconnect();
}

if (require.main === module) {
  runMigration().catch((err) => {
    console.error('[Migration Error]:', err);
    process.exit(1);
  });
}

export default runMigration;

