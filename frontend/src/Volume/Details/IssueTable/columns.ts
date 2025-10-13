import { sortDirections } from 'Helpers/Props';

import type { TableState } from 'Store/Slices/TableOptions';

export type IssueColumnName =
    | 'monitored'
    | 'issueNumber'
    | 'title'
    | 'path'
    | 'relativePath'
    | 'size'
    | 'releaseGroup'
    | 'status'
    | 'actions';

export default {
    sortKey: 'issueNumber',
    sortDirection: sortDirections.DESCENDING,

    secondarySortKey: null,
    secondarySortDirection: null,

    columns: [
        {
            name: 'monitored',
            hideHeaderLabel: true,
            isModifiable: false,
            isSortable: true,
            isVisible: true,
        },
        {
            name: 'issueNumber',
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
            name: 'path',
            isModifiable: true,
            isSortable: true,
            isVisible: false,
        },
        {
            name: 'relativePath',
            isModifiable: true,
            isSortable: true,
            isVisible: false,
        },
        {
            name: 'size',
            isModifiable: true,
            isSortable: true,
            isVisible: false,
        },
        {
            name: 'releaseGroup',
            isModifiable: true,
            isSortable: true,
            isVisible: false,
        },
        {
            name: 'status',
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
    ],
} satisfies TableState<'issueTable'>;
