// IMPORTS

// React
import { useCallback, useRef } from 'react';
import {
    type DragSourceMonitor,
    useDrag,
    useDrop,
    type XYCoord,
} from 'react-dnd';

// Misc
import { icons } from 'Helpers/Props';

import formatBytes from 'Utilities/Number/formatBytes';
import translate from 'Utilities/String/translate';

import DragType from 'Helpers/DragType';

// General Components
import Icon from 'Components/Icon';
import IconButton from 'Components/Link/IconButton';
import ProgressBar from 'Components/ProgressBar';
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
import classNames from 'classnames';

interface DragItem {
    name: string;
    index: number;
}

type QueueRowProps = QueueColumn & {
    columns: Column<QueueColumnName>[];
    onDeletePress: (props: DeleteQueueItemParams) => void;

    // DnD
    isDraggingDown: boolean;
    isDraggingUp: boolean;
    onDragEnd: (didDrop: boolean) => void;
    onDragMove: (dragIndex: number, hoverIndex: number) => void;
};

// IMPLEMENTATIONS

export default function QueueRow({
    id,
    volumeId,
    isDraggingDown,
    isDraggingUp,
    onDragEnd,
    onDragMove,
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

    // DnD
    const ref = useRef<HTMLTableRowElement | null>(null);
    const dragRef = useRef<HTMLTableRowElement | null>(null);

    const [{ isOver }, dropRef] = useDrop<DragItem, void, { isOver: boolean }>({
        accept: DragType.Queue,
        collect(monitor) {
            return {
                isOver: monitor.isOver(),
            };
        },
        hover(item: DragItem, monitor) {
            if (!ref.current) {
                return;
            }

            const dragIndex = item.index;
            const hoverIndex = priority;

            // Don't replace items with themselves
            if (dragIndex === hoverIndex) {
                onDragMove(dragIndex, hoverIndex);
                return;
            }

            // Determine rectangle on screen
            const hoverBoundingRect = ref.current?.getBoundingClientRect();

            // Get vertical middle
            const hoverMiddleY =
                (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

            // Determine mouse position
            const clientOffset = monitor.getClientOffset();

            // Get pixels to the top
            const hoverClientY =
                (clientOffset as XYCoord).y - hoverBoundingRect.top;

            // When moving up, only trigger if drag position is above 50% and
            // when moving down, only trigger if drag position is below 50%.
            // If we're moving down the hoverIndex needs to be increased
            // by one so it's ordered properly. Otherwise the hoverIndex will work.

            // Dragging downwards
            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return;
            }

            // Dragging upwards
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return;
            }

            onDragMove(dragIndex, hoverIndex);
        },
    });

    const [{ isDragging }, dragRefConnector, previewRef] = useDrag<
        DragItem,
        unknown,
        { isDragging: boolean }
    >({
        type: DragType.Queue,
        item: () => {
            return {
                name: id.toString(),
                index: priority,
            };
        },
        collect: (monitor: DragSourceMonitor<unknown, unknown>) => ({
            isDragging: monitor.isDragging(),
        }),
        end: (_item: DragItem, monitor) => {
            onDragEnd(monitor.didDrop());
        },
    });

    dragRefConnector(dragRef);

    dropRef(previewRef(ref));

    const isBefore = !isDragging && isDraggingUp && isOver;
    const isAfter = !isDragging && isDraggingDown && isOver;

    return (
        <>
            {isBefore ? (
                <tr
                    className={classNames(
                        styles.placeholder,
                        styles.placeholderBefore,
                    )}
                ></tr>
            ) : null}

            <tr
                className={classNames(isDragging && styles.isDragging)}
                ref={ref}
            >
                {columns.map(({ name, isVisible }) => {
                    if (!isVisible) {
                        return null;
                    }

                    if (name === 'drag') {
                        return (
                            <TableRowCell className={styles[name]}>
                                <div
                                    ref={dragRef}
                                    className={styles.dragHandle}
                                >
                                    <Icon
                                        className={styles.dragIcon}
                                        name={icons.REORDER}
                                    />
                                </div>
                            </TableRowCell>
                        );
                    }

                    if (name === 'priority') {
                        return (
                            <TableRowCell className={styles[name]}>
                                {priority}
                            </TableRowCell>
                        );
                    }

                    if (name === 'status') {
                        return (
                            <TableRowCell className={styles[name]}>
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
                            <TableRowCell className={styles[name]}>
                                <VolumeTitleLink
                                    title={title}
                                    titleSlug={volumeId.toString()}
                                />
                            </TableRowCell>
                        );
                    }

                    if (name === 'sourceName') {
                        return (
                            <TableRowCell className={styles[name]}>
                                {sourceName}
                            </TableRowCell>
                        );
                    }

                    if (name === 'size') {
                        return (
                            <TableRowCell className={styles[name]}>
                                {formatBytes(size)}
                            </TableRowCell>
                        );
                    }

                    if (name === 'speed') {
                        return (
                            <TableRowCell className={styles[name]}>
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
                            <TableRowCell className={styles[name]}>
                                <ProgressBar
                                    progress={progress}
                                    title={`${progress.toFixed(1)}%`}
                                />
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
            </tr>

            {isAfter ? (
                <tr
                    className={classNames(
                        styles.placeholder,
                        styles.placeholderAfter,
                    )}
                ></tr>
            ) : null}
        </>
    );
}
