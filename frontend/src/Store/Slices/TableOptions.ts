// IMPORTS

// Redux
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

// Misc
import { icons, sortDirections } from 'Helpers/Props';

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

interface TableState<T extends keyof ColumnNameMap> {
    sortKey: ColumnNameMap[T];
    sortDirection: SortDirection;
    columns: Column<ColumnNameMap[T]>[];
}

export interface TableOptionsState {
    issueTable: TableState<'issueTable'>;
    queueTable: TableState<'queueTable'>;
    searchResults: TableState<'searchResults'>;
    volumeIndex: TableState<'volumeIndex'>;
}

// IMPLEMENTATIONS

const initialState = {
    issueTable: {
        sortKey: 'issueNumber',
        sortDirection: sortDirections.DESCENDING,
        columns: [
            {
                name: 'monitored',
                hideHeaderLabel: true,
                isModifiable: false,
                isSortable: true,
                isVisible: true,
            },
            {
                name: 'issueNumber',
                isModifiable: true,
                isSortable: true,
                isVisible: true,
            },
            {
                name: 'title',
                isModifiable: true,
                isSortable: true,
                isVisible: true,
            },
            {
                name: 'path',
                isModifiable: true,
                isSortable: true,
                isVisible: false,
            },
            {
                name: 'relativePath',
                isModifiable: true,
                isSortable: true,
                isVisible: false,
            },
            {
                name: 'size',
                isModifiable: true,
                isSortable: true,
                isVisible: false,
            },
            {
                name: 'releaseGroup',
                isModifiable: true,
                isSortable: true,
                isVisible: false,
            },
            {
                name: 'status',
                isModifiable: true,
                isSortable: true,
                isVisible: true,
            },
            {
                name: 'actions',
                hideHeaderLabel: true,
                isModifiable: false,
                isSortable: false,
                isVisible: true,
            },
        ],
    },
    queueTable: {
        sortKey: 'priority',
        sortDirection: sortDirections.ASCENDING,
        columns: [
            {
                name: 'drag',
                hideHeaderLabel: true,
                isModifiable: false,
                isSortable: false,
                isVisible: true,
            },
            {
                name: 'priority',
                isModifiable: true,
                isSortable: true,
                isVisible: true,
            },
            {
                name: 'status',
                isModifiable: true,
                isSortable: true,
                isVisible: true,
            },
            {
                name: 'title',
                isModifiable: true,
                isSortable: true,
                isVisible: true,
            },
            {
                name: 'sourceName',
                isModifiable: true,
                isSortable: true,
                isVisible: true,
            },
            {
                name: 'size',
                isModifiable: true,
                isSortable: true,
                isVisible: true,
            },
            {
                name: 'speed',
                isModifiable: true,
                isSortable: true,
                isVisible: true,
            },
            {
                name: 'timeLeft',
                isModifiable: true,
                isSortable: true,
                isVisible: true,
            },
            {
                name: 'progress',
                isModifiable: true,
                isSortable: true,
                isVisible: true,
            },
            {
                name: 'actions',
                hideHeaderLabel: true,
                isModifiable: false,
                isSortable: false,
                isVisible: true,
            },
        ],
    },
    searchResults: {
        sortKey: 'issueNumber',
        sortDirection: sortDirections.ASCENDING,
        columns: [
            {
                name: 'match',
                isModifiable: false,
                isSortable: true,
                isVisible: true,
            },
            {
                name: 'issueNumber',
                isModifiable: false,
                isSortable: true,
                isVisible: true,
            },
            {
                name: 'displayTitle',
                isModifiable: false,
                isSortable: true,
                isVisible: true,
            },
            {
                name: 'filesize',
                isModifiable: false,
                isSortable: true,
                isVisible: true,
            },
            {
                name: 'pages',
                isModifiable: false,
                isSortable: true,
                isVisible: true,
            },
            {
                name: 'releaser',
                isModifiable: false,
                isSortable: true,
                isVisible: true,
            },
            {
                name: 'scanType',
                isModifiable: false,
                isSortable: true,
                isVisible: true,
            },
            {
                name: 'resolution',
                isModifiable: false,
                isSortable: true,
                isVisible: true,
            },
            {
                name: 'dpi',
                isModifiable: false,
                isSortable: true,
                isVisible: true,
            },
            {
                name: 'source',
                isModifiable: false,
                isSortable: true,
                isVisible: true,
            },
            {
                name: 'matchRejections',
                icon: {
                    name: icons.DANGER,
                    title: 'Rejections',
                },
                isModifiable: false,
                isSortable: true,
                fixedSortDirection: sortDirections.ASCENDING,
                isVisible: true,
            },
            {
                name: 'actions',
                hideHeaderLabel: true,
                isModifiable: false,
                isSortable: false,
                isVisible: true,
            },
        ],
    },
    volumeIndex: {
        sortKey: 'title',
        sortDirection: sortDirections.ASCENDING,
        columns: [
            {
                name: 'monitored',
                isModifiable: false,
                isSortable: true,
                isVisible: true,
            },
            {
                name: 'title',
                isModifiable: false,
                isSortable: true,
                isVisible: true,
            },
            {
                name: 'year',
                isModifiable: false,
                isSortable: true,
                isVisible: true,
            },
            {
                name: 'publisher',
                isModifiable: false,
                isSortable: true,
                isVisible: true,
            },
            {
                name: 'issuesDownloadedMonitored',
                isModifiable: false,
                isSortable: true,
                isVisible: true,
            },
            {
                name: 'issueCountMonitored',
                isModifiable: false,
                isSortable: true,
                isVisible: false,
            },
            {
                name: 'folder',
                isModifiable: false,
                isSortable: true,
                isVisible: false,
            },
            {
                name: 'totalSize',
                isModifiable: false,
                isSortable: true,
                isVisible: false,
            },
            {
                name: 'monitorNewIssues',
                isModifiable: false,
                isSortable: true,
                isVisible: false,
            },
            {
                name: 'actions',
                hideHeaderLabel: true,
                isModifiable: false,
                isSortable: false,
                isVisible: true,
            },
        ],
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
