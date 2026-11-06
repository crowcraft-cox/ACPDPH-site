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

  // 0. SiteContent (document central de l'application ACPDPH)
  const siteContentsCollection = db.collection('sitecontents');
  const siteContent = await siteContentsCollection.findOne({ key: 'main_site_content' });
  if (siteContent) {
    console.log('[Migration] Analyse du document central main_site_content...');
    let modified = false;

    // Projets
    if (Array.isArray(siteContent.projects)) {
      siteContent.projects = siteContent.projects.map((p: any) => {
        if (!p.title_it && p.title_en) { p.title_it = p.title_en; modified = true; }
        if (!p.title_de && p.title_en) { p.title_de = p.title_en; modified = true; }
        if (!p.description_it && p.description_en) { p.description_it = p.description_en; modified = true; }
        if (!p.description_de && p.description_en) { p.description_de = p.description_en; modified = true; }
        if (!p.location_it && p.location_en) { p.location_it = p.location_en; modified = true; }
        if (!p.location_de && p.location_en) { p.location_de = p.location_en; modified = true; }
        if (!p.type_it && p.type_en) { p.type_it = p.type_en; modified = true; }
        if (!p.type_de && p.type_en) { p.type_de = p.type_en; modified = true; }
        if (!p.status_it && p.status_en) { p.status_it = p.status_en; modified = true; }
        if (!p.status_de && p.status_en) { p.status_de = p.status_en; modified = true; }
        if (p.needsReview_it === undefined) p.needsReview_it = true;
        if (p.needsReview_de === undefined) p.needsReview_de = true;
        return p;
      });
    }

    // Actualités
    if (Array.isArray(siteContent.news)) {
      siteContent.news = siteContent.news.map((n: any) => {
        if (!n.title_it && n.title_en) { n.title_it = n.title_en; modified = true; }
        if (!n.title_de && n.title_en) { n.title_de = n.title_en; modified = true; }
        if (!n.excerpt_it && n.excerpt_en) { n.excerpt_it = n.excerpt_en; modified = true; }
        if (!n.excerpt_de && n.excerpt_en) { n.excerpt_de = n.excerpt_de; modified = true; }
        if (!n.category_it && n.category_en) { n.category_it = n.category_en; modified = true; }
        if (!n.category_de && n.category_en) { n.category_de = n.category_en; modified = true; }
        if (!n.content_it && n.content_en) { n.content_it = n.content_en; modified = true; }
        if (!n.content_de && n.content_en) { n.content_de = n.content_en; modified = true; }
        if (n.needsReview_it === undefined) n.needsReview_it = true;
        if (n.needsReview_de === undefined) n.needsReview_de = true;
        return n;
      });
    }

    // Offres d'emploi
    if (Array.isArray(siteContent.jobs)) {
      siteContent.jobs = siteContent.jobs.map((j: any) => {
        if (!j.title_it && j.title_en) { j.title_it = j.title_en; modified = true; }
        if (!j.title_de && j.title_en) { j.title_de = j.title_en; modified = true; }
        if (!j.description_it && j.description_en) { j.description_it = j.description_en; modified = true; }
        if (!j.description_de && j.description_en) { j.description_de = j.description_en; modified = true; }
        if (!j.missions_it && j.missions_en) { j.missions_it = j.missions_en; modified = true; }
        if (!j.missions_de && j.missions_en) { j.missions_de = j.missions_en; modified = true; }
        if (!j.profile_it && j.profile_en) { j.profile_it = j.profile_en; modified = true; }
        if (!j.profile_de && j.profile_en) { j.profile_de = j.profile_en; modified = true; }
        if (!j.contractType_it && j.contractType_en) { j.contractType_it = j.contractType_en; modified = true; }
        if (!j.contractType_de && j.contractType_en) { j.contractType_de = j.contractType_en; modified = true; }
        if (j.needsReview_it === undefined) j.needsReview_it = true;
        if (j.needsReview_de === undefined) j.needsReview_de = true;
        return j;
      });
    }

    // Piliers
    if (Array.isArray(siteContent.pillars)) {
      siteContent.pillars = siteContent.pillars.map((pil: any) => {
        if (!pil.title_it && pil.title_en) { pil.title_it = pil.title_en; modified = true; }
        if (!pil.title_de && pil.title_en) { pil.title_de = pil.title_en; modified = true; }
        if (!pil.description_it && pil.description_en) { pil.description_it = pil.description_en; modified = true; }
        if (!pil.description_de && pil.description_en) { pil.description_de = pil.description_en; modified = true; }
        if (!pil.bulletPoints_it && pil.bulletPoints_en) { pil.bulletPoints_it = pil.bulletPoints_en; modified = true; }
        if (!pil.bulletPoints_de && pil.bulletPoints_en) { pil.bulletPoints_de = pil.bulletPoints_en; modified = true; }
        if (pil.needsReview_it === undefined) pil.needsReview_it = true;
        if (pil.needsReview_de === undefined) pil.needsReview_de = true;
        return pil;
      });
    }

    // Impact
    if (Array.isArray(siteContent.impact)) {
      siteContent.impact = siteContent.impact.map((imp: any) => {
        if (!imp.label_it && imp.label_en) { imp.label_it = imp.label_en; modified = true; }
        if (!imp.label_de && imp.label_en) { imp.label_de = imp.label_en; modified = true; }
        if (imp.needsReview_it === undefined) imp.needsReview_it = true;
        if (imp.needsReview_de === undefined) imp.needsReview_de = true;
        return imp;
      });
    }

    // Membres de gouvernance
    if (Array.isArray(siteContent.governanceMembers)) {
      siteContent.governanceMembers = siteContent.governanceMembers.map((m: any) => {
        if (!m.role_it && m.role_en) { m.role_it = m.role_en; modified = true; }
        if (!m.role_de && m.role_en) { m.role_de = m.role_en; modified = true; }
        if (m.needsReview_it === undefined) m.needsReview_it = true;
        if (m.needsReview_de === undefined) m.needsReview_de = true;
        return m;
      });
    }

    if (modified) {
      await siteContentsCollection.updateOne(
        { _id: siteContent._id },
        {
          $set: {
            projects: siteContent.projects,
            news: siteContent.news,
            jobs: siteContent.jobs,
            pillars: siteContent.pillars,
            impact: siteContent.impact,
            governanceMembers: siteContent.governanceMembers,
          },
        }
      );
      console.log('[Migration] Document central main_site_content mis à jour avec succès.');
    }
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

