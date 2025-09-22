export const align = {
    LEFT: 'left',
    CENTER: 'center',
    RIGHT: 'right',
} as const;

export default align;

export type Align = (typeof align)[keyof typeof align];
