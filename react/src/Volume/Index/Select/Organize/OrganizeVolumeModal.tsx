import Modal from 'Components/Modal/Modal';
import OrganizeVolumeModalContent from './OrganizeVolumeModalContent';

interface OrganizeVolumeModalProps {
    isOpen: boolean;
    volumeIds: number[];
    onModalClose: () => void;
}

function OrganizeVolumeModal(props: OrganizeVolumeModalProps) {
    const { isOpen, onModalClose, ...otherProps } = props;

    return (
        <Modal isOpen={isOpen} onModalClose={onModalClose}>
            <OrganizeVolumeModalContent {...otherProps} onModalClose={onModalClose} />
        </Modal>
    );
}

export default OrganizeVolumeModal;
