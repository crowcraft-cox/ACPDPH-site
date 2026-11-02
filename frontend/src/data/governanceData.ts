export type GovernanceOrganKey = 'board' | 'audit' | 'secretariat';

export interface GovernanceMember {
  id: string;
  name: string;
  role: string;
  organ: GovernanceOrganKey;
  order?: number;
}

export function getInitials(name: string): string {
  if (!name) return '';
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  const first = words[0][0];
  const last = words[words.length - 1][0];
  return (first + last).toUpperCase();
}

export const GOVERNANCE_TEXTS = {
  mainTitle: 'Gouvernance',
  sections: {
    generalAssembly: {
      title: 'Assemblée Générale',
      paragraphs: [
        'L’Assemblée Générale est l’organe suprême et souverain de l’Agence Congolaise de Promotion des Droits des Personnes Handicapées (ACPDPH). Elle constitue le cadre de participation démocratique des membres aux grandes décisions et aux orientations stratégiques de l’organisation.',
        'Elle est notamment chargée d’adopter les grandes orientations institutionnelles, d’examiner et d’approuver les rapports d’activités et financiers, d’élire les membres du Conseil d’Administration et de statuer sur les questions majeures relatives à la vie de l’organisation.',
        'Elle se réunit en session ordinaire une fois par an et en session extraordinaire chaque fois que les circonstances l’exigent, conformément aux dispositions statutaires. L’Assemblée Générale garantit une gouvernance démocratique, participative, transparente et inclusive au sein de l’ACPDPH.',
      ],
    },
    board: {
      title: 'Conseil d’administration',
      intro: 'Le Conseil d’administration de l’Agence Congolaise de Promotion des Droits des Personnes Handicapées (ACPDPH) assure la mise en œuvre des décisions de l’Assemblée générale et veille à l’orientation stratégique de l’organisation. Il œuvre pour la promotion, la protection et la défense des droits des personnes handicapées, dans une dynamique d’inclusion, de dignité et d’égalité des chances. Le Conseil d’administration est composé de cinq animateurs engagés pour faire avancer la mission et les objectifs de l’ACPDPH:',
      conclusion: 'À travers son leadership et son engagement, le Conseil d’administration accompagne l’ACPDPH dans la réalisation de sa vision : bâtir une société où les personnes handicapées jouissent pleinement de leurs droits et participent activement au développement de la communauté.',
    },
    audit: {
      title: 'Commission de Contrôle',
      intro: 'La Commission de contrôle de l’Agence Congolaise de Promotion des Droits des Personnes Handicapées (ACPDPH) est un organe interne élu par l’Assemblée générale. Elle veille à la transparence et à la bonne gestion administrative, financière et matérielle de l’organisation. Elle assure le contrôle du respect des statuts et du règlement intérieur, et présente ses rapports à l’Assemblée générale. Elle contribue ainsi à renforcer la responsabilité, la crédibilité et la bonne gouvernance de l’ACPDPH. La commission de contrôle de ACPDPH est composé des animateurs suivant :',
    },
    secretariat: {
      title: 'Secrétariat Exécutif',
      intro: 'Le Secrétariat exécutif est l’organe opérationnel de l’Agence Congolaise de Promotion des Droits des Personnes Handicapées (ACPDPH). Il assure la coordination et la gestion quotidienne des activités, ainsi que la mise en œuvre des décisions des organes dirigeants et l’exécution des programmes et projets de l’organisation. Placé sous la direction du Secrétaire exécutif national, le Secrétariat exécutif veille à la réalisation des objectifs de l’ACPDPH, conformément au Manuel des Procédures Administratives et Financières (MAPAF) et aux dispositions du Code du travail de la République démocratique du Congo. Les animateurs du Secrétariat exécutif sont :',
    },
  },
};

export const DEFAULT_GOVERNANCE_MEMBERS: GovernanceMember[] = [
  // ── Conseil d’administration (5 animateurs) ──
  {
    id: 'gov-board-1',
    name: 'Emmanuel KAKULE SYAYUKUMBITA',
    role: 'Initiateur et Président du Conseil d’administration',
    organ: 'board',
    order: 1,
  },
  {
    id: 'gov-board-2',
    name: 'Talent KASEREKA HANGI',
    role: 'Vice-Président du Conseil d’administration',
    organ: 'board',
    order: 2,
  },
  {
    id: 'gov-board-3',
    name: 'KAMATE MULITSO Denis',
    role: 'Secrétaire du Conseil d’administration',
    organ: 'board',
    order: 3,
  },
  {
    id: 'gov-board-4',
    name: 'PALUKU NYARUKE Jean-Faustin',
    role: 'Trésorier du Conseil d’administration',
    organ: 'board',
    order: 4,
  },
  {
    id: 'gov-board-5',
    name: 'BWAKYANAKAZI MUKAVURA Achille',
    role: 'Conseiller du Conseil d’administration',
    organ: 'board',
    order: 5,
  },

  // ── Commission de Contrôle (3 animateurs) ──
  {
    id: 'gov-audit-1',
    name: 'KASWERA KINAHWA Jacquis',
    role: 'Présidente',
    organ: 'audit',
    order: 1,
  },
  {
    id: 'gov-audit-2',
    name: 'MULUME MOAVINGI Daniel',
    role: 'Secrétaire rapporteur',
    organ: 'audit',
    order: 2,
  },
  {
    id: 'gov-audit-3',
    name: 'KAMBALE LYANABO Dédié',
    role: 'Membre contrôleur',
    organ: 'audit',
    order: 3,
  },

  // ── Secrétariat Exécutif (8 animateurs) ──
  {
    id: 'gov-sec-1',
    name: 'KATEMBO TSONGO Moïse',
    role: 'Secrétaire exécutif national',
    organ: 'secretariat',
    order: 1,
  },
  {
    id: 'gov-sec-2',
    name: 'PALUKU SINDANI',
    role: 'Directeur des programmes',
    organ: 'secretariat',
    order: 2,
  },
  {
    id: 'gov-sec-3',
    name: 'KATHAKA KISWERE Christien',
    role: 'Comptable',
    organ: 'secretariat',
    order: 3,
  },
  {
    id: 'gov-sec-4',
    name: 'MASIKA KALIPI Rachel',
    role: 'Caissière',
    organ: 'secretariat',
    order: 4,
  },
  {
    id: 'gov-sec-5',
    name: 'MASIKA VINDUSIVYOLO Vinciane',
    role: 'Logisticienne',
    organ: 'secretariat',
    order: 5,
  },
  {
    id: 'gov-sec-6',
    name: 'KAKULE SYASEMBA Olivier',
    role: 'Chargé de communication',
    organ: 'secretariat',
    order: 6,
  },
  {
    id: 'gov-sec-7',
    name: 'KAVIRA BAHAKISI DIEU MERCI',
    role: 'Interprète en langue des signes',
    organ: 'secretariat',
    order: 7,
  },
  {
    id: 'gov-sec-8',
    name: 'SOKI MUSYENENE Yvonne',
    role: 'Agent Communautaire',
    organ: 'secretariat',
    order: 8,
  },
];

export const ORGAN_LABELS: Record<GovernanceOrganKey, string> = {
  board: 'Conseil d’administration',
  audit: 'Commission de Contrôle',
  secretariat: 'Secrétariat Exécutif',
};
