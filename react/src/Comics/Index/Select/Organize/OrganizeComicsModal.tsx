import Modal from 'Components/Modal/Modal';
import OrganizeComicsModalContent from './OrganizeComicsModalContent';

interface OrganizeComicsModalProps {
    isOpen: boolean;
    comicsIds: number[];
    onModalClose: () => void;
}

function OrganizeComicsModal(props: OrganizeComicsModalProps) {
    const { isOpen, onModalClose, ...otherProps } = props;

    return (
        <Modal isOpen={isOpen} onModalClose={onModalClose}>
            <OrganizeComicsModalContent {...otherProps} onModalClose={onModalClose} />
        </Modal>
    );
}

export default OrganizeComicsModal;
