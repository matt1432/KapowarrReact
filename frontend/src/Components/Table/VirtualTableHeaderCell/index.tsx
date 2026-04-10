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

interface VirtualTableHeaderCellProps<T extends string> {
    className?: string;
    name: T;
    columnLabel?: string;
    isSortable?: boolean;
    sortKey?: T | null;
    sortDirection?: SortDirection | null;
    secondarySortKey?: T | null;
    secondarySortDirection?: SortDirection | null;
    fixedSortDirection?: SortDirection;
    children?: React.ReactNode;
    onSortPress?: (name: T, sortDirection?: SortDirection) => void;
}

// IMPLEMENTATIONS

export default function VirtualTableHeaderCell<T extends string = string>({
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
}: VirtualTableHeaderCellProps<T>) {
    const isSorting =
        isSortable && (name === sortKey || name === secondarySortKey);
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
            title={columnLabel}
            component="div"
            className={className}
            onPress={handlePress}
            {...otherProps}
        >
            {children}

            {isSorting ? (
                <Icon name={sortIcon} className={styles.sortIcon} />
            ) : null}
        </Link>
    ) : (
        <div className={className}>{children}</div>
    );
}
