// IMPORTS

// General Components
import Modal from 'Components/Modal/Modal';

// Specific Components
import DeleteVolumeModalContent from './DeleteVolumeModalContent';

// Types
interface DeleteVolumeModalProps {
    isOpen: boolean;
    volumeIds: number[];
    onModalClose(): void;
}

// IMPLEMENTATIONS

function DeleteVolumeModal(props: DeleteVolumeModalProps) {
    const { isOpen, volumeIds, onModalClose } = props;

    return (
        <Modal isOpen={isOpen} onModalClose={onModalClose}>
            <DeleteVolumeModalContent volumeIds={volumeIds} onModalClose={onModalClose} />
        </Modal>
    );
}

export default DeleteVolumeModal;
