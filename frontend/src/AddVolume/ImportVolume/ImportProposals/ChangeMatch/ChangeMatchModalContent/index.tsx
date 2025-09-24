// IMPORTS

// React
import { useCallback, useEffect, useState } from 'react';

// Redux
import { useLazyLookupVolumeQuery } from 'Store/Api/Volumes';

// Misc
import { icons, kinds } from 'Helpers/Props';

import { getErrorMessage } from 'Utilities/Object/error';

import translate from 'Utilities/String/translate';

// General Components
import Alert from 'Components/Alert';
import Button from 'Components/Link/Button';
import Icon from 'Components/Icon';
import LoadingIndicator from 'Components/Loading/LoadingIndicator';
import ModalBody from 'Components/Modal/ModalBody';
import ModalContent from 'Components/Modal/ModalContent';
import ModalFooter from 'Components/Modal/ModalFooter';
import ModalHeader from 'Components/Modal/ModalHeader';
import SortedTable from 'Components/Table/SortedTable';
import TextInput from 'Components/Form/TextInput';

// Specific Components
import ChangeMatchRow from '../ChangeMatchRow';

// CSS
import styles from './index.module.css';

// Types
import type { ProposedImport } from 'typings/Search';
import type { VolumeMetadata } from 'AddVolume/AddVolume';
import type { InputChanged } from 'typings/Inputs';
import type { Column } from 'Components/Table/Column';

export type VolumeSearchResult = VolumeMetadata & {
    actions: never;
};

export interface ChangeMatchModalContentProps {
    proposal: ProposedImport & { id: number };
    onEditMatch: (match: VolumeMetadata) => void;
    onEditGroupMatch: (match: VolumeMetadata) => void;
    onModalClose: () => void;
}

// IMPLEMENTATIONS

const columns: Column<keyof VolumeSearchResult>[] = [
    {
        name: 'title',
        label: () => translate('Title'),
        isVisible: true,
        isSortable: true,
    },
    {
        name: 'issueCount',
        label: () => translate('IssueCount'),
        isVisible: true,
        isSortable: true,
    },
    {
        name: 'actions',
        label: '',
        isVisible: true,
        isSortable: true,
    },
];

export default function ChangeMatchModalContent({
    proposal,
    onEditMatch,
    onEditGroupMatch,
    onModalClose,
}: ChangeMatchModalContentProps) {
    const [query, setQuery] = useState('');
    const [showResults, setShowResults] = useState(false);

    const handleSearchInputChange = useCallback(
        ({ value }: InputChanged<string, string>) => {
            setQuery(value);
        },
        [],
    );

    const handleClearVolumeLookupPress = useCallback(() => {
        setQuery('');
        setShowResults(false);
    }, []);

    const [lookupVolume, { isFetching, error, data }] =
        useLazyLookupVolumeQuery({
            selectFromResult: ({ data, isFetching, error }) => ({
                data: (data ?? []) as VolumeSearchResult[],
                isFetching,
                error,
            }),
        });

    useEffect(() => {
        setShowResults(data.length !== 0);
    }, [data]);

    const handleSubmit = useCallback(() => {
        if (query !== '') {
            lookupVolume({ query });
        }
        else {
            setShowResults(false);
        }
    }, [lookupVolume, query]);

    return (
        <ModalContent onModalClose={onModalClose}>
            <ModalHeader>
                {translate('ChangeMatchModalHeader', {
                    title: proposal.fileTitle,
                })}
            </ModalHeader>

            <ModalBody>
                <div className={styles.searchContainer}>
                    <Button
                        className={styles.searchIconContainer}
                        onPress={handleSubmit}
                    >
                        <Icon name={icons.SEARCH} size={20} />
                    </Button>

                    <TextInput
                        className={styles.searchInput}
                        name="volumeLookup"
                        value={query}
                        placeholder="eg. Avengers, cv:4050-2127"
                        autoFocus={true}
                        onChange={handleSearchInputChange}
                        onSubmit={handleSubmit}
                    />

                    <Button
                        className={styles.clearLookupButton}
                        onPress={handleClearVolumeLookupPress}
                    >
                        <Icon name={icons.REMOVE} size={20} />
                    </Button>
                </div>

                {isFetching ? <LoadingIndicator /> : null}

                {!isFetching && error ? (
                    <Alert kind={kinds.DANGER}>{getErrorMessage(error)}</Alert>
                ) : null}

                {!isFetching && !error && showResults ? (
                    <SortedTable
                        columns={columns}
                        items={data}
                        itemRenderer={(item) => (
                            <ChangeMatchRow
                                columns={columns}
                                match={item}
                                onEditMatch={onEditMatch}
                                onEditGroupMatch={onEditGroupMatch}
                            />
                        )}
                    />
                ) : null}
            </ModalBody>

            <ModalFooter>
                <Button onPress={onModalClose}>{translate('Cancel')}</Button>
            </ModalFooter>
        </ModalContent>
    );
}
