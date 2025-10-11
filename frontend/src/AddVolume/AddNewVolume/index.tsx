// IMPORTS

// React
import { useCallback, useEffect, useState } from 'react';

// Redux
import {
    useGetVolumesQuery,
    useLazyLookupVolumeQuery,
} from 'Store/Api/Volumes';

// Misc
import { icons, kinds } from 'Helpers/Props';
import { getErrorMessage } from 'Utilities/Object/error';

import translate from 'Utilities/String/translate';

// Hooks
import useQueryParams from 'Helpers/Hooks/useQueryParams';

// General Components
import Alert from 'Components/Alert';
import TextInput from 'Components/Form/TextInput';
import Icon from 'Components/Icon';
import Button from 'Components/Link/Button';
import LoadingIndicator from 'Components/Loading/LoadingIndicator';
import PageContent from 'Components/Page/PageContent';
import PageContentBody from 'Components/Page/PageContentBody';

// Specific Components
import AddNewVolumeSearchResult from './AddNewVolumeSearchResult';

// CSS
import styles from './index.module.css';

// Types
import type { InputChanged } from 'typings/Inputs';

// IMPLEMENTATIONS

export default function AddNewVolume() {
    const { term: initialTerm = '' } = useQueryParams<{ term: string }>();

    const { volumeCount } = useGetVolumesQuery(undefined, {
        selectFromResult: ({ data }) => ({
            volumeCount: data?.length ?? 0,
        }),
    });

    const [currentTerm, setCurrentTerm] = useState(initialTerm);
    const [searchedTerm, setSearchedTerm] = useState(initialTerm);

    const handleSearchInputChange = useCallback(
        ({ value }: InputChanged<string, string>) => {
            setCurrentTerm(value);
        },
        [],
    );

    const [lookupVolume, { isFetching, error, data = [] }] =
        useLazyLookupVolumeQuery();

    const handleClearVolumeLookupPress = useCallback(() => {
        setCurrentTerm('');
        setSearchedTerm('');
    }, []);

    const handleSubmit = useCallback(() => {
        setSearchedTerm(currentTerm);

        if (currentTerm !== '') {
            lookupVolume({ query: currentTerm });
        }
    }, [lookupVolume, currentTerm]);

    useEffect(() => {
        if (initialTerm !== '') {
            lookupVolume({ query: initialTerm });
        }
    }, [initialTerm, lookupVolume]);

    return (
        <PageContent title={translate('AddNewVolume')}>
            <PageContentBody>
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
                        value={currentTerm}
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
                    <div className={styles.message}>
                        <div className={styles.helpText}>
                            {translate('AddNewVolumeError')}
                        </div>

                        <Alert kind={kinds.DANGER}>
                            {getErrorMessage(error)}
                        </Alert>
                    </div>
                ) : null}

                {!isFetching && !error && searchedTerm !== '' ? (
                    <div className={styles.searchResults}>
                        {data.map((item) => {
                            return (
                                <AddNewVolumeSearchResult
                                    key={item.comicvineId}
                                    volume={item}
                                />
                            );
                        })}
                    </div>
                ) : null}

                {!isFetching && !error && !data.length && searchedTerm ? (
                    <div className={styles.message}>
                        <div className={styles.noResults}>
                            {translate('CouldNotFindResults', {
                                term: searchedTerm,
                            })}
                        </div>
                        <div>{translate('SearchByComicVineId')}</div>
                        <div>{translate('WhyCantIFindMyVolume')}</div>
                    </div>
                ) : null}

                {searchedTerm ? null : (
                    <div className={styles.message}>
                        <div className={styles.helpText}>
                            {translate('AddNewVolumeHelpText')}
                        </div>
                        <div>{translate('SearchByComicVineId')}</div>
                    </div>
                )}

                {!searchedTerm && !volumeCount ? (
                    <div className={styles.message}>
                        <div className={styles.noVolumeText}>
                            {translate('NoVolumeHaveBeenAdded')}
                        </div>
                        <div>
                            <Button to="/add/import" kind={kinds.PRIMARY}>
                                {translate('ImportExistingVolume')}
                            </Button>
                        </div>
                    </div>
                ) : null}

                <div />
            </PageContentBody>
        </PageContent>
    );
}
