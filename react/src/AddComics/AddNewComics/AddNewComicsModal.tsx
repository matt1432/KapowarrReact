import Modal from 'Components/Modal/Modal';
import AddNewComicsModalContent, {
    type AddNewComicsModalContentProps,
} from './AddNewComicsModalContent';

interface AddNewComicsModalProps extends AddNewComicsModalContentProps {
    isOpen: boolean;
}

function AddNewComicsModal({ isOpen, onModalClose, ...otherProps }: AddNewComicsModalProps) {
    return (
        <Modal isOpen={isOpen} onModalClose={onModalClose}>
            <AddNewComicsModalContent {...otherProps} onModalClose={onModalClose} />
        </Modal>
    );
}

export default AddNewComicsModal;
