// IMPORTS

// Redux
import { baseApi } from './base';

// Misc
import getQueryString from 'Utilities/Fetch/getQueryString';
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
                url:
                    `issues/${issueId}` +
                    getQueryString({
                        api_key: window.Kapowarr.apiKey,
                    }),
                body: snakeify(body),
            }),
        }),
    }),
});

export const { useToggleIssueMonitoredMutation } = extendedApi;
