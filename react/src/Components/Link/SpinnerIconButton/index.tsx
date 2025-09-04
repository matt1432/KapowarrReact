// IMPORTS

// Misc
import { icons } from 'Helpers/Props';

// Specific Components
import IconButton, { type IconButtonProps } from '../IconButton';

// Types
import type { IconName } from 'Components/Icon';

interface SpinnerIconButtonProps extends IconButtonProps {
    spinningName?: IconName;
}

// IMPLEMENTATIONS

export default function SpinnerIconButton({
    name,
    spinningName = icons.SPINNER,
    isDisabled = false,
    isSpinning = false,
    ...otherProps
}: SpinnerIconButtonProps) {
    return (
        <IconButton
            name={isSpinning ? spinningName || name : name}
            isDisabled={isDisabled || isSpinning}
            isSpinning={isSpinning}
            {...otherProps}
        />
    );
}
