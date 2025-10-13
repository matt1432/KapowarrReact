// IMPORTS

// React
import { useCallback, useEffect, useMemo, useState } from 'react';

// Redux
import { useRootSelector } from 'Store/createAppStore';
import { useGetBlocklistMutation } from 'Store/Api/Queue';

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
import BlocklistRow from '../BlocklistRow';

// IMPLEMENTATIONS

export default function BlocklistTable() {
    const { columns } = useRootSelector(
        (state) => state.tableOptions.blocklistTable,
    );

    const [fetchBlocklist, { data, isFetching, error }] =
        useGetBlocklistMutation({
            selectFromResult: ({ data, isLoading, error }) => ({
                data,
                isFetching: isLoading,
                error,
            }),
        });

    const [isPopulated, setIsPopulated] = useState(false);
    const [items, setItems] = useState(data?.blocklist ?? []);
    const [totalRecords, setTotalRecords] = useState(data?.totalRecords ?? 0);

    const [prevData, setPrevData] = useState(data);
    if (data !== prevData) {
        setPrevData(data);

        if (data) {
            setIsPopulated(true);
        }

        if (
            data &&
            typeof data.totalRecords === 'number' &&
            Array.isArray(data.blocklist)
        ) {
            setTotalRecords(data.totalRecords);
            setItems(data.blocklist);
        }
    }

    const hasItems = useMemo(() => Boolean(items.length), [items.length]);
    const totalPages = useMemo(
        () => Math.ceil(totalRecords / 50),
        [totalRecords],
    );

    const [tableRef, { width }] = useMeasure<HTMLDivElement>();
    const columnWidth = useMemo(() => (width - 3 * 75 - 180 - 95) / 5, [width]);

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

    const refetch = useCallback(() => {
        fetchBlocklist({ offset: page - 1 });
    }, [fetchBlocklist, page]);

    useEffect(() => {
        fetchBlocklist({ offset: page - 1 });
    }, [fetchBlocklist, page]);

    if (!isPopulated && isFetching) {
        return <LoadingIndicator />;
    }

    if (!isFetching && !!error) {
        return (
            <Alert kind={kinds.DANGER}>{translate('BlocklistLoadError')}</Alert>
        );
    }

    if (isPopulated && !hasItems && !error) {
        return <Alert kind={kinds.INFO}>{translate('NoBlocklistItems')}</Alert>;
    }

    if (isPopulated && hasItems && !error) {
        return (
            <div ref={tableRef}>
                <Table tableName="blocklistTable" columns={columns}>
                    <TableBody>
                        {items.map((item, key) => (
                            <BlocklistRow
                                key={key}
                                columns={columns}
                                columnWidth={columnWidth}
                                {...item}
                                refetch={refetch}
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
