stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
workflowType: 'architecture'
lastStep: 8
status: 'complete'
completedAt: '2026-01-26'
inputDocuments: ["prd.md", "product-brief-kulu-cash-2026-01-26.md"]
project_name: 'kulu-cash'
user_name: 'ericson949'
date: '2026-01-26'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**
L'architecture doit supporter un **Moteur de Tontine (Engine)** capable de gérer des progressions arithmétiques complexes (Type B) en local. Le mode **Duo Trust** nécessite une gestion asynchrone des preuves visuelles et une logique de validation optimiste (valide par défaut). La **Gamification** impose un état de "Série" (Streak) et des déclencheurs aléatoires synchronisés entre le moteur et l'UI.

**Non-Functional Requirements:**
- **Performance :** Démarrage "Cold Start" < 2s.
- **Fiabilité :** Résilience offline totale (> 30 jours).
- **Synchronisation :** Flux asynchrone "Conflict-Free" (chaque utilisateur gère son flux).
- **Sécurité :** Verrou biométrique en porte d'entrée de l'application.

**Scale & Complexity:**
- **Primary domain :** Mobile (React Native) / Fintech (Local-first).
- **Complexity level :** Haute (Gestion de l'intégrité financière en mode distribué offline).
- **Estimated architectural components :** ~6 (Engine, LocalDB, SyncManager, UI/Gamification layers, Auth/Security, Notification Service).

### Technical Constraints & Dependencies
- **Stack confirmée :** React Native (0.77+), Expo SDK 54, Firebase (Firestore, FCM, Auth).
- **Contrainte Store :** Respect des guidelines financières Apple/Google.

### Cross-Cutting Concerns Identified
- **Data Integrity :** Garantir que les calculs de solde sont identiques en local et sur Firebase.
- **Synchronization Strategy :** Gestion du passage local -> cloud sans blocage UI.
- **Biometric Middleware :** Sécurisation globale de l'accès aux données.

## Starter Template Evaluation

### Primary Technology Domain
**Mobile (Cross-platform) :** React Native avec **Expo (Managed Workflow / EAS)**.

### Starter Options Considered
- **Option A : Expo Default TypeScript (Tabs) :** Le standard officiel. Offre une navigation (Expo Router) et une configuration TypeScript déjà optimisée.
- **Option B : Boilerplates Communautaires :** Souvent trop chargés ou utilisant Supabase au lieu de Firebase.
- **Option C : Custom Expo + Firebase :** Utilisation de `create-expo-app` configurée pour une approche online-first avec support offline Firestore.

### Selected Starter : Expo TypeScript + Firebase
**Rationale for Selection :**
L'utilisation de **Firebase** (Firestore) permet une synchronisation simple et efficace pour le MVP. Bien que moins "local-first" natif que PowerSync, Firestore offre une excellente gestion du mode hors-connexion et une intégration parfaite avec l'authentification et le stockage de fichiers, tout en restant dans l'écosystème Google familier.

**Initialization Command :**

# Initialisation du projet (template navigation recommandé)
npx create-expo-app@latest kulu-cash --template tabs-typescript

# Ajout des dépendances critiques
npx expo install firebase
npx expo install lottie-react-native lucide-react-native

### Architectural Decisions Provided by Starter

**Language & Runtime :**
TypeScript 5.x avec configuration stricte pour garantir l'intégrité des calculs de tontines.

**Styling Solution :**
Utilisation de **Vanilla CSS / StyleSheet (React Native)** pour des performances optimales et une personnalisation fine des thèmes (Glassmorphism, Kulu Aesthetics).

**Build Tooling :**
**Expo Application Services (EAS)** pour la génération des builds Android (AAB/APK) et iOS (IPA) de manière automatisée et conforme aux stores.

**Code Organization :**
Structure basée sur **Expo Router** (App Directory), favorisant une séparation claire entre les routes (Screens) et la logique métier (Services/Engine).

## Core Architectural Decisions

### Data Architecture
- **Modeling Approach :** Relationnel (via WatermelonDB). Chaque cotisation est liée à un projet et à un utilisateur.
- **Duo Sync Logic :** Flux de cotisations indépendants. Le **Solde Total** est un champ calculé et **stocké de manière partagée** sur Firebase pour une visibilité immédiate sans recalcul coûteux côté client lors du premier chargement.
- **Media Management :** Utilisation de Firebase Storage pour les preuves. Système de génération de **miniatures (thumbnails)** pour optimiser l'affichage du Dashboard.

### Authentication & Security
- **Auth Method :** Firebase Auth (Email/OTP).
- **Offline Security :** Middleware de **verrouillage biométrique** (Local Authentication Expo) indépendant de la connexion réseau. Accès aux données locales WatermelonDB protégé par ce verrou.
- **Audit Logging :** Chaque transaction enregistre le `device_id` et le `timestamp` serveur pour l'immuabilité financière.

### Frontend Architecture
- **State Management :**
    - **Data State :** Géré par les **Hooks Firestore** (ou Zustand pour le cache local) pour une réactivité temps réel.
    - **UI State :** Utilisation de **Zustand** (léger, hook-based) pour les états non-persistants (navigation, thèmes, humeur de Kulu).
- **Component Pattern :** Atomic Design pour les éléments de gamification réutilisables.

### Infrastructure & Deployment
- **Hosting :** Firebase (Backend-as-a-Service).
- **CI/CD :** Expo EAS Build & Submit pour les pipelines App Store/Play Store.

## Implementation Patterns & Consistency Rules

### Strategic Architecture Patterns
- **Domain-Driven Design (DDD) :** Organisation globale autour des domaines métier (Tontine, Profile, Gamification). Utilisation d'un langage omniprésent clair pour les entités (ex: `Installment`, `Project`, `Streak`).
- **Architecture Hexagonale (Ports & Adapteurs) :** Application par scope (feature). Le cœur métier (Domain/Logic) est isolé des frameworks (React Native) et des infrastructures (WatermelonDB, Firebase).
- **CQRS-lite (Command Query Responsibility Segregation) :** Séparation stricte de la logique de lecture (Queries via WatermelonDB Observables) et de la logique d'écriture (Commands via Domain Services).

### Naming & Structural Patterns
- **Database (WatermelonDB) :** `snake_case` pour les tables et colonnes.
- **Code (React Native) :** `PascalCase` pour les composants et types, `camelCase` pour les fonctions et instances.
- **File Organization :** 
    - `src/features/[domain]/` : Structure hexagonale interne (domain, application, infrastructure).
    - `src/shared/` : Composants UI Kulu, thèmes, et utilitaires transverses.
    - Tests colocalisés : `[name].test.ts` à côté du fichier source.

### Data & Communication
- **Immuabilité :** Les objets du domaine sont immuables. Toute modification produit une nouvelle instance (ou passe par les Commands CQRS).
- **Formats :** Dates en `ISO 8601`, montants en `Integers` (centimes).
- **Event-Driven UI :** L'UI réagit aux flux de données (Observables) sans déclencher de modification directe de l'état global en dehors des Commands.

### Enforcement Guidelines
**Tous les Agents IA DOIVENT :**
1. Valider que toute nouvelle règle métier est placée dans la couche `domain` de l'hexagone concerné.
2. Utiliser obligatoirement les adapters pour interagir avec WatermelonDB ou Firebase.
3. Ne jamais inclure de logique de calcul financier complexe directement dans les composants React.

## Project Structure & Boundaries

### Complete Project Directory Structure

```text
kulu-cash/
├── src/
│   ├── features/              # Un hexagone par domaine (DDD)
│   │   ├── tontine/           # Domaine Tontine (Moteur de calcul)
│   │   │   ├── domain/        # Entités, Logic, Formula immuables
│   │   │   ├── application/   # Commands (Write), Queries (Read)
│   │   │   ├── infrastructure/ # Adapters (WatermelonDB, Sync)
│   │   │   └── presentation/  # Components/Screens spécifiques
│   │   ├── gamification/      # Domaine Kulu (Streaks, Moods)
│   │   ├── duo/               # Domaine Trust (Veto, Proofs)
│   │   └── authentication/    # Biometric Middleware
│   ├── shared/                # Transversal (Non-métier)
│   │   ├── components/        # UI Kulu Mascot Shared
│   │   ├── theme/             # Sally's Global Theme
│   │   └── utils/             # ISO-Dates, Money-Integers
│   ├── api/                   # Logic de service Firebase
│   └── database/              # Règles de sécurité Firestore
├── .env                       # Firebase Keys
└── eas.json                   # EAS Build Configuration
```

### Architectural Boundaries

**Writing Boundary (DDD/Hexagonal) :**
Toute modification de l'état financier (cotisation, modification de solde) doit être instanciée via un objet de domaine immuable dans la couche `domain` de la feature concernée. Les agents ne sont pas autorisés à manipuler les magasins de données sans passer par un service applicatif.

**Reading Boundary (CQRS-lite) :**
Pour des performances maximales (UX réactive), les composants de présentation peuvent s'abonner directement aux Observables fournis par WatermelonDB. Cependant, pour les agrégats complexes (ex: solde total projeté), ils doivent passer par la couche `api/` partagée.

**Infrastructure Isolation :**
Firestore et FCM sont encapsulés dans des adapteurs d'infrastructure. Aucun code applicatif ne doit dépendre directement des SDK Firebase en dehors des adapteurs.

### Requirements to Structure Mapping

- **Tontine Engine (FR1-FR6) :** → `src/features/tontine/`
- **Duo Trust Flow (FR12-FR16) :** → `src/features/duo/`
- **Gamification (FR17-FR20) :** → `src/features/gamification/`
- **Biometric Security (NFR4) :** → `src/features/authentication/`
- **Performance & Sync (NFR1-NFR3) :** → `src/features/tontine/infrastructure/` (Adapters)

## Architecture Validation Results

### Coherence Validation ✅
- **Decision Compatibility :** Le combo **Expo + WatermelonDB + Firebase** est parfaitement compatible. L'utilisation des Config Plugins EAS permet d'intégrer les modules natifs sans dégrader l'expérience de build.
- **Pattern Consistency :** Le **CQRS-lite** exploite nativement les Observables de WatermelonDB pour les vues réactives, tandis que le **DDD** sécurise les invariants financiers.
- **Structure Alignment :** L'organisation **Hexagonale** par feature assure une isolation totale du métier vis-à-vis des frameworks.

### Requirements Coverage Validation ✅
- **Engine Type B (FR2) :** Entièrement supporté par la couche `domain` isolée.
- **Sync Duo (FR13-FR14) :** Adressé par la double couche WatermelonDB (local) + Firebase (shared totals).
- **Sécurité (NFR4) :** Intégrée via le middleware biométrique au démarrage.

### Implementation Readiness Validation ✅
- **Decision Completeness :** Stack technique, versions (Expo latest), et patterns (DDD/Hexa) entièrement documentés.
- **Structure Completeness :** Arborescence `src/features/` définie avec séparation claire des couches.
- **Pattern Completeness :** Conventions de nommage et de communication CQRS établies.

### Architecture Readiness Assessment
**Overall Status:** READY FOR IMPLEMENTATION 🚀
**Confidence Level:** Haute

**Key Strengths :**
- Isolation forte du moteur financier (testable unitairement sans UI).
- Synchronisation asynchrone robuste (pas de conflits d'écriture Duo).
- Performance visuelle instantanée grâce à la réactivité native de WatermelonDB.

### AI Agent Guidelines
- Respecter strictement l'immuabilité des entités dans `src/features/*/domain`.
- Ne jamais accéder à WatermelonDB directement depuis un composant React (utiliser les Queries applicatives).
- Chaque Command (Write) doit passer par un service de domaine validant les règles métiers.
