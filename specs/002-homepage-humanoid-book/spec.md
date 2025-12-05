# Feature Specification: Physical AI & Humanoid Robotics Book Homepage

**Feature Branch**: `002-homepage-humanoid-book`
**Created**: 2025-12-04
**Status**: Draft
**Input**: User description: "


Overview
Create a two-page website for 'Physical AI & Humanoid Robotics' book:
1. Homepage (landing page) - Marketing/introduction with hero section
2. Book Page (documentation) - Full curriculum with sidebar navigation for all chapters
Design pattern follows: bookUrl ->  https://ai-native.panaversity.org/ , githuUrl -> https://github.com/panaversity/ai-native-software-development

Problem & Solution
Current State:
* Docusaurus crash due to tutorial sidebar error
* Default scaffolding, no custom content
* No proper homepage or book page separation
Target State:
* Homepage: Professional landing page (like image 1)
* Book Page: Chapter navigation with sidebar (like image 2)
* Navbar with 'Book' button that navigates to chapters
* 4 modules × 13 weeks organized in sidebar
* Error-free, responsive, fast loading

Page Structure
PAGE 1: Homepage (/ root path)
Purpose: Marketing landing page to introduce the book
Layout Components:
┌─────────────────────────────────────────────────────┐
│ NAVBAR                                              │
│ [Logo] Physical AI & Humanoid Robotics    [Book Button] [Search] [Sign In] [Sign Up] │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│                    HERO SECTION                     │
│  ┌──────────┐    PANAVERSITY AI-NATIVE BOOK SERIES │
│  │  Robot   │    Physical AI & Humanoid Robotics   │
│  │  Image   │    Building Intelligent Humanoid     │
│  │  (Book)  │    Robots from Simulation to Reality │
│  │  Cover   │                                       │
│  └──────────┘    ✨ Open Source 🎓 Simulation First│
│                   🤖 AI-Powered                     │
│                                                     │
│                   [Explore Curriculum] [Start Reading →]│
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│          WHY HUMANOID ROBOTICS NOW?                 │
│  [Card 1: $160B Market] [Card 2: Simulation First] │
│  [Card 3: AI-Powered]   [Card 4: Career Ready]     │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│          THREE APPROACHES TO PHYSICAL AI            │
│  1. AI-Assisted Robotics (Traditional + AI tools)   │
│  2. AI-Driven Robotics (Spec → Code generation)     │
│  3. AI-Native Robotics (AI as core intelligence)    │
│  → This course focuses on #2 and #3                 │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│              COURSE CURRICULUM PREVIEW              │
│  ┌─────────────┐  ┌─────────────┐                 │
│  │  MODULE 1   │  │  MODULE 2   │                 │
│  │ Foundations │  │ Perception  │                 │
│  │  Weeks 1-3  │  │  Weeks 4-7  │                 │
│  └─────────────┘  └─────────────┘                 │
│  ┌─────────────┐  ┌─────────────┐                 │
│  │  MODULE 3   │  │  MODULE 4   │                 │
│  │   Design    │  │ Deployment  │                 │
│  │  Weeks 8-10 │  │ Weeks 11-13 │                 │
│  └─────────────┘  └─────────────┘                 │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│            CHOOSE YOUR LEARNING PATH                │
│  TIER 1: Simulation ($0-500)                       │
│  TIER 2: Basic Hardware ($500-2K)                  │
│  TIER 3: Advanced Platforms ($2K+)                 │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│                 START YOUR JOURNEY                  │
│        [Start Reading →]  [View Curriculum]        │
│     Links: FAQ | Hardware Guide | Community        │
└─────────────────────────────────────────────────────┘
Key Features:
* Dark theme with cyan/blue accents (humanoid robotics theme)
* Book cover image on left, content on right
* Module cards clickable → link to book page sections
* Responsive: stacks vertically on mobile
* CTA buttons: 'Start Reading' → goes to /docs/intro
"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Homepage Display (Priority: P1)

A new user lands on the homepage and expects to see a welcoming, informative marketing page introducing the "Physical AI & Humanoid Robotics" book, designed with the specified layout and theme.

