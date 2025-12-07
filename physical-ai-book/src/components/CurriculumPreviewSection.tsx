import React from 'react';
import Link from '@docusaurus/Link';
import styles from './CurriculumPreviewSection.module.css';

interface ModuleCardProps {
  number: number;
  title: string;
  description: string;
  link: string;
  duration: string;
  icon: string;
  topics: string[];
}

function ModuleCard({ number, title, description, link, duration, icon, topics }: ModuleCardProps) {
  return (
    <Link to={link} className={styles.moduleCard}>
      <div className={styles.moduleHeader}>
        <span className={styles.moduleNumber}>Module {number}</span>
        <span className={styles.weeksBadge}>{duration}</span>
      </div>
      <div className={styles.titleWrapper}>
        <span className={styles.moduleIcon}>{icon}</span>
        <h3 className={styles.moduleTitle}>{title}</h3>
      </div>
      <p className={styles.moduleDescription}>{description}</p>
      <ul className={styles.topicsList}>
        {topics.slice(0, 3).map((topic, idx) => (
          <li key={idx}>{topic}</li>
        ))}
      </ul>
      <div className={styles.moduleLink}>
        Explore Module →
      </div>
    </Link>
  );
}

export default function CurriculumPreviewSection() {
  const modules = [
    {
      number: 1,
      title: 'The Robotic Nervous System',
      description: 'ROS 2 Fundamentals & Physical AI Foundations',
      link: '/docs/module1',
      duration: '5 Weeks',
      icon: '🧠',
      topics: [
        'Introduction to Physical AI',
        'ROS 2 architecture: nodes, topics',
        'URDF for humanoid robot description',
      ],
    },
    {
      number: 2,
      title: 'The Digital Twin',
      description: 'Simulation & Environment Building',
      link: '/docs/module2',
      duration: '2 Weeks',
      icon: '🎮',
      topics: [
        'Gazebo simulation setup',
        'Physics simulation: gravity, friction',
        'Unity for robot visualization',
      ],
    },
    {
      number: 3,
      title: 'The AI-Robot Brain',
      description: 'NVIDIA Isaac Platform & Advanced Perception',
      link: '/docs/module3',
      duration: '3 Weeks',
      icon: '🚀',
      topics: [
        'NVIDIA Isaac SDK and Isaac Sim',
        'Hardware-accelerated VSLAM',
        'Reinforcement learning for control',
      ],
    },
    {
      number: 4,
      title: 'Vision-Language-Action (VLA)',
      description: 'LLMs, Whisper, and Cognitive Robotics',
      link: '/docs/module4',
      duration: '3 Weeks',
      icon: '🗣️',
      topics: [
        'Voice-to-Action: Whisper integration',
        'Cognitive planning with LLMs',
        'Natural language to ROS 2 actions',
      ],
    },
  ];

  return (
    <section className={styles.curriculumSection}>
      <div className={styles.container}>
        <span className={styles.sectionLabel}>Course Modules</span>
        <h2 className={styles.sectionTitle}>
          13-Week Program Structure
        </h2>
        <div className={styles.modulesGrid}>
          {modules.map((module) => (
            <ModuleCard key={module.number} {...module} />
          ))}
        </div>
      </div>
    </section>
  );
}
