---
stepsCompleted: ["step-01-validate-prerequisites", "step-02-design-epics", "step-03-create-stories-epic-1", "step-03-create-stories-epic-2", "step-03-create-stories-epic-3", "step-03-create-stories-epic-4"]
inputDocuments: ["prd.md", "architecture.md", "ux-design-specification.md"]
---

# kulu-cash - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for kulu-cash, decomposing the requirements from the PRD, UX Design, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

- **FR1:** Création d'une cotisation (tontine) avec un objectif d'épargne associé (nom, description, image, montant cible).
- **FR2:** Configuration des 3 types de tontine (Fixe, Var A, Var B).
- **FR3:** Calcul auto du calendrier Type B (Progression arithmétique).
- **FR4:** Gestion des sur-cotisations (Bonus) et paiements partiels (Karma Penalty).
- **FR5:** Détection automatique des retards sur solde total projeté.
- **FR6:** Dashboard principal avec progression visuelle de l'objectif (par "briques" de versement).
- **FR7:** Accès offline intégral aux données et états de synchro.
- **FR8:** Invitation par QR Code/Lien et gestion des rôles (Participant/Observer).
- **FR9:** Stockage et visualisation des preuves de versement avec horodatage.
- **FR10:** Calcul des Streaks 🔥 et déclenchement aléatoire de Rare Moments.
- **FR11:** Adaptation dynamique du ton de Kulu (Félicitations vs Insolence).
- **FR12:** Auth Firebase (OTP WhatsApp / Google / Apple).
- **FR13:** Saisie de versement (Numpad custom).
- **FR14:** Historique des versements.
- **FR15:** Système de Veto Duo.

### NonFunctional Requirements

- **NFR1:** Performance Mobile (Interface sub-seconde).
- **NFR2:** Local-First (Usage 100% offline).
- **NFR3:** Sécurité Biométrique (FaceID/Fingerprint au démarrage).
- **NFR4:** Ergonomie Marché (Boutons géants, contraste soleil).
- **NFR5:** Économie de batterie (Thème sombre par défaut).

### FR Coverage Map

FR1: Epic 1 - Création de la Tontine
FR2: Epic 1 - Création de la Tontine
FR3: Epic 2 - Moteur Type B
FR4: Epic 2 - Moteur Type B
FR5: Epic 3 - Humeurs de Kulu
FR6: Epic 2 - Dashboard
FR7: Epic 1 & 4 - Local First & Sync
FR8: Epic 5 - Invitations
FR9: Epic 3 - Preuves Visuelles
FR10: Epic 5 - Streaks
FR11: Epic 3 - Humeurs de Kulu
FR12: Epic 4 - Auth
FR13: Epic 1 - Premier Versement
FR14: Epic 2 - Historique
FR15: Epic 5 - Veto

## Epic List

### Epic 1 : Le Nid Local (The Nest)
*L'utilisateur découvre l'app, crée sa première tontine avec un objectif d'épargne via le Wizard, et pose sa première brique.*
**FRs couverts :** FR1, FR2, FR7, FR13.
**Valeur :** Gratification immédiate, setup sans friction.

### Story 1.2 : Le Wizard de Création (Contribution-First)
As a Bâtisseur,
I want to set up my tontine by focusing on my contribution capacity first,
So that I can see what I can achieve realistically.

**Acceptance Criteria:**
- **Given** I am on the "Nouvelle Tontine" Wizard
- **Step 1 (Type):** I select "Fixe" or "Challenge" (Variable).
- **Step 2 (Mechanics):**
  - I choose Frequency (Day/Week/Month).
  - I set the Brick Amount.
  - I set Start/End Dates.
  - If Start Date is in the past, I am prompted to enter my "Initial Balance".
  - I see the **Total Estimated Goal** calculated automatically.
- **Step 3 (Identity):** I can optionally add a Name/Image.
- **Then** the Tontine is created with all financial parameters.

### Epic 2 : La Routine du Bâtisseur (Moteur & Routine)
*Mise en place de la rigueur financière (Type B) et du cockpit analytique local.*
**FRs couverts :** FR3, FR4, FR6, FR14.
**Valeur :** Utilité financière réelle et répétitive.

**Goal:** Établir une discipline financière rigoureuse via le moteur de calcul et un cockpit analytique local permettant de visualiser son mur monter.

