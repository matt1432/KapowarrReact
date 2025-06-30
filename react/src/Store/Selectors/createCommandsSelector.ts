import { createSelector } from 'reselect';
import { type AppState } from 'App/State/AppState';

function createCommandsSelector() {
    return createSelector(
        (state: AppState) => state.commands,
        (commands) => {
            return commands.items;
        },
    );
}

export default createCommandsSelector;
