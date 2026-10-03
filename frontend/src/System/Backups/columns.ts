import type { TableState } from 'Store/Slices/TableOptions';

export type BackupsColumnName = 'filename' | 'creationDate' | 'actions';

export default {
    sortKey: null,
    sortDirection: null,

    secondarySortKey: null,
    secondarySortDirection: null,

    columns: [
        {
            name: 'filename',
            isModifiable: false,
            isSortable: false,
            isVisible: true,
        },
        {
            name: 'creationDate',
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
} satisfies TableState<'backupsTable'>;
