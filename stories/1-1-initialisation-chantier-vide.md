# Story 1.1: Initialisation Chantier Vide

Status: review

## Story

As a Bâtisseur,
I want to open the app on a welcoming empty state,
so that I can start my first project immediately.

## Acceptance Criteria

1. **Given** I am a new user opening the app for the first time
2. **When** the app loads
3. **Then** I see the "Deep Slate" background (`#1A1C1E`) with a rich "Dirt Texture" (Terre rouge)
4. **And** a floating action button "🏗️ Nouveau Projet" is prominently visible (Gold `#FFC107`)
5. **And** no authentication screen is shown.
6. **And** the app is initialized with the Expo Managed Workflow (TypeScript) and WatermelonDB plugin.

## Tasks / Subtasks

- [x] **Task 1: Initialisation du Projet (Archi Base)** (AC: 6) <!-- id: 100 -->
  - [x] Installer le template Expo Tabs TypeScript
  - [x] Installer les dépendances WatermelonDB
  - [x] Installer Firebase standard
  - [x] Configurer `app.json` avec le plugin WatermelonDB.
- [x] **Task 2: UI "Chantier Vide"** (AC: 1, 2, 3) <!-- id: 101 -->
  - [x] Créer la route principale (`app/(tabs)/index.tsx`) avec le fond Deep Slate.
  - [x] Implémenter l'overlay "Dirt Texture" (Image semi-transparente ou SVG texturé).
- [x] **Task 3: Action "Nouveau Projet"** (AC: 4, 5) <!-- id: 102 -->
  - [x] Implémenter le Bouton Flottant (FAB) stylisé en Kulu Gold (`#FFC107`).
  - [x] Vérifier qu'aucun middleware d'Auth n'interrompt l'entrée.

## Dev Notes

- **Architecture :** Respecter strictement la structure Hexagonale définie dans `architecture.md`. Les fichiers UI vont dans `src/shared/components` ou `src/features/tontine/presentation`.
- **Styling :** Utiliser exclusivement des `StyleSheet` React Native avec les tokens du `ux-design-specification.md`.
- **WatermelonDB :** Ce ticket ne demande pas encore de Schéma, juste l'installation et la configuration du plugin pour permettre un `eas build` réussi.

### Project Structure Notes

- Créer les dossiers de base : `src/features`, `src/shared`, `src/api`, `src/database`.
- Configuration TypeScript stricte requise.

### References

- [Architecture: Selected Starter](file:///d:/perso/kulu-cash/_bmad-output/planning-artifacts/architecture.md#L53)
- [UX: Color System](file:///d:/perso/kulu-cash/_bmad-output/planning-artifacts/ux-design-specification.md#L147)
- [UX: Dirt Texture](file:///d:/perso/kulu-cash/_bmad-output/planning-artifacts/ux-design-specification.md#L206)

## Dev Agent Record

### Agent Model Used

Antigravity v1.0 (BMad Method Implementation)

### File List
- `app.json`
- `package.json`
- `app/(tabs)/index.tsx`
- `src/shared/theme/tokens.ts` (Recommended creation)
