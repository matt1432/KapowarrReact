// IMPORTS

// Redux
import { baseApi } from './base';

// Misc
import camelize from 'Utilities/Object/camelize';
import snakeify from 'Utilities/Object/snakeify';

// Types
import type { CommandName } from 'Helpers/Props/commandNames';
import type {
    AboutInfo,
    DatabaseBackup,
    RawAboutInfo,
    RawDatabaseBackup,
    RawStatusCheck,
    StatusCheck,
    StatusCheckType,
} from 'typings/Status';
import type {
    RawTaskHistory,
    RawTaskPlanning,
    TaskHistory,
    TaskPlanning,
} from 'typings/Task';

// IMPLEMENTATIONS

const extendedApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        // GET
        getAboutInfo: build.query<AboutInfo, void>({
            query: () => ({
                url: 'system/about',
                params: {
                    apiKey: window.Kapowarr.apiKey,
                },
            }),

            transformResponse: (response: { result: RawAboutInfo }) =>
                camelize(response.result),
        }),

        getStatusChecks: build.query<StatusCheck[], void>({
            query: () => ({
                url: 'system/status',
                params: {
                    apiKey: window.Kapowarr.apiKey,
                },
            }),

            transformResponse: (response: { result: RawStatusCheck[] }) =>
                camelize(response.result),
        }),

        getBackups: build.query<DatabaseBackup[], void>({
            query: () => ({
                url: 'system/database/backups',
                params: {
                    apiKey: window.Kapowarr.apiKey,
                },
            }),

            transformResponse: (response: { result: RawDatabaseBackup[] }) =>
                camelize(response.result),
        }),

        getTaskPlanning: build.query<TaskPlanning[], void>({
            query: () => ({
                url: 'system/tasks/planning',
                params: {
                    apiKey: window.Kapowarr.apiKey,
                },
            }),

            transformResponse: (response: { result: RawTaskPlanning[] }) =>
                camelize(response.result),
        }),

        getTaskHistory: build.query<TaskHistory[], void>({
            query: () => ({
                url: 'system/tasks/history',
                params: {
                    apiKey: window.Kapowarr.apiKey,
                },
            }),

            transformResponse: (response: { result: RawTaskHistory[] }) =>
                camelize(response.result),
        }),

        // POST
        importBackup: build.mutation<
            void,
            { index: number; copyHostingSettings: boolean }
        >({
            query: ({ index, ...body }) => ({
                method: 'POST',
                url: `system/database/backups/${index}`,
                params: {
                    apiKey: window.Kapowarr.apiKey,
                },
                body: snakeify(body),
            }),
        }),

        uploadDatabase: build.mutation<
            void,
            { file: File; copyHostingSettings: boolean }
        >({
            query: ({ file, copyHostingSettings }) => {
                const body = new FormData();
                body.append('file', file);
                body.append(
                    'copy_hosting_settings',
                    copyHostingSettings ? 'true' : 'false',
                );

                return {
                    method: 'POST',
                    url: 'system/database',
                    params: {
                        apiKey: window.Kapowarr.apiKey,
                    },
                    body,
                };
            },
        }),

        // PUT
        updateTaskSchedule: build.mutation<
            void,
            { taskName: CommandName; schedule: string }
        >({
            query: (body) => ({
                method: 'PUT',
                url: 'system/tasks/planning',
                params: {
                    apiKey: window.Kapowarr.apiKey,
                },
                body: snakeify(body),
            }),
        }),

        // DELETE
        clearStatusCheck: build.mutation<void, { type?: StatusCheckType }>({
            query: ({ type }) => ({
                method: 'DELETE',
                url: 'system/status',
                params: {
                    apiKey: window.Kapowarr.apiKey,
                    type,
                },
            }),
        }),

        clearTaskHistory: build.mutation<void, void>({
            query: () => ({
                method: 'DELETE',
                url: 'system/tasks/history',
                params: {
                    apiKey: window.Kapowarr.apiKey,
                },
            }),
        }),
    }),
});

export const {
    useClearStatusCheckMutation,
    useClearTaskHistoryMutation,
    useGetAboutInfoQuery,
    useGetBackupsQuery,
    useImportBackupMutation,
    useUploadDatabaseMutation,
    useGetStatusChecksQuery,
    useGetTaskHistoryQuery,
    useGetTaskPlanningQuery,
    useLazyGetAboutInfoQuery,
    useLazyGetTaskHistoryQuery,
    useLazyGetTaskPlanningQuery,
    useUpdateTaskScheduleMutation,
} = extendedApi;
