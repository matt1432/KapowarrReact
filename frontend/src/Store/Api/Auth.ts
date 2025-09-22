// IMPORTS

// React
import { useEffect, useMemo, useState } from 'react';

// Redux
import { useRootDispatch, useRootSelector } from 'Store/createAppStore';
import { setApiKey, setLastLogin } from 'Store/Slices/Auth';

import { baseApi } from './base';

// Misc
import { isApiError } from 'Utilities/Object/error';

import snakeify from 'Utilities/Object/snakeify';

// IMPLEMENTATIONS

const extendedApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
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
    }),
});

export const useApiKey = () => {
    const dispatch = useRootDispatch();

    const [isFirstPost, setIsFirstPost] = useState(true);

    const { apiKey, lastLogin } = useRootSelector((state) => state.auth);

    const [getApiKey, { data, error, ...getApiKeyState }] = extendedApi.useGetApiKeyMutation();

    useEffect(() => {
        if (!apiKey || lastLogin < Date.now() / 1000 - 86400) {
            getApiKey({});
        }

        // Only run once
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (data) {
            dispatch(setApiKey(data));
            dispatch(setLastLogin(Date.now() / 1000));
        }
    }, [data, dispatch, lastLogin]);

    const isInvalidPassword = useMemo(() => {
        if (!error) {
            return false;
        }

        if (isApiError(error) && error.status === 401) {
            if (isFirstPost) {
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
        isInvalidPassword,
        error,
        ...getApiKeyState,
    };
};
