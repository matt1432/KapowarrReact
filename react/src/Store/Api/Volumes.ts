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
    RawVolumeStatistics,
    Volume,
    VolumePublicInfo,
    VolumeStatistics,
} from 'Volume/Volume';

import type { RawVolumeMetadata, VolumeMetadata } from 'AddVolume/AddVolume';
import type { SpecialVersion } from 'Helpers/Props/specialVersions';
import type { ProposedImport, RawProposedImport } from 'typings/Search';

export interface AddVolumeParams {
    comicvineId: number;
    rootFolderId: number;
    monitor: boolean;
    monitoringScheme?: MonitoringScheme;
    monitorNewIssues?: boolean;
    volumeFolder?: string;
    specialVersion?: null | SpecialVersion;
    autoSearch?: boolean;
}

export interface UpdateVolumeParams {
    monitored?: boolean;
    monitorNewIssues?: boolean;
    monitoringScheme?: '' | MonitoringScheme;
    specialVersionLocked?: boolean;
    specialVersion?: null | SpecialVersion;
    rootFolder?: number;
    volumeFolder?: string;
    libgenSeriesId?: number | null;
    volumeId: number;
}

export interface DeleteVolumeParams {
    volumeId: number;
    deleteFolder: boolean;
}

export interface GetImportProposalsParams {
    includedFolders?: string[];
    excludedFolders?: string[];
    limit: number;
    limitParentFolder: boolean;
    onlyEnglish: boolean;
}

export interface ImportLibraryParams {
    renameFiles: boolean;
    body: { filepath: string; id: number }[];
}

// IMPLEMENTATIONS

const extendedApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        // GET
        getVolumes: build.query<VolumePublicInfo[], void>({
            query: () => ({
                url: 'volumes',
                params: {
                    filter: '',
                    sort: 'title',
                    apiKey: window.Kapowarr.apiKey,
                },
            }),

            transformResponse: (response: { result: RawVolumePublicInfo[] }) =>
                response.result.map(camelize),
        }),

        getStats: build.query<VolumeStatistics, void>({
            query: () => ({
                url: 'volumes/stats',
                params: {
                    apiKey: window.Kapowarr.apiKey,
                },
            }),

            transformResponse: (response: { result: RawVolumeStatistics }) =>
                camelize(response.result),
        }),

        getImportProposals: build.query<ProposedImport[], GetImportProposalsParams>({
            query: (params) => ({
                url: 'libraryimport',
                params: {
                    ...params,
                    apiKey: window.Kapowarr.apiKey,
                },
            }),

            transformResponse: (response: { result: RawProposedImport[] }) =>
                camelize(response.result),
        }),

        importLibrary: build.mutation<void, ImportLibraryParams>({
            query: ({ renameFiles, body }) => ({
                method: 'POST',
                url: 'libraryimport',
                params: {
                    renameFiles,
                    apiKey: window.Kapowarr.apiKey,
                },
                body,
            }),
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
    useGetStatsQuery,
    useGetVolumesQuery,
    useImportLibraryMutation,
    useLazyGetImportProposalsQuery,
    useLazyGetVolumesQuery,
    useLazyLookupVolumeQuery,
    usePreviewConvertVolumeQuery,
    usePreviewRenameVolumeQuery,
    useSearchVolumeQuery,
    useUpdateVolumeMutation,
} = extendedApi;

/* TODO: refetch volume data on socket updates

import { useCallback } from 'react';
import useSocketEvents from 'Helpers/Hooks/useSocketEvents';
import type { SubscriptionOptions } from '@reduxjs/toolkit/query';
import type { ExtendableRecord } from 'typings/Misc';
import type { TypedUseQueryStateOptions } from '@reduxjs/toolkit/query/react';

type SearchVolume = typeof extendedApi.endpoints.searchVolume.Types;

type SearchVolumeOptions<R extends ExtendableRecord> = SubscriptionOptions & {
    skip?: boolean | undefined;
    refetchOnMountOrArgChange?: number | boolean | undefined;
} & TypedUseQueryStateOptions<Volume, SearchVolume['QueryArg'], SearchVolume['BaseQuery'], R>;

export const useSearchVolumeUpdate = <R extends ExtendableRecord>(
    { volumeId, onUpdate }: { volumeId: number; onUpdate?: (volume: VolumePublicInfo) => void },
    options?: SearchVolumeOptions<R>,
) => {
    const { refetch: refetch, ...rest } = extendedApi.useSearchVolumeQuery({ volumeId }, options);

    const handleVolumeUpdated = useCallback(
        (volume: VolumePublicInfo) => {
            refetch().finally(() => {
                onUpdate?.(volume);
            });
        },
        [refetch, onUpdate],
    );

    useSocketEvents({
        volumeUpdated: handleVolumeUpdated,
    });

    return { refetch, ...rest };
};
*/
