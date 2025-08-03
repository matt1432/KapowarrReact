// IMPORTS

// React
import { useCallback } from 'react';

// Misc
import { useSelect } from 'App/SelectContext';

// General Components
import PageToolbarButton, {
    type PageToolbarButtonProps,
} from 'Components/Page/Toolbar/PageToolbarButton';

// Types
interface VolumeIndexSelectModeButtonProps extends PageToolbarButtonProps {
    isSelectMode: boolean;
    onPress: () => void;
}

// IMPLEMENTATIONS

function VolumeIndexSelectModeButton({
    label,
    iconName,
    isSelectMode,
    overflowComponent,
    onPress,
}: VolumeIndexSelectModeButtonProps) {
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
        <PageToolbarButton
            label={label}
            iconName={iconName}
            overflowComponent={overflowComponent}
            onPress={onPressWrapper}
        />
    );
}

export default VolumeIndexSelectModeButton;
