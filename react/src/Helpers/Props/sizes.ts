export const sizes = {
    EXTRA_SMALL: 'extraSmall',
    SMALL: 'small',
    MEDIUM: 'medium',
    LARGE: 'large',
    EXTRA_LARGE: 'extraLarge',
    EXTRA_EXTRA_LARGE: 'extraExtraLarge',
} as const;

export default sizes;

export type Size = (typeof sizes)[keyof typeof sizes];
