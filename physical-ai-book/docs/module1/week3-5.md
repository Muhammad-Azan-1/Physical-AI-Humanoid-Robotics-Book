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
