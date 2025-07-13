import { useCallback } from 'react';
import { useSelect } from 'App/SelectContext';
import PageToolbarButton, {
    type PageToolbarButtonProps,
} from 'Components/Page/Toolbar/PageToolbarButton';

interface VolumeIndexSelectModeButtonProps extends PageToolbarButtonProps {
    isSelectMode: boolean;
    onPress: () => void;
}

function VolumeIndexSelectModeButton(props: VolumeIndexSelectModeButtonProps) {
    const { label, iconName, isSelectMode, overflowComponent, onPress } = props;
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
