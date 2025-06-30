import { createSelector } from 'reselect';
import { type AppState } from 'App/State/AppState';
import { type ImportComics } from 'App/State/ImportComicsAppState';
import createAllComicsSelector from './createAllComicsSelector';

function createImportComicsItemSelector(id: string) {
    return createSelector(
        (_state: AppState, connectorInput: { id: string }) =>
            connectorInput ? connectorInput.id : id,
        (state: AppState) => state.importComics,
        createAllComicsSelector(),
        (connectorId, importComics, comics) => {
            const finalId = id || connectorId;

            const item =
                importComics.items.find((item) => {
                    return item.id === finalId;
                }) ?? ({} as ImportComics);

            const selectedComics = item && item.selectedComics;
            const isExistingComics =
                !!selectedComics &&
                comics.some((s) => {
                    return s.tvdbId === selectedComics.tvdbId;
                });

            return {
                ...item,
                isExistingComics,
            };
        },
    );
}

export default createImportComicsItemSelector;
