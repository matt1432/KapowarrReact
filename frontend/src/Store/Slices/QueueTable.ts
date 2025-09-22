// IMPORTS

// Redux
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

// Misc
import { sortDirections } from 'Helpers/Props';

// Types
import type { SortDirection } from 'Helpers/Props/sortDirections';
import type { QueueColumnName } from 'Activity/Queue';
import type { TableOptionsChangePayload } from 'typings/Table';

export interface QueueTableState {
    sortKey: QueueColumnName;
    sortDirection: SortDirection;
}

export interface SetQueueSortParams {
    sortKey: QueueColumnName;
    sortDirection?: SortDirection;
}

// IMPLEMENTATIONS

const initialState = {
    sortKey: 'priority',
    sortDirection: sortDirections.ASCENDING,
} satisfies QueueTableState as QueueTableState;

const QueueTableSlice = createSlice({
    name: 'queueTable',
    initialState,
    reducers: {
        setQueueSort: (state, { payload }: PayloadAction<SetQueueSortParams>) => {
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

        setQueueTableOption: (
            state,
            { payload }: PayloadAction<TableOptionsChangePayload<QueueColumnName>>,
        ) => {
            state = Object.assign(state, payload);
        },
    },
});

export const { setQueueSort, setQueueTableOption } = QueueTableSlice.actions;

export default QueueTableSlice;
