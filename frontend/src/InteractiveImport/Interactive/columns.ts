import { sortDirections } from 'Helpers/Props';

import type { TableState } from 'Store/Slices/TableOptions';

export type InteractiveImportColumnName =
    | 'filepath'
    | 'issueIds'
    | 'releaser'
    | 'resolution'
    | 'dpi'
    | 'scanType'
    | 'notes';

export default {
    sortKey: 'filepath',
    sortDirection: sortDirections.DESCENDING,

    secondarySortKey: null,
    secondarySortDirection: null,

    columns: [
        {
            name: 'filepath',
            isSortable: true,
            isVisible: true,
            isModifiable: false,
        },
        {
            name: 'issueIds',
            isSortable: false,
            isVisible: true,
            isModifiable: true,
        },
        {
            name: 'releaser',
            isSortable: true,
            isVisible: true,
            isModifiable: true,
        },
        {
            name: 'resolution',
            isSortable: true,
            isVisible: true,
            isModifiable: true,
        },
        {
            name: 'dpi',
            isSortable: true,
            isVisible: true,
            isModifiable: true,
        },
        {
            name: 'scanType',
            isSortable: true,
            isVisible: true,
            isModifiable: true,
        },
        {
            name: 'notes',
            isSortable: true,
            isVisible: true,
            isModifiable: true,
        },
    ],
} satisfies TableState<'interactiveImport'>;
