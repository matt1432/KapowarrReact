// IMPORTS

// Redux
import { useRootSelector } from 'Store/createAppStore';

// Hooks
import useSort from 'Helpers/Hooks/useSort';

// Specific Components
import Table from './Table';
import TableBody from './TableBody';

// Types
import type { Item, Predicates } from 'Helpers/Hooks/useSort';
import type { TableProps } from './Table';
import type { Column } from './Column';
import type { SortDirection } from 'Helpers/Props/sortDirections';
import type { ColumnNameMap, TableName } from 'Store/Slices/TableOptions';

interface SortedTableProps<
    T extends Item<ColumnName>,
    ColumnName extends ColumnNameMap[K],
    K extends keyof ColumnNameMap,
    ExtraOptions extends object,
> {
    tableName: K;
    columns: Column<ColumnName>[];
    items: T[];
    itemRenderer: (item: T) => React.ReactElement;

    predicates?: Predicates<T, ColumnName>;

    onSortPress?: (name: ColumnName, sortDirection?: SortDirection) => void;

    tableProps?: Omit<
        TableProps<ColumnName, K, ExtraOptions>,
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
    T extends Item<ColumnName>,
    ColumnName extends ColumnNameMap[K],
    K extends TableName,
    ExtraOptions extends object,
>({
    tableName,
    columns,
    items,
    itemRenderer,
    predicates = {},
    onSortPress,
    tableProps,
}: SortedTableProps<T, ColumnName, K, ExtraOptions>) {
    const { sortKey, sortDirection, secondarySortKey, secondarySortDirection } =
        useRootSelector((state) => state.tableOptions[tableName]);

    const sortedItems = useSort({
        columns,
        items,
        predicates,
        sortKey: sortKey as ColumnName,
        sortDirection,
        secondarySortKey: secondarySortKey as ColumnName,
        secondarySortDirection,
    });

    return (
        <Table
            tableName={tableName}
            columns={columns}
            sortKey={sortKey as ColumnName}
            sortDirection={sortDirection}
            secondarySortKey={secondarySortKey as ColumnName}
            secondarySortDirection={secondarySortDirection}
            onSortPress={onSortPress}
            {...tableProps}
        >
            <TableBody>{sortedItems.map(itemRenderer)}</TableBody>
        </Table>
    );
}
