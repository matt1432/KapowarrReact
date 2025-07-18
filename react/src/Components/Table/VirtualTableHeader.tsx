// IMPORTS

// React
import React from 'react';

// CSS
import styles from './VirtualTableHeader.module.css';

// Types
interface VirtualTableHeaderProps {
    children?: React.ReactNode;
}

// IMPLEMENTATIONS

function VirtualTableHeader({ children }: VirtualTableHeaderProps) {
    return <div className={styles.header}>{children}</div>;
}

export default VirtualTableHeader;
