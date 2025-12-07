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
</Tabs>