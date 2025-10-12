// IMPORTS

// React
import { useCallback, useState } from 'react';

// Redux
import { useRootDispatch, useRootSelector } from 'Store/createAppStore';
import { setTableSort } from 'Store/Slices/TableOptions';
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
import type { QueueItem } from 'typings/Queue';
import type { SortDirection } from 'Helpers/Props/sortDirections';

export type QueueColumn = QueueItem & {
    priority: number;
    sizeLeft: number;
    timeLeft: number;

    // Columns
    actions: never;
};
export type QueueColumnName = keyof QueueColumn;

// IMPLEMENTATIONS

export default function Queue() {
    const dispatch = useRootDispatch();

    const { columns } = useRootSelector(
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
                    sortKey,
                    sortDirection,
                }),
            );
        },
        [dispatch],
    );

    const [moveQueueItem] = useMoveQueueItemMutation();
    const handleMoveQueueItem = useCallback(
        (params: { id: number; index: number }) => {
            moveQueueItem(params).finally(() => {
                refetch();
            });
        },
        [moveQueueItem, refetch],
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
                    <SortedTable
                        tableName="queueTable"
                        columns={columns}
                        onSortPress={handleSortPress}
                        items={items}
                        itemRenderer={(item) => (
                            <QueueRow
                                key={item.id}
                                {...item}
                                columns={columns}
                                queueLength={items.length}
                                onDeletePress={onDeletePress}
                                onMoveQueueItem={handleMoveQueueItem}
                            />
                        )}
                    />
                )}
            </PageContentBody>
        </PageContent>
    );
}
