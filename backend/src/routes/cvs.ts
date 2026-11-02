import { Router, Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
// @ts-ignore
import multer from 'multer';
import mammoth from 'mammoth';
import { authMiddleware } from '../middleware/authMiddleware';
import SiteContent from '../models/SiteContent';

const router = Router();

// ── Upload directory for member custom photos ─────────────────────────────────
const PHOTO_DIR = path.join(process.cwd(), 'uploads', 'membres');
if (!fs.existsSync(PHOTO_DIR)) {
  fs.mkdirSync(PHOTO_DIR, { recursive: true });
}

// ── Multer Storage: Photo upload ──────────────────────────────────────────────
const photoStorage = (multer as any).diskStorage({
  destination: (_req: any, _file: any, cb: any) => cb(null, PHOTO_DIR),
  filename: (_req: any, file: any, cb: any) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const cleanBase = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 30);
    const unique = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    cb(null, `cv-${unique}-${cleanBase}${ext}`);
  },
});

const uploadPhoto = (multer as any)({
  storage: photoStorage,
  limits: { fileSize: 3 * 1024 * 1024 }, // 3 Mo max
  fileFilter: (_req: any, file: any, cb: any) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
    const allowedExts = ['.jpg', '.jpeg', '.png', '.webp'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedMimes.includes(file.mimetype) && allowedExts.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Format d\'image non autorisé. Formats acceptés : JPEG, PNG, WebP (max 3 Mo).'));
    }
  },
});

// ── Multer Storage: DOCX parsing (in-memory) ──────────────────────────────────
const uploadDocx = (multer as any)({
  storage: (multer as any).memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 Mo max
});

