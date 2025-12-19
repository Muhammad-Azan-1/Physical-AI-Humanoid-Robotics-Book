# Authentication Enhancements

## Overview

This document describes the enhancements made to the authentication system to fix critical issues and improve user experience.

## Features Implemented

### 1. Cross-Window State Synchronization
- Authentication state changes in one browser window/tab are automatically synchronized to all other open windows/tabs
- Uses localStorage events to communicate auth state changes between windows
- Ensures consistent UI across multiple browser windows when signing in/out or verifying email

### 2. Email Verification Flow
- Enhanced email verification state management in AuthContext
- Success feedback mechanism with temporary success messages
- Proper handling of email verification in different windows/tabs

### 3. Sign Out Confirmation Flow
- Modal confirmation dialog before signing out with "Cancel" and "Sign Out" options
- Loading state during signout process
- Success notification after successful sign out with message "You've been signed out successfully"
- Proper handling of cancellation (clicking "Cancel" or outside dialog)

### 4. Redirect URL Validation
- Validates only internal URLs starting with `/` are allowed
- Prevents open redirect vulnerabilities (no protocol or domain)
- Prevents redirect loops to auth pages (signin/signup)
- Implements fallback to default route for invalid URLs
- Uses `getValidRedirectUrl(url, fallback)` function for safe redirects

### 5. Return URL Functionality
- Captures current page URL when navigating to authentication pages
- Stores return URL in query parameters (e.g., `?returnUrl=/docs/module4`)
- Reads and validates return URL after successful authentication
- Preserves query parameters when capturing and returning to original URLs
- Handles case where no return URL is provided (redirects to default)
- Prevents return URL loops to authentication pages

## Key Functions

### URL Validation
- `isValidRedirectUrl(url: string): boolean` - Validates if a redirect URL is safe and internal
- `getValidRedirectUrl(url: string | null | undefined, fallback = '/'): string` - Validates redirect URL and returns a safe fallback if invalid
- `constructAuthUrlWithReturn(authPath: string, returnUrl?: string): string` - Constructs an authentication URL with the return URL as a query parameter

### Return URL Utilities
- `captureReturnUrl(): string` - Captures the current page URL to be used as a return URL
- `getReturnUrlFromParams(): string | null` - Gets the return URL from query parameters
- `isAuthPage(): boolean` - Checks if the current page is an authentication page

## Components

### Sign Out Flow
- `SignOutConfirmationDialog` - Modal dialog for sign out confirmation
- `useSignOutWithConfirmation` - Hook that manages sign out state and logic
- Updated `UserProfileNavbarItem`, `AuthNavbarItem`, and `LogoutButton` components to use the new confirmation flow

### Cross-Window Synchronization
- Enhanced `AuthContext` with cross-window state synchronization using localStorage events
- `enhanceAuthStateHandling` function in `supabase.ts` for cross-window communication

## Security Considerations

1. **Open Redirect Prevention**: All redirect URLs are validated to prevent open redirect vulnerabilities
   - Only internal URLs starting with `/` are allowed
   - External protocols (`http:`, `https:`) and domains are blocked
   - Auth pages are blocked as return URLs to prevent loops

2. **Cross-Window Security**: Auth state is synchronized between windows without exposing sensitive tokens
   - Authentication tokens are not stored in localStorage for security
   - Only auth events and non-sensitive session metadata are synchronized
   - All sensitive operations happen through the secure Supabase client

3. **Input Validation**: All user-provided URLs are validated before use
   - URL validation occurs on both client and through Supabase's built-in protections
   - Invalid URLs fall back to safe default routes

4. **Session Management**: Proper session handling across multiple windows/tabs
   - Sessions are managed securely by Supabase
   - Cross-window sync only updates UI state, not session tokens
   - Sign out operations properly clear sessions in all windows

## Error Handling

- Invalid redirect URLs fall back to default routes
- Authentication errors are properly caught and displayed
- Network failures during auth operations are handled gracefully
- Cross-window synchronization errors are logged but don't break functionality# Authentication Setup Guide

This document explains how to set up and configure the authentication system for the Physical AI & Humanoid Robotics educational platform.

## Overview

The authentication system provides secure user registration, login, and email verification functionality. It includes cross-tab synchronization to ensure consistent authentication state across all open browser tabs.

## Features

### Cross-Tab Authentication Synchronization
- Authentication state is synchronized across all open browser tabs using BroadcastChannel API
- Fallback to localStorage events for broader browser compatibility
- When a user logs in, logs out, or verifies their email in one tab, all other tabs automatically update

### Email Verification
- Users must verify their email address after registration
- Verification tokens expire after 5 minutes for security
- Automatic authentication after successful verification

