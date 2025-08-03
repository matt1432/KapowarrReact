// TODO:
// IMPORTS

// React
import { useCallback, useMemo } from 'react';

// Redux
import { useDispatch /*, useSelector */ } from 'react-redux';
// import { executeCommand } from 'Store/Actions/commandActions';
// import createCommandExecutingSelector from 'Store/Selectors/createCommandExecutingSelector';
// import createVolumeClientSideCollectionItemsSelector from 'Store/Selectors/createVolumeClientSideCollectionItemsSelector';

// Misc
import { useSelect } from 'App/SelectContext';
import { icons } from 'Helpers/Props';

import translate from 'Utilities/String/translate';
import getSelectedIds from 'Utilities/Table/getSelectedIds';

// General Components
import PageToolbarButton from 'Components/Page/Toolbar/PageToolbarButton';

// Types
import type { Volume } from 'Volume/Volume';

interface VolumeIndexRefreshVolumeButtonProps {
    isSelectMode: boolean;
    filterKey: string;
}

// IMPLEMENTATIONS

function VolumeIndexRefreshVolumeButton({
    isSelectMode,
    filterKey,
}: VolumeIndexRefreshVolumeButtonProps) {
    /*
    const isRefreshing = useSelector(createCommandExecutingSelector(REFRESH_VOLUMES));

    const {
        items,
        totalItems,
    }: VolumeAppState & VolumeIndexAppState & ClientSideCollectionAppState = useSelector(
        createVolumeClientSideCollectionItemsSelector('volumeIndex'),
    );
    */
    const isRefreshing = false;
    const items = [] as Volume[];
    const totalItems = 0;

    const dispatch = useDispatch();
    const [selectState] = useSelect();
    const { selectedState } = selectState;

    const selectedVolumeIds = useMemo(() => {
        return getSelectedIds(selectedState);
    }, [selectedState]);

    const volumesToRefresh =
        isSelectMode && selectedVolumeIds.length > 0 ? selectedVolumeIds : items.map((m) => m.id);

    let refreshLabel = translate('UpdateAll');

    if (selectedVolumeIds.length > 0) {
        refreshLabel = translate('UpdateSelected');
    }
    else if (filterKey !== 'all') {
        refreshLabel = translate('UpdateFiltered');
    }

    const onPress = useCallback(() => {
        /*
        dispatch(
            executeCommand({
                name: REFRESH_VOLUMES,
                volumeIds: volumesToRefresh,
            }),
        );*/
    }, [dispatch, volumesToRefresh]);

    return (
        <PageToolbarButton
            label={refreshLabel}
            isSpinning={isRefreshing}
            isDisabled={!totalItems}
            iconName={icons.REFRESH}
            onPress={onPress}
        />
    );
}

export default VolumeIndexRefreshVolumeButton;
