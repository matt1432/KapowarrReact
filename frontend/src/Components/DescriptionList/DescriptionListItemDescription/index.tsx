// IMPORTS

// CSS
import styles from './index.module.css';

// Types
import type { ReactNode } from 'react';

export interface DescriptionListItemDescriptionProps {
    className?: string;
    children?: ReactNode;
}

// IMPLEMENTATIONS

export default function DescriptionListItemDescription({
    className = styles.description,
    children,
}: DescriptionListItemDescriptionProps) {
    return <dd className={className}>{children}</dd>;
}
