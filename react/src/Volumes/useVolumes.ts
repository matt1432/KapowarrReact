import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { type AppState } from 'App/State/AppState';

export function createVolumesSelector(volumesId?: number) {
    return createSelector(
        (state: AppState) => state.volumes.itemMap,
        (state: AppState) => state.volumes.items,
        (itemMap, allVolumes) => {
            return volumesId ? allVolumes[itemMap[volumesId]] : undefined;
        },
    );
}

function useVolumes(volumesId?: number) {
    return useSelector(createVolumesSelector(volumesId));
}

export default useVolumes;
