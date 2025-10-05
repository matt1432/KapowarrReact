// IMPORTS

// Redux
import { baseApi } from './base';

// Misc
import snakeify from 'Utilities/Object/snakeify';
import camelize from 'Utilities/Object/camelize';

// Types
import type { CamelCasedPropertiesDeep, RequireExactlyOne } from 'type-fest';

import type { CommandName } from 'Helpers/Props/commandNames';
import type { MonitoringScheme } from 'Volume/Volume';
import type { MassEditAction } from 'Helpers/Props/massEditActions';
import type { RawSearchResult, SearchResult } from 'typings/Search';

export type ExecuteCommandParams = {
    cmd: CommandName;
    calledFrom?: string;
    volumeId?: number;
    issueId?: number;
    [key: string]: string | string[] | number | undefined;
};

type MassEditSpecificParams = {
    delete: {
        delete_folder: boolean;
    };
    root_folder: {
        root_folder_id: number;
    };
    monitoring_scheme: {
        monitoring_scheme: MonitoringScheme;
    };
};

export type MassEditActionWithArgs = keyof MassEditSpecificParams;

type RawMassEditParams<T extends MassEditAction> =
    T extends MassEditActionWithArgs
        ? {
              action: T;
              volume_ids: number[];
              args: MassEditSpecificParams[T];
          }
        : {
              action: T;
              volume_ids: number[];
          };

export type MassEditParams<T extends MassEditAction = MassEditAction> =
    CamelCasedPropertiesDeep<RawMassEditParams<T>>;

export type ManualSearchParams = RequireExactlyOne<{
    volumeId: number;
    issueId?: number;
}>;

export type AddDownloadParams = ManualSearchParams & {
    result: SearchResult;
    forceMatch?: boolean;
};

// IMPLEMENTATIONS

const extendedApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        // GET
        manualSearch: build.query<SearchResult[], ManualSearchParams>({
            query: ({ issueId, volumeId }) => ({
                url:
                    issueId !== undefined
                        ? `issues/${issueId}/manualsearch`
                        : `volumes/${volumeId}/manualsearch`,
                params: {
                    apiKey: window.Kapowarr.apiKey,
                },
            }),

            transformResponse: (response: { result: RawSearchResult[] }) =>
                camelize(response.result),
        }),

        // POST
        libgenFileSearch: build.mutation<
            SearchResult[],
            ManualSearchParams & { url: string }
        >({
            query: ({ issueId, volumeId, url }) => ({
                method: 'POST',
                url:
                    issueId !== undefined
                        ? `issues/${issueId}/manualsearch`
                        : `volumes/${volumeId}/manualsearch`,
                params: {
                    apiKey: window.Kapowarr.apiKey,
                    url,
                },
            }),

            transformResponse: (response: { result: RawSearchResult[] }) =>
                camelize(response.result),
        }),

        addDownload: build.mutation<void, AddDownloadParams>({
            query: ({ issueId, volumeId, result, forceMatch = false }) => ({
                method: 'POST',
                url:
                    issueId !== undefined
                        ? `issues/${issueId}/download`
                        : `volumes/${volumeId}/download`,
                params: {
                    apiKey: window.Kapowarr.apiKey,
                    ...result,
                    forceMatch,
                },
            }),
        }),

        massEdit: build.mutation<void, MassEditParams>({
            query: (body) => ({
                method: 'POST',
                url: 'masseditor',
                params: {
                    apiKey: window.Kapowarr.apiKey,
                },
                body: snakeify(body),
            }),
        }),

        executeCommand: build.mutation<void, ExecuteCommandParams>({
            query: (body) => ({
                method: 'POST',
                url: 'system/tasks',
                params: {
                    apiKey: window.Kapowarr.apiKey,
                },
                body: snakeify(body),
            }),
        }),

        restart: build.mutation<void, void>({
            query: () => ({
                method: 'POST',
                url: '/system/power/restart',
                params: {
                    apiKey: window.Kapowarr.apiKey,
                },
            }),
        }),

        shutdown: build.mutation<void, void>({
            query: () => ({
                method: 'POST',
                url: '/system/power/shutdown',
                params: {
                    apiKey: window.Kapowarr.apiKey,
                },
            }),
        }),
    }),
});

export const {
    useAddDownloadMutation,
    useExecuteCommandMutation,
    useLazyManualSearchQuery,
    useLibgenFileSearchMutation,
    useManualSearchQuery,
    useRestartMutation,
    useShutdownMutation,
} = extendedApi;

export const useMassEditMutation = () => {
    const [trigger, state] = extendedApi.useMassEditMutation();

    return [
        trigger as <T extends MassEditAction>(
            arg: MassEditParams<T>,
        ) => ReturnType<typeof trigger>,
        state,
    ] as const;
};
