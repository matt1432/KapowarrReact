import React from 'react';
import SelectedMenuItem, { type SelectedMenuItemProps } from './SelectedMenuItem';
import type { IndexFilter } from 'Volumes/Index';

interface FilterMenuItemProps
    extends Omit<SelectedMenuItemProps<IndexFilter>, 'isSelected' | 'onPress'> {
    name?: IndexFilter;
    filterKey: IndexFilter;
    children: React.ReactNode;
    onPress: (view: IndexFilter) => void;
}

function FilterMenuItem({ name, filterKey, ...otherProps }: FilterMenuItemProps) {
    const isSelected = name === filterKey;

    return <SelectedMenuItem name={name} isSelected={isSelected} {...otherProps} />;
}

export default FilterMenuItem;
