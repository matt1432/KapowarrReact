import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Column } from 'Components/Table/Column';
import { sortDirections } from 'Helpers/Props';
import type { SortDirection } from 'Helpers/Props/sortDirections';
import type { TableOptionsChangePayload } from 'typings/Table';
import translate from 'Utilities/String/translate';
import type { IssueTableSort } from 'Volume/Details/IssueTable';

// TODO: persist state
export interface IssueTableState {
    sortKey: IssueTableSort;
    sortDirection: SortDirection;
    columns: Column[];
}

const initialState = {
    sortKey: 'issueNumber',
    sortDirection: sortDirections.DESCENDING,

    columns: [
        {
            name: 'monitored',
            // columnLabel: () => translate('Monitored'),
            label: () => translate('Monitored'),
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
            name: 'actions',
            // columnLabel: () => translate('Actions'),
            label: () => translate('Actions'),
            isVisible: true,
            isModifiable: false,
        },
    ],
} satisfies IssueTableState as IssueTableState;

const issueTableSlice = createSlice({
    name: 'issueTable',
    initialState,
    selectors: {},
    reducers: {
        setIssuesSort: (
            state,
            {
                payload,
            }: PayloadAction<Partial<{ sortKey: IssueTableSort; sortDirection: SortDirection }>>,
        ) => {
            state = Object.assign(state, payload);
        },

        setIssuesTableOption: (state, { payload }: PayloadAction<TableOptionsChangePayload>) => {
            state = Object.assign(state, payload);
        },
    },
});

export const { setIssuesSort, setIssuesTableOption } = issueTableSlice.actions;

export default issueTableSlice;
