// IMPORTS

// Redux
import { useRootSelector } from 'Store/createAppStore';

// Hooks
import useSort from 'Helpers/Hooks/useSort';

// Specific Components
import Table from './Table';
import TableBody from './TableBody';

// Types
import type { EmptyObject } from 'type-fest';

import type { Column } from './Column';
import type { TableProps } from './Table';

import type { Item, Predicates } from 'Helpers/Hooks/useSort';
import type { SortDirection } from 'Helpers/Props/sortDirections';

import type {
    ColumnNameMap,
    TableName,
    TableState,
} from 'Store/Slices/TableOptions';

interface SortedTableProps<
    K extends keyof ColumnNameMap,
    T extends Item<ColumnNameMap[K]> = Item<ColumnNameMap[K]>,
    ExtraOptions extends object = EmptyObject,
> {
    tableName: K;
    columns: Column<ColumnNameMap[K]>[];
    items: T[];
    itemRenderer: (item: T) => React.ReactElement;

    predicates?: Predicates<T, ColumnNameMap[K]>;

    onSortPress?: (
        name: ColumnNameMap[K],
        sortDirection?: SortDirection,
    ) => void;

    tableProps?: Omit<
        TableProps<ColumnNameMap[K], K, ExtraOptions>,
        | 'tableName'
        | 'columns'
        | 'sortKey'
        | 'sortDirection'
        | 'children'
        | 'onSortPress'
    >;
}

// IMPLEMENTATIONS

export default function SortedTable<
    K extends TableName,
    T extends Item<ColumnNameMap[K]> = Item<ColumnNameMap[K]>,
    ExtraOptions extends object = EmptyObject,
>({
    tableName,
    columns,
    items,
    itemRenderer,
    predicates = {},
    onSortPress,
    tableProps,
}: SortedTableProps<K, T, ExtraOptions>) {
    const { sortKey, sortDirection, secondarySortKey, secondarySortDirection } =
        useRootSelector(
            (state) =>
                state.tableOptions[tableName] as unknown as TableState<K>,
        );

    const sortedItems = useSort({
        columns,
        items,
        predicates,
        sortKey,
        sortDirection,
        secondarySortKey,
        secondarySortDirection,
    });

    return (
        <Table
            tableName={tableName}
            columns={columns}
            sortKey={sortKey}
            sortDirection={sortDirection}
            secondarySortKey={secondarySortKey}
            secondarySortDirection={secondarySortDirection}
            onSortPress={onSortPress}
            {...tableProps}
        >
            <TableBody>{sortedItems.map(itemRenderer)}</TableBody>
        </Table>
    );
}
