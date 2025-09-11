// TODO:
// IMPORTS

// React
import { useCallback } from 'react';

// Misc
import { icons } from 'Helpers/Props';

import formatBytes from 'Utilities/Number/formatBytes';

// General Components
import IconButton from 'Components/Link/IconButton';
import TableRow from 'Components/Table/TableRow';
import TableRowCell from 'Components/Table/Cells/TableRowCell';

// CSS
import styles from './index.module.css';

// Types
import type { QueueColumn } from '..';
import type { Column } from 'Components/Table/Column';
import type { DeleteQueueItemParams } from 'Store/Api/Queue';

type QueueRowProps = QueueColumn & {
    columns: Column<keyof QueueColumn>[];
    onDeletePress: (props: DeleteQueueItemParams) => void;
};

// IMPLEMENTATIONS

export default function QueueRow({
    id,
    columns,
    onDeletePress,
    priority,
    status,
    title,
    sourceName,
    size,
    speed,
    progress,
}: QueueRowProps) {
    const handleDeletePress = useCallback(() => {
        onDeletePress({ id });
    }, [onDeletePress, id]);

    const handleBlocklistPress = useCallback(() => {
        onDeletePress({ id, blocklist: true });
    }, [onDeletePress, id]);

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
                    return (
                        <TableRowCell className={styles[name]}>
                            <IconButton name={icons.DELETE} onPress={handleDeletePress} />
                            <IconButton name={icons.BLOCK} onPress={handleBlocklistPress} />
                        </TableRowCell>
                    );
                }
            })}
        </TableRow>
    );
}
