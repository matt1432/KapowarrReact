// IMPORTS

// Redux
import { baseApi } from './base';

// Misc
import snakeify from 'Utilities/Object/snakeify';
import camelize from 'Utilities/Object/camelize';

// Types
import type { IssueData, RawIssueData } from 'Issue/Issue';

export interface ToggleIssueParams {
    issueId: number;
    monitored: boolean;
}

export interface UpdateIssueParams {
    issueId: number;
    monitored?: boolean;
    title?: string;
    description?: string;
}

// IMPLEMENTATIONS

const extendedApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        // GET
        getIssue: build.query<IssueData, { issueId: number }>({
            query: ({ issueId }) => ({
                url: `issues/${issueId}`,
                params: {
                    apiKey: window.Kapowarr.apiKey,
                },
            }),

            transformResponse: (response: { result: RawIssueData }) => camelize(response.result),
        }),

        // PUT
        updateIssue: build.mutation<void, UpdateIssueParams>({
            query: ({ issueId, ...body }) => ({
                method: 'PUT',
                url: `issues/${issueId}`,
                params: {
                    apiKey: window.Kapowarr.apiKey,
                },
                body: snakeify(body),
            }),
        }),
    }),
});

export const { useGetIssueQuery, useLazyGetIssueQuery, useUpdateIssueMutation } = extendedApi;
