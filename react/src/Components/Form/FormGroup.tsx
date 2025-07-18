// IMPORTS

// React
import React, { Children, type ComponentPropsWithoutRef, type ReactNode } from 'react';

// Misc
import classNames from 'classnames';

// CSS
import styles from './FormGroup.module.css';

// Types
import type { Size } from 'Helpers/Props/sizes';

interface FormGroupProps extends ComponentPropsWithoutRef<'div'> {
    className?: string;
    children: ReactNode;
    size?: Extract<Size, keyof typeof styles>;
    advancedSettings?: boolean;
    isAdvanced?: boolean;
}

// IMPLEMENTATIONS

function FormGroup(props: FormGroupProps) {
    const {
        className = styles.group,
        children,
        size = 'small',
        advancedSettings = false,
        isAdvanced = false,
        ...otherProps
    } = props;

    if (!advancedSettings && isAdvanced) {
        return null;
    }

    const childProps = isAdvanced ? { isAdvanced } : {};

    return (
        <div className={classNames(className, styles[size])} {...otherProps}>
            {Children.map(children, (child) => {
                if (!React.isValidElement(child)) {
                    return child;
                }

                return React.cloneElement(child, childProps);
            })}
        </div>
    );
}

export default FormGroup;
