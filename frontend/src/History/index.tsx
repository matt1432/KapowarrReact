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

    const [fetchHistory, { data, isFetching, isPopulated, error }] =
        useGetDownloadHistoryMutation({
            selectFromResult: ({
                data,
                isLoading,
                isUninitialized,
                error,
            }) => ({
                data,
                isFetching: isLoading,
                isPopulated: !isUninitialized,
                error,
            }),
        });

    const [items, setItems] = useState(data?.history ?? []);
    const [totalRecords, setTotalRecords] = useState(data?.totalRecords ?? 0);
    useEffect(() => {
        if (
            data &&
            typeof data.totalRecords === 'number' &&
            Array.isArray(data.history)
        ) {
            setTotalRecords(data.totalRecords);
            setItems(data.history);
        }
    }, [data]);

    const hasItems = useMemo(() => Boolean(items.length), [items.length]);
    const totalPages = useMemo(
        () => Math.ceil(totalRecords / 50),
        [totalRecords],
    );

    const [page, setPage] = useState(1);

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

    const handleLastPagePress = useCallback(() => {
        handlePageSelect(totalPages);
    }, [handlePageSelect, totalPages]);

    useEffect(() => {
        fetchHistory({ volumeId, issueId, offset: page - 1 });
    }, [fetchHistory, volumeId, issueId, page]);

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
                <Table tableName="historyTable" columns={columns}>
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
                    totalPages={totalPages}
                    totalRecords={totalRecords}
                    isFetching={isFetching}
                    onFirstPagePress={handleFirstPagePress}
                    onPreviousPagePress={handlePreviousPagePress}
                    onNextPagePress={handleNextPagePress}
                    onLastPagePress={handleLastPagePress}
                    onPageSelect={handlePageSelect}
                />
            </div>
        );
    }

    return null;
}
