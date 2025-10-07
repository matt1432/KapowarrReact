// IMPORTS

// React
import { useEffect } from 'react';

// Redux
import { useLazyGetIssueQuery } from 'Store/Api/Issues';

// Misc
import translate from 'Utilities/String/translate';

// General Components
import Link from 'Components/Link/Link';
import RelativeDateCell from 'Components/Table/Cells/RelativeDateCell';
import TableRowCell from 'Components/Table/Cells/TableRowCell';
import TableRow from 'Components/Table/TableRow';
import VolumeTitleLink from 'Volume/VolumeTitleLink';

// CSS
import styles from './index.module.css';

// Types
import type { Column } from 'Components/Table/Column';
import type { DownloadHistoryItem } from 'typings/Queue';
import type { HistoryColumnName } from 'History';

type HistoryRowProps = DownloadHistoryItem & {
    columns: Column<HistoryColumnName>[];
};

// IMPLEMENTATIONS

export default function HistoryRow({
    columns,
    source,
    volumeId,
    issueId,
    webLink,
    webTitle,
    webSubTitle,
    fileTitle,
    downloadedAt,
    success,
}: HistoryRowProps) {
    const [getIssue, { data: issue }] = useLazyGetIssueQuery();

    useEffect(() => {
        if (typeof issueId === 'number') {
            getIssue({ issueId });
        }
    }, [getIssue, issueId]);

    return (
        <TableRow>
            {columns.map(({ isVisible, name }) => {
                if (!isVisible) {
                    return null;
                }

                if (name === 'source') {
                    return (
                        <TableRowCell className={styles[name]}>
                            {source}
                        </TableRowCell>
                    );
                }

                if (name === 'volumeId') {
                    return (
                        <TableRowCell className={styles[name]}>
                            {typeof volumeId === 'number' ||
                            typeof issue?.volumeId === 'number' ? (
                                <VolumeTitleLink
                                    title={(
                                        volumeId ??
                                        issue?.volumeId ??
                                        ''
                                    ).toString()}
                                    titleSlug={(
                                        volumeId ??
                                        issue?.volumeId ??
                                        ''
                                    ).toString()}
                                />
                            ) : null}
                        </TableRowCell>
                    );
                }

                if (name === 'issueId') {
                    return (
                        <TableRowCell className={styles[name]}>
                            {issueId}
                        </TableRowCell>
                    );
                }

                if (name === 'webLink') {
                    return (
                        <TableRowCell className={styles[name]}>
                            <Link to={webLink}>{webLink}</Link>
                        </TableRowCell>
                    );
                }

                if (name === 'webTitle') {
                    return (
                        <TableRowCell className={styles[name]}>
                            {webTitle}
                        </TableRowCell>
                    );
                }

                if (name === 'webSubTitle') {
                    return (
                        <TableRowCell className={styles[name]}>
                            {webSubTitle}
                        </TableRowCell>
                    );
                }

                if (name === 'fileTitle') {
                    return (
                        <TableRowCell className={styles[name]}>
                            {fileTitle}
                        </TableRowCell>
                    );
                }

                if (name === 'downloadedAt') {
                    return (
                        <RelativeDateCell
                            date={downloadedAt * 1000}
                            includeSeconds={true}
                            includeTime={true}
                        />
                    );
                }

                if (name === 'success') {
                    return (
                        <TableRowCell className={styles[name]}>
                            {success
                                ? translate('Completed')
                                : translate('Failed')}
                        </TableRowCell>
                    );
                }
            })}
        </TableRow>
    );
}
