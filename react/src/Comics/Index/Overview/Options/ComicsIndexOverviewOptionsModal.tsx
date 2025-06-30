import Modal from 'Components/Modal/Modal';
import ComicsIndexOverviewOptionsModalContent from './ComicsIndexOverviewOptionsModalContent';

interface ComicsIndexOverviewOptionsModalProps {
    isOpen: boolean;
    onModalClose(...args: unknown[]): void;
}

function ComicsIndexOverviewOptionsModal({
    isOpen,
    onModalClose,
    ...otherProps
}: ComicsIndexOverviewOptionsModalProps) {
    return (
        <Modal isOpen={isOpen} onModalClose={onModalClose}>
            <ComicsIndexOverviewOptionsModalContent {...otherProps} onModalClose={onModalClose} />
        </Modal>
    );
}

export default ComicsIndexOverviewOptionsModal;
