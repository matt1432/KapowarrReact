import classNames from 'classnames';
import { kinds, sizes } from 'Helpers/Props';
import { type Align } from 'Helpers/Props/align';
import { type Kind } from 'Helpers/Props/kinds';
import { type Size } from 'Helpers/Props/sizes';
import Link, { type LinkProps } from './Link';
import styles from './Button.module.css';

export interface ButtonProps extends Omit<LinkProps, 'children' | 'size'> {
    buttonGroupPosition?: Extract<Align, keyof typeof styles>;
    kind?: Extract<Kind, keyof typeof styles>;
    size?: Extract<Size, keyof typeof styles>;
    children: Required<LinkProps['children']>;
}

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
