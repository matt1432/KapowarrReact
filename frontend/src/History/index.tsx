// IMPORTS

// React
import { useCallback, useEffect, useMemo, useState } from 'react';

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
import TablePager from 'Components/Table/TablePager';

// Specific Components
import HistoryRow from './HistoryRow';

// Types
import type { Column } from 'Components/Table/Column';
import type { DownloadHistoryItem } from 'typings/Queue';

export type HistoryColumnName = keyof DownloadHistoryItem | 'actions';

interface HistoryProps {
    issueId?: number;
    volumeId?: number;
    showIssues?: boolean;
    showVolumes?: boolean;
}

// IMPLEMENTATIONS

export default function History({
    volumeId,
    issueId,
    showIssues = false,
    showVolumes = false,
}: HistoryProps = {}) {
    const columns: Column<HistoryColumnName>[] = [
        {
            name: 'source',
            isModifiable: false,
            isSortable: false,
            isVisible: true,
        },
        {
            name: 'volumeId',
            isModifiable: false,
            isSortable: false,
            isVisible: showVolumes,
        },
        {
            name: 'issueId',
            isModifiable: false,
            isSortable: false,
            isVisible: showIssues,
        },
        {
            name: 'webLink',
            isModifiable: false,
            isSortable: false,
            isVisible: true,
        },
        {
            name: 'webTitle',
            isModifiable: false,
            isSortable: false,
            isVisible: true,
        },
        {
            name: 'webSubTitle',
            isModifiable: false,
            isSortable: false,
            isVisible: true,
        },
        {
            name: 'fileTitle',
            isModifiable: false,
            isSortable: false,
            isVisible: true,
        },
        {
            name: 'downloadedAt',
            isModifiable: false,
            isSortable: false,
            isVisible: true,
        },
        {
            name: 'success',
            isModifiable: false,
            isSortable: false,
            isVisible: true,
        },
        {
            name: 'actions',
            hideHeaderLabel: true,
            isModifiable: false,
            isSortable: false,
            isVisible: true,
        },
    ];

    const [fetchHistory, { items, isFetching, isPopulated, error }] =
        useGetDownloadHistoryMutation({
            selectFromResult: ({
                data,
                isLoading,
                isUninitialized,
                error,
            }) => ({
                items: data ?? [],
                isFetching: isLoading,
                isPopulated: !isUninitialized,
                error,
            }),
        });
    const [fetchNextPage, { nextPageHasItems }] = useGetDownloadHistoryMutation(
        {
            selectFromResult: ({ data }) => ({
                nextPageHasItems: Boolean(data?.length),
            }),
        },
    );

    const hasItems = !!items.length;

    const [page, setPage] = useState(1);
    const lastPage = useMemo(
        () => (nextPageHasItems ? page + 1 : page),
        [nextPageHasItems, page],
    );

    const handlePageSelect = useCallback((pageNumber: number) => {
        setPage(pageNumber);
    }, []);
    const handleFirstPagePress = useCallback(() => {
        handlePageSelect(1);
    }, [handlePageSelect]);
    const handlePreviousPagePress = useCallback(() => {
        handlePageSelect(page - 1);
    }, [handlePageSelect, page]);
    const handleNextPagePress = useCallback(() => {
        handlePageSelect(page + 1);
    }, [handlePageSelect, page]);

    useEffect(() => {
        fetchHistory({ volumeId, issueId, offset: page - 1 });
        fetchNextPage({ volumeId, issueId, offset: page });
    }, [fetchHistory, fetchNextPage, volumeId, issueId, page]);

    if (isFetching) {
        return <LoadingIndicator />;
    }

    if (!isFetching && !!error) {
        return (
            <Alert kind={kinds.DANGER}>
                {translate('IssueHistoryLoadError')}
            </Alert>
        );
    }

    if (isPopulated && !hasItems && !error) {
        return <Alert kind={kinds.INFO}>{translate('NoIssueHistory')}</Alert>;
    }

    if (isPopulated && hasItems && !error) {
        return (
            <div>
                <Table columns={columns}>
                    <TableBody>
                        {items.map((item) => {
                            return (
                                <HistoryRow
                                    key={item.webLink}
                                    {...item}
                                    showVolumes={showVolumes}
                                    showIssues={showIssues}
                                />
                            );
                        })}
                    </TableBody>
                </Table>
                <TablePager
                    page={page}
                    totalPages={lastPage}
                    isFetching={isFetching}
                    onFirstPagePress={handleFirstPagePress}
                    onPreviousPagePress={handlePreviousPagePress}
                    onNextPagePress={handleNextPagePress}
                    onPageSelect={handlePageSelect}
                />
            </div>
        );
    }

    return null;
}
