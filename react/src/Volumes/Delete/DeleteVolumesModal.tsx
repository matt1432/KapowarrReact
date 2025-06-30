import Modal from 'Components/Modal/Modal';
import { sizes } from 'Helpers/Props';
import DeleteVolumesModalContent, {
    type DeleteVolumesModalContentProps,
} from './DeleteVolumesModalContent';

interface DeleteVolumesModalProps extends DeleteVolumesModalContentProps {
    isOpen: boolean;
}

function DeleteVolumesModal({ isOpen, onModalClose, ...otherProps }: DeleteVolumesModalProps) {
    return (
        <Modal isOpen={isOpen} size={sizes.MEDIUM} onModalClose={onModalClose}>
            <DeleteVolumesModalContent {...otherProps} onModalClose={onModalClose} />
        </Modal>
    );
}

export default DeleteVolumesModal;
