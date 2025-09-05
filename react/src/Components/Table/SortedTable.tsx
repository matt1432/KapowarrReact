// IMPORTS

// Misc
import { sortDirections } from 'Helpers/Props';
import useSort, { type Item, type Predicates } from 'Helpers/Hooks/useSort';

// Specific Components
import Table from './Table';
import TableBody from './TableBody';

// Types
import type { TableProps } from './Table';
import type { Column } from './Column';
import type { SortDirection } from 'Helpers/Props/sortDirections';

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
