// IMPORTS

// Redux
import { baseApi } from './base';

// Misc
import snakeify from 'Utilities/Object/snakeify';

// Types
export interface ToggleIssueParams {
    issueId: number;
    monitored: boolean;
}

// IMPLEMENTATIONS

const extendedApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        // PUT
        toggleIssueMonitored: build.mutation<void, ToggleIssueParams>({
            query: ({ issueId, ...body }) => ({
                method: 'PUT',
                url: `issues/${issueId}`,
                params: {
                    apiKey: window.Kapowarr.apiKey,
                },
                body: snakeify(body),
            }),
        }),

        // DELETE
        deleteFile: build.mutation<void, { fileId: number }>({
            query: ({ fileId }) => ({
                method: 'DELETE',
                url: `files/${fileId}`,
                params: {
                    apiKey: window.Kapowarr.apiKey,
                },
            }),
        }),
    }),
});

export const { useDeleteFileMutation, useToggleIssueMonitoredMutation } = extendedApi;
