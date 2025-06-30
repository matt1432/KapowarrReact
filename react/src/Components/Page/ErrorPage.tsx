import { type Error } from 'App/State/AppSectionState';
import getErrorMessage from 'Utilities/Object/getErrorMessage';
import translate from 'Utilities/String/translate';
import styles from './ErrorPage.module.css';

interface ErrorPageProps {
    version: string;
    isLocalStorageSupported: boolean;
    translationsError?: Error;
    volumesError?: Error;
    customFiltersError?: Error;
    tagsError?: Error;
    qualityProfilesError?: Error;
    uiSettingsError?: Error;
    systemStatusError?: Error;
}

function ErrorPage(props: ErrorPageProps) {
    const {
        version,
        isLocalStorageSupported,
        translationsError,
        volumesError,
        customFiltersError,
        tagsError,
        qualityProfilesError,
        uiSettingsError,
        systemStatusError,
    } = props;

    let errorMessage = translate('FailedToLoadSonarr');

    if (!isLocalStorageSupported) {
        errorMessage = translate('LocalStorageIsNotSupported');
    }
    else if (translationsError) {
        errorMessage = getErrorMessage(
            translationsError,
            translate('FailedToLoadTranslationsFromApi'),
        );
    }
    else if (volumesError) {
        errorMessage = getErrorMessage(volumesError, translate('FailedToLoadVolumesFromApi'));
    }
    else if (customFiltersError) {
        errorMessage = getErrorMessage(
            customFiltersError,
            translate('FailedToLoadCustomFiltersFromApi'),
        );
    }
    else if (tagsError) {
        errorMessage = getErrorMessage(tagsError, translate('FailedToLoadTagsFromApi'));
    }
    else if (qualityProfilesError) {
        errorMessage = getErrorMessage(
            qualityProfilesError,
            translate('FailedToLoadQualityProfilesFromApi'),
        );
    }
    else if (uiSettingsError) {
        errorMessage = getErrorMessage(uiSettingsError, translate('FailedToLoadUiSettingsFromApi'));
    }
    else if (systemStatusError) {
        errorMessage = getErrorMessage(
            systemStatusError,
            translate('FailedToLoadSystemStatusFromApi'),
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
