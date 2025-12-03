# Implementation Plan: Initialize Physical AI Book Skeleton

**Branch**: `001-init-physical-ai-book` | **Date**: 2025-12-03 | **Spec**: /specs/001-init-physical-ai-book/spec.md
**Input**: Feature specification from `/specs/001-init-physical-ai-book/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

This plan outlines the initialization of a Docusaurus site for the "Physical AI & Humanoid Robotics" textbook, adhering to a 13-week curriculum structure. The core installation will use Docusaurus 3.x with the `classic` theme and `npm`, ensuring a custom folder structure rather than the default tutorial setup. We will leverage Context7 for Docusaurus documentation.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: JavaScript (Node.js for Docusaurus CLI), React  
**Primary Dependencies**: Docusaurus 3.x, React, npm  
**Storage**: Filesystem (Markdown, JavaScript, CSS)  
**Testing**: N/A (for initial setup, later will include Docusaurus build/link checks)  
**Target Platform**: Web (Docusaurus site, deployed via GitHub Pages)
**Project Type**: Web application  
**Performance Goals**: Fast page load times, smooth navigation (typical for static site generators)  
**Constraints**: Must use `npm`, no default Docusaurus tutorial structure  
**Scale/Scope**: Single documentation site, mirroring a 13-week curriculum, initially small-to-medium content volume

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The following constitutional principles from `.specify/memory/constitution.md` are relevant to this plan for initializing the Docusaurus site:

### For Module-Planner (Weekly Structure) Evaluation:

- [x] **Each week maps to specific module and learning objectives**: The feature specification (spec.md) clearly outlines a 13-week curriculum across 4 modules, detailing the learning focus for each week. This plan will ensure the Docusaurus structure can accommodate this mapping.
- [x] **Hardware tier progression clear (when Tier 2/3 content appears)**: The constitution details 3 hardware tiers (Simulation-only, Edge Kit, Full Robot). The Docusaurus site structure should be designed to clearly delineate content for different tiers, as specified in the constitution (e.g., in weeks 8-10 for Edge Kit and optional Week 13 for Full Robot). This plan acknowledges the need to account for this in the site architecture.
- [x] **Assessment scaffolding builds toward capstone (Week 13)**: The spec defines 4 assessments (Weeks 5, 7, 10, 13) with a capstone project in Week 13. The Docusaurus site will need to clearly present these assessments and their progression.
- [x] **VLA components introduced progressively (ROS 2 → perception → voice)**: The spec mentions Vision-Language-Action (VLA) integration as a core aspect. The Docusaurus site, while initially just a skeleton, will need a content structure that supports the progressive introduction of VLA components from ROS 2 fundamentals to voice control.
- [x] **Safety checkpoints defined (simulation validation before physical)**: The constitution emphasizes "Safety-First Design" and "Simulation-First Validation" for humanoid robotics. While the Docusaurus site itself doesn't have direct safety mechanisms, its content structure must allow for clear documentation and presentation of safety protocols and simulation validation results for the robotics content it hosts. This plan will ensure the Docusaurus structure supports this critical content.
- [x] **Anthropomorphic design rationale present in relevant weeks**: The constitution highlights "Anthropomorphic Design for Human-Centered Worlds." The Docusaurus content will need to explain why human form factor matters for robotics, and the site structure should facilitate this narrative.

**Initial Gate Evaluation:** All relevant principles are acknowledged and will be considered during the Docusaurus site structure design. No immediate violations detected for the *initialization* phase of the Docusaurus site. The plan will ensure the Docusaurus structure supports the content requirements of these principles.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
# [REMOVE IF UNUSED] Option 1: Single project (DEFAULT)
src/
├── models/
├── services/
├── cli/
└── lib/

tests/
├── contract/
├── integration/
└── unit/

# [REMOVE IF UNUSED] Option 2: Web application (when "frontend" + "backend" detected)
backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/

# [REMOVE IF UNUSED] Option 3: Mobile + API (when "iOS/Android" detected)
api/
└── [same as backend above]

ios/ or android/
└── [platform-specific structure: feature modules, UI flows, platform tests]
```

**Structure Decision**: [Document the selected structure and reference the real
directories captured above]

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