### Secure Token Management
- HTTP-only cookies for secure token storage
- Automatic token refresh
- Session validation and cleanup

## Configuration

### Environment Variables

Set these environment variables in your `.env` file:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

### Docusaurus Configuration

In `docusaurus.config.js`, add the Supabase configuration to `customFields`:

```js
module.exports = {
  // ... other config
  customFields: {
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
    // ... other custom fields
  },
};
```

## Implementation Details

### Components

- `AuthContext`: Manages authentication state across the application
- `BroadcastChannelManager`: Handles cross-tab communication
- `AuthStateSync`: Synchronizes authentication state across tabs
- `CookieManager`: Manages authentication-related cookies

### Key Files

- `src/contexts/AuthContext.tsx`: Main authentication state management
- `src/components/auth/BroadcastChannelManager.ts`: Cross-tab communication
- `src/components/auth/AuthStateSync.tsx`: Authentication state synchronization
- `src/components/auth/CookieManager.ts`: Cookie management utilities
- `src/pages/auth/callback.tsx`: Handles authentication callbacks and email verification
- `src/pages/signup.tsx`: User registration flow

## Security Considerations

- All authentication tokens are stored securely using HTTP-only cookies where possible
- Verification tokens have a 5-minute expiration window
- Cross-tab communication is validated to prevent unauthorized state changes
- Input sanitization is performed on all user-provided data
- Session validation is performed on each request

## Troubleshooting

### Cross-Tab Synchronization Not Working

1. Check if the browser supports BroadcastChannel API
2. Verify that all tabs are on the same origin
3. Check browser console for errors related to cross-tab communication

### Email Verification Issues

1. Verify that the verification link is not expired (5-minute window)
2. Check that the Supabase configuration is correct
3. Ensure the email verification settings are properly configured in Supabase dashboard

### Session Issues

1. Clear browser cookies and cache if experiencing session problems
2. Verify that the session timeout settings are configured correctly
3. Check that the token refresh mechanism is working properly---
id: intro
title: Welcome to Physical AI
sidebar_position: 1
slug: /intro
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Welcome to Physical AI & Humanoid Robotics

<Tabs>
  <TabItem value="full" label="Full Content" default>

## The Era of Embodied Intelligence

> **"We are moving from AI that lives in the cloud to AI that lives in the world."**

Welcome to the cutting edge of robotics. This is not just another coding course. This is a journey into **Physical AI**—the discipline of giving AI agents a physical body and the ability to interact with the chaotic, unscripted real world.

### Why This Book Exists

For decades, robotics was a field of hard-coded scripts. If you wanted a robot to pick up a cup, you wrote a script: `move_arm(x, y, z)`. But if the cup moved one inch, the robot failed.

Today, we are witnessing a revolution. **Generative AI** and **Reinforcement Learning** are allowing robots to *learn* how to move, see, and act. We are building the "nervous systems" and "brains" for the next generation of humanoid robots.

### What You Will Build

In this book, you will not just read theory. You will build a complete software stack for a humanoid robot:

1.  **The Nervous System (ROS 2):** You will write the middleware that connects sensors to actuators.
2.  **The Digital Twin (Gazebo & Unity):** You will simulate your robot in a physics-accurate virtual world.
3.  **The Brain (NVIDIA Isaac):** You will train your robot to see and navigate using photorealistic simulation.
4.  **The Mind (VLA):** You will use Large Language Models (LLMs) to give your robot common sense.

## Who Is This For?

*   **Software Engineers** who want to break out of the screen and affect the physical world.
*   **AI Researchers** who want to test their models on embodied agents.
*   **Robotics Enthusiasts** who are ready to move beyond Arduino cars to bipedal humanoids.

## How to Use This Book

This book is designed as a **hands-on manual**.
*   **Don't just read.** Run the code.
*   **Don't just run the code.** Break it, then fix it.
*   **Use the Simulator.** Before you deploy to hardware, master the Digital Twin.

### Prerequisites
*   **Python:** Intermediate level (Classes, AsyncIO).
*   **Linux:** Basic command line navigation.
*   **Hardware:** A PC with an NVIDIA GPU (RTX 3060 or higher) is highly recommended for Isaac Sim.

Let's begin. The physical world awaits.

  </TabItem>
  <TabItem value="summary" label="Summary">

## Summary: Welcome

**Goal:** Master the art of **Physical AI**—giving AI agents a body.

### Key Pillars
1.  **ROS 2:** The plumbing (Middleware).
2.  **Simulation:** The training ground (Gazebo/Isaac).
3.  **AI:** The intelligence (RL/VLA).

