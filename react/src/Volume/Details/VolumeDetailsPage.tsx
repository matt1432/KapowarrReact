// IMPORTS

// React
import { useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router';

// Redux
import { useGetVolumesQuery } from 'Store/Api/Volumes';

// Misc
import translate from 'Utilities/String/translate';

// Hooks
import usePrevious from 'Helpers/Hooks/usePrevious';

// General Components
import NotFound from 'Components/NotFound';

// Specific Components
import VolumeDetails from './VolumeDetails';

// IMPLEMENTATIONS

export default function VolumeDetailsPage() {
    const { data: allVolumes = [] } = useGetVolumesQuery();
    const { titleSlug } = useParams<{ titleSlug: string }>();

    const navigate = useNavigate();

    const volumeIndex = useMemo(() => {
        return allVolumes.findIndex((volume) => volume.id.toString() === titleSlug);
    }, [allVolumes, titleSlug]);

    const previousIndex = usePrevious(volumeIndex);

    useEffect(() => {
        if (volumeIndex === -1 && previousIndex !== -1 && previousIndex !== undefined) {
            navigate(`/`);
        }
    }, [navigate, volumeIndex, previousIndex]);

    if (volumeIndex === -1) {
        return <NotFound message={translate('VolumeCannotBeFound')} />;
    }

    return <VolumeDetails volumeId={allVolumes[volumeIndex].id} />;
}
