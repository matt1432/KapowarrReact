import Modal from 'Components/Modal/Modal';
import { sizes } from 'Helpers/Props';
import DeleteVolumeModalContent, {
    type DeleteVolumeModalContentProps,
} from './DeleteVolumeModalContent';

interface DeleteVolumeModalProps extends DeleteVolumeModalContentProps {
    isOpen: boolean;
}

function DeleteVolumeModal({ isOpen, onModalClose, ...otherProps }: DeleteVolumeModalProps) {
    return (
        <Modal isOpen={isOpen} size={sizes.MEDIUM} onModalClose={onModalClose}>
            <DeleteVolumeModalContent {...otherProps} onModalClose={onModalClose} />
        </Modal>
    );
}

export default DeleteVolumeModal;
