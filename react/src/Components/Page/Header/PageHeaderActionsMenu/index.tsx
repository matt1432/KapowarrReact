// IMPORTS

// React
import { useCallback } from 'react';

// Redux
import { useRootDispatch, useRootSelector } from 'Store/createAppStore';
import { useRestartMutation, useShutdownMutation } from 'Store/Api/Command';

// Misc
import { align, icons, kinds } from 'Helpers/Props';

import translate from 'Utilities/String/translate';

// General Components
import Icon from 'Components/Icon';
import Menu from 'Components/Menu/Menu';
import MenuButton from 'Components/Menu/MenuButton';
import MenuContent from 'Components/Menu/MenuContent';
import MenuItem from 'Components/Menu/MenuItem';
import MenuItemSeparator from 'Components/Menu/MenuItemSeparator';

// Specific Components

// CSS
import styles from './index.module.css';
import { setApiKey } from 'Store/Slices/Auth';

// Types
interface PageHeaderActionsMenuProps {
    onKeyboardShortcutsPress(): void;
}

// IMPLEMENTATIONS

export default function PageHeaderActionsMenu({
    onKeyboardShortcutsPress,
}: PageHeaderActionsMenuProps) {
    const dispatch = useRootDispatch();

    const { formsAuth } = useRootSelector((state) => state.auth);

    const [restart] = useRestartMutation();
    const [shutdown] = useShutdownMutation();

    const handleRestartPress = useCallback(() => {
        restart();
    }, [restart]);

    const handleShutdownPress = useCallback(() => {
        shutdown();
    }, [shutdown]);

    const handleLogoutPress = useCallback(() => {
        dispatch(setApiKey(''));
    }, [dispatch]);

    return (
        <div>
            <Menu alignMenu={align.RIGHT}>
                <MenuButton className={styles.menuButton} aria-label="Menu Button">
                    <Icon name={icons.INTERACTIVE} title={translate('Menu')} />
                </MenuButton>

                <MenuContent>
                    <MenuItem onPress={onKeyboardShortcutsPress}>
                        <Icon className={styles.itemIcon} name={icons.KEYBOARD} />
                        {translate('KeyboardShortcuts')}
                    </MenuItem>

                    <MenuItemSeparator />

                    <MenuItem onPress={handleRestartPress}>
                        <Icon className={styles.itemIcon} name={icons.RESTART} />
                        {translate('Restart')}
                    </MenuItem>

                    <MenuItem onPress={handleShutdownPress}>
                        <Icon
                            className={styles.itemIcon}
                            name={icons.SHUTDOWN}
                            kind={kinds.DANGER}
                        />
                        {translate('Shutdown')}
                    </MenuItem>

                    {formsAuth ? (
                        <>
                            <MenuItemSeparator />

                            <MenuItem onPress={handleLogoutPress}>
                                <Icon className={styles.itemIcon} name={icons.LOGOUT} />
                                {translate('Logout')}
                            </MenuItem>
                        </>
                    ) : null}
                </MenuContent>
            </Menu>
        </div>
    );
}
