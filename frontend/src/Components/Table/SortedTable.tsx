// IMPORTS

// Misc
import { sortDirections } from 'Helpers/Props';

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
import type { ColumnNameMap } from 'Store/Slices/TableOptions';

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

    sortKey?: ColumnName;
    secondarySortKey?: ColumnName;
    sortDirection?: SortDirection;
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
    K extends keyof ColumnNameMap,
    ExtraOptions extends object,
>({
    tableName,
    columns,
    items,
    itemRenderer,
    predicates = {},
    sortKey,
    secondarySortKey = sortKey,
    sortDirection = sortDirections.ASCENDING,
    onSortPress,
    tableProps,
}: SortedTableProps<T, ColumnName, K, ExtraOptions>) {
    const sortedItems = useSort({
        columns,
        items,
        predicates,
        sortKey,
        secondarySortKey,
        sortDirection,
    });

    return (
        <Table
            tableName={tableName}
            columns={columns}
            sortKey={sortKey}
            sortDirection={sortDirection}
            onSortPress={onSortPress}
            {...tableProps}
        >
            <TableBody>{sortedItems.map(itemRenderer)}</TableBody>
        </Table>
    );
}
