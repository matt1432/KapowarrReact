// IMPORTS

// Redux
import { baseApi } from './base';

// Misc
import getQueryString from 'Utilities/Fetch/getQueryString';

// Types
import type { RootFolder } from 'typings/RootFolder';

// IMPLEMENTATIONS

const extendedApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        // GET
        getRootFolders: build.query<RootFolder[], undefined>({
            query: () =>
                'rootfolder' +
                getQueryString({
                    api_key: window.Kapowarr.apiKey,
                }),

            transformResponse: (response: { result: RootFolder[] }) => response.result,
        }),

        // DELETE
        deleteRootFolder: build.mutation<void, { id: number }>({
            query: ({ id }) => ({
                method: 'DELETE',
                url:
                    `rootfolder/${id}` +
                    getQueryString({
                        api_key: window.Kapowarr.apiKey,
                    }),
            }),
        }),
    }),
});

export const { useDeleteRootFolderMutation, useGetRootFoldersQuery, useLazyGetRootFoldersQuery } =
    extendedApi;
