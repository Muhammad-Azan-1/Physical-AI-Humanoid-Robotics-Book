---
id: week1-2
title: "Weeks 1-2: Introduction to Physical AI"
sidebar_label: "Weeks 1-2: Intro to Physical AI"
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Weeks 1-2: Introduction to Physical AI

<Tabs>
  <TabItem value="full" label="Full Content" default>

## Foundations of Physical AI

Physical AI represents a paradigm shift from purely digital intelligence to **embodied intelligence**. Unlike ChatGPT, which lives on a server, a Physical AI agent must interact with the chaotic, unscripted physical world. It must understand gravity, friction, and inertia.

### The Moravec's Paradox

One of the key concepts in Physical AI is **Moravec's Paradox**, which states that high-level reasoning (like playing chess or proving theorems) requires very little computation, but low-level sensorimotor skills (like walking or recognizing a face) require enormous computational resources.

> "It is comparatively easy to make computers exhibit adult level performance on intelligence tests or playing checkers, and difficult or impossible to give them the skills of a one-year-old when it comes to perception and mobility." — Hans Moravec

### From Digital AI to Physical Laws

*   **Digital AI:** "Write a poem about a sunset." (No physical consequences, purely generative).
*   **Physical AI:** "Walk to the sunset." (Requires balance, terrain analysis, energy management, collision avoidance).

In Physical AI, a mistake isn't just a syntax error; it can result in hardware damage or physical injury. This is why **simulation** is our first line of defense.

## Humanoid Robotics Landscape

Why humanoids? The world is built for humans. Stairs, door handles, tools, and vehicles are designed for the human form factor. A humanoid robot can seamlessly integrate into existing infrastructure without needing special accommodations.

### Real-World Examples
*   **Tesla Optimus:** Designed for general-purpose labor, leveraging AI from Tesla's Full Self-Driving stack.
*   **Boston Dynamics Atlas:** A hydraulic (and now electric) marvel demonstrating extreme agility and parkour.
*   **Unitree G1:** An affordable ($16k) humanoid for research and education, which we will use as a reference in this course.

### Challenges
1.  **Bipedal Stability:** Walking on two legs is inherently unstable (an inverted pendulum problem).
2.  **Power Density:** Mimicking human muscle efficiency with motors is difficult.
3.  **Complexity:** High degrees of freedom (DoF) require complex control algorithms.

## Sensor Systems: The Robot's Senses

To function in the real world, our robot needs senses. We map these to biological equivalents:

### 1. The Eyes: Cameras (RGB & Depth)
We use **Intel RealSense** cameras to provide:
*   **RGB Data:** Color images for object recognition (e.g., "That is a cup").
*   **Depth Data:** Distance maps for navigation (e.g., "The cup is 1.2 meters away").

### 2. The Inner Ear: IMUs (Inertial Measurement Units)
An IMU contains:
*   **Accelerometers:** Measure linear acceleration.
*   **Gyroscopes:** Measure rotational velocity.
*   **Magnetometers:** Measure magnetic heading.
This data is fused to estimate the robot's orientation and balance.

### 3. The Touch: Force/Torque Sensors
Located in the feet and wrists, these measure the interaction forces with the environment.
*   **Feet:** Essential for ZMP (Zero Moment Point) based walking algorithms.
*   **Wrists:** Essential for compliant manipulation (knowing if you are crushing the egg).

### 4. The Spatial Awareness: LiDAR
**LIDAR (Light Detection and Ranging)** sends out laser pulses to create a precise 2D or 3D map of the environment. It is the gold standard for SLAM (Simultaneous Localization and Mapping).

  </TabItem>
  <TabItem value="summary" label="Summary">

## Summary: Physical AI

**Core Concept:** Embodied Intelligence (AI in the physical world).

### Key Points
*   **Moravec's Paradox:** Hard things (chess) are easy for AI; easy things (walking) are hard.
*   **Humanoid Form:** Chosen for infrastructure compatibility (stairs, tools).
*   **Challenges:** Bipedal stability, power density, control complexity.

### Sensors
*   **Cameras (RGB-D):** Vision and depth (RealSense).
*   **IMU:** Balance and orientation (Inner Ear).
*   **Force/Torque:** Touch and contact forces.
*   **LiDAR:** Spatial mapping (SLAM).

  </TabItem>
</Tabs>
