# Implementation Plan: Module 1 - The Robotic Nervous System (ROS 2)

**Branch**: `006-module-1-foundations` | **Date**: 2025-12-07 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `specs/006-module-1-foundations/spec.md`

## Summary

Implement the "Module 1: The Robotic Nervous System (ROS 2)" page in the Docusaurus site. This module covers the foundations of Physical AI, ROS 2 middleware, and bridging Python agents to ROS controllers. The content will be structured to cover Weeks 1-5 as defined in the course details.

**Update (Refinement):** The initial content was too brief. We will expand the content to provide a comprehensive textbook experience, including detailed explanations, diagrams, and code examples.

**Update (Cleanup):** Removing "Edit this page" links and the "Show Summary" button from the introduction page to improve user experience.

## Technical Context

**Language/Version**: Markdown (MDX), React (Docusaurus)
**Primary Dependencies**: Docusaurus core
**Project Type**: Static Site Generator (Docusaurus)

## Project Structure

### Documentation (this feature)

```text
specs/006-module-1-foundations/
├── plan.md              # This file
├── spec.md              # Feature specification
└── tasks.md             # Task tracking
```

### Source Code

```text
docs/
├── module1/
│   ├── index.md         # Module 1 Overview
│   ├── week1-2.md       # [EXPAND] Weeks 1-2: Intro to Physical AI
│   └── week3-5.md       # [EXPAND] Weeks 3-5: ROS 2 Fundamentals
```

### Configuration

- `docusaurus.config.ts`: Remove `editUrl`.
- `docs/intro.md`: Remove `<SectionSummary>` wrapper.

## Content Expansion Strategy

### Weeks 1-2: Introduction to Physical AI
- **Embodied Intelligence:** Deep dive into the "Moravec's paradox" and why physical tasks are hard for AI.
- **Humanoid Form Factor:** Detailed analysis of why bipedalism is chosen despite stability challenges (infrastructure compatibility).
- **Sensors:** Technical details on RealSense (RGB-D), LiDAR principles, and IMU integration.

### Weeks 3-5: ROS 2 Fundamentals
- **Architecture:** Explain DDS (Data Distribution Service) and the graph architecture.
- **Communication Patterns:**
    - **Topics:** Async streaming (Sensor data).
    - **Services:** Sync request/response (Configuration).
    - **Actions:** Long-running goals (Navigation).
- **URDF:** Visual vs. Collision geometry, kinematic chains.
- **Code:** Complete `rclpy` node example with publisher/subscriber.
