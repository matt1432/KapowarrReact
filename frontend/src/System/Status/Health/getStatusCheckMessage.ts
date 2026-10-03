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
    };

export default function getStatusCheckMessage({
    type,
    displaySubtypes,
}: StatusCheck) {
    const statusCheckDescription = statusCheckDescriptions[type];
    if (!statusCheckDescription) {
        return type;
    }

    const subtypes = displaySubtypes
        .map((subtype) =>
            subtype in statusCheckDescription.subtypes
                ? translate(statusCheckDescription.subtypes[subtype])
                : subtype,
        )
        .join(', ');

    return `${translate(statusCheckDescription.description)}: ${subtypes}`;
}
