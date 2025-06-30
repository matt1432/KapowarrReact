import Modal from 'Components/Modal/Modal';
import ComicsIndexPosterOptionsModalContent from './ComicsIndexPosterOptionsModalContent';

interface ComicsIndexPosterOptionsModalProps {
    isOpen: boolean;
    onModalClose(...args: unknown[]): unknown;
}

function ComicsIndexPosterOptionsModal({
    isOpen,
    onModalClose,
}: ComicsIndexPosterOptionsModalProps) {
    return (
        <Modal isOpen={isOpen} onModalClose={onModalClose}>
            <ComicsIndexPosterOptionsModalContent onModalClose={onModalClose} />
        </Modal>
    );
}

export default ComicsIndexPosterOptionsModal;
