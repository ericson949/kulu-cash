---
stepsCompleted: [1, 2, 3]
inputDocuments: ["USER_REQUEST"]
date: 2026-01-26
author: ericson949
---

# Product Brief: kulu-cash

<!-- Content will be appended sequentially through collaborative workflow steps -->

## Executive Summary

**KuluCash** est un outil de gestion personnelle conçu pour centraliser et piloter ses propres cotisations (tontines, projets) selon une configuration sur-mesure. Dans sa phase MVP, l'application se concentre sur l'usage individuel pour offrir un contrôle total et une visibilité instantanée sur ses finances. Construite avec une approche "local-first", elle garantit une réactivité maximale et une utilisation hors-ligne, avec une synchronisation ultérieure sur Firebase.

---

## Core Vision

### Problem Statement

Pour un contributeur actif dans plusieurs tontines, le suivi personnel est souvent éparpillé et peu pratique :
- Difficulté d'avoir un état global instantané de ses engagements sans connexion internet.
- Manque de flexibilité des outils existants qui ne permettent pas une configuration "à sa sauce".
- Besoin d'un outil personnel qui ne dépend pas des données de groupe pour le suivi interne.

### Problem Impact

Le manque d'un outil de suivi personnel fluide entraîne une charge mentale accrue et des risques d'oublis ou de mauvaise gestion de sa trésorerie personnelle allouée aux cotisations.

### Why Existing Solutions Fall Short

Les tableurs Excel sont peu pratiques sur mobile en déplacement. Les applications de gestion de budget classiques ne sont pas adaptées à la logique spécifique des tontines (cycles, tours, "bouts"). Les solutions cloud pures échouent dans les zones à connectivité instable.

### Proposed Solution

Une application mobile **React Native** personnelle et "maçonnée" sur mesure. Elle fonctionne en local pour une rapidité d'exécution sans pareille et se synchronise sur **Firebase** pour la sauvegarde.
- **Architecture Local-First :** L'application privilégie toujours l'état local. Les attentes de validation d'un partenaire ne bloquent jamais l'usage ou la saisie.
- **Moteur de calcul de cotisations :** Support des tontines fixes, variables (Type A/minimum) et cumulatives (Type B).
- **Gestion par Projets :** Tontines reliées à des objectifs de vie concrets.
- **Gamification & Rappels :** Système addictif basé sur la progression de Kulu et des rappels intelligents.

### Key Differentiators

- **Non-Blocking Duo Mode :** Contrairement à d'autres apps collaboratives, l'attente d'un partenaire n'entrave pas ta propre gestion.
- **Stack Moderne & Rapide :** React Native pour une expérience fluide et Firebase pour une synchro transparente.
- **Logique Métier Avancée :** Gestion des tontines à paliers, variables et cumulatives.
- **Variable Rewards :** Système d'interaction imprévisible pour éviter l'ennui.
- **Rétention Fun :** Transformation de la discipline en jeu (habit-building).
---

## Target Users

### Primary Users: Le "Solo Builder"
- **Profil :** Individu autonome gérant ses propres épargnes et projets.
- **Motivation :** Souhaite un contrôle total, une interface fun et une discipline de fer pour ses projets personnels.
- **Usage :** Utilise l'application quotidiennement pour suivre ses tontines fixes et variables. Apprécie l'aspect local-first pour la rapidité au marché.

### Secondary Users: Le "Partner" (Mode Duo)
- **Le Partenaire Observateur :** Rejoint un projet via invitation pour suivre l'avancement sans pouvoir modifier les données. Idéal pour instaurer de la confiance (ex: conjoint, parent).
- **Le Partenaire Participant :** Partage un projet commun (limité à 2 personnes). Il possède ses propres paramètres de cotisation et peut valider ses paiements.
- **Rôle de Validateur :** Dans le cadre d'un duo, l'un peut exiger une preuve de versement (photo/screenshot) que l'autre doit valider pour faire avancer Kulu.

---

## User Journey

### 1. Le Parcours Solo (Habitude Quotidienne)
- **Découverte :** Installation de l'app pour gérer une tontine variable complexe.
- **Saisie :** Configuration "à sa sauce" d'un projet "Achat Ordinateur" relié à une tontine.
- **Usage :** Notification de rappel -> Clic rapide en local -> Animation aléatoire de Kulu qui donne un badge de "Discipline".
    - **Skins & Collections :** Déblocage aléatoire d'accessoires et de motifs Ndop pour personnaliser Kulu.
    - **Skins Duo Complémentaires :** Récompenses exclusives pour les projets à deux (ex: l'un débloque Kulu avec un Plan, l'autre avec une Truelle) encourageant la collaboration.
- **Validation :** Consultation du Dashboard le soir pour voir Kulu se rapprocher de l'icône "Ordinateur".

### 2. Le Parcours Duo (Confiance & Collaboration)
- **Invitation :** Le Solo invite un partenaire sur un projet "Terrain".
- **Action :** Le partenaire effectue un versement et télécharge la preuve de paiement dans l'app.
- **Confirmation :** Le Solo reçoit une notification, vérifie l'image et confirme. 
- **Succès :** L'état d'avancement se met à jour pour les deux utilisateurs en temps réel via Firebase.
