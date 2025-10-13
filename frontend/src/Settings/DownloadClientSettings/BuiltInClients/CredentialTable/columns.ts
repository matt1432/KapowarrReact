import type { TableState } from 'Store/Slices/TableOptions';

export type CredentialColumnName =
    | 'email'
    | 'username'
    | 'password'
    | 'apiKey'
    | 'actions';

export default {
    sortKey: null,
    sortDirection: null,

    secondarySortKey: null,
    secondarySortDirection: null,

    columns: [
        {
            name: 'email',
            isModifiable: false,
            isSortable: false,
            isVisible: false,
        },
        {
            name: 'username',
            isModifiable: false,
            isSortable: false,
            isVisible: false,
        },
        {
            name: 'password',
            isModifiable: false,
            isSortable: false,
            isVisible: false,
        },
        {
            name: 'apiKey',
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
} satisfies TableState<'credentialTable'>;
