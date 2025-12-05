import React from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

import HeroSection from '@site/src/components/HeroSection';
import WhyHumanoidsSection from '@site/src/components/WhyHumanoidsSection';
import CourseArchitecture from '@site/src/components/CourseArchitecture';
import CurriculumPreviewSection from '@site/src/components/CurriculumPreviewSection';
import LearningPathSection from '@site/src/components/LearningPathSection';
import HardwareRequirements from '@site/src/components/HardwareRequirements';
import Assessments from '@site/src/components/Assessments';
import CapstoneChallenge from '@site/src/components/CapstoneChallenge';
import StartJourneySection from '@site/src/components/StartJourneySection';

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title="Physical AI & Humanoid Robotics"
      description="Master the art of building intelligent humanoid robots — from simulation to real-world deployment using ROS 2, Isaac Sim, and cutting-edge AI.">
      <main>
        <HeroSection />
        <WhyHumanoidsSection />
        <CourseArchitecture />
        <CurriculumPreviewSection />
        <LearningPathSection />
        <HardwareRequirements />
        <Assessments />
        <CapstoneChallenge />
        <StartJourneySection />
      </main>
    </Layout>
  );
}
