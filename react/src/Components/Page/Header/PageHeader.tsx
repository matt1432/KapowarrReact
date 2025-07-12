import { useCallback, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'Store/createAppStore';
import IconButton from 'Components/Link/IconButton';
import Link from 'Components/Link/Link';
import useKeyboardShortcuts from 'Helpers/Hooks/useKeyboardShortcuts';
import { icons } from 'Helpers/Props';
import { selectIsSidebarVisible, setIsSidebarVisible } from 'Store/Slices/App';
import KeyboardShortcutsModal from './KeyboardShortcutsModal';
import PageHeaderActionsMenu from './PageHeaderActionsMenu';
// import VolumesSearchInput from './VolumesSearchInput';
import styles from './PageHeader.module.css';

function PageHeader() {
    const dispatch = useAppDispatch();

    const isSidebarVisible = useAppSelector(selectIsSidebarVisible);

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
                    <img
                        className={styles.logo}
                        src={`${window.Kapowarr.urlBase}/static/img/favicon.svg`}
                        alt="Kapowarr Logo"
                    />
                </Link>
            </div>

            <div className={styles.sidebarToggleContainer}>
                <IconButton
                    id="sidebar-toggle-button"
                    name={icons.NAVBAR_COLLAPSE}
                    onPress={handleSidebarToggle}
                />
            </div>

            {/*<VolumesSearchInput />*/}

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

export default PageHeader;
