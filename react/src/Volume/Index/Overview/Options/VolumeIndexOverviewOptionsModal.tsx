import Modal from 'Components/Modal/Modal';
import VolumeIndexOverviewOptionsModalContent from './VolumeIndexOverviewOptionsModalContent';

interface VolumeIndexOverviewOptionsModalProps {
    isOpen: boolean;
    onModalClose(...args: unknown[]): void;
}

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
