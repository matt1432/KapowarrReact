// TODO:
import Modal from 'Components/Modal/Modal';
import AddDownloadClientModalContent, {
    type AddDownloadClientModalContentProps,
} from './AddDownloadClientModalContent';

interface AddDownloadClientModalProps extends AddDownloadClientModalContentProps {
    isOpen: boolean;
}

function AddDownloadClientModal({
    isOpen,
    onModalClose,
    ...otherProps
}: AddDownloadClientModalProps) {
    return (
        <Modal isOpen={isOpen} onModalClose={onModalClose}>
            <AddDownloadClientModalContent {...otherProps} onModalClose={onModalClose} />
        </Modal>
    );
}

export default AddDownloadClientModal;
