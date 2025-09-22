export const kinds = {
    DANGER: 'danger',
    DEFAULT_KIND: 'defaultKind',
    DISABLED: 'disabled',
    INFO: 'info',
    INVERSE: 'inverse',
    PINK: 'pink',
    PRIMARY: 'primary',
    PURPLE: 'purple',
    SUCCESS: 'success',
    WARNING: 'warning',
} as const;

export default kinds;

export type Kind = (typeof kinds)[keyof typeof kinds];
