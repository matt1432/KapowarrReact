// IMPORTS

// Redux
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

// Misc
import { sortDirections } from 'Helpers/Props';

// Types
import type { SortDirection } from 'Helpers/Props/sortDirections';
import type { IssueColumnName } from 'Issue/Issue';
import type { TableOptionsChangePayload } from 'typings/Table';

export interface IssueTableState {
    sortKey: IssueColumnName;
    sortDirection: SortDirection;
}

export interface SetIssuesSortParams {
    sortKey: IssueColumnName;
    sortDirection?: SortDirection;
}

// IMPLEMENTATIONS

const initialState = {
    sortKey: 'issueNumber',
    sortDirection: sortDirections.ASCENDING,
} satisfies IssueTableState as IssueTableState;

const IssueTableSlice = createSlice({
    name: 'issueTable',
    initialState,
    reducers: {
        setIssuesSort: (
            state,
            { payload }: PayloadAction<SetIssuesSortParams>,
        ) => {
            const newState = structuredClone(payload);

            if (!newState.sortDirection) {
                if (newState.sortKey === state.sortKey) {
                    newState.sortDirection =
                        state.sortDirection === sortDirections.ASCENDING
                            ? sortDirections.DESCENDING
                            : sortDirections.ASCENDING;
                }
                else {
                    newState.sortDirection = state.sortDirection;
                }
            }

            state = Object.assign(state, newState);
        },

        setIssuesTableOption: (
            state,
            {
                payload,
            }: PayloadAction<TableOptionsChangePayload<IssueColumnName>>,
        ) => {
            const newState = { ...state };
            state = Object.assign(newState, payload);
        },
    },
});

export const { setIssuesSort, setIssuesTableOption } = IssueTableSlice.actions;

export default IssueTableSlice;
