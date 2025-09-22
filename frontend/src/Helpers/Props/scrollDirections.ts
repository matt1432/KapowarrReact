export const scrollDirections = {
    NONE: 'none',
    BOTH: 'both',
    HORIZONTAL: 'horizontal',
    VERTICAL: 'vertical',
} as const;

export default scrollDirections;

export type ScrollDirection = (typeof scrollDirections)[keyof typeof scrollDirections];
