// IMPORTS

// Misc
import classNames from 'classnames';

// CSS
import styles from './index.module.css';

// Types
import type { ReactNode } from 'react';

interface EnhancedSelectInputSelectedValueProps {
    className?: string;
    children: ReactNode;
    isDisabled?: boolean;
}

// IMPLEMENTATIONS

export default function EnhancedSelectInputSelectedValue({
    className = styles.selectedValue,
    children,
    isDisabled = false,
}: EnhancedSelectInputSelectedValueProps) {
    return <div className={classNames(className, isDisabled && styles.isDisabled)}>{children}</div>;
}
