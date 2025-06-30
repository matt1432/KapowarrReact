import { type CustomFilter, type Filter } from 'App/State/AppState';
import FilterMenu from 'Components/Menu/FilterMenu';
import VolumesIndexFilterModal from 'Volumes/Index/VolumesIndexFilterModal';

interface VolumesIndexFilterMenuProps {
    selectedFilterKey: string | number;
    filters: Filter[];
    customFilters: CustomFilter[];
    isDisabled: boolean;
    onFilterSelect: (filter: number | string) => void;
}

function VolumesIndexFilterMenu(props: VolumesIndexFilterMenuProps) {
    const { selectedFilterKey, filters, customFilters, isDisabled, onFilterSelect } = props;

    return (
        <FilterMenu
            alignMenu="right"
            isDisabled={isDisabled}
            selectedFilterKey={selectedFilterKey}
            filters={filters}
            customFilters={customFilters}
            filterModalConnectorComponent={VolumesIndexFilterModal}
            onFilterSelect={onFilterSelect}
        />
    );
}

export default VolumesIndexFilterMenu;
