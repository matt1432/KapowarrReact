// IMPORTS

// React
import { useCallback, useMemo, useState } from 'react';
import { HTML5toTouch } from 'rdndmb-html5-to-touch';
import { DndProvider } from 'react-dnd-multi-backend';

// Redux
import { useRootDispatch, useRootSelector } from 'Store/createAppStore';
import { setTableOptions, setTableSort } from 'Store/Slices/TableOptions';
import {
    useClearQueueMutation,
    useDeleteQueueItemMutation,
    useGetQueueQuery,
    useMoveQueueItemMutation,
    type DeleteQueueItemParams,
} from 'Store/Api/Queue';

// Misc
import { icons, kinds } from 'Helpers/Props';

import translate from 'Utilities/String/translate';

// Hooks
import useModalOpenState from 'Helpers/Hooks/useModalOpenState';

// General Components
import Alert from 'Components/Alert';
import ConfirmModal from 'Components/Modal/ConfirmModal';
import PageContent from 'Components/Page/PageContent';
import PageContentBody from 'Components/Page/PageContentBody';
import PageToolbar from 'Components/Page/Toolbar/PageToolbar';
import PageToolbarButton from 'Components/Page/Toolbar/PageToolbarButton';
import PageToolbarSection from 'Components/Page/Toolbar/PageToolbarSection';
import SortedTable from 'Components/Table/SortedTable';

// Specific Components
import QueueRow from './QueueRow';

// Types
import type { Column } from 'Components/Table/Column';
import type { QueueItem } from 'typings/Queue';
import type { SortDirection } from 'Helpers/Props/sortDirections';
import type { SetTableOptionsParams } from 'Store/Slices/TableOptions';

export type QueueColumn = QueueItem & {
    priority: number;
    sizeLeft: number;
    timeLeft: number;

    // Columns
    drag: never;
    actions: never;
};
export type QueueColumnName = keyof QueueColumn;

// IMPLEMENTATIONS

