// IMPORTS

// React
import React from 'react';

// Misc
import { icons } from 'Helpers/Props';

import translate from 'Utilities/String/translate';

// General Components
import Menu from 'Components/Menu/Menu';
import ToolbarMenuButton, {
    type ToolbarMenuButtonProps,
} from 'Components/Menu/ToolbarMenuButton';

// Types
interface ViewMenuProps extends Omit<ToolbarMenuButtonProps, 'iconName'> {
    children: React.ReactNode;
    isDisabled?: boolean;
    alignMenu?: 'left' | 'right';
}

// IMPLEMENTATIONS

export default function ViewMenu({
    children,
    isDisabled = false,
    ...otherProps
}: ViewMenuProps) {
    return (
        <Menu {...otherProps}>
            <ToolbarMenuButton
                iconName={icons.VIEW}
                text={translate('View')}
                isDisabled={isDisabled}
            />
            {children}
        </Menu>
    );
}
