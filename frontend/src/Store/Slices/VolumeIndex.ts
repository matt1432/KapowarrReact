// IMPORTS

// Redux
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

// Misc
import { sortDirections } from 'Helpers/Props';

// Types
import type { Size } from 'Helpers/Props/sizes';
import type { SortDirection } from 'Helpers/Props/sortDirections';
import type { TableOptionsChangePayload } from 'typings/Table';
import type { IndexFilter, IndexSort, IndexView } from 'Volume/Index';
import type { VolumeColumnName } from 'Volume/Volume';

export interface SetVolumeSortParams {
    sortKey: IndexSort;
    sortDirection?: SortDirection;
}

// IMPLEMENTATIONS

export interface VolumeIndexState {
    sortKey: IndexSort;
    sortDirection: SortDirection;
    secondarySortKey: IndexSort;
    secondarySortDirection: SortDirection;
    view: IndexView;
    filterKey: IndexFilter;

    posterOptions: {
        detailedProgressBar: boolean;
        size: Size;
        showFolder: boolean;
        showMonitored: boolean;
        showSearchAction: boolean;
        showSizeOnDisk: boolean;
        showTitle: boolean;
    };

    tableOptions: {
        showSearchAction: boolean;
        pageSize: number;
    };
}

const initialState = {
    sortKey: 'title',
    sortDirection: sortDirections.ASCENDING,
    secondarySortKey: 'title',
    secondarySortDirection: sortDirections.ASCENDING,
    view: 'posters',
    filterKey: '', // equivalent to 'all'

    posterOptions: {
        detailedProgressBar: true,
        size: 'large',
        showFolder: false,
        showMonitored: true,
        showSearchAction: false,
        showSizeOnDisk: false,
        showTitle: true,
    },

    tableOptions: {
        showSearchAction: false,
        pageSize: 20,
    },
} satisfies VolumeIndexState as VolumeIndexState;

const VolumeIndexSlice = createSlice({
    name: 'volumeIndex',
    initialState,
    reducers: {
        setVolumeFilter: (
            state,
            { payload: value }: PayloadAction<IndexFilter>,
        ) => {
            state.filterKey = value;
        },

        setVolumeSort: (
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

        setVolumeView: (
            state,
            { payload: value }: PayloadAction<IndexView>,
        ) => {
            state.view = value;
        },

        setVolumeTableOption: (
            state,
            {
                payload,
            }: PayloadAction<TableOptionsChangePayload<VolumeColumnName>>,
        ) => {
            state.tableOptions = Object.assign(state.tableOptions, payload);
        },

        setVolumePosterOption: (
            state,
            {
                payload,
            }: PayloadAction<TableOptionsChangePayload<VolumeColumnName>>,
        ) => {
            state.posterOptions = Object.assign(state.posterOptions, payload);
        },
    },
});

export const {
    setVolumeFilter,
    setVolumeSort,
    setVolumeView,
    setVolumeTableOption,
    setVolumePosterOption,
} = VolumeIndexSlice.actions;

export default VolumeIndexSlice;
