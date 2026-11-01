/**
 * Configuration centralisée des moyens de paiement et coordonnées pour les dons ACPDPH.
 *
 * NOTE IMPORTANTE POUR L'ACPDPH :
 * Les numéros de téléphone et coordonnées de comptes bancaires ci-dessous sont préparés
 * avec des mentions réservées "À FOURNIR PAR L'ACPDPH".
 * Dès que l'association disposera de ses comptes finaux, il suffira de mettre à jour
 * ce fichier pour que tout le site affiche immédiatement les coordonnées certifiées.
 */

export interface MobileMoneyOperator {
  id: string;
  name: string;
  operator: string;
  badge: string;
  badgeColor: string;
  accountNumber: string;
  accountName: string;
  ussdPrompt: string;
  instructions: string[];
  isConfigured: boolean;
}

export interface BankAccountConfig {
  bankName: string;
  agency: string;
  beneficiary: string;
  accountUSD: string;
  accountCDF: string;
  iban: string;
  swift: string;
  isConfigured: boolean;
  instructions: string[];
}

export interface CardProviderConfig {
  provider: 'none' | 'stripe' | 'flutterwave' | 'pesapal';
  publicKey?: string;
  isConfigured: boolean;
  unavailableNotice: string;
}

export interface DonationConfig {
  defaultCurrency: string;
  currencies: Array<{ code: string; symbol: string; label: string }>;
  suggestedMonthlyAmounts: number[];
  suggestedSingleAmounts: number[];
  minAmount: number;
  contactEmail: string;
  contactWhatsApp: string;
  mobileMoney: Record<'mpesa' | 'airtel' | 'orange', MobileMoneyOperator>;
  bankTransfer: BankAccountConfig;
  cardPayment: CardProviderConfig;
}

export const DONATION_CONFIG: DonationConfig = {
  defaultCurrency: 'USD',
  currencies: [
    { code: 'USD', symbol: '$', label: 'Dollar américain (USD)' },
    { code: 'CDF', symbol: 'FC', label: 'Franc congolais (CDF)' },
  ],
  suggestedMonthlyAmounts: [10, 25, 50, 100],
  suggestedSingleAmounts: [10, 25, 50, 100],
  minAmount: 1,
  contactEmail: 'info.acpdph.asbl.rdc@gmail.com',
  contactWhatsApp: '+243 852 799 553',

  // 1. MOBILE MONEY (RDC)
  // [À FOURNIR PAR L'ACPDPH] : Remplacer par les numéros officiels certifiés
  mobileMoney: {
    mpesa: {
      id: 'mpesa',
      name: 'Vodacom M-Pesa',
      operator: 'Vodacom RDC',
      badge: 'M-Pesa',
      badgeColor: '#E60000',
      accountNumber: 'Numéro officiel à fournir par l\'ACPDPH',
      accountName: 'ACPDPH ASBL',
      ussdPrompt: '*1122# ou via application M-Pesa',
      instructions: [
        'Composez le code USSD *1122# ou lancez votre application M-Pesa.',
        'Sélectionnez l\'option Envoi d\'argent / Paiement.',
        'Entrez le numéro officiel certifié de l\'ACPDPH.',
        'Indiquez le montant de votre don.',
        'Mentionnez votre référence de don en libellé/motif.',
        'Validez avec votre code PIN personnel.',
      ],
      isConfigured: false,
    },
    airtel: {
      id: 'airtel',
      name: 'Airtel Money',
      operator: 'Airtel RDC',
      badge: 'Airtel',
      badgeColor: '#E61C24',
      accountNumber: 'Numéro officiel à fournir par l\'ACPDPH',
      accountName: 'ACPDPH ASBL',
      ussdPrompt: '*501# ou via application Airtel Money',
      instructions: [
        'Composez le code USSD *501# ou ouvrez Airtel Money.',
        'Sélectionnez Envoyer de l\'argent ou Paiement.',
        'Renseignez le numéro officiel de l\'ACPDPH.',
        'Saisissez le montant et votre référence en motif.',
        'Confirmez avec votre code PIN.',
      ],
      isConfigured: false,
    },
    orange: {
      id: 'orange',
      name: 'Orange Money',
      operator: 'Orange RDC',
      badge: 'Orange',
      badgeColor: '#FF6600',
      accountNumber: 'Numéro officiel à fournir par l\'ACPDPH',
      accountName: 'ACPDPH ASBL',
      ussdPrompt: '*144# ou via application Orange Money',
      instructions: [
        'Composez *144# ou ouvrez l\'application Orange Money.',
        'Sélectionnez Transfert d\'argent.',
        'Indiquez le numéro de compte officiel de l\'ACPDPH.',
        'Saisissez le montant et la référence de votre don.',
        'Validez l\'opération avec votre code secret.',
      ],
      isConfigured: false,
    },
  },

  // 2. VIREMENT BANCAIRE
  // [À FOURNIR PAR L'ACPDPH] : Coordonnées bancaires institutionnelles
  bankTransfer: {
    bankName: 'Établissement bancaire à préciser par l\'ACPDPH (ex: RAWBANK Beni)',
    agency: 'Agence de Beni, Nord-Kivu, RDC',
    beneficiary: 'ACPDPH ASBL (Agence Congolaise de Promotion des Droits des Personnes Handicapées)',
    accountUSD: 'Numéro de compte USD à fournir par l\'ACPDPH',
    accountCDF: 'Numéro de compte CDF à fournir par l\'ACPDPH',
    iban: 'Code IBAN international à fournir par l\'ACPDPH',
    swift: 'Code SWIFT / BIC à fournir par l\'ACPDPH',
    isConfigured: false,
    instructions: [
      'Initiez un virement depuis votre interface bancaire en ligne ou auprès de votre agence.',
      'Indiquez impérativement la Référence de soutien (ex: DON-2026-XXXX) en motif ou communication.',
      'Transmettez une copie de l\'avis d\'opération par e-mail à info.acpdph.asbl.rdc@gmail.com pour recevoir votre accusé officiel.',
    ],
  },

  // 3. PAIEMENT PAR CARTE BANCAIRE
  cardPayment: {
    provider: 'none',
    isConfigured: false,
    unavailableNotice:
      'Le paiement sécurisé direct par carte bancaire (Visa / Mastercard) est en cours de configuration auprès de notre prestataire agréé. En attendant son ouverture, merci de privilégier le transfert Mobile Money ou le virement bancaire.',
  },
};
