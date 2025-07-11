import { type Volume } from 'Volumes/Volumes';

const STARTS_WITH_NUMBER_REGEX = /^\d/;

export default function getIndexOfFirstCharacter(items: Volume[], character: string) {
    return items.findIndex((item) => {
        const firstCharacter = item.title.charAt(0);

        if (character === '#') {
            return STARTS_WITH_NUMBER_REGEX.test(firstCharacter);
        }

        return firstCharacter === character;
    });
}
