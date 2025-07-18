// IMPORTS

// React
import { useCallback, useEffect, useState } from 'react';

// Misc
import { icons, kinds } from 'Helpers/Props';

import getErrorMessage from 'Utilities/Object/getErrorMessage';
// import useDebounce from 'Helpers/Hooks/useDebounce';
import useQueryParams from 'Helpers/Hooks/useQueryParams';
import translate from 'Utilities/String/translate';

// General Components
import Alert from 'Components/Alert';
import TextInput from 'Components/Form/TextInput';
import Icon from 'Components/Icon';
import Button from 'Components/Link/Button';
import Link from 'Components/Link/Link';
import LoadingIndicator from 'Components/Loading/LoadingIndicator';
import PageContent from 'Components/Page/PageContent';
import PageContentBody from 'Components/Page/PageContentBody';

// Specific Components
import AddNewVolumeSearchResult from './AddNewVolumeSearchResult';

// CSS
import styles from './AddNewVolume.module.css';

// Types
import type { InputChanged } from 'typings/inputs';

// IMPLEMENTATIONS

function AddNewVolume() {
    const { term: initialTerm = '' } = useQueryParams<{ term: string }>();

    // const volumeCount = useSelector((state: AppState) => state.volumes.items.length);
    const volumeCount = 0;

    const [term, setTerm] = useState(initialTerm);
    const [isFetching, setIsFetching] = useState(false);
    // const query = useDebounce(term, term ? 300 : 0);

    const handleSearchInputChange = useCallback(({ value }: InputChanged<string>) => {
        setTerm(value);
        setIsFetching(!!value.trim());
    }, []);

    const handleClearVolumeLookupPress = useCallback(() => {
        setTerm('');
        setIsFetching(false);
    }, []);

    const {
        isFetching: isFetchingApi,
        error,
        data = [],
    } = { isFetching: false, error: undefined, data: [] }; // useLookupVolume(query);

    useEffect(() => {
        setIsFetching(isFetchingApi);
    }, [isFetchingApi]);

    useEffect(() => {
        setTerm(initialTerm);
    }, [initialTerm]);

    return (
        <PageContent title={translate('AddNewVolume')}>
            <PageContentBody>
                <div className={styles.searchContainer}>
                    <div className={styles.searchIconContainer}>
                        <Icon name={icons.SEARCH} size={20} />
                    </div>

                    <TextInput
                        className={styles.searchInput}
                        name="volumeLookup"
                        value={term}
                        placeholder="eg. Breaking Bad, tvdb:####"
                        autoFocus={true}
                        onChange={handleSearchInputChange}
                    />

                    <Button
                        className={styles.clearLookupButton}
                        onPress={handleClearVolumeLookupPress}
                    >
                        <Icon name={icons.REMOVE} size={20} />
                    </Button>
                </div>

                {isFetching ? <LoadingIndicator /> : null}

                {!isFetching && !!error ? (
                    <div className={styles.message}>
                        <div className={styles.helpText}>{translate('AddNewVolumeError')}</div>

                        <Alert kind={kinds.DANGER}>{getErrorMessage(error)}</Alert>
                    </div>
                ) : null}

                {!isFetching && !error && !!data.length ? (
                    <div className={styles.searchResults}>
                        {data.map((item) => {
                            // @ts-expect-error TODO:
                            return <AddNewVolumeSearchResult key={item.tvdbId} volume={item} />;
                        })}
                    </div>
                ) : null}

                {!isFetching && !error && !data.length && term ? (
                    <div className={styles.message}>
                        <div className={styles.noResults}>
                            {translate('CouldNotFindResults', { term })}
                        </div>
                        <div>{translate('SearchByTvdbId')}</div>
                        <div>
                            <Link to="https://wiki.servarr.com/sonarr/faq#why-cant-i-add-a-new-volumes-when-i-know-the-tvdb-id">
                                {translate('WhyCantIFindMyShow')}
                            </Link>
                        </div>
                    </div>
                ) : null}

                {term ? null : (
                    <div className={styles.message}>
                        <div className={styles.helpText}>{translate('AddNewVolumeHelpText')}</div>
                        <div>{translate('SearchByTvdbId')}</div>
                    </div>
                )}

                {!term && !volumeCount ? (
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

export default AddNewVolume;