**Why this priority**: This is the primary entry point for the book and crucial for attracting and informing potential readers. Without a functional and visually appealing homepage, the book's online presence is severely hindered.

**Independent Test**: The homepage can be fully tested by navigating to the root path (`/`) and verifying that all specified sections and visual elements are present, correctly formatted, responsive, and adhere to the dark theme with cyan/blue accents.

**Acceptance Scenarios**:

1.  **Given** a user navigates to the root path (`/`), **When** the page loads, **Then** the user sees a Navbar with an image logo (e.g., `static/img/logo.svg`), "Physical AI & Humanoid Robotics" title, "[Book Button] [Search] [Sign In] [Sign Up]".
2.  **Given** a user navigates to the root path (`/`), **When** the page loads, **Then** the user sees a Hero Section with the robot/book cover image on the left and marketing text on the right including "PANAVERSITY AI-NATIVE BOOK SERIES", "Physical AI & Humanoid Robotics", "Building Intelligent Humanoid Robots from Simulation to Reality", "✨ Open Source 🎓 Simulation First 🤖 AI-Powered", and CTA buttons "[Explore Curriculum] [Start Reading →]".
3.  **Given** a user navigates to the root path (`/`), **When** the page loads, **Then** the user sees a "WHY HUMANOID ROBOTICS NOW?" section with four cards: "$160B Market", "Simulation First", "AI-Powered", "Career Ready".
4.  **Given** a user navigates to the root path (`/`), **When** the page loads, **Then** the user sees a "THREE APPROACHES TO PHYSICAL AI" section listing three approaches, emphasizing focus on #2 and #3.
5.  **Given** a user navigates to the root path (`/`), **When** the page loads, **Then** the user sees a "COURSE CURRICULUM PREVIEW" section with four clickable module cards: "MODULE 1: Foundations (Weeks 1-3)", "MODULE 2: Perception (Weeks 4-7)", "MODULE 3: Design (Weeks 8-10)", "MODULE 4: Deployment (Weeks 11-13)".
6.  **Given** a user navigates to the root path (`/`), **When** the page loads, **Then** the user sees a "CHOOSE YOUR LEARNING PATH" section listing three tiers: "TIER 1: Simulation ($0-500)", "TIER 2: Basic Hardware ($500-2K)", "TIER 3: Advanced Platforms ($2K+)".
7.  **Given** a user navigates to the root path (`/`), **When** the page loads, **Then** the user sees a "START YOUR JOURNEY" section with CTA buttons "[Start Reading →] [View Curriculum]" and links for "FAQ", "Hardware Guide", "Community".
8.  **Given** the homepage is viewed on a mobile device, **When** the page loads, **Then** all layout components stack vertically, maintaining readability and functionality.
9.  **Given** the homepage is loaded, **When** visual elements are rendered, **Then** the dark theme with cyan/blue accents is consistently applied.

---

### User Story 2 - Book Page Navigation (Priority: P1)

A user wants to access the full curriculum of the "Physical AI & Humanoid Robotics" book with clear chapter navigation.

**Why this priority**: Providing access to the book's content is the core purpose of the site. Easy navigation is essential for a positive learning experience.

**Independent Test**: This can be fully tested by clicking the "Book" button in the Navbar or "Start Reading →" on the homepage and verifying that the book page loads with the full curriculum and a functional sidebar navigation.

**Acceptance Scenarios**:

1.  **Given** a user is on the homepage, **When** they click the "Book" button in the Navbar, **Then** they are navigated to the book page (`/docs`).
2.  **Given** a user is on the homepage, **When** they click "Start Reading →" CTA button, **Then** they are navigated to `/docs/intro`.
3.  **Given** a user is on the homepage, **When** they click a module card (e.g., "MODULE 1"), **Then** they are navigated to the relevant section of the book page.
4.  **Given** a user is on the book page (`/docs`), **When** the page loads, **Then** they see the full curriculum with a sidebar navigation organized into 4 modules × 13 weeks.
5.  **Given** a user is on the book page (`/docs`), **When** they interact with the sidebar navigation, **Then** they can easily navigate between chapters and modules.

