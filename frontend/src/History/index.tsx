// IMPORTS

// React
import { useCallback, useEffect, useMemo, useState } from 'react';

// Redux
import { useRootDispatch, useRootSelector } from 'Store/createAppStore';
import { useGetDownloadHistoryMutation } from 'Store/Api/Queue';

// Misc
import { kinds } from 'Helpers/Props';

import translate from 'Utilities/String/translate';

// Hooks
import useMeasure from 'Helpers/Hooks/useMeasure';

// General Components
import Alert from 'Components/Alert';
import LoadingIndicator from 'Components/Loading/LoadingIndicator';
import Table from 'Components/Table/Table';
import TableBody from 'Components/Table/TableBody';
import TablePager from 'Components/Table/TablePager';

// Specific Components
import HistoryRow from './HistoryRow';
import { setTableOptions } from 'Store/Slices/TableOptions';

// Types
export type HistoryColumnName =
    | 'source'
    | 'volumeId'
    | 'issueId'
    | 'webLink'
    | 'webTitle'
    | 'webSubTitle'
    | 'fileTitle'
    | 'downloadedAt'
    | 'success'
    | 'actions';

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
    const dispatch = useRootDispatch();

    const { columns } = useRootSelector(
        (state) => state.tableOptions.historyTable,
    );

    useEffect(() => {
        dispatch(
            setTableOptions({
                tableName: 'historyTable',
                columns: columns.map((column) => {
                    if (column.name === 'issueId') {
                        return {
                            ...column,
                            isVisible: showIssues,
                        };
                    }
                    if (column.name === 'volumeId') {
                        return {
                            ...column,
                            isVisible: showVolumes,
                        };
                    }
                    return column;
                }),
            }),
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showIssues, showVolumes]);

    const [fetchHistory, { data, isFetching, error }] =
        useGetDownloadHistoryMutation({
            selectFromResult: ({ data, isLoading, error }) => ({
                data,
                isFetching: isLoading,
                error,
            }),
        });

    const [isPopulated, setIsPopulated] = useState(false);
    const [items, setItems] = useState(data?.history ?? []);
    const [totalRecords, setTotalRecords] = useState(data?.totalRecords ?? 0);
    useEffect(() => {
        if (data) {
            setIsPopulated(true);
        }

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

    const [tableRef, { width }] = useMeasure<HTMLDivElement>();
    const columnWidth = useMemo(
        () => (width - 2 * 75 - 180 - 30 - 85 - 95) / 4,
        [width],
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

    if (!isPopulated && isFetching) {
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
            <div ref={tableRef}>
                <Table tableName="historyTable" columns={columns}>
                    <TableBody>
                        {items.map((item, key) => (
                            <HistoryRow
                                key={key}
                                columns={columns}
                                columnWidth={columnWidth}
                                {...item}
                            />
                        ))}
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
