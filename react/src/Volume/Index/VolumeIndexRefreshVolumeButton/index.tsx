// IMPORTS

// React
import { useCallback, useMemo } from 'react';

// Redux
import { useMassEditMutation } from 'Store/Api/Command';
import { useGetVolumesQuery } from 'Store/Api/Volumes';

// Misc
import { icons, massEditActions } from 'Helpers/Props';
import { useSelect } from 'App/SelectContext';

import translate from 'Utilities/String/translate';
import getSelectedIds from 'Utilities/Table/getSelectedIds';

// General Components
import PageToolbarButton from 'Components/Page/Toolbar/PageToolbarButton';
import { useRootSelector } from 'Store/createAppStore';

// Types
interface VolumeIndexRefreshVolumeButtonProps {
    isSelectMode: boolean;
    filterKey: string;
}

// IMPLEMENTATIONS

function VolumeIndexRefreshVolumeButton({
    isSelectMode,
    filterKey,
}: VolumeIndexRefreshVolumeButtonProps) {
    const { isRunning: isRefreshing } = useRootSelector(
        (state) => state.socketEvents.massEditorStatus.update,
    );

    const { items, totalItems } = useGetVolumesQuery(undefined, {
        selectFromResult: ({ data }) => ({
            items: data ?? [],
            totalItems: data?.length ?? 0,
        }),
    });

    const [{ selectedState }] = useSelect();

    const selectedVolumeIds = useMemo(() => {
        return getSelectedIds(selectedState);
    }, [selectedState]);

    const volumesToRefresh = useMemo(() => {
        return isSelectMode && selectedVolumeIds.length > 0
            ? selectedVolumeIds
            : items.map((m) => m.id);
    }, [isSelectMode, items, selectedVolumeIds]);

    const refreshLabel = useMemo(() => {
        if (selectedVolumeIds.length > 0) {
            return translate('UpdateSelected');
        }
        else if (filterKey !== '') {
            return translate('UpdateFiltered');
        }

        return translate('UpdateAll');
    }, [filterKey, selectedVolumeIds.length]);

    const [runMassEditAction] = useMassEditMutation();

    const onPress = useCallback(() => {
        runMassEditAction({
            action: massEditActions.UPDATE,
            volumeIds: volumesToRefresh,
        });
    }, [runMassEditAction, volumesToRefresh]);

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
