// IMPORTS

// React
import React from 'react';

// Misc
import { icons, scrollDirections } from 'Helpers/Props';

import classNames from 'classnames';

// General Components
import IconButton from 'Components/Link/IconButton';
import Scroller from 'Components/Scroller/Scroller';
import TableOptionsModalWrapper from 'Components/Table/TableOptions/TableOptionsModalWrapper';

// Specific Components
import TableHeader from '../TableHeader';
import TableHeaderCell from '../TableHeaderCell';
import TableSelectAllHeaderCell from '../TableSelectAllHeaderCell';

// CSS
import styles from './index.module.css';

// Types
import type { SortDirection } from 'Helpers/Props/sortDirections';
import type { CheckInputChanged } from 'typings/Inputs';
import type { TableOptionsChangePayload } from 'typings/Table';
import type { Column } from '../Column';

export interface TableProps<T extends string> {
    className?: string;
    horizontalScroll?: boolean;
    selectAll?: boolean;
    allSelected?: boolean;
    allUnselected?: boolean;
    columns: Column<T>[];
    optionsComponent?: React.ElementType;
    pageSize?: number;
    canModifyColumns?: boolean;
    sortKey?: T;
    sortDirection?: SortDirection;
    children?: React.ReactNode;
    onSortPress?: (name: T, sortDirection?: SortDirection) => void;
    onTableOptionChange?: (payload: TableOptionsChangePayload<T>) => void;
    onSelectAllChange?: (change: CheckInputChanged<string>) => void;
}

// IMPLEMENTATIONS

export default function Table<T extends string>({
    className = styles.table,
    horizontalScroll = true,
    selectAll = false,
    allSelected = false,
    allUnselected = false,
    columns,
    optionsComponent,
    pageSize,
    canModifyColumns,
    sortKey,
    sortDirection,
    children,
    onSortPress,
    onTableOptionChange,
    onSelectAllChange,
}: TableProps<T>) {
    return (
        <Scroller
            className={classNames(
                styles.tableContainer,
                horizontalScroll && styles.horizontalScroll,
            )}
            scrollDirection={horizontalScroll ? scrollDirections.HORIZONTAL : scrollDirections.NONE}
            autoFocus={false}
        >
            <table className={className}>
                <TableHeader>
                    {selectAll && onSelectAllChange ? (
                        <TableSelectAllHeaderCell
                            allSelected={allSelected}
                            allUnselected={allUnselected}
                            onSelectAllChange={onSelectAllChange}
                        />
                    ) : null}

                    {columns.map((column) => {
                        const { name, isVisible, ...otherColumnProps } = column;

                        if (!isVisible) {
                            return null;
                        }

                        if ((name === 'actions' || name === 'details') && onTableOptionChange) {
                            return (
                                <TableHeaderCell
                                    key={name}
                                    name={name}
                                    isSortable={false}
                                    {...otherColumnProps}
                                >
                                    <TableOptionsModalWrapper
                                        columns={columns}
                                        optionsComponent={optionsComponent}
                                        pageSize={pageSize}
                                        canModifyColumns={canModifyColumns}
                                        onTableOptionChange={onTableOptionChange}
                                    >
                                        <IconButton name={icons.ADVANCED_SETTINGS} />
                                    </TableOptionsModalWrapper>
                                </TableHeaderCell>
                            );
                        }

                        return (
                            <TableHeaderCell
                                key={column.name}
                                {...column}
                                sortKey={sortKey}
                                sortDirection={sortDirection}
                                onSortPress={onSortPress}
                            >
                                {typeof column.label === 'function' ? column.label() : column.label}
                            </TableHeaderCell>
                        );
                    })}
                </TableHeader>
                {children}
            </table>
        </Scroller>
    );
}
