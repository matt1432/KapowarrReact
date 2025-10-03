// IMPORTS

// React
import React from 'react';

// Misc
import { icons, sortDirections } from 'Helpers/Props';

// Specific Components
import SelectedMenuItem, {
    type SelectedMenuItemProps,
} from './SelectedMenuItem';

// Types
import type { SortDirection } from 'Helpers/Props/sortDirections';
import type { IndexSort } from 'Volume/Index';

interface SortMenuItemProps
    extends Omit<SelectedMenuItemProps<IndexSort>, 'isSelected' | 'onPress'> {
    name?: IndexSort;
    sortKey?: IndexSort | null;
    sortDirection?: SortDirection | null;
    secondarySortKey?: IndexSort | null;
    secondarySortDirection?: SortDirection | null;
    children: string | React.ReactNode;
    onPress: (sortKey: IndexSort) => void;
}

// IMPLEMENTATIONS

export default function SortMenuItem({
    name,
    sortKey,
    sortDirection,
    secondarySortKey,
    secondarySortDirection,
    ...otherProps
}: SortMenuItemProps) {
    const isSelected = name === sortKey || name === secondarySortKey;

    return (
        <SelectedMenuItem
            name={name}
            selectedIconName={
                (name === sortKey &&
                    sortDirection === sortDirections.ASCENDING) ||
                (name === secondarySortKey &&
                    secondarySortDirection === sortDirections.ASCENDING)
                    ? icons.SORT_ASCENDING
                    : icons.SORT_DESCENDING
            }
            isSelected={isSelected}
            {...otherProps}
        />
    );
}
