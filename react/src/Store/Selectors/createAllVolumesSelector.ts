import { createSelector } from 'reselect';
import { type AppState } from 'App/State/AppState';

function createAllVolumesSelector() {
    return createSelector(
        (state: AppState) => state.volumes,
        (volumes) => {
            return volumes.items;
        },
    );
}

export default createAllVolumesSelector;
