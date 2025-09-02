// IMPORTS

// React
import { useCallback, useState } from 'react';

// Redux
import { useRootDispatch, useRootSelector } from 'Store/createAppStore';
import { setInteractiveSearchSort } from 'Store/Slices/SearchResults';

import { useLibgenFileSearchMutation, useManualSearchQuery } from 'Store/Api/Command';

// Misc
import { inputTypes, kinds } from 'Helpers/Props';
import { getErrorMessage } from 'Utilities/Object/error';

import translate from 'Utilities/String/translate';

// General Components
import Alert from 'Components/Alert';
import FormGroup from 'Components/Form/FormGroup';
import FormInputGroup from 'Components/Form/FormInputGroup';
import FormLabel from 'Components/Form/FormLabel';
import LoadingIndicator from 'Components/Loading/LoadingIndicator';
import SortedTable from 'Components/Table/SortedTable';

// Specific Components
import InteractiveSearchRow from './InteractiveSearchRow';

// CSS
import styles from './index.module.css';

// Types
import type { Column } from 'Components/Table/Column';

import type { InteractiveSearchPayload, InteractiveSearchSort, SearchResult } from 'typings/Search';

import type { SortDirection } from 'Helpers/Props/sortDirections';
import type { AnyError } from 'typings/Api';
import type { InputChanged } from 'typings/Inputs';
import { Form } from 'react-router';

export interface InteractiveSearchProps {
    searchPayload: InteractiveSearchPayload;
}

interface SearchProps extends InteractiveSearchProps {
    isFetching: boolean;
    isPopulated: boolean;
    error: AnyError | undefined;
    errorMessage: string;
    items: SearchResult[];
    totalItems: number;
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

function InternalSearch({
    isFetching,
    isPopulated,
    error,
    errorMessage,
    items,
    totalItems,
    searchPayload,
}: SearchProps) {
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
                <SortedTable
                    columns={columns}
                    items={items}
                    itemRenderer={(item) => (
                        <InteractiveSearchRow
                            key={item.link}
                            result={item}
                            searchPayload={searchPayload}
                        />
                    )}
                    predicates={{
                        issueNumber: (a, b) =>
                            (Array.isArray(a.issueNumber)
                                ? a.issueNumber[0]
                                : (a.issueNumber ?? 0)) -
                            (Array.isArray(b.issueNumber)
                                ? b.issueNumber[0]
                                : (b.issueNumber ?? 0)),
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
            items: data ?? [],
            totalItems: data?.length ?? 0,
        }),
    });

    const [libgenFileUrl, setLibgenFileUrl] = useState('');

    const onUrlChange = useCallback(({ value }: InputChanged<'url', string>) => {
        setLibgenFileUrl(value);
    }, []);

    const startSearch = useCallback(() => {
        search({
            url: libgenFileUrl,
            ...searchPayload,
        });
    }, [searchPayload, libgenFileUrl, search]);

    if (!searchProps.isPopulated) {
        return (
            <Form onSubmit={startSearch}>
                <FormGroup>
                    <FormLabel>{translate('LibgenFileSearch')}</FormLabel>

                    <FormInputGroup
                        type={inputTypes.TEXT}
                        name="url"
                        value={libgenFileUrl}
                        helpText={translate('LibgenFileSearchHelpText')}
                        onChange={onUrlChange}
                    />
                </FormGroup>
            </Form>
        );
    }

    return <InternalSearch searchPayload={searchPayload} {...searchProps} />;
}

export default function InteractiveSearch({ searchPayload }: InteractiveSearchProps) {
    const searchProps = useManualSearchQuery(searchPayload, {
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

    return <InternalSearch searchPayload={searchPayload} {...searchProps} />;
}
