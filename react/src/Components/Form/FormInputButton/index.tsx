// IMPORTS

// Misc
import { kinds } from 'Helpers/Props';

import classNames from 'classnames';

// General Components
import Button, { type ButtonProps } from 'Components/Link/Button';
import SpinnerButton from 'Components/Link/SpinnerButton';

// Specific Components

// CSS
import styles from './index.module.css';

// Types
import type { IconName } from 'Components/Icon';

export interface FormInputButtonProps extends ButtonProps {
    canSpin?: boolean;
    isLastButton?: boolean;
    isSpinning?: boolean;
    spinnerIcon?: IconName;
}

// IMPLEMENTATIONS

export default function FormInputButton({
    className = styles.button,
    canSpin = false,
    isLastButton = true,
    isSpinning = false,
    kind = kinds.PRIMARY,
    ...otherProps
}: FormInputButtonProps) {
    if (canSpin) {
        return (
            <SpinnerButton
                className={classNames(className, !isLastButton && styles.middleButton)}
                kind={kind}
                isSpinning={isSpinning}
                {...otherProps}
            />
        );
    }

    return (
        <Button
            className={classNames(className, !isLastButton && styles.middleButton)}
            kind={kind}
            {...otherProps}
        />
    );
}
