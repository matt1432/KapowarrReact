import _ from 'lodash';
import { createSelector } from 'reselect';
import { filterTypes, sortDirections } from 'Helpers/Props';
import getFilterTypePredicate from 'Helpers/Props/getFilterTypePredicate';
import findSelectedFilters from 'Utilities/Filter/findSelectedFilters';
import type { SortDirection } from 'Helpers/Props/sortDirections';
import type { AppState, CustomFilter, Filter } from 'App/State/AppState';
import type { DateFilterValue, FilterType } from 'Helpers/Props/filterTypes';

interface SortState<T> {
    sortKey: keyof T;
    sortDirection: SortDirection;
    sortPredicates: Partial<Record<keyof T, (item: T, sortDirection: SortDirection) => number>>;
    secondarySortKey: keyof T;
    secondarySortDirection: SortDirection;
}

interface FilterState<T> {
    selectedFilterKey: keyof T;
    filters: Filter[];
    customFilters: CustomFilter[];
    filterPredicates: Partial<{
        [K in keyof T]: (
            item: T,
            value: string | number | boolean | DateFilterValue,
            type: FilterType,
        ) => boolean;
    }>;
}

function getSortClause<T>(
    sortKey: SortState<T>['sortKey'],
    sortDirection: SortState<T>['sortDirection'],
    sortPredicates: SortState<T>['sortPredicates'],
) {
    if (sortPredicates && Object.prototype.hasOwnProperty.call(sortPredicates, sortKey)) {
        return function (item: T) {
            return sortPredicates[sortKey]!(item, sortDirection);
        };
    }

    return function (item: T) {
        return item[sortKey];
    };
}

function filter<T>(items: T[], state: FilterState<T>) {
    const { selectedFilterKey, filters, customFilters, filterPredicates } = state;

    if (!selectedFilterKey) {
        return items;
    }

    const selectedFilters = findSelectedFilters(
        selectedFilterKey as string,
        filters,
        customFilters,
    );

    return _.filter(items, (item) => {
        let i = 0;
        let accepted = true;

        while (accepted && i < selectedFilters.length) {
            const { key: _key, value, type = filterTypes.EQUAL } = selectedFilters[i];
            const key = _key as keyof T;

            if (filterPredicates && Object.prototype.hasOwnProperty.call(filterPredicates, _key)) {
                const predicate = filterPredicates[key]!;

                if (Array.isArray(value)) {
                    if (type === filterTypes.NOT_CONTAINS || type === filterTypes.NOT_EQUAL) {
                        accepted = value.every((v) => predicate(item, v, type));
                    }
                    else {
                        accepted = value.some((v) => predicate(item, v, type));
                    }
                }
                else {
                    accepted = predicate(item, value, type);
                }
            }
            else if (Object.prototype.hasOwnProperty.call(item, key)) {
                const predicate = getFilterTypePredicate(type);

                if (Array.isArray(value)) {
                    if (type === filterTypes.NOT_CONTAINS || type === filterTypes.NOT_EQUAL) {
                        accepted = value.every((v) => predicate(item[key], v));
                    }
                    else {
                        accepted = value.some((v) => predicate(item[key], v));
                    }
                }
                else {
                    accepted = predicate(item[key], value);
                }
            }
            else {
                // Default to false if the filter can't be tested
                accepted = false;
            }

            i++;
        }

        return accepted;
    });
}

function sort<T>(items: T[], state: SortState<T>) {
    const { sortKey, sortDirection, sortPredicates, secondarySortKey, secondarySortDirection } =
        state;

    const clauses = [];
    const orders = [] as (boolean | 'asc' | 'desc')[];

    clauses.push(getSortClause(sortKey, sortDirection, sortPredicates));
    orders.push(sortDirection === sortDirections.ASCENDING ? 'asc' : 'desc');

    if (
        secondarySortKey &&
        secondarySortDirection &&
        (sortKey !== secondarySortKey || sortDirection !== secondarySortDirection)
    ) {
        clauses.push(getSortClause(secondarySortKey, secondarySortDirection, sortPredicates));
        orders.push(secondarySortDirection === sortDirections.ASCENDING ? 'asc' : 'desc');
    }

    return _.orderBy(items, clauses, orders);
}

export function createCustomFiltersSelector(type: string, alternateType: string) {
    return createSelector(
        (state: AppState) => state.customFilters.items,
        (customFilters) => {
            return customFilters.filter((customFilter) => {
                return customFilter.type === type || customFilter.type === alternateType;
            });
        },
    );
}

export default function createClientSideCollectionSelector(section: string, uiSection: string) {
    return createSelector(
        (state: AppState) => _.get(state, section),
        (state) => _.get(state, uiSection),
        createCustomFiltersSelector(section, uiSection),
        (sectionState, uiSectionState = {}, customFilters) => {
            const state = Object.assign({}, sectionState, uiSectionState, { customFilters });

            const filtered = filter(state.items, state);
            const sorted = sort(filtered, state);

            return {
                ...sectionState,
                ...uiSectionState,
                customFilters,
                items: sorted,
                totalItems: state.items.length,
            };
        },
    );
}
