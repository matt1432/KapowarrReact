// IMPORTS

// React
import React from 'react';

// Misc
import { icons } from 'Helpers/Props';

import translate from 'Utilities/String/translate';

// General Components
import Menu from 'Components/Menu/Menu';
import ToolbarMenuButton, { type ToolbarMenuButtonProps } from 'Components/Menu/ToolbarMenuButton';

// Types
interface SortMenuProps extends Omit<ToolbarMenuButtonProps, 'iconName'> {
    className?: string;
    children: React.ReactNode;
    isDisabled?: boolean;
    alignMenu?: 'left' | 'right';
}

// IMPLEMENTATIONS

function SortMenu({ className, children, isDisabled = false, ...otherProps }: SortMenuProps) {
    return (
        <Menu className={className} {...otherProps}>
            <ToolbarMenuButton
                iconName={icons.SORT}
                text={translate('Sort')}
                isDisabled={isDisabled}
            />
            {children}
        </Menu>
    );
}

export default SortMenu;
