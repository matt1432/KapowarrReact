// IMPORTS

// React
import React from 'react';

// Misc
import classNames from 'classnames';

// General Components
import Link from 'Components/Link/Link';

// CSS
import styles from './MenuButton.module.css';

// Types
export interface MenuButtonProps {
    className?: string;
    children: React.ReactNode;
    isDisabled?: boolean;
    onPress?: () => void;
}

// IMPLEMENTATIONS

function MenuButton({
    className = styles.menuButton,
    children,
    isDisabled = false,
    ...otherProps
}: MenuButtonProps) {
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

export default MenuButton;
