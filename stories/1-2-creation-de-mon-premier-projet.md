# Story 1.2: Création de ma première tontine

Status: ready-for-dev

## Story

As a Bâtisseur,
I want to configure my tontine with a saving goal (Name, Target Amount, Brick Amount),
So that I can visualize what I am building towards.

## Acceptance Criteria

1. **Given** I am on the empty "Chantier" screen
2. **When** I tap the "Nouvelle Tontine" FAB
3. **Then** a modal or screen opens to configure the tontine and its saving goal
4. **And** I can enter a Saving Goal Name (e.g., "Moto", "Mariage")
5. **And** I can enter a Target Amount (Montant Cible)
6. **And** I can enter a Brick Amount (Montant Brique - weekly deposit)
7. **And** I can optionally select an image/icon for the saving goal
8. **And** upon validation, the tontine is saved locally
9. **And** I am redirected to the Tontine Dashboard (which is currently empty/initial state).

## Tasks / Subtasks

- [ ] **Task 1: Local Database Schema & Models for Tontine** (AC: 8) <!-- id: 200 -->
  - [ ] Define `Tontine` schema (name, target_amount, brick_amount, created_at, status, etc.).
  - [ ] Create `Tontine` model class.
  - [ ] Setup Database provider/service.
- [ ] **Task 2: Tontine Creation UI** (AC: 3, 4, 5, 6, 7) <!-- id: 201 -->
  - [ ] Create `CreateTontineScreen` (or Modal).
  - [ ] Implement form fields with validation (Name required, Amounts > 0).
  - [ ] Implement basic image picker or icon selector (keep it simple for now).
- [ ] **Task 3: Logic & Persistence** (AC: 8, 9) <!-- id: 202 -->
  - [ ] Implement `createTontine` use case / repository method.
  - [ ] Connect UI to the logic.
  - [ ] Handle navigation after successful creation.

## Dev Notes

- **Architecture:**
  - Feature: `src/features/tontine`. This feature will manage all aspects of a tontine, including its associated saving goal.
  - Domain: `Tontine` entity, `SavingGoal` as a Value Object within `Tontine`.
  - Infrastructure: Local Database implementation.
- **UX:**
  - Use the "Kulu Gold" for the primary action button.
  - Input fields should be large and readable (NFR4).
- **Data:**
  - `target_amount` and `brick_amount` should be integers (FCFA).

## References

- [PRD: FR1](file:///d:/perso/kulu-cash/_bmad-output/planning-artifacts/prd.md)
- [Architecture: Hexagonal](file:///d:/perso/kulu-cash/_bmad-output/planning-artifacts/architecture.md)
