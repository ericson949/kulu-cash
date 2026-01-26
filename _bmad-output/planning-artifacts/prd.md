---
stepsCompleted: ["step-01-init", "step-02-discovery", "step-03-success", "step-04-journeys", "step-05-domain", "step-06-innovation", "step-07-project-type", "step-08-scoping", "step-09-functional", "step-10-nonfunctional", "step-11-polish"]
inputDocuments: ["product-brief-kulu-cash-2026-01-26.md"]
workflowType: 'prd'
classification:
  projectType: 'mobile_app'
  domain: 'fintech'
  complexity: 'high'
  projectContext: 'greenfield'
documentCounts:
  briefCount: 1
  researchCount: 0
  brainstormingCount: 0
  projectDocsCount: 0
---

# Product Requirements Document - kulu-cash

**Author:** ericson949
**Date:** 2026-01-26

## Executive Summary
KuluCash est un "Cockpit Financier" local-first conçu pour l'Afrique Centrale, transformant la gestion complexe des tontines personnelles et en duo en une expérience addictive et transparente. Portée par **Kulu**, une tortue mascotte dynamique, l'application résout le manque de visibilité et la corvée administrative des tontines cumulatives via un moteur de calcul offline robuste et une gamification inspirée des meilleures apps de formation d'habitudes.

## Success Criteria

### User Success (SMART)
- **Visibilité Instantanée :** Accès à l'état financier exact (versé/restant/retards) en < 3 secondes.
- **Discipline Sans Stress :** Complétion d'un cycle de tontine variable Type B sans retard critique.
- **Engagement Quotidien :** Interaction ludique avec Kulu au moins 3 fois par semaine.

### Business & Data Success
- **Fiabilité 100% :** Zéro écart entre les enregistrements numériques et l'épargne réelle.
- **Rétention Sociale :** Adoption du mode Duo par > 80% des utilisateurs cibles (Eric & Marie).

### Technical Success
- **Robustesse Offline :** 100% des fonctionnalités de calcul et de saisie opérationnelles sans réseau.
- **Transparence de Sync :** Indicateur d'état Firebase (Syncing/Done) clair pour rassurer l'utilisateur.

## Product Scope & Roadmap

### Phase 1 : MVP (Focus Experience)
- **Moteur Tontine :** Types Fixe, A (Minimum) et B (Cumulative/Arithmétique).
- **Dashboard Hybride :** Vue visuelle (Carte Kulu) + Vue analytique chiffrée.
- **Duo Trust :** Validation optimiste (valide par défaut) + Veto du partenaire + Preuves visuelles.
- **Addiction Loop :** Streaks 🔥, Évolution visuelle des projets, Rare Kulu Moments 🎲.

### Phase 2 : Growth (Échelle)
- **Skins & Collections :** Personnalisation avancée de Kulu.
- **Mode Groupe :** Tontines d'association (> 2 membres).
- **Outil de Réconciliation :** Gestion structurée des litiges.

### Phase 3 : Expansion (Automatisation)
- **APIs Mobile Money :** Récupération automatique des flux MTN/Orange.
- **Kulu Credit Score :** Valorisation financière de l'historique de discipline.

## User Journeys

### 📝 Solo au Marché (Efficacité Offline)
Eric, au marché de Mokolo (zéro réseau). Il vient de verser 15 000 FCFA. Il ouvre KuluCash, saisit le montant instantanément. Le moteur local calcule le nouveau solde Type B. Kulu apparaît ("Kulu Marchand") pour le féliciter. Eric range son téléphone en 10 secondes, serein.

### 📝 Duo de Confiance (Collaboration Optimiste)
Marie verse sa part à Douala et uploade le screenshot MTN. Eric reçoit une notification. La transaction est **valide par défaut** (Optimistic). Eric consulte la preuve plus tard et confirme. Les deux Kulu avancent ensemble vers leur projet "Mariage" sans bloquer le workflow.

## Domain & Innovation Requirements

### Fintech & Rigueur (Fintech Specific)
- **Validation Optimiste :** Transactions valides dès la saisie pour un usage fluide.
- **Règle de Veto :** Annulation impossible après le versement de l'échéance suivante.
- **Audit Immuable :** Historique indélébile des cotisations et contestations.
- **Sécurité :** Authentification biométrique (FaceID/Fingerprint) obligatoire.

### Innovation Patterns
- **Kulu Insolent :** Gamification adaptative où la mascotte change de ton selon la discipline.
- **Savings Challenge (Type B) :** Modélisation native des progressions arithmétiques locales.
- **Local-First Financial Engine :** Calculs complexes distribués sans besoin de backend temps réel.

## Mobile App Technical Requirements
- **Framework :** React Native (iOS & Android).
- **Persistence :** Local DB ultra-rapide (WatermelonDB/SQLite) avec Lazy Loading des images.
- **Push :** Firebase Cloud Messaging (FCM) pour les rappels et les alertes Duo.
- **Stores :** Conformité totale aux directives financières Apple/Google.

## Functional Requirements (The Capability Contract)

### 1. Gestion des Tontines & Moteur
- **FR1 :** Configuration des 3 types (Fixe, Var A, Var B).
- **FR2 :** Calcul auto du calendrier Type B (Progression arithmétique).
- **FR3 :** Gestion des sur-cotisations (Bonus) et paiements partiels (Karma Penalty).
- **FR4 :** Détection automatique des retards sur solde total projeté.

### 2. Dashboard & Projets
- **FR5 :** Création de projets liés aux tontines (Progression visuelle par pierres).
- **FR6 :** Accès offline intégral aux données et états de synchro.

### 3. Duo Trust Flow
- **FR7 :** Invitation par QR Code/Lien et gestion des rôles (Participant/Observer).
- **FR8 :** Stockage et visualisation des preuves de versement avec horodatage.

### 4. Gamification & Tone
- **FR9 :** Calcul des Streaks 🔥 et déclenchement aléatoire de Rare Moments.
- **FR10 :** Adaptation dynamique du ton de Kulu (Félicitations vs Insolence).

## Non-Functional Requirements (Performance & Security)
- **NFR1 (Performance) :** Ouverture de l'app et disponibilité de saisie en < 2s.
- **NFR2 (Fiabilité) :** Persistance offline garantie pendant > 30 jours.
- **NFR3 (Conflict-Free) :** Saisie Duo asynchrone sans conflits d'écriture Firebase.
- **NFR4 (Security) :** Logs d'audit immuables poussés sur le Cloud.
