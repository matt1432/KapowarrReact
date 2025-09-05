// IMPORTS

// Misc
import { align } from 'Helpers/Props';
import translate from 'Utilities/String/translate';

// General Components
import MenuContent from 'Components/Menu/MenuContent';
import SortMenu from 'Components/Menu/SortMenu';
import SortMenuItem from 'Components/Menu/SortMenuItem';

// Types
import type { SortDirection } from 'Helpers/Props/sortDirections';
import type { IndexSort } from '..';

interface VolumeIndexSortMenuProps {
    sortKey?: IndexSort;
    sortDirection?: SortDirection;
    isDisabled: boolean;
    onSortSelect(sortKey: IndexSort): void;
}

// IMPLEMENTATIONS

export default function VolumeIndexSortMenu({
    sortKey,
    sortDirection,
    isDisabled,
    onSortSelect,
}: VolumeIndexSortMenuProps) {
    return (
        <SortMenu isDisabled={isDisabled} alignMenu={align.RIGHT}>
            <MenuContent>
                <SortMenuItem
                    name="title"
                    sortKey={sortKey}
                    sortDirection={sortDirection}
                    onPress={onSortSelect}
                >
                    {translate('Title')}
                </SortMenuItem>

                <SortMenuItem
                    name="year"
                    sortKey={sortKey}
                    sortDirection={sortDirection}
                    onPress={onSortSelect}
                >
                    {translate('Year')}
                </SortMenuItem>

                <SortMenuItem
                    name="volumeNumber"
                    sortKey={sortKey}
                    sortDirection={sortDirection}
                    onPress={onSortSelect}
                >
                    {translate('VolumeNumber')}
                </SortMenuItem>

                <SortMenuItem
                    name="publisher"
                    sortKey={sortKey}
                    sortDirection={sortDirection}
                    onPress={onSortSelect}
                >
                    {translate('Publisher')}
                </SortMenuItem>

                <SortMenuItem
                    name="issueCountMonitored"
                    sortKey={sortKey}
                    sortDirection={sortDirection}
                    onPress={onSortSelect}
                >
                    {translate('MissingIssues')}
                </SortMenuItem>

                <SortMenuItem
                    name="totalSize"
                    sortKey={sortKey}
                    sortDirection={sortDirection}
                    onPress={onSortSelect}
                >
                    {translate('SizeOnDisk')}
                </SortMenuItem>
            </MenuContent>
        </SortMenu>
    );
}
