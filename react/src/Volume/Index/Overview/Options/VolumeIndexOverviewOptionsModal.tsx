// IMPORTS

// General Components
import Modal from 'Components/Modal/Modal';

// Specific Components
import VolumeIndexOverviewOptionsModalContent from './VolumeIndexOverviewOptionsModalContent';

// Types
interface VolumeIndexOverviewOptionsModalProps {
    isOpen: boolean;
    onModalClose(...args: unknown[]): void;
}

// IMPLEMENTATIONS

function VolumeIndexOverviewOptionsModal({
    isOpen,
    onModalClose,
    ...otherProps
}: VolumeIndexOverviewOptionsModalProps) {
    return (
        <Modal isOpen={isOpen} onModalClose={onModalClose}>
            <VolumeIndexOverviewOptionsModalContent {...otherProps} onModalClose={onModalClose} />
        </Modal>
    );
}

export default VolumeIndexOverviewOptionsModal;
