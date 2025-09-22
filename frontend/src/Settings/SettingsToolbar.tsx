// IMPORTS

// React
import { type ReactElement, useCallback, useEffect, useRef } from 'react';
import { useBlocker } from 'react-router-dom';

// Misc
import { icons } from 'Helpers/Props';

import translate from 'Utilities/String/translate';

// Hooks
import useKeyboardShortcuts from 'Helpers/Hooks/useKeyboardShortcuts';

// General Components
import PageToolbar from 'Components/Page/Toolbar/PageToolbar';
import PageToolbarButton from 'Components/Page/Toolbar/PageToolbarButton';
import PageToolbarSection from 'Components/Page/Toolbar/PageToolbarSection';

// Specific Components
import PendingChangesModal from './PendingChangesModal';

// Types
import type { BlockerFunction } from 'react-router-dom';
import type { PageToolbarButtonProps } from 'Components/Page/Toolbar/PageToolbarButton';

interface SettingsToolbarProps {
    showSave?: boolean;
    isSaving?: boolean;
    hasPendingChanges?: boolean;
    additionalButtons?: ReactElement<PageToolbarButtonProps> | null;
    onSavePress?: () => void;
}

// IMPLEMENTATIONS

export default function SettingsToolbar({
    showSave = true,
    isSaving,
    hasPendingChanges,
    additionalButtons = null,
    onSavePress,
}: SettingsToolbarProps) {
    const { bindShortcut, unbindShortcut } = useKeyboardShortcuts();

    const hasConfirmed = useRef(false);

    const handleRouterLeaving = useCallback<BlockerFunction>(() => {
        if (hasConfirmed.current) {
            hasConfirmed.current = false;

            return true;
        }

        if (hasPendingChanges) {
            return true;
        }

        return false;
    }, [hasPendingChanges]);

    const blocker = useBlocker(handleRouterLeaving);

    const handleConfirmNavigation = useCallback(() => {
        blocker.proceed?.();
    }, [blocker]);

    const handleCancelNavigation = useCallback(() => {
        blocker.reset?.();
        hasConfirmed.current = false;
    }, [blocker]);

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

            <PendingChangesModal
                isOpen={blocker.state === 'blocked'}
                onConfirm={handleConfirmNavigation}
                onCancel={handleCancelNavigation}
            />
        </PageToolbar>
    );
}