### Philosophy
*   **Simulation First:** Validate in bits before atoms.
*   **Humanoid First:** Design for the human world.
*   **AI Native:** Use learning, not scripting.

  </TabItem>
</Tabs>---
slug: /module1
title: Module 1 Overview
sidebar_label: Overview
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Module 1: The Robotic Nervous System (ROS 2)

<Tabs>
  <TabItem value="full" label="Full Content" default>

**Focus:** Middleware for robot control.

This module establishes the foundational "nervous system" of our humanoid robots using ROS 2 (Robot Operating System). Just as a biological nervous system transmits signals between the brain and the body, ROS 2 manages the communication between our AI agents (the brain) and the robot's actuators and sensors (the body).

## Learning Outcomes

By the end of this module, you will be able to:

1.  Understand the core architecture of ROS 2.
2.  Create and manage ROS 2 Nodes, Topics, and Services.
3.  Bridge Python AI agents to ROS controllers using `rclpy`.
4.  Describe humanoid robot structures using URDF.

## Weekly Breakdown

*   **Weeks 1-2:** Introduction to Physical AI & Embodied Intelligence.
*   **Weeks 3-5:** ROS 2 Fundamentals & Architecture.


</TabItem>
<TabItem value="summary" label="Summary">

## Module 1 Summary

**Focus:** Middleware for robot control (ROS 2).

### Key Takeaways
*   **ROS 2:** The nervous system connecting AI (Brain) to Actuators (Body).
*   **Nodes:** Processes that perform computation.
*   **Topics:** Channels for data flow.
*   **URDF:** Format for describing robot geometry.

</TabItem>
</Tabs>
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
---
id: week3-5
title: "Weeks 3-5: ROS 2 Fundamentals"
sidebar_label: "Weeks 3-5: ROS 2 Fundamentals"
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Weeks 3-5: ROS 2 Fundamentals

<Tabs>
  <TabItem value="full" label="Full Content" default>

## ROS 2 Architecture: The Nervous System

ROS 2 (Robot Operating System 2) is the industry standard middleware for robotics. It is not an OS in the traditional sense (like Windows or Linux) but a set of software libraries and tools that help you build robot applications.

### The Power of DDS (Data Distribution Service)
Unlike ROS 1, which used a custom TCP/UDP protocol, ROS 2 is built on top of **DDS**, an industrial-grade connectivity standard used in battleships, financial trading, and air traffic control.
*   **Real-Time:** DDS ensures data is delivered with predictable latency (Quality of Service).
*   **Decentralized:** No "Master Node" means no single point of failure.
*   **Interoperability:** Different DDS vendors (FastDDS, CycloneDDS) can talk to each other.

### The Graph Architecture
A ROS 2 system is a network of **Nodes** communicating with each other.

1.  **Nodes:** Individual processes that perform computation. (e.g., one node controls the camera, another controls the motors).
2.  **Topics:** Named buses over which nodes exchange messages. (e.g., `/camera/image_raw`). This is a **Publisher-Subscriber** model.
3.  **Services:** Request/reply communication for synchronous transactions. (e.g., "Take a picture now").
4.  **Actions:** Long-running tasks with feedback. (e.g., "Navigate to the kitchen").

## Building ROS 2 Packages

We will use Python (`rclpy`) to write our ROS 2 nodes.

### A Robust Publisher Node
This node publishes a "Hello World" message every second.

```python
import rclpy
from rclpy.node import Node
from std_msgs.msg import String

class MinimalPublisher(Node):

    def __init__(self):
        super().__init__('minimal_publisher')
        # Create a publisher on the 'topic' topic, with a queue size of 10
        self.publisher_ = self.create_publisher(String, 'topic', 10)
        timer_period = 0.5  # seconds
        self.timer = self.create_timer(timer_period, self.timer_callback)
        self.i = 0

    def timer_callback(self):
        msg = String()
        msg.data = 'Hello World: %d' % self.i
        self.publisher_.publish(msg)
        self.get_logger().info('Publishing: "%s"' % msg.data)
        self.i += 1

def main(args=None):
    rclpy.init(args=args)
    minimal_publisher = MinimalPublisher()
    rclpy.spin(minimal_publisher)
    # Destroy the node explicitly
    minimal_publisher.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

## Launch Files: Orchestrating the System

Launch files allow us to start multiple nodes with a single command, managing their configuration and parameters.

```python
from launch import LaunchDescription
from launch_ros.actions import Node

def generate_launch_description():
    return LaunchDescription([
        Node(
            package='my_package',
            executable='minimal_publisher',
            name='publisher_node'
        ),
        Node(
            package='my_package',
            executable='minimal_subscriber',
            name='subscriber_node'
        )
    ])