export default function Queue() {
    const dispatch = useRootDispatch();

    const { sortKey, sortDirection } = useRootSelector(
        (state) => state.tableOptions.queueTable,
    );

    const [isRefreshing, setIsRefreshing] = useState(false);

    const { items, refetch } = useGetQueueQuery(undefined, {
        selectFromResult: ({ data }) => ({
            items: (data ?? []).map((item, i) => {
                const sizeLeft = (1 - item.progress / 100) * item.size;
                return {
                    ...item,
                    priority: i,
                    sizeLeft,
                    timeLeft:
                        item.speed === 0 ? 0 : (sizeLeft / item.speed) * 1000,
                } as QueueColumn;
            }),
        }),
    });

    const handleRefreshPress = useCallback(() => {
        setIsRefreshing(true);
        refetch().finally(() => {
            setIsRefreshing(false);
        });
    }, [refetch]);

    const [deleteQueueItem] = useDeleteQueueItemMutation();
    const onDeletePress = useCallback(
        (props: DeleteQueueItemParams) => {
            deleteQueueItem(props);
        },
        [deleteQueueItem],
    );

    const [
        isClearQueueModalOpen,
        setClearQueueModalOpen,
        setClearQueueModalClosed,
    ] = useModalOpenState(false);

    const [clearQueuePost, { isLoading: isClearing }] = useClearQueueMutation();
    const clearQueue = useCallback(() => {
        clearQueuePost();
        setClearQueueModalClosed();
    }, [clearQueuePost, setClearQueueModalClosed]);

    const handleSortPress = useCallback(
        (sortKey: QueueColumnName, sortDirection?: SortDirection) => {
            dispatch(
                setTableSort({
                    tableName: 'queueTable',
                    sortKey: sortKey,
                    sortDirection,
                }),
            );
        },
        [dispatch],
    );

    const handleTableOptionChange = useCallback(
        (payload: SetTableOptionsParams<'queueTable'>) => {
            dispatch(setTableOptions(payload));
        },
        [dispatch],
    );

    const columns = useMemo(
        () =>
            [
                {
                    name: 'drag',
                    hideHeaderLabel: true,
                    isModifiable: false,
                    isSortable: false,
                    isVisible: sortKey === 'priority',
                },
                {
                    name: 'priority',
                    isModifiable: true,
                    isSortable: true,
                    isVisible: true,
                },
                {
                    name: 'status',
                    isModifiable: true,
                    isSortable: true,
                    isVisible: true,
                },
                {
                    name: 'title',
                    isModifiable: true,
                    isSortable: true,
                    isVisible: true,
                },
                {
                    name: 'sourceName',
                    isModifiable: true,
                    isSortable: true,
                    isVisible: true,
                },
                {
                    name: 'size',
                    isModifiable: true,
                    isSortable: true,
                    isVisible: true,
                },
                {
                    name: 'speed',
                    isModifiable: true,
                    isSortable: true,
                    isVisible: true,
                },
                {
                    name: 'timeLeft',
                    isModifiable: true,
                    isSortable: true,
                    isVisible: true,
                },
                {
                    name: 'progress',
                    isModifiable: true,
                    isSortable: true,
                    isVisible: true,
                },
                {
                    name: 'actions',
                    hideHeaderLabel: true,
                    isModifiable: false,
                    isSortable: false,
                    isVisible: true,
                },
            ] satisfies Column<QueueColumnName>[],
        [sortKey],
    );

    // DnD
    const [dragIndex, setDragIndex] = useState<number | null>(null);
    const [dropIndex, setDropIndex] = useState<number | null>(null);

    const isDragging = useMemo(() => dropIndex !== null, [dropIndex]);
    const isDraggingUp = useMemo(
        () =>
            isDragging &&
            dropIndex !== null &&
            dragIndex !== null &&
            dropIndex < dragIndex,
        [dragIndex, dropIndex, isDragging],
    );
    const isDraggingDown = useMemo(
        () =>
            isDragging &&
            dropIndex !== null &&
            dragIndex !== null &&
            dropIndex > dragIndex,
        [dragIndex, dropIndex, isDragging],
    );

    const handleDragMove = useCallback(
        (newDragIndex: number, newDropIndex: number) => {
            setDropIndex(newDropIndex);
            setDragIndex(newDragIndex);
        },
        [],
    );

    const [moveQueueItem] = useMoveQueueItemMutation();

    const handleDragEnd = useCallback(
        (didDrop: boolean) => {
            if (
                !isRefreshing &&
                didDrop &&
                typeof dragIndex === 'number' &&
                typeof dropIndex === 'number' &&
                dragIndex !== dropIndex
            ) {
                moveQueueItem({
                    id: items[dragIndex].id,
                    index: dropIndex,
                }).finally(() => {
                    refetch();
                });
            }

            setDragIndex(null);
            setDropIndex(null);
        },
        [dragIndex, dropIndex, moveQueueItem, refetch, items, isRefreshing],
    );

    return (
        <PageContent title={translate('Queue')}>
            <PageToolbar>
                <PageToolbarSection>
                    <PageToolbarButton
                        iconName={icons.REFRESH}
                        label={translate('Refresh')}
                        isSpinning={isRefreshing}
                        onPress={handleRefreshPress}
                    />

                    <PageToolbarButton
                        iconName={icons.DELETE}
                        label={translate('ClearQueue')}
                        isSpinning={isClearing}
                        isDisabled={items.length === 0}
                        onPress={setClearQueueModalOpen}
                    />

                    <ConfirmModal
                        title={translate('ClearQueue')}
                        message={translate('ClearQueueMessage')}
                        kind={kinds.DANGER}
                        isOpen={isClearQueueModalOpen}
                        onCancel={setClearQueueModalClosed}
                        onConfirm={clearQueue}
                    />
                </PageToolbarSection>
            </PageToolbar>

            <PageContentBody>
                {!items.length ? (
                    <Alert kind={kinds.INFO}>{translate('QueueIsEmpty')}</Alert>
                ) : (
                    <DndProvider options={HTML5toTouch}>
                        <SortedTable
                            tableName="queueTable"
                            columns={columns}
                            sortKey={sortKey}
                            sortDirection={sortDirection}
                            onSortPress={handleSortPress}
                            tableProps={{
                                onTableOptionChange: handleTableOptionChange,
                            }}
                            items={items}
                            itemRenderer={(item) => (
                                <QueueRow
                                    key={item.id}
                                    {...item}
                                    columns={columns}
                                    onDeletePress={onDeletePress}
                                    isDraggingUp={isDraggingUp}
                                    isDraggingDown={isDraggingDown}
                                    onDragMove={handleDragMove}
                                    onDragEnd={handleDragEnd}
                                />
                            )}
                        />
                    </DndProvider>
                )}
            </PageContentBody>
        </PageContent>
    );
}
