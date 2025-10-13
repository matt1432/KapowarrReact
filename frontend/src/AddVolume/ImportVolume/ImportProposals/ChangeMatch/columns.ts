import { sortDirections } from 'Helpers/Props';

import type { TableState } from 'Store/Slices/TableOptions';

export type ChangeMatchColumnName = 'title' | 'issueCount' | 'actions';

export default {
    sortKey: 'title',
    sortDirection: sortDirections.ASCENDING,

    secondarySortKey: null,
    secondarySortDirection: null,

    columns: [
        {
            name: 'title',
            isModifiable: true,
            isSortable: true,
            isVisible: true,
        },
        {
            name: 'issueCount',
            isModifiable: true,
            isSortable: true,
            isVisible: true,
        },
        {
            name: 'actions',
            hideHeaderLabel: true,
            isModifiable: false,
            isSortable: true,
            isVisible: true,
        },
    ],
} satisfies TableState<'changeMatch'>;
