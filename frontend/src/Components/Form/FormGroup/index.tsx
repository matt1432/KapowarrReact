// IMPORTS

// Misc
import classNames from 'classnames';

// CSS
import styles from './index.module.css';

// Types
import type { Size } from 'Helpers/Props/sizes';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

interface FormGroupProps extends ComponentPropsWithoutRef<'div'> {
    className?: string;
    children: ReactNode;
    size?: Extract<Size, keyof typeof styles>;
}

// IMPLEMENTATIONS

export default function FormGroup({
    className = styles.group,
    children,
    size = 'small',
    ...otherProps
}: FormGroupProps) {
    return (
        <div className={classNames(className, styles[size])} {...otherProps}>
            {children}
        </div>
    );
}
