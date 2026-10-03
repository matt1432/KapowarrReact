// IMPORTS

// General Components
import Modal from 'Components/Modal/Modal';

// Specific Components
import AddIndexerModalContent from './AddIndexerModalContent';

// Types
import type { AddIndexerModalContentProps } from './AddIndexerModalContent';

interface AddIndexerModalProps extends AddIndexerModalContentProps {
    isOpen: boolean;
}

// IMPLEMENTATIONS

export default function AddIndexerModal({
    isOpen,
    onModalClose,
    ...otherProps
}: AddIndexerModalProps) {
    return (
        <Modal isOpen={isOpen} onModalClose={onModalClose}>
            <AddIndexerModalContent
                {...otherProps}
                onModalClose={onModalClose}
            />
        </Modal>
    );
}
