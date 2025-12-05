import React from 'react';
import styles from './CapstoneChallenge.module.css';

export default function CapstoneChallenge() {
    return (
        <section className={styles.capstoneSection}>
            <div className={styles.container}>
                <div className={styles.contentWrapper}>
                    <span className={styles.sectionLabel}>Final Project</span>
                    <h2 className={styles.sectionTitle}>Build Your Autonomous Humanoid Assistant</h2>

                    <div className={styles.challengeGrid}>
                        <div className={styles.requirementsCol}>
                            <h3 className={styles.colTitle}>Project Requirements</h3>
                            <ul className={styles.requirementsList}>
                                <li>✅ Accept natural language voice commands</li>
                                <li>✅ Use LLM to plan a sequence of actions</li>
                                <li>✅ Navigate through obstacles using Nav2</li>
                                <li>✅ Identify objects using computer vision</li>
                                <li>✅ Manipulate objects with humanoid hands</li>
                                <li>✅ Provide verbal feedback on task completion</li>
                            </ul>
                        </div>

                        <div className={styles.exampleCol}>
                            <h3 className={styles.colTitle}>Example Interaction</h3>
                            <div className={styles.interactionCard}>
                                <div className={styles.userMessage}>
                                    <span className={styles.speakerLabel}>Human:</span>
                                    "Clean up the room and put the book on the shelf"
                                </div>
                                <div className={styles.robotResponse}>
                                    <span className={styles.speakerLabel}>Robot Actions:</span>
                                    <ol>
                                        <li>Parse command with GPT-4</li>
                                        <li>Plan navigation path to book</li>
                                        <li>Avoid obstacles using VSLAM</li>
                                        <li>Detect book with computer vision</li>
                                        <li>Grasp book with humanoid hand</li>
                                        <li>Navigate to shelf</li>
                                        <li>Place book on shelf</li>
                                        <li>Respond: "Task completed successfully"</li>
                                    </ol>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
