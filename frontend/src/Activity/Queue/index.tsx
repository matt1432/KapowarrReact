// IMPORTS

// React
import { useCallback, useEffect, useState } from 'react';

// Redux
import { useRootDispatch, useRootSelector } from 'Store/createAppStore';
import { setQueueSort, setQueueTableOption } from 'Store/Slices/QueueTable';
import {
    useClearQueueMutation,
    useDeleteQueueItemMutation,
    useGetQueueQuery,
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
import type { TableOptionsChangePayload } from 'typings/Table';

export type QueueColumn = QueueItem & {
    priority: number;
    sizeLeft: number;
    timeLeft: number;

    // Columns
    actions: never;
};
export type QueueColumnName = keyof QueueColumn;

// IMPLEMENTATIONS

const columns: Column<QueueColumnName>[] = [
    {
        name: 'priority',
        label: () => translate('Priority'),
        isVisible: true,
        isSortable: true,
    },
    {
        name: 'status',
        label: () => translate('Status'),
        isVisible: true,
        isSortable: true,
    },
    {
        name: 'title',
        label: () => translate('Title'),
        isVisible: true,
        isSortable: true,
    },
    {
        name: 'sourceName',
        label: () => translate('Source'),
        isVisible: true,
        isSortable: true,
    },
    {
        name: 'size',
        label: () => translate('Size'),
        isVisible: true,
        isSortable: true,
    },
    {
        name: 'speed',
        label: () => translate('Speed'),
        isVisible: true,
        isSortable: true,
    },
    {
        name: 'timeLeft',
        label: () => translate('TimeLeft'),
        isVisible: true,
        isSortable: true,
    },
    {
        name: 'progress',
        label: () => translate('Progress'),
        isVisible: true,
        isSortable: true,
    },
    {
        name: 'actions',
        label: '',
        isSortable: false,
        isVisible: true,
    },
];

export default function Queue() {
    const dispatch = useRootDispatch();
    const { sortKey, sortDirection } = useRootSelector(
        (state) => state.queueTable,
    );

    const [isRefreshing, setIsRefreshing] = useState(false);

    const { items, isSuccess, refetch } = useGetQueueQuery(undefined, {
        selectFromResult: ({ data, isSuccess }) => ({
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
            isSuccess,
        }),
    });

    useEffect(() => {
        if (isSuccess && !isRefreshing) {
            setIsRefreshing(false);
        }
    }, [isRefreshing, isSuccess]);

    const handleRefreshPress = useCallback(() => {
        setIsRefreshing(true);
        refetch();
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
                setQueueSort({
                    sortKey: sortKey,
                    sortDirection,
                }),
            );
        },
        [dispatch],
    );

    const handleTableOptionChange = useCallback(
        (payload: TableOptionsChangePayload<QueueColumnName>) => {
            dispatch(setQueueTableOption(payload));
        },
        [dispatch],
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
                                {...item}
                                columns={columns}
                                onDeletePress={onDeletePress}
                            />
                        )}
                    />
                )}
            </PageContentBody>
        </PageContent>
    );
}
