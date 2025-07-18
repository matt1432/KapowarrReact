// IMPORTS

// React
import React from 'react';

// CSS
import styles from './PageContentFooter.module.css';

// Types
interface PageContentFooterProps {
    className?: string;
    children: React.ReactNode;
}

// IMPLEMENTATIONS

function PageContentFooter({ className = styles.contentFooter, children }: PageContentFooterProps) {
    return <div className={className}>{children}</div>;
}

export default PageContentFooter;
