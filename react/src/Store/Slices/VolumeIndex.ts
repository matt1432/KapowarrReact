// IMPORTS

// Redux
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

// Misc
import { sortDirections } from 'Helpers/Props';

import translate from 'Utilities/String/translate';

// Types
import type { Column } from 'Components/Table/Column';
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
        size: string;
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

    columns: Column<VolumeColumnName>[];
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
} satisfies VolumeIndexState as VolumeIndexState;

const VolumeIndexSlice = createSlice({
    name: 'volumeIndex',
    initialState,
    reducers: {
        setVolumeFilter: (state, { payload: value }: PayloadAction<IndexFilter>) => {
            state.filterKey = value;
        },

        setVolumeSort: (state, { payload }: PayloadAction<SetVolumeSortParams>) => {
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

        setVolumeView: (state, { payload: value }: PayloadAction<IndexView>) => {
            state.view = value;
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
} = VolumeIndexSlice.actions;

export default VolumeIndexSlice;