```

## URDF: The Robot's Body

**URDF (Unified Robot Description Format)** is an XML format used to describe the physical structure of the robot.

*   **Links:** Rigid bodies (e.g., forearm, hand).
*   **Joints:** Connections between links (e.g., elbow hinge).

```xml
<robot name="simple_arm">
  <link name="base_link">
    <visual>
      <geometry>
        <cylinder length="0.6" radius="0.2"/>
      </geometry>
    </visual>
  </link>
  
  <link name="forearm">
    <visual>
      <geometry>
        <box size="0.6 0.1 0.1"/>
      </geometry>
    </visual>
  </link>

  <joint name="elbow" type="revolute">
    <parent link="base_link"/>
    <child link="forearm"/>
    <origin xyz="0 0 0.6"/>
    <axis xyz="0 1 0"/>
  </joint>
</robot>
```

  </TabItem>
  <TabItem value="summary" label="Summary">

## Summary: ROS 2

**ROS 2:** Middleware for robot communication, built on DDS.

### Core Concepts
*   **Nodes:** Compute units.
*   **Topics:** Async data streams (Pub/Sub).
*   **Services:** Sync calls (Req/Res).
*   **Actions:** Long tasks with feedback.

### Development
*   **rclpy:** Python client library.
*   **Launch Files:** Start multiple nodes.
*   **URDF:** XML robot description (Links & Joints).

  </TabItem>
</Tabs>
---
slug: /module2
title: Module 2 Overview
sidebar_label: Overview
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Module 2: The Digital Twin (Gazebo & Unity)

<Tabs>
  <TabItem value="full" label="Full Content" default>

**Focus:** Physics simulation and environment building.

This module introduces the concept of the **Digital Twin**—a virtual replica of our physical robot and its environment. Before we trust our AI algorithms with expensive hardware and human safety, we must validate them in high-fidelity simulations. We will use Gazebo for physics-accurate simulation and Unity for photorealistic rendering.

## Learning Outcomes

By the end of this module, you will be able to:

1.  **Simulate Robots:** Use Gazebo to simulate physics, gravity, and collisions.
2.  **Describe Robots:** Master URDF and SDF formats to define robot structure and environments.
3.  **Simulate Sensors:** Implement virtual LiDAR, Depth Cameras, and IMUs.
4.  **Visualize:** Use Unity for high-fidelity visualization and Human-Robot Interaction (HRI).

## Weekly Breakdown

*   **Weeks 6-7:** Robot Simulation with Gazebo & Unity.

  </TabItem>
  <TabItem value="summary" label="Summary">

## Module 2 Summary

**Focus:** Physics simulation and environment building.

### Key Takeaways
*   **Digital Twin:** Validating AI in simulation before reality.
*   **Gazebo:** The standard physics engine for ROS 2.
*   **URDF/SDF:** Formats for describing robots and worlds.
*   **Unity:** Photorealistic rendering for HRI.

  </TabItem>
</Tabs>
---
id: week6-7
title: "Weeks 6-7: Robot Simulation with Gazebo"
sidebar_label: "Weeks 6-7: Robot Simulation"
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Weeks 6-7: Robot Simulation with Gazebo

<Tabs>
  <TabItem value="full" label="Full Content" default>

## The Digital Twin Paradigm

> **"Simulation is not just about testing; it's about training the mind of the robot before it inhabits a body."**

In this module, we bridge the gap between code and reality. Before we deploy our ROS 2 nodes to a physical humanoid (which can cost anywhere from $15k to $100k+), we must validate our logic in a **Digital Twin**—a high-fidelity simulation that mimics the physical laws of the real world.

### Why Simulation is Non-Negotiable for Humanoids

1.  **Safety & Cost:** A bipedal robot falling is a catastrophic event. It can break gears, shatter sensors, and injure bystanders. In simulation, a fall is just a reset button.
2.  **Scalability:** We can train thousands of robots in parallel in the cloud (e.g., using Isaac Gym) to accelerate reinforcement learning for walking gaits.
3.  **Ground Truth:** In simulation, we know the exact position of every joint and object, which helps in debugging perception algorithms before dealing with noisy real-world sensors.

## Gazebo: The Standard Simulator

Gazebo is the de facto standard simulator for ROS 2. It provides a physics engine (ODE, Bullet, Dart) to simulate gravity, inertia, friction, and collisions.

### Gazebo Classic vs. Gazebo Harmonic
*   **Gazebo Classic (formerly Gazebo 11):** The legacy monolithic simulator. EOL in 2025.
*   **Gazebo Harmonic (formerly Ignition):** The new modular architecture. It separates physics, rendering, and sensors into distinct libraries. **We will use Harmonic** as it integrates natively with ROS 2 Jazzy/Humble.

### Setting Up the Environment

If you installed ROS 2 Desktop Full, Gazebo is already included. To verify your installation:

```bash
# Launch Gazebo
ign gazebo
```

### Basic Controls
- **Left Click**: Select objects.
- **Right Click**: Move camera (pan/tilt).
- **Scroll**: Zoom in/out.
- **Play/Pause**: Control the physics simulation time.

## Robot Description: URDF vs. SDF

To simulate a robot, we must describe its physical properties: **Visuals** (what it looks like) and **Collisions** (physical boundaries).

### URDF (Unified Robot Description Format)
URDF is an XML format used by ROS to describe the kinematic tree of a robot (links and joints). For a humanoid, this tree is complex, branching from the pelvis to the legs, torso, arms, and head.

#### Example: A Humanoid Leg Link
```xml
<link name="right_thigh">
  <visual>
    <geometry>
      <cylinder length="0.4" radius="0.05"/>
    </geometry>
    <material name="white"/>
  </visual>
  <collision>
    <geometry>
      <cylinder length="0.4" radius="0.05"/>
    </geometry>
  </collision>
  <inertial>
    <mass value="2.0"/>
    <inertia ixx="0.01" ixy="0.0" ixz="0.0" iyy="0.01" iyz="0.0" izz="0.005"/>
  </inertial>
