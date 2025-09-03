// IMPORTS

// React
import { useCallback, useEffect } from 'react';

// Redux
import { useSearchVolumeQuery } from 'Store/Api/Volumes';
import { useDeleteFileMutation } from 'Store/Api/Files';

// Misc
import translate from 'Utilities/String/translate';

import usePrevious from 'Helpers/Hooks/usePrevious';

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

export default function IssueSummary({ volumeId, issueId }: IssueSummaryProps) {
    const {
        description,
        files = [],
        refetch,
    } = useSearchVolumeQuery(
        { volumeId },
        {
            refetchOnMountOrArgChange: true,
            selectFromResult: ({ data }) =>
                data?.issues.find((i) => i.id === issueId) ?? ({} as Partial<IssueData>),
        },
    );

    const [deleteFile, { isLoading, isSuccess }] = useDeleteFileMutation();
    const wasLoading = usePrevious(isLoading);

    useEffect(() => {
        if (!isLoading && wasLoading && isSuccess) {
            refetch();
        }
    }, [isLoading, isSuccess, wasLoading, refetch]);

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
                                    id={id}
                                    path={filepath}
                                    size={size}
                                    releaser={releaser}
                                    scanType={scanType}
                                    resolution={resolution}
                                    dpi={dpi}
                                    columns={COLUMNS}
                                    onDeleteIssueFile={() => handleDeleteIssueFile(id)}
                                    refetchFiles={() => refetch()}
                                />
                            ),
                        )}
                    </TableBody>
                </Table>
            ) : null}
        </div>
    );
}
