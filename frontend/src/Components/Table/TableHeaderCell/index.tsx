// IMPORTS

// React
import React, { useCallback } from 'react';

// Misc
import { icons, sortDirections } from 'Helpers/Props';

// General Components
import Icon from 'Components/Icon';
import Link from 'Components/Link/Link';

// CSS
import styles from './index.module.css';

// Types
import type { SortDirection } from 'Helpers/Props/sortDirections';

interface TableHeaderCellProps<T extends string> {
    className?: string;
    name: T;
    columnLabel?: string;
    isSortable: boolean;
    isVisible: boolean;
    isModifiable: boolean;
    sortKey?: T | null;
    sortDirection?: SortDirection | null;
    secondarySortKey?: T | null;
    secondarySortDirection?: SortDirection | null;
    fixedSortDirection?: SortDirection;
    children?: React.ReactNode;
    onSortPress?: (name: T, sortDirection?: SortDirection) => void;
}

// IMPLEMENTATIONS

export default function TableHeaderCell<T extends string>({
    className = styles.headerCell,
    name,
    columnLabel,
    isSortable = false,
    sortKey,
    sortDirection,
    secondarySortKey,
    secondarySortDirection,
    fixedSortDirection,
    children,
    onSortPress,
    ...otherProps
}: TableHeaderCellProps<T>) {
    const isSorting =
        isSortable && (sortKey === name || secondarySortKey === name);

    const sortIcon =
        (name === sortKey && sortDirection === sortDirections.ASCENDING) ||
        (name === secondarySortKey &&
            secondarySortDirection === sortDirections.ASCENDING)
            ? icons.SORT_ASCENDING
            : icons.SORT_DESCENDING;

    const handlePress = useCallback(() => {
        if (fixedSortDirection) {
            onSortPress?.(name, fixedSortDirection);
        }
        else {
            onSortPress?.(name);
        }
    }, [name, fixedSortDirection, onSortPress]);

    return isSortable ? (
        <Link
            {...otherProps}
            component="th"
            className={className}
            title={columnLabel}
            onPress={handlePress}
        >
            {children}

            {isSorting && <Icon name={sortIcon} className={styles.sortIcon} />}
        </Link>
    ) : (
        <th className={className}>{children}</th>
    );
}
