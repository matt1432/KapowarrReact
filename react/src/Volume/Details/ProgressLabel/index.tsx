// IMPORTS

// React
import { useMemo } from 'react';

// Redux
import { useFetchQueueDetails } from 'Store/Api/Queue';

// Misc
import { sizes } from 'Helpers/Props';

import getDownloadedIssuesProgress from 'Utilities/Volume/getDownloadedIssuesProgress';

// General Components
import Label from 'Components/Label';

// Types
import type { VolumePublicInfo } from 'Volume/Volume';

interface ProgressLabelProps {
    className: string;
    volume: VolumePublicInfo;
}

// IMPLEMENTATIONS

export default function ProgressLabel({ className, volume }: ProgressLabelProps) {
    const { queue } = useFetchQueueDetails({ volumeId: volume.id });

    const { kind, text } = useMemo(
        () => getDownloadedIssuesProgress({ queue, volume }),
        [queue, volume],
    );

    return (
        <Label className={className} kind={kind} size={sizes.LARGE}>
            <span>{text}</span>
        </Label>
    );
}
