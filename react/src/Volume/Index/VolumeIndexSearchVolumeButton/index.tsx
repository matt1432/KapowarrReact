// IMPORTS

// React
import { useCallback, useMemo, useState } from 'react';

// Redux
import { useMassEditMutation } from 'Store/Api/Command';
import { useGetVolumesQuery } from 'Store/Api/Volumes';

// Misc
import { icons, massEditActions } from 'Helpers/Props';
import { useSelect } from 'App/SelectContext';

import useSocketEvents from 'Helpers/Hooks/useSocketEvents';
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

function VolumeIndexSearchVolumeButton({
    isSelectMode,
    filterKey,
}: VolumeIndexSearchVolumeButtonProps) {
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

    const [isSearching, setIsSearching] = useState(false);
    const [runMassEditAction] = useMassEditMutation();

    const onPress = useCallback(() => {
        runMassEditAction({
            action: massEditActions.SEARCH,
            volumeIds: volumesToSearch,
        });
    }, [runMassEditAction, volumesToSearch]);

    useSocketEvents({
        mass_editor_status: ({ identifier, current_item, total_items }) => {
            if (identifier === massEditActions.SEARCH) {
                setIsSearching(current_item !== total_items);
            }
        },
    });

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

export default VolumeIndexSearchVolumeButton;
