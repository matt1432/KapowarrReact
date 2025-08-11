// IMPORTS

// Redux
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

// Misc
import { sortDirections } from 'Helpers/Props';

import translate from 'Utilities/String/translate';

// Types
import type { Column } from 'Components/Table/Column';
import type { SortDirection } from 'Helpers/Props/sortDirections';
import type { IssueColumnName } from 'Issue/Issue';
import type { TableOptionsChangePayload } from 'typings/Table';

import type { IssueTableSort } from 'Volume/Details/IssueTable';

export interface IssueTableState {
    sortKey: IssueTableSort;
    sortDirection: SortDirection;
    columns: Column<IssueColumnName>[];
}

// IMPLEMENTATIONS

const initialState = {
    sortKey: 'issueNumber',
    sortDirection: sortDirections.DESCENDING,

    columns: [
        {
            name: 'monitored',
            columnLabel: () => translate('Monitored'),
            isVisible: true,
            isModifiable: false,
        },
        {
            name: 'issueNumber',
            label: '#',
            isVisible: true,
            isSortable: true,
        },
        {
            name: 'title',
            label: () => translate('Title'),
            isVisible: true,
            isSortable: true,
        },
        {
            name: 'path',
            label: () => translate('Path'),
            isVisible: false,
            isSortable: true,
        },
        {
            name: 'relativePath',
            label: () => translate('RelativePath'),
            isVisible: false,
            isSortable: true,
        },
        {
            name: 'size',
            label: () => translate('Size'),
            isVisible: false,
            isSortable: true,
        },
        {
            name: 'releaseGroup',
            label: () => translate('ReleaseGroup'),
            isVisible: false,
        },
        {
            name: 'status',
            label: () => translate('Status'),
            isVisible: true,
        },
        {
            name: 'actions',
            columnLabel: () => translate('Actions'),
            isVisible: true,
            isModifiable: false,
        },
    ],
} satisfies IssueTableState as IssueTableState;

const IssueTableSlice = createSlice({
    name: 'issueTable',
    initialState,
    reducers: {
        setIssuesSort: (
            state,
            {
                payload,
            }: PayloadAction<Partial<{ sortKey: IssueTableSort; sortDirection: SortDirection }>>,
        ) => {
            state = Object.assign(state, payload);
        },

        setIssuesTableOption: (
            state,
            { payload }: PayloadAction<TableOptionsChangePayload<IssueColumnName>>,
        ) => {
            state = Object.assign(state, payload);
        },
    },
});

export const { setIssuesSort, setIssuesTableOption } = IssueTableSlice.actions;

export default IssueTableSlice;
