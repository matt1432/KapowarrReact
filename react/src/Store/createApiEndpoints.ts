import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { DownloadItem } from 'typings/Queue';
import getQueryString from 'Utilities/Fetch/getQueryString';
import type { IndexFilter, IndexSort } from 'Volume/Index';
import type { Volume, VolumePublicInfo } from 'Volume/Volume';

export type GetVolumeParams =
    | {
          filter?: IndexFilter;
          sort?: IndexSort;
      }
    | undefined;

export type ExecuteCommandParams = {
    cmd: string;
    [key: string]: string;
};

export const baseApi = createApi({
    reducerPath: 'baseApi',
    baseQuery: fetchBaseQuery({ baseUrl: window.Kapowarr.urlBase + window.Kapowarr.apiRoot }),
    endpoints: (build) => ({
        // GET
        getVolume: build.query<VolumePublicInfo[], GetVolumeParams>({
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
    }),
});

export const { useExecuteCommandMutation, useSearchVolumeQuery } = baseApi;

// Add default value to params
export const useGetVolumeQuery = (params: GetVolumeParams = {}) =>
    baseApi.useGetVolumeQuery(params);

export const useFetchQueueDetails = (volumeId?: number) => {
    return baseApi.useFetchQueueDetailsQuery(undefined, {
        selectFromResult: ({ data }) => ({
            queue: data?.filter((item) => item.volume_id === volumeId) ?? [],
        }),
    });
};
