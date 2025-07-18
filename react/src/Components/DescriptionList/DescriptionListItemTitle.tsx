// IMPORTS

// CSS
import styles from './DescriptionListItemTitle.module.css';

// Types
import type { ReactNode } from 'react';

export interface DescriptionListItemTitleProps {
    className?: string;
    children?: ReactNode;
}

// IMPLEMENTATIONS

function DescriptionListItemTitle(props: DescriptionListItemTitleProps) {
    const { className = styles.title, children } = props;

    return <dt className={className}>{children}</dt>;
}

export default DescriptionListItemTitle;
