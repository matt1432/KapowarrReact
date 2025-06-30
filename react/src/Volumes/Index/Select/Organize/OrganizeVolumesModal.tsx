import Modal from 'Components/Modal/Modal';
import OrganizeVolumesModalContent from './OrganizeVolumesModalContent';

interface OrganizeVolumesModalProps {
    isOpen: boolean;
    volumesIds: number[];
    onModalClose: () => void;
}

function OrganizeVolumesModal(props: OrganizeVolumesModalProps) {
    const { isOpen, onModalClose, ...otherProps } = props;

    return (
        <Modal isOpen={isOpen} onModalClose={onModalClose}>
            <OrganizeVolumesModalContent {...otherProps} onModalClose={onModalClose} />
        </Modal>
    );
}

export default OrganizeVolumesModal;
