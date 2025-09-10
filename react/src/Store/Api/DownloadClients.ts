// IMPORTS

// Redux
import { baseApi } from './base';

// Misc
import snakeify from 'Utilities/Object/snakeify';
import camelize from 'Utilities/Object/camelize';

// Types
import type {
    CredentialData,
    DownloadClient,
    DownloadClientOptions,
    RawCredentialData,
    RawDownloadClient,
} from 'typings/DownloadClient';

import type { Nullable } from 'typings/Misc';

interface TestParams {
    clientType: string;
    baseUrl: string;
    username: Nullable<string>;
    password: Nullable<string>;
    apiToken: Nullable<string>;
}

interface EditParams {
    id?: number;
    clientType?: string;
    title: string;
    baseUrl: string;
    username: Nullable<string>;
    password: Nullable<string>;
    apiToken: Nullable<string>;
}

export type AddCredentialParams = Omit<CredentialData, 'id'>;

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

        getDownloadClientOptions: build.query<DownloadClientOptions, void>({
            query: () => ({
                url: 'externalclients/options',
                params: {
                    apiKey: window.Kapowarr.apiKey,
                },
            }),

            transformResponse: (response: { result: DownloadClientOptions }) => response.result,
        }),

        getCredentials: build.query<CredentialData[], void>({
            query: () => ({
                url: 'credentials',
                params: {
                    apiKey: window.Kapowarr.apiKey,
                },
            }),

            transformResponse: (response: { result: RawCredentialData[] }) =>
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

        deleteCredential: build.mutation<void, { id: number }>({
            query: ({ id }) => ({
                method: 'DELETE',
                url: `credentials/${id}`,
                params: {
                    apiKey: window.Kapowarr.apiKey,
                },
            }),
        }),

        // POST
        testDownloadClient: build.mutation<void, TestParams>({
            query: (body) => ({
                method: 'POST',
                url: `externalclients/test`,
                params: {
                    apiKey: window.Kapowarr.apiKey,
                },
                body: snakeify(body),
            }),
        }),

        addCredential: build.mutation<void, AddCredentialParams>({
            query: (body) => ({
                method: 'POST',
                url: `credentials`,
                params: {
                    apiKey: window.Kapowarr.apiKey,
                },
                body: snakeify(body),
            }),
        }),

        // PUT / POST
        saveDownloadClient: build.mutation<void, EditParams>({
            query: ({ id, ...body }) => ({
                method: typeof id === 'number' ? 'PUT' : 'POST',
                url: typeof id === 'number' ? `externalclients/${id}` : 'externalclients',
                params: {
                    apiKey: window.Kapowarr.apiKey,
                },
                body: snakeify(body),
            }),
        }),
    }),
});

export const {
    useAddCredentialMutation,
    useDeleteCredentialMutation,
    useDeleteDownloadClientMutation,
    useSaveDownloadClientMutation,
    useGetCredentialsQuery,
    useGetDownloadClientsQuery,
    useLazyGetDownloadClientsQuery,
    useGetDownloadClientOptionsQuery,
    useTestDownloadClientMutation,
} = extendedApi;

export const useGetDownloadClientQuery = (
    { id }: { id?: number },
    options?: Parameters<typeof extendedApi.useGetDownloadClientsQuery>[1],
) => {
    return extendedApi.useGetDownloadClientsQuery(undefined, {
        ...options,
        selectFromResult: ({ data, ...rest }) => ({
            data: data?.find((c) => c.id === id),
            ...rest,
        }),
    });
};
