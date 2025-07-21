export type ScrollDirection = 'none' | 'both' | 'horizontal' | 'vertical';

const NONE: ScrollDirection = 'none';
const BOTH: ScrollDirection = 'both';
const HORIZONTAL: ScrollDirection = 'horizontal';
const VERTICAL: ScrollDirection = 'vertical';

const all: ScrollDirection[] = [NONE, HORIZONTAL, VERTICAL, BOTH];

export const scrollDirections = {
    NONE,
    BOTH,
    HORIZONTAL,
    VERTICAL,
    all,
};

export default scrollDirections;
