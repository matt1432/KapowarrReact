import type { TableState } from 'Store/Slices/TableOptions';

export type RootFolderColumnName =
    | 'path'
    | 'freeSpace'
    | 'totalSpace'
    | 'actions';

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
            name: 'freeSpace',
            isModifiable: false,
            isSortable: false,
            isVisible: true,
        },
        {
            name: 'totalSpace',
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
} satisfies TableState<'rootFolders'>;
