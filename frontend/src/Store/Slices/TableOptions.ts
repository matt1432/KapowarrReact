// IMPORTS

// Redux
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

// Misc
import { sortDirections } from 'Helpers/Props';

// Types
import type { Column } from 'Components/Table/Column';
import type { SortDirection } from 'Helpers/Props/sortDirections';

// Column Names
import type { IssueColumnName, IssueSummaryColumnName } from 'Issue/Issue';
import type { QueueColumnName } from 'Activity/Queue';
import type { InteractiveSearchSort } from 'typings/Search';
import type { IndexSort } from 'Volume/Index';
import type { GeneralFilesColumnName } from 'Volume/GeneralFiles/GeneralFilesModalContent';
import type { TaskPlanningColumnName } from 'System/Tasks/Scheduled';
import type { TaskHistoryColumnName } from 'System/Tasks/History';
import type { RootFolderColumnName } from 'Settings/MediaManagement/RootFolders';
import type { CredentialColumnName } from 'Settings/DownloadClientSettings/BuiltInClients/CredentialTable';
import type { HistoryColumnName } from 'History';
import type { ProposalColumnName } from 'AddVolume/ImportVolume/ImportProposals';
import type { ChangeMatchColumnName } from 'AddVolume/ImportVolume/ImportProposals/ChangeMatch/ChangeMatchModalContent';
import type { FolderTableColumnName } from 'AddVolume/ImportVolume/ImportForm/FolderTable';
import type { BlocklistColumnName } from 'Activity/Blocklist/BlocklistTable';

export interface ColumnNameMap {
    blocklistTable: BlocklistColumnName;
    changeMatch: ChangeMatchColumnName;
    credentialTable: CredentialColumnName;
    folderTable: FolderTableColumnName;
    generalFiles: GeneralFilesColumnName;
    historyTable: HistoryColumnName;
    importProposals: ProposalColumnName;
    issueSummary: IssueSummaryColumnName;
    issueTable: IssueColumnName;
    queueTable: QueueColumnName;
    rootFolders: RootFolderColumnName;
    searchResults: InteractiveSearchSort;
    taskHistory: TaskHistoryColumnName;
    taskPlanning: TaskPlanningColumnName;
    volumeIndex: IndexSort;
}

export interface SetTableSortParams<T extends keyof ColumnNameMap> {
    tableName: T;
    sortKey: ColumnNameMap[T];
    sortDirection?: SortDirection;
}

export interface SetTableOptionsParams<T extends keyof ColumnNameMap> {
    tableName: T;
    columns: Column<ColumnNameMap[T]>[];
}

// TODO: add columns here
export interface TableOptionsState {
    issueTable: {
        sortKey: IssueColumnName;
        sortDirection: SortDirection;
    };
    queueTable: {
        sortKey: QueueColumnName;
        sortDirection: SortDirection;
    };
    searchResults: {
        sortKey: InteractiveSearchSort;
        sortDirection: SortDirection;
    };
    volumeIndex: {
        sortKey: IndexSort;
        sortDirection: SortDirection;
    };
}

// IMPLEMENTATIONS

const initialState = {
    issueTable: {
        sortKey: 'issueNumber',
        sortDirection: sortDirections.ASCENDING,
    },
    queueTable: {
        sortKey: 'priority',
        sortDirection: sortDirections.ASCENDING,
    },
    searchResults: {
        sortKey: 'issueNumber',
        sortDirection: sortDirections.ASCENDING,
    },
    volumeIndex: {
        sortKey: 'title',
        sortDirection: sortDirections.ASCENDING,
    },
} satisfies TableOptionsState as TableOptionsState;

const TableOptionsSlice = createSlice({
    name: 'tableOptions',
    initialState,
    reducers: {
        setTableSort: <T extends keyof TableOptionsState>(
            state: TableOptionsState,
            {
                payload: { tableName, sortKey, sortDirection },
            }: PayloadAction<SetTableSortParams<T>>,
        ) => {
            const newState = { sortKey, sortDirection };

            if (!newState.sortDirection) {
                if (newState.sortKey === state[tableName].sortKey) {
                    newState.sortDirection =
                        state[tableName].sortDirection ===
                        sortDirections.ASCENDING
                            ? sortDirections.DESCENDING
                            : sortDirections.ASCENDING;
                }
                else {
                    newState.sortDirection = state[tableName].sortDirection;
                }
            }

            state[tableName] = Object.assign(state[tableName], newState);
        },

        setTableOptions: <T extends keyof TableOptionsState>(
            state: TableOptionsState,
            {
                payload: { tableName, ...options },
            }: PayloadAction<SetTableOptionsParams<T>>,
        ) => {
            const newState = { ...state[tableName] };
            state[tableName] = Object.assign(newState, options);
        },
    },
});

// This fixes generic types
export const setTableSort = <T extends keyof TableOptionsState>(
    payload: SetTableSortParams<T>,
) => TableOptionsSlice.actions.setTableSort(payload);

export const setTableOptions = <T extends keyof TableOptionsState>(
    payload: SetTableOptionsParams<T>,
) => TableOptionsSlice.actions.setTableOptions(payload);

export default TableOptionsSlice;
