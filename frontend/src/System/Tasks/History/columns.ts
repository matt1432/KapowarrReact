import type { TableState } from 'Store/Slices/TableOptions';

export type TaskHistoryColumnName = 'displayTitle' | 'runAt';

export default {
    sortKey: null,
    sortDirection: null,

    secondarySortKey: null,
    secondarySortDirection: null,

    columns: [
        {
            name: 'displayTitle',
            isModifiable: false,
            isSortable: false,
            isVisible: true,
        },
        {
            name: 'runAt',
            isModifiable: false,
            isSortable: false,
            isVisible: true,
        },
    ],
} satisfies TableState<'taskHistory'>;