// ── Helper: Normalisation de chaîne ────────────────────────────────────────────
function normalizeKey(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

// ── Helper: Slugify ───────────────────────────────────────────────────────────
function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

// ── POST /api/v1/cvs/parse : Extraction et vérification d'un fichier .docx ──────
router.post('/parse', authMiddleware, uploadDocx.single('file'), async (req: Request, res: Response) => {
  try {
    const file = (req as any).file;
    if (!file || !file.buffer) {
      return res.status(400).json({
        success: false,
        message: 'Aucun fichier transmis. Veuillez sélectionner un document Word (.docx).',
      });
    }

    const buffer: Buffer = file.buffer;

    // 1. Contrôle de signature ZIP PK (0x50, 0x4B, 0x03, 0x04)
    if (
      buffer.length < 4 ||
      buffer[0] !== 0x50 ||
      buffer[1] !== 0x4b ||
      buffer[2] !== 0x03 ||
      buffer[3] !== 0x04
    ) {
      return res.status(400).json({
        success: false,
        message: 'Format de fichier invalide. Seuls les fichiers Word (.docx) authentiques sont acceptés (signature PK requise).',
      });
    }

    // 2. Vérification de structure word/document.xml et absence de macros vba
    const bufferStr = buffer.toString('binary');
    if (!bufferStr.includes('word/document.xml')) {
      return res.status(400).json({
        success: false,
        message: 'Le fichier ne contient pas la structure d\'un document Word valide (word/document.xml absent).',
      });
    }

    if (bufferStr.includes('vbaProject.bin') || bufferStr.includes('word/vbaData.xml')) {
      return res.status(400).json({
        success: false,
        message: 'Sécurité : Les fichiers Word contenant des macros (.docm ou scripts VBA) sont strictement interdits.',
      });
    }

    // 3. Extraction avec Mammoth
    const textResult = await mammoth.extractRawText({ buffer });
    const rawText = textResult.value || '';

    // Découpage par lignes
    const lines = rawText
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0 && !l.startsWith('MODÈLE DE CV') && !l.startsWith('Consignes de remplissage'));

    // Structure de données CV extraite
    const cv: any = {
      givenNames: '',
      familyNames: '',
      role: '',
      about: '',
      contact: {
        phone: '',
        email: '',
        address: '',
      },
      skills: [] as string[],
      languages: [] as { name: string; level: number }[],
      experiences: [] as { title: string; organization: string; period: string; bullets: string[] }[],
      education: [] as { institution: string; degree: string; period: string }[],
      visibility: {
        phone: false,
        email: false,
        address: false,
      },
      published: true,
    };

    let currentSection = '';
    let currentExp: any = null;
    let currentEdu: any = null;

    for (const line of lines) {
      const norm = normalizeKey(line);

      // Détection des sections principales
      if (norm === 'identite' || norm.startsWith('identite')) {
        currentSection = 'identite';
        continue;
      }
      if (norm === 'a propos' || norm === 'a-propos' || norm === 'profil' || norm === 'biographie') {
        currentSection = 'about';
        continue;
      }
      if (norm === 'contact' || norm === 'coordonnees') {
        currentSection = 'contact';
        continue;
      }
      if (norm === 'competences' || norm === 'competence' || norm === 'skills') {
        currentSection = 'skills';
        continue;
      }
      if (norm === 'langues' || norm === 'langue' || norm === 'languages') {
        currentSection = 'languages';
        continue;
      }
      if (norm === 'experience' || norm === 'experiences' || norm === 'parcours' || norm === 'parcours professionnel') {
        currentSection = 'experiences';
        continue;
      }
      if (norm === 'formation' || norm === 'formations' || norm === 'education' || norm === 'etudes') {
        currentSection = 'education';
        continue;
      }

      // Traitement selon la section active
      if (currentSection === 'identite') {
        const lower = line.toLowerCase();
        if (lower.startsWith('prenom(s)') || lower.startsWith('prenoms') || lower.startsWith('prenom')) {
          cv.givenNames = line.replace(/^[^:]*:\s*/i, '').trim();
        } else if (lower.startsWith('nom(s)') || lower.startsWith('noms') || lower.startsWith('nom')) {
          cv.familyNames = line.replace(/^[^:]*:\s*/i, '').trim();
        } else if (lower.startsWith('fonction') || lower.startsWith('titre') || lower.startsWith('role')) {
          cv.role = line.replace(/^[^:]*:\s*/i, '').trim();
        }
      } else if (currentSection === 'about') {
        cv.about = cv.about ? `${cv.about}\n${line}` : line;
      } else if (currentSection === 'contact') {
        const lower = line.toLowerCase();
        if (lower.startsWith('telephone') || lower.startsWith('tel') || lower.startsWith('phone')) {
          cv.contact.phone = line.replace(/^[^:]*:\s*/i, '').trim();
        } else if (lower.startsWith('e-mail') || lower.startsWith('email') || lower.startsWith('mail')) {
          cv.contact.email = line.replace(/^[^:]*:\s*/i, '').trim();
        } else if (lower.startsWith('adresse') || lower.startsWith('address') || lower.startsWith('ville')) {
          cv.contact.address = line.replace(/^[^:]*:\s*/i, '').trim();
        }
      } else if (currentSection === 'skills') {
        const cleanSkill = line.replace(/^[•\-\*\d\.\)\s]+/, '').trim();
        if (cleanSkill.length > 0) {
          cv.skills.push(cleanSkill);
        }
      } else if (currentSection === 'languages') {
        const match = line.match(/^(.+?)\s*[-–—:]\s*(\d+)\s*%?$/);
        if (match) {
          const name = match[1].replace(/^[•\-\*\s]+/, '').trim();
          let level = parseInt(match[2], 10);
          if (isNaN(level)) level = 100;
          level = Math.max(0, Math.min(100, level));
          cv.languages.push({ name, level });
        } else {
          const cleanLang = line.replace(/^[•\-\*\s]+/, '').trim();
          if (cleanLang.length > 0) {
            cv.languages.push({ name: cleanLang, level: 80 });
          }
        }
      } else if (currentSection === 'experiences') {
        const lower = line.toLowerCase();
        if (lower.startsWith('organisation') || lower.startsWith('organisme') || lower.startsWith('structure') || lower.startsWith('entreprise')) {
          if (!currentExp) {
            currentExp = { title: 'Poste', organization: '', period: '', bullets: [] };
            cv.experiences.push(currentExp);
          }
          currentExp.organization = line.replace(/^[^:]*:\s*/i, '').trim();
        } else if (lower.startsWith('periode') || lower.startsWith('période') || lower.startsWith('date') || lower.startsWith('annee')) {
          if (!currentExp) {
            currentExp = { title: 'Poste', organization: '', period: '', bullets: [] };
            cv.experiences.push(currentExp);
          }
          currentExp.period = line.replace(/^[^:]*:\s*/i, '').trim();
        } else if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
          if (currentExp) {
            currentExp.bullets.push(line.replace(/^[•\-\*\s]+/, '').trim());
          }
        } else {
          // Nouveau titre d'expérience (Titre 2)
          currentExp = {
            title: line.trim(),
            organization: '',
            period: '',
            bullets: [],
          };
          cv.experiences.push(currentExp);
        }
      } else if (currentSection === 'education') {
        const lower = line.toLowerCase();
        if (lower.startsWith('diplome') || lower.startsWith('diplôme') || lower.startsWith('titre') || lower.startsWith('certificat')) {
          if (!currentEdu) {
            currentEdu = { institution: 'Établissement', degree: '', period: '' };
            cv.education.push(currentEdu);
          }
          currentEdu.degree = line.replace(/^[^:]*:\s*/i, '').trim();
        } else if (lower.startsWith('periode') || lower.startsWith('période') || lower.startsWith('date') || lower.startsWith('annee')) {
          if (!currentEdu) {
            currentEdu = { institution: 'Établissement', degree: '', period: '' };
            cv.education.push(currentEdu);
          }
          currentEdu.period = line.replace(/^[^:]*:\s*/i, '').trim();
        } else {
          // Nouvel établissement (Titre 2)
          currentEdu = {
            institution: line.trim(),
            degree: '',
            period: '',
          };
          cv.education.push(currentEdu);
        }
      }
    }

    // Liste de contrôle et avertissements
    const sectionsFound = {
      identity: Boolean(cv.givenNames || cv.familyNames),
      about: Boolean(cv.about && cv.about.length > 10),
      contact: Boolean(cv.contact.phone || cv.contact.email || cv.contact.address),
      skills: cv.skills.length > 0,
      languages: cv.languages.length > 0,
      experiences: cv.experiences.length > 0,
      education: cv.education.length > 0,
    };

    const warnings: string[] = [];
    if (!sectionsFound.identity) warnings.push('Identité : Prénom(s) ou Nom(s) manquants.');
    if (!sectionsFound.about) warnings.push('À propos : Section courte ou non détectée.');
    if (!sectionsFound.contact) warnings.push('Contact : Aucune coordonnée (téléphone, e-mail ou adresse) détectée.');
    if (!sectionsFound.skills) warnings.push('Compétences : Aucune compétence à puce trouvée.');
    if (!sectionsFound.languages) warnings.push('Langues : Aucune langue avec pourcentage trouvée.');
    if (!sectionsFound.experiences) warnings.push('Expérience : Aucune expérience professionnelle détectée.');
    if (!sectionsFound.education) warnings.push('Formation : Aucune formation académique détectée.');

    return res.status(200).json({
      success: true,
      data: cv,
      verification: {
        sectionsFound,
        warnings,
      },
    });
  } catch (error: any) {
    console.error('Erreur lors du traitement du document Word :', error);
    return res.status(500).json({
      success: false,
      message: `Erreur lors de l'analyse du document Word : ${error.message || 'fichier non lisible.'}`,
    });
  }
});

