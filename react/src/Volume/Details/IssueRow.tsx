// IMPORTS

// React
import { useCallback } from 'react';

// Redux
import { useSearchVolumeQuery } from 'Store/createApiEndpoints';

// Misc
import formatBytes from 'Utilities/Number/formatBytes';

// General Components
import MonitorToggleButton from 'Components/MonitorToggleButton';
import TableRowCell from 'Components/Table/Cells/TableRowCell';
import TableRow from 'Components/Table/TableRow';

// Specific Components
import IssueSearchCell from 'Issue/IssueSearchCell';
import IssueTitleLink from 'Issue/IssueTitleLink';

// CSS
import styles from './IssueRow.module.css';

// Types
import type { Column } from 'Components/Table/Column';

interface IssueRowProps {
    id: number;
    volumeId: number;
    monitored: boolean;
    issueNumber: number;
    title: string;
    isSaving?: boolean;
    columns: Column[];
    onMonitorIssuePress: (
        issueId: number,
        value: boolean,
        { shiftKey }: { shiftKey: boolean },
    ) => void;
}

// IMPLEMENTATIONS

function IssueRow({
    id,
    volumeId,
    monitored,
    issueNumber,
    title,
    isSaving,
    columns,
    onMonitorIssuePress,
}: IssueRowProps) {
    const { volumeMonitored, issue } = useSearchVolumeQuery(
        { volumeId },
        {
            selectFromResult: ({ data }) => ({
                volumeMonitored: Boolean(data?.monitored),
                volumeType: data?.special_version,
                alternateTitles: data?.alt_title ? [data.alt_title] : [],
                issue: data?.issues.find((issue) => issue.id === id),
                // TODO:
                issueFiles: data?.issues.find((issue) => issue.id === id)?.files,
            }),
        },
    );

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
                            <MonitorToggleButton
                                monitored={monitored}
                                isDisabled={!volumeMonitored}
                                isSaving={isSaving}
                                onPress={handleMonitorIssuePress}
                            />
                        </TableRowCell>
                    );
                }

                if (name === 'issueNumber') {
                    return (
                        <TableRowCell key={name} className={styles.issueNumber}>
                            <span>{issueNumber}</span>
                        </TableRowCell>
                    );
                }

                if (name === 'title') {
                    return (
                        <TableRowCell key={name} className={styles.title}>
                            <IssueTitleLink
                                issueId={id}
                                volumeId={volumeId}
                                issueTitle={title}
                                showOpenVolumeButton={false}
                            />
                        </TableRowCell>
                    );
                }

                /*
                if (name === 'path') {
                    return <TableRowCell key={name}>{issueFile?.path}</TableRowCell>;
                }

                if (name === 'relativePath') {
                    return <TableRowCell key={name}>{issueFile?.relativePath}</TableRowCell>;
                }
                */

                if (name === 'size') {
                    return (
                        <TableRowCell key={name} className={styles.size}>
                            {issue &&
                                formatBytes(
                                    issue.files.reduce((acc, issue) => (acc += issue.size), 0),
                                )}
                        </TableRowCell>
                    );
                }

                if (name === 'releaseGroup') {
                    return (
                        <TableRowCell key={name} className={styles.releaseGroup}>
                            {issue?.files.find((f) => f.releaser)?.releaser ?? ''}
                        </TableRowCell>
                    );
                }

                if (name === 'actions') {
                    return (
                        <IssueSearchCell
                            key={name}
                            issueId={id}
                            volumeId={volumeId}
                            issueTitle={title}
                            showOpenVolumeButton={false}
                        />
                    );
                }

                return null;
            })}
        </TableRow>
    );
}

export default IssueRow;
