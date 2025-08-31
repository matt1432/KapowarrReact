// IMPORTS

// React
import { useCallback } from 'react';

// Redux
import { useSearchVolumeQuery } from 'Store/Api/Volumes';
import { useDeleteFileMutation } from 'Store/Api/Issue';

// Misc
import translate from 'Utilities/String/translate';

// General Components
import InnerHTML from 'Components/InnerHTML';
import Table from 'Components/Table/Table';
import TableBody from 'Components/Table/TableBody';

// Specific Components
import IssueFileRow from '../IssueFileRow';

// CSS
import styles from './index.module.css';

// Types
import type { Column } from 'Components/Table/Column';
import type { IssueData, IssueSummaryColumnName } from 'Issue/Issue';

interface IssueSummaryProps {
    volumeId: number;
    issueId: number;
    issueFileId?: number;
}

// IMPLEMENTATIONS

const COLUMNS: Column<IssueSummaryColumnName>[] = [
    {
        name: 'path',
        label: () => translate('Path'),
        isSortable: false,
        isVisible: true,
    },
    {
        name: 'filesize',
        label: () => translate('Size'),
        isSortable: false,
        isVisible: true,
    },
    {
        name: 'actions',
        label: '',
        isSortable: false,
        isVisible: true,
    },
];

// TODO: allow editing media info

export default function IssueSummary({ volumeId, issueId }: IssueSummaryProps) {
    const { description, files = [] } = useSearchVolumeQuery(
        { volumeId },
        {
            selectFromResult: ({ data }) =>
                data?.issues.find((i) => i.id === issueId) ?? ({} as Partial<IssueData>),
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

    return (
        <div>
            <div className={styles.overview}>
                {description ? <InnerHTML innerHTML={description} /> : translate('NoIssueOverview')}
            </div>

            {files.length !== 0 ? (
                <Table columns={COLUMNS}>
                    <TableBody>
                        {files.map(
                            ({ id, filepath, size, releaser, scanType, resolution, dpi }) => (
                                <IssueFileRow
                                    path={filepath}
                                    size={size}
                                    releaser={releaser}
                                    scanType={scanType}
                                    resolution={resolution}
                                    dpi={dpi}
                                    columns={COLUMNS}
                                    onDeleteIssueFile={() => handleDeleteIssueFile(id)}
                                />
                            ),
                        )}
                    </TableBody>
                </Table>
            ) : null}
        </div>
    );
}
