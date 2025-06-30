import { createSelector } from 'reselect';
import { type AppState } from 'App/State/AppState';

const selectPosterOptions = createSelector(
    (state: AppState) => state.volumesIndex.posterOptions,
    (posterOptions) => posterOptions,
);

export default selectPosterOptions;
