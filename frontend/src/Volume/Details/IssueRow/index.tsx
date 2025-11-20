// IMPORTS

// React
import { useCallback } from 'react';

// General Components
import MonitorToggleButton from 'Components/MonitorToggleButton';
import TableRowCell from 'Components/Table/Cells/TableRowCell';
import TableRow from 'Components/Table/TableRow';

// Specific Components
import IssueSearchCell from 'Issue/IssueSearchCell';
import IssueStatus from 'Issue/IssueStatus';
import IssueTitleLink from 'Issue/IssueTitleLink';

// CSS
import styles from './index.module.css';

// Types
import type { Column } from 'Components/Table/Column';
import type { IssueColumnName } from '../IssueTable/columns';
import type { IssueRowData } from '../IssueTable';

interface IssueRowProps extends IssueRowData {
    columns: Column<IssueColumnName>[];
    volumeMonitored: boolean;
    isSaving: boolean;
    onMonitorIssuePress: (
        issueId: number,
        value: boolean,
        { shiftKey }: { shiftKey: boolean },
    ) => void;
}

// IMPLEMENTATIONS

export default function IssueRow({
    id,
    issue,
    issueFile,
    isMarvelIssue,
    volumeId,
    volumeMonitored,
    monitored,
    issueNumber,
    title,
    path,
    relativePath,
    releaseGroup,
    size,
    isSaving,
    columns,
    onMonitorIssuePress,
}: IssueRowProps) {
    const handleMonitorIssuePress = useCallback(
        (monitored: boolean, options: { shiftKey: boolean }) => {
            onMonitorIssuePress(id, monitored, options);
        },
        [id, onMonitorIssuePress],
    );

    return (
        <TableRow>
            {columns.map((column) => {
                const { name, isVisible } = column;

                if (!isVisible) {
                    return null;
                }

                if (name === 'monitored') {
                    return (
                        <TableRowCell key={name} className={styles.monitored}>
                            {isMarvelIssue ? null : (
                                <MonitorToggleButton
                                    monitored={monitored}
                                    isDisabled={!volumeMonitored}
                                    isSaving={isSaving}
                                    onPress={handleMonitorIssuePress}
                                />
                            )}
                        </TableRowCell>
                    );
                }

                if (name === 'issueNumber') {
                    return (
                        <TableRowCell key={name} className={styles.issueNumber}>
                            {isMarvelIssue ? (
                                issueNumber
                            ) : (
                                <IssueTitleLink
                                    issueId={id}
                                    volumeId={volumeId}
                                    issueTitle={issueNumber}
                                    showOpenVolumeButton={false}
                                />
                            )}
                        </TableRowCell>
                    );
                }

                if (name === 'title') {
                    return (
                        <TableRowCell key={name} className={styles.title}>
                            {isMarvelIssue ? (
                                (title ?? '')
                            ) : (
                                <IssueTitleLink
                                    issueId={id}
                                    volumeId={volumeId}
                                    issueTitle={title ?? ''}
                                    showOpenVolumeButton={false}
                                />
                            )}
                        </TableRowCell>
                    );
                }

                if (name === 'path') {
                    return <TableRowCell key={name}>{path}</TableRowCell>;
                }

                if (name === 'relativePath') {
                    return (
                        <TableRowCell key={name}>{relativePath}</TableRowCell>
                    );
                }

                if (name === 'size') {
                    return (
                        <TableRowCell key={name} className={styles.size}>
                            {size}
                        </TableRowCell>
                    );
                }

                if (name === 'releaseGroup') {
                    return (
                        <TableRowCell
                            key={name}
                            className={styles.releaseGroup}
                        >
                            {releaseGroup}
                        </TableRowCell>
                    );
                }

                if (name === 'status') {
                    return (
                        <TableRowCell key={name} className={styles.status}>
                            <IssueStatus
                                issue={issue!}
                                issueFile={issueFile}
                                isMarvelIssue={isMarvelIssue}
                            />
                        </TableRowCell>
                    );
                }

                if (name === 'actions') {
                    return isMarvelIssue ? (
                        <TableRowCell></TableRowCell>
                    ) : (
                        <IssueSearchCell
                            key={name}
                            issueId={id}
                            volumeId={volumeId}
                            issueTitle={title ?? ''}
                            showOpenVolumeButton={false}
                        />
                    );
                }
            })}
        </TableRow>
    );
}
