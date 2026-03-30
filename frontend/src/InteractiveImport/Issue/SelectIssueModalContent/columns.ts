import { sortDirections } from 'Helpers/Props';

import type { TableState } from 'Store/Slices/TableOptions';

export type SelectIssueColumnName = 'title' | 'issueNumber';

export default {
    sortKey: 'issueNumber',
    sortDirection: sortDirections.DESCENDING,

    secondarySortKey: null,
    secondarySortDirection: null,

    columns: [
        {
            name: 'issueNumber',
            isModifiable: false,
            isSortable: true,
            isVisible: true,
        },
        {
            name: 'title',
            isModifiable: false,
            isSortable: true,
            isVisible: true,
        },
    ],
} satisfies TableState<'selectIssue'>;
