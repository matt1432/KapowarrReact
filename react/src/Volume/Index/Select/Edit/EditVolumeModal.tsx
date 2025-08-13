// IMPORTS

// General Components
import Modal from 'Components/Modal/Modal';

// Specific Components
import EditVolumeModalContent from './EditVolumeModalContent';

// Types
interface EditVolumeModalProps {
    isOpen: boolean;
    volumeIds: number[];
    onSavePress(): void;
    onModalClose(): void;
}

// IMPLEMENTATIONS

function EditVolumeModal({ isOpen, volumeIds, onSavePress, onModalClose }: EditVolumeModalProps) {
    return (
        <Modal isOpen={isOpen} onModalClose={onModalClose}>
            <EditVolumeModalContent
                volumeIds={volumeIds}
                onSavePress={onSavePress}
                onModalClose={onModalClose}
            />
        </Modal>
    );
}

export default EditVolumeModal;
