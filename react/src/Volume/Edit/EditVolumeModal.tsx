// TODO:
// IMPORTS

// React
import { useCallback } from 'react';

// Redux
import { useDispatch } from 'react-redux';
// import { clearPendingChanges } from 'Store/Actions/baseActions';

// General Components
import Modal from 'Components/Modal/Modal';

// Specific Components
import EditVolumeModalContent, { type EditVolumeModalContentProps } from './EditVolumeModalContent';

// Types
interface EditVolumeModalProps extends EditVolumeModalContentProps {
    isOpen: boolean;
}

// IMPLEMENTATIONS

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
