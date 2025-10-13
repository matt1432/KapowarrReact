// IMPORTS

// React
import { useCallback } from 'react';

// Misc
import { icons } from 'Helpers/Props';

import formatBytes from 'Utilities/Number/formatBytes';
import translate from 'Utilities/String/translate';

// General Components
import IconButton from 'Components/Link/IconButton';
import ProgressBar from 'Components/ProgressBar';
import TableRow from 'Components/Table/TableRow';
import TableRowCell from 'Components/Table/Cells/TableRowCell';

import VolumeTitleLink from 'Volume/VolumeTitleLink';

// Specific Components
import QueueStatus from '../QueueStatus';
import TimeLeftCell from '../TimeLeftCell';

// CSS
import styles from './index.module.css';

// Types
import type { Column } from 'Components/Table/Column';
import type { DeleteQueueItemParams } from 'Store/Api/Queue';
import type { QueueColumn } from '..';
import type { QueueColumnName } from '../columns';

type QueueRowProps = QueueColumn & {
    columns: Column<QueueColumnName>[];
    queueLength: number;
    onDeletePress: (props: DeleteQueueItemParams) => void;
    onMoveQueueItem: (params: { id: number; index: number }) => void;
};

// IMPLEMENTATIONS

export default function QueueRow({
    id,
    volumeId,
    columns,
    queueLength,
    onDeletePress,
    onMoveQueueItem,
    priority,
    status,
    title,
    sourceName,
    size,
    sizeLeft,
    timeLeft,
    speed,
    progress,
}: QueueRowProps) {
    const handleDeletePress = useCallback(() => {
        onDeletePress({ id });
    }, [onDeletePress, id]);

    const handleBlocklistPress = useCallback(() => {
        onDeletePress({ id, blocklist: true });
    }, [onDeletePress, id]);

    const handleMoveUpQueue = useCallback(() => {
        onMoveQueueItem({ id, index: priority - 1 });
    }, [id, onMoveQueueItem, priority]);

    const handleMoveDownQueue = useCallback(() => {
        onMoveQueueItem({ id, index: priority + 1 });
    }, [id, onMoveQueueItem, priority]);

    return (
        <TableRow>
            {columns.map(({ name, isVisible }) => {
                if (!isVisible) {
                    return null;
                }

                if (name === 'priority') {
                    return (
                        <TableRowCell key={name} className={styles[name]}>
                            {priority}
                        </TableRowCell>
                    );
                }

                if (name === 'status') {
                    return (
                        <TableRowCell key={name} className={styles[name]}>
                            <QueueStatus
                                sourceTitle={title}
                                status={status}
                                position="right"
                            />
                        </TableRowCell>
                    );
                }

                if (name === 'title') {
                    return (
                        <TableRowCell key={name} className={styles[name]}>
                            <VolumeTitleLink
                                title={title}
                                titleSlug={volumeId.toString()}
                            />
                        </TableRowCell>
                    );
                }

                if (name === 'sourceName') {
                    return (
                        <TableRowCell key={name} className={styles[name]}>
                            {sourceName}
                        </TableRowCell>
                    );
                }

                if (name === 'size') {
                    return (
                        <TableRowCell key={name} className={styles[name]}>
                            {formatBytes(size)}
                        </TableRowCell>
                    );
                }

                if (name === 'speed') {
                    return (
                        <TableRowCell key={name} className={styles[name]}>
                            {formatBytes(speed)}/s
                        </TableRowCell>
                    );
                }

                if (name === 'timeLeft') {
                    return (
                        <TimeLeftCell
                            size={size}
                            sizeLeft={sizeLeft}
                            status={status}
                            timeLeft={timeLeft}
                        />
                    );
                }

                if (name === 'progress') {
                    return (
                        <TableRowCell key={name} className={styles[name]}>
                            <ProgressBar
                                progress={progress}
                                title={`${progress.toFixed(1)}%`}
                            />
                        </TableRowCell>
                    );
                }

                if (name === 'actions') {
                    return (
                        <TableRowCell key={name} className={styles[name]}>
                            <IconButton
                                title={translate('RemoveFromQueue')}
                                name={icons.DELETE}
                                onPress={handleDeletePress}
                            />
                            <IconButton
                                title={translate('BlocklistRelease')}
                                name={icons.BLOCK}
                                onPress={handleBlocklistPress}
                            />
                            <IconButton
                                name={icons.ARROW_UP}
                                onPress={handleMoveUpQueue}
                                isDisabled={priority - 1 < 0}
                            />
                            <IconButton
                                name={icons.ARROW_DOWN}
                                onPress={handleMoveDownQueue}
                                isDisabled={priority + 1 === queueLength}
                            />
                        </TableRowCell>
                    );
                }
            })}
        </TableRow>
    );
}
