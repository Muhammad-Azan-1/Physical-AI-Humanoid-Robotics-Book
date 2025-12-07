import React from 'react';
import styles from './WhyHumanoidsSection.module.css';

import Link from '@docusaurus/Link';

interface FeatureCardProps {
  title: string;
  description: string;
  link: string;
}

function FeatureCard({ title, description, link }: FeatureCardProps) {
  return (
    <Link to={link} className={styles.featureCard}>
      <h3 className={styles.cardTitle}>{title}</h3>
      <p className={styles.cardDescription}>{description}</p>
    </Link>
  );
}

export default function WhyHumanoidsSection() {
  const features = [
    {
      title: 'From Digital to Physical',
      description: 'Humanoid robots excel in our human-centered world because they share our physical form and can be trained with abundant data from human environments.',
      link: '/docs/module1',
    },
    {
      title: 'Industry-Standard Tools',
      description: 'Master ROS 2, Gazebo, Unity, and NVIDIA Isaac—the same tools used by Tesla, Boston Dynamics, and leading robotics companies.',
      link: '/docs/module2',
    },
    {
      title: 'Embodied Intelligence',
      description: 'Go beyond digital AI. Build robots that understand physics, navigate real-world spaces, and interact naturally with humans.',
      link: '/docs/module3',
    },
    {
      title: 'Voice-to-Action Pipeline',
      description: 'Integrate GPT models with robotics. Convert natural language commands into robot actions using Vision-Language-Action (VLA) models.',
      link: '/docs/module4',
    },
  ];

  return (
    <section className={styles.whySection}>
      <div className={styles.container}>
        <span className={styles.sectionLabel}>Why Physical AI Matters</span>
        <h2 className={styles.sectionTitle}>
          The Future is Embodied
        </h2>
        <div className={styles.featuresGrid}>
          {features.map((feature, idx) => (
            <FeatureCard key={idx} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
