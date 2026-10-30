export interface PartnerLogo {
  name: string;
  logo: string | null;
  url: string;
}

export const PARTNER_LOGOS: PartnerLogo[] = [
  {
    name: 'Conseil Norvégien pour les Réfugiés (NRC)',
    logo: '/images/partners/nrc.svg',
    url: 'https://www.nrc.no',
  },
  {
    name: 'Comité International de la Croix-Rouge (CICR)',
    logo: '/images/partners/icrc.svg',
    url: 'https://www.icrc.org',
  },
  {
    name: 'Servizio Diocesano per la Pastorale delle Persone con Disabilità',
    logo: '/images/partners/diocesi-noto.png',
    url: 'https://www.diocesinoto.it', // TODO: URL à confirmer (service diocésain de pastorale du handicap rattaché au Diocèse de Noto)
  },
  {
    name: 'Ministère des Affaires Sociales, Actions Humanitaires et Solidarité Nationale (RDC)',
    logo: '/images/partners/minas.png',
    url: 'https://minas.gouv.cd',
  },
  {
    name: 'Ministère en charge des Personnes Vivant avec Handicap et autres Personnes Vulnérables (RDC)',
    logo: null, // Emplacement texte provisoire (logo officiel vectoriel non disponible publiquement)
    url: '#', // TODO: URL à confirmer (département ministériel sans portail autonome public propre)
  },
  {
    name: 'Cluster Éducation',
    logo: '/images/partners/cluster-education.png',
    url: 'https://www.educationcluster.net',
  },
  {
    name: 'Cluster Protection',
    logo: '/images/partners/cluster-protection.svg',
    url: 'https://globalprotectioncluster.org',
  },
  {
    name: 'GTPE',
    logo: '/images/partners/gtpe.png',
    url: '#', // TODO: URL à confirmer (Groupe de Travail Protection de l'Enfance - sous-cluster RDC / CP AoR)
  },
];

