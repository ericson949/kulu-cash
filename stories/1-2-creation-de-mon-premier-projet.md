# Story 1.2: Création de mon premier projet

Status: ready-for-dev

## Story

As a Bâtisseur,
I want to configure my savings goal (Name, Target Amount, Brick Amount),
So that I can visualize what I am building towards.

## Acceptance Criteria

1. **Given** I am on the empty "Chantier" screen
2. **When** I tap the "Nouveau Projet" FAB
3. **Then** a modal or screen opens to configure the project
4. **And** I can enter a Project Name (e.g., "Moto", "Mariage")
5. **And** I can enter a Target Amount (Montant Cible)
6. **And** I can enter a Brick Amount (Montant Brique - weekly deposit)
7. **And** I can optionally select an image/icon for the project
8. **And** upon validation, the project is saved locally (WatermelonDB)
9. **And** I am redirected to the Project Dashboard (which is currently empty/initial state).

## Tasks / Subtasks

- [ ] **Task 1: WatermelonDB Schema & Models** (AC: 8) <!-- id: 200 -->
  - [ ] Define `Project` schema (name, target_amount, brick_amount, created_at, status, etc.).
  - [ ] Create `Project` model class.
  - [ ] Setup Database provider/service.
- [ ] **Task 2: Project Creation UI** (AC: 3, 4, 5, 6, 7) <!-- id: 201 -->
  - [ ] Create `CreateProjectScreen` (or Modal).
  - [ ] Implement form fields with validation (Name required, Amounts > 0).
  - [ ] Implement basic image picker or icon selector (keep it simple for now).
- [ ] **Task 3: Logic & Persistence** (AC: 8, 9) <!-- id: 202 -->
  - [ ] Implement `createProject` use case / repository method.
  - [ ] Connect UI to the logic.
  - [ ] Handle navigation after successful creation.

## Dev Notes

- **Architecture:**
  - Feature: `src/features/tontine` (or `project`?) -> Let's stick to `tontine` as the core domain or maybe `project` if it's distinct. Based on PRD, "Tontine" seems to be the core concept, but "Project" is the user-facing term. Let's use `src/features/project` for project management.
  - Domain: `Project` entity.
  - Infrastructure: WatermelonDB implementation.
- **UX:**
  - Use the "Kulu Gold" for the primary action button.
  - Input fields should be large and readable (NFR4).
- **Data:**
  - `target_amount` and `brick_amount` should be integers (FCFA).

## References

- [PRD: FR3](file:///d:/perso/kulu-cash/_bmad-output/planning-artifacts/prd.md)
- [Architecture: Hexagonal](file:///d:/perso/kulu-cash/_bmad-output/planning-artifacts/architecture.md)
