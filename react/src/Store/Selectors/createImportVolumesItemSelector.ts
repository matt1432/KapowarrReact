import { createSelector } from 'reselect';
import { type AppState } from 'App/State/AppState';
import { type ImportVolumes } from 'App/State/ImportVolumesAppState';
import createAllVolumesSelector from './createAllVolumesSelector';

function createImportVolumesItemSelector(id: string) {
    return createSelector(
        (_state: AppState, connectorInput: { id: string }) =>
            connectorInput ? connectorInput.id : id,
        (state: AppState) => state.importVolumes,
        createAllVolumesSelector(),
        (connectorId, importVolumes, volumes) => {
            const finalId = id || connectorId;

            const item =
                importVolumes.items.find((item) => {
                    return item.id === finalId;
                }) ?? ({} as ImportVolumes);

            const selectedVolumes = item && item.selectedVolumes;
            const isExistingVolumes =
                !!selectedVolumes &&
                volumes.some((s) => {
                    return s.tvdbId === selectedVolumes.tvdbId;
                });

            return {
                ...item,
                isExistingVolumes,
            };
        },
    );
}

export default createImportVolumesItemSelector;
