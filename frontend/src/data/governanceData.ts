export type GovernanceOrganKey = 'board' | 'audit' | 'secretariat';

export interface GovernanceMember {
  id: string;
  name: string;
  role: string;
  role_en?: string;
  role_it?: string;
  role_de?: string;
  organ: GovernanceOrganKey;
  order?: number;
  photo?: string;
  needsReview_en?: boolean;
  needsReview_it?: boolean;
  needsReview_de?: boolean;
}

export interface GovernanceTexts {
  mainTitle: string;
  sections: {
    generalAssembly: {
      title: string;
      paragraphs: string[];
    };
    board: {
      title: string;
      intro: string;
      conclusion: string;
    };
    audit: {
      title: string;
      intro: string;
    };
    secretariat: {
      title: string;
      intro: string;
    };
  };
}

export const GOVERNANCE_TEXTS_FR: GovernanceTexts = {
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
      intro: 'Le Conseil d’administration de l’Agence Congolaise de Promotion des Droits des Personnes Handicapées (ACPDPH) assure la mise en œuvre des décisions de l’Assemblée générale et veille à l’orientation stratégique de l’organisation. Il œuvre pour la promotion, la protection et la défense des droits des personnes handicapées, dans une dynamique d’inclusion, de dignité et d’égalité des chances. Le Conseil d’administration est composé de cinq animateurs engagés pour faire avancer la mission et les objectifs de l’ACPDPH :',
      conclusion: 'À travers son leadership et son engagement, le Conseil d’administration accompagne l’ACPDPH dans la réalisation de sa vision : bâtir une société où les personnes handicapées jouissent pleinement de leurs droits et participent activement au développement de la communauté.',
    },
    audit: {
      title: 'Commission de Contrôle',
      intro: 'La Commission de contrôle de l’Agence Congolaise de Promotion des Droits des Personnes Handicapées (ACPDPH) est un organe interne élu par l’Assemblée générale. Elle veille à la transparence et à la bonne gestion administrative, financière et matérielle de l’organisation. Elle assure le contrôle du respect des statuts et du règlement intérieur, et présente ses rapports à l’Assemblée générale. Elle contribue ainsi à renforcer la responsabilité, la crédibilité et la bonne gouvernance de l’ACPDPH. La commission de contrôle de ACPDPH est composée des animateurs suivants :',
    },
    secretariat: {
      title: 'Secrétariat Exécutif',
      intro: 'Le Secrétariat exécutif est l’organe opérationnel de l’Agence Congolaise de Promotion des Droits des Personnes Handicapées (ACPDPH). Il assure la coordination et la gestion quotidienne des activités, ainsi que la mise en œuvre des décisions des organes dirigeants et l’exécution des programmes et projets de l’organisation. Placé sous la direction du Secrétaire exécutif national, le Secrétariat exécutif veille à la réalisation des objectifs de l’ACPDPH, conformément au Manuel des Procédures Administratives et Financières (MAPAF) et aux dispositions du Code du travail de la République démocratique du Congo. Les animateurs du Secrétariat exécutif sont :',
    },
  },
};

export const GOVERNANCE_TEXTS_EN: GovernanceTexts = {
  mainTitle: 'Governance',
  sections: {
    generalAssembly: {
      title: 'General Assembly',
      paragraphs: [
        'The General Assembly is the supreme and sovereign governing body of the Congolese Agency for the Promotion of the Rights of Persons with Disabilities (ACPDPH). It embodies the democratic framework for member participation in strategic decisions and long-term policies.',
        'It is entrusted with adopting organizational policies, reviewing and approving annual activity and certified financial reports, electing members of the Board of Directors, and deliberating on foundational issues concerning the organization.',
        'It convenes in ordinary session once a year and in extraordinary session whenever circumstances require, in accordance with statutory provisions. The General Assembly guarantees democratic, participatory, transparent, and inclusive governance within ACPDPH.',
      ],
    },
    board: {
      title: 'Board of Directors',
      intro: 'The Board of Directors oversees the execution of General Assembly resolutions and steers the strategic vision of ACPDPH. It champions the promotion, protection, and defense of the rights of persons with disabilities in a dynamic of inclusion, human dignity, and equal opportunity. The Board of Directors is composed of five dedicated leaders:',
      conclusion: 'Through proactive leadership and committed stewardship, the Board of Directors accompanies ACPDPH toward the realization of an inclusive society where persons with disabilities enjoy full rights and actively shape community development.',
    },
    audit: {
      title: 'Oversight Committee',
      intro: 'The Oversight Committee of ACPDPH is an internal supervisory body elected by the General Assembly. It ensures transparency, accountability, and the sound administrative, financial, and asset management of the organization. It verifies compliance with statutes and internal regulations and submits official audit reports to the General Assembly. Its members are:',
    },
    secretariat: {
      title: 'Executive Secretariat',
      intro: 'The Executive Secretariat is the operational arm of ACPDPH. It manages day-to-day operations, coordinates field activities, and implements resolutions and projects established by governing bodies. Led by the National Executive Secretary, the Executive Secretariat ensures the achievement of organizational objectives in compliance with internal administrative manuals and the labor code of the Democratic Republic of Congo. The team includes:',
    },
  },
};

