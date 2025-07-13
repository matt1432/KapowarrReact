import Modal from 'Components/Modal/Modal';
import EditVolumeModalContent from './EditVolumeModalContent';

interface EditVolumeModalProps {
    isOpen: boolean;
    volumeIds: number[];
    onSavePress(payload: object): void;
    onModalClose(): void;
}

function EditVolumeModal(props: EditVolumeModalProps) {
    const { isOpen, volumeIds, onSavePress, onModalClose } = props;

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
