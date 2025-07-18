// IMPORTS

// React
import React from 'react';

// CSS
import styles from './TableRow.module.css';

// Types
interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
    className?: string;
    children?: React.ReactNode;
    overlayContent?: boolean;
}

// IMPLEMENTATIONS

function TableRow({ className = styles.row, children, ...otherProps }: TableRowProps) {
    return (
        <tr className={className} {...otherProps}>
            {children}
        </tr>
    );
}

export default TableRow;
