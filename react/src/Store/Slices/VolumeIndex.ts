import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Column } from 'Components/Table/Column';
import { sortDirections } from 'Helpers/Props';
import type { SortDirection } from 'Helpers/Props/sortDirections';
import translate from 'Utilities/String/translate';
import type { IndexFilter, IndexSort, IndexView } from 'Volume/Index';

export interface VolumeIndexState {
    sortKey: IndexSort;
    sortDirection: SortDirection;
    secondarySortKey: IndexSort;
    secondarySortDirection: SortDirection;
    view: IndexView;
    filterKey: IndexFilter;

    // TODO: persist this state
    posterOptions: {
        detailedProgressBar: boolean;
        size: string;
        showTitle: boolean;
        showMonitored: boolean;
        showSearchAction: boolean;
    };

    // TODO: persist this state
    tableOptions: {
        showSearchAction: boolean;
        pageSize: number;
        columns: Column[];
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
        showTitle: true,
        showMonitored: true,
        showSearchAction: false,
    },

    tableOptions: {
        showSearchAction: false,
        pageSize: 20,

        columns: [
            {
                name: 'wanted',
                // columnLabel: () => translate('Status'),
                label: () => translate('Status'),
                isSortable: true,
                isVisible: true,
                isModifiable: false,
            },
            {
                name: 'title',
                label: () => translate('VolumeTitle'),
                isSortable: true,
                isVisible: true,
                isModifiable: false,
            },
            {
                name: 'year',
                label: () => translate('Year'),
                isSortable: true,
                isVisible: true,
            },
            {
                name: 'publisher',
                label: () => translate('Publisher'),
                isSortable: true,
                isVisible: true,
            },
            {
                name: 'recently_added',
                label: () => translate('RecentlyAdded'),
                isSortable: true,
                isVisible: true,
            },
            {
                name: 'recently_released',
                label: () => translate('RecentlyReleased'),
                isSortable: true,
                isVisible: false,
            },
            // TODO: check how to implement these columns
            /*
        {
            name: 'episodeProgress',
            label: () => translate('Episodes'),
            isSortable: true,
            isVisible: true,
        },
        {
            name: 'episodeCount',
            label: () => translate('EpisodeCount'),
            isSortable: true,
            isVisible: false,
        },
        {
            name: 'path',
            label: () => translate('Path'),
            isSortable: true,
            isVisible: false,
        },
        {
            name: 'sizeOnDisk',
            label: () => translate('SizeOnDisk'),
            isSortable: true,
            isVisible: false,
        },
        {
            name: 'monitorNewItems',
            label: () => translate('MonitorNewSeasons'),
            isSortable: true,
            isVisible: false,
        },
        {
            name: 'actions',
            columnLabel: () => translate('Actions'),
            isVisible: true,
            isModifiable: false,
        },
        */
        ],
    },
} satisfies VolumeIndexState as VolumeIndexState;

const volumeIndexSlice = createSlice({
    name: 'volumeIndex',
    initialState,
    selectors: {},
    reducers: {
        setVolumeFilter: (state, { payload }: PayloadAction<IndexFilter>) => {
            state.filterKey = payload;
        },

        setVolumeSort: (state, { payload }: PayloadAction<IndexSort>) => {
            state.sortKey = payload;
        },

        setVolumeView: (state, { payload }: PayloadAction<IndexView>) => {
            state.view = payload;
        },

        setVolumeTableOption: (
            state,
            { payload }: PayloadAction<Partial<VolumeIndexState['tableOptions']>>,
        ) => {
            state.tableOptions = Object.assign(state.tableOptions, payload);
        },

        setVolumePosterOption: (
            state,
            { payload }: PayloadAction<Partial<VolumeIndexState['posterOptions']>>,
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
} = volumeIndexSlice.actions;

export default volumeIndexSlice;
