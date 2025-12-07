import React from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './HeroSection.module.css';

export default function HeroSection() {
  const { siteConfig } = useDocusaurusContext();

  return (
    <header className={styles.heroSection}>
      <div className={styles.heroContent}>
        <div className={styles.badgeRow}>
          <span className={styles.heroBadge}>Physical AI &amp; Humanoid Robotics</span>
        </div>
        <h1 className={styles.heroTitle}>
          Physical AI &amp; Humanoid Robotics
        </h1>
        <p className={styles.heroTagline}>
          AI Systems in the Physical World. Embodied Intelligence.
        </p>
        <p className={styles.heroSubtitle}>
          Bridging the gap between the digital brain and the physical body. Master ROS 2, NVIDIA Isaac, and Vision-Language-Action models to build autonomous humanoid robots.
        </p>
        <div className={styles.featureBadges}>
          <span>🤖 Embodied AI</span>
          <span>🎮 Isaac Sim</span>
          <span>🗣️ Voice-to-Action</span>
          <span>🚀 13 Weeks</span>
        </div>
        <div className={styles.heroButtons}>
          <Link
            className={styles.buttonPrimary}
            to="/docs/intro">
            Start Learning →
          </Link>
          <Link
            className={styles.buttonSecondary}
            to="/docs/module1">
            Explore Modules
          </Link>
        </div>
      </div>
    </header>
  );
}
