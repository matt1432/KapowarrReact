import Modal from 'Components/Modal/Modal';
import VolumeIndexPosterOptionsModalContent from './VolumeIndexPosterOptionsModalContent';

interface VolumeIndexPosterOptionsModalProps {
    isOpen: boolean;
    onModalClose(...args: unknown[]): unknown;
}

function VolumeIndexPosterOptionsModal({
    isOpen,
    onModalClose,
}: VolumeIndexPosterOptionsModalProps) {
    return (
        <Modal isOpen={isOpen} onModalClose={onModalClose}>
            <VolumeIndexPosterOptionsModalContent onModalClose={onModalClose} />
        </Modal>
    );
}

export default VolumeIndexPosterOptionsModal;
