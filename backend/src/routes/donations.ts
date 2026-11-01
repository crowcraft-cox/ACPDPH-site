import { Router, Request, Response } from 'express';
import Donation from '../models/Donation';
import { authMiddleware } from '../middleware/authMiddleware';
import { sendEmail } from '../utils/email';

const router = Router();

// Génération d'une référence unique (ex: DON-2026-4821)
function generateDonationReference(): string {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `DON-${year}-${randomNum}`;
}

// GET all donations (Admin Protected)
router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { search, status } = req.query;
    const filter: any = {};

    if (status && typeof status === 'string' && status !== 'all') {
      filter.status = status;
    }

    if (search && typeof search === 'string') {
      const regex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { reference: regex },
        { name: regex },
        { email: regex },
        { phone: regex },
      ];
    }

    const donations = await Donation.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: donations });
  } catch (error: any) {
    console.error('Fetch donations error:', error);
    res.status(500).json({ success: false, message: 'Impossible de récupérer les dons.' });
  }
});

// POST register a donation intent (Public)
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      amount,
      currency = 'USD',
      frequency = 'monthly',
      firstName = '',
      lastName = '',
      name = '',
      email,
      phone = '',
      country = 'RDC',
      newsletter = false,
      paymentMethod = 'MOBILE_MONEY',
      paymentProvider = '',
      notes = '',
    } = req.body;

    if (!amount || Number(amount) <= 0) {
      res.status(400).json({ success: false, message: 'Le montant du don est requis et doit être positif.' });
      return;
    }

    if (!email || !email.includes('@')) {
      res.status(400).json({ success: false, message: 'Une adresse e-mail valide est requise.' });
      return;
    }

    // Nom complet
    const fullName = name.trim() || `${firstName.trim()} ${lastName.trim()}`.trim() || 'Bienfaiteur ACPDPH';

    // Générer référence unique
    let reference = generateDonationReference();
    // Vérification collision simple
    const existing = await Donation.findOne({ reference });
    if (existing) {
      reference = `${generateDonationReference()}-${Math.floor(10 + Math.random() * 90)}`;
    }

    const newDonation = await Donation.create({
      reference,
      amount: Number(amount),
      currency,
      frequency: frequency === 'single' ? 'single' : 'monthly',
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      name: fullName,
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      country: country.trim() || 'RDC',
      newsletter: Boolean(newsletter),
      paymentMethod,
      paymentProvider,
      status: 'pending',
      notes,
    });

    const frequencyLabel = frequency === 'single' ? 'Ponctuel (une seule fois)' : 'Mensuel (tous les mois)';
    const amountLabel = `${amount} ${currency}`;

    // 1. Notification par email à l'ACPDPH
    const adminNotificationEmail = process.env.CONTACT_EMAIL || 'info.acpdph.asbl.rdc@gmail.com';
    sendEmail({
      to: adminNotificationEmail,
      subject: `[ACPDPH] Nouvelle intention de soutien: ${amountLabel} (${reference})`,
      text: `Une nouvelle intention de don vient d'être enregistrée sur le site web.\n\n` +
        `Référence : ${reference}\n` +
        `Donateur : ${fullName}\n` +
        `E-mail : ${email}\n` +
        `Téléphone : ${phone || 'Non renseigné'}\n` +
        `Montant : ${amountLabel}\n` +
        `Fréquence : ${frequencyLabel}\n` +
        `Mode de paiement choisi : ${paymentMethod} (${paymentProvider || 'Standard'})\n` +
        `Newsletter : ${newsletter ? 'Oui' : 'Non'}\n` +
        `Statut : En attente de règlement\n\n` +
        `Retrouvez cette promesse de don sur l'espace d'administration de l'ACPDPH.`,
    }).catch((err) => console.error('[Donation Admin Email Error]:', err));

    // 2. Email de confirmation / remerciement au donateur
    sendEmail({
      to: email.trim().toLowerCase(),
      subject: `Merci pour votre engagement auprès de l'ACPDPH (Réf. ${reference})`,
      text: `Bonjour ${firstName || fullName},\n\n` +
        `Nous vous remercions chaleureusement pour votre décision de soutenir l'ACPDPH (Agence Congolaise de Promotion des Droits des Personnes Handicapées).\n\n` +
        `Récapitulatif de votre engagement :\n` +
        `- Référence de soutien : ${reference}\n` +
        `- Montant : ${amountLabel}\n` +
        `- Fréquence : ${frequencyLabel}\n` +
        `- Moyen de paiement choisi : ${paymentMethod} (${paymentProvider || 'Standard'})\n\n` +
        `Si vous avez choisi un paiement par Mobile Money ou Virement bancaire, veuillez utiliser votre référence « ${reference} » lors de votre transaction.\n\n` +
        `Pour toute question ou pour nous transmettre votre justificatif, vous pouvez nous écrire à info.acpdph.asbl.rdc@gmail.com.\n\n` +
        `Avec nos salutations les plus respectueuses,\n` +
        `L'équipe de l'ACPDPH — Beni, Nord-Kivu, RDC`,
    }).catch((err) => console.error('[Donation Donor Email Error]:', err));

    res.status(201).json({
      success: true,
      message: 'Intention de soutien enregistrée avec succès.',
      data: newDonation,
    });
  } catch (error: any) {
    console.error('Donation creation error:', error);
    res.status(500).json({ success: false, message: "Échec de l'enregistrement de l'intention de don." });
  }
});

// PATCH update status (Admin Protected)
router.patch('/:id/status', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
      res.status(400).json({ success: false, message: 'Statut invalide.' });
      return;
    }

    const updated = await Donation.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updated) {
      res.status(404).json({ success: false, message: 'Don introuvable.' });
      return;
    }

    res.status(200).json({ success: true, data: updated });
  } catch (error: any) {
    console.error('Update donation status error:', error);
    res.status(500).json({ success: false, message: 'Échec de la mise à jour.' });
  }
});

// DELETE donation (Admin Protected)
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await Donation.findByIdAndDelete(id);

    if (!deleted) {
      res.status(404).json({ success: false, message: 'Don introuvable.' });
      return;
    }

    res.status(200).json({ success: true, message: 'Don supprimé avec succès.' });
  } catch (error: any) {
    console.error('Delete donation error:', error);
    res.status(500).json({ success: false, message: 'Échec de la suppression.' });
  }
});

export default router;
