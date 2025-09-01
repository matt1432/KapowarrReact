// IMPORTS

// Redux
import { baseApi } from './base';

// Types
import type { DownloadItem } from 'typings/Queue';

export interface FetchQueueParams {
    volumeId?: number;
    issueId?: number;
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

            transformResponse: (response: { result: DownloadItem[] }) => response.result,
        }),
    }),
});

export const useFetchQueueDetails = ({ volumeId, issueId }: FetchQueueParams = {}) => {
    return extendedApi.useFetchQueueDetailsQuery(undefined, {
        selectFromResult: ({ data, ...rest }) => {
            let queue = data ?? [];

            if (volumeId) {
                queue = queue.filter((item) => item.volume_id === volumeId);
            }
            if (issueId) {
                queue = queue.filter((item) => item.issue_id === issueId);
            }

            return {
                queue,
                ...rest,
            };
        },
    });
};
