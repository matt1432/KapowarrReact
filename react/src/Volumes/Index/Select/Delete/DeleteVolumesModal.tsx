import Modal from 'Components/Modal/Modal';
import DeleteVolumesModalContent from './DeleteVolumesModalContent';

interface DeleteVolumesModalProps {
    isOpen: boolean;
    volumesIds: number[];
    onModalClose(): void;
}

function DeleteVolumesModal(props: DeleteVolumesModalProps) {
    const { isOpen, volumesIds, onModalClose } = props;

    return (
        <Modal isOpen={isOpen} onModalClose={onModalClose}>
            <DeleteVolumesModalContent volumesIds={volumesIds} onModalClose={onModalClose} />
        </Modal>
    );
}

export default DeleteVolumesModal;
