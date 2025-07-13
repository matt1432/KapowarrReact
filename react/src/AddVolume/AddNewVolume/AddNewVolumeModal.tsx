import Modal from 'Components/Modal/Modal';
import AddNewVolumeModalContent, {
    type AddNewVolumeModalContentProps,
} from './AddNewVolumeModalContent';

interface AddNewVolumeModalProps extends AddNewVolumeModalContentProps {
    isOpen: boolean;
}

function AddNewVolumeModal({ isOpen, onModalClose, ...otherProps }: AddNewVolumeModalProps) {
    return (
        <Modal isOpen={isOpen} onModalClose={onModalClose}>
            <AddNewVolumeModalContent {...otherProps} onModalClose={onModalClose} />
        </Modal>
    );
}

export default AddNewVolumeModal;
