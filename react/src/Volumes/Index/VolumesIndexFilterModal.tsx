import { useCallback } from 'react';
import { useDispatch /*, useSelector*/ } from 'react-redux';
// import { createSelector } from 'reselect';
// import { type AppState } from 'App/State/AppState';
import FilterModal, { type FilterModalProps } from 'Components/Filter/FilterModal';
import { type Volumes } from 'Volumes/Volumes';
// import { setVolumesFilter } from 'Store/Actions/volumesIndexActions';

/*
function createVolumesSelector() {
    return createSelector(
        (state: AppState) => state.volumes.items,
        (volumes) => {
            return volumes;
        },
    );
}

function createFilterBuilderPropsSelector() {
    return createSelector(
        (state: AppState) => state.volumesIndex.filterBuilderProps,
        (filterBuilderProps) => {
            return filterBuilderProps;
        },
    );
}
*/

type VolumesIndexFilterModalProps = FilterModalProps<Volumes>;

export default function VolumesIndexFilterModal(props: VolumesIndexFilterModalProps) {
    // const sectionItems = useSelector(createVolumesSelector());
    // const filterBuilderProps = useSelector(createFilterBuilderPropsSelector());

    const dispatch = useDispatch();

    const dispatchSetFilter = useCallback(
        // @ts-expect-error TODO:
        // eslint-disable-next-line
        (payload: unknown) => {
            // dispatch(setVolumesFilter(payload));
        },
        [dispatch],
    );

    return (
        <FilterModal
            {...props}
            // sectionItems={sectionItems}
            // filterBuilderProps={filterBuilderProps}
            customFilterType="volumes"
            dispatchSetFilter={dispatchSetFilter}
        />
    );
}
