// IMPORTS

// React
import React from 'react';

// CSS
import styles from './index.module.css';

// Types
interface PageToolbarProps {
    className?: string;
    children: React.ReactNode;
}

// IMPLEMENTATIONS

export default function PageToolbar({ className = styles.toolbar, children }: PageToolbarProps) {
    return <div className={className}>{children}</div>;
}
