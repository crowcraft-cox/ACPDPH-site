import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import Newsletter from '../models/Newsletter';
import { sendEmail } from '../utils/email';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// GET all subscribers list (Protected Admin Endpoint)
router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const subscribers = await Newsletter.find().sort({ subscribedAt: -1 });
    res.status(200).json({ success: true, data: subscribers });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch subscribers.' });
  }
});

// POST subscribe new email (Public Endpoint)
router.post('/', [
  body('email').isEmail().withMessage('Une adresse email valide est requise')
], async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
     res.status(400).json({ errors: errors.array() });
     return;
  }

  try {
    const { email } = req.body;

    // Check if already subscribed in MongoDB Atlas
    const existing = await Newsletter.findOne({ email });
    if (existing) {
      res.status(200).json({ success: true, message: 'Vous êtes déjà inscrit à la newsletter de Bright African.' });
      return;
    }

    const subscriber = await Newsletter.create({ email });

    // Send confirmation welcome email to subscriber's inbox
    await sendEmail({
      to: email,
      subject: 'Bienvenue chez Bright African — Inscription réussie !',
      text: `Bonjour,\n\nMerci de vous être abonné(e) à la newsletter de Bright African ONG.\n\nVous recevrez désormais nos dernières actualités, rapports d'impact et avancées de nos projets sur le terrain.\n\nEnsemble pour la protection et le développement en Afrique.\n\nL'équipe Bright African ONG\nhttps://brightafrican.org`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; borderRadius: 10px;">
          <h2 style="color: #E30613;">Bienvenue chez Bright African ONG !</h2>
          <p>Bonjour,</p>
          <p>Merci de vous être abonné(e) à la newsletter officielle de <strong>Bright African</strong>.</p>
          <p>Vous recevrez nos projets d'impact, nos actions de protection de l'enfance, de santé et d'éducation en Afrique.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 0.85em; color: #777;">Bright African ONG — Goma, RDC</p>
        </div>
      `,
    });

    res.status(201).json({
      success: true,
      message: 'Inscription réussie ! Un e-mail de confirmation vous a été envoyé.',
      data: subscriber,
    });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    res.status(500).json({ success: false, message: 'Échec de l\'inscription.' });
  }
});

// POST broadcast message to all subscribers (Protected Admin Endpoint)
router.post('/broadcast', authMiddleware, [
  body('subject').notEmpty().withMessage('Le sujet est requis'),
  body('content').notEmpty().withMessage('Le contenu du message est requis'),
], async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  try {
    const { subject, content, type } = req.body;
    const subscribers = await Newsletter.find();

    if (subscribers.length === 0) {
      res.status(400).json({ success: false, message: 'Aucun abonné enregistré dans la base de données.' });
      return;
    }

    let sentCount = 0;
    let failCount = 0;

    // Iterate and send real emails to all subscribers
    for (const sub of subscribers) {
      const ok = await sendEmail({
        to: sub.email,
        subject: `[Bright African] ${subject}`,
        text: content,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px;">
            <div style="margin-bottom: 20px; border-bottom: 2px solid #E30613; padding-bottom: 12px;">
              <h1 style="color: #E30613; margin: 0; font-size: 24px;">Bright African ONG</h1>
              <span style="color: #1A8F0A; font-weight: bold; font-size: 14px;">Information & Actualités</span>
            </div>
            
            <h2 style="color: #111827; font-size: 18px; margin-top: 0;">${subject}</h2>
            
            <div style="color: #374151; font-size: 15px; line-height: 1.6; whitespace: pre-line;">
              ${content.replace(/\n/g, '<br/>')}
            </div>

            <div style="margin-top: 30px; padding-top: 16px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; text-align: center;">
              Vous recevez ce message car vous êtes abonné(e) à la newsletter de Bright African.<br/>
              Avenue de la Paix, Himbi, Goma — Nord-Kivu, RDC
            </div>
          </div>
        `,
      });

      if (ok) sentCount++;
      else failCount++;
    }

    res.status(200).json({
      success: true,
      message: `Newsletter diffusée avec succès ! (${sentCount} e-mails envoyés, ${failCount} échecs).`,
      sentCount,
      failCount,
      totalSubscribers: subscribers.length,
    });
  } catch (error: any) {
    console.error('Broadcast error:', error);
    res.status(500).json({ success: false, message: 'Échec de l\'envoi de la newsletter.' });
  }
});

// DELETE subscriber by ID (Protected Admin Endpoint)
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Newsletter.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'Abonné supprimé avec succès.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Échec de la suppression de l\'abonné.' });
  }
});

export default router;
