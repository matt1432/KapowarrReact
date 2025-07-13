import { fileURLToPath, URL } from 'node:url';
import { readdirSync } from 'node:fs';

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

import { patchCssModules } from 'vite-css-modules';
import postcss from './vite.postcss';

// Emulate `"paths": { "*": [ "src/*" ] }` in vite
const resolve = (dir: string) => fileURLToPath(new URL(dir, import.meta.url));
const srcAliases = Object.fromEntries(
    readdirSync(resolve('./src')).map((dir) => [dir, resolve(`./src/${dir}`)]),
);

export default defineConfig({
    plugins: [patchCssModules(), react()],
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
            ...srcAliases,
            '~normalize.css': 'normalize.css',
        },
    },
});
