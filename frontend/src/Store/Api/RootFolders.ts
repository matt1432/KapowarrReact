// IMPORTS

// Redux
import { baseApi } from './base';

// Misc
import camelize from 'Utilities/Object/camelize';
import snakeify from 'Utilities/Object/snakeify';

// Types
import type {
    RawRemoteMapping,
    RemoteMapping,
    RootFolder,
} from 'typings/RootFolder';

export type AddRemoteMappingParams = Omit<RemoteMapping, 'id'>;

// IMPLEMENTATIONS

const extendedApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        // GET
        getRemoteMappings: build.query<RemoteMapping[], void>({
            query: () => ({
                url: 'remotemapping',
                params: {
                    apiKey: window.Kapowarr.apiKey,
                },
            }),

            transformResponse: (response: { result: RawRemoteMapping[] }) =>
                camelize(response.result),
        }),

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
        deleteRemoteMapping: build.mutation<void, { id: number }>({
            query: ({ id }) => ({
                method: 'DELETE',
                url: `remotemapping/${id}`,
                params: {
                    apiKey: window.Kapowarr.apiKey,
                },
            }),
        }),

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
        addRemoteMapping: build.mutation<void, AddRemoteMappingParams>({
            query: (body) => ({
                method: 'POST',
                url: 'remotemapping',
                params: {
                    apiKey: window.Kapowarr.apiKey,
                },
                body: snakeify(body),
            }),
        }),

        editRemoteMapping: build.mutation<void, RemoteMapping>({
            query: ({ id, ...body }) => ({
                method: 'POST',
                url: `remotemapping/${id}`,
                params: {
                    apiKey: window.Kapowarr.apiKey,
                },
                body: snakeify(body),
            }),
        }),

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
    useAddRemoteMappingMutation,
    useAddRootFolderMutation,
    useEditRemoteMappingMutation,
    useEditRootFolderMutation,
    useDeleteRemoteMappingMutation,
    useDeleteRootFolderMutation,
    useGetRemoteMappingsQuery,
    useGetRootFoldersQuery,
    useLazyGetRemoteMappingsQuery,
    useLazyGetRootFoldersQuery,
} = extendedApi;
