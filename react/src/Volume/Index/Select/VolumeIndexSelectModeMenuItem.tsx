// IMPORTS

// React
import { useCallback } from 'react';

// Misc
import { useSelect } from 'App/SelectContext';

// General Components
import PageToolbarOverflowMenuItem from 'Components/Page/Toolbar/PageToolbarOverflowMenuItem';

// Types
import type { IconName } from 'Components/Icon';

interface VolumeIndexSelectModeMenuItemProps {
    label: string;
    iconName: IconName;
    isSelectMode: boolean;
    onPress: () => void;
}

// IMPLEMENTATIONS

function VolumeIndexSelectModeMenuItem(props: VolumeIndexSelectModeMenuItemProps) {
    const { label, iconName, isSelectMode, onPress } = props;
    const [, selectDispatch] = useSelect();

    const onPressWrapper = useCallback(() => {
        if (isSelectMode) {
            selectDispatch({
                type: 'reset',
            });
        }

        onPress();
    }, [isSelectMode, onPress, selectDispatch]);

    return (
        <PageToolbarOverflowMenuItem label={label} iconName={iconName} onPress={onPressWrapper} />
    );
}

export default VolumeIndexSelectModeMenuItem;
