import { createReduxHistoryContext } from 'redux-first-history';
import { combineReducers } from '@reduxjs/toolkit';

import { baseApi } from './createApiEndpoints';

import AppSlice from './Slices/App';
import IssueTableSlice from './Slices/IssueTable';
import VolumeIndexSlice from './Slices/VolumeIndex';

import type { History } from 'history';

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

            [AppSlice.reducerPath]: AppSlice.reducer,
            [IssueTableSlice.reducerPath]: IssueTableSlice.reducer,
            [VolumeIndexSlice.reducerPath]: VolumeIndexSlice.reducer,
        }),
    };
}
