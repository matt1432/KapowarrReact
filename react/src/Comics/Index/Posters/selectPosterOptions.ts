import { createSelector } from 'reselect';
import { type AppState } from 'App/State/AppState';

const selectPosterOptions = createSelector(
    (state: AppState) => state.comicsIndex.posterOptions,
    (posterOptions) => posterOptions,
);

export default selectPosterOptions;
