import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import getQueryString from 'Utilities/Fetch/getQueryString';
import type { Volumes } from 'Volumes/Volumes';

export const baseApi = createApi({
    reducerPath: 'baseApi',
    baseQuery: fetchBaseQuery({ baseUrl: window.Kapowarr.urlBase + window.Kapowarr.apiRoot }),
    endpoints: (build) => ({
        getVolumes: build.query<Volumes[], { filter: string; sort: string }>({
            query: (params) =>
                'volumes' + getQueryString({ ...params, api_key: window.Kapowarr.apiKey }),
        }),
    }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetVolumesQuery } = baseApi;
