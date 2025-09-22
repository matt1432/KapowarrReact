// IMPORTS

// General Components
import ModalContent from 'Components/Modal/ModalContent';

// Types
import type { ReactNode } from 'react';

export interface EditBuiltInClientModalContentProps {
    onModalClose: () => void;
    children: ReactNode;
}

// IMPLEMENTATIONS

export default function EditBuiltInClientModalContent({
    onModalClose,
    children,
}: EditBuiltInClientModalContentProps) {
    return <ModalContent onModalClose={onModalClose}>{children}</ModalContent>;
}
