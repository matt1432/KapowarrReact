import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Column } from 'Components/Table/Column';
import { sortDirections } from 'Helpers/Props';
import type { SortDirection } from 'Helpers/Props/sortDirections';
import translate from 'Utilities/String/translate';
import type { IndexFilter, IndexSort, IndexView } from 'Volumes/Index';

export interface VolumesIndexState {
    sortKey: IndexSort;
    sortDirection: SortDirection;
    secondarySortKey: IndexSort;
    secondarySortDirection: SortDirection;
    view: IndexView;
    filterKey: IndexFilter;

    posterOptions: {
        detailedProgressBar: boolean;
        size: string;
        showTitle: boolean;
        showMonitored: boolean;
        showSearchAction: boolean;
    };

    tableOptions: {
        showBanners: boolean;
        showSearchAction: boolean;
        pageSize: number;
        columns: Column[];
    };

    // TODO: predicates?
}

const initialState = {
    sortKey: 'title',
    sortDirection: sortDirections.ASCENDING,
    secondarySortKey: 'title',
    secondarySortDirection: sortDirections.ASCENDING,
    view: 'posters',
    filterKey: '', // equivalent to 'all'

    posterOptions: {
        detailedProgressBar: false,
        size: 'large',
        showTitle: false,
        showMonitored: true,
        showSearchAction: false,
    },

    tableOptions: {
        showBanners: false,
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
} satisfies VolumesIndexState as VolumesIndexState;

const volumesIndexSlice = createSlice({
    name: 'volumesIndex',
    initialState,
    selectors: {},
    reducers: {
        setVolumesFilter: (state, { payload }: PayloadAction<IndexFilter>) => {
            state.filterKey = payload;
        },

        setVolumesSort: (state, { payload }: PayloadAction<IndexSort>) => {
            state.sortKey = payload;
        },

        setVolumesView: (state, { payload }: PayloadAction<IndexView>) => {
            state.view = payload;
        },

        setVolumesTableOption: (
            state,
            { payload }: PayloadAction<Partial<VolumesIndexState['tableOptions']>>,
        ) => {
            state.tableOptions = {
                ...payload,
                ...state.tableOptions,
            };
        },

        setVolumesPosterOption: (
            state,
            { payload }: PayloadAction<Partial<VolumesIndexState['posterOptions']>>,
        ) => {
            state.posterOptions = {
                ...payload,
                ...state.posterOptions,
            };
        },
    },
});

export const {
    setVolumesFilter,
    setVolumesSort,
    setVolumesView,
    setVolumesTableOption,
    setVolumesPosterOption,
} = volumesIndexSlice.actions;

export default volumesIndexSlice;
