import Modal from 'Components/Modal/Modal';
import DeleteVolumeModalContent from './DeleteVolumeModalContent';

interface DeleteVolumeModalProps {
    isOpen: boolean;
    volumeIds: number[];
    onModalClose(): void;
}

function DeleteVolumeModal(props: DeleteVolumeModalProps) {
    const { isOpen, volumeIds, onModalClose } = props;

    return (
        <Modal isOpen={isOpen} onModalClose={onModalClose}>
            <DeleteVolumeModalContent volumeIds={volumeIds} onModalClose={onModalClose} />
        </Modal>
    );
}

export default DeleteVolumeModal;
