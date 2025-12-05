import React from 'react';
import styles from './ApproachesSection.module.css';

interface ApproachCardProps {
  badge: string;
  title: string;
  description: string;
  features: string[];
}

function ApproachCard({ badge, title, description, features }: ApproachCardProps) {
  return (
    <div className={styles.approachCard}>
      <span className={styles.badge}>{badge}</span>
      <h3 className={styles.cardTitle}>{title}</h3>
      <p className={styles.cardDescription}>{description}</p>
      <ul className={styles.featureList}>
        {features.map((feature, idx) => (
          <li key={idx}>{feature}</li>
        ))}
      </ul>
    </div>
  );
}

export default function ApproachesSection() {
  const approaches = [
    {
      badge: 'Foundation',
      title: 'Simulation-to-Reality',
      description: 'Develop and test robotic behaviors in high-fidelity simulations before deploying to physical hardware.',
      features: [
        'NVIDIA Isaac Sim integration',
        'Domain randomization techniques',
        'Sim-to-real transfer learning',
      ],
    },
    {
      badge: 'Core',
      title: 'ROS 2 Architecture',
      description: 'Build robust robotic systems using the industry-standard Robot Operating System 2 framework.',
      features: [
        'Node-based communication',
        'Real-time control systems',
        'Sensor fusion pipelines',
      ],
    },
    {
      badge: 'Advanced',
      title: 'AI-Powered Control',
      description: 'Leverage reinforcement learning and foundation models to create adaptive, intelligent robot behaviors.',
      features: [
        'Reinforcement learning policies',
        'Vision-language models',
        'Imitation learning from demos',
      ],
    },
  ];

  return (
    <section className={styles.approachesSection}>
      <div className={styles.container}>
        <span className={styles.sectionLabel}>The Robotics Spectrum</span>
        <h2 className={styles.sectionTitle}>
          Three Pillars of Physical AI Development
        </h2>
        <p className={styles.sectionDescription}>
          This book teaches you the complete stack — from simulation environments to deployed humanoid systems.
        </p>
        <div className={styles.approachesGrid}>
          {approaches.map((approach, idx) => (
            <ApproachCard key={idx} {...approach} />
          ))}
        </div>
      </div>
    </section>
  );
}
