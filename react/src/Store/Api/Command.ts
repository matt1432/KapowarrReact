// IMPORTS

// Redux
import { baseApi } from './base';

// Misc
import getQueryString from 'Utilities/Fetch/getQueryString';
import snakeify from 'Utilities/Object/snakeify';

// Types
import type { CamelCasedPropertiesDeep } from 'type-fest';
import type { SerializedError } from '@reduxjs/toolkit';

import type { CommandName } from 'Helpers/Props/commandNames';
import type { MonitoringScheme } from 'Volume/Volume';
import type { MassEditAction } from 'Helpers/Props/massEditActions';

export type ExecuteCommandParams = {
    cmd: CommandName;
    volumeId?: number;
    issueId?: number;
    [key: string]: string | number | undefined;
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

type RawMassEditParams<T extends MassEditAction> = T extends keyof MassEditSpecificParams
    ? {
          action: T;
          volume_ids: number[];
          args: MassEditSpecificParams[T];
      }
    : {
          action: T;
          volume_ids: number[];
      };

export type MassEditParams<T extends MassEditAction = MassEditAction> = CamelCasedPropertiesDeep<
    RawMassEditParams<T>
>;

// IMPLEMENTATIONS

const extendedApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        // POST
        massEdit: build.mutation<void, MassEditParams>({
            query: (body) => ({
                method: 'POST',
                url:
                    'masseditor' +
                    getQueryString({
                        api_key: window.Kapowarr.apiKey,
                    }),
                body: snakeify(body),
            }),
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
    }),
});

export const { useExecuteCommandMutation } = extendedApi;

type UseMutationTrigger = <T extends MassEditAction>(
    arg: MassEditParams<T>,
) => Promise<void | {
    error: SerializedError;
}> & {
    requestId: string;
    abort: () => void;
    unwrap: () => Promise<void>;
    reset: () => void;
};

type UseMutationResult = {
    originalArgs?: MassEditParams;
    error?: unknown;
    endpointName?: string;
    fulfilledTimeStamp?: number;
    isUninitialized: boolean;
    isLoading: boolean;
    isSuccess: boolean;
    isError: boolean;
    startedTimeStamp?: number;
    reset: () => void;
};

export const useMassEditMutation = (): readonly [
    UseMutationTrigger,
    UseMutationResult,
    // @ts-expect-error FIXME: figure out how to type this directly with RTK-Query
] => extendedApi.useMassEditMutation();
