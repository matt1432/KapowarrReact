// TODO: https://github.com/Sonarr/Sonarr/blob/v5-develop/frontend/src/Utilities/String/translate.ts
export default function translate(
    key: string,
    tokens: Record<string, string | number | boolean> = {},
) {
    tokens.appName = 'Kapowarr';

    return key;
}
