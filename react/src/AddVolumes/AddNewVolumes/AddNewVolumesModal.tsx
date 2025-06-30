import Modal from 'Components/Modal/Modal';
import AddNewVolumesModalContent, {
    type AddNewVolumesModalContentProps,
} from './AddNewVolumesModalContent';

interface AddNewVolumesModalProps extends AddNewVolumesModalContentProps {
    isOpen: boolean;
}

function AddNewVolumesModal({ isOpen, onModalClose, ...otherProps }: AddNewVolumesModalProps) {
    return (
        <Modal isOpen={isOpen} onModalClose={onModalClose}>
            <AddNewVolumesModalContent {...otherProps} onModalClose={onModalClose} />
        </Modal>
    );
}

export default AddNewVolumesModal;
