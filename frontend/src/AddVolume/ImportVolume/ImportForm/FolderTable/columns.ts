import type { TableState } from 'Store/Slices/TableOptions';

export type FolderTableColumnName = 'value' | 'actions';

export default {
    sortKey: null,
    sortDirection: null,

    secondarySortKey: null,
    secondarySortDirection: null,

    columns: [
        {
            name: 'value',
            hideHeaderLabel: true,
            isModifiable: false,
            isSortable: false,
            isVisible: true,
            className: '',
        },
        {
            name: 'actions',
            hideHeaderLabel: true,
            isModifiable: false,
            isSortable: false,
            isVisible: true,
            className: '',
        },
    ],
} satisfies TableState<'folderTable'>;
