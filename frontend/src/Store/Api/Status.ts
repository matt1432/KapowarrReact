// IMPORTS

// Redux
import { baseApi } from './base';

// Misc
import camelize from 'Utilities/Object/camelize';

// Types
import type {
    AboutInfo,
    RawAboutInfo,
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
    useGetStatusChecksQuery,
    useGetTaskHistoryQuery,
    useGetTaskPlanningQuery,
    useLazyGetAboutInfoQuery,
    useLazyGetTaskHistoryQuery,
    useLazyGetTaskPlanningQuery,
} = extendedApi;
