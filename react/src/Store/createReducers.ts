// IMPORTS

// Redux
import { createReduxHistoryContext } from 'redux-first-history';
import { combineReducers } from '@reduxjs/toolkit';
import { rememberReducer } from 'redux-remember';

// Slices
import AppSlice from './Slices/App';
import IssueTableSlice from './Slices/IssueTable';
import VolumeIndexSlice from './Slices/VolumeIndex';

// API
import { baseApi } from './createApiEndpoints';

// Types
import type { History } from 'history';

// IMPLEMENTATIONS

export default function (history: History) {
    const { createReduxHistory, routerMiddleware, routerReducer } = createReduxHistoryContext({
        history,
    });

    return {
        createReduxHistory,
        routerMiddleware,
        routerReducer,
        reducers: rememberReducer(
            combineReducers({
                router: routerReducer,

                [baseApi.reducerPath]: baseApi.reducer,

                [AppSlice.reducerPath]: AppSlice.reducer,
                [IssueTableSlice.reducerPath]: IssueTableSlice.reducer,
                [VolumeIndexSlice.reducerPath]: VolumeIndexSlice.reducer,
            }),
        ),
    };
}
