// IMPORTS

// Redux
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Misc
import snakeify from 'Utilities/Object/snakeify';

// Types
import type { BaseQueryFn, FetchArgs } from '@reduxjs/toolkit/query/react';
import type { SerializedError } from '@reduxjs/toolkit';
import type { FetchError } from 'typings/Api';

// IMPLEMENTATIONS

export const baseApi = createApi({
    baseQuery: fetchBaseQuery({
        baseUrl: window.Kapowarr.urlBase + window.Kapowarr.apiRoot,
        paramsSerializer: (params) => new URLSearchParams(snakeify(params)).toString(),
    }) as BaseQueryFn<string | FetchArgs, unknown, FetchError | SerializedError>,
    endpoints: () => ({}),
});
