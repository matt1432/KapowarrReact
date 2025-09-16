// IMPORTS

// Redux
import { baseApi } from './base';

// Misc
import camelize from 'Utilities/Object/camelize';
import snakeify from 'Utilities/Object/snakeify';

// Types
import type { SettingsValue, RawSettingsValue } from 'typings/Settings';
import type { TranslateKey } from 'Utilities/String/translate';

type SaveSettingsParams = Partial<Omit<SettingsValue, 'apiKey'>> & { apiKey?: never };

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

        // POST
        resetApiKey: build.mutation<string, void>({
            query: () => ({
                method: 'POST',
                url: 'settings/api_key',
                params: {
                    apiKey: window.Kapowarr.apiKey,
                },
            }),

            transformResponse: (response: { result: { api_key: string } }) =>
                response.result.api_key,
        }),

        // PUT
        saveSettings: build.mutation<SettingsValue, SaveSettingsParams>({
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

        // DELETE
        emptyDownloadFolder: build.mutation<void, void>({
            query: () => ({
                method: 'DELETE',
                url: 'activity/folder',
                params: {
                    apiKey: window.Kapowarr.apiKey,
                },
            }),
        }),
    }),
});

export const {
    useEmptyDownloadFolderMutation,
    useGetAvailableFormatsQuery,
    useGetSettingsQuery,
    useLazyGetSettingsQuery,
    useResetApiKeyMutation,
    useSaveSettingsMutation,
} = extendedApi;
