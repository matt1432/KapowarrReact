// IMPORTS

// React
import React from 'react';

// Types
interface TableBodyProps {
    children?: React.ReactNode;
}

// IMPLEMENTATIONS

export default function TableBody({ children }: TableBodyProps) {
    return <tbody>{children}</tbody>;
}
