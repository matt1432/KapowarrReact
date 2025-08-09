// IMPORTS

// React
import { useCallback, useEffect, useRef } from 'react';

// Redux
import { useRootDispatch, useRootSelector } from 'Store/createAppStore';
import { setIssuesSort, setIssuesTableOption } from 'Store/Slices/IssueTable';
import { useSearchVolumeQuery, useToggleIssueMonitoredMutation } from 'Store/createApiEndpoints';

// Misc
import getToggledRange from 'Utilities/Table/getToggledRange';

// General Components
import Table from 'Components/Table/Table';
import TableBody from 'Components/Table/TableBody';

// Specific Components
import IssueRow from '../IssueRow';

// CSS
import styles from './index.module.css';

// Types
import type { SortDirection } from 'Helpers/Props/sortDirections';
import type { TableOptionsChangePayload } from 'typings/Table';
import type { IssueColumnName } from 'Issue/Issue';

export type IssueTableSort =
    | 'issueNumber'
    | 'title'
    | 'size'
    | 'releaseGroup'
    | 'path'
    | 'relativePath';

interface IssueTableProps {
    volumeId: number;
}

// IMPLEMENTATIONS

function useIssuesSelector(volumeId: number) {
    const { issues, refetch } = useSearchVolumeQuery(
        { volumeId },
        {
            selectFromResult: ({ data, ...rest }) => ({
                issues: data?.issues ?? [],
                ...rest,
            }),
        },
    );

    return {
        issues,
        refetch,
    };
}

function IssueTable({ volumeId }: IssueTableProps) {
    const dispatch = useRootDispatch();

    const { issues, refetch } = useIssuesSelector(volumeId);
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
        (sortKey: string, sortDirection?: SortDirection) => {
            dispatch(
                setIssuesSort({
                    sortKey: sortKey as IssueTableSort,
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
            <Table
                columns={columns}
                sortKey={sortKey}
                sortDirection={sortDirection}
                onSortPress={handleSortPress}
                onTableOptionChange={handleTableOptionChange}
            >
                <TableBody>
                    {issues.map((issue) => {
                        return (
                            <IssueRow
                                key={issue.id}
                                id={issue.id}
                                title={issue.title ?? ''}
                                issueNumber={issue.calculatedIssueNumber}
                                volumeId={volumeId}
                                columns={columns}
                                monitored={issue.monitored}
                                onMonitorIssuePress={handleMonitorIssuePress}
                            />
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}

export default IssueTable;