### Story 2.1 : Le Moteur Type B (Algorithme Hebdo)
As a Bâtisseur,
I want the app to calculate my weekly dues automatically,
So that I never have to guess how much I owe for my tontine.

**Acceptance Criteria:**
- **Given** a tontine with a start date and a brick amount
- **When** the week changes (every Monday 00:00)
- **Then** the engine calculates the new "Amount Due" for the current week
- **And** it handles the arithmetic progression as per the Type B specification.

### Story 2.2 : Dashboard de Construction (Ma Part)
As a Bâtisseur,
I want to see my brick wall grow for my saving goal,
So that I feel motivated to keep building.

**Acceptance Criteria:**
- **Given** I have multiple deposits (bricks) for a tontine
- **When** I open the Dashboard
- **Then** I see the bricks stacked physically on top of each other (Construction site vibe)
- **And** a "Duo Mode" zone is visible but greyed out/locked with a "Bientôt disponible" label.

### Story 2.3 : Historique & Reçu WhatsApp
As a Bâtisseur,
I want to consult the list of my payments and share a text receipt,
So that I can manually prove my honesty to my future partner.

**Acceptance Criteria:**
- **Given** I am on the tontine screen
- **When** I navigate to "Historique"
- **Then** I see a clean list (Date, Heure, Montant)
- **And** each entry has a "Partager reçu (Text)" button that opens WhatsApp with a pre-filled message ("Eric a posé une brique de 15 000 FCFA sur KuluCash !").

### Story 2.4 : Kulu's Smart Hint (Auto-fill)
As a Bâtisseur,
I want Kulu to suggest the exact amount I need to pay,
So that I can finish my 10-sec loop without typing a single digit.

**Acceptance Criteria:**
- **Given** it is the end of the week and I have a remaining balance for the current period
- **When** I open the Market Numpad
- **Then** Kulu displays a bubble with the missing amount
- **And** tapping the bubble auto-fills the input field.

## Epic 3 : Immortalisation (Photos & Humeurs)

**Goal:** Injecter de l'émotion et de la preuve tangible par l'image et le tempérament dynamique de Kulu.

### Story 3.1 : Capture de Preuve (Screenshot)
As a Bâtisseur,
I want to attach a photo or screenshot to my brick,
So that my payments are indisputable.

**Acceptance Criteria:**
- **Given** I am in the Market Numpad flow
- **When** I tap "Ajouter une preuve"
- **Then** the app opens the camera or gallery
- **And** the image is massively compressed (Local Optimization) before storage.

### Story 3.2 : La Galerie des Briques (Polaroids)
As a Bâtisseur,
I want to swipe through my past proofs in a visual gallery,
So that I can see the history of my work as a photo album.

**Acceptance Criteria:**
- **Given** I have multiple bricks with photos
- **When** I open the tontine gallery
- **Then** the proofs are displayed as swipable 'Polaroids'
- **And** I can see the amount and date attached to each photo.

### Story 3.3 : Les États de Kulu (Strike & Glory)
As a Bâtisseur,
I want Kulu to reflect my financial status visually,
So that I feel immediate pride or healthy guilt.

**Acceptance Criteria:**
- **Given** a tontine status (Late vs Up-to-date vs Over-performing)
- **When** the Dashboard loads
- **Then** Kulu shows one of 4 states:
  - **Neutre :** Construction normale.
  - **Strike :** Assis par terre avec pancarte "EN GRÈVE" (Retard).
  - **Joie :** Salto arrière (Versement du jour).
  - **Elite / Or :** Kulu devient doré avec des lunettes de soleil (Avance sur planning).

### Story 3.4 : Polissage Sensoriel Total
As a Bâtisseur,
I want consistent sounds and vibrations for every action,
So that the app feels high-premium and alive.

**Acceptance Criteria:**
- **Given** any interaction (Deposit, Veto, Reaction)
- **When** I perform the action
- **Then** a unique sound/haptic pair is triggered (Financier Sound vs Social Vibration)
- **And** animations follow the 'Soft-Touch' laws defined in UX Patterns.

## Epic 4 : La Porte d'Or (Auth & Backup)

**Goal:** Sécuriser les données de l'utilisateur par une sauvegarde Cloud et initier le modèle économique.

