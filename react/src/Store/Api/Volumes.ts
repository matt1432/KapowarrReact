// IMPORTS

// Redux
import { baseApi } from './base';

// Misc
import camelize from 'Utilities/Object/camelize';
import snakeify from 'Utilities/Object/snakeify';

// Types
import type {
    MonitoringScheme,
    RawVolume,
    RawVolumePublicInfo,
    Volume,
    VolumePublicInfo,
} from 'Volume/Volume';

import type { RawVolumeMetadata, VolumeMetadata } from 'AddVolume/AddVolume';

import type { IndexFilter, IndexSort } from 'Volume/Index';

import type { SpecialVersion } from 'Helpers/Props/specialVersions';

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
        getVolumes: build.query<VolumePublicInfo[], GetVolumesParams | void>({
            query: ({ filter, sort } = {}) => ({
                url: 'volumes',
                params: {
                    filter: filter ?? '',
                    sort: sort ?? 'title',
                    apiKey: window.Kapowarr.apiKey,
                },
            }),

            transformResponse: (response: { result: RawVolumePublicInfo[] }) =>
                response.result.map(camelize),
        }),

        searchVolume: build.query<Volume, { volumeId: number }>({
            query: ({ volumeId }) => ({
                url: `volumes/${volumeId}`,
                params: {
                    apiKey: window.Kapowarr.apiKey,
                },
            }),

            transformResponse: (response: { result: RawVolume }) => camelize(response.result),
        }),

        lookupVolume: build.query<VolumeMetadata[], { query: string }>({
            query: ({ query }) => ({
                url: `volumes/search`,
                params: {
                    query,
                    apiKey: window.Kapowarr.apiKey,
                },
            }),

            transformResponse: (response: { result: RawVolumeMetadata[] }) =>
                camelize(response.result),
        }),

        previewRenameVolume: build.query<
            { id: number; existingPath: string; newPath: string }[],
            { volumeId: number }
        >({
            query: ({ volumeId }) => ({
                url: `volumes/${volumeId}/rename`,
                params: {
                    apiKey: window.Kapowarr.apiKey,
                },
            }),

            transformResponse: (response: {
                result: { id: number; existingPath: string; newPath: string }[];
            }) => response.result,
        }),

        previewConvertVolume: build.query<
            { id: number; existingPath: string; newPath: string }[],
            { volumeId: number }
        >({
            query: ({ volumeId }) => ({
                url: `volumes/${volumeId}/convert`,
                params: {
                    apiKey: window.Kapowarr.apiKey,
                },
            }),

            transformResponse: (response: {
                result: { id: number; existingPath: string; newPath: string }[];
            }) => response.result,
        }),

        // POST
        addVolume: build.mutation<VolumePublicInfo, AddVolumeParams>({
            query: (body) => ({
                method: 'POST',
                url: 'volumes',
                params: {
                    apiKey: window.Kapowarr.apiKey,
                },
                body: snakeify(body),
            }),

            transformResponse: (response: { result: RawVolumePublicInfo }) =>
                camelize(response.result),
        }),

        // PUT
        updateVolume: build.mutation<void, UpdateVolumeParams>({
            query: ({ volumeId, ...body }) => ({
                method: 'PUT',
                url: `volumes/${volumeId}`,
                params: {
                    apiKey: window.Kapowarr.apiKey,
                },
                body: snakeify(body),
            }),
        }),

        // DELETE
        deleteVolume: build.mutation<void, DeleteVolumeParams>({
            query: ({ volumeId, ...body }) => ({
                method: 'DELETE',
                url: `volumes/${volumeId}`,
                params: {
                    apiKey: window.Kapowarr.apiKey,
                    ...body,
                },
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
    usePreviewConvertVolumeQuery,
    usePreviewRenameVolumeQuery,
    useSearchVolumeQuery,
    useUpdateVolumeMutation,
} = extendedApi;

export const useGetVolumeQuery = (
    volumeId: number,
    options?: Parameters<typeof extendedApi.useGetVolumesQuery>[1],
) => {
    return extendedApi.useGetVolumesQuery(
        {},
        {
            ...options,
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
