// IMPORTS

// React
import React from 'react';

// CSS
import styles from './index.module.css';

// Types
interface PageContentFooterProps {
    className?: string;
    children: React.ReactNode;
}

// IMPLEMENTATIONS

export default function PageContentFooter({
    className = styles.contentFooter,
    children,
}: PageContentFooterProps) {
    return <div className={className}>{children}</div>;
}
