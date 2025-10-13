import type { TableState } from 'Store/Slices/TableOptions';

export type BlocklistColumnName =
    | 'source'
    | 'volumeId'
    | 'issueId'
    | 'downloadLink'
    | 'webLink'
    | 'webTitle'
    | 'webSubTitle'
    | 'reason'
    | 'addedAt'
    | 'actions';

export default {
    sortKey: null,
    sortDirection: null,

    secondarySortKey: null,
    secondarySortDirection: null,

    columns: [
        {
            name: 'source',
            isModifiable: false,
            isSortable: false,
            isVisible: true,
        },
        {
            name: 'volumeId',
            isModifiable: false,
            isSortable: false,
            isVisible: true,
        },
        {
            name: 'issueId',
            isModifiable: false,
            isSortable: false,
            isVisible: true,
        },
        {
            name: 'downloadLink',
            isModifiable: false,
            isSortable: false,
            isVisible: true,
        },
        {
            name: 'webLink',
            isModifiable: false,
            isSortable: false,
            isVisible: true,
        },
        {
            name: 'webTitle',
            isModifiable: false,
            isSortable: false,
            isVisible: true,
        },
        {
            name: 'webSubTitle',
            isModifiable: false,
            isSortable: false,
            isVisible: true,
        },
        {
            name: 'reason',
            isModifiable: false,
            isSortable: false,
            isVisible: true,
        },
        {
            name: 'addedAt',
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
} satisfies TableState<'blocklistTable'>;
