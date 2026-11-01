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
    name: 'Fonds pour les Femmes Congolaises (FFC)',
    logo: '/images/partners/ffc.jpg',
    url: 'https://www.ffcrdc.org/',
  },
  {
    name: 'Ministère en charge des Personnes Vivant avec Handicap et autres Personnes Vulnérables (RDC)',
    logo: '/images/partners/minpvh.jpg',
    url: 'https://x.com/Minpvh_apvRDC',
  },
  {
    name: 'Ministère des Affaires Sociales, Actions Humanitaires et Solidarité Nationale (RDC)',
    logo: '/images/partners/minas.png',
    url: 'https://minas.gouv.cd',
  },
  {
    name: 'Servizio Diocesano per la Pastorale delle Persone con Disabilità',
    logo: '/images/partners/diocesi-noto.png',
    url: 'https://www.diocesinoto.it',
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
    url: '#',
  },
];

