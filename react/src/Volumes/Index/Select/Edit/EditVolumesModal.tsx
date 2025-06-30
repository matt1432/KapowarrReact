import Modal from 'Components/Modal/Modal';
import EditVolumesModalContent from './EditVolumesModalContent';

interface EditVolumesModalProps {
    isOpen: boolean;
    volumesIds: number[];
    onSavePress(payload: object): void;
    onModalClose(): void;
}

function EditVolumesModal(props: EditVolumesModalProps) {
    const { isOpen, volumesIds, onSavePress, onModalClose } = props;

    return (
        <Modal isOpen={isOpen} onModalClose={onModalClose}>
            <EditVolumesModalContent
                volumesIds={volumesIds}
                onSavePress={onSavePress}
                onModalClose={onModalClose}
            />
        </Modal>
    );
}

export default EditVolumesModal;
