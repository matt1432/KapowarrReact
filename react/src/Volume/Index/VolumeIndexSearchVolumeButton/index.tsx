// IMPORTS

// React
import { useCallback, useMemo } from 'react';

// Redux
import { useRootSelector } from 'Store/createAppStore';

import { useMassEditMutation } from 'Store/Api/Command';
import { useGetVolumesQuery } from 'Store/Api/Volumes';

// Misc
import { icons, massEditActions } from 'Helpers/Props';
import { useSelect } from 'App/SelectContext';

import translate from 'Utilities/String/translate';
import getSelectedIds from 'Utilities/Table/getSelectedIds';

// General Components
import PageToolbarButton from 'Components/Page/Toolbar/PageToolbarButton';

// Types
interface VolumeIndexSearchVolumeButtonProps {
    isSelectMode: boolean;
    filterKey: string;
}

// IMPLEMENTATIONS

export default function VolumeIndexSearchVolumeButton({
    isSelectMode,
    filterKey,
}: VolumeIndexSearchVolumeButtonProps) {
    const { isRunning: isSearching } = useRootSelector(
        (state) => state.socketEvents.massEditorStatus.search,
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

    const volumesToSearch = useMemo(() => {
        return isSelectMode && selectedVolumeIds.length > 0
            ? selectedVolumeIds
            : items.map((m) => m.id);
    }, [isSelectMode, items, selectedVolumeIds]);

    const searchLabel = useMemo(() => {
        if (selectedVolumeIds.length > 0) {
            return translate('SearchSelected');
        }
        else if (filterKey !== '') {
            return translate('SearchFiltered');
        }

        return translate('SearchAll');
    }, [filterKey, selectedVolumeIds.length]);

    const [runMassEditAction] = useMassEditMutation();

    const onPress = useCallback(() => {
        runMassEditAction({
            action: massEditActions.SEARCH,
            volumeIds: volumesToSearch,
        });
    }, [runMassEditAction, volumesToSearch]);

    return (
        <PageToolbarButton
            label={searchLabel}
            isSpinning={isSearching}
            isDisabled={!totalItems}
            iconName={icons.SEARCH}
            onPress={onPress}
        />
    );
}
