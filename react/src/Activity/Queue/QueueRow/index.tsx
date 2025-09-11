// TODO:
// IMPORTS

// React

// Redux

// Misc
import formatBytes from 'Utilities/Number/formatBytes';

// Hooks

// General Components
import TableRow from 'Components/Table/TableRow';
import TableRowCell from 'Components/Table/Cells/TableRowCell';

// Specific Components

// CSS
import styles from './index.module.css';

// Types
import type { QueueColumn } from '..';
import type { Column } from 'Components/Table/Column';

type QueueRowProps = QueueColumn & {
    columns: Column<keyof QueueColumn>[];
};

// IMPLEMENTATIONS

export default function QueueRow({
    columns,
    priority,
    status,
    title,
    sourceName,
    size,
    speed,
    progress,
}: QueueRowProps) {
    return (
        <TableRow>
            {columns.map(({ name, isVisible }) => {
                if (!isVisible) {
                    return null;
                }

                if (name === 'priority') {
                    return <TableRowCell className={styles[name]}>{priority}</TableRowCell>;
                }

                if (name === 'status') {
                    return <TableRowCell className={styles[name]}>{status}</TableRowCell>;
                }

                if (name === 'title') {
                    return <TableRowCell className={styles[name]}>{title}</TableRowCell>;
                }

                if (name === 'sourceName') {
                    return <TableRowCell className={styles[name]}>{sourceName}</TableRowCell>;
                }

                if (name === 'size') {
                    return (
                        <TableRowCell className={styles[name]}>{formatBytes(size)}</TableRowCell>
                    );
                }

                if (name === 'speed') {
                    return (
                        <TableRowCell className={styles[name]}>{formatBytes(speed)}/s</TableRowCell>
                    );
                }

                if (name === 'progress') {
                    return <TableRowCell className={styles[name]}>{progress}%</TableRowCell>;
                }

                if (name === 'actions') {
                    return <TableRowCell className={styles[name]}></TableRowCell>;
                }
            })}
        </TableRow>
    );
}
