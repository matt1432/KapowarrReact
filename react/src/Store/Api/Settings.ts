// IMPORTS

// Redux
import { baseApi } from './base';

// Misc
import camelize from 'Utilities/Object/camelize';

// Types
import type { SettingsValue, RawSettingsValue } from 'typings/Settings';

// IMPLEMENTATIONS

const extendedApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        // GET
        getSettings: build.query<SettingsValue, void>({
            query: () => ({
                url: 'settings',
                params: {
                    apiKey: window.Kapowarr.apiKey,
                },
            }),

            transformResponse: (response: { result: RawSettingsValue }) =>
                camelize(response.result),
        }),
    }),
});

export const { useGetSettingsQuery, useLazyGetSettingsQuery } = extendedApi;
