// IMPORTS

// React
import { useCallback, useEffect, useRef } from 'react';

// Redux
import { useRootDispatch, useRootSelector } from 'Store/createAppStore';
import { setIssuesSort, setIssuesTableOption } from 'Store/Slices/IssueTable';

import { useToggleIssueMonitoredMutation } from 'Store/Api/Issue';
import { useSearchVolumeQuery } from 'Store/Api/Volumes';

// Misc
import formatBytes from 'Utilities/Number/formatBytes';
import getToggledRange from 'Utilities/Table/getToggledRange';

// General Components
import SortedTable from 'Components/Table/SortedTable';

// Specific Components
import IssueRow from '../IssueRow';

// CSS
import styles from './index.module.css';

// Types
import type { SortDirection } from 'Helpers/Props/sortDirections';
import type { TableOptionsChangePayload } from 'typings/Table';
import type { IssueColumnName, IssueData, IssueFileData } from 'Issue/Issue';

export interface IssueRowData extends IssueData {
    issue: IssueData;
    issueFile: IssueFileData | undefined;
    path: string | undefined;
    relativePath: string | undefined;
    size: string;
    releaseGroup: string | undefined;
    status: undefined;
    actions: undefined;
}

interface IssueTableProps {
    volumeId: number;
}

// IMPLEMENTATIONS

function useIssuesSelector(volumeId: number) {
    return useSearchVolumeQuery(
        { volumeId },
        {
            selectFromResult: ({ data }) => {
                const volumeFolder = data?.folder;

                return {
                    volumeMonitored: Boolean(data?.monitored),
                    issues: (data?.issues ?? []).map((issue) => {
                        const issueFile = issue.files?.find(
                            (file) => !file.isImageFile && !file.isMetadataFile,
                        );

                        return {
                            ...issue,
                            issue,
                            issueFile,
                            path: issueFile?.filepath,
                            relativePath:
                                volumeFolder &&
                                issueFile?.filepath?.replace(volumeFolder, '')?.slice(1),
                            size: formatBytes(
                                issue.files.reduce((acc, issue) => (acc += issue.size), 0),
                            ),
                            releaseGroup: issue?.files.find((f) => f.releaser)?.releaser ?? '',
                            status: undefined,
                            actions: undefined,
                        } satisfies IssueRowData as IssueRowData;
                    }),
                };
            },
        },
    );
}

function IssueTable({ volumeId }: IssueTableProps) {
    const dispatch = useRootDispatch();

    const { issues, volumeMonitored, refetch } = useIssuesSelector(volumeId);
    const { columns, sortKey, sortDirection } = useRootSelector((state) => state.issueTable);

    const [toggleIssueMonitored, toggleIssueMonitoredState] = useToggleIssueMonitoredMutation();

    useEffect(() => {
        if (toggleIssueMonitoredState.isSuccess) {
            refetch();
        }
    }, [refetch, toggleIssueMonitoredState]);

    const lastToggledIssue = useRef<number | null>(null);

    const handleMonitorIssuePress = useCallback(
        (issueId: number, monitored: boolean, { shiftKey }: { shiftKey: boolean }) => {
            const lastToggled = lastToggledIssue.current;
            const issueIds = [issueId];

            if (shiftKey && lastToggled) {
                const { lower, upper } = getToggledRange(issues, issueId, lastToggled);

                for (let i = lower; i < upper; i++) {
                    issueIds.push(issues[i].id);
                }
            }

            lastToggledIssue.current = issueId;

            issueIds.forEach((issueId) => {
                toggleIssueMonitored({
                    issueId,
                    monitored,
                });
            });
        },
        [issues, toggleIssueMonitored],
    );

    const handleSortPress = useCallback(
        (sortKey: IssueColumnName, sortDirection?: SortDirection) => {
            dispatch(
                setIssuesSort({
                    sortKey: sortKey,
                    sortDirection,
                }),
            );
        },
        [dispatch],
    );

    const handleTableOptionChange = useCallback(
        (payload: TableOptionsChangePayload<IssueColumnName>) => {
            dispatch(setIssuesTableOption(payload));
        },
        [dispatch],
    );

    return (
        <div className={styles.issues}>
            <SortedTable
                columns={columns}
                sortKey={sortKey}
                sortDirection={sortDirection}
                onSortPress={handleSortPress}
                tableProps={{
                    onTableOptionChange: handleTableOptionChange,
                }}
                items={issues}
                itemRenderer={(issue) => (
                    <IssueRow
                        key={issue.id}
                        columns={columns}
                        isSaving={toggleIssueMonitoredState.isLoading}
                        onMonitorIssuePress={handleMonitorIssuePress}
                        volumeMonitored={volumeMonitored}
                        {...issue}
                    />
                )}
                predicates={{
                    issueNumber: (a, b) => a.calculatedIssueNumber - b.calculatedIssueNumber,
                }}
            />
        </div>
    );
}

export default IssueTable;
