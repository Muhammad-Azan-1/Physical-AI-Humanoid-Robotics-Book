# Tasks for Physical AI & Humanoid Robotics Book Homepage

**Feature Branch**: `002-homepage-humanoid-book` | **Date**: 2025-12-04 | **Spec**: /specs/002-homepage-humanoid-book/spec.md
**Input**: Feature specification from `/specs/002-homepage-humanoid-book/spec.md`

## Dependencies
- Phase 1 must be completed before Phase 2.
- Phase 2 must be completed before Phase 3 and Phase 4.
- User Story 1 (Phase 3) and User Story 2 (Phase 4) can be developed in parallel after Foundational tasks are complete.
- Final Phase tasks depend on the completion of User Story Phases.

## Implementation Strategy
The project will follow an MVP-first approach, focusing on delivering User Story 1 (Homepage Display) and User Story 2 (Book Page Navigation) as core functionality. Tasks are ordered to build foundational elements first, then develop user stories in parallel, followed by polish and cross-cutting concerns.

---

## Phase 1: Setup (Project Initialization & Core Configuration)

**Goal**: Initialize the Docusaurus project and resolve initial setup issues.

- [ ] T001 Initialize Docusaurus project in `physical-ai-book/` if not already set up.
- [ ] T002 Configure basic Docusaurus settings in `physical-ai-book/docusaurus.config.ts` (title, favicon, organizationName, projectName, baseUrl).
- [ ] T003 Resolve Docusaurus crash due to tutorial sidebar error in `physical-ai-book/sidebars.js`.
- [ ] T003.1 Setup Jest and React Testing Library environment for custom React components in `physical-ai-book/`.

---

## Phase 2: Foundational (Theming & Global Navigation)

**Goal**: Establish the core visual theme and global navigation structure.

- [ ] T004 Implement dark theme with cyan/blue accents in `physical-ai-book/src/css/custom.css` and configure in `physical-ai-book/docusaurus.config.ts`.
- [ ] T005 Configure Navbar with logo and "Physical AI & Humanoid Robotics" title in `physical-ai-book/docusaurus.config.ts`.
- [ ] T006 Configure Navbar with "Book" button, "Search", "Sign In", and "Sign Up" links (client-side placeholder functionality) in `physical-ai-book/docusaurus.config.ts`.

---

## Phase 3: User Story 1 - Homepage Display [US1] (Priority: P1)

**Goal**: Display a welcoming and informative marketing homepage.
**Independent Test**: Navigate to the root path (`/`) and verify all sections, responsiveness, and theme.

- [ ] T007 [P] [US1] Create homepage (MDX/TSX) at `physical-ai-book/src/pages/index.tsx`.
- [ ] T008 [P] [US1] Implement Hero Section component in `physical-ai-book/src/components/HeroSection.tsx` and integrate into homepage.
- [ ] T009 [P] [US1] Implement "WHY HUMANOID ROBOTICS NOW?" section with Card components in `physical-ai-book/src/components/WhyHumanoidsSection.tsx` and integrate.
- [ ] T010 [P] [US1] Implement "THREE APPROACHES TO PHYSICAL AI" section in `physical-ai-book/src/components/ApproachesSection.tsx` and integrate.
- [ ] T011 [P] [US1] Implement "COURSE CURRICULUM PREVIEW" section with ModuleCard components in `physical-ai-book/src/components/CurriculumPreviewSection.tsx` and integrate.
- [ ] T012 [P] [US1] Implement "CHOOSE YOUR LEARNING PATH" section in `physical-ai-book/src/components/LearningPathSection.tsx` and integrate.
- [ ] T013 [P] [US1] Implement "START YOUR JOURNEY" section with CTA buttons and links in `physical-ai-book/src/components/StartJourneySection.tsx` and integrate.
- [ ] T014 [US1] Ensure homepage responsiveness for mobile devices by applying appropriate CSS in `physical-ai-book/src/css/custom.css` or component-specific styles.

---

## Phase 4: User Story 2 - Book Page Navigation [US2] (Priority: P1)

**Goal**: Provide access to the full curriculum with clear chapter navigation.
**Independent Test**: Click "Book" button or "Start Reading →" and verify book page loads with sidebar navigation and module links.

- [ ] T015 [US2] Configure `physical-ai-book/sidebars.js` for 4 modules x 13 weeks curriculum structure.
- [ ] T016 [P] [US2] Create placeholder MDX files for introductory book content (e.g., `physical-ai-book/docs/intro.md`).
- [ ] T017 [P] [US2] Create placeholder MDX files for at least one chapter per module (e.g., `physical-ai-book/docs/module1/week1-chapter1.md`) to validate sidebar navigation.
- [ ] T018 [US2] Implement navigation from Navbar "Book" button to `/docs` in `physical-ai-book/docusaurus.config.ts`.
- [ ] T019 [US2] Implement navigation from homepage "Start Reading →" CTA button to `/docs/intro` (in `HeroSection.tsx` or `index.tsx`).
- [ ] T020 [US2] Implement navigation from module cards to relevant book page sections (in `CurriculumPreviewSection.tsx`).

---

## Final Phase: Polish & Cross-Cutting Concerns

**Goal**: Ensure overall quality, performance, and maintainability.

- [ ] T021 Implement Docusaurus build validation (e.g., broken links, duplicate routes) in CI/CD pipeline (e.g., `.github/workflows/ci.yml`).
- [ ] T022 Evaluate and integrate Jest and React Testing Library for unit/integration testing of complex custom React components in `physical-ai-book/`.
