// IMPORTS

// General Components
import Modal from 'Components/Modal/Modal';

// Specific Components
import OrganizeVolumeModalContent from './OrganizeVolumeModalContent';

// Types
interface OrganizeVolumeModalProps {
    isOpen: boolean;
    volumeIds: number[];
    onModalClose: () => void;
}

// IMPLEMENTATIONS

function OrganizeVolumeModal(props: OrganizeVolumeModalProps) {
    const { isOpen, onModalClose, ...otherProps } = props;

    return (
        <Modal isOpen={isOpen} onModalClose={onModalClose}>
            <OrganizeVolumeModalContent {...otherProps} onModalClose={onModalClose} />
        </Modal>
    );
}

export default OrganizeVolumeModal;
