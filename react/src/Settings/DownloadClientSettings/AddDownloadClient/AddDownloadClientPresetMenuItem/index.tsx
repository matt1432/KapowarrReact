// TODO:
import { useCallback } from 'react';
import MenuItem from 'Components/Menu/MenuItem';
// import { selectDownloadClientSchema } from 'Store/Actions/settingsActions';

interface AddDownloadClientPresetMenuItemProps {
    name: string;
    implementation: string;
    implementationName: string;
    onPress: () => void;
}

function AddDownloadClientPresetMenuItem({
    name,
    implementation,
    implementationName,
    onPress,
    ...otherProps
}: AddDownloadClientPresetMenuItemProps) {
    const handlePress = useCallback(() => {
        /*
        selectDownloadClientSchema({
            implementation,
            implementationName,
            presetName: name,
        });*/

        onPress();
    }, [name, implementation, implementationName, onPress]);

    return (
        <MenuItem {...otherProps} onPress={handlePress}>
            {name}
        </MenuItem>
    );
}

export default AddDownloadClientPresetMenuItem;
