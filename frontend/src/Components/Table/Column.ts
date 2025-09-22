// IMPORTS

// React
import React from 'react';

// Types
import type { SortDirection } from 'Helpers/Props/sortDirections';

type PropertyFunction<T> = () => T;

export interface Column<T extends string> {
    name: T;
    label?: string | PropertyFunction<string> | React.ReactNode;
    className?: string;
    columnLabel?: string | PropertyFunction<string>;
    isSortable?: boolean;
    fixedSortDirection?: SortDirection;
    isVisible: boolean;
    isModifiable?: boolean;
}
