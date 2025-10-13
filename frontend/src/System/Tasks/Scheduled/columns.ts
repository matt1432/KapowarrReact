import type { TableState } from 'Store/Slices/TableOptions';

export type TaskPlanningColumnName =
    | 'displayName'
    | 'interval'
    | 'lastRun'
    | 'nextRun'
    | 'actions';

export default {
    sortKey: null,
    sortDirection: null,

    secondarySortKey: null,
    secondarySortDirection: null,

    columns: [
        {
            name: 'displayName',
            isModifiable: false,
            isSortable: false,
            isVisible: true,
        },
        {
            name: 'interval',
            isModifiable: false,
            isSortable: false,
            isVisible: true,
        },
        {
            name: 'lastRun',
            isModifiable: false,
            isSortable: false,
            isVisible: true,
        },
        {
            name: 'nextRun',
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
} satisfies TableState<'taskPlanning'>;
