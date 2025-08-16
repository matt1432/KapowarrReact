// IMPORTS

// React
import { useCallback } from 'react';

// Redux
import { useExecuteCommandMutation } from 'Store/Api/Command';
import { useGetVolumesQuery } from 'Store/Api/Volumes';

// Misc
import { commandNames, icons } from 'Helpers/Props';

import translate from 'Utilities/String/translate';

// General Components
import PageToolbarButton from 'Components/Page/Toolbar/PageToolbarButton';

// IMPLEMENTATIONS

function VolumeIndexRefreshVolumeButton() {
    const { totalItems } = useGetVolumesQuery(undefined, {
        selectFromResult: ({ data }) => ({
            totalItems: data?.length ?? 0,
        }),
    });

    const [executeCommand, { isLoading: isRefreshing }] = useExecuteCommandMutation();

    const onPress = useCallback(() => {
        executeCommand({ cmd: commandNames.UPDATE_ALL });
    }, [executeCommand]);

    return (
        <PageToolbarButton
            label={translate('UpdateAll')}
            isSpinning={isRefreshing}
            isDisabled={!totalItems}
            iconName={icons.REFRESH}
            onPress={onPress}
        />
    );
}

export default VolumeIndexRefreshVolumeButton;
