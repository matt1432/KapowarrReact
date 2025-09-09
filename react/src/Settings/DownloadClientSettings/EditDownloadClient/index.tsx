// TODO:
import { useCallback } from 'react';
import Modal from 'Components/Modal/Modal';
import { sizes } from 'Helpers/Props';
// import { clearPendingChanges } from 'Store/Actions/baseActions';
// import { cancelSaveDownloadClient, cancelTestDownloadClient } from 'Store/Actions/settingsActions';
import EditDownloadClientModalContent, {
    type EditDownloadClientModalContentProps,
} from './EditDownloadClientModalContent';

interface EditDownloadClientModalProps extends EditDownloadClientModalContentProps {
    isOpen: boolean;
}

function EditDownloadClientModal({
    isOpen,
    onModalClose,
    ...otherProps
}: EditDownloadClientModalProps) {
    const handleModalClose = useCallback(() => {
        // dispatch(clearPendingChanges({ section }));
        // dispatch(cancelTestDownloadClient({ section }));
        // dispatch(cancelSaveDownloadClient({ section }));

        onModalClose();
    }, [onModalClose]);

    return (
        <Modal size={sizes.MEDIUM} isOpen={isOpen} onModalClose={handleModalClose}>
            <EditDownloadClientModalContent {...otherProps} onModalClose={handleModalClose} />
        </Modal>
    );
}

export default EditDownloadClientModal;