export const GOVERNANCE_TEXTS_IT: GovernanceTexts = {
  mainTitle: 'Governance',
  sections: {
    generalAssembly: {
      title: 'Assemblea Generale',
      paragraphs: [
        'L’Assemblea Generale è l’organo supremo e sovrano dell’Agenzia Congolese per la Promozione dei Diritti delle Persone con Disabilità (ACPDPH). Costituisce il quadro di partecipazione democratica dei membri alle grandi decisioni e agli orientamenti strategici dell’organizzazione.',
        'Ha il compito di adottare gli indirizzi istituzionali, approvare i rendiconti di attività e finanziari, eleggere i membri del Consiglio di Amministrazione e deliberare sulle questioni fondamentali dell’organizzazione.',
        'Si riunisce in sessione ordinaria una volta all’anno e in sessione straordinaria quando le circostanze lo richiedono, garantendo una governance democratica, partecipativa e inclusiva.',
      ],
    },
    board: {
      title: 'Consiglio di Amministrazione',
      intro: 'Il Consiglio di Amministrazione dell’ACPDPH assicura l’attuazione delle decisioni dell’Assemblea Generale e vigila sull’orientamento strategico dell’organizzazione. Opera per la promozione, protezione e difesa dei diritti delle persone con disabilità, con cinque animatori impegnati:',
      conclusion: 'Con la propria leadership e dedizione, il Consiglio di Amministrazione accompagna l’ACPDPH nella realizzazione di una società accessibile a tutti.',
    },
    audit: {
      title: 'Commissione di Controllo',
      intro: 'La Commissione di Controllo dell’ACPDPH è un organo interno eletto dall’Assemblea Generale. Vigila sulla trasparenza e la corretta gestione amministrativa, finanziaria e materiale dell’organizzazione. I componenti sono:',
    },
    secretariat: {
      title: 'Segreteria Esecutiva',
      intro: 'La Segreteria Esecutiva è l’organo operativo dell’ACPDPH preposto alla gestione quotidiana, al coordinamento tecnico e all’attuazione dei programmi sul campo. I membri della Segreteria Esecutiva sono:',
    },
  },
};

export const GOVERNANCE_TEXTS_DE: GovernanceTexts = {
  mainTitle: 'Governance',
  sections: {
    generalAssembly: {
      title: 'Generalversammlung',
      paragraphs: [
        'Die Generalversammlung ist das oberste und souveräne Organ der Kongolesischen Agentur für die Förderung der Rechte von Menschen mit Behinderungen (ACPDPH). Sie bietet den demokratischen Rahmen für die Mitbestimmung der Mitglieder bei strategischen Weichenstellungen.',
        'Sie beschließt institutionelle Leitlinien, prüft und genehmigt Tätigkeits- und Finanzberichte, wählt die Vorstandsmitglieder und entscheidet über grundlegende Vereinsangelegenheiten.',
        'Sie tritt jährlich zu einer ordentlichen Tagung zusammen und sichert eine demokratische, transparente und partizipative Governance innerhalb der ACPDPH.',
      ],
    },
    board: {
      title: 'Vorstand',
      intro: 'Der Vorstand der ACPDPH sorgt für die Umsetzung der Beschlüsse der Generalversammlung und wacht über die strategische Ausrichtung. Fünf engagierte Führungspersönlichkeiten treiben die Mission der ACPDPH voran:',
      conclusion: 'Durch engagierte Führung begleitet der Vorstand die ACPDPH bei der Verwirklichung einer inklusiven Gesellschaft, in der Menschen mit Behinderungen gleichberechtigt teilhaben.',
    },
    audit: {
      title: 'Kontrollkommission',
      intro: 'Die Kontrollkommission der ACPDPH ist ein von der Generalversammlung gewähltes Kontrollorgan. Sie überwacht die transparente und satzungskonforme Haushalts- und Vermögensführung. Ihre Mitglieder sind:',
    },
    secretariat: {
      title: 'Exekutivsekretariat',
      intro: 'Das Exekutivsekretariat ist das operative Leitungsorgan der ACPDPH für das Tagesgeschäft und die Projektumsetzung vor Ort. Unter Leitung des Nationalen Exekutivsekretärs setzt sich das Team wie folgt zusammen:',
    },
  },
};

