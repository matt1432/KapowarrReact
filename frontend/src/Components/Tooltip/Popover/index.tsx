// IMPORTS

// React
import React from 'react';

// General Components
import Tooltip, { type TooltipProps } from '../Tooltip';

// CSS
import styles from './index.module.css';

// Types
interface PopoverProps extends Omit<TooltipProps, 'tooltip' | 'bodyClassName'> {
    title: string;
    body: React.ReactNode;
}

// IMPLEMENTATIONS

export default function Popover({ title, body, ...otherProps }: PopoverProps) {
    return (
        <Tooltip
            {...otherProps}
            bodyClassName={styles.tooltipBody}
            tooltip={
                <div>
                    <div className={styles.title}>{title}</div>

                    <div className={styles.body}>{body}</div>
                </div>
            }
        />
    );
}
