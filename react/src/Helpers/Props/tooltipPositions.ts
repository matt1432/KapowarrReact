export const tooltipPositions = {
    TOP: 'top',
    RIGHT: 'right',
    BOTTOM: 'bottom',
    LEFT: 'left',
} as const;

export default tooltipPositions;

export type TooltipPosition = (typeof tooltipPositions)[keyof typeof tooltipPositions];
