// IMPORTS

// React
import { useCallback, useEffect, useMemo, useState } from 'react';

// Redux
import { useGetBlocklistMutation } from 'Store/Api/Queue';

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
import BlocklistRow from '../BlocklistRow';

// Types
import type { Column } from 'Components/Table/Column';
import type { BlocklistItem } from 'typings/Queue';

export type BlocklistColumnName = keyof BlocklistItem | 'actions';

// IMPLEMENTATIONS

const columns: Column<BlocklistColumnName>[] = [
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
        isVisible: true,
    },
    {
        name: 'issueId',
        isModifiable: false,
        isSortable: false,
        isVisible: true,
    },
    {
        name: 'downloadLink',
        isModifiable: false,
        isSortable: false,
        isVisible: true,
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
        name: 'reason',
        isModifiable: false,
        isSortable: false,
        isVisible: true,
    },
    {
        name: 'addedAt',
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

export default function BlocklistTable() {
    const [fetchBlocklist, { items, isFetching, isPopulated, error }] =
        useGetBlocklistMutation({
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

    const [fetchNextPage, { nextPageHasItems }] = useGetBlocklistMutation({
        selectFromResult: ({ data }) => ({
            nextPageHasItems: Boolean(data?.length),
        }),
    });

    const hasItems = Boolean(items.length);

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

    const refetch = useCallback(() => {
        fetchBlocklist({ offset: page - 1 });
        fetchNextPage({ offset: page });
    }, [fetchBlocklist, fetchNextPage, page]);

    useEffect(() => {
        fetchBlocklist({ offset: page - 1 });
        fetchNextPage({ offset: page });
    }, [fetchBlocklist, fetchNextPage, page]);

    if (isFetching) {
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
            <div>
                <Table columns={columns}>
                    <TableBody>
                        {items.map((item) => {
                            return (
                                <BlocklistRow
                                    key={item.id}
                                    {...item}
                                    refetch={refetch}
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
