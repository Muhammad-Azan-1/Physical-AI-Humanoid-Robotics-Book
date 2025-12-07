---
slug: /module4
title: Module 4 Overview
sidebar_label: Overview
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Module 4: Vision-Language-Action (VLA)

<Tabs>
  <TabItem value="full" label="Full Content" default>

**Focus:** The convergence of Large Language Models (LLMs) and Robotics.

> **"If the body is the hardware, and ROS 2 is the nervous system, then VLA is the conscious mind."**

In this final module, we tackle the holy grail of robotics: **General Purpose Robots**.
Until now, we have hard-coded behaviors (walking, mapping). Now, we will give our robot the ability to *understand* natural language and *plan* its own actions.

We will explore **Vision-Language-Action (VLA)** models—a new class of AI that takes text and images as input and outputs robot actions directly. We will also build a "Cognitive Pipeline" using OpenAI Whisper (Hearing), GPT-4o (Thinking), and ROS 2 (Acting).

## Learning Outcomes

By the end of this module, you will be able to:

1.  **Control Humanoids:** Understand the kinematics and dynamics of bipedal locomotion (Unitree G1).
2.  **Give Voice Commands:** Implement **OpenAI Whisper** to transcribe speech to text in real-time.
3.  **Plan with LLMs:** Use **GPT-4o** to translate high-level commands ("Clean the kitchen") into a sequence of ROS 2 actions.
4.  **Build the Capstone:** Integrate everything into a final project: "The Autonomous Humanoid".

## Weekly Breakdown

*   **Weeks 11-12:** Humanoid Robot Development (Kinematics, Dynamics, RL).
*   **Week 13:** Conversational Robotics (Whisper, LLMs, VLA).

  </TabItem>
  <TabItem value="summary" label="Summary">

## Module 4 Summary

**Focus:** Cognitive Robotics (VLA & LLMs).

### Key Takeaways
*   **VLA Models:** Multimodal AI that outputs robot actions.
*   **Whisper:** State-of-the-art speech recognition.
*   **LLM Planning:** Using "Chain of Thought" to break down complex tasks.
*   **Capstone:** A fully integrated humanoid that listens, thinks, and acts.

### The Future
We are moving from "Structured Robotics" (factories) to "Unstructured Robotics" (homes). VLA is the key technology enabling this shift.

  </TabItem>
</Tabs>
