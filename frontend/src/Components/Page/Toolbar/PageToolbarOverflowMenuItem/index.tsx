// IMPORTS

// General Components
import MenuItem from 'Components/Menu/MenuItem';
import SpinnerIcon from 'Components/SpinnerIcon';

// CSS
import styles from './index.module.css';

// Types
import type { SyntheticEvent } from 'react';
import type { IconName } from 'Components/Icon';

interface PageToolbarOverflowMenuItemProps {
    iconName: IconName;
    spinningName?: IconName;
    isDisabled?: boolean;
    isSpinning?: boolean;
    showIndicator?: boolean;
    label: string;
    text?: string;
    onPress?: (event: SyntheticEvent<Element, Event>) => void;
}

// IMPLEMENTATIONS

export default function PageToolbarOverflowMenuItem({
    iconName,
    spinningName,
    label,
    isDisabled,
    isSpinning = false,
    ...otherProps
}: PageToolbarOverflowMenuItemProps) {
    return (
        <MenuItem
            key={label}
            isDisabled={isDisabled || isSpinning}
            {...otherProps}
        >
            <SpinnerIcon
                className={styles.icon}
                name={iconName}
                spinningName={spinningName}
                isSpinning={isSpinning}
            />
            {label}
        </MenuItem>
    );
}
