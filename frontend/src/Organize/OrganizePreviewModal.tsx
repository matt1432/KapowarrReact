// IMPORTS

// General Components
import Modal from 'Components/Modal/Modal';

// Specific Components
import OrganizePreviewModalContent from './OrganizePreviewModalContent';

// Types
import type { OrganizePreviewModalContentProps } from './OrganizePreviewModalContent';

interface OrganizePreviewModalProps extends OrganizePreviewModalContentProps {
    isOpen: boolean;
    onModalClose: () => void;
}

// IMPLEMENTATIONS

export default function OrganizePreviewModal({
    isOpen,
    onModalClose,
    ...otherProps
}: OrganizePreviewModalProps) {
    return (
        <Modal isOpen={isOpen} onModalClose={onModalClose}>
            {isOpen ? (
                <OrganizePreviewModalContent {...otherProps} onModalClose={onModalClose} />
            ) : null}
        </Modal>
    );
}
