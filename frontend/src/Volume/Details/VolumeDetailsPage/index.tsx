// IMPORTS

// React
import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

// Redux
import { useGetVolumesQuery } from 'Store/Api/Volumes';

// Misc
import translate from 'Utilities/String/translate';

// General Components
import NotFound from 'Components/NotFound';

// Specific Components
import VolumeDetails from '..';

// IMPLEMENTATIONS

export default function VolumeDetailsPage() {
    const { titleSlug } = useParams<{ titleSlug: string }>();

    const { data: allVolumes = [] } = useGetVolumesQuery();

    const navigate = useNavigate();

    const volumeIndex = useMemo(() => {
        return allVolumes.findIndex(
            (volume) => volume.id.toString() === titleSlug,
        );
    }, [allVolumes, titleSlug]);

    const [previousIndex, setPreviousIndex] = useState(volumeIndex);
    if (volumeIndex !== previousIndex) {
        setPreviousIndex(volumeIndex);

        if (
            volumeIndex === -1 &&
            previousIndex !== -1 &&
            previousIndex !== undefined
        ) {
            navigate(`/`);
        }
    }

    if (volumeIndex === -1) {
        return <NotFound message={translate('VolumeCannotBeFound')} />;
    }

    return <VolumeDetails volumeId={allVolumes[volumeIndex].id} />;
}
