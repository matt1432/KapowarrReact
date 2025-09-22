// IMPORTS

// General Components
import Modal from 'Components/Modal/Modal';

// Specific Components
import VolumeIndexPosterOptionsModalContent from './VolumeIndexPosterOptionsModalContent';

// Types
interface VolumeIndexPosterOptionsModalProps {
    isOpen: boolean;
    onModalClose(...args: unknown[]): unknown;
}

// IMPLEMENTATIONS

export default function VolumeIndexPosterOptionsModal({
    isOpen,
    onModalClose,
}: VolumeIndexPosterOptionsModalProps) {
    return (
        <Modal isOpen={isOpen} onModalClose={onModalClose}>
            <VolumeIndexPosterOptionsModalContent onModalClose={onModalClose} />
        </Modal>
    );
}
