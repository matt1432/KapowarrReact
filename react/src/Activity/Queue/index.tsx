// TODO:
// IMPORTS

// React

// Redux
import { useGetQueueQuery } from 'Store/Api/Queue';

// Misc
import { icons, kinds } from 'Helpers/Props';

import translate from 'Utilities/String/translate';

// General Components
import Alert from 'Components/Alert';
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

// IMPLEMENTATIONS

const columns: Column<keyof QueueColumn>[] = [
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
                        itemRenderer={(item) => <QueueRow {...item} columns={columns} />}
                    />
                )}
            </PageContentBody>
        </PageContent>
    );
}
