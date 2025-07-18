// IMPORTS

// React
import React from 'react';

// CSS
import styles from './DescriptionList.module.css';

// IMPLEMENTATIONS

interface DescriptionListProps {
    className?: string;
    children?: React.ReactNode;
}

function DescriptionList(props: DescriptionListProps) {
    const { className = styles.descriptionList, children } = props;

    return <dl className={className}>{children}</dl>;
}

export default DescriptionList;
