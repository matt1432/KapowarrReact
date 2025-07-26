// IMPORTS

// Redux
import { configureStore } from '@reduxjs/toolkit';
import { rememberEnhancer } from 'redux-remember';

// Browser
import { createBrowserHistory } from 'history';

// React
import { useDispatch, useSelector } from 'react-redux';

// Store
import createReducers from 'Store/createReducers';
import { baseApi } from 'Store/createApiEndpoints';

// IMPLEMENTATIONS

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

        enhancers: (getDefaultEnhancers) =>
            getDefaultEnhancers().concat(
                rememberEnhancer(window.localStorage, ['issueTable', 'volumeIndex'], {
                    prefix: 'kapowarr_',
                    persistDebounce: 300,
                }),
            ),
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
