// IMPORTS

// Misc
import { getErrorMessage } from 'Utilities/Object/error';

import translate from 'Utilities/String/translate';

// CSS
import styles from './index.module.css';

// Types
import type { AnyError } from 'typings/Api';

interface ErrorPageProps {
    version: string;
    volumesError?: AnyError;
    settingsError?: AnyError;
    rootFoldersError?: AnyError;
}

// IMPLEMENTATIONS

export default function ErrorPage({
    version,
    volumesError,
    settingsError,
    rootFoldersError,
}: ErrorPageProps) {
    let errorMessage = translate('FailedToLoadKapowarr');

    if (volumesError) {
        errorMessage = getErrorMessage(
            volumesError,
            translate('FailedToLoadVolumeFromApi'),
        );
    }
    else if (settingsError) {
        errorMessage = getErrorMessage(
            settingsError,
            translate('FailedToLoadSettingsFromApi'),
        );
    }
    else if (rootFoldersError) {
        errorMessage = getErrorMessage(
            rootFoldersError,
            translate('FailedToLoadRootFoldersFromApi'),
        );
    }

    return (
        <div className={styles.page}>
            <div>{errorMessage}</div>

            <div className={styles.version}>
                {translate('VersionNumber', { version })}
            </div>
        </div>
    );
}
