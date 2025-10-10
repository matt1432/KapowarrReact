// IMPORTS

// React
import { useCallback } from 'react';

// Redux
import { useRootSelector } from 'Store/createAppStore';
import { useSearchVolumeQuery } from 'Store/Api/Volumes';
import { useDeleteFileMutation } from 'Store/Api/Files';

// Misc
import { socketEvents } from 'Helpers/Props';

import translate from 'Utilities/String/translate';

// Hooks
import useSocketCallback from 'Helpers/Hooks/useSocketCallback';

// General Components
import InnerHTML from 'Components/InnerHTML';
import Table from 'Components/Table/Table';
import TableBody from 'Components/Table/TableBody';

// Specific Components
import IssueFileRow from '../IssueFileRow';

// CSS
import styles from './index.module.css';

// Types
import type { IssueData } from 'Issue/Issue';
import type { SocketEventHandler } from 'typings/Socket';

interface IssueSummaryProps {
    volumeId: number;
    issueId: number;
    issueFileId?: number;
}

// IMPLEMENTATIONS

export default function IssueSummary({ volumeId, issueId }: IssueSummaryProps) {
    const { columns } = useRootSelector(
        (state) => state.tableOptions.issueSummary,
    );

    const {
        description,
        files = [],
        refetch,
    } = useSearchVolumeQuery(
        { volumeId },
        {
            selectFromResult: ({ data }) =>
                data?.issues.find((i) => i.id === issueId) ??
                ({} as Partial<IssueData>),
        },
    );

    const [deleteFile] = useDeleteFileMutation();

    const handleDeleteIssueFile = useCallback(
        (issueFileId: number) => {
            if (issueFileId)
                deleteFile({
                    fileId: issueFileId,
                });
        },
        [deleteFile],
    );

    const socketCallback = useCallback<
        SocketEventHandler<typeof socketEvents.ISSUE_DELETED>
    >(
        (data) => {
            if (data.issueId === issueId) {
                refetch();
            }
        },
        [issueId, refetch],
    );
    useSocketCallback(socketEvents.ISSUE_DELETED, socketCallback);

    return (
        <div>
            <div className={styles.overview}>
                {description ? (
                    <InnerHTML innerHTML={description} />
                ) : (
                    translate('NoIssueOverview')
                )}
            </div>

            {files.length !== 0 ? (
                <Table tableName="issueSummary" columns={columns}>
                    <TableBody>
                        {files.map(
                            ({
                                id,
                                filepath,
                                size,
                                releaser,
                                scanType,
                                resolution,
                                dpi,
                            }) => (
                                <IssueFileRow
                                    id={id}
                                    path={filepath}
                                    size={size}
                                    releaser={releaser}
                                    scanType={scanType}
                                    resolution={resolution}
                                    dpi={dpi}
                                    columns={columns}
                                    onDeleteIssueFile={() =>
                                        handleDeleteIssueFile(id)
                                    }
                                    refetchFiles={refetch}
                                />
                            ),
                        )}
                    </TableBody>
                </Table>
            ) : null}
        </div>
    );
}
