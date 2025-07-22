import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Column } from 'Components/Table/Column';
import { sortDirections } from 'Helpers/Props';
import type { SortDirection } from 'Helpers/Props/sortDirections';
import type { TableOptionsChangePayload } from 'typings/Table';
import translate from 'Utilities/String/translate';
import type { IndexFilter, IndexSort, IndexView } from 'Volume/Index';
import type { VolumeColumnName } from 'Volume/Volume';

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
        columns: Column<VolumeColumnName>[];
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
                columnLabel: () => translate('Status'),
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
                name: 'specialVersion',
                label: () => translate('SpecialVersion'),
                isSortable: false,
                isVisible: true,
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
                name: 'issueProgress',
                label: () => translate('Issues'),
                isSortable: true,
                isVisible: true,
            },
            {
                name: 'issueCount',
                label: () => translate('IssueCount'),
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
                name: 'releaseGroups',
                label: () => translate('ReleaseGroups'),
                isSortable: true,
                isVisible: false,
            },
            {
                name: 'monitorNewItems',
                label: () => translate('MonitorNewItems'),
                isSortable: true,
                isVisible: false,
            },
            {
                name: 'actions',
                columnLabel: () => translate('Actions'),
                isVisible: true,
                isModifiable: false,
            },
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
            { payload }: PayloadAction<TableOptionsChangePayload<VolumeColumnName>>,
        ) => {
            state.tableOptions = Object.assign(state.tableOptions, payload);
        },

        setVolumePosterOption: (
            state,
            { payload }: PayloadAction<TableOptionsChangePayload<VolumeColumnName>>,
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
