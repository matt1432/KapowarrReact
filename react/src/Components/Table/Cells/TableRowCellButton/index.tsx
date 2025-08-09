// IMPORTS

// General Components
import Link, { type LinkProps } from 'Components/Link/Link';

// Specific Components
import TableRowCell from '../TableRowCell';

// CSS
import styles from './index.module.css';

// Types
import type { ReactNode } from 'react';

interface TableRowCellButtonProps extends LinkProps {
    className?: string;
    children: ReactNode;
}

// IMPLEMENTATIONS

function TableRowCellButton({ className = styles.cell, ...otherProps }: TableRowCellButtonProps) {
    return <Link className={className} component={TableRowCell} {...otherProps} />;
}

export default TableRowCellButton;
