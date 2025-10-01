// IMPORTS

// Redux
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

// Types
import type { Size } from 'Helpers/Props/sizes';
import type { SortDirection } from 'Helpers/Props/sortDirections';
import type { IndexFilter, IndexSort, IndexView } from 'Volume/Index';

export interface SetVolumeSortParams {
    sortKey: IndexSort;
    sortDirection?: SortDirection;
}

// IMPLEMENTATIONS

export interface VolumeIndexState {
    sliceVersion: number;

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
    };
}

const initialState = {
    sliceVersion: 0,

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
            }: PayloadAction<Partial<VolumeIndexState['tableOptions']>>,
        ) => {
            state.tableOptions = Object.assign(state.tableOptions, payload);
        },

        setVolumePosterOption: (
            state,
            {
                payload,
            }: PayloadAction<Partial<VolumeIndexState['posterOptions']>>,
        ) => {
            state.posterOptions = Object.assign(state.posterOptions, payload);
        },
    },
});

export const {
    setVolumeFilter,
    setVolumeView,
    setVolumeTableOption,
    setVolumePosterOption,
} = VolumeIndexSlice.actions;

export default VolumeIndexSlice;
