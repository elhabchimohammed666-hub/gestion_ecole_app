# 🏫 Système de Gestion de Centre de Soutien Scolaire & Langues (Centre Omega)
## MERN Stack (MongoDB, Express, React, Node.js) + Tailwind CSS + Vite

Projet complet réalisé conformément à la vidéo de démonstration.

---

### 🚀 Démarrage Rapide

#### 1. Démarrer le Backend (Port 5000)
```bash
cd backend
npm install
node server.js
```
> Le serveur Express démarre sur `http://localhost:5000`.
> Il se connecte automatiquement à MongoDB (défini dans `.env` par `MONGODB_URI`) ou active son stockage local persistant avec les 200 élèves de démo si MongoDB n'est pas encore lancé.

#### 2. Démarrer le Frontend (Port 5173)
```bash
cd frontend
npm install
npm run dev
```
> L'application React + Vite démarre sur `http://localhost:5173`.

---

### 📋 Fonctionnalités Incluses (Conformes à la Démo Vidéo)

1. **Tableau de Bord Interactif ** :
   - Cartes statistiques (Total élèves, Professeurs, Payés, Impayés, Recettes, Absences).
   - 4 widgets de synthèse : Derniers paiements, nouvelles inscriptions, résumé financier, élèves partis.
2. **Gestion des Élèves ** :
   - Inscription complète avec niveau scolaire et multi-matières avec professeurs assignés.
   - Recherche en temps réel et filtre par niveau scolaire.
   - Modification, marquage comme parti, suppression.
3. **Paiements Mensuels & Reçus ** :
   - Suivi par mois avec statuts colorés (Payé en totalité, Partiel, Impayé).
   - Enregistrement de paiement avec calcul automatique du reste.
   - **Génération et impression du reçu officiel ** avec logo du centre, détails de l'élève, matières et signature.
4. **Comptes des Professeurs ** :
   - Fiches professeurs avec volume horaire et nombre d'élèves affectés.
   - **Téléchargement de la liste d'appel des élèves par professeur en PDF **.
5. **Emploi du Temps Hebdomadaire ** :
   - Synthèse des heures d'enseignement par professeur.
   - Grille hebdomadaire interactive du lundi au dimanche avec codes couleurs.
   - **Impression et export PDF de l'emploi du temps officiel**.
6. **Gestion des Absences ** :
   - Saisie ultra-rapide par recherche du nom .
   - Justification de l'absence et **bouton d'alerte direct aux parents via WhatsApp**.
7. **Élèves Partis ** :
   - Historique des départs avec motifs.
   - **Réinscription en 1 clic ** dans la liste active.
8. **Dépenses du Centre  :
   - Suivi des charges : loyer, rémunération professeurs, salaires, électricité, internet, etc.
   - Calcul automatique et instantané du **bénéfice net du centre**.
9. **Rapports & Statistiques Avancées ** :
   - Graphiques interactifs Recharts : répartition par matière, par niveau, par professeur, évolution temporelle.
   - Liste des élèves en retard avec liens de relance WhatsApp.
10. **Support Multilingue & RTL** :
    - Arabe (RTL par défaut), Français (LTR) et Anglais (LTR) avec polices adaptées (Cairo, Tajawal, Inter).
    

---


