// IMPORTS

// General Components
import Modal from 'Components/Modal/Modal';

// Specific Components
import GeneralFilesModalContent, {
    type GeneralFilesModalContentProps,
} from './GeneralFilesModalContent';

// Types
interface GeneralFilesModalProps extends GeneralFilesModalContentProps {
    isOpen: boolean;
}

// IMPLEMENTATIONS

function GeneralFilesModal({ isOpen, onModalClose, ...otherProps }: GeneralFilesModalProps) {
    return (
        <Modal isOpen={isOpen} onModalClose={onModalClose}>
            <GeneralFilesModalContent {...otherProps} onModalClose={onModalClose} />
        </Modal>
    );
}

export default GeneralFilesModal;
