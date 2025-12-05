import React from 'react';
import Link from '@docusaurus/Link';
import styles from './StartJourneySection.module.css';

export default function StartJourneySection() {
  return (
    <section className={styles.ctaSection}>
      <div className={styles.container}>
        <h2 className={styles.ctaTitle}>
          Master Physical AI. Build Autonomous Humanoids.
        </h2>
        <p className={styles.ctaSubtitle}>
          Join the next generation of robotics engineers building the future of embodied intelligence.
        </p>
        <p className={styles.ctaDescription}>
          This course sits at the intersection of AI, robotics, and cognitive science. You'll gain hands-on experience with industry-standard tools: ROS 2, NVIDIA Isaac, Gazebo, Unity, and Vision-Language-Action models.
        </p>
        <div className={styles.ctaButtons}>
          <Link
            className={styles.buttonPrimary}
            to="/docs/intro">
            Start Your Journey →
          </Link>
          <Link
            className={styles.buttonSecondary}
            to="/docs/intro">
            Download Syllabus
          </Link>
        </div>


      </div>
    </section>
  );
}
