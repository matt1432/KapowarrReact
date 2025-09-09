// IMPORTS

// Redux
import { baseApi } from './base';

// Misc
// import snakeify from 'Utilities/Object/snakeify';
import camelize from 'Utilities/Object/camelize';

// Types
import type { DownloadClient, RawDownloadClient } from 'typings/DownloadClient';

// IMPLEMENTATIONS

const extendedApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        // GET
        getDownloadClients: build.query<DownloadClient[], void>({
            query: () => ({
                url: 'externalclients',
                params: {
                    apiKey: window.Kapowarr.apiKey,
                },
            }),

            transformResponse: (response: { result: RawDownloadClient[] }) =>
                camelize(response.result),
        }),

        // DELETE
        deleteDownloadClient: build.mutation<void, { id: number }>({
            query: ({ id }) => ({
                method: 'DELETE',
                url: `externalclients/${id}`,
                params: {
                    apiKey: window.Kapowarr.apiKey,
                },
            }),
        }),
    }),
});

export const { useDeleteDownloadClientMutation, useGetDownloadClientsQuery } = extendedApi;
