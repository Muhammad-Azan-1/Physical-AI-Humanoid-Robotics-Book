# Implementation Plan: Page Summaries

**Branch**: `007-page-summaries` | **Date**: 2025-12-07 | **Spec**: [spec.md](./spec.md)

## Summary

Implement a "Full Content" vs "Summary" toggle on key pages using Docusaurus Tabs. This allows users to quickly access high-level takeaways.

## Technical Context

**Component**: `@theme/Tabs` and `@theme/TabItem`.
**Files to Modify**:
- `docs/intro.md`
- `docs/module1/index.md`
- `docs/module1/week1-2.md`
- `docs/module1/week3-5.md`

## Content Strategy

For each page, we will wrap the existing content in a `<TabItem value="full">` and create a new `<TabItem value="summary">` with condensed content.

### Summary Content Source
- **Intro**: The "Focus" and "Goal" block we previously highlighted.
- **Module 1 Overview**: The "Learning Outcomes" list.
- **Week 1-2**: Bullet points on Moravec's Paradox, Humanoid Advantages, and Sensor list.
- **Week 3-5**: Bullet points on ROS 2 Nodes, Topics, Services, and URDF definition.

## Complexity Tracking

Low complexity. Requires restructuring markdown files to use JSX components.
