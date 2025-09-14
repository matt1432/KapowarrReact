// IMPORTS

// General Components
import Modal from 'Components/Modal/Modal';

// Specific Components
import ChangeMatchModalContent, {
    type ChangeMatchModalContentProps,
} from './ChangeMatchModalContent';

// Types
interface ChangeMatchModalProps extends ChangeMatchModalContentProps {
    isOpen: boolean;
}

// IMPLEMENTATIONS

export default function ChangeMatchModal({
    isOpen,
    onModalClose,
    ...otherProps
}: ChangeMatchModalProps) {
    return (
        <Modal isOpen={isOpen} onModalClose={onModalClose}>
            <ChangeMatchModalContent {...otherProps} onModalClose={onModalClose} />
        </Modal>
    );
}
