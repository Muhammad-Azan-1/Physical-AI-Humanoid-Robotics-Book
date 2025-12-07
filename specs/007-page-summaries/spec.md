# Feature Specification: Page Summaries

**Feature Branch**: `007-page-summaries`
**Created**: 2025-12-07
**Status**: Draft

## Requirements *(mandatory)*

### Functional Requirements
- **FR-001**: The system MUST provide a mechanism to toggle between "Full Content" and "Summary" views on content pages.
- **FR-002**: The "Introduction" page MUST support this toggle.
- **FR-003**: The "Module 1" pages (Overview, Week 1-2, Week 3-5) MUST support this toggle.
- **FR-004**: When "Summary" is selected, the main content MUST be hidden, and only the summary content MUST be shown.
- **FR-005**: The default view MUST be "Full Content".

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Introduction Summary (Priority: P1)
As a student, I want to quickly see the summary of the Introduction page so that I can get the key takeaways without reading the full text.

**Acceptance Scenarios**:
1. **Given** I am on the Introduction page, **When** I click the "Summary" tab/toggle, **Then** I see only the summary content (Focus, Goal, etc.).
2. **Given** I am on the Summary view, **When** I click "Full Content", **Then** the full page content is restored.

### User Story 2 - View Module 1 Summaries (Priority: P1)
As a student, I want to see summaries for Module 1 topics.

**Acceptance Scenarios**:
1. **Given** I am on the "Weeks 1-2" page, **When** I switch to "Summary", **Then** I see a concise bulleted list of the key concepts (Moravec's Paradox, Sensors, etc.).

## Design Decision
We will use **Docusaurus Tabs** (`@theme/Tabs`) to implement this. This provides a clean, standard UI for switching views within a page.
