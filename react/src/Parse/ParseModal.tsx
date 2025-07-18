// IMPORTS

// General Components
import Modal from 'Components/Modal/Modal';

// Specific Components
import ParseModalContent from './ParseModalContent';

// Types
interface ParseModalProps {
    isOpen: boolean;
    onModalClose: () => void;
}

// IMPLEMENTATIONS

function ParseModal(props: ParseModalProps) {
    const { isOpen, onModalClose } = props;

    return (
        <Modal isOpen={isOpen} onModalClose={onModalClose}>
            <ParseModalContent onModalClose={onModalClose} />
        </Modal>
    );
}

export default ParseModal;
