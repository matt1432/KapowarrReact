// IMPORTS

// React
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// IMPLEMENTATIONS

export const baseApi = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: window.Kapowarr.urlBase + window.Kapowarr.apiRoot }),
    endpoints: () => ({}),
});
