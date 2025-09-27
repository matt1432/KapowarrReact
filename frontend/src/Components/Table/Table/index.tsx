// IMPORTS

// React
import React from 'react';

// Misc
import { icons, scrollDirections } from 'Helpers/Props';

import classNames from 'classnames';
import translate from 'Utilities/String/translate';

// General Components
import Icon from 'Components/Icon';
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
import type { Column } from '../Column';
import type { TranslateKey } from 'Utilities/String/translate';
import type { SortDirection } from 'Helpers/Props/sortDirections';
import type { CheckInputChanged } from 'typings/Inputs';
import type {
    ColumnNameMap,
    SetTableOptionsParams,
} from 'Store/Slices/TableOptions';

export interface TableProps<
    T extends ColumnNameMap[K],
    K extends keyof ColumnNameMap,
    ExtraOptions extends object,
> {
    tableName: K;
    className?: string;
    containerClassName?: string;
    horizontalScroll?: boolean;
    selectAll?: boolean;
    allSelected?: boolean;
    allUnselected?: boolean;
    columns: Column<T>[];
    optionsComponent?: React.ElementType;
    canModifyColumns?: boolean;
    sortKey?: T;
    sortDirection?: SortDirection;
    children?: React.ReactNode;
    onSortPress?: (name: T, sortDirection?: SortDirection) => void;
    onSelectAllChange?: (change: CheckInputChanged<string>) => void;
    onTableOptionChange?: (
        payload:
            | SetTableOptionsParams<K>
            | (SetTableOptionsParams<K> & ExtraOptions),
    ) => void;
}

// IMPLEMENTATIONS

export default function Table<
    T extends ColumnNameMap[K],
    K extends keyof ColumnNameMap,
    ExtraOptions extends object,
>({
    tableName,
    className = styles.table,
    containerClassName = styles.tableContainer,
    horizontalScroll = true,
    selectAll = false,
    allSelected = false,
    allUnselected = false,
    columns,
    optionsComponent,
    canModifyColumns,
    sortKey,
    sortDirection,
    children,
    onSortPress,
    onSelectAllChange,
    onTableOptionChange,
}: TableProps<T, K, ExtraOptions>) {
    return (
        <Scroller
            className={classNames(
                containerClassName,
                horizontalScroll && styles.horizontalScroll,
            )}
            scrollDirection={
                horizontalScroll
                    ? scrollDirections.HORIZONTAL
                    : scrollDirections.NONE
            }
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

                        const columnLabel = translate(
                            `${column.name}Key` as TranslateKey,
                        );

                        if (
                            name === 'actions' &&
                            typeof onTableOptionChange === 'function'
                        ) {
                            return (
                                <TableHeaderCell
                                    key={name}
                                    name={name}
                                    columnLabel={columnLabel}
                                    isVisible={isVisible}
                                    {...otherColumnProps}
                                >
                                    <TableOptionsModalWrapper
                                        tableName={tableName}
                                        columns={columns}
                                        optionsComponent={optionsComponent}
                                        canModifyColumns={canModifyColumns}
                                        onTableOptionChange={
                                            onTableOptionChange
                                        }
                                    >
                                        <IconButton
                                            name={icons.ADVANCED_SETTINGS}
                                        />
                                    </TableOptionsModalWrapper>
                                </TableHeaderCell>
                            );
                        }

                        return (
                            <TableHeaderCell
                                key={column.name}
                                {...column}
                                columnLabel={columnLabel}
                                sortKey={sortKey}
                                sortDirection={sortDirection}
                                onSortPress={onSortPress}
                            >
                                {column.icon ? (
                                    <Icon
                                        name={column.icon.name}
                                        kind={column.icon.kind}
                                        title={
                                            column.icon.title
                                                ? translate(column.icon.title)
                                                : undefined
                                        }
                                    />
                                ) : column.hideHeaderLabel ? (
                                    ''
                                ) : (
                                    columnLabel
                                )}
                            </TableHeaderCell>
                        );
                    })}
                </TableHeader>
                {children}
            </table>
        </Scroller>
    );
}
