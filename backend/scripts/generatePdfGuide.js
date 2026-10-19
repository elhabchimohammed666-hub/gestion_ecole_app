const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

function buildPdfGuide() {
  const outputPath = path.join(__dirname, '../../GUIDE_REFAIRE_A_ZERO.pdf');
  const doc = new PDFDocument({
    margin: 50,
    size: 'A4',
    bufferPages: true
  });

  const stream = fs.createWriteStream(outputPath);
  doc.pipe(stream);

  // Couleurs
  const PRIMARY_COLOR = '#064e3b'; // Vert foncé émeraude
  const GOLD_COLOR = '#b45309';    // Doré ambré
  const TEXT_DARK = '#1e293b';     // Gris foncé
  const MUTED_TEXT = '#64748b';    // Gris moyen

  // --- PAGE DE GARDE ---
  doc.rect(0, 0, doc.page.width, 180).fill(PRIMARY_COLOR);
  
  doc.fillColor('#fbbf24')
     .fontSize(28)
     .font('Helvetica-Bold')
     .text('CENTRE OMEGA', 50, 45, { align: 'center' });

  doc.fillColor('#ffffff')
     .fontSize(14)
     .font('Helvetica')
     .text('SYSTEME DE GESTION DE SOUTIEN SCOLAIRE & LANGUES', 50, 85, { align: 'center' });

  doc.fillColor('#99f6e4')
     .fontSize(11)
     .font('Helvetica')
     .text('MERN STACK (MongoDB, Express, React, Node.js) + Tailwind CSS + Vite', 50, 115, { align: 'center' });

  doc.moveDown(6);

  doc.fillColor(PRIMARY_COLOR)
     .fontSize(22)
     .font('Helvetica-Bold')
     .text('GUIDE TECHNIQUE DE RECONSTRUCTION DE A A Z', { align: 'center' });

  doc.moveDown(0.5);

  doc.fillColor(MUTED_TEXT)
     .fontSize(12)
     .font('Helvetica')
     .text('Manuel pas-a-pas pour concevoir, developper et deployer l\'application', { align: 'center' });

  doc.moveDown(2);

  // Encadré Caractéristiques
  const boxTop = 320;
  doc.roundedRect(50, boxTop, doc.page.width - 100, 180, 10)
     .lineWidth(1)
     .strokeColor('#cbd5e1')
     .fillAndStroke('#f8fafc', '#0d9488');

  doc.fillColor(PRIMARY_COLOR)
     .fontSize(13)
     .font('Helvetica-Bold')
     .text('Points Cles du Projet :', 70, boxTop + 15);

  doc.fillColor(TEXT_DARK)
     .fontSize(10)
     .font('Helvetica')
     .text('- Architecture complete MERN Stack moderne et modulable.', 75, boxTop + 40)
     .text('- Interface utilisateur ultra-fluide avec React 18, Vite et Tailwind CSS.', 75, boxTop + 60)
     .text('- Support trilingue (Arabe RTL, Francais LTR, Anglais LTR).', 75, boxTop + 80)
     .text('- Modules metiers : Eleves, Paiements, Reçus PDF, Professeurs, Emploi du temps, Absences.', 75, boxTop + 100)
     .text('- Gestion financiere avancee : Suivi des recettes, charges et benefice net.', 75, boxTop + 120)
     .text('- Integrations directes : Relances et alertes absences via WhatsApp.', 75, boxTop + 140);

  doc.fillColor(MUTED_TEXT)
     .fontSize(10)
     .font('Helvetica')
     .text('Date de generation : Octobre 2026  |  Version : 1.0.0 Production', 50, 720, { align: 'center' });

  // --- NOUVELLE PAGE : SOMMAIRE ET PRE-REQUIS ---
  doc.addPage();

  function printHeader(title) {
    doc.fillColor(PRIMARY_COLOR)
       .fontSize(16)
       .font('Helvetica-Bold')
       .text(title);
    doc.strokeColor(GOLD_COLOR)
       .lineWidth(2)
       .moveTo(50, doc.y + 4)
       .lineTo(doc.page.width - 50, doc.y + 4)
       .stroke();
    doc.moveDown(1.5);
  }

  printHeader('1. SOMMAIRE & ARCHITECTURE TECHNIQUE');

  doc.fillColor(TEXT_DARK)
     .fontSize(10)
     .font('Helvetica')
     .text('Ce projet est concu selon une architecture decouplee Client-Serveur :', { lineGap: 4 })
     .text('• Backend (Dossier /backend) : API RESTful Node.js + Express.js avec Mongoose pour la persistance MongoDB. Il propose egalement un mode local de secours (JSON DB) pour fonctionner immediatement.', { lineGap: 4 })
     .text('• Frontend (Dossier /frontend) : Single Page Application (SPA) propulsee par React 18 et Vite pour une vitesse d\'execution maximale. Le design repose sur Tailwind CSS avec prise en charge native du mode RTL (Right-to-Left pour l\'arabe).', { lineGap: 4 })
     .text('• Moteur de generation PDF : Impression et export automatique de reçus (وصل الأداء), listes d\'eleves et emplois du temps hebdomadaires.', { lineGap: 6 });

  doc.moveDown(1);
  printHeader('2. PREREQUIS & INSTALLATION DES OUTILS');

  doc.fillColor(TEXT_DARK)
     .fontSize(10)
     .text('Avant de commencer, installez les outils suivants sur votre machine :', { lineGap: 4 })
     .text('1. Node.js (version 18 ou superieure) : telechargeable sur https://nodejs.org', { lineGap: 4 })
     .text('2. Editeur de code recommande : Visual Studio Code', { lineGap: 4 })
     .text('3. Navigateur Web : Google Chrome, Brave, ou Microsoft Edge', { lineGap: 4 })
     .text('4. Base de donnees MongoDB (Optionnelle au depart grace au stockage local inclus) :', { lineGap: 4 })
     .text('   - Soit MongoDB Community Server en local sur mongodb://127.0.0.1:27017', { lineGap: 4 })
     .text('   - Soit un cluster gratuit sur MongoDB Atlas Cloud.', { lineGap: 8 });

  doc.moveDown(1);
  printHeader('3. ETAPE PAR ETAPE : CREATION DU BACKEND');

  doc.fillColor(TEXT_DARK)
     .fontSize(10)
     .text('1. Initialiser le projet backend :', { lineGap: 2 });
  
  doc.font('Courier')
     .fontSize(9)
     .fillColor('#0f766e')
     .text('mkdir ecole && cd ecole', { indent: 20 })
     .text('mkdir backend && cd backend', { indent: 20 })
     .text('npm init -y', { indent: 20 })
     .text('npm install express mongoose cors dotenv', { indent: 20 });

  doc.moveDown(0.5);
  doc.font('Helvetica')
     .fontSize(10)
     .fillColor(TEXT_DARK)
     .text('2. Structure des Modeles Mongoose :', { lineGap: 4 })
     .text('• Student : Nom, niveau scolaire, telephone, tarif mensuel, matieres et professeurs affectes.', { indent: 15, lineGap: 2 })
     .text('• Teacher : Nom complet, matiere enseignee, telephone, volume horaire par semaine, tarif horaire.', { indent: 15, lineGap: 2 })
     .text('• Payment : Lien eleve, mois de reglement, montant du, montant paye, reste, statut (paid, partial, unpaid), numero de reçu.', { indent: 15, lineGap: 2 })
     .text('• Expense : Categorie (loyer, professeurs, salaires, electricite, internet, divers), montant, date, beneficiaire.', { indent: 15, lineGap: 2 })
     .text('• Attendance : Eleve, date, motif de l\'absence, justification.', { indent: 15, lineGap: 2 })
     .text('• Timetable : Matiere, professeur, salle, jour de la semaine, heures debut/fin, code couleur.', { indent: 15, lineGap: 4 });

  // --- NOUVELLE PAGE : FRONTEND ET INTERFACE ---
  doc.addPage();
  printHeader('4. ETAPE PAR ETAPE : CREATION DU FRONTEND');

  doc.fillColor(TEXT_DARK)
     .fontSize(10)
     .font('Helvetica')
     .text('1. Initialiser le projet avec Vite et React :', { lineGap: 2 });

  doc.font('Courier')
     .fontSize(9)
     .fillColor('#0f766e')
     .text('cd ../frontend', { indent: 20 })
     .text('npm create vite@latest . -- --template react', { indent: 20 })
     .text('npm install', { indent: 20 })
     .text('npm install lucide-react recharts html2canvas jspdf', { indent: 20 })
     .text('npm install -D tailwindcss postcss autoprefixer', { indent: 20 })
     .text('npx tailwindcss init -p', { indent: 20 });

  doc.moveDown(0.5);
  doc.font('Helvetica')
     .fontSize(10)
     .fillColor(TEXT_DARK)
     .text('2. Configuration de Tailwind CSS et Polices :', { lineGap: 4 })
     .text('Dans le fichier index.html, ajoutez les polices Google Fonts Cairo et Tajawal pour un rendu calligraphique arabe optimal. Dans tailwind.config.js, activez les polices et la palette vert émeraude et doré ambre.', { lineGap: 6 });

  doc.moveDown(0.5);
  doc.text('3. Les Composants Clefs a Developper :', { lineGap: 4 })
     .text('• Sidebar : Menu lateral vert fonce avec logo d\'Omega, badges d\'alertes (impayes, absences) et raccourci WhatsApp.', { indent: 15, lineGap: 2 })
     .text('• Navbar : Salutation "Bienvenue admin", selecteur de langue (Arabe, Francais, Anglais) et cloche de notification.', { indent: 15, lineGap: 2 })
     .text('• LanguageContext : Gestion de la direction RTL/LTR et traduction reactive dans toute l\'application.', { indent: 15, lineGap: 2 })
     .text('• ReceiptModal : Pop-up reproduisant le reçu officiel du centre (وصل الأداء) avec logo, detail et impression directe.', { indent: 15, lineGap: 2 })
     .text('• TeacherListModal : Liste A4 imprimable des eleves par professeur.', { indent: 15, lineGap: 2 })
     .text('• TimetablePrintModal : Emploi du temps hebdomadaire format poster pret a etre affiche.', { indent: 15, lineGap: 6 });

  doc.moveDown(1);
  printHeader('5. LES PAGES PRINCIPALES DE L\'APPLICATION');

  doc.fillColor(TEXT_DARK)
     .fontSize(10)
     .text('1. Tableau de Bord (Dashboard) : Cartes d\'indicateurs cles (Eleves, Professeurs, Payes, Impayes, Recettes, Absences) et 4 panneaux de synthese rapide.', { lineGap: 3 })
     .text('2. Gestion des Eleves : Formulaire d\'ajout complet avec selection multiple de matieres et affectation directe des professeurs.', { lineGap: 3 })
     .text('3. Paiements Mensuels : Grille avec filtre par statut, modal d\'enregistrement (reglement total ou partiel) et generation de reçu officiel.', { lineGap: 3 })
     .text('4. Comptes Professeurs : Calcul automatique du nombre d\'eleves affectes et export de la liste d\'appel en PDF.', { lineGap: 3 })
     .text('5. Emploi du Temps : Calendrier hebdomadaire interactif avec code couleur par matiere et gestion des creneaux.', { lineGap: 3 })
     .text('6. Gestion des Absences : Saisie rapide (recherche auto-complete de l\'eleve) et lien de notification instantanee aux parents par WhatsApp.', { lineGap: 3 })
     .text('7. Eleves Partis : Espace dedie aux abandons avec conservation des historiques et bouton de re-inscription en 1 clic.', { lineGap: 3 })
     .text('8. Depenses du Centre : Suivi des postes de charges (loyer, salaires, eau/electricite, internet) et calcul dynamique du benefice net.', { lineGap: 3 })
     .text('9. Rapports & Statistiques : Graphiques interactifs Recharts (repartition par matiere, niveau, professeur, evolution temporelle).', { lineGap: 6 });

  // --- NOUVELLE PAGE : COMMANDES ET DEMARRAGE ---
  doc.addPage();
  printHeader('6. DEMARRAGE ET TEST DE L\'APPLICATION');

  doc.fillColor(TEXT_DARK)
     .fontSize(10)
     .font('Helvetica')
     .text('Pour lancer votre projet et tester l\'ensemble des fonctionnalites :', { lineGap: 6 });

  doc.fillColor(PRIMARY_COLOR)
     .font('Helvetica-Bold')
     .text('Etape 1 : Demarrer le serveur Backend (Port 5000)');

  doc.font('Courier')
     .fontSize(9)
     .fillColor('#0f766e')
     .text('cd ecole/backend', { indent: 20 })
     .text('node server.js', { indent: 20 });

  doc.moveDown(0.5);
  doc.fillColor(PRIMARY_COLOR)
     .font('Helvetica-Bold')
     .fontSize(10)
     .text('Etape 2 : Demarrer l\'application Frontend (Port 5173)');

  doc.font('Courier')
     .fontSize(9)
     .fillColor('#0f766e')
     .text('cd ecole/frontend', { indent: 20 })
     .text('npm run dev', { indent: 20 });

  doc.moveDown(1);
  doc.fillColor(TEXT_DARK)
     .font('Helvetica')
     .fontSize(10)
     .text('Ouvrez ensuite votre navigateur sur http://localhost:5173 pour interagir avec le centre.', { lineGap: 10 });

  printHeader('7. BONNES PRATIQUES & CONSEILS DE DEPLOIEMENT');

  doc.fillColor(TEXT_DARK)
     .fontSize(10)
     .text('• Variables d\'environnement : Ne commitez jamais vos mots de passe dans Git. Utilisez le fichier backend/.env pour renseigner MONGODB_URI.', { lineGap: 4 })
     .text('• Production Frontend : Pour generer la version optimisee, executez `npm run build` dans le dossier frontend. Le dossier dist/ genere est pret a etre heberge sur Vercel, Netlify ou Nginx.', { lineGap: 4 })
     .text('• Sauvegarde des donnees : Avec MongoDB Atlas, activez les snapshots automatiques quotidiens.', { lineGap: 4 })
     .text('• Support Mobile & Tablette : L\'interface s\'adapte automatiquement aux ecrans de smartphones grace aux classes responsives Tailwind (sm:, md:, lg:).', { lineGap: 10 });

  // Pied de page encadré
  doc.roundedRect(50, 640, doc.page.width - 100, 75, 8)
     .fillAndStroke('#ecfdf5', '#059669');

  doc.fillColor(PRIMARY_COLOR)
     .fontSize(11)
     .font('Helvetica-Bold')
     .text('Projet Centre Omega - Realise avec succes !', 70, 655);

  doc.fillColor(TEXT_DARK)
     .fontSize(9)
     .font('Helvetica')
     .text('Toutes les fonctionnalites presentees dans la video de demonstration ont ete implementees avec rigueur, en respectant scrupuleusement la pile MERN, Tailwind CSS et Vite.', 70, 675, { width: doc.page.width - 140 });

  // Numérotation des pages
  const range = doc.bufferedPageRange();
  for (let i = range.start; i < range.start + range.count; i++) {
    doc.switchToPage(i);
    doc.fillColor('#94a3b8')
       .fontSize(8)
       .text(`Page ${i + 1} sur ${range.count}  -  Centre Omega Documentation Technique`, 50, doc.page.height - 35, { align: 'center' });
  }

  doc.end();

  return new Promise((resolve, reject) => {
    stream.on('finish', () => {
      console.log('PDF généré avec succès dans :', outputPath);
      resolve(outputPath);
    });
    stream.on('error', reject);
  });
}

buildPdfGuide().catch(console.error);
