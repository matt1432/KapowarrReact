// IMPORTS

// React
import React from 'react';

// Redux

// Misc
import classNames from 'classnames';

// General Components
import Link, { type LinkProps } from 'Components/Link/Link';

// Specific Components

// CSS
import styles from './index.module.css';

// Types
export interface MenuItemProps extends LinkProps {
    className?: string;
    children: React.ReactNode;
    isDisabled?: boolean;
}

// IMPLEMENTATIONS

export default function MenuItem({
    className = styles.menuItem,
    children,
    isDisabled = false,
    ...otherProps
}: MenuItemProps) {
    return (
        <Link
            className={classNames(className, isDisabled && styles.isDisabled)}
            isDisabled={isDisabled}
            {...otherProps}
        >
            {children}
        </Link>
    );
}
