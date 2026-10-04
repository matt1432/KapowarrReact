// IMPORTS

// Redux
import { baseApi } from './base';

// Misc
import snakeify from 'Utilities/Object/snakeify';
import camelize from 'Utilities/Object/camelize';

// Types
import type { CamelCasedPropertiesDeep } from 'type-fest';

import type { FileData, RawFileData } from 'Issue/Issue';

export interface UpdateFileParams {
    fileId: number;
    releaser?: string;
    scanType?: string;
    resolution?: string;
    dpi?: string;
    notes?: string;
}

export interface RawSimilarPageData {
    file_id: number;
    filename: string;
    filepath: string;
    distance: number;
    preview_path: string;
}

export type SimilarPageData = CamelCasedPropertiesDeep<
    Omit<RawSimilarPageData, 'preview_path'> & {
        src: string;
    }
>;

export interface PageReference {
    fileId: number;
    filename: string;
}

// IMPLEMENTATIONS

const extendedApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        // GET
        getFile: build.query<FileData, { fileId: number }>({
            query: ({ fileId }) => ({
                url: `files/${fileId}`,
                params: {
                    apiKey: window.Kapowarr.apiKey,
                },
            }),

            transformResponse: (response: { result: RawFileData }) =>
                camelize(response.result),
        }),

        // POST
        findSimilarPages: build.mutation<
            SimilarPageData[],
            PageReference & { threshold?: number }
        >({
            query: ({ fileId, ...body }) => ({
                method: 'POST',
                url: `files/${fileId}/similar_pages`,
                params: {
                    apiKey: window.Kapowarr.apiKey,
                },
                body,
            }),

            transformResponse: (response: { result: RawSimilarPageData[] }) =>
                response.result.map(({ preview_path, ...rest }) =>
                    camelize({
                        src: `${window.Kapowarr.urlBase}/api/thumbnail?api_key=${window.Kapowarr.apiKey}&filepath=${encodeURIComponent(preview_path)}`,
                        ...rest,
                    }),
                ),
        }),

        // PUT
        updateFile: build.mutation<void, UpdateFileParams>({
            query: ({ fileId, ...body }) => ({
                method: 'PUT',
                url: `files/${fileId}`,
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

        deletePages: build.mutation<void, { pages: PageReference[] }>({
            query: ({ pages }) => ({
                method: 'DELETE',
                url: 'pages',
                params: {
                    apiKey: window.Kapowarr.apiKey,
                },
                body: snakeify(pages),
            }),
        }),
    }),
});

export const {
    useDeleteFileMutation,
    useDeletePagesMutation,
    useFindSimilarPagesMutation,
    useGetFileQuery,
    useUpdateFileMutation,
} = extendedApi;
