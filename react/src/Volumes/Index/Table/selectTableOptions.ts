import { createSelector } from 'reselect';
import { type AppState } from 'App/State/AppState';

const selectTableOptions = createSelector(
    (state: AppState) => state.volumesIndex.tableOptions,
    (tableOptions) => tableOptions,
);

export default selectTableOptions;
