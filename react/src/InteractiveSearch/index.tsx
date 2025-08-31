// IMPORTS

// React
import { useCallback } from 'react';

// Redux
import { useRootDispatch, useRootSelector } from 'Store/createAppStore';
import { setInteractiveSearchSort } from 'Store/Slices/SearchResults';

import { useManualSearchQuery } from 'Store/Api/Command';

// Misc
import { kinds } from 'Helpers/Props';

import getErrorMessage from 'Utilities/Object/getErrorMessage';
import translate from 'Utilities/String/translate';

// General Components
import Alert from 'Components/Alert';
import LoadingIndicator from 'Components/Loading/LoadingIndicator';
import Table from 'Components/Table/Table';
import TableBody from 'Components/Table/TableBody';

// Specific Components
import InteractiveSearchRow from './InteractiveSearchRow';

// CSS
import styles from './index.module.css';

// Types
import type { Column } from 'Components/Table/Column';

import type { InteractiveSearchPayload, InteractiveSearchSort } from 'typings/Search';

import type { SortDirection } from 'Helpers/Props/sortDirections';

export interface InteractiveSearchProps {
    searchPayload: InteractiveSearchPayload;
}

// IMPLEMENTATIONS

const columns: Column<InteractiveSearchSort>[] = [
    {
        name: 'match',
        label: () => translate('Match'),
        isSortable: true,
        isVisible: true,
    },
    {
        name: 'issueNumber',
        label: '#',
        isSortable: true,
        isVisible: true,
    },
    {
        name: 'displayTitle',
        label: () => translate('Title'),
        isSortable: true,
        isVisible: true,
    },
    {
        name: 'filesize',
        label: () => translate('Size'),
        isSortable: true,
        isVisible: true,
    },
    {
        name: 'pages',
        label: () => translate('Pages'),
        isSortable: true,
        isVisible: true,
    },
    {
        name: 'releaser',
        label: () => translate('ReleaseGroup'),
        isSortable: true,
        isVisible: true,
    },
    {
        name: 'scanType',
        label: () => translate('ScanType'),
        isSortable: true,
        isVisible: true,
    },
    {
        name: 'resolution',
        label: () => translate('Resolution'),
        isSortable: true,
        isVisible: true,
    },
    {
        name: 'dpi',
        label: () => translate('DPI'),
        isSortable: true,
        isVisible: true,
    },
    {
        name: 'source',
        label: () => translate('Source'),
        isSortable: true,
        isVisible: true,
    },
    // TODO: link with blocked releases
    /*{
        name: 'rejections',
        label: React.createElement(Icon, {
            name: icons.DANGER,
            title: () => translate('Rejections'),
        }),
        isSortable: true,
        fixedSortDirection: sortDirections.ASCENDING,
        isVisible: true,
    },*/
];

function InteractiveSearch({ searchPayload }: InteractiveSearchProps) {
    const { isFetching, isPopulated, error, errorMessage, items, totalItems } =
        useManualSearchQuery(searchPayload, {
            refetchOnMountOrArgChange: true,
            selectFromResult: ({ isFetching, isUninitialized, error, data }) => ({
                isFetching,
                isPopulated: !isUninitialized,
                error,
                errorMessage: getErrorMessage(error),
                items: data ?? [],
                totalItems: data?.length ?? 0,
            }),
        });

    const { sortKey, sortDirection } = useRootSelector((state) => state.searchResults);

    const dispatch = useRootDispatch();

    const handleSortPress = useCallback(
        (sortKey: InteractiveSearchSort, sortDirection?: SortDirection) => {
            dispatch(setInteractiveSearchSort({ sortKey, sortDirection }));
        },
        [dispatch],
    );

    return (
        <div>
            {isFetching ? <LoadingIndicator /> : null}

            {!isFetching && error ? (
                <div>
                    {errorMessage
                        ? translate('InteractiveSearchResultsVolumeFailedErrorMessage', {
                              message: errorMessage.charAt(0).toLowerCase() + errorMessage.slice(1),
                          })
                        : translate('IssueSearchResultsLoadError')}
                </div>
            ) : null}

            {!isFetching && isPopulated && !totalItems ? (
                <Alert kind={kinds.INFO}>{translate('NoResultsFound')}</Alert>
            ) : null}

            {!!totalItems && isPopulated && !items.length ? (
                <Alert kind={kinds.WARNING}>
                    {translate('AllResultsAreHiddenByTheAppliedFilter')}
                </Alert>
            ) : null}

            {isPopulated && items.length ? (
                <Table
                    columns={columns}
                    sortKey={sortKey}
                    sortDirection={sortDirection}
                    onSortPress={handleSortPress}
                >
                    <TableBody>
                        {items.map((item) => {
                            return (
                                <InteractiveSearchRow
                                    key={item.link}
                                    result={item}
                                    searchPayload={searchPayload}
                                />
                            );
                        })}
                    </TableBody>
                </Table>
            ) : null}

            {totalItems !== items.length && items.length ? (
                <div className={styles.filteredMessage}>
                    {translate('SomeResultsAreHiddenByTheAppliedFilter')}
                </div>
            ) : null}
        </div>
    );
}

export default InteractiveSearch;
