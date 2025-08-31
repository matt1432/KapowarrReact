// IMPORTS

// React
import React, { useMemo } from 'react';

// Misc
import { sortDirections } from 'Helpers/Props';

// Specific Components
import Table from './Table';
import TableBody from './TableBody';

// Types
import type { TableProps } from './Table';
import type { Column } from './Column';
import type { SortDirection } from 'Helpers/Props/sortDirections';

type Predicates<T, ColumnName extends string> = Partial<Record<ColumnName, (a: T, b: T) => number>>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Item<ColumnName extends string> = Record<ColumnName, any>;

interface SortedTableProps<ColumnName extends string, T extends Item<ColumnName>> {
    columns: Column<ColumnName>[];
    items: T[];
    itemRenderer: (item: T) => React.ReactElement;

    predicates?: Predicates<T, ColumnName>;

    sortKey?: ColumnName;
    secondarySortKey?: ColumnName;
    sortDirection?: SortDirection;
    onSortPress?: (name: ColumnName, sortDirection?: SortDirection) => void;

    tableProps?: Omit<
        TableProps<ColumnName>,
        'columns' | 'sortKey' | 'sortDirection' | 'children' | 'onSortPress'
    >;
}

// IMPLEMENTATIONS

function predicatesToSorters<ColumnName extends string, T extends Item<ColumnName>>(
    columns: Column<ColumnName>[],
    predicates: Predicates<T, ColumnName>,
) {
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
                        `Property '${key}' is a complex type and cannot be sorted with the default predicate`,
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
            (sortDirection: SortDirection, secondarySorter?: (a: T, b: T) => number) => {
                return (a: T, b: T) => {
                    const firstSort =
                        sortDirection === sortDirections.ASCENDING ? func(a, b) : func(b, a);

                    if (firstSort === 0 && secondarySorter) {
                        return sortDirection === sortDirections.ASCENDING
                            ? secondarySorter(a, b)
                            : secondarySorter(b, a);
                    }

                    return firstSort;
                };
            },
        ]),
    ) as Partial<
        Record<
            ColumnName,
            (
                sortDirection: SortDirection,
                secondarySorter?: (a: T, b: T) => number,
            ) => (a: T, b: T) => number
        >
    >;
}

export default function SortedTable<ColumnName extends string, T extends Item<ColumnName>>({
    columns,
    items,
    itemRenderer,
    predicates = {},
    sortKey,
    secondarySortKey = sortKey,
    sortDirection = sortDirections.ASCENDING,
    onSortPress,
    tableProps,
}: SortedTableProps<ColumnName, T>) {
    const sorters = useMemo(() => predicatesToSorters(columns, predicates), [columns, predicates]);
    const secondarySorter = useMemo(() => {
        return sortKey === secondarySortKey
            ? undefined
            : sorters[secondarySortKey]?.(sortDirection);
    }, [sortKey, secondarySortKey, sortDirection, sorters]);

    return (
        <Table
            columns={columns}
            sortKey={sortKey}
            sortDirection={sortDirection}
            onSortPress={onSortPress}
            {...tableProps}
        >
            <TableBody>
                {items
                    .toSorted(sorters[sortKey]?.(sortDirection, secondarySorter))
                    .map(itemRenderer)}
            </TableBody>
        </Table>
    );
}
