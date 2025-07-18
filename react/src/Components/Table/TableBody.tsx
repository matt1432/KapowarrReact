// IMPORTS

// React
import React from 'react';

// Types
interface TableBodyProps {
    children?: React.ReactNode;
}

// IMPLEMENTATIONS

function TableBody({ children }: TableBodyProps) {
    return <tbody>{children}</tbody>;
}

export default TableBody;
