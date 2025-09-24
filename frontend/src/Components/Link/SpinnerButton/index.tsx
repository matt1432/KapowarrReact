// IMPORTS

// Misc
import { icons } from 'Helpers/Props';

import classNames from 'classnames';

// General Components
import Icon, { type IconName } from 'Components/Icon';

// Specific Components
import Button, { type ButtonProps } from '../Button';

// CSS
import styles from './index.module.css';

// Types
export interface SpinnerButtonProps extends ButtonProps {
    isSpinning: boolean;
    isDisabled?: boolean;
    spinnerIcon?: IconName;
}

// IMPLEMENTATIONS

export default function SpinnerButton({
    className = styles.button,
    isSpinning,
    isDisabled,
    spinnerIcon = icons.SPINNER,
    children,
    ...otherProps
}: SpinnerButtonProps) {
    return (
        <Button
            className={classNames(
                className,
                styles.button,
                isSpinning && styles.isSpinning,
            )}
            isDisabled={isDisabled || isSpinning}
            {...otherProps}
        >
            <span className={styles.spinnerContainer}>
                <Icon
                    className={styles.spinner}
                    name={spinnerIcon}
                    isSpinning={true}
                />
            </span>

            <span className={styles.label}>{children}</span>
        </Button>
    );
}
