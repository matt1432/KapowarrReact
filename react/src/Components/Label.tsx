// IMPORTS

// Misc
import { kinds, sizes } from 'Helpers/Props';

import classNames from 'classnames';

// CSS
import styles from './Label.module.css';

// Types
import type { ComponentProps, ReactNode } from 'react';
import type { Kind } from 'Helpers/Props/kinds';
import type { Size } from 'Helpers/Props/sizes';

export interface LabelProps extends ComponentProps<'span'> {
    kind?: Extract<Kind, keyof typeof styles>;
    size?: Extract<Size, keyof typeof styles>;
    outline?: boolean;
    children: ReactNode;
}

// IMPLEMENTATIONS

export default function Label({
    className = styles.label,
    kind = kinds.DEFAULT_KIND,
    size = sizes.SMALL,
    outline = false,
    ...otherProps
}: LabelProps) {
    return (
        <span
            className={classNames(className, styles[kind], styles[size], outline && styles.outline)}
            {...otherProps}
        />
    );
}
