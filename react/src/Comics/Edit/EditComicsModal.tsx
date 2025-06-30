import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import Modal from 'Components/Modal/Modal';
// import { clearPendingChanges } from 'Store/Actions/baseActions';
import EditComicsModalContent, { type EditComicsModalContentProps } from './EditComicsModalContent';

interface EditComicsModalProps extends EditComicsModalContentProps {
    isOpen: boolean;
}

function EditComicsModal({ isOpen, onModalClose, ...otherProps }: EditComicsModalProps) {
    const dispatch = useDispatch();

    const handleModalClose = useCallback(() => {
        // dispatch(clearPendingChanges({ section: 'comics' }));
        onModalClose();
    }, [dispatch, onModalClose]);

    return (
        <Modal isOpen={isOpen} onModalClose={handleModalClose}>
            <EditComicsModalContent {...otherProps} onModalClose={handleModalClose} />
        </Modal>
    );
}

export default EditComicsModal;
