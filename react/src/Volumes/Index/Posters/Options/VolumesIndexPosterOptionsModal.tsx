import Modal from 'Components/Modal/Modal';
import VolumesIndexPosterOptionsModalContent from './VolumesIndexPosterOptionsModalContent';

interface VolumesIndexPosterOptionsModalProps {
    isOpen: boolean;
    onModalClose(...args: unknown[]): unknown;
}

function VolumesIndexPosterOptionsModal({
    isOpen,
    onModalClose,
}: VolumesIndexPosterOptionsModalProps) {
    return (
        <Modal isOpen={isOpen} onModalClose={onModalClose}>
            <VolumesIndexPosterOptionsModalContent onModalClose={onModalClose} />
        </Modal>
    );
}

export default VolumesIndexPosterOptionsModal;
