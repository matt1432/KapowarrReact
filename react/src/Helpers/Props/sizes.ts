export type Size = 'extraSmall' | 'small' | 'medium' | 'large' | 'extraLarge' | 'extraExtraLarge';

const EXTRA_SMALL: Size = 'extraSmall';
const SMALL: Size = 'small';
const MEDIUM: Size = 'medium';
const LARGE: Size = 'large';
const EXTRA_LARGE: Size = 'extraLarge';
const EXTRA_EXTRA_LARGE: Size = 'extraExtraLarge';

const all: Size[] = [EXTRA_SMALL, SMALL, MEDIUM, LARGE, EXTRA_LARGE, EXTRA_EXTRA_LARGE] as const;

export const sizes = {
    EXTRA_SMALL,
    SMALL,
    MEDIUM,
    LARGE,
    EXTRA_LARGE,
    EXTRA_EXTRA_LARGE,
    all,
};

export default sizes;
