// IMPORTS

// React
import { type ReactElement, useCallback, useEffect, useRef } from 'react';

// Misc
import { useBlocker } from 'react-router-dom';

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
import PendingChangesModal from './PendingChangesModal';

// Types
import type { BlockerFunction } from 'react-router-dom';

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

            <PendingChangesModal
                isOpen={blocker.state === 'blocked'}
                onConfirm={handleConfirmNavigation}
                onCancel={handleCancelNavigation}
            />
        </PageToolbar>
    );
}

export default SettingsToolbar;
