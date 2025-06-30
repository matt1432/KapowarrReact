import { createSelector } from 'reselect';
import { type AppState } from 'App/State/AppState';

function createSystemStatusSelector() {
    return createSelector(
        (state: AppState) => state.system.status,
        (status) => {
            return status.item;
        },
    );
}

export default createSystemStatusSelector;
