export type TooltipPosition = 'top' | 'right' | 'bottom' | 'left';

const TOP: TooltipPosition = 'top';
const RIGHT: TooltipPosition = 'right';
const BOTTOM: TooltipPosition = 'bottom';
const LEFT: TooltipPosition = 'left';

const all: TooltipPosition[] = [TOP, RIGHT, BOTTOM, LEFT];

export const tooltipPositions = {
    TOP,
    RIGHT,
    BOTTOM,
    LEFT,
    all,
};

export default tooltipPositions;
