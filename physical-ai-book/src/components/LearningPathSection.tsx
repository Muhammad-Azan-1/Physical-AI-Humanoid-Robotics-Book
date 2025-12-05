import React from 'react';
import styles from './LearningPathSection.module.css';

interface StepProps {
  number: number;
  title: string;
  description: string;
  phase: string;
  weeks: string;
}

function TimelineStep({ number, title, description, phase, weeks }: StepProps) {
  return (
    <div className={styles.step}>
      <div className={styles.stepNumber}>{number}</div>
      <div className={styles.phaseLabel}>{phase} ({weeks})</div>
      <h3 className={styles.stepTitle}>{title}</h3>
      <ul className={styles.stepList}>
        {description.split('; ').map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export default function LearningPathSection() {
  const steps = [
    {
      number: 1,
      phase: 'Phase 1',
      weeks: 'Weeks 1-2',
      title: 'Foundation',
      description: 'Physical AI principles; Embodied intelligence concepts; Humanoid robotics landscape',
    },
    {
      number: 2,
      phase: 'Phase 2',
      weeks: 'Weeks 3-5',
      title: 'The Nervous System',
      description: 'ROS 2 architecture; Robot packages; Python control bridges',
    },
    {
      number: 3,
      phase: 'Phase 3',
      weeks: 'Weeks 6-7',
      title: 'Digital Twin',
      description: 'Gazebo physics; Unity rendering; Sensor simulation',
    },
    {
      number: 4,
      phase: 'Phase 4',
      weeks: 'Weeks 8-10',
      title: 'Advanced AI',
      description: 'NVIDIA Isaac platform; Synthetic data training; VSLAM & navigation',
    },
    {
      number: 5,
      phase: 'Phase 5',
      weeks: 'Weeks 11-12',
      title: 'Humanoid Intelligence',
      description: 'Bipedal locomotion; Balance control; Human-robot interaction',
    },
    {
      number: 6,
      phase: 'Phase 6',
      weeks: 'Week 13',
      title: 'Conversational Robotics',
      description: 'GPT integration; Voice command pipeline; Autonomous deployment',
    },
  ];

  return (
    <section className={styles.learningSection}>
      <div className={styles.container}>
        <span className={styles.sectionLabel}>Your Journey</span>
        <h2 className={styles.sectionTitle}>
          From Simulation to Reality
        </h2>
        <div className={styles.timeline}>
          <div className={styles.timelineLine}></div>
          {steps.map((step) => (
            <TimelineStep key={step.number} {...step} />
          ))}
        </div>
      </div>
    </section>
  );
}
