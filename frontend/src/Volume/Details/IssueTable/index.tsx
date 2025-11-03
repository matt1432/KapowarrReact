// IMPORTS

// React
import { useCallback, useRef, useState } from 'react';

// Redux
import { useRootSelector } from 'Store/createAppStore';

import { useUpdateIssueMutation } from 'Store/Api/Issues';
import { useSearchVolumeQuery } from 'Store/Api/Volumes';

// Misc
import { socketEvents } from 'Helpers/Props';

import formatBytes from 'Utilities/Number/formatBytes';
import getToggledRange from 'Utilities/Table/getToggledRange';

// Hooks
import useSocketCallback from 'Helpers/Hooks/useSocketCallback';

// General Components
import SortedTable from 'Components/Table/SortedTable';

// Specific Components
import IssueRow from '../IssueRow';

// CSS
import styles from './index.module.css';

// Types
import type { IssueData, IssueFileData } from 'Issue/Issue';
import type { SocketEventHandler } from 'typings/Socket';

export interface IssueRowData extends IssueData {
    issue: IssueData;
    issueFile: IssueFileData | undefined;
    path: string | undefined;
    relativePath: string | undefined;
    size: string;
    releaseGroup: string | undefined;

    // Columns
    status: never;
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
                                issueFile?.filepath
                                    ?.replace(volumeFolder, '')
                                    ?.slice(1),
                            size: formatBytes(
                                issue.files.reduce(
                                    (acc, issue) => (acc += issue.size),
                                    0,
                                ),
                            ),
                            releaseGroup:
                                issue?.files.find((f) => f.releaser)
                                    ?.releaser ?? '',
                        } as IssueRowData;
                    }),
                };
            },
        },
    );
}

export default function IssueTable({ volumeId }: IssueTableProps) {
    const { columns } = useRootSelector(
        (state) => state.tableOptions.issueTable,
    );

    const { issues, volumeMonitored } = useIssuesSelector(volumeId);

    const [updateIssue] = useUpdateIssueMutation();

    const [isToggling, setIsToggling] = useState<number[]>([]);

    const getIsSaving = useCallback(
        (issueId: number) => {
            return isToggling.includes(issueId);
        },
        [isToggling],
    );

    const socketCallback = useCallback<
        SocketEventHandler<typeof socketEvents.ISSUE_UPDATED>
    >(
        (data) => {
            if (data.calledFrom === 'IssueTable') {
                setIsToggling(
                    isToggling.toSpliced(isToggling.indexOf(data.issue.id), 1),
                );
                // Needed to refresh the row
                getIsSaving(data.issue.id);
            }
        },
        [isToggling, getIsSaving],
    );
    useSocketCallback(socketEvents.ISSUE_UPDATED, socketCallback);

    const lastToggledIssue = useRef<number | null>(null);

    const handleMonitorIssuePress = useCallback(
        (
            issueId: number,
            monitored: boolean,
            { shiftKey }: { shiftKey: boolean },
        ) => {
            const lastToggled = lastToggledIssue.current;
            const issueIds = [issueId];

            if (shiftKey && lastToggled) {
                const { lower, upper } = getToggledRange(
                    issues,
                    issueId,
                    lastToggled,
                );

                for (let i = lower; i < upper; i++) {
                    issueIds.push(issues[i].id);
                }
            }

            lastToggledIssue.current = issueId;

            issueIds.forEach((issueId) => {
                setIsToggling([...isToggling, issueId]);
                updateIssue({
                    issueId,
                    monitored,
                    calledFrom: 'IssueTable',
                });
            });
        },
        [issues, isToggling, updateIssue],
    );

    return (
        <div className={styles.issues}>
            <SortedTable
                tableName="issueTable"
                columns={columns}
                items={issues}
                itemRenderer={(issue) => (
                    <IssueRow
                        key={issue.id}
                        columns={columns}
                        isSaving={getIsSaving(issue.id)}
                        onMonitorIssuePress={handleMonitorIssuePress}
                        volumeMonitored={volumeMonitored}
                        {...issue}
                    />
                )}
                predicates={{
                    issueNumber: (a, b) =>
                        a.calculatedIssueNumber - b.calculatedIssueNumber,
                }}
            />
        </div>
    );
}
