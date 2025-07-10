import { type UndefinedInitialDataOptions, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import fetchJson, { ApiError, type FetchJsonOptions } from 'Utilities/Fetch/fetchJson';
import getQueryPath from 'Utilities/Fetch/getQueryPath';
import getQueryString, { type QueryParams } from 'Utilities/Fetch/getQueryString';

export interface QueryOptions<T> extends FetchJsonOptions<unknown> {
    queryParams?: QueryParams;
    queryOptions?:
        | Omit<UndefinedInitialDataOptions<T, ApiError>, 'queryKey' | 'queryFn'>
        | undefined;
}

const useApiQuery = <T>(options: QueryOptions<T>) => {
    const requestOptions = useMemo(() => {
        const apiKey = { api_key: window.Kapowarr.apiKey };
        Object.assign(options.queryParams ?? {}, apiKey);
        const { path: path, queryParams, ...otherOptions } = options;

        return {
            ...otherOptions,
            path: getQueryPath(path) + getQueryString(queryParams ?? apiKey),
            headers: {
                ...options.headers,
            },
        };
    }, [options]);

    return useQuery({
        ...options.queryOptions,
        queryKey: [requestOptions.path],
        queryFn: async ({ signal }) => fetchJson<T, unknown>({ ...requestOptions, signal }),
    });
};

export default useApiQuery;
