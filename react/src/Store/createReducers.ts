import { createReduxHistoryContext } from 'redux-first-history';
import { combineReducers } from '@reduxjs/toolkit';

import { baseApi } from './createApiEndpoints';

import AppSlice from './Slices/App';

import { type History } from 'history';

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

            ...Object.fromEntries([AppSlice].map((slice) => [slice.reducerPath, slice.reducer])),
        }),
    };
}
