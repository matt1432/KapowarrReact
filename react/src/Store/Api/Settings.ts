// IMPORTS

// Redux
import { baseApi } from './base';

// Misc
import camelize from 'Utilities/Object/camelize';
import snakeify from 'Utilities/Object/snakeify';

// Types
import type { SettingsValue, RawSettingsValue } from 'typings/Settings';
import type { TranslateKey } from 'Utilities/String/translate';

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

        getAvailableFormats: build.query<TranslateKey[], void>({
            query: () => ({
                url: 'settings/availableformats',
                params: {
                    apiKey: window.Kapowarr.apiKey,
                },
            }),

            transformResponse: (response: { result: TranslateKey[] }) => response.result,
        }),

        // PUT
        saveSettings: build.mutation<SettingsValue, Partial<SettingsValue>>({
            query: (body) => ({
                method: 'PUT',
                url: 'settings',
                params: {
                    apiKey: window.Kapowarr.apiKey,
                },
                body: snakeify(body),
            }),

            transformResponse: (response: { result: RawSettingsValue }) =>
                camelize(response.result),
        }),
    }),
});

export const {
    useGetAvailableFormatsQuery,
    useGetSettingsQuery,
    useLazyGetSettingsQuery,
    useSaveSettingsMutation,
} = extendedApi;
