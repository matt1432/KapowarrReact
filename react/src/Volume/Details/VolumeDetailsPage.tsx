// IMPORTS

// React
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';

// Redux
import { useGetVolumesQuery } from 'Store/createApiEndpoints';

// Misc
import usePrevious from 'Helpers/Hooks/usePrevious';
import translate from 'Utilities/String/translate';

// General Components
import NotFound from 'Components/NotFound';

// Specific Components
import VolumeDetails from './VolumeDetails';

// IMPLEMENTATIONS

function VolumeDetailsPage() {
    const { data: allVolumes } = useGetVolumesQuery(undefined);
    const { titleSlug } = useParams<{ titleSlug: string }>();

    const navigate = useNavigate();

    const volumeIndex = allVolumes?.findIndex((volume) => volume.id.toString() === titleSlug) ?? -1;

    const previousIndex = usePrevious(volumeIndex);

    useEffect(() => {
        if (volumeIndex === -1 && previousIndex !== -1 && previousIndex !== undefined) {
            navigate(`/`);
        }
    }, [navigate, volumeIndex, previousIndex]);

    if (!allVolumes || volumeIndex === -1) {
        return <NotFound message={translate('VolumeCannotBeFound')} />;
    }

    return <VolumeDetails volumeId={allVolumes[volumeIndex].id} />;
}

export default VolumeDetailsPage;
