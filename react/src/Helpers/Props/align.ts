export type Align = 'left' | 'center' | 'right';

const LEFT: Align = 'left';
const CENTER: Align = 'center';
const RIGHT: Align = 'right';

const all: Align[] = [LEFT, CENTER, RIGHT] as const;

export const align = {
    LEFT,
    CENTER,
    RIGHT,
    all,
};

export default align;
