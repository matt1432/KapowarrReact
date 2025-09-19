// IMPORTS

// React
import { useCallback, useState } from 'react';

// Redux
import { useLazyGetImportProposalsQuery } from 'Store/Api/Volumes';

// Misc
import { kinds } from 'Helpers/Props';

import { getErrorMessage } from 'Utilities/Object/error';

import translate from 'Utilities/String/translate';

// General Components
import Alert from 'Components/Alert';
import FieldSet from 'Components/FieldSet';
import LoadingIndicator from 'Components/Loading/LoadingIndicator';
import PageContent from 'Components/Page/PageContent';
import PageContentBody from 'Components/Page/PageContentBody';

// Specific Components
import ImportForm from './ImportForm';
import ImportProposals from './ImportProposals';

// CSS
import styles from './index.module.css';

// Types
import type { GetImportProposalsParams } from 'Store/Api/Volumes';

// IMPLEMENTATIONS

export default function ImportVolume() {
    const [getProposals, { data, isFetching, error }] = useLazyGetImportProposalsQuery({
        selectFromResult: ({ data, isFetching, error }) => ({
            data:
                data?.map((item, id) => ({
                    ...item,
                    id,
                })) ?? [],
            isFetching,
            error,
        }),
    });

    const [onResultsPage, setOnResultsPage] = useState(false);

    const onScanPress = useCallback(
        (params: GetImportProposalsParams) => {
            getProposals(params);
            setOnResultsPage(true);
        },
        [getProposals],
    );

    const returnToSearchPage = useCallback(() => {
        setOnResultsPage(false);
    }, []);

    return (
        <PageContent className={styles.content} title={translate('ImportVolume')}>
            <PageContentBody>
                {isFetching ? <LoadingIndicator /> : null}

                {error ? <Alert kind={kinds.DANGER}>{getErrorMessage(error)}</Alert> : null}

                {!onResultsPage && !isFetching ? (
                    <FieldSet legend="Import an existing organized library to add volumes to Kapowarr">
                        <p>A few notes:</p>
                        <ul>
                            <li>
                                Check if Kapowarr matched correctly! Comicvine has separate releases
                                for normal volumes, TPB's, one shots, hard covers, etc. So even
                                though the name and year match, it could still be a wrong match.
                            </li>
                            <li>
                                Importing a lot of volumes in one go will quickly make Kapowarr
                                reach the rate limit of ComicVine. Import volumes in batches to
                                avoid this. It's advised to not go above 50 volumes at a time.
                            </li>
                            <li>
                                Files are not allowed to be directly in the root folder. They have
                                to be in a sub-folder.
                            </li>
                        </ul>

                        <br />

                        <ImportForm onScanPress={onScanPress} />
                    </FieldSet>
                ) : null}

                {onResultsPage && !isFetching ? (
                    <ImportProposals proposals={data} returnToSearchPage={returnToSearchPage} />
                ) : null}
            </PageContentBody>
        </PageContent>
    );
}
