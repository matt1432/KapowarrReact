// IMPORTS

// Redux
import { baseApi } from './base';

// Types
import type { RootFolder } from 'typings/RootFolder';

// IMPLEMENTATIONS

const extendedApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        // GET
        getRootFolders: build.query<RootFolder[], void>({
            query: () => ({
                url: 'rootfolder',
                params: {
                    apiKey: window.Kapowarr.apiKey,
                },
            }),

            transformResponse: (response: { result: RootFolder[] }) => response.result,
        }),

        // DELETE
        deleteRootFolder: build.mutation<void, { id: number }>({
            query: ({ id }) => ({
                method: 'DELETE',
                url: `rootfolder/${id}`,
                params: {
                    apiKey: window.Kapowarr.apiKey,
                },
            }),
        }),
    }),
});

export const { useDeleteRootFolderMutation, useGetRootFoldersQuery, useLazyGetRootFoldersQuery } =
    extendedApi;
