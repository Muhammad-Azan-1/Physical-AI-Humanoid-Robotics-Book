import React from 'react';
import styles from './Assessments.module.css';

interface AssessmentProps {
    title: string;
    module: string;
    weight: string;
    items: string[];
}

function AssessmentCard({ title, module, weight, items }: AssessmentProps) {
    return (
        <div className={styles.assessmentCard}>
            <div className={styles.cardHeader}>
                <span className={styles.moduleLabel}>{module}</span>
                <span className={styles.weightLabel}>{weight}</span>
            </div>
            <h3 className={styles.cardTitle}>{title}</h3>
            <ul className={styles.assessmentItems}>
                {items.map((item, idx) => (
                    <li key={idx}>{item}</li>
                ))}
            </ul>
        </div>
    );
}

export default function Assessments() {
    const assessments = [
        {
            title: 'ROS 2 Package Development',
            module: 'Module 1',
            weight: '20%',
            items: [
                'Build a complete ROS 2 package',
                'Implement nodes, topics, and services',
                'Connect Python agents to robot controllers',
            ],
        },
        {
            title: 'Gazebo Simulation Implementation',
            module: 'Module 2',
            weight: '20%',
            items: [
                'Create physics-accurate robot simulation',
                'Implement sensor simulation (LiDAR, cameras)',
                'Design interactive environments',
            ],
        },
        {
            title: 'Isaac-Based Perception Pipeline',
            module: 'Module 3',
            weight: '25%',
            items: [
                'Deploy NVIDIA Isaac platform',
                'Implement VSLAM and navigation',
                'Train AI perception models',
            ],
        },
        {
            title: 'The Autonomous Humanoid',
            module: 'Capstone',
            weight: '35%',
            items: [
                'Voice commands via Whisper',
                'LLM cognitive control planning',
                'Nav2 navigation & object manipulation',
            ],
        },
    ];

    return (
        <section className={styles.assessmentsSection}>
            <div className={styles.container}>
                <span className={styles.sectionLabel}>Evaluation</span>
                <h2 className={styles.sectionTitle}>Demonstrate Your Physical AI Mastery</h2>
                <div className={styles.assessmentsGrid}>
                    {assessments.map((assessment, idx) => (
                        <AssessmentCard key={idx} {...assessment} />
                    ))}
                </div>
            </div>
        </section>
    );
}
