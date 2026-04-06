// IMPORTS

// React
import { useEffect, useMemo, useState } from 'react';

// Redux
import { useRootSelector } from 'Store/createAppStore';
import { setApiKey, setLastLogin } from 'Store/Slices/Auth';

import { baseApi } from './base';

// Misc
import { isApiError } from 'Utilities/Object/error';

import snakeify from 'Utilities/Object/snakeify';

// IMPLEMENTATIONS

const extendedApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        // POST
        getApiKey: build.mutation<
            string,
            { username?: string; password?: string }
        >({
            query: (body) => ({
                method: 'POST',
                url: 'auth',
                body: snakeify(body),
            }),

            transformResponse: (response: { result: { api_key: string } }) =>
                response.result.api_key,

            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(setApiKey(data));
                    dispatch(setLastLogin(Date.now() / 1000));
                }
                catch {
                    /**/
                }
            },
        }),
    }),
});

export const useApiKey = () => {
    const [isFirstPost, setIsFirstPost] = useState(true);

    const { apiKey, lastLogin } = useRootSelector((state) => state.auth);

    const [getApiKey, { data, error, ...getApiKeyState }] =
        extendedApi.useGetApiKeyMutation();

    useEffect(() => {
        if (!apiKey || lastLogin < Date.now() / 1000 - 86400) {
            getApiKey({});
        }

        // Only run once
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const isInvalid = useMemo(() => {
        if (!error) {
            return false;
        }

        if (isApiError(error) && error.status === 401) {
            if (isFirstPost) {
                // eslint-disable-next-line react-hooks/set-state-in-render
                setIsFirstPost(false);
                return false;
            }
            else {
                return true;
            }
        }

        return false;

        // Don't depend on isFirstPost since this is the only place where it is updated
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [error]);

    return {
        getApiKey,
        isInvalid,
        error,
        ...getApiKeyState,
    };
};
