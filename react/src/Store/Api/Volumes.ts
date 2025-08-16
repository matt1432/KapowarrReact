// IMPORTS

// Redux
import { baseApi } from './base';

// Misc
import getQueryString from 'Utilities/Fetch/getQueryString';
import camelize from 'Utilities/Object/camelize';
import snakeify from 'Utilities/Object/snakeify';

// Types
import type {
    MonitoringScheme,
    RawVolume,
    RawVolumePublicInfo,
    SpecialVersion,
    Volume,
    VolumePublicInfo,
} from 'Volume/Volume';

import type { RawVolumeMetadata, VolumeMetadata } from 'AddVolume/AddVolume';

import type { IndexFilter, IndexSort } from 'Volume/Index';

export type GetVolumesParams =
    | {
          filter?: IndexFilter;
          sort?: IndexSort;
      }
    | undefined;

export interface AddVolumeParams {
    comicvineId: number;
    rootFolderId: number;
    monitor: boolean;
    monitoringScheme?: MonitoringScheme;
    monitorNewIssues?: boolean;
    volumeFolder?: string;
    specialVersion?: '' | SpecialVersion;
    autoSearch?: boolean;
}

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

export interface DeleteVolumeParams {
    volumeId: number;
    deleteFolder: boolean;
}

// IMPLEMENTATIONS

const extendedApi = baseApi.injectEndpoints({
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

        lookupVolume: build.query<VolumeMetadata[], { query: string }>({
            query: ({ query }) =>
                `volumes/search` +
                getQueryString({
                    query,
                    api_key: window.Kapowarr.apiKey,
                }),

            transformResponse: (response: { result: RawVolumeMetadata[] }) =>
                camelize(response.result),
        }),

        // POST
        addVolume: build.mutation<VolumePublicInfo, AddVolumeParams>({
            query: (body) => ({
                method: 'POST',
                url:
                    'volumes' +
                    getQueryString({
                        api_key: window.Kapowarr.apiKey,
                    }),
                body: snakeify(body),
            }),

            transformResponse: (response: { result: RawVolumePublicInfo }) =>
                camelize(response.result),
        }),

        // PUT
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

        // DELETE
        deleteVolume: build.mutation<void, DeleteVolumeParams>({
            query: ({ volumeId, ...body }) => ({
                method: 'DELETE',
                url:
                    `/volumes/${volumeId}` +
                    getQueryString({
                        api_key: window.Kapowarr.apiKey,
                        ...snakeify(body),
                    }),
            }),
        }),
    }),
});

export const {
    useAddVolumeMutation,
    useDeleteVolumeMutation,
    useGetVolumesQuery,
    useLazyGetVolumesQuery,
    useLazyLookupVolumeQuery,
    useSearchVolumeQuery,
    useUpdateVolumeMutation,
} = extendedApi;

export const useGetVolumeQuery = (volumeId: number) => {
    return extendedApi.useGetVolumesQuery(
        {},
        {
            selectFromResult: ({ data, ...rest }) => ({
                volume: data?.find((v) => v.id === volumeId),
                ...rest,
            }),
        },
    );
};

export const useExistingVolumeQuery = (comicvineId: number) => {
    return extendedApi.useGetVolumesQuery(
        {},
        {
            selectFromResult: ({ data, ...rest }) => ({
                isExistingVolume: Boolean(data?.some((v) => v.comicvineId === comicvineId)),
                ...rest,
            }),
        },
    );
};
