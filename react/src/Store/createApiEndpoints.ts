import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import getQueryString from 'Utilities/Fetch/getQueryString';
import type { VolumePublicInfo } from 'Volumes/Volumes';

export type GetVolumesParams = { filter?: string; sort?: string } | undefined;

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
    }),
});

export const useGetVolumesQuery = (params?: GetVolumesParams) => baseApi.useGetVolumesQuery(params);
