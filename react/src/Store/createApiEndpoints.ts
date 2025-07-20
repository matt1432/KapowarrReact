import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { DownloadItem } from 'typings/Queue';
import getQueryString from 'Utilities/Fetch/getQueryString';
import type { IndexFilter, IndexSort } from 'Volume/Index';
import type { Volume, VolumePublicInfo } from 'Volume/Volume';

export type GetVolumesParams =
    | {
          filter?: IndexFilter;
          sort?: IndexSort;
      }
    | undefined;

export type ExecuteCommandParams = {
    cmd: string;
    [key: string]: string;
};

export interface UpdateVolumeParams {
    monitored?: boolean;
    monitor_new_issues?: boolean;
    monitoring_scheme?: '' | 'all' | 'missing' | 'none';
    special_version_locked?: boolean;
    special_version?: '' | 'auto' | 'tpb' | 'one-shot' | 'hard-cover' | 'volume-as-issue';
    root_folder?: number;
    volume_folder?: string;
    libgen_url?: string;
    volumeId: number;
}

export const baseApi = createApi({
    reducerPath: 'baseApi',
    baseQuery: fetchBaseQuery({ baseUrl: window.Kapowarr.urlBase + window.Kapowarr.apiRoot }),
    endpoints: (build) => ({
        // GET
        getVolumes: build.query<VolumePublicInfo[], GetVolumesParams>({
            query: ({ filter, sort } = {}) =>
                'volumes' +
                getQueryString({
                    filter: filter ?? '',
                    sort: sort ?? 'title',
                    api_key: window.Kapowarr.apiKey,
                }),

            transformResponse: (response: { result: VolumePublicInfo[] }) => response.result,
        }),

        searchVolume: build.query<Volume, { volumeId: number }>({
            query: ({ volumeId }) =>
                `volumes/${volumeId}` +
                getQueryString({
                    api_key: window.Kapowarr.apiKey,
                }),

            transformResponse: (response: { result: Volume }) => response.result,
        }),

        fetchQueueDetails: build.query<DownloadItem[], undefined>({
            query: () =>
                'activity/queue' +
                getQueryString({
                    api_key: window.Kapowarr.apiKey,
                }),

            transformResponse: (response: { result: DownloadItem[] }) => response.result,
        }),

        // POST
        executeCommand: build.mutation<void, ExecuteCommandParams>({
            query: (params) => ({
                url:
                    'system/tasks' +
                    getQueryString({
                        ...params,
                        api_key: window.Kapowarr.apiKey,
                    }),
                method: 'POST',
            }),
        }),

        // PUT
        toggleIssueMonitored: build.mutation<void, { issueId: number; monitored: boolean }>({
            query: ({ issueId, monitored }) => ({
                url:
                    `/volumes/${issueId}` +
                    getQueryString({
                        monitored,
                        api_key: window.Kapowarr.apiKey,
                    }),
                method: 'PUT',
            }),
        }),

        updateVolume: build.mutation<void, UpdateVolumeParams>({
            query: ({ volumeId, ...rest }) => ({
                url:
                    `/volumes/${volumeId}` +
                    getQueryString({
                        ...rest,
                        api_key: window.Kapowarr.apiKey,
                    }),
                method: 'PUT',
            }),
        }),
    }),
});

export const {
    useExecuteCommandMutation,
    useSearchVolumeQuery,
    useToggleIssueMonitoredMutation,
    useUpdateVolumeMutation,
} = baseApi;

// Add default value to params
export const useGetVolumesQuery = (params: GetVolumesParams = {}) =>
    baseApi.useGetVolumesQuery(params);

// Abstract some logic
export const useFetchQueueDetails = ({
    volumeId,
    issueId,
}: {
    volumeId?: number;
    issueId?: number;
} = {}) => {
    return baseApi.useFetchQueueDetailsQuery(undefined, {
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
