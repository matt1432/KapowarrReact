// import type { CustomFilter, Filter } from 'App/State/AppState';

export default function findSelectedFilters(
    selectedFilterKey: string | number,
    // eslint-disable-next-line
    filters: any[] = [],
    // eslint-disable-next-line
    customFilters: any[] = [],
) {
    if (!selectedFilterKey) {
        return [];
    }

    // eslint-disable-next-line
    let selectedFilter: any /*Filter | CustomFilter*/ | undefined = filters.find(
        (f) => f.key === selectedFilterKey,
    );

    if (!selectedFilter) {
        selectedFilter = customFilters.find((f) => f.id === selectedFilterKey);
    }

    if (!selectedFilter) {
        // TODO: throw in dev
        console.error('Matching filter not found');
        return [];
    }

    return selectedFilter.filters;
}
