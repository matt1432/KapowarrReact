// IMPORTS

// React
import { useCallback, useEffect, useState } from 'react';

// Redux
import { useRootDispatch, useRootSelector } from 'Store/createAppStore';
import { setIsSidebarVisible } from 'Store/Slices/App';

// Misc
import { icons } from 'Helpers/Props';

import useKeyboardShortcuts from 'Helpers/Hooks/useKeyboardShortcuts';

// General Components
import IconButton from 'Components/Link/IconButton';
import Link from 'Components/Link/Link';
import Logo from 'Components/Page/Header/Logo';

// Specific Components
import KeyboardShortcutsModal from '../KeyboardShortcutsModal';
import PageHeaderActionsMenu from '../PageHeaderActionsMenu';
import VolumeSearchInput from '../VolumeSearchInput';

// CSS
import styles from './index.module.css';

// IMPLEMENTATIONS

export default function PageHeader() {
    const dispatch = useRootDispatch();

    const isSidebarVisible = useRootSelector((state) => state.app.isSidebarVisible);

    const [isKeyboardShortcutsModalOpen, setIsKeyboardShortcutsModalOpen] = useState(false);

    const { bindShortcut, unbindShortcut } = useKeyboardShortcuts();

    const handleSidebarToggle = useCallback(() => {
        dispatch(setIsSidebarVisible(!isSidebarVisible));
    }, [isSidebarVisible, dispatch]);

    const handleOpenKeyboardShortcutsModal = useCallback(() => {
        setIsKeyboardShortcutsModalOpen(true);
    }, []);

    const handleKeyboardShortcutsModalClose = useCallback(() => {
        setIsKeyboardShortcutsModalOpen(false);
    }, []);

    useEffect(() => {
        bindShortcut('openKeyboardShortcutsModal', handleOpenKeyboardShortcutsModal);

        return () => {
            unbindShortcut('openKeyboardShortcutsModal');
        };
    }, [handleOpenKeyboardShortcutsModal, bindShortcut, unbindShortcut]);

    return (
        <div className={styles.header}>
            <div className={styles.logoContainer}>
                <Link className={styles.logoLink} to={window.Kapowarr.urlBase}>
                    <Logo />
                </Link>
            </div>

            <div className={styles.sidebarToggleContainer}>
                <IconButton
                    id="sidebar-toggle-button"
                    name={icons.NAVBAR_COLLAPSE}
                    onPress={handleSidebarToggle}
                />
            </div>

            <VolumeSearchInput />

            <div className={styles.right}>
                <PageHeaderActionsMenu
                    onKeyboardShortcutsPress={handleOpenKeyboardShortcutsModal}
                />
            </div>

            <KeyboardShortcutsModal
                isOpen={isKeyboardShortcutsModalOpen}
                onModalClose={handleKeyboardShortcutsModalClose}
            />
        </div>
    );
}
