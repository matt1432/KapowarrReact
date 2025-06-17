import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

import postcss from './vite.postcss';

export default defineConfig({
    plugins: [react()],
    build: {
        rollupOptions: {
            output: {
                assetFileNames: (asset) => {
                    return `out/${asset.names[0].split('.').at(-1)}/[name][extname]`;
                },
                chunkFileNames: 'out/js/[name].js',
                manualChunks: {
                    react: ['src/main.tsx'],
                },
            },
        },
    },
    css: {
        postcss,
    },
    resolve: {
        alias: {
            '~normalize.css': 'normalize.css',
        },
    },
});
