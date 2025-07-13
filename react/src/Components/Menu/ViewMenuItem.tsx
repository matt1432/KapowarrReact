import React from 'react';
import SelectedMenuItem, { type SelectedMenuItemProps } from './SelectedMenuItem';
import type { IndexView } from 'Volume/Index';

interface ViewMenuItemProps extends Omit<SelectedMenuItemProps<IndexView>, 'isSelected'> {
    name?: IndexView;
    selectedView: IndexView;
    children: React.ReactNode;
    onPress: (view: IndexView) => void;
}

function ViewMenuItem({ name, selectedView, ...otherProps }: ViewMenuItemProps) {
    const isSelected = name === selectedView;

    return <SelectedMenuItem name={name} isSelected={isSelected} {...otherProps} />;
}

export default ViewMenuItem;
