// IMPORTS

// React
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { useEffect } from 'react';

// Redux
import { useRootDispatch, useRootSelector } from './createAppStore';
import { setApiKey, setLastLogin } from './Slices/Auth';

// Misc
import getQueryString from 'Utilities/Fetch/getQueryString';
import camelize from 'Utilities/Object/camelize';
import snakeify from 'Utilities/Object/snakeify';

// Types
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
import type { RawVolumeMetadata, VolumeMetadata } from 'AddVolume/AddVolume';
import type { RootFolder } from 'typings/RootFolder';

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

export interface DeleteVolumeParams {
    volumeId: number;
    deleteFolder: boolean;
}

// IMPLEMENTATIONS

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

        fetchQueueDetails: build.query<DownloadItem[], undefined>({
            query: () =>
                'activity/queue' +
                getQueryString({
                    api_key: window.Kapowarr.apiKey,
                }),

            transformResponse: (response: { result: DownloadItem[] }) => response.result,
        }),

        getRootFolders: build.query<RootFolder[], undefined>({
            query: () =>
                'rootfolder' +
                getQueryString({
                    api_key: window.Kapowarr.apiKey,
                }),

            transformResponse: (response: { result: RootFolder[] }) => response.result,
        }),

        // POST
        getApiKey: build.mutation<string, { password?: string }>({
            query: (body) => ({
                method: 'POST',
                url: 'auth',
                body: snakeify(body),
            }),

            transformResponse: (response: { result: { api_key: string } }) =>
                response.result.api_key,
        }),

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

        executeCommand: build.mutation<void, ExecuteCommandParams>({
            query: (body) => ({
                method: 'POST',
                url:
                    'system/tasks' +
                    getQueryString({
                        api_key: window.Kapowarr.apiKey,
                    }),
                body: snakeify(body),
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
                body: snakeify(body),
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
    useExecuteCommandMutation,
    useGetRootFoldersQuery,
    useGetVolumesQuery,
    useLazyGetVolumesQuery,
    useLazyLookupVolumeQuery,
    useSearchVolumeQuery,
    useToggleIssueMonitoredMutation,
    useUpdateVolumeMutation,
} = baseApi;

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

export const useExistingVolumeQuery = (comicvineId: number) => {
    return baseApi.useGetVolumesQuery(
        {},
        {
            selectFromResult: ({ data, ...rest }) => ({
                isExistingVolume: Boolean(data?.some((v) => v.comicvineId === comicvineId)),
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

export const useApiKey = () => {
    const dispatch = useRootDispatch();

    const { apiKey, lastLogin } = useRootSelector((state) => state.auth);

    const [getApiKey, { data, ...getApiKeyState }] = baseApi.useGetApiKeyMutation();

    useEffect(() => {
        if (!apiKey || lastLogin < Date.now() / 1000 - 86400) {
            getApiKey({});
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (data) {
            dispatch(setApiKey(data));
            dispatch(setLastLogin(Date.now() / 1000));
        }
    }, [data, dispatch, lastLogin]);

    return {
        getApiKey,
        ...getApiKeyState,
    };
};
