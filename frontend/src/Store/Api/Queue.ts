// IMPORTS

// Redux
import { baseApi } from './base';

// Misc
import camelize from 'Utilities/Object/camelize';

// Types
import type {
    BlocklistItem,
    DownloadHistoryItem,
    QueueItem,
    RawBlocklistItem,
    RawDownloadHistoryItem,
    RawQueueItem,
} from 'typings/Queue';

export interface FetchQueueParams {
    volumeId?: number;
    issueId?: number;
}

export interface GetDownloadHistoryParams {
    volumeId?: number;
    issueId?: number;
    offset?: number;
}

export interface GetBlocklistParams {
    offset?: number;
}

export interface DeleteQueueItemParams {
    id: number;
    blocklist?: boolean;
}

// IMPLEMENTATIONS

const extendedApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        // GET
        getQueue: build.query<QueueItem[], void>({
            query: () => ({
                url: 'activity/queue',
                params: {
                    apiKey: window.Kapowarr.apiKey,
                },
            }),

            transformResponse: (response: { result: RawQueueItem[] }) => camelize(response.result),
        }),

        getDownloadHistory: build.mutation<DownloadHistoryItem[], GetDownloadHistoryParams>({
            query: (params) => ({
                method: 'GET',
                url: 'activity/history',
                params: {
                    ...params,
                    apiKey: window.Kapowarr.apiKey,
                },
            }),

            transformResponse: (response: { result: RawDownloadHistoryItem[] }) =>
                camelize(response.result),
        }),

        getBlocklist: build.mutation<BlocklistItem[], GetBlocklistParams>({
            query: ({ offset = 0 }) => ({
                method: 'GET',
                url: 'blocklist',
                params: {
                    apiKey: window.Kapowarr.apiKey,
                    offset,
                },
            }),

            transformResponse: (response: { result: RawBlocklistItem[] }) =>
                camelize(response.result),
        }),

        // PUT
        moveQueueItem: build.mutation<void, { id: number; index: number }>({
            query: ({ id, index }) => ({
                method: 'PUT',
                url: `activity/queue/${id}`,
                params: {
                    apiKey: window.Kapowarr.apiKey,
                    index,
                },
            }),
        }),

        // DELETE
        clearBlocklist: build.mutation<void, void>({
            query: () => ({
                method: 'DELETE',
                url: 'blocklist',
                params: {
                    apiKey: window.Kapowarr.apiKey,
                },
            }),
        }),

        deleteBlocklistItem: build.mutation<void, { id: number }>({
            query: ({ id }) => ({
                method: 'DELETE',
                url: `blocklist/${id}`,
                params: {
                    apiKey: window.Kapowarr.apiKey,
                },
            }),
        }),

        clearQueue: build.mutation<void, void>({
            query: () => ({
                method: 'DELETE',
                url: 'activity/queue',
                params: {
                    apiKey: window.Kapowarr.apiKey,
                },
            }),
        }),

        deleteQueueItem: build.mutation<void, DeleteQueueItemParams>({
            query: ({ id, blocklist = false }) => ({
                method: 'DELETE',
                url: `activity/queue/${id}`,
                params: {
                    apiKey: window.Kapowarr.apiKey,
                },
                body: { blocklist },
            }),
        }),
    }),
});

export const {
    useClearBlocklistMutation,
    useClearQueueMutation,
    useDeleteBlocklistItemMutation,
    useDeleteQueueItemMutation,
    useGetBlocklistMutation,
    useGetDownloadHistoryMutation,
    useGetQueueQuery,
    useLazyGetQueueQuery,
    useMoveQueueItemMutation,
} = extendedApi;

export const useFetchQueueDetails = (
    { volumeId, issueId }: FetchQueueParams = {},
    options?: Parameters<typeof extendedApi.useGetQueueQuery>[1],
    includeRest = false,
) => {
    return extendedApi.useGetQueueQuery(undefined, {
        ...options,
        selectFromResult: ({ data, ...rest }) => {
            let queue = data ?? [];

            if (volumeId) {
                queue = queue.filter((item) => item.volumeId === volumeId);
            }
            if (issueId) {
                queue = queue.filter((item) => item.issueId === issueId);
            }

            if (includeRest) {
                return {
                    queue,
                    ...rest,
                };
            }
            else {
                return { queue };
            }
        },
    });
};
