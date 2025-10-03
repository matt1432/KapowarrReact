// IMPORTS

// Misc
import { getErrorMessage } from 'Utilities/Object/error';

import translate from 'Utilities/String/translate';

// CSS
import styles from './index.module.css';

// Types
import type { AnyError } from 'typings/Api';

interface ErrorPageProps {
    volumesError?: AnyError;
    settingsError?: AnyError;
    rootFoldersError?: AnyError;
    isHandlingBreakingChange: boolean;
}

// IMPLEMENTATIONS

export default function ErrorPage({
    volumesError,
    settingsError,
    rootFoldersError,
    isHandlingBreakingChange,
}: ErrorPageProps) {
    let errorMessage = translate('FailedToLoadKapowarr');

    if (isHandlingBreakingChange) {
        errorMessage = translate('HandleBreakingChange');
    }
    else if (volumesError) {
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
                {translate('VersionNumber', {
                    version: window.Kapowarr.version,
                })}
            </div>
        </div>
    );
}
