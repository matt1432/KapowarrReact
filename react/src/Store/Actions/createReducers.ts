import { createReduxHistoryContext } from 'redux-first-history';
import { combineReducers } from 'redux';
import { enableBatching } from 'redux-batched-actions';
import { type History } from 'history';

import actions from 'Store/Actions';
import type { handleActions } from 'redux-actions';

const defaultState = {} as Record<string, object>;
const reducers = {} as Record<string, ReturnType<typeof handleActions>>;

actions.forEach((action) => {
    const section = action.section;

    defaultState[section] = action.defaultState;
    reducers[section] = action.reducers;
});

export { defaultState };

export default function (history: History) {
    const { createReduxHistory, routerMiddleware, routerReducer } = createReduxHistoryContext({
        history,
    });
    return {
        createReduxHistory,
        routerMiddleware,
        routerReducer,
        reducers: enableBatching(
            combineReducers({
                ...reducers,
                router: routerReducer,
            }),
        ),
    };
}
