// TODO:
// IMPORTS

// React
import { useCallback, useEffect, useState } from 'react';

// Redux
import { useLazyGetImportProposalsQuery } from 'Store/Api/Volumes';

// Misc
import translate from 'Utilities/String/translate';

// Hooks

// General Components
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

// IMPLEMENTATIONS

export default function ImportVolume() {
    const [onScanPress, { data, isFetching, isSuccess }] = useLazyGetImportProposalsQuery({
        selectFromResult: ({ data, isFetching, isSuccess }) => ({
            data:
                data?.map((item, id) => ({
                    ...item,
                    id,
                })) ?? [],
            isFetching,
            isSuccess,
        }),
    });

    const [onResultsPage, setOnResultsPage] = useState(false);

    useEffect(() => {
        if (isSuccess) {
            setOnResultsPage(true);
        }
    }, [isSuccess]);

    const returnToSearchPage = useCallback(() => {
        setOnResultsPage(false);
    }, []);

    return (
        <PageContent className={styles.content} title={translate('ImportVolume')}>
            <PageContentBody>
                {isFetching ? <LoadingIndicator /> : null}

                {!onResultsPage && !isFetching ? (
                    <FieldSet legend="Import an existing organized library to add volumes to Kapowarr">
                        <h2></h2>
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
                            <li>
                                If each issue has a separate sub-folder, enable 'Apply limit to
                                parent folder' so that the limit is correctly applied.
                            </li>
                        </ul>

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
