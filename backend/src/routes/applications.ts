import { Router, Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
// @ts-ignore
import multer from 'multer';
import Application from '../models/Application';
import { sendEmail, EmailAttachment } from '../utils/email';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// ── Private uploads directory for applications (NOT served publicly) ──────────
const PRIVATE_DIR = path.join(process.cwd(), 'private_uploads', 'applications');
if (!fs.existsSync(PRIVATE_DIR)) {
  fs.mkdirSync(PRIVATE_DIR, { recursive: true });
}

// ── Multer Storage & Validation ──────────────────────────────────────────────
const storage = (multer as any).diskStorage({
  destination: (_req: any, _file: any, cb: any) => cb(null, PRIVATE_DIR),
  filename: (_req: any, file: any, cb: any) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const cleanBase = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 40);
    const unique = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    cb(null, `${unique}-${cleanBase}${ext}`);
  },
});

const ALLOWED_DOC_EXTS = ['.pdf', '.doc', '.docx'];
const ALLOWED_CERT_EXTS = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 Mo

const fileFilter = (_req: any, file: any, cb: any) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (file.fieldname === 'cv' || file.fieldname === 'coverLetter') {
    if (ALLOWED_DOC_EXTS.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error(`Format de fichier non autorise pour ${file.fieldname}. Formats acceptes : PDF, DOC, DOCX.`));
    }
  } else if (file.fieldname === 'certificates') {
    if (ALLOWED_CERT_EXTS.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error(`Format non autorise pour les attestations. Formats acceptes : PDF, DOC, DOCX, JPG, PNG.`));
    }
  } else {
    cb(new Error(`Champ de fichier inattendu : ${file.fieldname}`));
  }
};

const upload = (multer as any)({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE },
});

const uploadFields = upload.fields([
  { name: 'cv', maxCount: 1 },
  { name: 'coverLetter', maxCount: 1 },
  { name: 'certificates', maxCount: 10 },
]);

