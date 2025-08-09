// IMPORTS

// React
import React from 'react';

// Misc
import classNames from 'classnames';

// CSS
import styles from './index.module.css';

// Types
import type { Kind } from 'Helpers/Props/kinds';

interface AlertProps {
    className?: string;
    kind?: Extract<Kind, keyof typeof styles>;
    children: React.ReactNode;
}

// IMPLEMENTATIONS

function Alert({ className = styles.alert, kind = 'info', children }: AlertProps) {
    return <div className={classNames(className, styles[kind])}>{children}</div>;
}

export default Alert;
