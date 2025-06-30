import { createSelector } from 'reselect';
import { type AppState } from 'App/State/AppState';

function createAllComicsSelector() {
    return createSelector(
        (state: AppState) => state.comics,
        (comics) => {
            return comics.items;
        },
    );
}

export default createAllComicsSelector;
