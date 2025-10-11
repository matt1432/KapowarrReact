// IMPORTS

// React
import { useEffect, useRef } from 'react';

import { useDrag, useDrop } from 'react-dnd';

// Misc
import { icons } from 'Helpers/Props';

import translate, { type TranslateKey } from 'Utilities/String/translate';

import classNames from 'classnames';

import DragType from 'Helpers/DragType';

// General Components
import CheckInput from 'Components/Form/CheckInput';
import Icon from 'Components/Icon';

// CSS
import styles from './index.module.css';

// Types
import type { DragSourceMonitor, XYCoord } from 'react-dnd';
import type { CheckInputChanged } from 'typings/Inputs';

interface DragItem {
    name: string;
    index: number;
}

interface TableOptionsColumnProps<T extends string> {
    name: T;
    isDraggingDown: boolean;
    isDraggingUp: boolean;
    isVisible: boolean;
    isModifiable: boolean;
    index: number;
    onVisibleChange: (change: CheckInputChanged<T>) => void;
    onColumnDragEnd: (didDrop: boolean) => void;
    onColumnDragMove: (dragIndex: number, hoverIndex: number) => void;
}

// IMPLEMENTATIONS

export default function TableOptionsColumn<T extends string>({
    name,
    index,
    isDraggingDown,
    isDraggingUp,
    isVisible,
    isModifiable,
    onVisibleChange,
    onColumnDragEnd,
    onColumnDragMove,
}: TableOptionsColumnProps<T>) {
    const ref = useRef<HTMLDivElement | null>(null);
    const dragRef = useRef<HTMLDivElement | null>(null);

    const [{ isOver }, dropRef] = useDrop<DragItem, void, { isOver: boolean }>({
        accept: DragType.TableColumn,
        collect(monitor) {
            return {
                isOver: monitor.isOver(),
            };
        },
        hover(item: DragItem, monitor) {
            if (!ref.current) {
                return;
            }

            if (!isModifiable) {
                return;
            }

            const dragIndex = item.index;
            const hoverIndex = index;

            // Don't replace items with themselves
            if (dragIndex === hoverIndex) {
                onColumnDragMove(dragIndex, hoverIndex);
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

            onColumnDragMove(dragIndex, hoverIndex);
        },
    });

    const [{ isDragging }, dragRefConnector, previewRef] = useDrag<
        DragItem,
        unknown,
        { isDragging: boolean }
    >({
        type: DragType.TableColumn,
        item: () => {
            return {
                name,
                index,
            };
        },
        collect: (monitor: DragSourceMonitor<unknown, unknown>) => ({
            isDragging: monitor.isDragging(),
        }),
        end: (_item: DragItem, monitor) => {
            onColumnDragEnd(monitor.didDrop());
        },
    });

    useEffect(() => {
        dragRefConnector(dragRef);
    }, [dragRef, dragRefConnector]);

    useEffect(() => {
        dropRef(previewRef(ref));
    }, [dropRef, previewRef, ref]);

    const isBefore = !isDragging && isDraggingUp && isOver;
    const isAfter = !isDragging && isDraggingDown && isOver;

    return (
        <div ref={ref} className={styles.columnContainer}>
            {isBefore ? (
                <div
                    className={classNames(
                        styles.placeholder,
                        styles.placeholderBefore,
                    )}
                />
            ) : null}

            <div
                className={classNames(
                    styles.column,
                    isDragging && styles.isDragging,
                )}
            >
                <label className={styles.label}>
                    <CheckInput
                        containerClassName={styles.checkContainer}
                        name={name}
                        value={isVisible}
                        isDisabled={isModifiable === false}
                        onChange={onVisibleChange}
                    />
                    {translate(`${name}Key` as TranslateKey)}
                </label>

                {isModifiable ? (
                    <div ref={dragRef} className={styles.dragHandle}>
                        <Icon
                            className={styles.dragIcon}
                            name={icons.REORDER}
                        />
                    </div>
                ) : null}
            </div>

            {isAfter ? (
                <div
                    className={classNames(
                        styles.placeholder,
                        styles.placeholderAfter,
                    )}
                />
            ) : null}
        </div>
    );
}
