import { createSelector, createSelectorCreator, lruMemoize } from 'reselect';
import hasDifferentItemsOrOrder from 'Utilities/Object/hasDifferentItemsOrOrder';
import createClientSideCollectionSelector from './createClientSideCollectionSelector';
import type { VolumesAppState } from 'App/State/VolumesAppState';
import type { Volumes } from 'Volumes/Volumes';

function createUnoptimizedSelector(uiSection: string) {
    return createSelector(
        createClientSideCollectionSelector('volumes', uiSection),
        (volumes: VolumesAppState) => {
            const items = volumes.items.map((s) => {
                const { id, sortTitle } = s;

                return {
                    id,
                    sortTitle,
                };
            });

            return {
                ...volumes,
                items,
            };
        },
    );
}

function volumesListEqual(a: Volumes[], b: Volumes[]) {
    return hasDifferentItemsOrOrder(a, b);
}

const createVolumesEqualSelector = createSelectorCreator(lruMemoize, volumesListEqual);

function createVolumesClientSideCollectionItemsSelector(uiSection: string) {
    return createVolumesEqualSelector(createUnoptimizedSelector(uiSection), (volumes) => volumes);
}

export default createVolumesClientSideCollectionItemsSelector;
