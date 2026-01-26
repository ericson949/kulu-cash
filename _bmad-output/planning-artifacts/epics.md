---
stepsCompleted: ["step-01-validate-prerequisites"]
inputDocuments: ["prd.md", "architecture.md", "ux-design-specification.md"]
---

# kulu-cash - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for kulu-cash, decomposing the requirements from the PRD, UX Design, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

- **FR1:** Auth Firebase (OTP WhatsApp / Google / Apple).
- **FR2:** Moteur de tontine Type B (Progression arithmétique hebdomadaire).
- **FR3:** Création de projet local (Nom, Cible, Montant brique).
- **FR4:** Dashboard avec progression visuelle.
- **FR5:** Saisie de versement (Numpad custom).
- **FR6:** Upload de preuve (Screenshot/Photo).
- **FR7:** Historique des versements.
- **FR8:** Calcul automatique du reste à payer.
- **FR9:** Mode Duo (Invitation via DeepLink).
- **FR10:** Synchronisation asynchrone (WatermelonDB + Firebase).
- **FR11:** Système de Veto Duo.
- **FR12:** Reactions Emoji sur les briques.
- **FR13:** Système de Streaks (Addiction positive).
- **FR14:** Mascotte Kulu (États émotionnels dynamique).
- **FR15:** Gestion des notifications Push ("Kulu a faim").

### NonFunctional Requirements

- **NFR1:** Performance Mobile (Interface sub-seconde).
- **NFR2:** Local-First (Usage 100% offline).
- **NFR3:** Sécurité Biométrique (FaceID/Fingerprint au démarrage).
- **NFR4:** Ergonomie Marché (Boutons géants, contraste soleil).
- **NFR5:** Économie de batterie (Thème sombre par défaut).

### Additional Requirements

- **Starter Template:** Expo (Latest) avec WatermelonDB et Firebase Config Plugins.
- **Architecture:** Hexagonale par feature (`src/features/*/domain|application|presentation|infrastructure`).
- **Patterns:** DDD pour le moteur de tontine, CQRS-lite (WatermelonDB Observables).
- **UX Assets:** Mascotte Kulu, Œuf d'or (Lottie), Market Numpad, Evidence Vault.
- **Anim :** React Native Reanimated 3 pour les briques physiques.

### FR Coverage Map

{{requirements_coverage_map}}

## Epic List

{{epics_list}}
