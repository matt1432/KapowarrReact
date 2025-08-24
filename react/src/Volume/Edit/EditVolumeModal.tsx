// IMPORTS

// General Components
import Modal from 'Components/Modal/Modal';

// Specific Components
import EditVolumeModalContent, { type EditVolumeModalContentProps } from './EditVolumeModalContent';

// Types
interface EditVolumeModalProps extends EditVolumeModalContentProps {
    isOpen: boolean;
}

// IMPLEMENTATIONS

function EditVolumeModal({ isOpen, onModalClose, ...otherProps }: EditVolumeModalProps) {
    return (
        <Modal isOpen={isOpen} onModalClose={onModalClose}>
            <EditVolumeModalContent {...otherProps} onModalClose={onModalClose} />
        </Modal>
    );
}

export default EditVolumeModal;
