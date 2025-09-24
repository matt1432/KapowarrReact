// IMPORTS

// Redux
import { configureStore } from '@reduxjs/toolkit';
import { rememberEnhancer } from 'redux-remember';

// React
import { useDispatch, useSelector } from 'react-redux';

// Store
import { baseApi } from './Api/base';

import createReducers from './createReducers';

// IMPLEMENTATIONS

export const store = configureStore({
    reducer: createReducers(),

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(baseApi.middleware),

    enhancers: (getDefaultEnhancers) =>
        getDefaultEnhancers().concat(
            rememberEnhancer(
                window.localStorage,
                [
                    'addVolume',
                    'auth',
                    'importVolume',
                    'issueTable',
                    'queueTable',
                    'settings',
                    'uiSettings',
                    'volumeIndex',
                ],
                {
                    prefix: 'kapowarr_',
                    persistDebounce: 300,
                },
            ),
        ),
});

export type RootState = ReturnType<typeof store.getState>;
export type RootDispatch = typeof store.dispatch;

export const useRootDispatch = useDispatch.withTypes<RootDispatch>();
export const useRootSelector = useSelector.withTypes<RootState>();
