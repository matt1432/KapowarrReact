import { createSelector } from 'reselect';
import createAllVolumesSelector from './createAllVolumesSelector';

function createExistingVolumesSelector(tvdbId: number | undefined) {
    return createSelector(createAllVolumesSelector(), (volumes) => {
        if (tvdbId == null) {
            return false;
        }

        return volumes.some((s) => s.tvdbId === tvdbId);
    });
}

export default createExistingVolumesSelector;
