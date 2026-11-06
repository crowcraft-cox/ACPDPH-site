# Registre des Contenus Traduits Automatiquement (À Relire)

Ce document répertorie l'ensemble des contenus initiaux traduits en Anglais (EN), Italien (IT) et Allemand (DE) à partir du Français (FR).

Chaque entité créée ou mise à jour porte un indicateur `needsReview_en`, `needsReview_it`, `needsReview_de` (affiché dans l'espace d'administration sous le badge "À relire"). Dès qu'un administrateur relit ou modifie la traduction dans l'onglet correspondant, le statut passe à "Relu".

---

## 1. Glossaire Officiel Respecté

| Terme Français | English (EN) | Italiano (IT) | Deutsch (DE) |
|---|---|---|---|
| Personnes handicapées / Personnes en situation de handicap | Persons with disabilities | Persone con disabilità | Menschen mit Behinderungen |
| Défense des droits / Plaidoyer | Advocacy / Rights defense | Difesa dei diritti / Patrocinio | Interessenvertretung / Rechteverteidigung |
| Accessibilité universelle | Universal accessibility | Accessibilità universale | Universelle Barrierefreiheit |
| Éducation inclusive | Inclusive education | Educazione inclusiva | Inklusive Bildung |
| Autonomisation économique | Economic empowerment | Emancipazione economica | Wirtschaftliche Selbstständigkeit |
| Conseil d'Administration | Board of Directors | Consiglio di Amministrazione | Verwaltungsrat |
| Commission de Contrôle | Supervisory Committee | Commissione di Controllo | Kontrollkommission |
| Secrétariat Exécutif | Executive Secretariat | Segretariato Esecutivo | Exekutivsekretariat |
| RDC (République Démocratique du Congo) | DRC (Democratic Republic of the Congo) | RDC (Repubblica Democratica del Congo) | DRK (Demokratische Republik Kongo) |
| Offres d'emploi / Recrutement | Job Offers / Careers | Offerte di lavoro | Stellenangebote / Karriere |

---

## 2. Entités Initiales Traduites

### A. Piliers d'Intervention (Pillars)
1. **Plaidoyer et Défense des Droits**
   - Statut : Traduit en EN, IT, DE (À relire)
   - Champs : `title_*`, `description_*`, `bulletPoints_*`
2. **Accessibilité Universelle et Aménagements Raisonnables**
   - Statut : Traduit en EN, IT, DE (À relire)
   - Champs : `title_*`, `description_*`, `bulletPoints_*`
3. **Éducation Inclusive et Formation Professionnelle**
   - Statut : Traduit en EN, IT, DE (À relire)
   - Champs : `title_*`, `description_*`, `bulletPoints_*`
4. **Autonomisation Économique et Moyens de Subsistance**
   - Statut : Traduit en EN, IT, DE (À relire)
   - Champs : `title_*`, `description_*`, `bulletPoints_*`

### B. Projets (Projects)
1. **Centre d'Apprentissage et d'Inclusion Numérique**
   - Statut : Traduit en EN, IT, DE (À relire)
   - Champs : `title_*`, `location_*`, `type_*`, `status_*`, `description_*`
2. **Caravane Régionale d'Accessibilité et de Sensibilisation**
   - Statut : Traduit en EN, IT, DE (À relire)
   - Champs : `title_*`, `location_*`, `type_*`, `status_*`, `description_*`
3. **Autonomisation des Femmes en Situation de Handicap**
   - Statut : Traduit en EN, IT, DE (À relire)
   - Champs : `title_*`, `location_*`, `type_*`, `status_*`, `description_*`

### C. Actualités (News)
1. **Célébration de la Journée Internationale des Personnes Handicapées à Beni**
   - Statut : Traduit en EN, IT, DE (À relire)
   - Champs : `title_*`, `category_*`, `excerpt_*`, `content_*`
2. **Lancement de l'Atelier de Plaidoyer pour l'Inclusion Scolaire au Nord-Kivu**
   - Statut : Traduit en EN, IT, DE (À relire)
   - Champs : `title_*`, `category_*`, `excerpt_*`, `content_*`
3. **Remise de Matériels d'Apprentissage Adaptés aux Jeunes Apprenants**
   - Statut : Traduit en EN, IT, DE (À relire)
   - Champs : `title_*`, `category_*`, `excerpt_*`, `content_*`

### D. Offres d'Emploi (Jobs)
1. **Coordinateur / Coordinatrice de Projet Inclusion**
   - Statut : Traduit en EN, IT, DE (À relire)
   - Champs : `title_*`, `location_*`, `contractType_*`, `description_*`, `missions_*`, `profile_*`, `applicationDossier_*`
2. **Chargé(e) de Plaidoyer et Droits Humains**
   - Statut : Traduit en EN, IT, DE (À relire)
   - Champs : `title_*`, `location_*`, `contractType_*`, `description_*`, `missions_*`, `profile_*`, `applicationDossier_*`

### E. Gouvernance & Animateurs (Governance Members)
- **Conseil d'Administration** : Rôles traduits en EN, IT, DE (À relire)
- **Commission de Contrôle** : Rôles traduits en EN, IT, DE (À relire)
- **Secrétariat Exécutif** : Rôles traduits en EN, IT, DE (À relire)

### F. Galerie & Médias (Gallery)
- Titres, légendes et textes alternatifs traduits en EN, IT, DE (À relire)

---

## 3. Procédure de Relecture pour l'Administrateur

1. Accéder au panneau d'administration (`/admin`).
2. Ouvrir le gestionnaire souhaité (Projets, Actualités, Offres, Domaines, Gouvernance, Galerie, CV).
3. Dans la modale d'édition, cliquer sur l'onglet de la langue à réviser (**English**, **Italiano** ou **Deutsch**).
4. Le badge indique **"À relire"** en orange :
   - Vérifier l'exactitude des termes.
   - Si besoin, cliquer sur **"Traduire l'onglet"** pour régénérer la traduction via l'API, ou ajuster le texte manuellement.
   - Cliquer sur le bouton **"Marquer comme relu"** pour passer l'indicateur en vert **"Statut : Relu"**.
5. Enregistrer les modifications.
