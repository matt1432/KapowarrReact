// IMPORTS

// Redux
import { baseApi } from './base';

// Misc
import camelize from 'Utilities/Object/camelize';

// Types
import type {
    DownloadHistoryItem,
    DownloadItem,
    RawDownloadHistoryItem,
    RawDownloadItem,
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

// IMPLEMENTATIONS

const extendedApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        // GET
        fetchQueueDetails: build.query<DownloadItem[], void>({
            query: () => ({
                url: 'activity/queue',
                params: {
                    apiKey: window.Kapowarr.apiKey,
                },
            }),

            transformResponse: (response: { result: RawDownloadItem[] }) =>
                camelize(response.result),
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
    }),
});

export const { useGetDownloadHistoryMutation } = extendedApi;

export const useFetchQueueDetails = (
    { volumeId, issueId }: FetchQueueParams = {},
    options?: Parameters<typeof extendedApi.useFetchQueueDetailsQuery>[1],
) => {
    return extendedApi.useFetchQueueDetailsQuery(undefined, {
        ...options,
        selectFromResult: ({ data, ...rest }) => {
            let queue = data ?? [];

            if (volumeId) {
                queue = queue.filter((item) => item.volumeId === volumeId);
            }
            if (issueId) {
                queue = queue.filter((item) => item.issueId === issueId);
            }

            return {
                queue,
                ...rest,
            };
        },
    });
};
