// IMPORTS

// Redux
import { baseApi } from './base';

// Misc
import snakeify from 'Utilities/Object/snakeify';
import camelize from 'Utilities/Object/camelize';

// Types
import type {
    Indexer,
    IndexerClientType,
    IndexerOptions,
    RawIndexer,
} from 'typings/Indexer';

import type { Nullable } from 'typings/Misc';
import type { DownloadType } from 'Helpers/Props/downloadTypes';
import type { GCDownloadSource } from 'Helpers/Props/GCDownloadSources';

interface TestParams {
    downloadType: DownloadType;
    clientType: IndexerClientType;
    url: string;
}

interface EditParams {
    id?: number;
    downloadType?: DownloadType;
    clientType?: IndexerClientType;
    enabled: boolean;
    title: string;
    url: string;
    gcServicePreference: Nullable<GCDownloadSource[]>;
    gcAvoidLargeDownloads: Nullable<boolean>;
}

// IMPLEMENTATIONS

const extendedApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        // GET
        getIndexers: build.query<Indexer[], void>({
            query: () => ({
                url: 'indexers',
                params: {
                    apiKey: window.Kapowarr.apiKey,
                },
            }),

            transformResponse: (response: { result: RawIndexer[] }) =>
                camelize(response.result),
        }),

        getIndexerOptions: build.query<IndexerOptions, void>({
            query: () => ({
                url: 'indexers/options',
                params: {
                    apiKey: window.Kapowarr.apiKey,
                },
            }),

            transformResponse: (response: { result: IndexerOptions }) =>
                response.result,
        }),

        // DELETE
        deleteIndexer: build.mutation<void, { id: number }>({
            query: ({ id }) => ({
                method: 'DELETE',
                url: `indexers/${id}`,
                params: {
                    apiKey: window.Kapowarr.apiKey,
                },
            }),
        }),

        // POST
        testIndexer: build.mutation<
            { description: Nullable<string>; success: boolean },
            TestParams
        >({
            query: (body) => ({
                method: 'POST',
                url: 'indexers/test',
                params: {
                    apiKey: window.Kapowarr.apiKey,
                },
                body: snakeify(body),
            }),

            transformResponse: (response: {
                result: { description: Nullable<string>; success: boolean };
            }) => response.result,
        }),

        // PUT / POST
        saveIndexer: build.mutation<void, EditParams>({
            query: ({ id, ...body }) => ({
                method: typeof id === 'number' ? 'PUT' : 'POST',
                url: typeof id === 'number' ? `indexers/${id}` : 'indexers',
                params: {
                    apiKey: window.Kapowarr.apiKey,
                },
                body: snakeify(body),
            }),
        }),
    }),
});

export const {
    useDeleteIndexerMutation,
    useGetIndexersQuery,
    useGetIndexerOptionsQuery,
    useSaveIndexerMutation,
    useTestIndexerMutation,
} = extendedApi;

export const useIsLibgenEnabled = () => {
    const { isLibgenEnabled } = extendedApi.useGetIndexersQuery(undefined, {
        selectFromResult: ({ data }) => ({
            isLibgenEnabled: Boolean(
                data?.some(
                    (indexer) =>
                        indexer.clientType === 'Libgen+' && indexer.enabled,
                ),
            ),
        }),
    });

    return isLibgenEnabled;
};
