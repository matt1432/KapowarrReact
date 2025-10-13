import type { TableState } from 'Store/Slices/TableOptions';

export type IssueSummaryColumnName = 'path' | 'filesize' | 'actions';

export default {
    sortKey: null,
    sortDirection: null,

    secondarySortKey: null,
    secondarySortDirection: null,

    columns: [
        {
            name: 'path',
            isModifiable: false,
            isSortable: false,
            isVisible: true,
        },
        {
            name: 'filesize',
            isModifiable: false,
            isSortable: false,
            isVisible: true,
        },
        {
            name: 'actions',
            hideHeaderLabel: true,
            isModifiable: false,
            isSortable: false,
            isVisible: true,
        },
    ],
} satisfies TableState<'issueSummary'>;
