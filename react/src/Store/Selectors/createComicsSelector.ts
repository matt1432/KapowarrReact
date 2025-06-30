import { createSelector } from 'reselect';

export function createComicsSelectorForHook(comicsId: number) {
    return createSelector(
        (state) => state.comics.itemMap,
        (state) => state.comics.items,
        (itemMap, allComics) => {
            return comicsId ? allComics[itemMap[comicsId]] : undefined;
        },
    );
}

function createComicsSelector() {
    return createSelector(
        (_, { comicsId }) => comicsId,
        (state) => state.comics.itemMap,
        (state) => state.comics.items,
        (comicsId, itemMap, allComics) => {
            return allComics[itemMap[comicsId]];
        },
    );
}

export default createComicsSelector;
