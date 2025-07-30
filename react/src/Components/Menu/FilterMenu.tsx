// IMPORTS

// React
import React from 'react';

// Misc
import { icons } from 'Helpers/Props';
import translate from 'Utilities/String/translate';

// Specific Components
import Menu from 'Components/Menu/Menu';
import ToolbarMenuButton, { type ToolbarMenuButtonProps } from 'Components/Menu/ToolbarMenuButton';

// CSS

// Types
interface FilterMenuProps extends Omit<ToolbarMenuButtonProps, 'iconName'> {
    children: React.ReactNode;
    isDisabled?: boolean;
    alignMenu?: 'left' | 'right';
}

// IMPLEMENTATIONS

function FilterMenu({ children, isDisabled = false, ...otherProps }: FilterMenuProps) {
    return (
        <Menu {...otherProps}>
            <ToolbarMenuButton
                iconName={icons.FILTER}
                text={translate('Filter')}
                isDisabled={isDisabled}
            />
            {children}
        </Menu>
    );
}

export default FilterMenu;
