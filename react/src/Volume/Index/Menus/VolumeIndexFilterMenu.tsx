import MenuContent from 'Components/Menu/MenuContent';
import FilterMenu from 'Components/Menu/FilterMenu';
import FilterMenuItem from 'Components/Menu/FilterMenuItem';
import { align } from 'Helpers/Props';
import translate from 'Utilities/String/translate';
import type { IndexFilter } from '..';

interface VolumeIndexFilterMenuProps {
    filterKey: IndexFilter;
    isDisabled: boolean;
    onFilterSelect(value: IndexFilter): void;
}

function VolumeIndexFilterMenu({
    filterKey,
    isDisabled,
    onFilterSelect,
}: VolumeIndexFilterMenuProps) {
    return (
        <FilterMenu isDisabled={isDisabled} alignMenu={align.RIGHT}>
            <MenuContent>
                <FilterMenuItem name="" filterKey={filterKey} onPress={onFilterSelect}>
                    {translate('All')}
                </FilterMenuItem>

                <FilterMenuItem name="wanted" filterKey={filterKey} onPress={onFilterSelect}>
                    {translate('Wanted')}
                </FilterMenuItem>

                <FilterMenuItem name="monitored" filterKey={filterKey} onPress={onFilterSelect}>
                    {translate('Monitored')}
                </FilterMenuItem>
            </MenuContent>
        </FilterMenu>
    );
}

export default VolumeIndexFilterMenu;
