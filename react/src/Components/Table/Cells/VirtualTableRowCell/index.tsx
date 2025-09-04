// IMPORTS

// React
import React from 'react';

// CSS
import styles from './index.module.css';

// Types
export interface VirtualTableRowCellProps {
    className?: string;
    children?: string | React.ReactNode;
}

// IMPLEMENTATIONS

export default function VirtualTableRowCell({
    className = styles.cell,
    children,
}: VirtualTableRowCellProps) {
    return <div className={className}>{children}</div>;
}
