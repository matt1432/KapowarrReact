import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import Modal from 'Components/Modal/Modal';
// import { clearPendingChanges } from 'Store/Actions/baseActions';
import EditVolumeModalContent, {
    type EditVolumeModalContentProps,
} from './EditVolumeModalContent';

interface EditVolumeModalProps extends EditVolumeModalContentProps {
    isOpen: boolean;
}

function EditVolumeModal({ isOpen, onModalClose, ...otherProps }: EditVolumeModalProps) {
    const dispatch = useDispatch();

    const handleModalClose = useCallback(() => {
        // dispatch(clearPendingChanges({ section: 'volumes' }));
        onModalClose();
    }, [dispatch, onModalClose]);

    return (
        <Modal isOpen={isOpen} onModalClose={handleModalClose}>
            <EditVolumeModalContent {...otherProps} onModalClose={handleModalClose} />
        </Modal>
    );
}

export default EditVolumeModal;
