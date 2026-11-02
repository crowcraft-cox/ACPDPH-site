import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import * as fs from 'fs';
import * as path from 'path';

async function generateTemplate() {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // En-tête / Consignes
          new Paragraph({
            text: 'MODÈLE DE CV OFFICIEL — ACPDPH',
            heading: HeadingLevel.TITLE,
            spacing: { after: 120 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'Consignes de remplissage :',
                bold: true,
                color: '1F3757',
              }),
            ],
            spacing: { after: 60 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: '• Respectez les titres de sections (Titre 1 et Titre 2) pour garantir l\'extraction automatique.\n',
                italics: true,
                color: '666666',
              }),
              new TextRun({
                text: '• Remplissez les données après les deux-points (:).\n',
                italics: true,
                color: '666666',
              }),
              new TextRun({
                text: '• Pour les langues, indiquez un niveau de 0 à 100 (ex: 85 ou 85%).\n',
                italics: true,
                color: '666666',
              }),
              new TextRun({
                text: '• Enregistrez votre fichier au format .docx avant de l\'importer dans l\'espace administrateur.',
                italics: true,
                color: '666666',
              }),
            ],
            spacing: { after: 300 },
          }),

          // SECTION IDENTITÉ
          new Paragraph({
            text: 'Identité',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Prénom(s) : ', bold: true }),
              new TextRun({ text: 'Emmanuel' }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Nom(s) : ', bold: true }),
              new TextRun({ text: 'KAKULE SYAYUKUMBITA' }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Fonction : ', bold: true }),
              new TextRun({ text: 'Initiateur et Président du Conseil d’administration' }),
            ],
            spacing: { after: 200 },
          }),

          // SECTION À PROPOS
          new Paragraph({
            text: 'À propos',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'Militant dévoué pour la défense et la promotion des droits des personnes vivant avec handicap en République Démocratique du Congo. Fort d\'une solide expérience en plaidoyer communautaire, en gestion de projets inclusifs et en leadership associatif, engagé pour l\'autonomie et la dignité de chacun.',
              }),
            ],
            spacing: { after: 200 },
          }),

          // SECTION CONTACT
          new Paragraph({
            text: 'Contact',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Téléphone : ', bold: true }),
              new TextRun({ text: '+243 999 000 000' }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'E-mail : ', bold: true }),
              new TextRun({ text: 'contact.membre@acpdph.org' }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Adresse : ', bold: true }),
              new TextRun({ text: 'Beni, Nord-Kivu, RDC' }),
            ],
            spacing: { after: 200 },
          }),

          // SECTION COMPÉTENCES
          new Paragraph({
            text: 'Compétences',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 100 },
          }),
          new Paragraph({
            children: [new TextRun({ text: 'Plaidoyer juridique et défense des droits humains' })],
            bullet: { level: 0 },
          }),
          new Paragraph({
            children: [new TextRun({ text: 'Coordination et gouvernance associative' })],
            bullet: { level: 0 },
          }),
          new Paragraph({
            children: [new TextRun({ text: 'Sensibilisation communautaire et inclusion sociale' })],
            bullet: { level: 0 },
          }),
          new Paragraph({
            children: [new TextRun({ text: 'Gestion de partenariats institutionnels et bailleurs' })],
            bullet: { level: 0 },
            spacing: { after: 200 },
          }),

          // SECTION LANGUES
          new Paragraph({
            text: 'Langues',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 100 },
          }),
          new Paragraph({
            children: [new TextRun({ text: 'Français – 100' })],
          }),
          new Paragraph({
            children: [new TextRun({ text: 'Swahili – 90' })],
          }),
          new Paragraph({
            children: [new TextRun({ text: 'Anglais – 75' })],
            spacing: { after: 200 },
          }),

          // SECTION EXPÉRIENCE
          new Paragraph({
            text: 'Expérience',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 100 },
          }),

          // Expérience 1
          new Paragraph({
            text: 'Président du Conseil d\'Administration',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 100, after: 50 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Organisation : ', bold: true }),
              new TextRun({ text: 'ACPDPH' }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Période : ', bold: true }),
              new TextRun({ text: '2020 – Présent' }),
            ],
          }),
          new Paragraph({
            children: [new TextRun({ text: 'Supervision des orientations stratégiques et représentation institutionnelle.' })],
            bullet: { level: 0 },
          }),
          new Paragraph({
            children: [new TextRun({ text: 'Négociation et suivi des protocoles d\'accord avec les partenaires techniques et financiers.' })],
            bullet: { level: 0 },
          }),

          // Expérience 2 (à dupliquer)
          new Paragraph({
            text: 'Coordonnateur de Projet d\'Inclusion',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 140, after: 50 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Organisation : ', bold: true }),
              new TextRun({ text: 'Initiative Citoyenne Beni' }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Période : ', bold: true }),
              new TextRun({ text: '2016 – 2020' }),
            ],
          }),
          new Paragraph({
            children: [new TextRun({ text: 'Mise en œuvre des activités d\'appui aux personnes vulnérables et déplacées.' })],
            bullet: { level: 0 },
          }),
          new Paragraph({
            children: [new TextRun({ text: 'Organisation de tables rondes pour l\'accessibilité des bâtiments publics.' })],
            bullet: { level: 0 },
            spacing: { after: 200 },
          }),

          // SECTION FORMATION
          new Paragraph({
            text: 'Formation',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 100 },
          }),

          // Formation 1
          new Paragraph({
            text: 'Université de Beni',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 100, after: 50 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Diplôme : ', bold: true }),
              new TextRun({ text: 'Licence en Droit Public et Droits Humains' }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Période : ', bold: true }),
              new TextRun({ text: '2012 – 2015' }),
            ],
          }),

          // Formation 2 (à dupliquer)
          new Paragraph({
            text: 'Institut Supérieur Pédagogique',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 140, after: 50 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Diplôme : ', bold: true }),
              new TextRun({ text: 'Certificat en Gestion de Projets Associatifs et Plaidoyer' }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Période : ', bold: true }),
              new TextRun({ text: '2016' }),
            ],
            spacing: { after: 200 },
          }),
        ],
      },
    ],
  });

  const outDir = path.resolve(__dirname, '../../frontend/public/modeles');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const outPath = path.join(outDir, 'modele-cv-acpdph.docx');
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(outPath, buffer);
  console.log(`Modèle généré avec succès dans : ${outPath}`);
}

generateTemplate().catch(console.error);

