// IMPORTS

// CSS
import styles from './index.module.css';

// Types
import type { ReactNode } from 'react';

export interface DescriptionListItemTitleProps {
    className?: string;
    children?: ReactNode;
}

// IMPLEMENTATIONS

export default function DescriptionListItemTitle({
    className = styles.title,
    children,
}: DescriptionListItemTitleProps) {
    return <dt className={className}>{children}</dt>;
}
