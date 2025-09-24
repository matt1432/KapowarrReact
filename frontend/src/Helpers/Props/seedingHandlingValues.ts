export const seedingHandlingValues = {
    COMPLETE: 'complete',
    COPY: 'copy',
} as const;

export default seedingHandlingValues;

export type SeedingHandling =
    (typeof seedingHandlingValues)[keyof typeof seedingHandlingValues];
