// IMPORTS

// React
import React from 'react';

// Misc
import { icons } from 'Helpers/Props';

import classNames from 'classnames';

// General Components
import Icon, { type IconName } from 'Components/Icon';
import Link, { type LinkProps } from 'Components/Link/Link';

// Specific Components

// CSS
import styles from './index.module.css';

// Types
export interface PageToolbarButtonProps extends LinkProps {
    label: string;
    iconName: IconName;
    spinningName?: IconName;
    isSpinning?: boolean;
    isDisabled?: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    overflowComponent?: React.ComponentType<any>;
}

// IMPLEMENTATIONS

export default function PageToolbarButton({
    label,
    iconName,
    spinningName = icons.SPINNER,
    isDisabled = false,
    isSpinning = false,
    ...otherProps
}: PageToolbarButtonProps) {
    return (
        <Link
            className={classNames(
                styles.toolbarButton,
                isDisabled && styles.isDisabled,
            )}
            isDisabled={isDisabled || isSpinning}
            title={label}
            {...otherProps}
        >
            <Icon
                name={isSpinning ? spinningName || iconName : iconName}
                isSpinning={isSpinning}
                size={21}
            />

            <div className={styles.labelContainer}>
                <div className={styles.label}>{label}</div>
            </div>
        </Link>
    );
}
