import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { type AppState } from 'App/State/AppState';
import FilterModal, { type FilterModalProps } from 'Components/Filter/FilterModal';
import { type Comics } from 'Comics/Comics';
// import { setComicsFilter } from 'Store/Actions/comicsIndexActions';

function createComicsSelector() {
    return createSelector(
        (state: AppState) => state.comics.items,
        (comics) => {
            return comics;
        },
    );
}

function createFilterBuilderPropsSelector() {
    return createSelector(
        (state: AppState) => state.comicsIndex.filterBuilderProps,
        (filterBuilderProps) => {
            return filterBuilderProps;
        },
    );
}

type ComicsIndexFilterModalProps = FilterModalProps<Comics>;

export default function ComicsIndexFilterModal(props: ComicsIndexFilterModalProps) {
    const sectionItems = useSelector(createComicsSelector());
    const filterBuilderProps = useSelector(createFilterBuilderPropsSelector());

    const dispatch = useDispatch();

    const dispatchSetFilter = useCallback(
        // @ts-expect-error TODO:
        // eslint-disable-next-line
        (payload: unknown) => {
            // dispatch(setComicsFilter(payload));
        },
        [dispatch],
    );

    return (
        <FilterModal
            {...props}
            sectionItems={sectionItems}
            filterBuilderProps={filterBuilderProps}
            customFilterType="comics"
            dispatchSetFilter={dispatchSetFilter}
        />
    );
}
