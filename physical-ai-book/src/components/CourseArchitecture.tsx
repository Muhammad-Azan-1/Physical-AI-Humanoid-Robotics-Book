import React from 'react';
import styles from './CourseArchitecture.module.css';

interface LayerProps {
    layer: string;
    title: string;
    items: string[];
}

function ArchitectureLayer({ layer, title, items }: LayerProps) {
    return (
        <div className={styles.layerCard}>
            <div className={styles.layerHeader}>
                <span className={styles.layerLabel}>{layer}</span>
                <h3 className={styles.layerTitle}>{title}</h3>
            </div>
            <ul className={styles.layerItems}>
                {items.map((item, idx) => (
                    <li key={idx} className={styles.layerItem}>
                        <span className={styles.checkIcon}>✓</span>
                        {item}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default function CourseArchitecture() {
    const layers = [
        {
            layer: 'Layer 1',
            title: 'The Robotic Nervous System',
            items: [
                'ROS 2: Nodes, Topics, Services, Actions',
                'URDF: Robot description and kinematics',
                'rclpy: Python-to-robot control bridge',
            ],
        },
        {
            layer: 'Layer 2',
            title: 'The Digital Twin',
            items: [
                'Gazebo: Physics simulation (gravity, collisions)',
                'Unity: High-fidelity rendering and HRI',
                'Sensor simulation: LiDAR, Depth Cameras, IMUs',
            ],
        },
        {
            layer: 'Layer 3',
            title: 'The AI-Robot Brain',
            items: [
                'NVIDIA Isaac Sim: Photorealistic training environments',
                'Isaac ROS: Hardware-accelerated VSLAM & navigation',
                'Nav2: Path planning for bipedal locomotion',
            ],
        },
        {
            layer: 'Layer 4',
            title: 'Vision-Language-Action (VLA)',
            items: [
                'OpenAI Whisper: Voice command recognition',
                'LLM Planning: Natural language to ROS 2 actions',
                'Cognitive Control: "Clean the room" → autonomous execution',
            ],
        },
    ];

    return (
        <section className={styles.architectureSection}>
            <div className={styles.container}>
                <span className={styles.sectionLabel}>System Overview</span>
                <h2 className={styles.sectionTitle}>The Complete Physical AI Stack</h2>
                <div className={styles.layersGrid}>
                    {layers.map((layer, idx) => (
                        <ArchitectureLayer key={idx} {...layer} />
                    ))}
                </div>
            </div>
        </section>
    );
}
