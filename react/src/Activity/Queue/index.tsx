// TODO:
// IMPORTS

// React
import { useCallback, useState } from 'react';

// Redux
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

export type QueueColumn = QueueItem & {
    priority: number;
    actions: never;
};
export type QueueColumnName = keyof QueueColumn;

// IMPLEMENTATIONS

const columns: Column<QueueColumnName>[] = [
    {
        name: 'priority',
        label: () => translate('Priority'),
        isVisible: true,
    },
    {
        name: 'status',
        label: () => translate('Status'),
        isVisible: true,
    },
    {
        name: 'title',
        label: () => translate('Title'),
        isVisible: true,
    },
    {
        name: 'sourceName',
        label: () => translate('Source'),
        isVisible: true,
    },
    {
        name: 'size',
        label: () => translate('Size'),
        isVisible: true,
    },
    {
        name: 'speed',
        label: () => translate('Speed'),
        isVisible: true,
    },
    {
        name: 'progress',
        label: () => translate('Progress'),
        isVisible: true,
    },
    {
        name: 'actions',
        label: '',
        isSortable: false,
        isVisible: true,
    },
];

export default function Queue() {
    const { items, isRefreshing, refetch } = useGetQueueQuery(undefined, {
        selectFromResult: ({ data, isFetching }) => ({
            items: (data ?? []).map((item, i) => ({ ...item, priority: i })) as QueueColumn[],
            isRefreshing: isFetching,
        }),
    });

    const [deleteQueueItem] = useDeleteQueueItemMutation();
    const onDeletePress = useCallback(
        async (props: DeleteQueueItemParams) => {
            await deleteQueueItem(props);
            await refetch();
        },
        [deleteQueueItem, refetch],
    );

    const [isClearQueueModalOpen, setClearQueueModalOpen, setClearQueueModalClosed] =
        useModalOpenState(false);

    const [clearQueuePost] = useClearQueueMutation();
    const [isClearing, setIsClearing] = useState(false);
    const clearQueue = useCallback(async () => {
        setIsClearing(true);

        await clearQueuePost();
        await refetch();

        setIsClearing(false);
        setClearQueueModalClosed();
    }, [clearQueuePost, refetch, setClearQueueModalClosed]);

    return (
        <PageContent title={translate('Queue')}>
            <PageToolbar>
                <PageToolbarSection>
                    <PageToolbarButton
                        iconName={icons.REFRESH}
                        label={translate('Refresh')}
                        isSpinning={isRefreshing}
                        onPress={refetch}
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
                    // TODO: add filtered message
                    <Alert kind={kinds.INFO}>{translate('QueueIsEmpty')}</Alert>
                ) : (
                    <SortedTable
                        columns={columns}
                        items={items}
                        itemRenderer={(item) => (
                            <QueueRow {...item} columns={columns} onDeletePress={onDeletePress} />
                        )}
                    />
                )}
            </PageContentBody>
        </PageContent>
    );
}
