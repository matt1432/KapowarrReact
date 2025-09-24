// IMPORTS

// React
import React, { type ComponentProps, type ReactNode } from 'react';

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
    subLegend?: ReactNode;
    children?: React.ReactNode;
}

// IMPLEMENTATIONS

export default function FieldSet({
    size = sizes.MEDIUM,
    legend,
    subLegend,
    children,
}: FieldSetProps) {
    return (
        <fieldset className={styles.fieldSet}>
            <legend
                className={classNames(
                    styles.legend,
                    size === sizes.SMALL && styles.small,
                )}
            >
                {subLegend ? (
                    <div className={styles.legendTitle}>
                        <span className={styles.title}>{legend}</span>
                        <span className={styles.subtitle}>{subLegend}</span>
                    </div>
                ) : (
                    legend
                )}
            </legend>
            {children}
        </fieldset>
    );
}
