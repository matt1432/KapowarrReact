// IMPORTS

// General Components
import Modal from 'Components/Modal/Modal';

// Specific Components
import ConvertPreviewModalContent from './ConvertPreviewModalContent';

// Types
import type { ConvertPreviewModalContentProps } from './ConvertPreviewModalContent';

interface ConvertPreviewModalProps extends ConvertPreviewModalContentProps {
    isOpen: boolean;
    onModalClose: () => void;
}

// IMPLEMENTATIONS

export default function ConvertPreviewModal({
    isOpen,
    onModalClose,
    ...otherProps
}: ConvertPreviewModalProps) {
    return (
        <Modal isOpen={isOpen} onModalClose={onModalClose}>
            {isOpen ? (
                <ConvertPreviewModalContent
                    {...otherProps}
                    onModalClose={onModalClose}
                />
            ) : null}
        </Modal>
    );
}
