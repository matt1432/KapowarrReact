// IMPORTS

// React
import React from 'react';

// CSS
import styles from './index.module.css';

// IMPLEMENTATIONS

interface DescriptionListProps {
    className?: string;
    children?: React.ReactNode;
}

function DescriptionList({ className = styles.descriptionList, children }: DescriptionListProps) {
    return <dl className={className}>{children}</dl>;
}

export default DescriptionList;
