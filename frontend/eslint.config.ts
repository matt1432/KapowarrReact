import { defineConfig } from 'eslint/config';

import js from '@eslint/js';
import globals from 'globals';

import tseslint from 'typescript-eslint';

import prettierRecommended from 'eslint-plugin-prettier/recommended';

import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default defineConfig(
    { ignores: ['dist'] },
    {
        extends: [js.configs.recommended, ...tseslint.configs.recommended],

        files: ['**/*.{ts,tsx}'],

        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
        },

        plugins: {
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
        },

        rules: {
            ...reactHooks.configs.recommended.rules,
            'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
            eqeqeq: ['error'],

            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    args: 'all',
                    argsIgnorePattern: '^_',
                    caughtErrors: 'all',
                    caughtErrorsIgnorePattern: '^_',
                    destructuredArrayIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    ignoreRestSiblings: true,
                },
            ],
        },
    },
    prettierRecommended,
);
