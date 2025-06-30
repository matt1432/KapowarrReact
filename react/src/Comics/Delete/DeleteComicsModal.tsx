import Modal from 'Components/Modal/Modal';
import { sizes } from 'Helpers/Props';
import DeleteComicsModalContent, {
    type DeleteComicsModalContentProps,
} from './DeleteComicsModalContent';

interface DeleteComicsModalProps extends DeleteComicsModalContentProps {
    isOpen: boolean;
}

function DeleteComicsModal({ isOpen, onModalClose, ...otherProps }: DeleteComicsModalProps) {
    return (
        <Modal isOpen={isOpen} size={sizes.MEDIUM} onModalClose={onModalClose}>
            <DeleteComicsModalContent {...otherProps} onModalClose={onModalClose} />
        </Modal>
    );
}

export default DeleteComicsModal;
