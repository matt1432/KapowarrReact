import { createSelector } from 'reselect';
import createAllComicsSelector from './createAllComicsSelector';

function createExistingComicsSelector(tvdbId: number | undefined) {
    return createSelector(createAllComicsSelector(), (comics) => {
        if (tvdbId == null) {
            return false;
        }

        return comics.some((s) => s.tvdbId === tvdbId);
    });
}

export default createExistingComicsSelector;
