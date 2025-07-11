import { useCallback, useEffect, useState } from 'react';
import Alert from 'Components/Alert';
import TextInput from 'Components/Form/TextInput';
import Icon from 'Components/Icon';
import Button from 'Components/Link/Button';
import Link from 'Components/Link/Link';
import LoadingIndicator from 'Components/Loading/LoadingIndicator';
import PageContent from 'Components/Page/PageContent';
import PageContentBody from 'Components/Page/PageContentBody';
// import useDebounce from 'Helpers/Hooks/useDebounce';
import useQueryParams from 'Helpers/Hooks/useQueryParams';
import { icons, kinds } from 'Helpers/Props';
import { type InputChanged } from 'typings/inputs';
import getErrorMessage from 'Utilities/Object/getErrorMessage';
import translate from 'Utilities/String/translate';
import AddNewVolumesSearchResult from './AddNewVolumesSearchResult';
import styles from './AddNewVolumes.module.css';

function AddNewVolumes() {
    const { term: initialTerm = '' } = useQueryParams<{ term: string }>();

    // const volumesCount = useSelector((state: AppState) => state.volumes.items.length);
    const volumesCount = 0;

    const [term, setTerm] = useState(initialTerm);
    const [isFetching, setIsFetching] = useState(false);
    // const query = useDebounce(term, term ? 300 : 0);

    const handleSearchInputChange = useCallback(({ value }: InputChanged<string>) => {
        setTerm(value);
        setIsFetching(!!value.trim());
    }, []);

    const handleClearVolumesLookupPress = useCallback(() => {
        setTerm('');
        setIsFetching(false);
    }, []);

    const {
        isFetching: isFetchingApi,
        error,
        data = [],
    } = { isFetching: false, error: undefined, data: [] }; // useLookupVolumes(query);

    useEffect(() => {
        setIsFetching(isFetchingApi);
    }, [isFetchingApi]);

    useEffect(() => {
        setTerm(initialTerm);
    }, [initialTerm]);

    return (
        <PageContent title={translate('AddNewVolumes')}>
            <PageContentBody>
                <div className={styles.searchContainer}>
                    <div className={styles.searchIconContainer}>
                        <Icon name={icons.SEARCH} size={20} />
                    </div>

                    <TextInput
                        className={styles.searchInput}
                        name="volumesLookup"
                        value={term}
                        placeholder="eg. Breaking Bad, tvdb:####"
                        autoFocus={true}
                        onChange={handleSearchInputChange}
                    />

                    <Button
                        className={styles.clearLookupButton}
                        onPress={handleClearVolumesLookupPress}
                    >
                        <Icon name={icons.REMOVE} size={20} />
                    </Button>
                </div>

                {isFetching ? <LoadingIndicator /> : null}

                {!isFetching && !!error ? (
                    <div className={styles.message}>
                        <div className={styles.helpText}>{translate('AddNewVolumesError')}</div>

                        <Alert kind={kinds.DANGER}>{getErrorMessage(error)}</Alert>
                    </div>
                ) : null}

                {!isFetching && !error && !!data.length ? (
                    <div className={styles.searchResults}>
                        {data.map((item) => {
                            // @ts-expect-error TODO:
                            return <AddNewVolumesSearchResult key={item.tvdbId} volumes={item} />;
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
                        <div className={styles.helpText}>{translate('AddNewVolumesHelpText')}</div>
                        <div>{translate('SearchByTvdbId')}</div>
                    </div>
                )}

                {!term && !volumesCount ? (
                    <div className={styles.message}>
                        <div className={styles.noVolumesText}>
                            {translate('NoVolumesHaveBeenAdded')}
                        </div>
                        <div>
                            <Button to="/add/import" kind={kinds.PRIMARY}>
                                {translate('ImportExistingVolumes')}
                            </Button>
                        </div>
                    </div>
                ) : null}

                <div />
            </PageContentBody>
        </PageContent>
    );
}

export default AddNewVolumes;
