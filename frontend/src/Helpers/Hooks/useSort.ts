// IMPORTS

// React
import { useMemo } from 'react';

// Misc
import { sortDirections } from 'Helpers/Props';

// Types
import type { Column } from 'Components/Table/Column';
import type { SortDirection } from 'Helpers/Props/sortDirections';
import type { ExtendableRecord } from 'typings/Misc';

export type Predicates<T, ColumnName extends string> = Partial<
    Record<ColumnName, (a: T, b: T) => number>
>;

export type Item<ColumnName extends string> = ExtendableRecord<ColumnName>;

interface UseSortProps<ColumnName extends string, T extends Item<ColumnName>> {
    columns: Column<ColumnName>[];
    items: T[];

    predicates?: Predicates<T, ColumnName>;

    sortKey?: ColumnName | null;
    sortDirection?: SortDirection | null;
    secondarySortKey?: ColumnName | null;
    secondarySortDirection?: SortDirection | null;
}

// IMPLEMENTATIONS

function predicatesToSorters<
    ColumnName extends string,
    T extends Item<ColumnName>,
>(columns: Column<ColumnName>[], predicates: Predicates<T, ColumnName>) {
    const predicateKeys = Object.keys(predicates);
    const missingSortableColumns: ColumnName[] = columns
        .filter((c) => c.isSortable && !predicateKeys.includes(c.name))
        .map((c) => c.name);

    const defaultPredicates = missingSortableColumns.map((key) => [
        key,
        (a: T, b: T) => {
            const aIsNull = typeof a[key] === 'undefined' || a[key] === null;
            const bIsNull = typeof b[key] === 'undefined' || b[key] === null;

            if (aIsNull && bIsNull) {
                return 0;
            }
            else if (aIsNull && !bIsNull) {
                return -1;
            }
            else if (bIsNull && !aIsNull) {
                return 1;
            }

            switch (typeof a[key]) {
                case 'number': {
                    return a[key] - b[key];
                }
                case 'string': {
                    return a[key].localeCompare(b[key]);
                }
                case 'boolean': {
                    return Number(a[key]) - Number(b[key]);
                }
                default: {
                    throw new TypeError(
                        `Property '${key}' is a complex type and cannot be sorted with the default predicates`,
                    );
                }
            }
        },
    ]);
    return Object.fromEntries(
        (
            [...Object.entries(predicates), ...defaultPredicates] as [
                ColumnName,
                (a: T, b: T) => number,
            ][]
        ).map(([key, func]) => [
            key,
            (sortDirection: SortDirection) => {
                return (a: T, b: T) =>
                    sortDirection === sortDirections.ASCENDING
                        ? func(a, b)
                        : func(b, a);
            },
        ]),
    ) as Partial<
        Record<
            ColumnName,
            (sortDirection: SortDirection) => (a: T, b: T) => number
        >
    >;
}

export default function useSort<
    ColumnName extends string,
    T extends Item<ColumnName>,
>({
    columns,
    items,
    predicates = {},
    sortKey,
    sortDirection = sortDirections.ASCENDING,
    secondarySortKey,
    secondarySortDirection,
}: UseSortProps<ColumnName, T>) {
    const sorters = useMemo(
        () => predicatesToSorters(columns, predicates),
        [columns, predicates],
    );

    return useMemo(
        () =>
            items.toSorted(
                (a, b) =>
                    (sorters[sortKey]?.(
                        sortDirection ?? sortDirections.ASCENDING,
                    )(a, b) ||
                        sorters[secondarySortKey]?.(
                            secondarySortDirection ?? sortDirections.ASCENDING,
                        )(a, b)) ??
                    0,
            ),
        [
            items,
            sorters,
            sortKey,
            sortDirection,
            secondarySortKey,
            secondarySortDirection,
        ],
    );
}
