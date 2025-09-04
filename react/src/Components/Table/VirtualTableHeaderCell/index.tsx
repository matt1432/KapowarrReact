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

interface VirtualTableHeaderCellProps {
    className?: string;
    name: string;
    isSortable?: boolean;
    sortKey?: string;
    fixedSortDirection?: SortDirection;
    sortDirection?: string;
    children?: React.ReactNode;
    onSortPress?: (name: string, sortDirection?: SortDirection) => void;
}

// IMPLEMENTATIONS

export default function VirtualTableHeaderCell({
    className = styles.headerCell,
    name,
    isSortable = false,
    sortKey,
    sortDirection,
    fixedSortDirection,
    children,
    onSortPress,
    ...otherProps
}: VirtualTableHeaderCellProps) {
    const isSorting = isSortable && sortKey === name;
    const sortIcon =
        sortDirection === sortDirections.ASCENDING ? icons.SORT_ASCENDING : icons.SORT_DESCENDING;

    const handlePress = useCallback(() => {
        if (fixedSortDirection) {
            onSortPress?.(name, fixedSortDirection);
        }
        else {
            onSortPress?.(name);
        }
    }, [name, fixedSortDirection, onSortPress]);

    return isSortable ? (
        <Link component="div" className={className} onPress={handlePress} {...otherProps}>
            {children}

            {isSorting ? <Icon name={sortIcon} className={styles.sortIcon} /> : null}
        </Link>
    ) : (
        <div className={className}>{children}</div>
    );
}