export function getGovernanceTexts(lang: 'fr' | 'en' | 'it' | 'de'): GovernanceTexts {
  switch (lang) {
    case 'en': return GOVERNANCE_TEXTS_EN;
    case 'it': return GOVERNANCE_TEXTS_IT;
    case 'de': return GOVERNANCE_TEXTS_DE;
    default: return GOVERNANCE_TEXTS_FR;
  }
}

export const GOVERNANCE_TEXTS = GOVERNANCE_TEXTS_FR;

export const DEFAULT_GOVERNANCE_MEMBERS: GovernanceMember[] = [
  // ── Conseil d’administration (5 animateurs) ──
  {
    id: 'gov-board-1',
    name: 'Emmanuel KAKULE SYAYUKUMBITA',
    role: 'Initiateur et Président du Conseil d’administration',
    role_en: 'Initiator and President of the Board of Directors',
    role_it: 'Iniziatore e Presidente del Consiglio di Amministrazione',
    role_de: 'Initiator und Vorstandsvorsitzender',
    organ: 'board',
    order: 1,
    needsReview_en: true,
    needsReview_it: true,
    needsReview_de: true,
  },
  {
    id: 'gov-board-2',
    name: 'Talent KASEREKA HANGI',
    role: 'Vice-Président du Conseil d’administration',
    role_en: 'Vice-President of the Board of Directors',
    role_it: 'Vicepresidente del Consiglio di Amministrazione',
    role_de: 'Stellvertretender Vorstandsvorsitzender',
    organ: 'board',
    order: 2,
    needsReview_en: true,
    needsReview_it: true,
    needsReview_de: true,
  },
  {
    id: 'gov-board-3',
    name: 'KAMATE MULITSO Denis',
    role: 'Secrétaire du Conseil d’administration',
    role_en: 'Secretary of the Board of Directors',
    role_it: 'Segretario del Consiglio di Amministrazione',
    role_de: 'Schriftführer des Vorstands',
    organ: 'board',
    order: 3,
    needsReview_en: true,
    needsReview_it: true,
    needsReview_de: true,
  },
  {
    id: 'gov-board-4',
    name: 'PALUKU NYARUKE Jean-Faustin',
    role: 'Trésorier du Conseil d’administration',
    role_en: 'Treasurer of the Board of Directors',
    role_it: 'Tesoriere del Consiglio di Amministrazione',
    role_de: 'Schatzmeister des Vorstands',
    organ: 'board',
    order: 4,
    needsReview_en: true,
    needsReview_it: true,
    needsReview_de: true,
  },
  {
    id: 'gov-board-5',
    name: 'BWAKYANAKAZI MUKAVURA Achille',
    role: 'Conseiller du Conseil d’administration',
    role_en: 'Advisor of the Board of Directors',
    role_it: 'Consigliere del Consiglio di Amministrazione',
    role_de: 'Berater des Vorstands',
    organ: 'board',
    order: 5,
    needsReview_en: true,
    needsReview_it: true,
    needsReview_de: true,
  },

  // ── Commission de Contrôle (3 animateurs) ──
  {
    id: 'gov-audit-1',
    name: 'KASWERA KINAHWA Jacquis',
    role: 'Présidente',
    role_en: 'Chairperson',
    role_it: 'Presidente',
    role_de: 'Vorsitzende',
    organ: 'audit',
    order: 1,
    needsReview_en: true,
    needsReview_it: true,
    needsReview_de: true,
  },
  {
    id: 'gov-audit-2',
    name: 'MULUME MOAVINGI Daniel',
    role: 'Secrétaire rapporteur',
    role_en: 'Reporting Secretary',
    role_it: 'Segretario verbalizzante',
    role_de: 'Schriftführendes Mitglied',
    organ: 'audit',
    order: 2,
    needsReview_en: true,
    needsReview_it: true,
    needsReview_de: true,
  },
  {
    id: 'gov-audit-3',
    name: 'KAMBALE LYANABO Dédié',
    role: 'Membre contrôleur',
    role_en: 'Oversight Member',
    role_it: 'Membro revisore',
    role_de: 'Prüfendes Mitglied',
    organ: 'audit',
    order: 3,
    needsReview_en: true,
    needsReview_it: true,
    needsReview_de: true,
  },

  // ── Secrétariat Exécutif (8 animateurs) ──
  {
    id: 'gov-sec-1',
    name: 'KATEMBO TSONGO Moïse',
    role: 'Secrétaire exécutif national',
    role_en: 'National Executive Secretary',
    role_it: 'Segretario esecutivo nazionale',
    role_de: 'Nationaler Exekutivsekretär',
    organ: 'secretariat',
    order: 1,
    needsReview_en: true,
    needsReview_it: true,
    needsReview_de: true,
  },
  {
    id: 'gov-sec-2',
    name: 'PALUKU SINDANI',
    role: 'Directeur des programmes',
    role_en: 'Director of Programs',
    role_it: 'Direttore dei programmi',
    role_de: 'Programmleiter',
    organ: 'secretariat',
    order: 2,
    needsReview_en: true,
    needsReview_it: true,
    needsReview_de: true,
  },
  {
    id: 'gov-sec-3',
    name: 'KATHAKA KISWERE Christien',
    role: 'Comptable',
    role_en: 'Accountant',
    role_it: 'Contabile',
    role_de: 'Buchhalter',
    organ: 'secretariat',
    order: 3,
    needsReview_en: true,
    needsReview_it: true,
    needsReview_de: true,
  },
  {
    id: 'gov-sec-4',
    name: 'MASIKA KALIPI Rachel',
    role: 'Caissière',
    role_en: 'Cashier',
    role_it: 'Cassiera',
    role_de: 'Kassiererin',
    organ: 'secretariat',
    order: 4,
    needsReview_en: true,
    needsReview_it: true,
    needsReview_de: true,
  },
  {
    id: 'gov-sec-5',
    name: 'MASIKA VINDUSIVYOLO Vinciane',
    role: 'Logisticienne',
    role_en: 'Logistician',
    role_it: 'Logista',
    role_de: 'Logistikerin',
    organ: 'secretariat',
    order: 5,
    needsReview_en: true,
    needsReview_it: true,
    needsReview_de: true,
  },
  {
    id: 'gov-sec-6',
    name: 'KAKULE SYASEMBA Olivier',
    role: 'Chargé de communication',
    role_en: 'Communications Officer',
    role_it: 'Responsabile comunicazione',
    role_de: 'Kommunikationsbeauftragter',
    organ: 'secretariat',
    order: 6,
    needsReview_en: true,
    needsReview_it: true,
    needsReview_de: true,
  },
  {
    id: 'gov-sec-7',
    name: 'KAVIRA BAHAKISI DIEU MERCI',
    role: 'Interprète en langue des signes',
    role_en: 'Sign Language Interpreter',
    role_it: 'Interprete lingua dei segni',
    role_de: 'Gebärdensprachdolmetscher',
    organ: 'secretariat',
    order: 7,
    needsReview_en: true,
    needsReview_it: true,
    needsReview_de: true,
  },
  {
    id: 'gov-sec-8',
    name: 'SOKI MUSYENENE Yvonne',
    role: 'Agent Communautaire',
    role_en: 'Community Worker',
    role_it: 'Operatrice comunitaria',
    role_de: 'Gemeindearbeiterin',
    organ: 'secretariat',
    order: 8,
    needsReview_en: true,
    needsReview_it: true,
    needsReview_de: true,
  },
];

