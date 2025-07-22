import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import getQueryString from 'Utilities/Fetch/getQueryString';
import camelize from 'Utilities/Object/camelize';
import snakeify from 'Utilities/Object/snakeify';

import type { CommandName } from 'Helpers/Props/commandNames';
import type { DownloadItem } from 'typings/Queue';
import type { IndexFilter, IndexSort } from 'Volume/Index';
import type {
    MonitoringScheme,
    RawVolume,
    RawVolumePublicInfo,
    SpecialVersion,
    Volume,
    VolumePublicInfo,
} from 'Volume/Volume';

export type GetVolumesParams =
    | {
          filter?: IndexFilter;
          sort?: IndexSort;
      }
    | undefined;

export type ExecuteCommandParams = {
    cmd: CommandName;
    volumeId?: number;
    issueId?: number;
    [key: string]: string | number | undefined;
};

export interface UpdateVolumeParams {
    monitored?: boolean;
    monitorNewIssues?: boolean;
    monitoringScheme?: '' | MonitoringScheme;
    specialVersionLocked?: boolean;
    specialVersion?: '' | SpecialVersion;
    rootFolder?: number;
    volumeFolder?: string;
    libgenUrl?: string;
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

            transformResponse: (response: { result: RawVolumePublicInfo[] }) =>
                response.result.map(camelize),
        }),

        searchVolume: build.query<Volume, { volumeId: number }>({
            query: ({ volumeId }) =>
                `volumes/${volumeId}` +
                getQueryString({
                    api_key: window.Kapowarr.apiKey,
                }),

            transformResponse: (response: { result: RawVolume }) => camelize(response.result),
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
                method: 'POST',
                url:
                    'system/tasks' +
                    getQueryString({
                        ...snakeify(params),
                        api_key: window.Kapowarr.apiKey,
                    }),
            }),
        }),

        // PUT
        toggleIssueMonitored: build.mutation<void, { issueId: number; monitored: boolean }>({
            query: ({ issueId, ...body }) => ({
                method: 'PUT',
                url:
                    `/issues/${issueId}` +
                    getQueryString({
                        api_key: window.Kapowarr.apiKey,
                    }),
                body,
            }),
        }),

        updateVolume: build.mutation<void, UpdateVolumeParams>({
            query: ({ volumeId, ...body }) => ({
                method: 'PUT',
                url:
                    `/volumes/${volumeId}` +
                    getQueryString({
                        api_key: window.Kapowarr.apiKey,
                    }),
                body: snakeify(body),
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
export const useGetVolumesQuery = (params: GetVolumesParams = {}) => {
    return baseApi.useGetVolumesQuery(params);
};

// Abstract some logic
export const useGetVolumeQuery = (volumeId: number) => {
    return baseApi.useGetVolumesQuery(
        {},
        {
            selectFromResult: ({ data, ...rest }) => ({
                volume: data?.find((v) => v.id === volumeId),
                ...rest,
            }),
        },
    );
};

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
