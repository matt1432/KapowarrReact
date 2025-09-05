// IMPORTS

// Redux
import { useFetchQueueDetails } from 'Store/Api/Queue';

// Misc
import { sizes } from 'Helpers/Props';

import getDownloadedIssuesProgress from 'Utilities/Volume/getDownloadedIssuesProgress';

// General Components
import Label from 'Components/Label';

// Types
import type { Volume } from 'Volume/Volume';
import { useGetVolumesQuery } from 'Store/Api/Volumes';

interface VolumeProgressLabelProps {
    className: string;
    volume: Volume;
}

// IMPLEMENTATIONS

export default function VolumeProgressLabel({ className, volume }: VolumeProgressLabelProps) {
    const { volumePublicInfo } = useGetVolumesQuery(undefined, {
        selectFromResult: ({ data }) => ({
            volumePublicInfo: data!.find((item) => item.id === volume.id)!,
        }),
    });
    const { queue } = useFetchQueueDetails({ volumeId: volume.id });
    const { kind, text } = getDownloadedIssuesProgress({ queue, volume: volumePublicInfo });

    return (
        <Label className={className} kind={kind} size={sizes.LARGE}>
            <span>{text}</span>
        </Label>
    );
}
