// IMPORTS

// Misc
import { align } from 'Helpers/Props';

import translate from 'Utilities/String/translate';

// General Components
import MenuContent from 'Components/Menu/MenuContent';
import ViewMenu from 'Components/Menu/ViewMenu';
import ViewMenuItem from 'Components/Menu/ViewMenuItem';

// Types
import type { IndexView } from '..';

interface VolumeIndexViewMenuProps {
    view: IndexView;
    isDisabled: boolean;
    onViewSelect(value: IndexView): void;
}

// IMPLEMENTATIONS

function VolumeIndexViewMenu({ view, isDisabled, onViewSelect }: VolumeIndexViewMenuProps) {
    return (
        <ViewMenu isDisabled={isDisabled} alignMenu={align.RIGHT}>
            <MenuContent>
                <ViewMenuItem name="posters" selectedView={view} onPress={onViewSelect}>
                    {translate('Posters')}
                </ViewMenuItem>

                <ViewMenuItem name="table" selectedView={view} onPress={onViewSelect}>
                    {translate('Table')}
                </ViewMenuItem>
            </MenuContent>
        </ViewMenu>
    );
}

export default VolumeIndexViewMenu;
