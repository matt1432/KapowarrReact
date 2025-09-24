// IMPORTS

// Misc
import { icons } from 'Helpers/Props';

// Specific Components
import Icon, { type IconName, type IconProps } from '../Icon';

// Types
export interface SpinnerIconProps extends IconProps {
    spinningName?: IconName;
    isSpinning: Required<IconProps['isSpinning']>;
}

// IMPLEMENTATIONS

export default function SpinnerIcon({
    name,
    spinningName = icons.SPINNER,
    isSpinning,
    ...otherProps
}: SpinnerIconProps) {
    return (
        <Icon
            name={(isSpinning && spinningName) || name}
            isSpinning={isSpinning}
            {...otherProps}
        />
    );
}
