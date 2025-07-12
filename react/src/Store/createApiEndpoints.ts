import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { DownloadItem } from 'typings/Queue';
import getQueryString from 'Utilities/Fetch/getQueryString';
import type { IndexFilter, IndexSort } from 'Volumes/Index';
import type { Volume, VolumePublicInfo } from 'Volumes/Volumes';

export type GetVolumesParams =
    | {
          filter?: IndexFilter;
          sort?: IndexSort;
      }
    | undefined;

export const baseApi = createApi({
    reducerPath: 'baseApi',
    baseQuery: fetchBaseQuery({ baseUrl: window.Kapowarr.urlBase + window.Kapowarr.apiRoot }),
    endpoints: (build) => ({
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
    }),
});

export const { useSearchVolumeQuery } = baseApi;

// Add default value to params
export const useGetVolumesQuery = (params: GetVolumesParams = {}) =>
    baseApi.useGetVolumesQuery(params);

export const useFetchQueueDetails = (volumeId?: number) => {
    return baseApi.useFetchQueueDetailsQuery(undefined, {
        selectFromResult: ({ data }) => ({
            queue: data?.filter((item) => item.volume_id === volumeId) ?? [],
        }),
    });
};
