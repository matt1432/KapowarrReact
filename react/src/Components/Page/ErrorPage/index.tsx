// TODO:
// IMPORTS

// Misc
import { getErrorMessage } from 'Utilities/Object/error';

import translate from 'Utilities/String/translate';

// CSS
import styles from './index.module.css';

// Types
// import type { Error } from 'App/State/AppSectionState';

interface ErrorPageProps {
    version: string;
    translationsError?: Error;
    volumesError?: Error;
    customFiltersError?: Error;
    tagsError?: Error;
    qualityProfilesError?: Error;
    uiSettingsError?: Error;
    systemStatusError?: Error;
}

// IMPLEMENTATIONS

function ErrorPage({
    version,
    translationsError,
    volumesError,
    customFiltersError,
    tagsError,
    qualityProfilesError,
    uiSettingsError,
    systemStatusError,
}: ErrorPageProps) {
    let errorMessage = translate('FailedToLoadKapowarr');

    if (translationsError) {
        errorMessage = getErrorMessage(
            translationsError,
            // translate('FailedToLoadTranslationsFromApi'),
        );
    }
    else if (volumesError) {
        errorMessage = getErrorMessage(volumesError /*, translate('FailedToLoadVolumeFromApi')*/);
    }
    else if (customFiltersError) {
        errorMessage = getErrorMessage(
            customFiltersError,
            // translate('FailedToLoadCustomFiltersFromApi'),
        );
    }
    else if (tagsError) {
        errorMessage = getErrorMessage(tagsError /*, translate('FailedToLoadTagsFromApi')*/);
    }
    else if (qualityProfilesError) {
        errorMessage = getErrorMessage(
            qualityProfilesError,
            // translate('FailedToLoadQualityProfilesFromApi'),
        );
    }
    else if (uiSettingsError) {
        errorMessage = getErrorMessage(
            uiSettingsError /*, translate('FailedToLoadUiSettingsFromApi')*/,
        );
    }
    else if (systemStatusError) {
        errorMessage = getErrorMessage(
            systemStatusError,
            // translate('FailedToLoadSystemStatusFromApi'),
        );
    }

    return (
        <div className={styles.page}>
            <div>{errorMessage}</div>

            <div className={styles.version}>{translate('VersionNumber', { version })}</div>
        </div>
    );
}

export default ErrorPage;