export const ORGAN_LABELS_FR: Record<GovernanceOrganKey, string> = {
  board: 'Conseil d’administration',
  audit: 'Commission de Contrôle',
  secretariat: 'Secrétariat Exécutif',
};

export const ORGAN_LABELS_EN: Record<GovernanceOrganKey, string> = {
  board: 'Board of Directors',
  audit: 'Oversight Committee',
  secretariat: 'Executive Secretariat',
};

export const ORGAN_LABELS_IT: Record<GovernanceOrganKey, string> = {
  board: 'Consiglio di Amministrazione',
  audit: 'Commissione di Controllo',
  secretariat: 'Segreteria Esecutiva',
};

export const ORGAN_LABELS_DE: Record<GovernanceOrganKey, string> = {
  board: 'Vorstand',
  audit: 'Kontrollkommission',
  secretariat: 'Exekutivsekretariat',
};

export function getOrganLabel(organ: GovernanceOrganKey, lang: 'fr' | 'en' | 'it' | 'de'): string {
  switch (lang) {
    case 'en': return ORGAN_LABELS_EN[organ] || ORGAN_LABELS_FR[organ];
    case 'it': return ORGAN_LABELS_IT[organ] || ORGAN_LABELS_EN[organ] || ORGAN_LABELS_FR[organ];
    case 'de': return ORGAN_LABELS_DE[organ] || ORGAN_LABELS_EN[organ] || ORGAN_LABELS_FR[organ];
    default: return ORGAN_LABELS_FR[organ];
  }
}

export const ORGAN_LABELS = ORGAN_LABELS_FR;
