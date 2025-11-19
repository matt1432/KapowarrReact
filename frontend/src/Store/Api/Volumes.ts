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
    libgenSeriesId?: string | null;
    marvelId?: number | null;
    volumeId: number;
    calledFrom?: string;
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

        getImportProposals: build.query<
            ProposedImport[],
            GetImportProposalsParams
        >({
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

            transformResponse: (response: { result: RawVolume }) =>
                camelize(response.result),
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
    useLazyGetStatsQuery,
    useLazyGetVolumesQuery,
    useLazyLookupVolumeQuery,
    useLazySearchVolumeQuery,
    usePreviewConvertVolumeQuery,
    usePreviewRenameVolumeQuery,
    useSearchVolumeQuery,
    useUpdateVolumeMutation,
} = extendedApi;
