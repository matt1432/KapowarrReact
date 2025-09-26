// IMPORTS

// React
import { useCallback, useMemo, useState } from 'react';

// Redux
import { useRootDispatch, useRootSelector } from 'Store/createAppStore';
import { setInteractiveSearchSort } from 'Store/Slices/SearchResults';

import {
    useLibgenFileSearchMutation,
    useManualSearchQuery,
} from 'Store/Api/Command';

// Misc
import { icons, inputTypes, kinds, sortDirections } from 'Helpers/Props';
import { getErrorMessage } from 'Utilities/Object/error';

import translate from 'Utilities/String/translate';

// General Components
import Alert from 'Components/Alert';
import Form from 'Components/Form/Form';
import FormGroup from 'Components/Form/FormGroup';
import FormInputButton from 'Components/Form/FormInputButton';
import FormInputGroup from 'Components/Form/FormInputGroup';
import FormLabel from 'Components/Form/FormLabel';
import Icon from 'Components/Icon';
import LoadingIndicator from 'Components/Loading/LoadingIndicator';
import SortedTable from 'Components/Table/SortedTable';

// Specific Components
import InteractiveSearchRow from './InteractiveSearchRow';

// CSS
import styles from './index.module.css';

// Types
import type { Column } from 'Components/Table/Column';

import type {
    InteractiveSearchPayload,
    InteractiveSearchSort,
    SearchResult,
} from 'typings/Search';

import type { SortDirection } from 'Helpers/Props/sortDirections';
import type { AnyError } from 'typings/Api';
import type { InputChanged } from 'typings/Inputs';

export interface InteractiveSearchProps {
    searchPayload: InteractiveSearchPayload;
}

interface SearchProps extends InteractiveSearchProps {
    isFetching: boolean;
    isPopulated: boolean;
    error: AnyError | undefined;
    errorMessage: string;
    items: (SearchResult & { id: number; actions: never })[];
    totalItems: number;
}

// IMPLEMENTATIONS

function weighIssueNumber(
    issueNumber: number | [number, number] | null,
    lastIssueNumber: number,
): number {
    if (Array.isArray(issueNumber)) {
        return lastIssueNumber + issueNumber[0];
    }

    if (typeof issueNumber !== 'number') {
        return lastIssueNumber * 2;
    }

    return issueNumber;
}

