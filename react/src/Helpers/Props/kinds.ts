export type Kind =
    | 'danger'
    | 'defaultKind'
    | 'disabled'
    | 'info'
    | 'inverse'
    | 'pink'
    | 'primary'
    | 'purple'
    | 'success'
    | 'warning';

const DANGER: Kind = 'danger';
const DEFAULT_KIND: Kind = 'defaultKind';
const DISABLED: Kind = 'disabled';
const INFO: Kind = 'info';
const INVERSE: Kind = 'inverse';
const PINK: Kind = 'pink';
const PRIMARY: Kind = 'primary';
const PURPLE: Kind = 'purple';
const SUCCESS: Kind = 'success';
const WARNING: Kind = 'warning';

const all = [
    DANGER,
    DEFAULT_KIND,
    DISABLED,
    INFO,
    INVERSE,
    PINK,
    PRIMARY,
    PURPLE,
    SUCCESS,
    WARNING,
] as const;

export const kinds = {
    DANGER,
    DEFAULT_KIND,
    DISABLED,
    INFO,
    INVERSE,
    PINK,
    PRIMARY,
    PURPLE,
    SUCCESS,
    WARNING,
    all,
};

export default kinds;
