// IMPORTS

// Redux
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

// Misc
import { icons, sortDirections } from 'Helpers/Props';

// Types
import type { EmptyObject } from 'type-fest';

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

interface _ExtraPropsMap {
    searchResults: {
        hideDownloaded: boolean;
        hideUnmonitored: boolean;
    };
}

export type ExtraPropsMap = {
    [Key in Exclude<keyof ColumnNameMap, keyof _ExtraPropsMap>]: EmptyObject;
} & _ExtraPropsMap;

export interface SetTableSortParams<T extends keyof ColumnNameMap> {
    tableName: T;
    sortKey: ColumnNameMap[T];
    sortDirection?: SortDirection | null;
}

export type SetTableOptionsParams<
    T extends keyof ColumnNameMap,
    ExtraProps extends ExtraPropsMap[T] = ExtraPropsMap[T],
> = {
    tableName: T;
    columns?: Column<ColumnNameMap[T]>[];
} & Partial<ExtraProps>;

export type TableState<
    T extends keyof ColumnNameMap,
    ExtraProps extends ExtraPropsMap[T] = ExtraPropsMap[T],
> = {
    sortKey: ColumnNameMap[T] | null;
    sortDirection: SortDirection | null;
    secondarySortKey: ColumnNameMap[T] | null;
    secondarySortDirection: SortDirection | null;
    columns: Column<ColumnNameMap[T]>[];
} & ExtraProps;

export interface TableOptionsState {
    sliceVersion: number;

    blocklistTable: TableState<'blocklistTable'>;
    changeMatch: TableState<'changeMatch'>;
    credentialTable: TableState<'credentialTable'>;
    folderTable: TableState<'folderTable'>;
    generalFiles: TableState<'generalFiles'>;
    historyTable: TableState<'historyTable'>;
    importProposals: TableState<'importProposals'>;
    issueSummary: TableState<'issueSummary'>;
    issueTable: TableState<'issueTable'>;
    queueTable: TableState<'queueTable'>;
    rootFolders: TableState<'rootFolders'>;
    searchResults: TableState<'searchResults'>;
    taskHistory: TableState<'taskHistory'>;
    taskPlanning: TableState<'taskPlanning'>;
    volumeIndex: TableState<'volumeIndex'>;
}

export type TableName = Exclude<keyof TableOptionsState, 'sliceVersion'>;

// IMPLEMENTATIONS

