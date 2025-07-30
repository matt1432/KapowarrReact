import Fuse from 'fuse.js';

import type { SuggestedVolume } from './VolumeSearchInput';

const fuseOptions = {
    shouldSort: true,
    includeMatches: true,
    ignoreLocation: true,
    threshold: 0.3,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: ['title', 'id', 'comicvineId'],
};

function getSuggestions(volumes: SuggestedVolume[], value: string) {
    const limit = 10;
    let suggestions = [];

    if (value.length === 1) {
        for (let i = 0; i < volumes.length; i++) {
            const s = volumes[i];
            if (s.firstCharacter === value.toLowerCase()) {
                suggestions.push({
                    item: volumes[i],
                    indices: [[0, 0]],
                    matches: [
                        {
                            value: s.title,
                            key: 'title',
                        },
                    ],
                    refIndex: 0,
                });
                if (suggestions.length > limit) {
                    break;
                }
            }
        }
    }
    else {
        const fuse = new Fuse(volumes, fuseOptions);
        suggestions = fuse.search(value, { limit });
    }

    return suggestions;
}

onmessage = function (e) {
    if (!e) {
        return;
    }

    const { volumes, value } = e.data;

    const suggestions = getSuggestions(volumes, value);

    const results = {
        value,
        suggestions,
    };

    self.postMessage(results);
};