const columns: Column<InteractiveSearchSort>[] = [
    {
        name: 'match',
        isModifiable: false,
        isSortable: true,
        isVisible: true,
    },
    {
        name: 'issueNumber',
        isModifiable: false,
        isSortable: true,
        isVisible: true,
    },
    {
        name: 'displayTitle',
        isModifiable: false,
        isSortable: true,
        isVisible: true,
    },
    {
        name: 'filesize',
        isModifiable: false,
        isSortable: true,
        isVisible: true,
    },
    {
        name: 'pages',
        isModifiable: false,
        isSortable: true,
        isVisible: true,
    },
    {
        name: 'releaser',
        isModifiable: false,
        isSortable: true,
        isVisible: true,
    },
    {
        name: 'scanType',
        isModifiable: false,
        isSortable: true,
        isVisible: true,
    },
    {
        name: 'resolution',
        isModifiable: false,
        isSortable: true,
        isVisible: true,
    },
    {
        name: 'dpi',
        isModifiable: false,
        isSortable: true,
        isVisible: true,
    },
    {
        name: 'source',
        isModifiable: false,
        isSortable: true,
        isVisible: true,
    },
    {
        name: 'matchRejections',
        icon: {
            name: icons.DANGER,
            title: 'Rejections',
        },
        isModifiable: false,
        isSortable: true,
        fixedSortDirection: sortDirections.ASCENDING,
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

function InternalSearch({
    isFetching,
    isPopulated,
    error,
    errorMessage,
    items,
    totalItems,
    searchPayload,
}: SearchProps) {
    const dispatch = useRootDispatch();

    const { sortKey, sortDirection } = useRootSelector(
        (state) => state.searchResults,
    );

    const lastIssueNumber = useMemo(() => {
        return Math.max(
            ...items
                .map((item) =>
                    Array.isArray(item.issueNumber)
                        ? item.issueNumber[1]
                        : item.issueNumber,
                )
                .filter((issueNumber) => issueNumber !== null),
        );
    }, [items]);

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
                        ? translate(
                              'InteractiveSearchResultsVolumeFailedErrorMessage',
                              {
                                  message:
                                      errorMessage.charAt(0).toLowerCase() +
                                      errorMessage.slice(1),
                              },
                          )
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

            {!isFetching && isPopulated && items.length ? (
                <SortedTable
                    columns={columns}
                    items={items}
                    itemRenderer={(item) => (
                        <InteractiveSearchRow
                            key={item.id}
                            columns={columns}
                            result={item}
                            searchPayload={searchPayload}
                        />
                    )}
                    predicates={{
                        match: (a, b) =>
                            parseInt(a.rank.join('')) -
                            parseInt(b.rank.join('')),

                        issueNumber: (a, b) =>
                            weighIssueNumber(a.issueNumber, lastIssueNumber) -
                            weighIssueNumber(b.issueNumber, lastIssueNumber),

                        matchRejections: (a, b) =>
                            a.matchRejections.length - b.matchRejections.length,
                    }}
                    sortKey={sortKey}
                    secondarySortKey="issueNumber"
                    sortDirection={sortDirection}
                    onSortPress={handleSortPress}
                />
            ) : null}

            {totalItems !== items.length && items.length ? (
                <div className={styles.filteredMessage}>
                    {translate('SomeResultsAreHiddenByTheAppliedFilter')}
                </div>
            ) : null}
        </div>
    );
}

export function LibgenFileSearch({ searchPayload }: InteractiveSearchProps) {
    const [search, searchProps] = useLibgenFileSearchMutation({
        selectFromResult: ({ isLoading, isUninitialized, error, data }) => ({
            isFetching: isLoading,
            isPopulated: !isUninitialized,
            error,
            errorMessage: getErrorMessage(error),
            items: (data?.map((item, id) => ({ ...item, id })) ??
                []) as (SearchResult & {
                id: number;
                actions: never;
            })[],
            totalItems: data?.length ?? 0,
        }),
    });

    const [libgenFileUrl, setLibgenFileUrl] = useState('');

    const onUrlChange = useCallback(
        ({ value }: InputChanged<'url', string>) => {
            setLibgenFileUrl(value);
        },
        [],
    );

    const startSearch = useCallback(() => {
        search({
            url: libgenFileUrl,
            ...searchPayload,
        });
    }, [searchPayload, libgenFileUrl, search]);

    if (!searchProps.isPopulated) {
        return (
            <Form>
                <FormGroup>
                    <FormLabel>{translate('LibgenFileSearch')}</FormLabel>

                    <FormInputGroup
                        type={inputTypes.TEXT}
                        name="url"
                        value={libgenFileUrl}
                        helpText={translate('LibgenFileSearchHelpText')}
                        buttons={[
                            <FormInputButton
                                title={translate('Search')}
                                onPress={startSearch}
                            >
                                <Icon name={icons.SEARCH} />
                            </FormInputButton>,
                        ]}
                        onChange={onUrlChange}
                        onSubmit={startSearch}
                    />
                </FormGroup>
            </Form>
        );
    }

    return <InternalSearch searchPayload={searchPayload} {...searchProps} />;
}

export default function InteractiveSearch({
    searchPayload,
}: InteractiveSearchProps) {
    const searchProps = useManualSearchQuery(searchPayload, {
        refetchOnMountOrArgChange: true,
        selectFromResult: ({ isFetching, isUninitialized, error, data }) => ({
            isFetching,
            isPopulated: !isUninitialized,
            error,
            errorMessage: getErrorMessage(error),
            items: (data?.map((item, id) => ({ ...item, id })) ??
                []) as (SearchResult & {
                id: number;
                actions: never;
            })[],
            totalItems: data?.length ?? 0,
        }),
    });

    return <InternalSearch searchPayload={searchPayload} {...searchProps} />;
}
