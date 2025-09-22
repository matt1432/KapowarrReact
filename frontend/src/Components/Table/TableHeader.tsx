// IMPORTS

// React
import React from 'react';

// Types
interface TableHeaderProps {
    children?: React.ReactNode;
}

// IMPLEMENTATIONS

export default function TableHeader({ children }: TableHeaderProps) {
    return (
        <thead>
            <tr>{children}</tr>
        </thead>
    );
}
