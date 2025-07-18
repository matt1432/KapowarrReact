// IMPORTS

// React
// import { useCallback } from 'react';

// Redux
// import { useDispatch, useSelector } from 'react-redux';
// import { restart, shutdown } from 'Store/Actions/systemActions';

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
import styles from './PageHeaderActionsMenu.module.css';

// Types
interface PageHeaderActionsMenuProps {
    onKeyboardShortcutsPress(): void;
}

// IMPLEMENTATIONS

function PageHeaderActionsMenu(props: PageHeaderActionsMenuProps) {
    const { onKeyboardShortcutsPress } = props;

    // const dispatch = useDispatch();

    // const { authentication, isDocker } = useSelector((state: AppState) => state.system.status.item);
    const isDocker = false;

    // const formsAuth = authentication === 'forms';
    const formsAuth = false;

    /*
    const handleRestartPress = useCallback(() => {
        dispatch(restart());
    }, [dispatch]);

    const handleShutdownPress = useCallback(() => {
        dispatch(shutdown());
    }, [dispatch]);
    */

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

                    {isDocker ? null : (
                        <>
                            <MenuItemSeparator />

                            <MenuItem onPress={() => {} /*handleRestartPress*/}>
                                <Icon className={styles.itemIcon} name={icons.RESTART} />
                                {translate('Restart')}
                            </MenuItem>

                            <MenuItem onPress={() => {} /*handleShutdownPress*/}>
                                <Icon
                                    className={styles.itemIcon}
                                    name={icons.SHUTDOWN}
                                    kind={kinds.DANGER}
                                />
                                {translate('Shutdown')}
                            </MenuItem>
                        </>
                    )}

                    {formsAuth ? (
                        <>
                            <MenuItemSeparator />

                            <MenuItem to={`${window.Kapowarr.urlBase}/logout`}>
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

export default PageHeaderActionsMenu;