</link>
```

### SDF (Simulation Description Format)
While URDF is for the robot *structure*, SDF is for the *world* and simulation environment (lighting, gravity, multiple robots). Gazebo uses SDF natively. ROS 2 often converts URDF to SDF at runtime.

## Physics & Sensors

A "Digital Twin" is useless without sensors. We need to simulate the data our AI agents will consume.

### Simulating Gravity & Collisions
Gazebo handles rigid body dynamics. If you define a mass and inertia for your robot links, gravity will pull them down. If you don't define collision geometries, your robot will fall through the floor!

### Adding Sensors
We can attach virtual sensors to our URDF model. These publish data to ROS 2 topics just like real hardware.

#### LiDAR (Light Detection and Ranging)
Used for mapping and obstacle avoidance.
```xml
<gazebo reference="lidar_link">
  <sensor name="lidar" type="gpu_lidar">
    <update_rate>10</update_rate>
    <ray>
      <scan>
        <horizontal>
          <samples>360</samples>
          <resolution>1</resolution>
          <min_angle>-3.14</min_angle>
          <max_angle>3.14</max_angle>
        </horizontal>
      </scan>
    </ray>
  </sensor>
</gazebo>
```

#### Depth Camera (RGB-D)
Simulates an Intel RealSense camera, providing color images and depth maps.

#### IMU (Inertial Measurement Unit)
Provides acceleration and orientation data, essential for balancing a humanoid.

## Introduction to Unity for Visualization

While Gazebo is great for physics, **Unity** offers superior rendering and is often used for Human-Robot Interaction (HRI) scenarios.

### Unity Robotics Hub
Unity provides the **URDF Importer**, a tool that automatically converts your ROS URDF files into Unity GameObjects with ArticulationBodies (physics joints).
*   **Photorealism:** Better lighting and textures make it ideal for training computer vision models.
*   **VR/AR Integration:** You can control your digital twin using a VR headset.
*   **ROS-TCP-Connector:** Unity can communicate with ROS 2 nodes via TCP/IP.

In the next weeks, we will build a complete simulation environment where our humanoid can walk and interact with objects.

  </TabItem>
  <TabItem value="summary" label="Summary">

## Summary: Simulation & Digital Twins

**Core Concept:** The Digital Twin allows us to validate AI logic safely before physical deployment.

### Key Tools
*   **Gazebo Harmonic:** The modern physics engine for ROS 2.
*   **URDF:** The robot's body structure (XML).
*   **SDF:** The world description.
*   **Unity:** High-fidelity visualization for HRI.

### Critical Components
*   **Inertia Matrices:** Required for realistic physics.
*   **Collision Geometry:** Prevents "ghost" robots.
*   **Virtual Sensors:** LiDAR, Cameras, and IMUs that mimic real hardware.

  </TabItem>
</Tabs>---
slug: /module3
title: Module 3 Overview
sidebar_label: Overview
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Module 3: The AI-Robot Brain (NVIDIA Isaac™)

<Tabs>
  <TabItem value="full" label="Full Content" default>

**Focus:** Advanced perception, photorealistic simulation, and reinforcement learning.

> **"The robot that learns in a low-fidelity simulation will fail in the high-fidelity real world."**

This module introduces the **NVIDIA Isaac** platform, the industry standard for embodied AI. While Gazebo provides the foundational physics, NVIDIA Isaac Sim leverages **RTX technology** (Ray Tracing) to create "Digital Twins" that are visually indistinguishable from reality. This photorealism is not just for aesthetics; it is critical for training computer vision models that can generalize to the real world.

We will move beyond basic scripting to **Reinforcement Learning (RL)**, where robots learn complex behaviors (like walking or grasping) through millions of trial-and-error iterations in simulation—something impossible to do with physical hardware alone.

## Learning Outcomes

By the end of this module, you will be able to:

1.  **Master Isaac Sim:** Create photorealistic environments using OpenUSD and import assets from the NVIDIA Omniverse ecosystem.
2.  **Generate Synthetic Data:** Use **Isaac Replicator** to generate millions of labeled images (segmentation, depth, bounding boxes) to train robust CV models.
3.  **Implement Visual SLAM:** Deploy **Isaac ROS VSLAM** for precise localization using stereo cameras, offloading compute to the GPU.
4.  **Navigate with Nav2:** Integrate Isaac ROS with the ROS 2 Navigation Stack (Nav2) for intelligent path planning.
5.  **Train Policies:** Use **Isaac Lab** (formerly Isaac Gym) to train humanoid locomotion policies using massive parallelization.

## Weekly Breakdown

*   **Weeks 8-10:** NVIDIA Isaac Platform (Sim, ROS, Lab).

  </TabItem>
  <TabItem value="summary" label="Summary">

## Module 3 Summary

**Focus:** Advanced perception and training (NVIDIA Isaac).

### Key Takeaways
*   **Isaac Sim:** Photorealistic simulation powered by RTX and OpenUSD.
*   **Synthetic Data Generation (SDG):** Solving the "data starvation" problem with Replicator.
*   **Isaac ROS:** Hardware-accelerated GEMs for VSLAM and Navigation.
*   **Isaac Lab:** Massively parallel Reinforcement Learning for humanoids.

### Why It Matters
Traditional coding (if/else) cannot handle the complexity of the real world. We need AI models trained on massive datasets. Isaac Sim provides the data; Isaac Lab provides the training ground.

  </TabItem>
</Tabs>
---
id: module3-week1-chapter1
title: "Week 1: Introduction to Module 3"
sidebar_position: 1
---

This is the introductory chapter for Module 3. Content to be added later.---
id: week8-10
title: "Weeks 8-10: NVIDIA Isaac Platform"
sidebar_label: "Weeks 8-10: NVIDIA Isaac"
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Weeks 8-10: NVIDIA Isaac Platform

<Tabs>
  <TabItem value="full" label="Full Content" default>

## The Isaac Ecosystem: A Deep Dive

NVIDIA Isaac is a comprehensive robotics platform built on three pillars: **Simulation** (Isaac Sim), **Deployment** (Isaac ROS), and **Learning** (Isaac Lab).

### 1. Isaac Sim: The Metaverse for Robots

Built on **NVIDIA Omniverse**, Isaac Sim uses the **OpenUSD** (Universal Scene Description) file format. Unlike URDF, which only describes kinematics, USD describes the entire world: lighting, materials, physics, and rendering properties.

#### Key Feature: RTX Real-Time Ray Tracing
Standard simulators use "rasterization" (like video games from 2010). Isaac Sim uses **Ray Tracing**, simulating individual photons of light.
*   **Why it matters:** A LiDAR sensor in Gazebo might see a glass window as a solid wall. In Isaac Sim, the simulated LiDAR rays pass *through* the glass, just like in reality. This "physics-based rendering" is essential for validating sensor stacks.

### 2. Synthetic Data Generation (SDG) with Replicator

Training a neural network requires thousands of labeled images. Manually labeling real-world data is slow and error-prone. **Isaac Replicator** automates this.

#### Code Example: Generating a Dataset
We can script a "Domain Randomization" pipeline to generate diverse data.

```python
import omni.replicator.core as rep

