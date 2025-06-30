import { createSelector } from 'reselect';
import { type AppState } from 'App/State/AppState';
import { type Volumes } from 'Volumes/Volumes';
import { type QualityProfile } from 'typings/QualityProfile';
import { createVolumesSelectorForHook } from './createVolumesSelector';

function createVolumesQualityProfileSelector(volumesId: number) {
    return createSelector(
        (state: AppState) => state.settings.qualityProfiles.items,
        createVolumesSelectorForHook(volumesId),
        (qualityProfiles: QualityProfile[], volumes = {} as Volumes) => {
            return qualityProfiles.find((profile) => profile.id === volumes.qualityProfileId);
        },
    );
}

export default createVolumesQualityProfileSelector;
