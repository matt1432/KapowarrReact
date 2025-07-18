// IMPORTS

// React
import React from 'react';

// CSS
import styles from './VirtualTableRowCell.module.css';

// Types
export interface VirtualTableRowCellProps {
    className?: string;
    children?: string | React.ReactNode;
}

// IMPLEMENTATIONS

function VirtualTableRowCell({ className = styles.cell, children }: VirtualTableRowCellProps) {
    return <div className={className}>{children}</div>;
}

export default VirtualTableRowCell;
