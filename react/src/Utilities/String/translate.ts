// TODO: https://github.com/Sonarr/Sonarr/blob/v5-develop/frontend/src/Utilities/String/translate.ts

import english from './en.json';

export default function translate(
    key: keyof typeof english,
    tokens: Record<string, string | number | boolean> = {},
) {
    tokens.appName = 'Kapowarr';

    return english[key];
}
