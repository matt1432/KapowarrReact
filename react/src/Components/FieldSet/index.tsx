// IMPORTS

// React
import React, { type ComponentProps } from 'react';

// Misc
import { sizes } from 'Helpers/Props';

import classNames from 'classnames';

// CSS
import styles from './index.module.css';

// Types
import type { Size } from 'Helpers/Props/sizes';

interface FieldSetProps {
    size?: Size;
    legend?: ComponentProps<'legend'>['children'];
    children?: React.ReactNode;
}

// IMPLEMENTATIONS

function FieldSet({ size = sizes.MEDIUM, legend, children }: FieldSetProps) {
    return (
        <fieldset className={styles.fieldSet}>
            <legend className={classNames(styles.legend, size === sizes.SMALL && styles.small)}>
                {legend}
            </legend>
            {children}
        </fieldset>
    );
}

export default FieldSet;