### Story 4.1 : Inscription WhatsApp OTP
As a Bâtisseur,
I want to link my tontines to my WhatsApp phone number,
So that I can retrieve my data if I change my phone.

**Acceptance Criteria:**
- **Given** I am in the "Secure my data" flow
- **When** I enter my phone number
- **Then** I receive a 6-digit OTP via WhatsApp
- **And** validating the OTP creates my Firebase account.

### Story 4.2 : Migration (Sable -> Rocher)
As a Bâtisseur,
I want my local data to be synchronized with the cloud automatically,
So that my tontines are never lost.

**Acceptance Criteria:**
- **Given** I just created an account
- **When** the first sync starts
- **Then** my local data is pushed to Firebase
- **And** Kulu's egg/avatar glows blue to signal the cloud protection.
- **Note:** The first tontine sync is free.

### Story 4.3 : Indicateur de Synchro Cloud
As a Bâtisseur,
I want to see if my work is currently being backed up,
So that I feel reassured about my data safety.

**Acceptance Criteria:**
- **Given** I am on the Dashboard and have an active Internet connection
- **When** a local change is detected
- **Then** a small "Sync Cloud" icon (Animated Cloud) appears in the header
- **And** it disappears once the sync is successful.

### Story 4.4 : Le Message du Rocher (Conversion)
As a Bâtisseur,
I want Kulu to explain the benefit of a premium account,
So that I understand the value of paying for subsequent backups.

**Acceptance Criteria:**
- **Given** I have an unsecure local tontine
- **When** Kulu speaks to me after a deposit
- **Then** he uses the "Rock vs Sand" metaphor: "Mon frère, ton chantier est magnifique, mais il est sur du sable ! Veux-tu le mettre sur le Rocher (Cloud) ?"
- **And** tapping the dialogue leads to the Auth/Premium landing.

## Epic 5 : Le Pont Social (Mode Duo)

**Goal:** Activer la collaboration radicale et le stress social positif via le partage, les réactions et la solidarité des Streaks.

### Story 5.1 : Invitation Duo (DeepLink)
As a Bâtisseur,
I want to invite my partner via a WhatsApp link,
So that we can build our tontine together.

**Acceptance Criteria:**
- **Given** I am a premium user (or on my first free tontine)
- **When** I tap "Inviter un partenaire"
- **Then** the app generates a DeepLink and opens the WhatsApp share sheet
- **And** the link redirects the partner directly to the App Store if they don't have the app.

### Story 5.2 : Duo Pulse (Présence)
As a Bâtisseur,
I want to see when my partner is online on the tontine,
So that I feel we are on the chantier at the same time.

**Acceptance Criteria:**
- **Given** my partner has the app open on the same tontine
- **When** I am on the Dashboard
- **Then** a glowing animated halo (`Duo Pulse`) appears around their avatar
- **And** I can see floating reactions if they send them.

### Story 5.3 : Veto & Requête Proof (Limité)
As a Partner,
I want to challenge a brick if I have a doubt,
So that I can ensure the tontine's financial integrity.

**Acceptance Criteria:**
- **Given** a new brick posted by Eric
- **When** Marie taps "Contester / Photo Floue"
- **Then** the brick status changes to "Grey/Wait"
- **And** Marie is limited to 3 Vetos per week to avoid spam/conflict
- **And** Eric receives a "Heavy" notification to edit his proof.

### Story 5.4 : Flamme Duo (Shared Streaks)
As a Duo,
I want our streak to be shared and high-stakes,
So that we motivate each other to never fail.

**Acceptance Criteria:**
- **Given** a tontine in Duo mode
- **When** one of the partners fails his weekly deposit
- **Then** the `Shared Streak` (Flamme 🔥) is extinguished for BOTH partners.
- **And** Kulu shows a sad/angry face to both.

### Story 5.5 : Social Push Notifications
As a Bâtisseur,
I want to be notified of my partner's actions,
So that I can react and keep the tontine alive.

**Acceptance Criteria:**
- **Given** Marie just posted a brick
- **When** I am outside the app
- **Then** I receive a push notification: "Marie a posé une brique ! 💪 Va voir le mur de briques !"
- **And** tapping the notif opens the tontine dashboard.
