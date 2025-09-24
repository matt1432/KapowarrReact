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

            transformResponse: (response: { result: RootFolder[] }) =>
                response.result,
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

        // POST
        addRootFolder: build.mutation<void, { folder: string }>({
            query: (body) => ({
                method: 'POST',
                url: 'rootfolder',
                params: {
                    apiKey: window.Kapowarr.apiKey,
                },
                body,
            }),
        }),

        editRootFolder: build.mutation<void, { id: number; folder: string }>({
            query: ({ id, ...body }) => ({
                method: 'POST',
                url: `rootfolder/${id}`,
                params: {
                    apiKey: window.Kapowarr.apiKey,
                },
                body,
            }),
        }),
    }),
});

export const {
    useAddRootFolderMutation,
    useEditRootFolderMutation,
    useDeleteRootFolderMutation,
    useGetRootFoldersQuery,
    useLazyGetRootFoldersQuery,
} = extendedApi;
