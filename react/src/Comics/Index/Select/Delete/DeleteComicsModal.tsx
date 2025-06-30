import Modal from 'Components/Modal/Modal';
import DeleteComicsModalContent from './DeleteComicsModalContent';

interface DeleteComicsModalProps {
    isOpen: boolean;
    comicsIds: number[];
    onModalClose(): void;
}

function DeleteComicsModal(props: DeleteComicsModalProps) {
    const { isOpen, comicsIds, onModalClose } = props;

    return (
        <Modal isOpen={isOpen} onModalClose={onModalClose}>
            <DeleteComicsModalContent comicsIds={comicsIds} onModalClose={onModalClose} />
        </Modal>
    );
}

export default DeleteComicsModal;
