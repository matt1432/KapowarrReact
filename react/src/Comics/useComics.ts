import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { type AppState } from 'App/State/AppState';

export function createComicsSelector(comicsId?: number) {
    return createSelector(
        (state: AppState) => state.comics.itemMap,
        (state: AppState) => state.comics.items,
        (itemMap, allComics) => {
            return comicsId ? allComics[itemMap[comicsId]] : undefined;
        },
    );
}

function useComics(comicsId?: number) {
    return useSelector(createComicsSelector(comicsId));
}

export default useComics;
