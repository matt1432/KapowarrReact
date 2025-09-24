// IMPORTS

// CSS
import styles from './index.module.css';

// Types
import type { ComponentPropsWithoutRef } from 'react';
export type TableRowCellProps = ComponentPropsWithoutRef<'td'>;

// IMPLEMENTATIONS

export default function TableRowCell({
    className = styles.cell,
    ...tdProps
}: TableRowCellProps) {
    return <td className={className} {...tdProps} />;
}
