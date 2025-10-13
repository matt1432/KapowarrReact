import type { TableState } from 'Store/Slices/TableOptions';

export type ProposalColumnName =
    | 'selected'
    | 'file'
    | 'cvLink'
    | 'issueCount'
    | 'actions';

export default {
    sortKey: null,
    sortDirection: null,

    secondarySortKey: null,
    secondarySortDirection: null,

    columns: [
        {
            name: 'file',
            isSortable: false,
            isModifiable: false,
            isVisible: true,
        },
        {
            name: 'cvLink',
            isSortable: false,
            isModifiable: false,
            isVisible: true,
        },
        {
            name: 'issueCount',
            isSortable: false,
            isModifiable: false,
            isVisible: true,
        },
        {
            name: 'actions',
            hideHeaderLabel: true,
            isSortable: false,
            isModifiable: false,
            isVisible: true,
        },
    ],
} satisfies TableState<'importProposals'>;
