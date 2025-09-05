// IMPORTS

// React
import { useEffect } from 'react';

// Redux
import { useGetDownloadHistoryMutation } from 'Store/Api/Queue';

// Misc
import { kinds } from 'Helpers/Props';

import translate from 'Utilities/String/translate';

// General Components
import Alert from 'Components/Alert';
import LoadingIndicator from 'Components/Loading/LoadingIndicator';
import Table from 'Components/Table/Table';
import TableBody from 'Components/Table/TableBody';

// Specific Components
import IssueHistoryRow from './IssueHistoryRow';

// Types
import type { Column } from 'Components/Table/Column';
import type { DownloadHistoryItem } from 'typings/Queue';
export type IssueHistoryColumnName = keyof DownloadHistoryItem | 'actions';

// IMPLEMENTATIONS

const columns: Column<IssueHistoryColumnName>[] = [
    {
        name: 'source',
        label: () => translate('SourceTitle'),
        isVisible: true,
    },
    {
        name: 'webLink',
        label: () => translate('WebLink'),
        isVisible: true,
    },
    {
        name: 'webTitle',
        label: () => translate('WebTitle'),
        isVisible: true,
    },
    {
        name: 'webSubTitle',
        label: () => translate('WebSubtitle'),
        isVisible: true,
    },
    {
        name: 'fileTitle',
        label: () => translate('Filename'),
        isVisible: true,
    },
    {
        name: 'downloadedAt',
        label: () => translate('Date'),
        isVisible: true,
    },
    {
        name: 'actions',
        label: '',
        isVisible: true,
    },
];

interface IssueHistoryProps {
    issueId: number;
}

export default function IssueHistory({ issueId }: IssueHistoryProps) {
    const [fetchIssueHistory, { items, isFetching, isPopulated, error }] =
        useGetDownloadHistoryMutation({
            selectFromResult: ({ data, isLoading, isUninitialized, error }) => ({
                items: data ?? [],
                isFetching: isLoading,
                isPopulated: !isUninitialized,
                error,
            }),
        });

    const hasItems = !!items.length;

    useEffect(() => {
        fetchIssueHistory({ issueId });
    }, [fetchIssueHistory, issueId]);

    if (isFetching) {
        return <LoadingIndicator />;
    }

    if (!isFetching && !!error) {
        return <Alert kind={kinds.DANGER}>{translate('IssueHistoryLoadError')}</Alert>;
    }

    if (isPopulated && !hasItems && !error) {
        return <Alert kind={kinds.INFO}>{translate('NoIssueHistory')}</Alert>;
    }

    if (isPopulated && hasItems && !error) {
        return (
            <Table columns={columns}>
                <TableBody>
                    {items.map((item) => {
                        return <IssueHistoryRow key={item.webLink} {...item} />;
                    })}
                </TableBody>
            </Table>
        );
    }

    return null;
}
