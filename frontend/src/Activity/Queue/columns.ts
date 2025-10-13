import { sortDirections } from 'Helpers/Props';

import type { TableState } from 'Store/Slices/TableOptions';

export type QueueColumnName =
    | 'priority'
    | 'status'
    | 'title'
    | 'sourceName'
    | 'size'
    | 'speed'
    | 'timeLeft'
    | 'progress'
    | 'actions';

export default {
    sortKey: 'priority',
    sortDirection: sortDirections.ASCENDING,

    secondarySortKey: null,
    secondarySortDirection: null,

    columns: [
        {
            name: 'priority',
            isModifiable: true,
            isSortable: true,
            isVisible: true,
        },
        {
            name: 'status',
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
            name: 'sourceName',
            isModifiable: true,
            isSortable: true,
            isVisible: true,
        },
        {
            name: 'size',
            isModifiable: true,
            isSortable: true,
            isVisible: true,
        },
        {
            name: 'speed',
            isModifiable: true,
            isSortable: true,
            isVisible: true,
        },
        {
            name: 'timeLeft',
            isModifiable: true,
            isSortable: true,
            isVisible: true,
        },
        {
            name: 'progress',
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
} satisfies TableState<'queueTable'>;
