// IMPORTS

// General Components
import Modal from 'Components/Modal/Modal';

// Specific Components
import EditPagesModalContent, {
    type EditPagesModalContentProps,
} from './ModalContent';

// Types
interface EditPagesModalProps extends EditPagesModalContentProps {
    isOpen: boolean;
}

// IMPLEMENTATIONS

export default function EditPagesModal({
    isOpen,
    onModalClose,
    ...otherProps
}: EditPagesModalProps) {
    return (
        <Modal isOpen={isOpen} onModalClose={onModalClose}>
            <EditPagesModalContent
                {...otherProps}
                onModalClose={onModalClose}
            />
        </Modal>
    );
}