with rep.new_layer():
    # 1. Spawn the object (e.g., a screw)
    screw = rep.create.from_usd("path/to/screw.usd")
    
    # 2. Randomize its position and rotation every frame
    with rep.trigger.on_frame(num_frames=1000):
        rep.randomizer.scatter_3d(screw, volume_min=(-1, -1, 0), volume_max=(1, 1, 0))
        rep.randomizer.rotation(screw)
        
        # 3. Randomize the lighting to make the model robust
        lights = rep.create.light(intensity=1000, temperature=6500)
        rep.randomizer.color(lights, colors=rep.distribution.uniform((0.5, 0.5, 0.5), (1, 1, 1)))

    # 4. Attach a camera and writer (e.g., KITTI format)
    camera = rep.create.camera(position=(0, 0, 5))
    render_product = rep.create.render_product(camera, (1024, 1024))
    writer = rep.WriterRegistry.get("KittiWriter")
    writer.initialize(output_dir="output_data", rgb=True, bounding_box_2d_tight=True)
    writer.attach([render_product])
```

### 3. Isaac ROS: Hardware Acceleration

Running SLAM on a CPU is inefficient. Isaac ROS provides **GEMs** (GPU-accelerated modules) that run 10-100x faster than standard ROS nodes.

#### Visual SLAM (VSLAM) Integration
We use `isaac_ros_visual_slam` to track the robot's position.

**Launch File Example:**
```python
from launch import LaunchDescription
from launch_ros.actions import ComposableNodeContainer
from launch_ros.descriptions import ComposableNode

