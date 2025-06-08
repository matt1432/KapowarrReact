import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
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
                    react: ['src/main.tsx']
                }
            },
        },
    },
})
