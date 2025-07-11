import { configureStore } from '@reduxjs/toolkit';
import { createBrowserHistory } from 'history';
import createReducers from 'Store/createReducers';
import { baseApi } from './createApiEndpoints';

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

export default createAppStore;