def generate_launch_description():
    visual_slam_node = ComposableNode(
        package='isaac_ros_visual_slam',
        plugin='nvidia::isaac_ros::visual_slam::VisualSlamNode',
        name='visual_slam_node',
        parameters=[{
            'enable_imu_fusion': True,
            'enable_rectified_pose': True,
            'denoise_input_images': False,
        }],
        remappings=[('stereo_camera/left/image', '/camera/left/image_raw'),
                    ('stereo_camera/right/image', '/camera/right/image_raw'),
                    ('visual_slam/tracking/odometry', '/odom')]
    )

    return LaunchDescription([
        ComposableNodeContainer(
            name='vslam_container',
            namespace='',
            package='rclcpp_components',
            executable='component_container',
            composable_node_descriptions=[visual_slam_node],
            output='screen'
        )
    ])
```

### 4. Isaac Lab: Reinforcement Learning for Humanoids

**Isaac Lab** (built on Isaac Sim) is designed for **Massively Parallel Training**. Instead of training one robot in real-time, we train 4,096 robots simultaneously on a single GPU.

#### The "Sim-to-Real" Gap
A policy trained in a perfect simulation will fail in the real world due to friction differences, sensor noise, and motor latency.
*   **Solution:** **Domain Randomization**. We intentionally "confuse" the AI during training by randomly varying gravity, friction, and mass. This forces the AI to learn a robust policy that works *despite* these variations.

> **Case Study: Agility Robotics**
> Agility Robotics uses Isaac Sim to train their humanoid, Digit. By training in simulation, they can test dangerous scenarios (like being pushed or slipping on ice) without risking the $250,000 hardware.

  </TabItem>
  <TabItem value="summary" label="Summary">

## Summary: The AI-Robot Brain

**Core Concept:** Leveraging GPU acceleration for both Simulation (Training) and Deployment (Inference).

### Key Technologies
*   **OpenUSD:** The "HTML of the Metaverse"—a universal format for 3D worlds.
*   **RTX Rendering:** Physics-based light simulation for accurate sensor validation.
*   **Isaac ROS GEMs:** Drop-in replacements for standard ROS nodes (e.g., VSLAM, AprilTag) that run on CUDA.
*   **Isaac Lab:** A framework for training RL policies at scale.

### Pro Tip
Don't try to run Isaac Sim on a laptop without a dedicated RTX GPU. It requires significant VRAM (12GB+) to load the USD assets and run the physics engine. For students with lower-end hardware, use **AWS RoboMaker** or **Omniverse Cloud**.

  </TabItem>
</Tabs>
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
---
id: module4-week1-chapter1
title: "Week 1: Introduction to Module 4"
sidebar_position: 1
---

This is the introductory chapter for Module 4. Content to be added later.---
id: week11-13
title: "Weeks 11-13: Humanoid Development & VLA"
sidebar_label: "Weeks 11-13: Humanoid & VLA"
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Weeks 11-13: Humanoid Development & VLA

<Tabs>
  <TabItem value="full" label="Full Content" default>

## Part 1: Humanoid Robot Development (Weeks 11-12)

Building a humanoid is the ultimate engineering challenge. It requires mastering the physics of instability.

### The Inverted Pendulum Problem
A walking human is essentially an inverted pendulum that is constantly falling and catching itself.
*   **ZMP (Zero Moment Point):** The traditional control theory approach. We calculate the point where the total inertial force is zero and ensure it stays within the support polygon (the feet).
*   **Reinforcement Learning (RL):** The modern approach. We let the robot "play" in simulation (Isaac Lab) millions of times until it learns to walk.

> **Case Study: Unitree G1**
> The Unitree G1 uses a hybrid approach. It has high-torque motors (up to 120Nm) and runs a policy trained in Isaac Gym using **PPO (Proximal Policy Optimization)**. This allows it to recover from pushes and walk on uneven terrain.

### Kinematics: Forward vs. Inverse
*   **Forward Kinematics (FK):** "If I set my joint angles to X, where is my hand?" (Easy).
*   **Inverse Kinematics (IK):** "I want my hand at position Y, what should my joint angles be?" (Hard).
    *   For humanoids, IK is computationally expensive because they have high Degrees of Freedom (DoF). We use solvers like **Pinocchio** or **KDL** within ROS 2.

---

## Part 2: The Cognitive Brain (Week 13)

Now that our robot can walk, let's give it a mind. We will build a **VLA (Vision-Language-Action)** pipeline.

### Step 1: Hearing (OpenAI Whisper)
We need to convert audio waves into text.

**Python Code: ROS 2 Whisper Node**
```python
import rclpy
from rclpy.node import Node
from std_msgs.msg import String
import whisper
import speech_recognition as sr

