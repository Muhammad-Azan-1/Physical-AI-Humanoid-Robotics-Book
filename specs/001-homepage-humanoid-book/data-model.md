# Data Model: Physical AI & Humanoid Robotics Book Homepage

This data model describes the key content entities and their relationships for the static homepage of the "Physical AI & Humanoid Robotics" book. Given that this is a static Docusaurus site, these entities represent content structures rather than backend data entities.

## Entity: Homepage
*   **Description**: The primary view of the book, introducing its purpose, value proposition, and navigation to the curriculum.
*   **Attributes**:
    *   `heroSection`: Contains the main title, compelling tagline, and a brief introduction to the book.
    *   `valueProposition`: Text explaining the significance and benefits of learning humanoid robotics.
    *   `moduleOverviewCards`: A collection of `ModuleCard` entities, each representing a module in the 13-week curriculum.
    *   `hardwareTiers`: A collection of `HardwareTier` entities, detailing the different hardware requirements and options.
    *   `assessmentStructure`: Information about the total number of assessments.
    *   `navigation`: Links and structure for navigating the 13-week curriculum.
*   **Relationships**:
    *   `HAS_MANY` -> `ModuleCard`
    *   `HAS_MANY` -> `HardwareTier`
    *   `HAS_ONE` -> `Assessment` (for the overall count)

## Entity: ModuleCard
*   **Description**: Represents a single module in the book's curriculum, providing a high-level overview and a link to its detailed content.
*   **Attributes**:
    *   `id`: Unique identifier for the module (e.g., Module 1).
    *   `title`: The name of the module (e.g., "Foundations", "ROS 2").
    *   `description`: A concise summary of the module's focus.
    *   `link`: The URL path to the detailed page for this module.
*   **Relationships**:
    *   `BELONGS_TO` -> `Homepage`

## Entity: HardwareTier
*   **Description**: Defines a recommended hardware setup for the course, catering to different levels of student investment and practical engagement.
*   **Attributes**:
    *   `id`: Unique identifier for the tier (e.g., Tier 1).
    *   `name`: Display name of the tier (e.g., "Tier 1 (Simulation-only)").
    *   `costRange`: Estimated cost range for the tier (e.g., "$200-500").
    *   `components`: Description of the hardware components included in this tier.
*   **Relationships**:
    *   `REFERENCED_BY` -> `Homepage`

## Entity: Assessment
*   **Description**: Provides an overview of the assessment component of the course.
*   **Attributes**:
    *   `totalCount`: The total number of assessments in the curriculum (e.g., 4).
*   **Relationships**:
    *   `REFERENCED_BY` -> `Homepage`
