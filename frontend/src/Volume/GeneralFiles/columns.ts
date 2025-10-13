import type { TableState } from 'Store/Slices/TableOptions';

export type GeneralFilesColumnName =
    | 'path'
    | 'fileType'
    | 'filesize'
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
            name: 'fileType',
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
} satisfies TableState<'generalFiles'>;
