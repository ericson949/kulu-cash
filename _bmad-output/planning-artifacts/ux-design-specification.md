---
stepsCompleted: [1, 2, 3, 4]
inputDocuments: ["prd.md", "architecture.md", "product-brief-kulu-cash-2026-01-26.md"]
workflowType: 'ux-design'
project_name: 'kulu-cash'
user_name: 'ericson949'
date: '2026-01-26'
---

# UX Design Specification kulu-cash

**Author:** ericson949
**Date:** 2026-01-26

---

<!-- UX design content will be appended sequentially through collaborative workflow steps -->

## Executive Summary

### Project Vision
Transformer la gestion de tontine d'une corvée administrative en un **jeu de construction addictif**. KuluCash n'est pas une interface bancaire, c'est un "Cockpit de Bâtisseur" où chaque versement pose physiquement une pierre à l'édifice de ses rêves.

### Target Users
- **Eric (Le Bâtisseur Solo) :** Besoins de rapidité extrême (marché), de feedback instantané offline, et de fierté visuelle.
- **Marie (La Partenaire Duo) :** Besoins de sérénité, de preuve visuelle sans friction, et de transparence asynchrone ("Trust-Loop").

### Key Design Challenges & Soul
1.  **Mascotte "Striking Kulu" :** Kulu adopte un ton passif-agressif mignon. En cas de retard, il "fait grève" (s'assoit sur le chantier) pour créer une obligation morale ludique.
2.  **Dual Cockpit UI :** Centre de l'écran dédié à l'immersion visuelle (Kulu & Projet) / Périphérie de l'écran dédiée aux KPIs financiers sobres (PRD-compliance).
3.  **Localisms & Tone :** Utilisation d'expressions locales et d'un langage familier/chaleureux pour briser la distance avec l'outil financier.

### Design Opportunities
- **Streaks 🔥 :** Boucle de rétroaction immédiate pour la régularité.
- **Construction Progressive :** Évolution graphique de l'icône projet (herbe -> briques -> toit) pour un sentiment d'achèvement puissant.

## Core User Experience

### Defining Experience (L'Action n°1)
L'action critique est la **Saisie Éclair (10-sec Loop)**. Un utilisateur au milieu d'un marché bruyant doit pouvoir : Ouvrir l'app > Sélectionner le projet > Saisir le montant > Voir Kulu réagir.

**Règle d'Or :** La validation est **locale et immédiate**. L'upload de la preuve (image) se fait silencieusement en arrière-plan ou peut être différé pour ne pas briser le loop de 10 secondes.

### Platform Strategy
- **Priorité :** Mobile-First (Android & iOS).
- **Contrainte Maîtresse :** **Local-Total**. L'app doit simuler un état offline permanent pour garantir la réactivité.
- **Interactions :** Touch-optimized, clavier numérique de type calculatrice à gros boutons.

### Effortless Interactions
- **Kulu's Smart Hint (Auto-fill) :** Lors de l'ouverture du clavier, Kulu suggère le montant attendu (Type B) via une bulle. Un clic sur la bulle remplit automatiquement le champ.
- **Sync Silencieuse :** Passage local -> cloud transparent sans blocage de l'UI (Sync-and-Forget).
- **Shortcut Projets :** Accès direct aux projets actifs depuis le Dashboard avec un minimum de clics.

### Critical Success Moments
- **Rare Kulu Moment :** Animation aléatoire gratifiante immédiatement après un versement.
- **Le Duo "Emoji Wall" :** Possibilité de réagir avec des emojis sur les "briques" (cotisations) posées par le partenaire, transformant la tontine en un flux social positif.

### Experience Principles
1.  **Vitesse Immédiate :** Aucun écran de chargement sur le parcours critique.
2.  **Transparence Radicale :** Visibilité instantanée de sa part vs part du partenaire vs total projeté.
3.  **Encouragement par l'Humour :** Kulu transforme la dette en défi ludique.

## Desired Emotional Response

### Primary Emotional Goal
**La Fierté du Bâtisseur.** L'utilisateur doit ressentir une excitation tangible en voyant son projet progresser visuellement après chaque versement, transformant une obligation financière en un succès concret.

### Emotional Journey Mapping
- **Découverte :** Amusement face à la personnalité de Kulu.
- **Saisie (Marché) :** Sérénité procurée par une interface sub-seconde et 100% offline.
- **Récompense :** Joie via les "Rare Moments" (animations gratuites).
- **Incident (Retard) :** Culpabilité Ludique (Kulu fait grève) -> Motivation à régulariser.

### Micro-Emotions
- **Confiance :** Renforcée par la visibilité totale des calculs et des preuves dans le mode Duo.
- **Connexion :** Sentiment de construire ensemble grâce aux réactions emojis sur chaque brique.

### Design Implications & Principles
- **Mascotte Expressive :** États visuels de Kulu (Triste, Boudeur, En fête) pour refléter l'état de la tontine.
- **Évolution Épique :** Les paliers de tontine doivent être marqués par des changements graphiques majeurs sur le projet.
- **Zéro Anxiété :** Ne jamais utiliser de rouge punitif, préférer des tons "terrains" (terre, briques, or) et des messages d'encouragement.
