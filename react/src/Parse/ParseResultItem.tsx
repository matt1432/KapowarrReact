// IMPORTS

// CSS
import styles from './ParseResultItem.module.css';

// Types
import type { ReactNode } from 'react';

interface ParseResultItemProps {
    title: string;
    data: string | number | ReactNode;
}

// IMPLEMENTATIONS

function ParseResultItem({ title, data }: ParseResultItemProps) {
    return (
        <div className={styles.item}>
            <div className={styles.title}>{title}</div>
            <div>{data}</div>
        </div>
    );
}

export default ParseResultItem;
