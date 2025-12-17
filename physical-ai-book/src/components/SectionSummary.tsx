import React, { useState } from 'react';
import clsx from 'clsx';

interface SectionSummaryProps {
    children: React.ReactNode;
}

export default function SectionSummary({ children }: SectionSummaryProps): React.ReactElement {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="margin-bottom--md">
            <button
                className={clsx('button button--secondary button--sm')}
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
            >
                {isOpen ? 'Hide Summary' : 'Show Summary'}
            </button>
            {isOpen && (
                <div className="alert alert--secondary margin-top--sm">
                    {children}
                </div>
            )}
        </div>
    );
}
