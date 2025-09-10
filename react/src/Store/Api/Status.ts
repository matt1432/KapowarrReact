// IMPORTS

// Redux
import { baseApi } from './base';

// Misc
import camelize from 'Utilities/Object/camelize';

// Types
import type { AboutInfo, RawAboutInfo } from 'typings/Status';

// IMPLEMENTATIONS

const extendedApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        // GET
        getAboutInfo: build.query<AboutInfo, void>({
            query: () => ({
                url: 'system/about',
                params: {
                    apiKey: window.Kapowarr.apiKey,
                },
            }),

            transformResponse: (response: { result: RawAboutInfo }) => camelize(response.result),
        }),
    }),
});

export const { useGetAboutInfoQuery, useLazyGetAboutInfoQuery } = extendedApi;
