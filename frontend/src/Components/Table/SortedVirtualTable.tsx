// IMPORTS

// React
import { useCallback, useMemo, type RefObject } from 'react';

// Redux
import { useRootDispatch, useRootSelector } from 'Store/createAppStore';
import { setTableOptions, setTableSort } from 'Store/Slices/TableOptions';

// Hooks
import useSort from 'Helpers/Hooks/useSort';

// Specific Components
import VirtualTableComplete from './VirtualTableComplete';

// Types
import type { Column } from './Column';
import type { VirtualTableCompleteProps } from './VirtualTableComplete';

import type { Item, Predicates } from 'Helpers/Hooks/useSort';
import type { SortDirection } from 'Helpers/Props/sortDirections';

import type {
    ColumnNameMap,
    SetTableOptionsParams,
} from 'Store/Slices/TableOptions';
import {
    useListRef,
    type ListImperativeAPI,
    type RowComponentProps,
} from 'react-window';

interface SortedVirtualTableProps<
    Name extends keyof ColumnNameMap,
    ColumnName extends ColumnNameMap[Name],
    T extends Item<Name, Exclude<ColumnName, 'actions'>> = Item<
        Name,
        Exclude<ColumnName, 'actions'>
    >,
> {
    tableName: Name;
    columns: Column<ColumnName>[];
    items: T[];
    itemsRef?: RefObject<T[]>;
    itemRenderer: (item: T) => React.ReactElement;

    predicates?: Predicates<Name, ColumnName, T>;

    onSortPress?: (name: ColumnName, sortDirection?: SortDirection) => void;

    tableProps: Omit<
        VirtualTableCompleteProps<T, Name, ColumnName>,
        | 'columns'
        | 'onSortPress'
        | 'sortDirection'
        | 'secondarySortDirection'
        | 'sortKey'
        | 'secondarySortKey'
        | 'tableName'
        | 'Row'
        | 'listRef'
        | 'itemCount'
        | 'itemData'
    >;
}

// IMPLEMENTATIONS

function Row<T>({
    index,
    style,
    items,
    itemRenderer,
}: RowComponentProps<{
    items: T[];
    itemRenderer: (item: T) => React.ReactElement;
}>) {
    if (index >= items.length) {
        return <></>;
    }

    const item = items[index];

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                ...style,
            }}
        >
            {itemRenderer(item)}
        </div>
    );
}

export default function SortedVirtualTable<
    Name extends keyof ColumnNameMap,
    ColumnName extends ColumnNameMap[Name],
    T extends Item<Name, Exclude<ColumnName, 'actions'>> = Item<
        Name,
        Exclude<ColumnName, 'actions'>
    >,
>({
    tableName,
    columns,
    items,
    itemsRef,
    itemRenderer,
    predicates = {},
    onSortPress,
    tableProps,
}: SortedVirtualTableProps<Name, ColumnName, T>) {
    const dispatch = useRootDispatch();

    const { sortKey, sortDirection, secondarySortKey, secondarySortDirection } =
        useRootSelector((state) => state.tableOptions[tableName]);

    const listRef = useListRef(undefined) as RefObject<ListImperativeAPI>;

    const sortedItems = useSort({
        columns,
        items,
        itemsRef,
        predicates,
        sortKey: sortKey as ColumnName | null,
        sortDirection,
        secondarySortKey: secondarySortKey as ColumnName | null,
        secondarySortDirection,
    });

    const handleSortPress = useCallback(
        (name: ColumnName, sortDirection?: SortDirection) => {
            onSortPress?.(name, sortDirection);
            dispatch(setTableSort({ tableName, sortKey: name, sortDirection }));
        },
        [dispatch, onSortPress, tableName],
    );

    const hasOptions = useMemo(
        () =>
            columns.filter((col) => col.isModifiable).length !== 0 ||
            tableProps?.optionsComponent,
        [columns, tableProps],
    );

    const handleTableOptionChange = useCallback(
        (payload: SetTableOptionsParams<Name>) => {
            dispatch(setTableOptions(payload));
        },
        [dispatch],
    );

    return (
        <VirtualTableComplete
            tableName={tableName}
            columns={columns}
            sortKey={sortKey as ColumnName | null}
            sortDirection={sortDirection}
            secondarySortKey={secondarySortKey as ColumnName | null}
            secondarySortDirection={secondarySortDirection}
            onSortPress={handleSortPress}
            onTableOptionChange={
                hasOptions ? handleTableOptionChange : undefined
            }
            Row={Row}
            listRef={listRef}
            itemCount={sortedItems.length}
            itemData={{ items: sortedItems, itemRenderer }}
            {...tableProps}
        />
    );
}
