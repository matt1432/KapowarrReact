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

export default function DeleteVolumeModal({
    isOpen,
    volumeIds,
    onModalClose,
}: DeleteVolumeModalProps) {
    return (
        <Modal isOpen={isOpen} onModalClose={onModalClose}>
            <DeleteVolumeModalContent volumeIds={volumeIds} onModalClose={onModalClose} />
        </Modal>
    );
}
