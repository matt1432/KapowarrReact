import Modal from 'Components/Modal/Modal';
import VolumesIndexOverviewOptionsModalContent from './VolumesIndexOverviewOptionsModalContent';

interface VolumesIndexOverviewOptionsModalProps {
    isOpen: boolean;
    onModalClose(...args: unknown[]): void;
}

function VolumesIndexOverviewOptionsModal({
    isOpen,
    onModalClose,
    ...otherProps
}: VolumesIndexOverviewOptionsModalProps) {
    return (
        <Modal isOpen={isOpen} onModalClose={onModalClose}>
            <VolumesIndexOverviewOptionsModalContent {...otherProps} onModalClose={onModalClose} />
        </Modal>
    );
}

export default VolumesIndexOverviewOptionsModal;
