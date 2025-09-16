// IMPORTS

// React
import { useEffect } from 'react';

// Redux
import { useLazyGetIssueQuery } from 'Store/Api/Issues';

// Misc
import translate from 'Utilities/String/translate';

// General Components
import RelativeDateCell from 'Components/Table/Cells/RelativeDateCell';
import TableRowCell from 'Components/Table/Cells/TableRowCell';
import TableRow from 'Components/Table/TableRow';
import VolumeTitleLink from 'Volume/VolumeTitleLink';

// Types
import type { DownloadHistoryItem } from 'typings/Queue';

type HistoryRowProps = DownloadHistoryItem & {
    showVolumes: boolean;
    showIssues: boolean;
};

// IMPLEMENTATIONS

export default function HistoryRow({
    source,
    volumeId,
    issueId,
    webLink,
    webTitle,
    webSubTitle,
    fileTitle,
    downloadedAt,
    success,
    showVolumes,
    showIssues,
}: HistoryRowProps) {
    const [getIssue, { data: issue }] = useLazyGetIssueQuery();

    useEffect(() => {
        if (typeof issueId === 'number') {
            getIssue({ issueId });
        }
    }, [getIssue, issueId]);

    return (
        <TableRow>
            <TableRowCell>{source}</TableRowCell>

            {showVolumes ? (
                <TableRowCell>
                    {typeof volumeId === 'number' || typeof issue?.volumeId === 'number' ? (
                        <VolumeTitleLink
                            title={(volumeId ?? issue?.volumeId ?? '').toString()}
                            titleSlug={(volumeId ?? issue?.volumeId ?? '').toString()}
                        />
                    ) : null}
                </TableRowCell>
            ) : null}

            {showIssues ? <TableRowCell>{issueId}</TableRowCell> : null}

            <TableRowCell>{webLink}</TableRowCell>

            <TableRowCell>{webTitle}</TableRowCell>

            <TableRowCell>{webSubTitle}</TableRowCell>

            <TableRowCell>{fileTitle}</TableRowCell>

            <RelativeDateCell date={downloadedAt * 1000} includeSeconds={true} includeTime={true} />

            <TableRowCell>{success ? translate('Completed') : translate('Failed')}</TableRowCell>
        </TableRow>
    );
}
