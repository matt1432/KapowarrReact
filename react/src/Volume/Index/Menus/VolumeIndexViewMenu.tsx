import MenuContent from 'Components/Menu/MenuContent';
import ViewMenu from 'Components/Menu/ViewMenu';
import ViewMenuItem from 'Components/Menu/ViewMenuItem';
import { align } from 'Helpers/Props';
import translate from 'Utilities/String/translate';
import type { IndexView } from '..';

interface VolumeIndexViewMenuProps {
    view: IndexView;
    isDisabled: boolean;
    onViewSelect(value: IndexView): void;
}

function VolumeIndexViewMenu(props: VolumeIndexViewMenuProps) {
    const { view, isDisabled, onViewSelect } = props;

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
