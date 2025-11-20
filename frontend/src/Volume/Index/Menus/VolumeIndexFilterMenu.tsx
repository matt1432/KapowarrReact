// IMPORTS

// Misc
import { align } from 'Helpers/Props';

import translate from 'Utilities/String/translate';

// General Components
import MenuContent from 'Components/Menu/MenuContent';
import FilterMenu from 'Components/Menu/FilterMenu';
import FilterMenuItem from 'Components/Menu/FilterMenuItem';

// Types
import type { IndexFilter } from '..';

interface VolumeIndexFilterMenuProps {
    filterKey: IndexFilter;
    isDisabled: boolean;
    onFilterSelect(value: IndexFilter): void;
}

// IMPLEMENTATIONS

export default function VolumeIndexFilterMenu({
    filterKey,
    isDisabled,
    onFilterSelect,
}: VolumeIndexFilterMenuProps) {
    return (
        <FilterMenu isDisabled={isDisabled} alignMenu={align.RIGHT}>
            <MenuContent>
                <FilterMenuItem
                    name=""
                    filterKey={filterKey}
                    onPress={onFilterSelect}
                >
                    {translate('All')}
                </FilterMenuItem>

                <FilterMenuItem
                    name="monitored"
                    filterKey={filterKey}
                    onPress={onFilterSelect}
                >
                    {translate('MonitoredOnly')}
                </FilterMenuItem>

                <FilterMenuItem
                    name="unmonitored"
                    filterKey={filterKey}
                    onPress={onFilterSelect}
                >
                    {translate('UnmonitoredOnly')}
                </FilterMenuItem>

                <FilterMenuItem
                    name="continuing"
                    filterKey={filterKey}
                    onPress={onFilterSelect}
                >
                    {translate('ContinuingOnly')}
                </FilterMenuItem>

                <FilterMenuItem
                    name="ended"
                    filterKey={filterKey}
                    onPress={onFilterSelect}
                >
                    {translate('EndedOnly')}
                </FilterMenuItem>

                <FilterMenuItem
                    name="wanted"
                    filterKey={filterKey}
                    onPress={onFilterSelect}
                >
                    {translate('Wanted')}
                </FilterMenuItem>
            </MenuContent>
        </FilterMenu>
    );
}
