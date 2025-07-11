import { useCallback, useMemo } from 'react';
import { useDispatch /*, useSelector */ } from 'react-redux';
import { useSelect } from 'App/SelectContext';
// import { type ClientSideCollectionAppState } from 'App/State/ClientSideCollectionAppState';
// import type { VolumesAppState, VolumesIndexAppState } from 'App/State/VolumesAppState';
// import { REFRESH_VOLUMES } from 'Commands/commandNames';
import PageToolbarButton from 'Components/Page/Toolbar/PageToolbarButton';
import { icons } from 'Helpers/Props';
// import { executeCommand } from 'Store/Actions/commandActions';
// import createCommandExecutingSelector from 'Store/Selectors/createCommandExecutingSelector';
// import createVolumesClientSideCollectionItemsSelector from 'Store/Selectors/createVolumesClientSideCollectionItemsSelector';
import translate from 'Utilities/String/translate';
import getSelectedIds from 'Utilities/Table/getSelectedIds';
import type { Volume } from 'Volumes/Volumes';

interface VolumesIndexRefreshVolumesButtonProps {
    isSelectMode: boolean;
    selectedFilterKey: string;
}

function VolumesIndexRefreshVolumesButton(props: VolumesIndexRefreshVolumesButtonProps) {
    /*
    const isRefreshing = useSelector(createCommandExecutingSelector(REFRESH_VOLUMES));

    const {
        items,
        totalItems,
    }: VolumesAppState & VolumesIndexAppState & ClientSideCollectionAppState = useSelector(
        createVolumesClientSideCollectionItemsSelector('volumesIndex'),
    );
    */
    const isRefreshing = false;
    const items = [] as Volume[];
    const totalItems = 0;

    const dispatch = useDispatch();
    const { isSelectMode, selectedFilterKey } = props;
    const [selectState] = useSelect();
    const { selectedState } = selectState;

    const selectedVolumesIds = useMemo(() => {
        return getSelectedIds(selectedState);
    }, [selectedState]);

    const volumesToRefresh =
        isSelectMode && selectedVolumesIds.length > 0 ? selectedVolumesIds : items.map((m) => m.id);

    let refreshLabel = translate('UpdateAll');

    if (selectedVolumesIds.length > 0) {
        refreshLabel = translate('UpdateSelected');
    }
    else if (selectedFilterKey !== 'all') {
        refreshLabel = translate('UpdateFiltered');
    }

    const onPress = useCallback(() => {
        /*
        dispatch(
            executeCommand({
                name: REFRESH_VOLUMES,
                volumesIds: volumesToRefresh,
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

export default VolumesIndexRefreshVolumesButton;
