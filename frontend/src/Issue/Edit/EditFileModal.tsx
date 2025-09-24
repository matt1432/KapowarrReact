// IMPORTS

// General Components
import Modal from 'Components/Modal/Modal';

// Specific Components
import EditFileModalContent, {
    type EditFileModalContentProps,
} from './EditFileModalContent';

// Types
interface EditFileModalProps extends EditFileModalContentProps {
    isOpen: boolean;
}

// IMPLEMENTATIONS

export default function EditFileModal({
    isOpen,
    onModalClose,
    ...otherProps
}: EditFileModalProps) {
    return (
        <Modal isOpen={isOpen} onModalClose={onModalClose}>
            <EditFileModalContent {...otherProps} onModalClose={onModalClose} />
        </Modal>
    );
}
