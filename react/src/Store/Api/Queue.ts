// IMPORTS

// Redux
import { baseApi } from './base';

// Misc
import getQueryString from 'Utilities/Fetch/getQueryString';

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
        fetchQueueDetails: build.query<DownloadItem[], undefined>({
            query: () =>
                'activity/queue' +
                getQueryString({
                    api_key: window.Kapowarr.apiKey,
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