---

### Edge Cases

- What happens when JavaScript is disabled? The site should degrade gracefully, with core content still accessible.
- How does the system handle missing image assets (e.g., book cover)? Placeholder images or appropriate error messages should be displayed to prevent layout issues.
- How does the system handle network latency when loading content or images? Implement loading indicators to improve user experience.
- What if a linked book section (from module cards) does not exist? The user should be directed to a relevant default page or an informative error.

   - Q: What is the intended approach for user authentication and handling user data for the "Sign In" and "Sign Up" features? → A: Basic client-side authentication for placeholder functionality, without full backend user management. User data will be minimally handled on the client if necessary for display, but no persistent storage or sensitive data processing is in scope.

### Functional Requirements

- **FR-001**: The Docusaurus site MUST consist of two main pages: a homepage (`/`) and a book page (`/docs`).
- **FR-002**: The homepage (`/`) MUST display a Navbar with a logo, "Physical AI & Humanoid Robotics" title, "Book" button, "Search", "Sign In", and "Sign Up" links, where "Search" utilizes Docusaurus's built-in search functionality and "Sign In" and "Sign Up" provide placeholder client-side authentication functionality.
- **FR-003**: The "Book" button in the Navbar MUST navigate to the book chapters (`/docs`).
- **FR-004**: The homepage (`/`) MUST feature a Hero Section with the book cover image on the left and specific marketing text on the right.
- **FR-005**: The homepage (`/`) MUST include sections: "WHY HUMANOID ROBOTICS NOW?", "THREE APPROACHES TO PHYSICAL AI", "COURSE CURRICULUM PREVIEW", "CHOOSE YOUR LEARNING PATH", and "START YOUR JOURNEY" as described in the user input.
- **FR-006**: Module cards in the "COURSE CURRICULUM PREVIEW" section MUST be clickable and link to corresponding book page sections.
- **FR-007**: The "Start Reading →" CTA button on the homepage MUST navigate to `/docs/intro`.
- **FR-008**: The book page (`/docs`) MUST display the full curriculum with sidebar navigation, organized into 4 modules × 13 weeks.
- **FR-009**: The Docusaurus site MUST implement a dark theme with cyan/blue accents.
- **FR-010**: The Docusaurus site MUST be responsive, ensuring layout components stack vertically on mobile devices.
- **FR-011**: The Docusaurus site MUST load error-free and quickly.
- **FR-012**: The Docusaurus site MUST resolve the existing Docusaurus crash due to tutorial sidebar error.

### Key Entities *(include if feature involves data)*

-   **Page**: Represents a distinct view in the Docusaurus site (e.g., Homepage, Book Page). Key attributes include path, content, layout components.
-   **Navbar**: Represents the global navigation component. Key attributes include logo, title, navigation links (Book, Search, Sign In, Sign Up).
-   **Hero Section**: The prominent introductory section on the homepage. Key attributes include image, marketing text, call-to-action buttons.
-   **Module Card**: Represents a preview of a book module on the homepage. Key attributes include module title, week range, link to book section.
-   **Learning Path Tier**: Represents different learning paths for the book. Key attributes include tier name, price range.

## Success Criteria *(mandatory)*

### Measurable Outcomes

-   **SC-001**: The homepage loads and renders all specified content and components within 2 seconds on a broadband connection.
-   **SC-002**: All navigation links and CTA buttons (Navbar "Book", homepage "Start Reading", module cards) successfully direct users to the expected pages/sections 100% of the time.
-   **SC-003**: The website's layout adapts correctly to mobile viewports (width < 768px), with content stacking vertically as expected, maintaining full functionality.
-   **SC-004**: The dark theme with cyan/blue accents is consistently applied to all UI elements on both homepage and book pages.
-   **SC-005**: The site builds successfully without Docusaurus-related errors, specifically resolving the tutorial sidebar issue.
-   **SC-006**: Page load times for both homepage and book page (after initial load) are consistently under 1 second.