import { createSelector, createSelectorCreator, lruMemoize } from 'reselect';
import hasDifferentItemsOrOrder from 'Utilities/Object/hasDifferentItemsOrOrder';
import createClientSideCollectionSelector from './createClientSideCollectionSelector';
import type { ComicsAppState } from 'App/State/ComicsAppState';
import type { Comics } from 'Comics/Comics';

function createUnoptimizedSelector(uiSection: string) {
    return createSelector(
        createClientSideCollectionSelector('comics', uiSection),
        (comics: ComicsAppState) => {
            const items = comics.items.map((s) => {
                const { id, sortTitle } = s;

                return {
                    id,
                    sortTitle,
                };
            });

            return {
                ...comics,
                items,
            };
        },
    );
}

function comicsListEqual(a: Comics[], b: Comics[]) {
    return hasDifferentItemsOrOrder(a, b);
}

const createComicsEqualSelector = createSelectorCreator(lruMemoize, comicsListEqual);

function createComicsClientSideCollectionItemsSelector(uiSection: string) {
    return createComicsEqualSelector(createUnoptimizedSelector(uiSection), (comics) => comics);
}

export default createComicsClientSideCollectionItemsSelector;
