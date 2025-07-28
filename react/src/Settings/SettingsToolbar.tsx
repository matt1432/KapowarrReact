// IMPORTS

// React
// import { type ReactElement, useCallback, useEffect, useRef, useState } from 'react';
import { type ReactElement, useEffect } from 'react';

// Misc
// import { type BlockerFunction, useBlocker, useNavigate } from 'react-router-dom';

import { icons } from 'Helpers/Props';

import useKeyboardShortcuts from 'Helpers/Hooks/useKeyboardShortcuts';
import translate from 'Utilities/String/translate';

// General Components
import PageToolbar from 'Components/Page/Toolbar/PageToolbar';
import PageToolbarButton, {
    type PageToolbarButtonProps,
} from 'Components/Page/Toolbar/PageToolbarButton';
import PageToolbarSection from 'Components/Page/Toolbar/PageToolbarSection';

// Specific Components
import AdvancedSettingsButton from './AdvancedSettingsButton';
// import PendingChangesModal from './PendingChangesModal';

// Types
// import type { Action, Location } from 'history';
interface SettingsToolbarProps {
    showSave?: boolean;
    isSaving?: boolean;
    hasPendingChanges?: boolean;
    additionalButtons?: ReactElement<PageToolbarButtonProps> | null;
    onSavePress?: () => void;
}

// IMPLEMENTATIONS

function SettingsToolbar({
    showSave = true,
    isSaving,
    hasPendingChanges,
    additionalButtons = null,
    onSavePress,
}: SettingsToolbarProps) {
    const { bindShortcut, unbindShortcut } = useKeyboardShortcuts();

    /*
    const navigate = useNavigate();

    const [nextLocation, setNextLocation] = useState<Location | null>(null);
    const [nextLocationAction, setNextLocationAction] = useState<Action | null>(null);
    const hasConfirmed = useRef(false);

    const handleConfirmNavigation = useCallback(() => {
        if (!nextLocation) {
            return;
        }

        const path = `${nextLocation.pathname}${nextLocation.search}`;

        hasConfirmed.current = true;

        if (nextLocationAction === 'PUSH') {
            navigate(path);
        }
        else {
            // Unfortunately back and forward both use POP,
            // which means we don't actually know which direction
            // the user wanted to go, assuming back.

            navigate(-1);
        }
    }, [nextLocation, nextLocationAction, navigate]);

    const handleCancelNavigation = useCallback(() => {
        setNextLocation(null);
        setNextLocationAction(null);
        hasConfirmed.current = false;
    }, []);

    const handleRouterLeaving = useCallback<BlockerFunction>(
        ({ currentLocation, historyAction }) => {
            if (hasConfirmed.current) {
                setNextLocation(null);
                setNextLocationAction(null);
                hasConfirmed.current = false;

                return false;
            }

            if (hasPendingChanges) {
                setNextLocation(currentLocation);
                setNextLocationAction(historyAction);

                return false;
            }

            return false;
        },
        [hasPendingChanges],
    );

    const blocker = useBlocker(handleRouterLeaving);

    useEffect(() => {
        blocker.proceed?.();

        return () => {
            blocker.reset?.();
        };
    }, [blocker, handleRouterLeaving]);
    */

    useEffect(() => {
        bindShortcut(
            'saveSettings',
            () => {
                if (hasPendingChanges) {
                    onSavePress?.();
                }
            },
            {
                isGlobal: true,
            },
        );

        return () => {
            unbindShortcut('saveSettings');
        };
    }, [hasPendingChanges, bindShortcut, unbindShortcut, onSavePress]);

    return (
        <PageToolbar>
            <PageToolbarSection>
                <AdvancedSettingsButton showLabel={true} />
                {showSave ? (
                    <PageToolbarButton
                        label={
                            hasPendingChanges ? translate('SaveChanges') : translate('NoChanges')
                        }
                        iconName={icons.SAVE}
                        isSpinning={isSaving}
                        isDisabled={!hasPendingChanges}
                        onPress={onSavePress}
                    />
                ) : null}

                {additionalButtons}
            </PageToolbarSection>

            {/*
            <PendingChangesModal
                isOpen={nextLocation !== null}
                onConfirm={handleConfirmNavigation}
                onCancel={handleCancelNavigation}
            />
            */}
        </PageToolbar>
    );
}

export default SettingsToolbar;