const initialState = {
    sliceVersion: 2,

    blocklistTable: {
        sortKey: null,
        sortDirection: null,

        secondarySortKey: null,
        secondarySortDirection: null,

        columns: [
            {
                name: 'source',
                isModifiable: false,
                isSortable: false,
                isVisible: true,
            },
            {
                name: 'volumeId',
                isModifiable: false,
                isSortable: false,
                isVisible: true,
            },
            {
                name: 'issueId',
                isModifiable: false,
                isSortable: false,
                isVisible: true,
            },
            {
                name: 'downloadLink',
                isModifiable: false,
                isSortable: false,
                isVisible: true,
            },
            {
                name: 'webLink',
                isModifiable: false,
                isSortable: false,
                isVisible: true,
            },
            {
                name: 'webTitle',
                isModifiable: false,
                isSortable: false,
                isVisible: true,
            },
            {
                name: 'webSubTitle',
                isModifiable: false,
                isSortable: false,
                isVisible: true,
            },
            {
                name: 'reason',
                isModifiable: false,
                isSortable: false,
                isVisible: true,
            },
            {
                name: 'addedAt',
                isModifiable: false,
                isSortable: false,
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

    changeMatch: {
        sortKey: 'title',
        sortDirection: sortDirections.ASCENDING,

        secondarySortKey: null,
        secondarySortDirection: null,

        columns: [
            {
                name: 'title',
                isModifiable: true,
                isSortable: true,
                isVisible: true,
            },
            {
                name: 'issueCount',
                isModifiable: true,
                isSortable: true,
                isVisible: true,
            },
            {
                name: 'actions',
                hideHeaderLabel: true,
                isModifiable: false,
                isSortable: true,
                isVisible: true,
            },
        ],
    },

    credentialTable: {
        sortKey: null,
        sortDirection: null,

        secondarySortKey: null,
        secondarySortDirection: null,

        columns: [
            {
                name: 'email',
                isModifiable: false,
                isSortable: false,
                isVisible: false,
            },
            {
                name: 'username',
                isModifiable: false,
                isSortable: false,
                isVisible: false,
            },
            {
                name: 'password',
                isModifiable: false,
                isSortable: false,
                isVisible: false,
            },
            {
                name: 'apiKey',
                isModifiable: false,
                isSortable: false,
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

    generalFiles: {
        sortKey: null,
        sortDirection: null,

        secondarySortKey: null,
        secondarySortDirection: null,

        columns: [
            {
                name: 'path',
                isModifiable: false,
                isSortable: false,
                isVisible: true,
            },
            {
                name: 'fileType',
                isModifiable: false,
                isSortable: false,
                isVisible: true,
            },
            {
                name: 'filesize',
                isModifiable: false,
                isSortable: false,
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

    folderTable: {
        sortKey: null,
        sortDirection: null,

        secondarySortKey: null,
        secondarySortDirection: null,

        columns: [
            {
                name: 'value',
                hideHeaderLabel: true,
                isModifiable: false,
                isSortable: false,
                isVisible: true,
                className: '',
            },
            {
                name: 'actions',
                isModifiable: false,
                isSortable: false,
                isVisible: true,
                className: '',
            },
        ],
    },

    historyTable: {
        sortKey: null,
        sortDirection: null,

        secondarySortKey: null,
        secondarySortDirection: null,

        columns: [
            {
                name: 'source',
                isModifiable: false,
                isSortable: false,
                isVisible: true,
            },
            {
                name: 'volumeId',
                isModifiable: false,
                isSortable: false,
                isVisible: false,
            },
            {
                name: 'issueId',
                isModifiable: false,
                isSortable: false,
                isVisible: false,
            },
            {
                name: 'webLink',
                isModifiable: false,
                isSortable: false,
                isVisible: true,
            },
            {
                name: 'webTitle',
                isModifiable: false,
                isSortable: false,
                isVisible: true,
            },
            {
                name: 'webSubTitle',
                isModifiable: false,
                isSortable: false,
                isVisible: true,
            },
            {
                name: 'fileTitle',
                isModifiable: false,
                isSortable: false,
                isVisible: true,
            },
            {
                name: 'downloadedAt',
                isModifiable: false,
                isSortable: false,
                isVisible: true,
            },
            {
                name: 'success',
                isModifiable: false,
                isSortable: false,
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

    importProposals: {
        sortKey: null,
        sortDirection: null,

        secondarySortKey: null,
        secondarySortDirection: null,

        columns: [
            {
                name: 'file',
                isSortable: false,
                isModifiable: false,
                isVisible: true,
            },
            {
                name: 'cvLink',
                isSortable: false,
                isModifiable: false,
                isVisible: true,
            },
            {
                name: 'issueCount',
                isSortable: false,
                isModifiable: false,
                isVisible: true,
            },
            {
                name: 'actions',
                hideHeaderLabel: true,
                isSortable: false,
                isModifiable: false,
                isVisible: true,
            },
        ],
    },

    issueSummary: {
        sortKey: null,
        sortDirection: null,

        secondarySortKey: null,
        secondarySortDirection: null,

        columns: [
            {
                name: 'path',
                isModifiable: false,
                isSortable: false,
                isVisible: true,
            },
            {
                name: 'filesize',
                isModifiable: false,
                isSortable: false,
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

    issueTable: {
        sortKey: 'issueNumber',
        sortDirection: sortDirections.DESCENDING,

        secondarySortKey: null,
        secondarySortDirection: null,

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

        secondarySortKey: null,
        secondarySortDirection: null,

        columns: [
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

    rootFolders: {
        sortKey: null,
        sortDirection: null,

        secondarySortKey: null,
        secondarySortDirection: null,

        columns: [
            {
                name: 'path',
                isModifiable: false,
                isSortable: false,
                isVisible: true,
            },
            {
                name: 'freeSpace',
                isModifiable: false,
                isSortable: false,
                isVisible: true,
            },
            {
                name: 'totalSpace',
                isModifiable: false,
                isSortable: false,
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
        hideDownloaded: false,
        hideUnmonitored: false,

        sortKey: 'issueNumber',
        sortDirection: sortDirections.DESCENDING,

        secondarySortKey: null,
        secondarySortDirection: null,

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

    taskHistory: {
        sortKey: null,
        sortDirection: null,

        secondarySortKey: null,
        secondarySortDirection: null,

        columns: [
            {
                name: 'displayTitle',
                isModifiable: false,
                isSortable: false,
                isVisible: true,
            },
            {
                name: 'runAt',
                isModifiable: false,
                isSortable: false,
                isVisible: true,
            },
        ],
    },

    taskPlanning: {
        sortKey: null,
        sortDirection: null,

        secondarySortKey: null,
        secondarySortDirection: null,

        columns: [
            {
                name: 'displayName',
                isModifiable: false,
                isSortable: false,
                isVisible: true,
            },
            {
                name: 'interval',
                isModifiable: false,
                isSortable: false,
                isVisible: true,
            },
            {
                name: 'lastRun',
                isModifiable: false,
                isSortable: false,
                isVisible: true,
            },
            {
                name: 'nextRun',
                isModifiable: false,
                isSortable: false,
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

        secondarySortKey: null,
        secondarySortDirection: null,

        columns: [
            {
                name: 'monitored',
                hideHeaderLabel: true,
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
        setTableSort: <T extends TableName>(
            state: TableOptionsState,
            {
                payload: { tableName, sortKey, sortDirection = null },
            }: PayloadAction<SetTableSortParams<T>>,
        ) => {
            const currentState = state[tableName];

            if (currentState.sortKey === sortKey) {
                if (sortDirection) {
                    state[tableName].sortDirection = sortDirection;
                }
                else {
                    // cycle sortDirection
                    switch (currentState.sortDirection) {
                        case sortDirections.DESCENDING: {
                            state[tableName].sortKey = null;
                            state[tableName].sortDirection = null;
                            break;
                        }
                        case sortDirections.ASCENDING: {
                            state[tableName].sortDirection =
                                sortDirections.DESCENDING;
                            break;
                        }
                        case null: {
                            state[tableName].sortDirection =
                                sortDirections.ASCENDING;
                            break;
                        }
                    }
                }
            }
            else if (currentState.secondarySortKey === sortKey) {
                if (sortDirection) {
                    state[tableName].secondarySortDirection = sortDirection;
                }
                else {
                    // cycle secondarySortDirection
                    switch (currentState.secondarySortDirection) {
                        case sortDirections.DESCENDING: {
                            state[tableName].secondarySortKey = null;
                            state[tableName].secondarySortDirection = null;
                            break;
                        }
                        case sortDirections.ASCENDING: {
                            state[tableName].secondarySortDirection =
                                sortDirections.DESCENDING;
                            break;
                        }
                        case null: {
                            state[tableName].secondarySortDirection =
                                sortDirections.ASCENDING;
                            break;
                        }
                    }
                }
            }
            else if (currentState.sortKey === null) {
                // init sortKey
                state[tableName].sortKey = sortKey;
                state[tableName].sortDirection =
                    sortDirection ?? sortDirections.ASCENDING;
            }
            else {
                // init secondarySortKey
                state[tableName].secondarySortKey = sortKey;
                state[tableName].secondarySortDirection =
                    sortDirection ?? sortDirections.ASCENDING;
            }
        },

        setTableOptions: <T extends TableName>(
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
export const setTableSort = <T extends TableName>(
    payload: SetTableSortParams<T>,
) => TableOptionsSlice.actions.setTableSort(payload);

export const setTableOptions = <T extends TableName>(
    payload: SetTableOptionsParams<T>,
) => TableOptionsSlice.actions.setTableOptions(payload);

export default TableOptionsSlice;
