import { createReduxHistoryContext } from 'redux-first-history';
import { combineReducers } from '@reduxjs/toolkit';
import { type History } from 'history';
import { baseApi } from './createApiEndpoints';

export default function (history: History) {
    const { createReduxHistory, routerMiddleware, routerReducer } = createReduxHistoryContext({
        history,
    });

    return {
        createReduxHistory,
        routerMiddleware,
        routerReducer,
        reducers: combineReducers({
            router: routerReducer,
            [baseApi.reducerPath]: baseApi.reducer,
        }),
    };
}
