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
import type { QueueColumn, QueueColumnName } from '..';
import type { Column } from 'Components/Table/Column';
import type { DeleteQueueItemParams } from 'Store/Api/Queue';

type QueueRowProps = QueueColumn & {
    columns: Column<QueueColumnName>[];
    onDeletePress: (props: DeleteQueueItemParams) => void;
};

// IMPLEMENTATIONS

export default function QueueRow({
    id,
    volumeId,
    columns,
    onDeletePress,
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
                    return (
                        <TableRowCell className={styles[name]}>
                            <QueueStatus sourceTitle={title} status={status} position="right" />
                        </TableRowCell>
                    );
                }

                if (name === 'title') {
                    return (
                        <TableRowCell className={styles[name]}>
                            <VolumeTitleLink title={title} titleSlug={volumeId.toString()} />
                        </TableRowCell>
                    );
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
                        <TableRowCell className={styles[name]}>
                            <ProgressBar progress={progress} title={`${progress.toFixed(1)}%`} />
                        </TableRowCell>
                    );
                }

                if (name === 'actions') {
                    return (
                        <TableRowCell className={styles[name]}>
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
                        </TableRowCell>
                    );
                }
            })}
        </TableRow>
    );
}
