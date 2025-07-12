import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import Modal from 'Components/Modal/Modal';
// import { clearPendingChanges } from 'Store/Actions/baseActions';
import EditVolumesModalContent, {
    type EditVolumesModalContentProps,
} from './EditVolumesModalContent';

interface EditVolumesModalProps extends EditVolumesModalContentProps {
    isOpen: boolean;
}

function EditVolumesModal({ isOpen, onModalClose, ...otherProps }: EditVolumesModalProps) {
    const dispatch = useDispatch();

    const handleModalClose = useCallback(() => {
        // dispatch(clearPendingChanges({ section: 'volumes' }));
        onModalClose();
    }, [dispatch, onModalClose]);

    return (
        <Modal isOpen={isOpen} onModalClose={handleModalClose}>
            <EditVolumesModalContent {...otherProps} onModalClose={handleModalClose} />
        </Modal>
    );
}

export default EditVolumesModal;