// ── POST /api/v1/cvs/upload-photo : Upload d'une photo personnalisée pour le CV ──
router.post('/upload-photo', authMiddleware, uploadPhoto.single('photo'), (req: Request, res: Response) => {
  try {
    const file = (req as any).file;
    if (!file) {
      return res.status(400).json({ success: false, message: 'Aucun fichier image reçu.' });
    }
    const publicUrl = `/uploads/membres/${file.filename}`;
    return res.status(200).json({
      success: true,
      message: 'Photo uploadée avec succès.',
      url: publicUrl,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: `Échec de l'upload : ${error.message || 'erreur serveur.'}`,
    });
  }
});

// ── GET /api/v1/cvs : Liste des CVs ───────────────────────────────────────────
router.get('/', async (req: Request, res: Response) => {
  try {
    const content = await SiteContent.findOne({ key: 'main_site_content' });
    const cvs: any[] = (content && Array.isArray((content as any).cvs)) ? (content as any).cvs : [];

    // Vérifier si la requête provient d'un administrateur authentifié
    const authHeader = req.headers.authorization;
    const isAdmin = Boolean(authHeader && authHeader.startsWith('Bearer '));

    if (isAdmin) {
      return res.status(200).json({ success: true, data: cvs });
    }

    // Pour les visiteurs publics : renvoyer uniquement les CV publiés et filtrer contact selon visibility
    const publicCvs = cvs
      .filter((c) => c.published === true)
      .map((c) => {
        const vis = c.visibility || { phone: false, email: false, address: false };
        return {
          ...c,
          contact: {
            phone: vis.phone ? c.contact?.phone : undefined,
            email: vis.email ? c.contact?.email : undefined,
            address: vis.address ? c.contact?.address : undefined,
          },
        };
      });

    return res.status(200).json({ success: true, data: publicCvs });
  } catch (error: any) {
    console.error('Erreur récupération CVs :', error);
    return res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

// ── GET /api/v1/cvs/:slug : Récupérer un CV par son slug ───────────────────────
router.get('/:slug', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const content = await SiteContent.findOne({ key: 'main_site_content' });
    const cvs: any[] = (content && Array.isArray((content as any).cvs)) ? (content as any).cvs : [];

    const found = cvs.find((c) => c.slug === slug || slugify(c.memberId || '') === slug);

    if (!found) {
      return res.status(404).json({ success: false, message: 'Ce CV n\'est pas disponible.' });
    }

    const authHeader = req.headers.authorization;
    const isAdmin = Boolean(authHeader && authHeader.startsWith('Bearer '));

    if (!found.published && !isAdmin) {
      return res.status(404).json({ success: false, message: 'Ce CV n\'est pas disponible.' });
    }

    // Filtrer les coordonnées selon visibility si visiteur public
    if (!isAdmin) {
      const vis = found.visibility || { phone: false, email: false, address: false };
      return res.status(200).json({
        success: true,
        data: {
          ...found,
          contact: {
            phone: vis.phone ? found.contact?.phone : undefined,
            email: vis.email ? found.contact?.email : undefined,
            address: vis.address ? found.contact?.address : undefined,
          },
        },
      });
    }

    return res.status(200).json({ success: true, data: found });
  } catch (error: any) {
    console.error('Erreur récupération CV slug :', error);
    return res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

// ── POST /api/v1/cvs : Créer ou mettre à jour un CV (Admin) ───────────────────
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const cvData = req.body;
    if (!cvData || !cvData.memberId) {
      return res.status(400).json({ success: false, message: 'Identifiant du membre requis.' });
    }

    // Générer ou valider le slug
    const nameForSlug = `${cvData.givenNames || ''} ${cvData.familyNames || ''}`.trim() || cvData.memberId;
    const slug = cvData.slug || slugify(nameForSlug);

    const payload = {
      ...cvData,
      slug,
      updatedAt: new Date().toISOString(),
    };

    let content = await SiteContent.findOne({ key: 'main_site_content' });
    if (!content) {
      content = new SiteContent({ key: 'main_site_content', cvs: [] });
    }

    const cvs: any[] = Array.isArray((content as any).cvs) ? (content as any).cvs : [];
    const existingIndex = cvs.findIndex((c) => c.memberId === payload.memberId || c.slug === payload.slug);

    if (existingIndex >= 0) {
      cvs[existingIndex] = { ...cvs[existingIndex], ...payload };
    } else {
      cvs.push(payload);
    }

    (content as any).cvs = cvs;
    await content.save();

    return res.status(200).json({
      success: true,
      message: 'CV enregistré avec succès.',
      data: payload,
    });
  } catch (error: any) {
    console.error('Erreur sauvegarde CV :', error);
    return res.status(500).json({ success: false, message: 'Erreur lors de la sauvegarde du CV.' });
  }
});

// ── DELETE /api/v1/cvs/:memberId : Supprimer un CV (Admin) ────────────────────
router.delete('/:memberId', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { memberId } = req.params;
    const content = await SiteContent.findOne({ key: 'main_site_content' });
    if (!content) {
      return res.status(404).json({ success: false, message: 'Contenu introuvable.' });
    }

    let cvs: any[] = Array.isArray((content as any).cvs) ? (content as any).cvs : [];
    const initialLen = cvs.length;
    cvs = cvs.filter((c) => c.memberId !== memberId && c.slug !== memberId);

    if (cvs.length === initialLen) {
      return res.status(404).json({ success: false, message: 'CV introuvable.' });
    }

    (content as any).cvs = cvs;
    await content.save();

    return res.status(200).json({
      success: true,
      message: 'CV supprimé définitivement.',
    });
  } catch (error: any) {
    console.error('Erreur suppression CV :', error);
    return res.status(500).json({ success: false, message: 'Erreur lors de la suppression.' });
  }
});

export default router;

