// IMPORTS

// Misc
import { kinds, sizes } from 'Helpers/Props';

import classNames from 'classnames';

// Specific Components
import Link, { type LinkProps } from './Link';

// CSS
import styles from './Button.module.css';

// Types
import type { Align } from 'Helpers/Props/align';
import type { Kind } from 'Helpers/Props/kinds';
import type { Size } from 'Helpers/Props/sizes';

export interface ButtonProps extends Omit<LinkProps, 'children' | 'size'> {
    buttonGroupPosition?: Extract<Align, keyof typeof styles>;
    kind?: Extract<Kind, keyof typeof styles>;
    size?: Extract<Size, keyof typeof styles>;
    children: Required<LinkProps['children']>;
}

// IMPLEMENTATIONS

export default function Button({
    className = styles.button,
    buttonGroupPosition,
    kind = kinds.DEFAULT_KIND,
    size = sizes.MEDIUM,
    ...otherProps
}: ButtonProps) {
    return (
        <Link
            className={classNames(
                className,
                styles[kind],
                styles[size],
                buttonGroupPosition && styles[buttonGroupPosition],
            )}
            {...otherProps}
        />
    );
}
