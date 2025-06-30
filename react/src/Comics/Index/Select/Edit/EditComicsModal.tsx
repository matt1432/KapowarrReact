import Modal from 'Components/Modal/Modal';
import EditComicsModalContent from './EditComicsModalContent';

interface EditComicsModalProps {
    isOpen: boolean;
    comicsIds: number[];
    onSavePress(payload: object): void;
    onModalClose(): void;
}

function EditComicsModal(props: EditComicsModalProps) {
    const { isOpen, comicsIds, onSavePress, onModalClose } = props;

    return (
        <Modal isOpen={isOpen} onModalClose={onModalClose}>
            <EditComicsModalContent
                comicsIds={comicsIds}
                onSavePress={onSavePress}
                onModalClose={onModalClose}
            />
        </Modal>
    );
}

export default EditComicsModal;
