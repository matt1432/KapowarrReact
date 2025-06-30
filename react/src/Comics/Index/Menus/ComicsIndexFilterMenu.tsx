import { type CustomFilter, type Filter } from 'App/State/AppState';
import FilterMenu from 'Components/Menu/FilterMenu';
import ComicsIndexFilterModal from 'Comics/Index/ComicsIndexFilterModal';

interface ComicsIndexFilterMenuProps {
    selectedFilterKey: string | number;
    filters: Filter[];
    customFilters: CustomFilter[];
    isDisabled: boolean;
    onFilterSelect: (filter: number | string) => void;
}

function ComicsIndexFilterMenu(props: ComicsIndexFilterMenuProps) {
    const { selectedFilterKey, filters, customFilters, isDisabled, onFilterSelect } = props;

    return (
        <FilterMenu
            alignMenu="right"
            isDisabled={isDisabled}
            selectedFilterKey={selectedFilterKey}
            filters={filters}
            customFilters={customFilters}
            filterModalConnectorComponent={ComicsIndexFilterModal}
            onFilterSelect={onFilterSelect}
        />
    );
}

export default ComicsIndexFilterMenu;
