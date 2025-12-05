import React from 'react';
import styles from './HardwareRequirements.module.css';

interface TierProps {
    title: string;
    price: string;
    items: string[];
    perfectFor: string[];
    isPopular?: boolean;
}

function HardwareTier({ title, price, items, perfectFor, isPopular }: TierProps) {
    return (
        <div className={`${styles.tierCard} ${isPopular ? styles.popularTier : ''}`}>
            {isPopular && <span className={styles.popularBadge}>Most Popular</span>}
            <h3 className={styles.tierTitle}>{title}</h3>
            <div className={styles.tierPrice}>{price}</div>

            <div className={styles.tierSection}>
                <h4 className={styles.sectionHeader}>What you get:</h4>
                <ul className={styles.itemList}>
                    {items.map((item, idx) => (
                        <li key={idx}>{item}</li>
                    ))}
                </ul>
            </div>

            <div className={styles.tierSection}>
                <h4 className={styles.sectionHeader}>Perfect for:</h4>
                <ul className={styles.checkList}>
                    {perfectFor.map((item, idx) => (
                        <li key={idx}>{item}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default function HardwareRequirements() {
    const tiers = [
        {
            title: 'The Digital Twin Lab',
            price: '$700',
            items: [
                'NVIDIA Jetson Orin Nano Super (8GB) - $249',
                'Intel RealSense D435i (with IMU) - $349',
                'ReSpeaker USB Mic Array - $69',
                'Accessories (SD card, cables) - $30',
            ],
            perfectFor: [
                'Learning ROS 2 and Isaac fundamentals',
                'Computer vision and SLAM projects',
                'Voice-to-action development',
                'Sim-to-real deployment basics',
            ],
        },
        {
            title: 'The Cloud Workstation',
            price: '$205/quarter + Edge Kit',
            isPopular: true,
            items: [
                'AWS g5.2xlarge instance (NVIDIA A10G GPU)',
                'NVIDIA Isaac Sim on Omniverse Cloud',
                'Local Jetson kit for deployment ($700)',
                '120 hours cloud compute time',
            ],
            perfectFor: [
                'Students without RTX workstations',
                'Rapid prototyping and training',
                'Photorealistic Isaac Sim simulations',
                'Cloud-to-edge deployment pipeline',
            ],
        },
        {
            title: 'The Premium Lab',
            price: '$3,500-$5,000',
            items: [
                'RTX 4080 Workstation with Ubuntu 22.04',
                '64GB RAM for complex simulations',
                'NVIDIA Jetson Orin NX (16GB)',
                'Intel RealSense + LiDAR sensors',
                'Unitree Go2 quadruped ($1,800-$3,000)',
            ],
            perfectFor: [
                'Full-stack Physical AI development',
                'Training large VLA models locally',
                'Real robot hardware integration',
                'Professional research projects',
            ],
        },
    ];

    return (
        <section className={styles.hardwareSection}>
            <div className={styles.container}>
                <span className={styles.sectionLabel}>Hardware Requirements</span>
                <h2 className={styles.sectionTitle}>Choose Your Physical AI Setup</h2>
                <p className={styles.sectionNote}>
                    Note: RTX GPU required for NVIDIA Isaac Sim. Standard laptops will not work.
                </p>
                <div className={styles.tiersGrid}>
                    {tiers.map((tier, idx) => (
                        <HardwareTier key={idx} {...tier} />
                    ))}
                </div>
            </div>
        </section>
    );
}