// ── POST submit application ──────────────────────────────────────────────────
router.post('/', (req: Request, res: Response, next: any) => {
  uploadFields(req, res, async (err: any) => {
    if (err) {
      console.error('[Application Upload Error]:', err.message);
      return res.status(400).json({ success: false, message: err.message || 'Erreur lors du traitement des fichiers.' });
    }

    try {
      // 1. Anti-spam honeypot
      if (req.body.website || req.body.company_url || req.body.hp_check) {
        // Robot spam décelé : réponse muette réussie
        return res.status(200).json({ success: true, message: 'Candidature reçue.' });
      }

      const {
        jobId,
        jobTitle,
        nom,
        postnom,
        prenom,
        dateNaissance,
        sexe,
        email,
        confirmEmail,
        telephone,
        adresse,
        ville,
        province,
        pays,
        niveauEducation,
        langues,
        experiences,
        enSituationHandicap,
        amenagementsSouhaites,
        consentement,
      } = req.body;

      // 2. Validations obligatoires
      if (!jobId || !jobTitle) {
        return res.status(400).json({ success: false, message: 'Le poste visé est requis.' });
      }
      if (!nom || !prenom) {
        return res.status(400).json({ success: false, message: 'Le nom et le prénom sont obligatoires.' });
      }
      if (!dateNaissance) {
        return res.status(400).json({ success: false, message: 'La date de naissance est obligatoire.' });
      }

      // Vérification de l'âge (>= 18 ans et non futur)
      const birthDate = new Date(dateNaissance);
      const today = new Date();
      if (isNaN(birthDate.getTime()) || birthDate > today) {
        return res.status(400).json({ success: false, message: 'Date de naissance invalide.' });
      }
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      if (age < 18) {
        return res.status(400).json({ success: false, message: 'Vous devez avoir au moins 18 ans pour postuler.' });
      }

      if (!sexe || (sexe !== 'Homme' && sexe !== 'Femme')) {
        return res.status(400).json({ success: false, message: 'Veuillez sélectionner le sexe.' });
      }
      if (!email || !telephone) {
        return res.status(400).json({ success: false, message: "L'e-mail et le numéro de téléphone sont obligatoires." });
      }
      if (confirmEmail && email.trim().toLowerCase() !== confirmEmail.trim().toLowerCase()) {
        return res.status(400).json({ success: false, message: 'Les adresses e-mail ne correspondent pas.' });
      }
      if (!niveauEducation) {
        return res.status(400).json({ success: false, message: "Le niveau d'éducation est obligatoire." });
      }
      if (consentement !== 'true' && consentement !== true) {
        return res.status(400).json({ success: false, message: 'Vous devez accepter les conditions pour postuler.' });
      }

      // 3. Fichiers
      const files = (req as any).files as { [fieldname: string]: any[] } | undefined;
      const cvFile = files?.['cv']?.[0];
      const coverLetterFile = files?.['coverLetter']?.[0];
      const certFiles = files?.['certificates'] || [];

      if (!cvFile) {
        return res.status(400).json({ success: false, message: 'Le Curriculum Vitae (CV) est obligatoire.' });
      }
      if (!coverLetterFile) {
        return res.status(400).json({ success: false, message: 'La lettre de motivation est obligatoire.' });
      }

      // 4. Parser les tableaux JSON (langues & experiences)
      let parsedLangues: Array<{ langue: string; niveau: string }> = [];
      if (langues) {
        try {
          parsedLangues = typeof langues === 'string' ? JSON.parse(langues) : langues;
        } catch {
          parsedLangues = [];
        }
      }

      let parsedExperiences: Array<{ titrePoste: string; organisation: string; anneesExperience: string }> = [];
      if (experiences) {
        try {
          parsedExperiences = typeof experiences === 'string' ? JSON.parse(experiences) : experiences;
        } catch {
          parsedExperiences = [];
        }
      }

      // 5. Enregistrement dans MongoDB (si connecté)
      let savedApplication: any = null;
      try {
        savedApplication = await Application.create({
          jobId,
          jobTitle,
          nom: nom.trim(),
          postnom: postnom?.trim() || '',
          prenom: prenom.trim(),
          dateNaissance,
          sexe,
          email: email.trim().toLowerCase(),
          telephone: telephone.trim(),
          adresse: adresse?.trim() || '',
          ville: ville?.trim() || '',
          province: province?.trim() || '',
          pays: pays?.trim() || 'République démocratique du Congo',
          niveauEducation,
          langues: parsedLangues,
          experiences: parsedExperiences,
          enSituationHandicap: enSituationHandicap || 'Préfère ne pas répondre',
          amenagementsSouhaites: amenagementsSouhaites?.trim() || '',
          documents: {
            cv: {
              filename: cvFile.filename,
              originalname: cvFile.originalname,
              size: cvFile.size,
              mimetype: cvFile.mimetype,
              path: cvFile.path,
            },
            coverLetter: {
              filename: coverLetterFile.filename,
              originalname: coverLetterFile.originalname,
              size: coverLetterFile.size,
              mimetype: coverLetterFile.mimetype,
              path: coverLetterFile.path,
            },
            certificates: certFiles.map((c: any) => ({
              filename: c.filename,
              originalname: c.originalname,
              size: c.size,
              mimetype: c.mimetype,
              path: c.path,
            })),
          },
          consentement: true,
        });
      } catch (dbErr: any) {
        console.warn('[Application DB Warning]: Sauvegarde MongoDB impossible, envoi par e-mail prioritaire :', dbErr.message);
      }

      // 6. Préparation des pièces jointes pour l'e-mail de recrutement
      const emailAttachments: EmailAttachment[] = [
        {
          filename: `CV_${nom}_${prenom}${path.extname(cvFile.originalname)}`,
          path: cvFile.path,
        },
        {
          filename: `Lettre_Motivation_${nom}_${prenom}${path.extname(coverLetterFile.originalname)}`,
          path: coverLetterFile.path,
        },
      ];

      certFiles.forEach((cert: any, idx: number) => {
        emailAttachments.push({
          filename: `Attestation_${idx + 1}_${path.basename(cert.originalname)}`,
          path: cert.path,
        });
      });

      // 7. Envoi de l'e-mail au service RH / Recrutement de l'ACPDPH
      const recruitmentEmail = process.env.RECRUITMENT_EMAIL || process.env.CONTACT_EMAIL || 'info.acpdph.asbl.rdc@gmail.com';
      const applicationDate = new Date().toLocaleString('fr-FR', { timeZone: 'Africa/Lubumbashi' });

      const emailHtml = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1E293B; max-width: 650px;">
          <div style="background-color: #2350D9; padding: 20px; border-radius: 8px 8px 0 0; color: #FFFFFF;">
            <h2 style="margin: 0; font-size: 20px;">Nouvelle Candidature Recrutement</h2>
            <p style="margin: 4px 0 0; font-size: 14px; opacity: 0.9;">ACPDPH ONG – Pôle Ressources Humaines</p>
          </div>

          <div style="border: 1px solid #E2E8F0; border-top: none; padding: 24px; border-radius: 0 0 8px 8px; background: #FFFFFF;">
            <div style="background: #F1F5F9; padding: 12px 16px; border-radius: 6px; margin-bottom: 20px;">
              <strong style="color: #2350D9; font-size: 15px;">Poste :</strong> ${jobTitle} <br/>
              <span style="font-size: 12px; color: #64748B;">Identifiant offre : ${jobId} | Date d'envoi : ${applicationDate}</span>
            </div>

            <h3 style="color: #0F172A; font-size: 15px; border-bottom: 2px solid #2350D9; padding-bottom: 4px; margin-top: 20px;">1. IDENTITÉ & CONTACT</h3>
            <table style="width: 100%; font-size: 13px; border-collapse: collapse; margin-top: 8px;">
              <tr><td style="padding: 4px 0; width: 140px; color: #64748B;">Nom complet :</td><td><strong>${nom.toUpperCase()} ${postnom || ''} ${prenom}</strong></td></tr>
              <tr><td style="padding: 4px 0; color: #64748B;">Sexe :</td><td>${sexe}</td></tr>
              <tr><td style="padding: 4px 0; color: #64748B;">Date de naissance :</td><td>${dateNaissance} (${age} ans)</td></tr>
              <tr><td style="padding: 4px 0; color: #64748B;">E-mail :</td><td><a href="mailto:${email}">${email}</a></td></tr>
              <tr><td style="padding: 4px 0; color: #64748B;">Téléphone :</td><td><strong>${telephone}</strong></td></tr>
              <tr><td style="padding: 4px 0; color: #64748B;">Adresse :</td><td>${adresse || 'Non renseignée'}, ${ville || ''} (${province || ''}, ${pays || 'RDC'})</td></tr>
            </table>

            <h3 style="color: #0F172A; font-size: 15px; border-bottom: 2px solid #2350D9; padding-bottom: 4px; margin-top: 24px;">2. PARCOURS & COMPÉTENCES</h3>
            <table style="width: 100%; font-size: 13px; border-collapse: collapse; margin-top: 8px;">
              <tr><td style="padding: 4px 0; width: 140px; color: #64748B;">Niveau d'études :</td><td><strong>${niveauEducation}</strong></td></tr>
              <tr><td style="padding: 4px 0; color: #64748B; vertical-align: top;">Langues :</td><td>
                ${parsedLangues.length > 0 ? parsedLangues.map(l => `${l.langue} (${l.niveau})`).join(', ') : 'Aucune renseignée'}
              </td></tr>
            </table>

            <h3 style="color: #0F172A; font-size: 15px; border-bottom: 2px solid #2350D9; padding-bottom: 4px; margin-top: 24px;">3. EXPÉRIENCES PROFESSIONNELLES</h3>
            ${parsedExperiences.length > 0 ? `
              <ul style="font-size: 13px; padding-left: 20px; margin-top: 8px;">
                ${parsedExperiences.map(e => `<li><strong>${e.titrePoste || 'Poste'}</strong> chez <em>${e.organisation || 'Organisation'}</em> (${e.anneesExperience || '1'} an(s))</li>`).join('')}
              </ul>
            ` : '<p style="font-size: 13px; color: #64748B;">Aucune expérience renseignée.</p>'}

            <h3 style="color: #0F172A; font-size: 15px; border-bottom: 2px solid #2350D9; padding-bottom: 4px; margin-top: 24px;">4. ACCESSIBILITÉ & INCLUSION</h3>
            <table style="width: 100%; font-size: 13px; border-collapse: collapse; margin-top: 8px;">
              <tr><td style="padding: 4px 0; width: 180px; color: #64748B;">Situation de handicap :</td><td><strong>${enSituationHandicap || 'Non spécifié'}</strong></td></tr>
              <tr><td style="padding: 4px 0; color: #64748B; vertical-align: top;">Aménagements souhaités :</td><td>${amenagementsSouhaites || 'Aucun aménagement particulier demandé.'}</td></tr>
            </table>

            <div style="margin-top: 30px; padding: 14px; background: #ECFDF5; border: 1px solid #A7F3D0; border-radius: 6px; font-size: 12px; color: #065F46;">
              Toutes les pièces jointes (CV, Lettre de motivation, Attestations) sont attachées à cet e-mail.
            </div>
          </div>
        </div>
      `;

      try {
        await sendEmail({
          to: recruitmentEmail,
          subject: `[Candidature] ${jobTitle} – ${nom.toUpperCase()} ${prenom}`,
          text: `Nouvelle candidature pour le poste ${jobTitle} reçue de ${nom} ${prenom} (${email}, ${telephone}).`,
          html: emailHtml,
          attachments: emailAttachments,
        });
      } catch (recEmailErr: any) {
        console.warn("[Application Recruitment Email Warning]: Envoi e-mail RH échoué :", recEmailErr.message);
      }

      // 8. E-mail d'accusé de réception automatique au candidat
      try {
        await sendEmail({
          to: email.trim().toLowerCase(),
          subject: `Accusé de réception de votre candidature – ACPDPH ONG`,
          text: `Bonjour ${prenom} ${nom},\n\nNous avons bien reçu votre candidature pour le poste "${jobTitle}".\nNotre équipe de recrutement l'examinera avec attention. Seules les personnes présélectionnées seront contactées.\n\nCordialement,\nACPDPH ONG`,
          html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1E293B; max-width: 600px;">
              <div style="background-color: #2350D9; padding: 20px; border-radius: 8px 8px 0 0; color: #FFFFFF;">
                <h2 style="margin: 0; font-size: 20px;">Candidature reçue avec succès</h2>
              </div>
              <div style="border: 1px solid #E2E8F0; border-top: none; padding: 24px; border-radius: 0 0 8px 8px; background: #FFFFFF;">
                <p>Bonjour <strong>${prenom} ${nom}</strong>,</p>
                <p>Nous vous remercions pour l'intérêt que vous portez à l'<strong>ACPDPH ONG</strong>. Nous accusons bonne réception de votre dossier de candidature pour le poste :</p>
                <div style="background: #F1F5F9; padding: 12px; border-radius: 6px; font-weight: bold; color: #2350D9; margin: 15px 0;">
                  ${jobTitle}
                </div>
                <p style="font-size: 14px; color: #475569;">
                  Notre équipe de recrutement examinera votre candidature avec la plus grande attention. Seules les personnes présélectionnées seront contactées pour les étapes suivantes.
                </p>
                <p style="font-size: 14px; color: #475569;">
                  L'ACPDPH garantit l'égalité des chances et un traitement équitable de toutes les candidatures.
                </p>
                <hr style="border: none; border-top: 1px solid #E2E8F0; margin: 20px 0;" />
                <p style="font-size: 12px; color: #94A3B8; margin: 0;">
                  ACPDPH ONG – Action Communautaire pour la Promotion et la Défense des Droits des Personnes Handicapées<br/>
                  Beni, Nord-Kivu, République démocratique du Congo
                </p>
              </div>
            </div>
          `,
        });
      } catch (candErr: any) {
        console.warn("[Application Confirmation Email Warning]: Échec d'envoi de l'accusé de réception au candidat :", candErr.message);
      }

      return res.status(201).json({
        success: true,
        message: 'Candidature envoyée avec succès.',
        data: savedApplication ? { id: savedApplication._id } : undefined,
      });
    } catch (processErr: any) {
      console.error('[Application Processing Error]:', processErr);
      return res.status(500).json({ success: false, message: "Une erreur est survenue lors de l'enregistrement de votre candidature." });
    }
  });
});

// ── GET all applications (Admin Protected) ───────────────────────────────────
router.get('/', authMiddleware, async (_req: Request, res: Response) => {
  try {
    const list = await Application.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: list });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Erreur lors du chargement des candidatures.' });
  }
});

// ── GET application details (Admin Protected) ────────────────────────────────
router.get('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const appItem = await Application.findById(req.params.id);
    if (!appItem) {
      return res.status(404).json({ success: false, message: 'Candidature introuvable.' });
    }
    res.status(200).json({ success: true, data: appItem });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

// ── GET application document download (Admin Protected) ──────────────────────
const handleDocumentDownload = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const type = String(req.params.type);
    const index = req.params.index;
    const appItem = await Application.findById(id);
    if (!appItem) {
      return res.status(404).json({ success: false, message: 'Candidature introuvable.' });
    }

    let targetDoc: any = null;
    if (type === 'cv') {
      targetDoc = appItem.documents.cv;
    } else if (type === 'coverLetter') {
      targetDoc = appItem.documents.coverLetter;
    } else if (type === 'certificate' && index !== undefined) {
      const idx = parseInt(String(index), 10);
      targetDoc = appItem.documents.certificates?.[idx];
    }

    if (!targetDoc || !targetDoc.path || !fs.existsSync(targetDoc.path)) {
      return res.status(404).json({ success: false, message: 'Fichier introuvable.' });
    }

    res.download(targetDoc.path, String(targetDoc.originalname || targetDoc.filename));
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Erreur de téléchargement.' });
  }
};

router.get('/:id/document/:type', authMiddleware, handleDocumentDownload);
router.get('/:id/document/:type/:index', authMiddleware, handleDocumentDownload);

// ── DELETE application (Admin Protected) ─────────────────────────────────────
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const appItem = await Application.findById(id);
    if (appItem) {
      // Nettoyage des fichiers locaux
      try {
        if (appItem.documents.cv?.path && fs.existsSync(appItem.documents.cv.path)) {
          fs.unlinkSync(appItem.documents.cv.path);
        }
        if (appItem.documents.coverLetter?.path && fs.existsSync(appItem.documents.coverLetter.path)) {
          fs.unlinkSync(appItem.documents.coverLetter.path);
        }
        appItem.documents.certificates?.forEach((c: any) => {
          if (c.path && fs.existsSync(c.path)) fs.unlinkSync(c.path);
        });
      } catch (cleanErr) {
        console.warn('[File Cleanup Warning]:', cleanErr);
      }
      await Application.findByIdAndDelete(id);
    }
    res.status(200).json({ success: true, message: 'Candidature supprimée avec succès.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Erreur lors de la suppression.' });
  }
});

export default router;
