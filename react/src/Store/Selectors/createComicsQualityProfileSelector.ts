import { createSelector } from 'reselect';
import { type AppState } from 'App/State/AppState';
import { type Comics } from 'Comics/Comics';
import { type QualityProfile } from 'typings/QualityProfile';
import { createComicsSelectorForHook } from './createComicsSelector';

function createComicsQualityProfileSelector(comicsId: number) {
    return createSelector(
        (state: AppState) => state.settings.qualityProfiles.items,
        createComicsSelectorForHook(comicsId),
        (qualityProfiles: QualityProfile[], comics = {} as Comics) => {
            return qualityProfiles.find((profile) => profile.id === comics.qualityProfileId);
        },
    );
}

export default createComicsQualityProfileSelector;
