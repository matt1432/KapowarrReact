import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

import { patchCssModules } from 'vite-css-modules';
import postcss from './vite.postcss';

export default defineConfig({
    plugins: [react(), tsconfigPaths(), patchCssModules()],
    build: {
        minify: false,
        chunkSizeWarningLimit: 750,
        rollupOptions: {
            output: {
                assetFileNames: (asset) => {
                    return `static/${asset.names[0].split('.').at(-1)}/[name][extname]`;
                },
                chunkFileNames: 'static/js/[name].js',
                manualChunks: {
                    bootstrap: ['src/bootstrap/index.tsx'],
                    react: ['src/index.ts'],
                },
            },
        },
    },
    css: {
        postcss,
        modules: {
            localsConvention: 'camelCase',
        },
    },
    resolve: {
        alias: {
            '~normalize.css': 'normalize.css',
        },
    },
});
