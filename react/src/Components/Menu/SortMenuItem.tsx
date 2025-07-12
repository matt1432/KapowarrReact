import React from 'react';
import { icons } from 'Helpers/Props';
import { type SortDirection } from 'Helpers/Props/sortDirections';
import SelectedMenuItem, { type SelectedMenuItemProps } from './SelectedMenuItem';
import type { IndexSort } from 'Volumes/Index';

interface SortMenuItemProps
    extends Omit<SelectedMenuItemProps<IndexSort>, 'isSelected' | 'onPress'> {
    name?: IndexSort;
    sortKey?: IndexSort;
    sortDirection?: SortDirection;
    children: string | React.ReactNode;
    onPress: (sortKey: IndexSort) => void;
}

function SortMenuItem({ name, sortKey, sortDirection, ...otherProps }: SortMenuItemProps) {
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

export default SortMenuItem;
