import translate from 'Utilities/String/translate';

import type { TranslateKey } from 'Utilities/String/translate';
import type { StatusCheck, StatusCheckType } from 'typings/Status';

interface StatusCheckDescription {
    description: TranslateKey;
    subtypes: Record<string, TranslateKey>;
}

const statusCheckDescriptions: Record<StatusCheckType, StatusCheckDescription> =
    {
        cv_rate_limit: {
            description: 'StatusCheckCvRateLimit',
            subtypes: {
                search_volumes: 'StatusCheckSubtypeSearchVolumes',
                fetch_volume: 'StatusCheckSubtypeFetchVolume',
                fetch_issues: 'StatusCheckSubtypeFetchIssues',
            },
        },
        download_service_rate_limit: {
            description: 'StatusCheckDownloadServiceRateLimit',
            subtypes: {},
        },
        root_folder_almost_full: {
            description: 'StatusCheckRootFolderAlmostFull',
            subtypes: {},
        },
        root_folder_full: {
            description: 'StatusCheckRootFolderFull',
            subtypes: {},
        },
        cf_challenge_with_no_fs: {
            description: 'StatusCheckCfChallengeWithNoFs',
            subtypes: {},
        },
    };

export default function getStatusCheckMessage({
    type,
    displaySubtypes,
}: StatusCheck) {
    const statusCheckDescription = statusCheckDescriptions[type];
    if (!statusCheckDescription) {
        return type;
    }

    const description = translate(statusCheckDescription.description);
    if (displaySubtypes.length === 0) {
        return description;
    }

    const subtypes = displaySubtypes
        .map((subtype) =>
            subtype in statusCheckDescription.subtypes
                ? translate(statusCheckDescription.subtypes[subtype])
                : subtype,
        )
        .join(', ');

    return `${description}: ${subtypes}`;
}
