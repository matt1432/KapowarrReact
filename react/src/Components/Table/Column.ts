import React from 'react';
import { type SortDirection } from 'Helpers/Props/sortDirections';

type PropertyFunction<T> = () => T;

// TODO: Convert to generic so `name` can be a type
export interface Column {
    name: string;
    label: string | PropertyFunction<string> | React.ReactNode;
    className?: string;
    columnLabel?: string | PropertyFunction<string>;
    isSortable?: boolean;
    fixedSortDirection?: SortDirection;
    isVisible: boolean;
    isModifiable?: boolean;
}
