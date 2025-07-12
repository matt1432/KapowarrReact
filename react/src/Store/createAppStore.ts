import { configureStore } from '@reduxjs/toolkit';
import { createBrowserHistory } from 'history';
import createReducers from 'Store/createReducers';
import { baseApi } from './createApiEndpoints';

import { useDispatch, useSelector } from 'react-redux';

function createAppStore() {
    const initHistory = createBrowserHistory();
    const { createReduxHistory, reducers, routerMiddleware } = createReducers(initHistory);

    const appStore = configureStore({
        reducer: reducers,
        preloadedState: {
            router: initHistory,
        },
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware().concat(routerMiddleware, baseApi.middleware),
    });

    return {
        history: createReduxHistory(appStore),
        store: appStore,
    };
}

export const { history, store } = createAppStore();

export type RootState = ReturnType<typeof store.getState>;
export type RootDispatch = typeof store.dispatch;

export const useRootDispatch = useDispatch.withTypes<RootDispatch>();
export const useRootSelector = useSelector.withTypes<RootState>();
