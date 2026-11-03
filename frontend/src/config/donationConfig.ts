import type { BankAccount } from '../types';

/**
 * Coordonnées bancaires officielles certifiées de l'ACPDPH.
 * Source de vérité unique pour l'ensemble du site web.
 */
export interface BankDetails {
  bankName: string;
  accountName: string;
  bankAddress: string;
  accountNumber: string;
  swift: string;
  currency: string;
}

export const BANK_DETAILS: BankDetails = {
  bankName: 'EQUITY BCDC',
  accountName: 'ACPDPH',
  bankAddress: 'AGENCE DE BENI',
  accountNumber: '00011150666200168501311',
  swift: 'BCDCCDKI',
  currency: 'USD',
};

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

  // 2. VIREMENT BANCAIRE OFFICIEL ACPDPH
  bankTransfer: {
    bankName: BANK_DETAILS.bankName,
    agency: BANK_DETAILS.bankAddress,
    beneficiary: BANK_DETAILS.accountName,
    accountUSD: BANK_DETAILS.accountNumber,
    accountCDF: 'À préciser par l\'ACPDPH',
    iban: '',
    swift: BANK_DETAILS.swift,
    isConfigured: true,
    instructions: [
      'Initiez un virement depuis votre interface bancaire en ligne ou auprès de votre agence bancaire.',
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

/**
 * Comptes bancaires par défaut de l'ACPDPH pour les virements.
 * Synchronisés avec MongoDB Atlas et modifiables par les administrateurs.
 */
export const DEFAULT_BANK_ACCOUNTS: BankAccount[] = [
  {
    id: 'bank-equity-bcdc-usd',
    bankName: BANK_DETAILS.bankName,
    accountName: BANK_DETAILS.accountName,
    agency: BANK_DETAILS.bankAddress,
    accountNumber: BANK_DETAILS.accountNumber,
    swift: BANK_DETAILS.swift,
    currency: BANK_DETAILS.currency,
    iban: '',
    notes: 'Compte principal pour les virements en devises étrangères (USD). Indiquer la référence de don.',
    active: true,
  },
];