class WhisperNode(Node):
    def __init__(self):
        super().__init__('whisper_node')
        self.publisher_ = self.create_publisher(String, '/human/voice_command', 10)
        self.model = whisper.load_model("base")
        self.recognizer = sr.Recognizer()
        self.timer = self.create_timer(0.1, self.listen_and_transcribe)

    def listen_and_transcribe(self):
        with sr.Microphone() as source:
            # Listen for audio (blocking for simplicity)
            audio = self.recognizer.listen(source)
            try:
                # Save to temp file and transcribe
                with open("temp.wav", "wb") as f:
                    f.write(audio.get_wav_data())
                result = self.model.transcribe("temp.wav")
                text = result["text"]
                
                msg = String()
                msg.data = text
                self.publisher_.publish(msg)
                self.get_logger().info(f'Heard: "{text}"')
            except Exception as e:
                self.get_logger().error(f'Error: {e}')

def main():
    rclpy.init()
    node = WhisperNode()
    rclpy.spin(node)
    node.destroy_node()
    rclpy.shutdown()
```

### Step 2: Thinking (LLM Planning)
We feed the transcribed text into an LLM (like GPT-4o) along with a "System Prompt" that defines the robot's capabilities.

**System Prompt Example:**
```text
You are a robot assistant. You can perform the following actions:
1. navigate_to(location)
2. pick_up(object)
3. place(object, location)

User: "Put the apple in the trash."
Plan:
1. navigate_to("table")
2. pick_up("apple")
3. navigate_to("trash_can")
4. place("apple", "trash_can")
```

### Step 3: Acting (ROS 2 Action Client)
The LLM outputs a plan (e.g., JSON or a list). We parse this plan and execute it using ROS 2 Action Clients.

**Python Code: Action Client**
```python
from rclpy.action import ActionClient
from nav2_msgs.action import NavigateToPose

class RobotBrain(Node):
    def __init__(self):
        super().__init__('robot_brain')
        self._action_client = ActionClient(self, NavigateToPose, 'navigate_to_pose')

    def send_goal(self, x, y):
        goal_msg = NavigateToPose.Goal()
        goal_msg.pose.header.frame_id = 'map'
        goal_msg.pose.pose.position.x = x
        goal_msg.pose.pose.position.y = y
        
        self._action_client.wait_for_server()
        return self._action_client.send_goal_async(goal_msg)
```

## The Capstone: The Autonomous Humanoid
Combine everything!
1.  **Voice Command:** "Go to the kitchen."
2.  **Whisper:** Transcribes audio.
3.  **LLM:** Decides to call `navigate_to("kitchen")`.
4.  **Nav2:** Plans a path avoiding obstacles.
5.  **Locomotion:** The RL policy moves the legs to follow the path.

  </TabItem>
  <TabItem value="summary" label="Summary">

## Summary: Humanoid & VLA

**Goal:** A robot that walks like a human and thinks like an AI.

### Key Technologies
*   **Locomotion:** RL (PPO) is replacing ZMP for robust walking.
*   **Whisper:** Real-time, offline-capable speech recognition.
*   **LLMs:** The "Prefrontal Cortex" of the robot, enabling high-level planning.
*   **VLA Models:** The future—end-to-end models that go directly from pixels/text to motor torques (e.g., Google RT-2).

### The "Sim-to-Real" Challenge
Training these cognitive models requires massive data. We use **Isaac Sim** to generate synthetic "experiences" for the VLA models before deploying them to the real Unitree G1.

  </TabItem>
</Tabs>
