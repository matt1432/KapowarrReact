// IMPORTS

// React
import { useCallback } from 'react';

// Misc
import { useSelect } from 'App/SelectContext';
import { icons } from 'Helpers/Props';

import translate from 'Utilities/String/translate';

// General Components
import PageToolbarOverflowMenuItem from 'Components/Page/Toolbar/PageToolbarOverflowMenuItem';

// Types
interface VolumeIndexSelectAllMenuItemProps {
    label: string;
    isSelectMode: boolean;
}

// IMPLEMENTATIONS

function VolumeIndexSelectAllMenuItem(props: VolumeIndexSelectAllMenuItemProps) {
    const { isSelectMode } = props;
    const [selectState, selectDispatch] = useSelect();
    const { allSelected, allUnselected } = selectState;

    let iconName = icons.SQUARE_MINUS;

    if (allSelected) {
        iconName = icons.CHECK_SQUARE;
    }
    else if (allUnselected) {
        iconName = icons.SQUARE;
    }

    const onPressWrapper = useCallback(() => {
        selectDispatch({
            type: allSelected ? 'unselectAll' : 'selectAll',
        });
    }, [allSelected, selectDispatch]);

    return isSelectMode ? (
        <PageToolbarOverflowMenuItem
            label={allSelected ? translate('UnselectAll') : translate('SelectAll')}
            iconName={iconName}
            onPress={onPressWrapper}
        />
    ) : null;
}

export default VolumeIndexSelectAllMenuItem;
