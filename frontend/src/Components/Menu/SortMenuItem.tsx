// IMPORTS

// React
import React from 'react';

// Misc
import { icons } from 'Helpers/Props';

// Specific Components
import SelectedMenuItem, { type SelectedMenuItemProps } from './SelectedMenuItem';

// Types
import type { SortDirection } from 'Helpers/Props/sortDirections';
import type { IndexSort } from 'Volume/Index';

interface SortMenuItemProps
    extends Omit<SelectedMenuItemProps<IndexSort>, 'isSelected' | 'onPress'> {
    name?: IndexSort;
    sortKey?: IndexSort;
    sortDirection?: SortDirection;
    children: string | React.ReactNode;
    onPress: (sortKey: IndexSort) => void;
}

// IMPLEMENTATIONS

export default function SortMenuItem({
    name,
    sortKey,
    sortDirection,
    ...otherProps
}: SortMenuItemProps) {
    const isSelected = name === sortKey;

    return (
        <SelectedMenuItem
            name={name}
            selectedIconName={
                sortDirection === 'ascending' ? icons.SORT_ASCENDING : icons.SORT_DESCENDING
            }
            isSelected={isSelected}
            {...otherProps}
        />
    );
}
