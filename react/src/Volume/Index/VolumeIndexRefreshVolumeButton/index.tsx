// IMPORTS

// React
import { useCallback, useMemo } from 'react';

// Redux
import { useRootSelector } from 'Store/createAppStore';
import { useMassEditMutation } from 'Store/Api/Command';
import { useGetVolumesQuery } from 'Store/Api/Volumes';

// Misc
import { icons, massEditActions } from 'Helpers/Props';

import translate from 'Utilities/String/translate';
import getSelectedIds from 'Utilities/Table/getSelectedIds';

// Hooks
import { useSelect } from 'App/SelectContext';

// General Components
import PageToolbarButton from 'Components/Page/Toolbar/PageToolbarButton';

// Types
import type { IndexFilter } from '..';

interface VolumeIndexRefreshVolumeButtonProps {
    isSelectMode: boolean;
    filterKey: IndexFilter;
}

// IMPLEMENTATIONS

export default function VolumeIndexRefreshVolumeButton({
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
        if (isSelectMode && selectedVolumeIds.length > 0) {
            return selectedVolumeIds;
        }

        if (filterKey !== '') {
            switch (filterKey) {
                case 'wanted': {
                    return items
                        .filter((item) => item.issuesDownloadedMonitored < item.issueCountMonitored)
                        .map((item) => item.id);
                }
                case 'monitored': {
                    return items.filter((item) => item.monitored).map((item) => item.id);
                }
            }
        }

        return items.map((m) => m.id);
    }, [isSelectMode, items, selectedVolumeIds, filterKey]);

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
