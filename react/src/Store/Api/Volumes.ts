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

/*
        // GET
        getVolumes: build.mutation<VolumePublicInfo[], GetVolumesParams>({
            query: ({ filter, sort }) => ({
                method: 'GET',
                url:
                    'volumes' +
                    getQueryString({
                        filter: filter ?? '',
                        sort: sort ?? 'title',
                        api_key: window.Kapowarr.apiKey,
                    }),
            }),

            transformResponse: (response: { result: RawVolumePublicInfo[] }) =>
                response.result.map(camelize),
        }),

type GetVolumes = typeof extendedApi.endpoints.getVolumes.Types;
type GetVolumesSelectorResult = MutationResultSelectorResult<GetVolumes['MutationDefinition']>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecord = Record<string, any>;

type GetVolumesOptions<R extends AnyRecord> = {
    fixedCacheKey?: string;
    selectFromResult?: (state: GetVolumesSelectorResult) => R;
};

export const useLazyGetVolumesQuery = <R extends AnyRecord = GetVolumesSelectorResult>(
    params: GetVolumesParams = {},
    options: GetVolumesOptions<R> = {},
) => {
    const [trigger, state] = extendedApi.useGetVolumesMutation(options);

    const refetch = useMemo(() => () => trigger(params), [trigger, params]);

    return [
        refetch,
        state as TypedUseMutationResult<
            GetVolumes['ResultType'],
            GetVolumes['QueryArg'],
            GetVolumes['BaseQuery'],
            R
        >,
    ] as const;
};

export const useLazyGetAllVolumes = () => {
    return useLazyGetVolumesQuery(
        {},
        {
            fixedCacheKey: 'allVolumes',
        },
    );
};

export const useGetVolumesQuery = <R extends AnyRecord = GetVolumesSelectorResult>(
    params: GetVolumesParams = {},
    options: GetVolumesOptions<R> = {},
) => {
    const [refetch, state] = useLazyGetVolumesQuery(params, options);

    useEffect(() => {
        console.log('hi');
        refetch();
        // Run this once
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return {
        ...state,
        refetch,
    };
};

export const useGetAllVolumes = () => {
    return useGetVolumesQuery(
        {},
        {
            fixedCacheKey: 'allVolumes',
        },
    );
};

export const useGetVolumeQuery = (volumeId: number) => {
    return useGetVolumesQuery(
        {},
        {
            fixedCacheKey: `volume${volumeId}`,
            selectFromResult: ({ data, ...rest }) => ({
                volume: data?.find((v) => v.id === volumeId),
                ...rest,
            }),
        },
    );
};

export const useExistingVolumeQuery = (comicvineId: number) => {
    return useGetVolumesQuery(
        {},
        {
            fixedCacheKey: `exists${comicvineId}`,
            selectFromResult: ({ data, ...rest }) => ({
                isExistingVolume: Boolean(data?.some((v) => v.comicvineId === comicvineId)),
                ...rest,
            }),
        },
    );
};
*/
