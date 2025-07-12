import MenuContent from 'Components/Menu/MenuContent';
import SortMenu from 'Components/Menu/SortMenu';
import SortMenuItem from 'Components/Menu/SortMenuItem';
import { align } from 'Helpers/Props';
import { type SortDirection } from 'Helpers/Props/sortDirections';
import translate from 'Utilities/String/translate';
import type { IndexSort } from '..';

interface VolumesIndexSortMenuProps {
    sortKey?: IndexSort;
    sortDirection?: SortDirection;
    isDisabled: boolean;
    onSortSelect(sortKey: IndexSort): void;
}

function VolumesIndexSortMenu(props: VolumesIndexSortMenuProps) {
    const { sortKey, sortDirection, isDisabled, onSortSelect } = props;

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
                    name="volume_number"
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
                    name="wanted"
                    sortKey={sortKey}
                    sortDirection={sortDirection}
                    onPress={onSortSelect}
                >
                    {translate('MonitoredStatus')}
                </SortMenuItem>

                <SortMenuItem
                    name="total_size"
                    sortKey={sortKey}
                    sortDirection={sortDirection}
                    onPress={onSortSelect}
                >
                    {translate('SizeOnDisk')}
                </SortMenuItem>

                <SortMenuItem
                    name="folder"
                    sortKey={sortKey}
                    sortDirection={sortDirection}
                    onPress={onSortSelect}
                >
                    {translate('FolderPath')}
                </SortMenuItem>
            </MenuContent>
        </SortMenu>
    );
}

export default VolumesIndexSortMenu;
