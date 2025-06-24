import { configureStore } from '@reduxjs/toolkit';
import { createBrowserHistory } from 'history';
import createReducers, { defaultState } from 'Store/Actions/createReducers';

function createAppStore() {
    const initHistory = createBrowserHistory();
    const { createReduxHistory, reducers, routerMiddleware } = createReducers(initHistory);

    const appStore = configureStore({
        reducer: reducers,
        preloadedState: {
            ...defaultState,
            router: initHistory,
        },
        middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(routerMiddleware),
    });

    return {
        history: createReduxHistory(appStore),
        store: appStore,
    };
}

export default createAppStore;
