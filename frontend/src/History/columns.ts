import type { TableState } from 'Store/Slices/TableOptions';

export type HistoryColumnName =
    | 'source'
    | 'volumeId'
    | 'issueId'
    | 'webLink'
    | 'webTitle'
    | 'webSubTitle'
    | 'fileTitle'
    | 'downloadedAt'
    | 'success'
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
            width: 95,
        },
        {
            name: 'volumeId',
            isModifiable: false,
            isSortable: false,
            isVisible: false,
            width: 75,
        },
        {
            name: 'issueId',
            isModifiable: false,
            isSortable: false,
            isVisible: false,
            width: 75,
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
            name: 'fileTitle',
            isModifiable: false,
            isSortable: false,
            isVisible: true,
        },
        {
            name: 'downloadedAt',
            isModifiable: false,
            isSortable: false,
            isVisible: true,
            width: 180, // RelativeDateCell
        },
        {
            name: 'success',
            isModifiable: false,
            isSortable: false,
            isVisible: true,
            width: 85,
        },
        {
            name: 'actions',
            hideHeaderLabel: true,
            isModifiable: false,
            isSortable: false,
            isVisible: true,
            width: 30,
        },
    ],
} satisfies TableState<'historyTable'>;
