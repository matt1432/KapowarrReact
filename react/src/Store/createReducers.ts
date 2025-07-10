import { createReduxHistoryContext } from 'redux-first-history';
import { combineReducers } from 'redux';
import { enableBatching } from 'redux-batched-actions';
import { type History } from 'history';

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
                router: routerReducer,
            }),
        ),
    };
}
