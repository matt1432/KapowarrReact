import { sortDirections } from 'Helpers/Props';

import type { TableState } from 'Store/Slices/TableOptions';

export type VolumeIndexColumnName =
    | 'monitored'
    | 'title'
    | 'volumeNumber'
    | 'year'
    | 'publisher'
    | 'issuesDownloadedMonitored'
    | 'issueCountMonitored'
    | 'folder'
    | 'totalSize'
    | 'monitorNewIssues'
    | 'actions';

export default {
    sortKey: 'title',
    sortDirection: sortDirections.ASCENDING,

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
            name: 'title',
            isModifiable: false,
            isSortable: true,
            isVisible: true,
        },
        {
            name: 'year',
            isModifiable: false,
            isSortable: true,
            isVisible: true,
        },
        {
            name: 'publisher',
            isModifiable: false,
            isSortable: true,
            isVisible: true,
        },
        {
            name: 'issuesDownloadedMonitored',
            isModifiable: false,
            isSortable: true,
            isVisible: true,
        },
        {
            name: 'issueCountMonitored',
            isModifiable: false,
            isSortable: true,
            isVisible: false,
        },
        {
            name: 'folder',
            isModifiable: false,
            isSortable: true,
            isVisible: false,
        },
        {
            name: 'totalSize',
            isModifiable: false,
            isSortable: true,
            isVisible: false,
        },
        {
            name: 'monitorNewIssues',
            isModifiable: false,
            isSortable: true,
            isVisible: false,
        },
        {
            name: 'actions',
            hideHeaderLabel: true,
            isModifiable: false,
            isSortable: false,
            isVisible: true,
        },
    ],
} satisfies TableState<'volumeIndex'>;
