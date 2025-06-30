import { createSelector } from 'reselect';
import { type AppState } from 'App/State/AppState';

const selectOverviewOptions = createSelector(
    (state: AppState) => state.comicsIndex.overviewOptions,
    (overviewOptions) => overviewOptions,
);

export default selectOverviewOptions;
