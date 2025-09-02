// TODO: https://github.com/Sonarr/Sonarr/blob/v5-develop/frontend/src/Utilities/String/translate.ts

import english from './en.json';

export type TranslateKey = keyof typeof english;

export default function translate(
    key: TranslateKey,
    tokens: Record<string, string | number | boolean> = {},
) {
    tokens.appName = 'Kapowarr';

    if (!Object.hasOwn(english, key)) {
        return key;
    }

    return english[key].replace(/\{([a-z0-9]+?)\}/gi, (match, tokenMatch) =>
        String(tokens[tokenMatch] ?? match),
    );
}
