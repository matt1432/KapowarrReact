import { createSelector } from 'reselect';

export function createVolumesSelectorForHook(volumesId: number) {
    return createSelector(
        (state) => state.volumes.itemMap,
        (state) => state.volumes.items,
        (itemMap, allVolumes) => {
            return volumesId ? allVolumes[itemMap[volumesId]] : undefined;
        },
    );
}

function createVolumesSelector() {
    return createSelector(
        (_, { volumesId }) => volumesId,
        (state) => state.volumes.itemMap,
        (state) => state.volumes.items,
        (volumesId, itemMap, allVolumes) => {
            return allVolumes[itemMap[volumesId]];
        },
    );
}

export default createVolumesSelector;
