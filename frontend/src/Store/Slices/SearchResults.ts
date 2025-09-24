// IMPORTS

// Redux
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

// Misc
import { sortDirections } from 'Helpers/Props';

// Types
import type { SortDirection } from 'Helpers/Props/sortDirections';
import type { InteractiveSearchSort } from 'typings/Search';

export interface SetVolumeSortParams {
    sortKey: InteractiveSearchSort;
    sortDirection?: SortDirection;
}

// IMPLEMENTATIONS

export interface SearchResultsState {
    sortKey: InteractiveSearchSort;
    sortDirection: SortDirection;
}

const initialState = {
    sortKey: 'issueNumber',
    sortDirection: sortDirections.ASCENDING,
} satisfies SearchResultsState as SearchResultsState;

const SearchResultsSlice = createSlice({
    name: 'searchResults',
    initialState,
    reducers: {
        setInteractiveSearchSort: (
            state,
            { payload }: PayloadAction<SetVolumeSortParams>,
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
    },
});

export const { setInteractiveSearchSort } = SearchResultsSlice.actions;

export default SearchResultsSlice;
