// IMPORTS

// Types
import type { ReactNode } from 'react';

export interface FormProps {
    id?: string;
    children: ReactNode;
}

// IMPLEMENTATIONS

export default function Form({ id, children }: FormProps) {
    return <div id={id}>{children}</div>;
}
