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
      lang = 'fr',
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

    const frequencyLabelFr = frequency === 'single' ? 'Ponctuel (une seule fois)' : 'Mensuel (tous les mois)';
    const frequencyLabelEn = frequency === 'single' ? 'One-time' : 'Monthly';
    const frequencyLabelIt = frequency === 'single' ? 'Una tantum (singola donazione)' : 'Mensile (ogni mese)';
    const frequencyLabelDe = frequency === 'single' ? 'Einmalig' : 'Monatlich';
    const amountLabel = `${amount} ${currency}`;

    // 1. Notification par email à l'ACPDPH (TOUJOURS EN FRANÇAIS)
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
        `Fréquence : ${frequencyLabelFr}\n` +
        `Mode de paiement choisi : ${paymentMethod} (${paymentProvider || 'Standard'})\n` +
        `Langue du donateur : ${lang}\n` +
        `Newsletter : ${newsletter ? 'Oui' : 'Non'}\n` +
        `Statut : En attente de règlement\n\n` +
        `Retrouvez cette promesse de don sur l'espace d'administration de l'ACPDPH.`,
    }).catch((err) => console.error('[Donation Admin Email Error]:', err));

    // 2. Email de confirmation / remerciement au donateur (DANS LA LANGUE DU VISITEUR)
    if (lang === 'en') {
      sendEmail({
        to: email.trim().toLowerCase(),
        subject: `Thank you for your generous solidarity with ACPDPH (Ref. ${reference})`,
        text: `Dear ${firstName || fullName},\n\n` +
          `We warmly thank you for choosing to support ACPDPH (Congolese Agency for the Promotion of the Rights of Persons with Disabilities).\n\n` +
          `Summary of your pledge:\n` +
          `- Support reference: ${reference}\n` +
          `- Amount: ${amountLabel}\n` +
          `- Frequency: ${frequencyLabelEn}\n` +
          `- Selected payment method: ${paymentMethod} (${paymentProvider || 'Standard'})\n\n` +
          (paymentMethod === 'BANK_TRANSFER'
            ? `Official banking details for your USD wire transfer:\n` +
              `- BANK NAME: EQUITY BCDC\n` +
              `- ACCOUNT NAME: ACPDPH\n` +
              `- BANK ADDRESS: BENI BRANCH\n` +
              `- ACCOUNT NUMBER: 00011150666200168501311\n` +
              `- SWIFT: BCDCCDKI\n` +
              `- CURRENCY: USD\n` +
              `- Wire memo / reference: Specify your name and reference « ${reference} »\n\n`
            : paymentMethod === 'MOBILE_MONEY'
            ? `Mobile Money instructions:\n` +
              `- ACPDPH Mobile Money number: +243 976 992 466\n` +
              `- Transfer memo / reference: Specify your name and reference « ${reference} »\n\n`
            : '') +
          `If you have any questions or to share your transfer receipt, please contact us at info.acpdph.asbl.rdc@gmail.com.\n\n` +
          `With our most respectful regards,\n` +
          `The ACPDPH Team — Beni, North Kivu, DRC`,
      }).catch((err) => console.error('[Donation Donor Email Error]:', err));
    } else if (lang === 'it') {
      sendEmail({
        to: email.trim().toLowerCase(),
        subject: `Grazie per la vostra generosa solidarieta con ACPDPH (Rif. ${reference})`,
        text: `Gentile ${firstName || fullName},\n\n` +
          `Vi ringraziamo calorosamente per aver scelto di sostenere l'ACPDPH (Agenzia Congolese per la Promozione dei Diritti delle Persone con Disabilita).\n\n` +
          `Riepilogo della vostra promessa di donazione:\n` +
          `- Riferimento donazione: ${reference}\n` +
          `- Importo: ${amountLabel}\n` +
          `- Frequenza: ${frequencyLabelIt}\n` +
          `- Metodo di pagamento selezionato: ${paymentMethod} (${paymentProvider || 'Standard'})\n\n` +
          (paymentMethod === 'BANK_TRANSFER'
            ? `Dati bancari ufficiali per il vostro bonifico in USD:\n` +
              `- NOME DELLA BANCA: EQUITY BCDC\n` +
              `- INTESTATARIO: ACPDPH\n` +
              `- SEDE DELLA BANCA: AGENZIA DI BENI\n` +
              `- NUMERO DI CONTO: 00011150666200168501311\n` +
              `- SWIFT: BCDCCDKI\n` +
              `- VALUTA: USD\n` +
              `- Causale del bonifico: Indicare il vostro nome e il riferimento « ${reference} »\n\n`
            : paymentMethod === 'MOBILE_MONEY'
            ? `Istruzioni Mobile Money:\n` +
              `- Numero Mobile Money ACPDPH: +243 976 992 466\n` +
              `- Causale: Indicare il vostro nome e il riferimento « ${reference} »\n\n`
            : '') +
          `Per qualsiasi domanda o per inviarci la ricevuta del bonifico, potete scriverci all'indirizzo info.acpdph.asbl.rdc@gmail.com.\n\n` +
          `Cordiali saluti,\n` +
          `Il team ACPDPH — Beni, Nord Kivu, RDC`,
      }).catch((err) => console.error('[Donation Donor Email Error]:', err));
    } else if (lang === 'de') {
      sendEmail({
        to: email.trim().toLowerCase(),
        subject: `Vielen Dank fur Ihre Unterstutzung der ACPDPH (Ref. ${reference})`,
        text: `Sehr geehrte(r) ${firstName || fullName},\n\n` +
          `Wir danken Ihnen herzlich fur Ihre Entscheidung, die ACPDPH (Kongolesische Agentur fur die Forderung der Rechte von Menschen mit Behinderungen) zu unterstutzen.\n\n` +
          `Zusammenfassung Ihrer Spende:\n` +
          `- Spendenreferenz: ${reference}\n` +
          `- Betrag: ${amountLabel}\n` +
          `- Haufigkeit: ${frequencyLabelDe}\n` +
          `- Gewahlte Zahlungsmethode: ${paymentMethod} (${paymentProvider || 'Standard'})\n\n` +
          (paymentMethod === 'BANK_TRANSFER'
            ? `Offizielle Bankverbindung fur Ihre Uberweisung in USD:\n` +
              `- BANKNAME: EQUITY BCDC\n` +
              `- KONTOINHABER: ACPDPH\n` +
              `- BANKFILIALE: BENI BRANCH\n` +
              `- KONTONUMMER: 00011150666200168501311\n` +
              `- SWIFT: BCDCCDKI\n` +
              `- WAHRUNG: USD\n` +
              `- Verwendungszweck: Geben Sie bitte Ihren Namen und die Referenz « ${reference} » an\n\n`
            : paymentMethod === 'MOBILE_MONEY'
            ? `Mobile Money Anweisungen:\n` +
              `- ACPDPH Mobile Money Nummer: +243 976 992 466\n` +
              `- Verwendungszweck: Geben Sie bitte Ihren Namen und die Referenz « ${reference} » an\n\n`
            : '') +
          `Bei Fragen oder zur Ubermittlung Ihres Zahlungsbelegs kontaktieren Sie uns bitte unter info.acpdph.asbl.rdc@gmail.com.\n\n` +
          `Mit freundlichen Grussen,\n` +
          `Das ACPDPH-Team — Beni, Nord-Kivu, DRK`,
      }).catch((err) => console.error('[Donation Donor Email Error]:', err));
    } else {
      sendEmail({
        to: email.trim().toLowerCase(),
        subject: `Merci pour votre engagement auprès de l'ACPDPH (Réf. ${reference})`,
        text: `Bonjour ${firstName || fullName},\n\n` +
          `Nous vous remercions chaleureusement pour votre décision de soutenir l'ACPDPH (Agence Congolaise de Promotion des Droits des Personnes Handicapées).\n\n` +
          `Récapitulatif de votre engagement :\n` +
          `- Référence de soutien : ${reference}\n` +
          `- Montant : ${amountLabel}\n` +
          `- Fréquence : ${frequencyLabelFr}\n` +
          `- Moyen de paiement choisi : ${paymentMethod} (${paymentProvider || 'Standard'})\n\n` +
          (paymentMethod === 'BANK_TRANSFER'
            ? `Coordonnées bancaires officielles pour votre virement (USD) :\n` +
              `- NOM DE LA BANQUE : EQUITY BCDC\n` +
              `- INTITULÉ DU COMPTE : ACPDPH\n` +
              `- ADRESSE DE LA BANQUE : AGENCE DE BENI\n` +
              `- NUMÉRO DE COMPTE : 00011150666200168501311\n` +
              `- SWIFT : BCDCCDKI\n` +
              `- DEVISE : USD\n` +
              `- Motif : Indiquez votre nom et la référence « ${reference} »\n\n`
            : paymentMethod === 'MOBILE_MONEY'
            ? `Instructions Mobile Money :\n` +
              `- Numéro Mobile Money ACPDPH : +243 976 992 466\n` +
              `- Référence : Indiquez votre nom et la référence « ${reference} »\n\n`
            : '') +
          `Pour toute question ou pour nous transmettre votre justificatif, vous pouvez nous écrire à info.acpdph.asbl.rdc@gmail.com.\n\n` +
          `Avec nos salutations les plus respectueuses,\n` +
          `L'équipe de l'ACPDPH — Beni, Nord-Kivu, RDC`,
      }).catch((err) => console.error('[Donation Donor Email Error]:', err));
    }

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
