// IMPORTS

// React
import { useMemo } from 'react';

// Misc
import formatTimeSpan from 'Utilities/Date/formatTimeSpan';
import formatBytes from 'Utilities/Number/formatBytes';

// General Components
import TableRowCell from 'Components/Table/Cells/TableRowCell';

// CSS
import styles from './index.module.css';

// Types
import type { DownloadState } from 'Helpers/Props/downloadStates';

interface TimeLeftCellProps {
    size: number;
    sizeLeft: number;
    status: DownloadState;
    timeLeft: number;
}

// IMPLEMENTATIONS

export default function TimeLeftCell({
    size,
    sizeLeft,
    status,
    timeLeft,
}: TimeLeftCellProps) {
    const totalSize = useMemo(() => formatBytes(size), [size]);
    const remainingSize = useMemo(() => formatBytes(sizeLeft), [sizeLeft]);

    if (!timeLeft || status === 'importing' || status === 'failed') {
        return <TableRowCell className={styles.timeLeft}>-</TableRowCell>;
    }

    return (
        <TableRowCell
            className={styles.timeLeft}
            title={`${remainingSize} / ${totalSize}`}
        >
            {formatTimeSpan(timeLeft)}
        </TableRowCell>
    );
}
