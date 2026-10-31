export interface NavDropdownItem {
  to: string;
  label: string;
}

export interface NavItem {
  to?: string;
  label: string;
  exact?: boolean;
  dropdown?: NavDropdownItem[];
}

export const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'ACCUEIL', exact: true },
  {
    label: 'ORGANISATION',
    dropdown: [
      { to: '/about', label: 'QUI SOMMES-NOUS' },
      { to: '/governance', label: 'GOUVERNANCE' },
      { to: '/pillars', label: "DOMAINES D'INTERVENTION" },
    ],
  },
  { to: '/projects', label: 'NOS PROJETS' },
  { to: '/news', label: 'ACTUALITÉS' },
  { to: '/partners', label: 'NOS PARTENAIRES' },
  { to: '/careers', label: 'OFFRES & EMPLOIS' },
  { to: '/galerie', label: 'GALERIES' },
];

export const CONTACT_ITEM = {
  to: '/contact',
  label: 'CONTACT',
};

