// IMPORTS

// Redux
import { useFetchQueueDetails } from 'Store/createApiEndpoints';

// Misc
import { sizes } from 'Helpers/Props';

import getDownloadedIssuesProgress from 'Utilities/Volume/getDownloadedIssuesProgress';

// General Components
import Label from 'Components/Label';

// Types
import type { Volume } from 'Volume/Volume';

interface VolumeProgressLabelProps {
    className: string;
    volume: Volume;
}

// IMPLEMENTATIONS

function VolumeProgressLabel({ className, volume }: VolumeProgressLabelProps) {
    const { queue } = useFetchQueueDetails({ volumeId: volume.id });
    const { kind, text } = getDownloadedIssuesProgress({ queue, volume });

    return (
        <Label className={className} kind={kind} size={sizes.LARGE}>
            <span>{text}</span>
        </Label>
    );
}

export default VolumeProgressLabel;
